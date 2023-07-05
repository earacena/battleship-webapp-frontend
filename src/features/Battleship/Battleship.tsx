import React, { useState, useEffect, useCallback } from "react";
import { CellProps } from "./components";
import { BoardEditor } from "./components/BoardEditor";
import { EndGame } from "./components/EndGame";
import appStyles from "../../app.module.css";
import { Boards } from "./components/Boards";
import logger from "../../util/Logger";

export const generateBoard = (boardSize: number): CellProps[][] => {
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

export const generateOccupiedPositions = (boardSize: number): boolean[][] => {
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
  return Math.floor(
    Math.random() * (Math.floor(max) - Math.ceil(min)) + Math.ceil(min)
  );
};

const generateRandomOccupiedPositions = (boardSize: number): boolean[][] => {
  // Generate random, vertical or horizontal positions, for all 5 pieces
  let occupiedPositions = generateOccupiedPositions(boardSize);
  logger.log(`${occupiedPositions}`);
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
      } else {
        for (let i = x; i < x + pieceSize; ++i) {
          if (occupiedPositions[y][i]) {
            failedCheck = true;
            break;
          }
        }
      }
      if (failedCheck) {
        continue;
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
      logger.log(`${y}, ${x}`);
    }
  }

  return occupiedPositions;
};

function Battleship() {
  // BoardEditor states
  const boardSize: number = 10;
  const gridSize: number = 50;

  const [editing, setEditing] = useState<boolean>(true);
  const [board, setBoard] = useState(() => generateBoard(boardSize));
  const [opponentBoard, setOpponentBoard] = useState(() =>
    generateBoard(boardSize)
  );
  const [occupiedPositions, setOccupiedPositions] = useState<boolean[][]>(() =>
    generateOccupiedPositions(boardSize)
  );

  // Game states
  const [turn, setTurn] = useState<string>('first');
  const [opponentOccupiedPositions] = useState<boolean[][]>(() =>
    generateRandomOccupiedPositions(boardSize)
  );

  const [hitPositions, setHitPositions] = useState<boolean[][]>(() =>
    generateOccupiedPositions(boardSize)
  );
  const [opponentHitPositions, setOpponentHitPositions] = useState<boolean[][]>(
    () => generateOccupiedPositions(boardSize)
  );
  const [playerScore, setPlayerScore] = useState<number>(0);
  const [opponentScore, setOpponentScore] = useState<number>(0);
  const [playerTurn] = useState<string>('first');

  // EndGame states
  const winner: string | undefined = (playerScore === 17 || opponentScore === 17) 
    ? (
      playerScore === 17
        ? "player"
        : "opponent"
    ) : undefined;

  const gameEnded: boolean = winner !== undefined;

  const resetGame = () => {
    // Set all the states back to default
    setPlayerScore(0);
    setOpponentScore(0);
    setBoard(generateBoard(boardSize));
    setOpponentBoard(generateBoard(boardSize));
    setOccupiedPositions(generateOccupiedPositions(boardSize));
    setHitPositions(generateOccupiedPositions(boardSize));
    setOpponentHitPositions(generateOccupiedPositions(boardSize));
    setEditing(true);
    setTurn('first');
  };

  const canFire = useCallback(
    (y: number, x: number) => {
      if (playerTurn === turn) {
        // Check opponent's (bot) board for valid target
        if (opponentHitPositions[y][x]) {
          return false;
        }
      } else {
        // Check player's board for valid target
        if (hitPositions[y][x]) {
          return false;
        }
      }

      return true;
    },
    [hitPositions, opponentHitPositions, playerTurn, turn]
  );

  useEffect(() => {
    if (playerTurn !== turn) {
      // Fire on given position on player's board
      let y: number = generateRandomValue(0, boardSize);
      let x: number = generateRandomValue(0, boardSize);

      logger.log(`randomly firing @ y: ${y} x: ${x}`);
      while (!canFire(y, x)) {
        y = generateRandomValue(0, boardSize);
        x = generateRandomValue(0, boardSize);
      }
      if (occupiedPositions[y][x]) {
        setOpponentScore((score) => score + 1);
      }
      setHitPositions((prevHitPositions) => {
        prevHitPositions[y][x] = true;
        return prevHitPositions;
      });

      setTurn('first');
    }
  }, [turn, playerTurn, canFire, occupiedPositions]);

  const playTurn = (y: number, x: number) => {
    logger.log(`${playerTurn} firing at y: ${y}, x: ${x}`);

    if (playerTurn === turn) {
      // Allow player to fire
      if (canFire(y, x)) {
        if (opponentOccupiedPositions[y][x]) {
          setPlayerScore((score) => score + 1);
        }
        setOpponentHitPositions((prevOpponentHitPositions) => {
          prevOpponentHitPositions[y][x] = true;
          return prevOpponentHitPositions;
        });
      } else {
        return;
      }

      setTurn('second');
    } else {
      return;
    }
  };

  return (
    <div
      className={appStyles.FadeInComponentSlowly}
    >
      {editing && (
        <BoardEditor
          board={board}
          boardSize={boardSize}
          gridSize={gridSize}
          occupiedPositions={occupiedPositions}
          setOccupiedPositions={setOccupiedPositions}
          setEditing={setEditing}
          editing={editing}
        />
      )}
      {winner && (
        <EndGame
          winner={winner}
          loser={winner === "player" ? "bot" : "player"}
          resetGame={resetGame}
        />
      )}
      {!editing && !gameEnded && (
        <Boards
          turn={turn}
          playerTurn={playerTurn}
          playerScore={playerScore}
          boardSize={boardSize}
          gridSize={gridSize}
          board={board}
          occupiedPositions={occupiedPositions}
          hitPositions={hitPositions}
          opponentScore={opponentScore}
          opponentBoard={opponentBoard}
          opponentOccupiedPositions={opponentOccupiedPositions}
          opponentHitPositions={opponentHitPositions}
          playTurn={playTurn}
        />
      )}
    </div>
  );
}

export default Battleship;
