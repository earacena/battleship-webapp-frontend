import { useDroppable } from '@dnd-kit/core';
import React from 'react';
import classNames from 'classnames';
import styles from './Cell.module.css';

export type CellProps = {
  id: string;
  x: number,
  y: number,
  children?: React.ReactElement | undefined;
};

function Cell({ id, x, y, children }: CellProps) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={classNames(
        styles.Cell
      )}
    >
      {children}
    </div>
  )
};

export default Cell;