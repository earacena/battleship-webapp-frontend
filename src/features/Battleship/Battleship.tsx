import React, { useState, useMemo } from 'react';
import { defaultCoordinates, DndContext, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { createSnapModifier } from '@dnd-kit/modifiers';
import { Board, CellProps, DraggablePiece, DraggablePieceProps } from './components';
import { Coordinates, DragEndEvent, DragStartEvent } from '@dnd-kit/core/dist/types';

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

const generatePieces = (boardSize: number, gridSize: number): (DraggablePieceProps | undefined)[][] => {
  const pieces: (DraggablePieceProps | undefined)[][] = Array.from(
    Array(boardSize),
    () => new Array(boardSize),
  );

  for (let y = 0; y < boardSize; ++y) {
    for (let x = 0; x < boardSize; ++x) {
      if (y === 0 && x >= 0 && x < 5) {
        pieces[y][x] = { id: `p-${y}-${x}`, size: 0, type: '', top: y * gridSize, left: x * gridSize, x, y, vertical: true, gridSize};
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
  const [pieces, setPieces] = useState(() => generatePieces(boardSize, gridSize));

  const [movingPiece, setMovingPiece] = useState<DraggablePieceProps | undefined>(undefined);

  const [coordinates, setCoordinates] = useState<Coordinates>(defaultCoordinates);
  const mouseSensor = useSensor(MouseSensor, {});
  const touchSensor = useSensor(TouchSensor, {});
  const keyboardSensor = useSensor(KeyboardSensor, {});
  const sensors = useSensors(
    mouseSensor,
    touchSensor,
    keyboardSensor,
  );

  const snapToGrid = useMemo(() => createSnapModifier(gridSize), [gridSize]);

  const handleOnDragStart = ({ active }: DragStartEvent) => {
    for (let y = 0; y < boardSize; ++y) {
      for (let x = 0; x < boardSize; ++x) {
        const piece = pieces ? pieces[y][x] : undefined;
        if (piece !== undefined && piece.id === active.id) {
          setMovingPiece(pieces[y][x]);
          setCoordinates({ x, y });
        }
      }
    }
  }

  const handleOnDragEnd = ({ delta }: DragEndEvent): void => {
    setCoordinates(({ x, y }) => {
      return {
        x: coordinates.x + delta.x,
        y: coordinates.y + delta.y,
      }
    });
    setPieces((prevPieces) => {
      if (movingPiece !== undefined) {
        const pieces = prevPieces ? prevPieces : undefined;
        if (pieces !== undefined) {
          const piece = pieces[movingPiece.y][movingPiece.x] ? pieces[movingPiece.y][movingPiece.x] : undefined;
          if (piece !== undefined) {
            pieces[coordinates.y][coordinates.x] = {
              ...piece,
              x: coordinates.x,
              y: coordinates.y,
            };

            pieces[movingPiece.y][movingPiece.x] = undefined;
            return pieces;
          }
        }
      }
      return prevPieces;
    });

    setMovingPiece(undefined);
    setCoordinates(defaultCoordinates);
  };

  return (
    <DndContext 
      modifiers={[snapToGrid]}
      sensors={sensors}
      onDragStart={handleOnDragStart}
      onDragEnd={handleOnDragEnd}
    >
      {board.map((row, y) => 
        row.map((cell, x) => {
          if (pieces[y][x]) {
            const piece = pieces ? pieces[y][x] : undefined;
            if (piece !== undefined) {
              return <DraggablePiece key={piece.id} {...piece} />;
            }
            return undefined;
          }
          return undefined;
        }))}
      <Board size={boardSize} gridSize={gridSize} />
    </DndContext>
  );
}

export default Battleship;
