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

function Battleship() {
  const boardSize: number = 10;
  const gridSize: number = 50;

  const [editing, setEditing] = useState<boolean>(true);
  const [board] = useState(() => generateBoard(boardSize));
  const [occupiedPositions, setOccupiedPositions] = useState<boolean[][]>(() =>
    generateOccupiedPositions(boardSize)
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
        <Board size={boardSize} gridSize={gridSize}>
          { board.map((row, y) =>
            row.map((cell, x) => (
              <Cell key={cell.id} {...cell} occupied={occupiedPositions[y][x]} />
            ))
          )}
        </Board>
      }
    </div>
  );
}

export default Battleship;
