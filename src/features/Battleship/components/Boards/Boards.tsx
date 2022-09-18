import React, { useContext } from "react";
import { ThemeContext } from "../../../../App";
import { Board } from "../Board";
import { Cell } from "../Cell";
import { CellProps } from "../Cell";
import styles from "./styles/Boards.module.css";

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
  const { theme } = useContext(ThemeContext);

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
        <span style={{ 
          fontWeight: '500',
          fontSize: "30px",
          color: theme === 'light' ? '#42855B' : "#A7D129",
        }}>
          Your turn
        </span>
      ) : (
        <span style={{
          fontWeight: '300',
          fontSize: "30px",
          color: theme === 'light' ? "gray" : "white",
        }}>
          Waiting for opponent...
        </span>
      )}
      <div className={styles.Boards}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span style={{ 
            fontWeight: 900,
            color: theme === 'light' ? '#293241' : 'white',
            fontSize: '20px'
          } as React.CSSProperties}>
            {`Player: ${playerScore}`}
          </span>
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
          <span style={{
            fontWeight: 900,
            color: theme === 'light' ? '#293241' : 'white',
            fontSize: '20px',
          } as React.CSSProperties}>
            {`Opponent: ${opponentScore}`}
          </span>
          <div className={turn === playerTurn ? styles.BlinkingBackground : ''}>
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
