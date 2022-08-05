import React, { useState, useMemo } from 'react';
import { DndContext, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { createSnapModifier } from '@dnd-kit/modifiers';
import { Board, Cell, CellProps, DraggablePiece, PieceProps } from './components';
import { DragEndEvent, DragStartEvent } from '@dnd-kit/core/dist/types';

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

const generatePieces = (boardSize: number, gridSize: number): (PieceProps | undefined)[][] => {
  const pieces: (PieceProps | undefined)[][] = Array.from(
    Array(boardSize),
    () => new Array(boardSize),
  );

  for (let y = 0; y < boardSize; ++y) {
    for (let x = 0; x < boardSize; ++x) {
      if (y === 0 && x >= 0 && x < 5) {
        pieces[y][x] = { 
          id: `p-${y}-${x}`,
          size: 0,
          type: '',
          position: { x, y },
          vertical: true,
          gridSize
        };
      }
    }
  }
  if (pieces[0][0]) {
    pieces[0][0] = { ...pieces[0][0], size: 5, type: 'carrier' };
  }
  if (pieces[0][1]) {
    pieces[0][1] = { ...pieces[0][1], size: 4, type: 'battleship' };
  }
  if (pieces[0][2]) {
    pieces[0][2] = { ...pieces[0][2], size: 3, type: 'cruiser' };
  }
  if (pieces[0][3]) {
    pieces[0][3] = { ...pieces[0][3], size: 3, type: 'submarine' };
  }
  if (pieces[0][4]) {
    pieces[0][4] = { ...pieces[0][4], size: 2, type: 'destroyer' };
  }

  return pieces;
};

function Battleship() {
  
  const boardSize: number = 10;
  const gridSize: number = 50;

  const [board] = useState(() => generateBoard(boardSize));
  const [pieces, setPieces] = useState(() => generatePieces(boardSize, gridSize));
  const [movingPiece, setMovingPiece] = useState<PieceProps | null>(null);
  const mouseSensor = useSensor(MouseSensor, {});
  const touchSensor = useSensor(TouchSensor, {});
  const keyboardSensor = useSensor(KeyboardSensor, {});
  const sensors = useSensors(
    mouseSensor,
    touchSensor,
    keyboardSensor,
  );

  const handleOnDragStart = ({ active }: DragStartEvent) => {
    const piece = pieces.reduce<PieceProps | undefined>((acc, row) => {
      return acc ?? row.find((cell) => cell?.id === active.id);
    }, undefined);

    if (piece) {
      setMovingPiece(piece);
    }
  };

  const handleOnDragEnd = (event: DragEndEvent): void => {
    if (!movingPiece?.position || !event.over?.id) {
      console.log(movingPiece, event);
      return;
    }
    console.log('update');
    const { x: movingPieceX, y: movingPieceY } = movingPiece.position;
    const [cellY, cellX] = event.over.id.toString().split('-').map(Number);
    console.log(`[${cellY}, ${cellX}]`);
    const possiblyExistingPiece = pieces[cellY][cellX];
    setMovingPiece(null);

    if (event.over && !possiblyExistingPiece) {
      const newPiece: PieceProps = {
        ...movingPiece,
        position: { x: cellX, y: cellY }
      };

      const newPieces = pieces.map((row) => row.slice());

      delete newPieces[movingPieceY][movingPieceX];
      newPieces[cellY][cellX] = newPiece;

      setPieces(newPieces);
    }
  };

  const handleOnDragCancel = () => {
    setMovingPiece(null);
  };

  return (
    <DndContext 
      sensors={sensors}
      onDragStart={handleOnDragStart}
      onDragCancel={handleOnDragCancel}
      onDragEnd={handleOnDragEnd}
    >
      <Board size={boardSize} gridSize={gridSize}>
        {board.map((row, y) => 
          row.map((cell, x) => {
            if (pieces[y][x]) {
              const piece = pieces ? pieces[y][x] : null;
              if (piece) {
                return (
                  <Cell key={cell.id} {...cell}>
                    <DraggablePiece key={piece.id} {...piece} />
                  </Cell>
                );
              }
            }
            return <Cell key={cell.id} {...cell} />;
        }))}
      </Board>
    </DndContext>
  );
}

export default Battleship;
