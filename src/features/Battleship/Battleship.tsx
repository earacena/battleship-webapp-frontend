import React, { useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  Board,
  Cell,
  CellProps,
  DraggablePiece,
  PieceProps,
} from "./components";
import { DragEndEvent, DragStartEvent } from "@dnd-kit/core/dist/types";

type Position = {
  y: number;
  x: number;
};

type MovingPieceProps = {
  movingPieceX: number;
  movingPieceY: number;
  movingPieceSize: number;
  movingPieceVertical: boolean;
};

const generateBoard = (boardSize: number): CellProps[][] => {
  // Create multidimensional array
  const board: CellProps[][] = Array.from(
    Array(boardSize),
    () => new Array(boardSize)
  );

  // Populate array
  for (let y = 0; y < boardSize; ++y) {
    for (let x = 0; x < boardSize; ++x) {
      board[y][x] = {
        id: `${y}-${x}`,
        x,
        y,
        occupied: false,
      };
    }
  }

  return board;
};

const generatePieces = (
  boardSize: number,
  gridSize: number,
  setOccupiedPositions: (value: React.SetStateAction<boolean[][]>) => void
): (PieceProps | undefined)[][] => {
  const pieces: (PieceProps | undefined)[][] = Array.from(
    Array(boardSize),
    () => new Array(boardSize)
  );

  for (let y = 0; y < boardSize; ++y) {
    for (let x = 0; x < boardSize; ++x) {
      if (y === 0 && x >= 0 && x < 5) {
        pieces[y][x] = {
          id: `p-${y}-${x}`,
          size: 0,
          type: "",
          position: { x, y },
          vertical: true,
          gridSize,
        };
      }
    }
  }
  if (pieces[0][0]) {
    pieces[0][0] = { ...pieces[0][0], size: 5, type: "carrier" };

    for (let i = 0; i < pieces[0][0].size; ++i) {
      setOccupiedPositions((prevPositions) => {
        prevPositions[i][0] = true;
        return prevPositions;
      });
    }
  }
  if (pieces[0][1]) {
    pieces[0][1] = { ...pieces[0][1], size: 4, type: "battleship" };

    for (let i = 0; i < pieces[0][1].size; ++i) {
      setOccupiedPositions((prevPositions) => {
        prevPositions[i][1] = true;
        return prevPositions;
      });
    }
  }
  if (pieces[0][2]) {
    pieces[0][2] = { ...pieces[0][2], size: 3, type: "cruiser" };

    for (let i = 0; i < pieces[0][2].size; ++i) {
      setOccupiedPositions((prevPositions) => {
        prevPositions[i][2] = true;
        return prevPositions;
      });
    }
  }
  if (pieces[0][3]) {
    pieces[0][3] = { ...pieces[0][3], size: 3, type: "submarine" };

    for (let i = 0; i < pieces[0][3].size; ++i) {
      setOccupiedPositions((prevPositions) => {
        prevPositions[i][3] = true;
        return prevPositions;
      });
    }
  }
  if (pieces[0][4]) {
    pieces[0][4] = { ...pieces[0][4], size: 2, type: "destroyer" };

    for (let i = 0; i < pieces[0][4].size; ++i) {
      setOccupiedPositions((prevPositions) => {
        prevPositions[i][4] = true;
        return prevPositions;
      });
    }
  }

  return pieces;
};

const generateOccupiedPositions = (boardSize: number): boolean[][] => {
  const occupiedPositions: boolean[][] = Array.from(
    Array(boardSize),
    () => new Array(boardSize)
  );

  for (let y = 0; y < boardSize; ++y) {
    for (let x = 0; x < boardSize; ++x) {
      occupiedPositions[y][x] = false;
    }
  }

  return occupiedPositions;
};

