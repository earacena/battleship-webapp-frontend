import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import Piece, { PieceProps } from './Piece';
import { GrDrag } from 'react-icons/gr';
import styles from './Piece.module.css';

function DraggablePiece(props: PieceProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id
  });
  
  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    flexDirection: props.vertical ? 'column' : 'row',
    cursor: 'move',
  }

  return (
    <Piece
      ref={setNodeRef}
      className={styles.Piece}
      style={style}
      {...props}
      {...listeners}
      {...attributes}
    >
      <GrDrag />
    </Piece>
  )
}

export default DraggablePiece;