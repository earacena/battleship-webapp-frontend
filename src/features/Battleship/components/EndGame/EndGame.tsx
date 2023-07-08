import React, { useContext } from "react";
import { ThemeContext } from "../../../../App";
import styles from '../../../../app.module.css';

type EndGameProps = {
  winner: string;
  loser: string;
  resetGame: () => void;
};

function EndGame({ winner, loser, resetGame }: EndGameProps) {
  
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={styles.FadeInComponentSlowly}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <span style={{
        fontSize: "40px",
        color: theme === 'light' ? '#212D40' : 'white',
      }}>
        <span style={{ color: "green" }}>{winner}</span> has sunk all of{" "}
        <span style={{ color: "red" }}>{loser}</span>'s ships!
      </span>
      <button style={{ fontSize: "30px" }} onClick={resetGame}>
        Play Again
      </button>
    </div>
  );
}

export default EndGame;
