import React, { useState } from 'react';
import { Board, Cell, CellProps } from './components';

const generateBoard = (size: number): CellProps[][] => {
  // Create multidimensional array
  const board: CellProps[][] = Array.from(
    Array(size),
    () => new Array(size),
  );


  // Populate array
  for (let y = 0; y < size; ++y) {
    for (let x = 0; x < size; ++x) {
      board[y][x] = {
        id: `${y}-${x}`,
        x,
        y
      }
    }
  }

  return board;
}

function Battleship() {
  const [board] = useState(() => generateBoard(10));

  return (
    <div>
      <Board>
        {board.map((row, y) => 
          row.map((cell, x) =>
            <Cell
              key={cell.id}
              {...cell}
            />
          )
        )}
      </Board>
    </div>
  );
}

export default Battleship;
