import React from 'react';

type EndGameProps = {
  winner: string,
  opponent: string,
  gameResult: string,
  resetGame: () => void,
};

function EndGame({ winner, opponent, gameResult, resetGame }: EndGameProps) {
  const winningMessage: string = `${winner} has sunk all of ${opponent}'s ships!`;
  const drawMessage: string = "Both players at a draw!";

  const message = gameResult === 'win' ? winningMessage : drawMessage;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <span style={{ fontSize: '40px'}}>
        {message}
      </span>
      <button style={{fontSize: '30px'}} onClick={resetGame}>Play Again</button>
    </div>
  );
};

export default EndGame;