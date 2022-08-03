import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { RiShip2Fill } from 'react-icons/ri';

export type PieceProps = {
  id: string;
  x: number;
  y: number;
  type: string;
  size: number;
  rotated: boolean;
};

function Piece({ id, type, rotated, x, y }: PieceProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  }

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      <RiShip2Fill />
    </button>
  )
}

export default Piece;