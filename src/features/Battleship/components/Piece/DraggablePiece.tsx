import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import Piece, { PieceProps } from './Piece';
import { RiShip2Fill } from 'react-icons/ri';

function DraggablePiece(props: PieceProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  }

  return (
    <Piece
      ref={setNodeRef}
      style={style}
      {...props}
      {...listeners}
      {...attributes}
    >
      <RiShip2Fill />
    </Piece>
  )
}

export default DraggablePiece;