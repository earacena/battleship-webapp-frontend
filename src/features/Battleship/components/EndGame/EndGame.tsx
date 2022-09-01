import React from 'react';

type EndGameProps = {
  winner: string,
  loser: string,
  gameResult: string,
  resetGame: () => void,
};

function EndGame({ winner, loser, gameResult, resetGame }: EndGameProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <span style={{ fontSize: '40px'}}>
        <span style={{ color: 'green' }}>{winner}</span> has sunk all of <span style={{ color: 'red' }}>{loser}</span>'s ships!
      </span>
      <button style={{fontSize: '30px'}} onClick={resetGame}>Play Again</button>
    </div>
  );
};

export default EndGame;