import React, { useCallback } from "react";
import { Board } from "../Board";
import { Cell } from "../Cell";
import { CellProps } from "../Cell";

type BoardsProps = {
  turn: string;
  playerTurn: string;
  playerScore: number;
  boardSize: number;
  gridSize: number;
  board: CellProps[][];
  occupiedPositions: boolean[][];
  hitPositions: boolean[][];
  opponentScore: number;
  opponentBoard: CellProps[][];
  opponentOccupiedPositions: boolean[][];
  opponentHitPositions: boolean[][];
  playTurn: (y: number, x: number) => void;
};

function Boards({
  turn,
  playerTurn,
  playerScore,
  boardSize,
  gridSize,
  board,
  occupiedPositions,
  hitPositions,
  opponentScore,
  opponentBoard,
  opponentOccupiedPositions,
  opponentHitPositions,
  playTurn,
}: BoardsProps) {
  return (
    <div
      style={
        {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        } as React.CSSProperties
      }
    >
      {turn === playerTurn ? (
        <span style={{ fontSize: "30px", color: "green" }}>Your turn</span>
      ) : (
        <span style={{ fontSize: "30px", color: "gray" }}>
          Opponent's turn...
        </span>
      )}
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {`Player: ${playerScore}`}
          <div>
            <Board size={boardSize} gridSize={gridSize}>
              {board.map((row, y) =>
                row.map((cell, x) => (
                  <Cell
                    key={cell.id}
                    {...cell}
                    occupied={occupiedPositions[y][x]}
                    hit={hitPositions[y][x]}
                  />
                ))
              )}
            </Board>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {`Opponent: ${opponentScore}`}
          <div>
            <Board size={boardSize} gridSize={gridSize}>
              {opponentBoard.map((row, y) =>
                row.map((cell, x) => (
                  <Cell
                    key={cell.id}
                    {...cell}
                    hidden={true}
                    occupied={opponentOccupiedPositions[y][x]}
                    hit={opponentHitPositions[y][x]}
                    playTurn={() => playTurn(y, x)}
                  />
                ))
              )}
            </Board>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Boards;
