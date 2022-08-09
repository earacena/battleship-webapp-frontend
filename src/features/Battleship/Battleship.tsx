import React, { useState } from "react";
import { Cell, CellProps, Board } from "./components";
import { BoardEditor } from "./components/BoardEditor";

const generateBoard = (boardSize: number): CellProps[][] => {
  // Create multidimensional array
  const board: CellProps[][] = Array.from(
    Array(boardSize),
    () => new Array(boardSize)
  );

  // Populate array
  for (let y = 0; y < boardSize; ++y) {
    for (let x = 0; x < boardSize; ++x) {
      board[y][x] = {
        id: `${y}-${x}`,
        x,
        y,
        occupied: false,
        selected: false,
      };
    }
  }

  return board;
};

const generateOccupiedPositions = (boardSize: number): boolean[][] => {
  const occupiedPositions: boolean[][] = Array.from(
    Array(boardSize),
    () => new Array(boardSize)
  );

  for (let y = 0; y < boardSize; ++y) {
    for (let x = 0; x < boardSize; ++x) {
      occupiedPositions[y][x] = false;
    }
  }

  return occupiedPositions;
};

const generateRandomValue = (min: number, max: number): number => {
  return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min)) + Math.ceil(min));
}

const generateRandomOccupiedPositions = (boardSize: number): boolean[][] => {
  // Generate random, vertical or horizontal positions, for all 5 pieces
  let occupiedPositions = generateOccupiedPositions(boardSize);
  console.log(occupiedPositions)
  const pieces = [5, 4, 3, 3, 2];
  let y: number;
  let x: number;
  let vertical: boolean;
  let valid: boolean = false;
  let failedCheck: boolean = false;

  for (const pieceSize of pieces) {
    valid = false;
    while (!valid) {
      failedCheck = false;

      // Pick a random position
      y = generateRandomValue(0, boardSize);
      x = generateRandomValue(0, boardSize);
      vertical = Math.random() >= 0.5;

      // Check if piece is within bounds
      if (x + pieceSize > boardSize) {
        continue;
      }
  
      if (y + pieceSize > boardSize) {
        continue;
      }
  
      // Check if position is valid
      if (vertical) {
        for (let i = y; i < y + pieceSize; ++i) {
          if (occupiedPositions[i][x]) {
            failedCheck = true;
            break;
          }
        }
        if (failedCheck) {
          continue;
        }
      } else {
        for (let i = x; i < x + pieceSize; ++i) {
          if (occupiedPositions[y][i]) {
            failedCheck = true;
            break;
          }
        }
        if (failedCheck) {
          continue;
        }
      }
      
      
      // Position passed checks, add to occupied positions
      if (vertical) {
        for (let i = y; i < y + pieceSize; ++i) {
          occupiedPositions[i][x] = true;
          
        }
      } else {
        for (let i = x; i < x + pieceSize; ++i) {
          occupiedPositions[y][i] = true;
        }
      }
      
      valid = true;
      console.log(y, x);
    }
  }
  
  return occupiedPositions;
}

function Battleship() {
  const boardSize: number = 10;
  const gridSize: number = 50;

  const [editing, setEditing] = useState<boolean>(true);
  const [board] = useState(() => generateBoard(boardSize));
  const [opponentBoard] = useState(() => generateBoard(boardSize));

  const [occupiedPositions, setOccupiedPositions] = useState<boolean[][]>(() =>
    generateOccupiedPositions(boardSize)
  );
  const [opponentOccupiedPositions] = useState<boolean[][]>(() =>
    generateRandomOccupiedPositions(boardSize)
  );

  return (
    <div>
      {editing && (
        <BoardEditor
          board={board}
          boardSize={boardSize}
          gridSize={gridSize}
          occupiedPositions={occupiedPositions}
          setOccupiedPositions={setOccupiedPositions}
          setEditing={setEditing}
        />
      )}
      {!editing &&
      <div>
        <Board size={boardSize} gridSize={gridSize}>
          { board.map((row, y) =>
            row.map((cell, x) => (
              <Cell key={cell.id} {...cell} occupied={occupiedPositions[y][x]} />
            ))
          )}
        </Board>
        <Board size={boardSize} gridSize={gridSize}>
          { opponentBoard.map((row, y) =>
            row.map((cell, x) => (
              <Cell key={cell.id} {...cell} occupied={opponentOccupiedPositions[y][x]} />
            ))
          )}
        </Board>
      </div>
      }
    </div>
  );
}

export default Battleship;