const canMove = (
  {
    movingPieceX,
    movingPieceY,
    movingPieceSize,
    movingPieceVertical,
  }: MovingPieceProps,
  newPosition: Position,
  occupiedPositions: boolean[][]
) => {
  if (movingPieceVertical) {
    // check occupied positions vertically
    if (movingPieceSize + newPosition.y > occupiedPositions.length) {
      return false;
    }

    for (let i = newPosition.y; i < movingPieceSize + newPosition.y; ++i) {
      if (
        occupiedPositions[i][newPosition.x] &&
        !(
          movingPieceY <= i &&
          i <= movingPieceY + movingPieceSize &&
          newPosition.x === movingPieceX
        )
      ) {
        return false;
      }
    }
  } else {
    // check occupied positions horizontally
    if (movingPieceSize + newPosition.x > occupiedPositions.length) {
      return false;
    }

    for (let i = newPosition.x; i < movingPieceSize + newPosition.x; ++i) {
      if (
        occupiedPositions[newPosition.y][i] &&
        !(
          movingPieceX <= i &&
          i <= movingPieceX + movingPieceSize &&
          newPosition.y === movingPieceY
        )
      ) {
        return false;
      }
    }
  }

  return true;
};

function Battleship() {
  const boardSize: number = 10;
  const gridSize: number = 50;

  const [board] = useState(() => generateBoard(boardSize));
  const [occupiedPositions, setOccupiedPositions] = useState<boolean[][]>(() =>
    generateOccupiedPositions(boardSize)
  );
  const [pieces, setPieces] = useState(() =>
    generatePieces(boardSize, gridSize, setOccupiedPositions)
  );
  const [movingPiece, setMovingPiece] = useState<PieceProps | null>(null);
  const mouseSensor = useSensor(MouseSensor, {});
  const touchSensor = useSensor(TouchSensor, {});
  const keyboardSensor = useSensor(KeyboardSensor, {});
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

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
      return;
    }

    const { x: movingPieceX, y: movingPieceY } = movingPiece.position;
    const { vertical: movingPieceVertical, size: movingPieceSize } =
      movingPiece;
    const [cellY, cellX] = event.over.id.toString().split("-").map(Number);
    const possiblyExistingPiece = pieces[cellY][cellX];
    setMovingPiece(null);

    if (
      event.over &&
      !possiblyExistingPiece &&
      canMove(
        { movingPieceX, movingPieceY, movingPieceSize, movingPieceVertical },
        { y: cellY, x: cellX },
        occupiedPositions
      )
    ) {
      console.log("can move");
      // Move piece
      const newPiece: PieceProps = {
        ...movingPiece,
        position: { x: cellX, y: cellY },
      };

      const newPieces = pieces.map((row) => row.slice());

      delete newPieces[movingPieceY][movingPieceX];
      newPieces[cellY][cellX] = newPiece;

      setPieces(newPieces);

      // Unoccupy old positions
      setOccupiedPositions((prevOccupiedPositions) => {
        if (movingPieceVertical) {
          for (let i = movingPieceY; i < movingPieceY + movingPiece.size; ++i) {
            prevOccupiedPositions[i][movingPieceX] = false;
          }
        } else {
          for (let i = movingPieceX; i < movingPieceX + movingPiece.size; ++i) {
            prevOccupiedPositions[movingPieceY][i] = false;
          }
        }

        // Occupy new positions
        if (movingPieceVertical) {
          for (let i = cellY; i < cellY + movingPieceSize; ++i) {
            prevOccupiedPositions[i][cellX] = true;
          }
        } else {
          for (let i = cellX; i < cellX + movingPieceSize; ++i) {
            prevOccupiedPositions[cellY][i] = true;
          }
        }

        return prevOccupiedPositions;
      });
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
            const occupied = occupiedPositions[y][x];
            if (pieces[y][x]) {
              const piece = pieces ? pieces[y][x] : null;
              if (piece) {
                return (
                  <Cell key={cell.id} {...cell} occupied={true}>
                    <DraggablePiece key={piece.id} {...piece} />
                  </Cell>
                );
              }
            }
            return <Cell key={cell.id} {...cell} occupied={occupied} />;
          })
        )}
      </Board>
    </DndContext>
  );
}

export default Battleship;
