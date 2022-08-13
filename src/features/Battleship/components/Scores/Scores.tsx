import React from 'react';

type ScoresProps = {
  playerScore: number,
  opponentScore: number,
};

function Scores({ playerScore, opponentScore }: ScoresProps) {
  return (
    <div>
      {`Player ${playerScore} - ${opponentScore} Opponent`}
    </div>
  );
};

export default Scores;