import React, { useState, useEffect } from "react";
import { DraggablePiece, PieceProps } from "../Piece";
import { Cell, CellProps } from "../Cell";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import Board from "../Board/Board";
import { Button } from "../../../../components";
import { GrRotateLeft } from "react-icons/gr";
import { BsCheck2 } from "react-icons/bs";

type BoardEditorProps = {
  board: CellProps[][];
  boardSize: number;
  gridSize: number;
  occupiedPositions: boolean[][];
  setOccupiedPositions: (value: React.SetStateAction<boolean[][]>) => void;
  editing: boolean;
  setEditing: (value: React.SetStateAction<boolean>) => void;
};

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

const canRotate = (
  piece: PieceProps,
  occupiedPositions: boolean[][]
): boolean => {
  if (piece.vertical) {
    if (piece.position.x + piece.size > occupiedPositions.length) {
      return false;
    }

    // check if horizonal position unoccupied
    for (let i = piece.position.x + 1; i < piece.position.x + piece.size; ++i) {
      if (occupiedPositions[piece.position.y][i]) {
        return false;
      }
    }
  } else {
    if (piece.position.y + piece.size > occupiedPositions.length) {
      return false;
    }
    // check if vetical position unoccupied
    for (let i = piece.position.y + 1; i < piece.position.y + piece.size; ++i) {
      if (occupiedPositions[i][piece.position.x]) {
        return false;
      }
    }
  }
  return true;
};

function BoardEditor({
  board,
  boardSize,
  gridSize,
  occupiedPositions,
  setOccupiedPositions,
  editing,
  setEditing,
}: BoardEditorProps) {
  const [pieces, setPieces] = useState<(PieceProps | undefined)[][]>();
  const [movingPiece, setMovingPiece] = useState<PieceProps | null>(null);
  const [selected, setSelected] = useState<PieceProps | null>(null);

  const mouseSensor = useSensor(MouseSensor, {});
  const touchSensor = useSensor(TouchSensor, {});
  const keyboardSensor = useSensor(KeyboardSensor, {});
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  useEffect(() => {
    setPieces(generatePieces(boardSize, gridSize, setOccupiedPositions));
  }, [boardSize, gridSize, setOccupiedPositions]);

  const handleRotate = () => {
    if (selected && canRotate(selected, occupiedPositions) && pieces) {
      setOccupiedPositions((prevOccupiedPositions) => {
        // Unoccupy old positions
        if (selected.vertical) {
          for (
            let i = selected.position.y;
            i < selected.position.y + selected.size;
            ++i
          ) {
            prevOccupiedPositions[i][selected.position.x] = false;
          }
        } else {
          for (
            let i = selected.position.x;
            i < selected.position.x + selected.size;
            ++i
          ) {
            prevOccupiedPositions[selected.position.y][i] = false;
          }
        }

        // Occupy new positions new rotated
        if (selected.vertical) {
          for (
            let i = selected.position.x;
            i < selected.position.x + selected.size;
            ++i
          ) {
            prevOccupiedPositions[selected.position.y][i] = true;
          }
        } else {
          for (
            let i = selected.position.y;
            i < selected.position.y + selected.size;
            ++i
          ) {
            prevOccupiedPositions[i][selected.position.x] = true;
          }
        }
        return prevOccupiedPositions;
      });

      // Update rotated piece
      const newPiece: PieceProps = {
        ...selected,
        vertical: !selected.vertical,
      };
      const newPieces = pieces.map((row) => row.slice());

      delete newPieces[selected.position.y][selected.position.x];
      newPieces[selected.position.y][selected.position.x] = newPiece;

      setPieces(newPieces);
      setSelected(newPiece);
    }
  };

  const handleOnDragStart = ({ active }: DragStartEvent) => {
    if (pieces) {
      const piece = pieces.reduce<PieceProps | undefined>((acc, row) => {
        return acc ?? row.find((cell) => cell?.id === active.id);
      }, undefined);

      if (piece) {
        setMovingPiece(piece);
      }
    }
  };

  const handleOnDragEnd = (event: DragEndEvent): void => {
    if (!movingPiece?.position || !event.over?.id || !pieces) {
      return;
    }

    const { x: movingPieceX, y: movingPieceY } = movingPiece.position;
    const { vertical: movingPieceVertical, size: movingPieceSize } =
      movingPiece;
    const [cellY, cellX] = event.over.id.toString().split("-").map(Number);
    const possiblyExistingPiece = pieces[cellY][cellX];
    setSelected(movingPiece);
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
      // // console.log("can move");
      // Move piece
      const newPiece: PieceProps = {
        ...movingPiece,
        position: { x: cellX, y: cellY },
      };

      const newPieces = pieces.map((row) => row.slice());

      delete newPieces[movingPieceY][movingPieceX];
      newPieces[cellY][cellX] = newPiece;

      setPieces(newPieces);
      setSelected(newPiece);

      setOccupiedPositions((prevOccupiedPositions) => {
        // Unoccupy old positions
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <DndContext
        sensors={sensors}
        onDragStart={handleOnDragStart}
        onDragCancel={handleOnDragCancel}
        onDragEnd={handleOnDragEnd}
      >
        <div>
          <Board size={boardSize} gridSize={gridSize}>
            {board.map((row, y) =>
              row.map((cell, x) => {
                if (pieces && pieces[y][x]) {
                  const piece = pieces ? pieces[y][x] : null;
                  if (piece) {
                    return (
                      <Cell
                        key={cell.id}
                        {...cell}
                        occupied={true}
                        selected={piece.id === selected?.id}
                      >
                        <DraggablePiece key={piece.id} {...piece} />
                      </Cell>
                    );
                  }
                }
                return (
                  <Cell
                    key={cell.id}
                    {...cell}
                    occupied={occupiedPositions[y][x]}
                  />
                );
              })
            )}
          </Board>
        </div>
      </DndContext>
      <div
        style={{ display: "flex", flexDirection: "row" } as React.CSSProperties}
      >
        <Button onClick={handleRotate} disabled={!editing}>
          <GrRotateLeft />
          Rotate selected
        </Button>
        <Button onClick={() => setEditing(false)} disabled={!editing}>
          <BsCheck2 />
          Ready!
        </Button>
      </div>
    </div>
  );
}

export default BoardEditor;
