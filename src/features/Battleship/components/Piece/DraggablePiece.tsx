import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import Piece, { PieceProps } from './Piece';
import { RiShip2Fill } from 'react-icons/ri';

export interface DraggablePieceProps extends PieceProps {
  gridSize: number;
  top: number;
  left: number;
  vertical: boolean;
};

function DraggablePiece(props: DraggablePieceProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id
  });

  let top = props.y * props.gridSize;
  let left = props.x * props.gridSize;
  
  const style: React.CSSProperties = {
    position: 'fixed',
    transform: CSS.Translate.toString(transform),
    top,
    left,
  }

  const {vertical, gridSize,...pieceProps } = props;

  return (
    <Piece
      ref={setNodeRef}
      style={style}
      {...pieceProps}
      {...listeners}
      {...attributes}
    >
      <RiShip2Fill />
    </Piece>
  )
}

export default DraggablePiece;