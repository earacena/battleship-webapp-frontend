import React from 'react';

type EndGameProps = {
  winner: string,
  opponent: string,
};

function EndGame({ winner, opponent }: EndGameProps) {
  return (
    <div>
      {`${winner} has sunk all of ${opponent}'s ships!`}
    </div>
  );
};

export default EndGame;