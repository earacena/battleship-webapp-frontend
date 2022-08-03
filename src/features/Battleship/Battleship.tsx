import { DndContext } from '@dnd-kit/core';
import React, { useState } from 'react';
import { Board, CellProps, PieceProps } from './components';

const generateBoard = (boardSize: number): CellProps[][] => {
  // Create multidimensional array
  const board: CellProps[][] = Array.from(
    Array(boardSize),
    () => new Array(boardSize),
  );


  // Populate array
  for (let y = 0; y < boardSize; ++y) {
    for (let x = 0; x < boardSize; ++x) {
      board[y][x] = {
        id: `${y}-${x}`,
        x,
        y
      }
    }
  }

  return board;
}

const generatePieces = (boardSize: number): (PieceProps | undefined)[][] => {
  const pieces: (PieceProps | undefined)[][] = Array.from(
    Array(boardSize),
    () => new Array(boardSize),
  );

  for (let y = 0; y < boardSize; ++y) {
    for (let x = 0; x < boardSize; ++x) {
      if (y === 0 && x >= 0 && x < 5) {
        pieces[y][x] = { id: `p-${y}-${x}`, size: 0, type: '', x, y, rotated: true };
      }
    }
  }
  if (pieces[0][0] !== undefined) {
    pieces[0][0] = { ...pieces[0][0], size: 5, type: 'carrier' };
  }
  if (pieces[0][1] !== undefined) {
    pieces[0][1] = { ...pieces[0][1], size: 4, type: 'battleship' };
  }
  if (pieces[0][2] !== undefined) {
    pieces[0][2] = { ...pieces[0][2], size: 3, type: 'cruiser' };
  }
  if (pieces[0][3] !== undefined) {
    pieces[0][3] = { ...pieces[0][3], size: 3, type: 'submarine' };
  }
  if (pieces[0][4] !== undefined) {
    pieces[0][4] = { ...pieces[0][4], size: 2, type: 'destroyer' };
  }

  return pieces;
};


function Battleship() {
  
  const boardSize: number = 10;
  const gridSize: number = 50;

  const [board] = useState(() => generateBoard(boardSize));
  const [pieces, setPieces] = useState(() => generatePieces(boardSize));
  const [isDragging, setIsDragging] = useState(false);
  const [movingPiece, setMovingPiece] = useState<PieceProps | undefined>(undefined);
 

  return (
    <DndContext>
      <Board size={boardSize} gridSize={gridSize} />
    </DndContext>
  );
}

export default Battleship;
