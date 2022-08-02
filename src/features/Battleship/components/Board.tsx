import React from 'react';

type BoardProps = {
  children: React.ReactNode;
};

function Board({ children }: BoardProps) {
  return (
    <div>
      {children}
    </div>
  )
}

export default Board;