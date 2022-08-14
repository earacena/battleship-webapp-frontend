import React from 'react';

type EndGameProps = {
  winner: string,
  opponent: string,
  resetGame: () => void,
};

function EndGame({ winner, opponent, resetGame }: EndGameProps) {
  return (
    <div>
      {`${winner} has sunk all of ${opponent}'s ships!`}
      <button onClick={resetGame}>Play Again</button>
    </div>
  );
};

export default EndGame;