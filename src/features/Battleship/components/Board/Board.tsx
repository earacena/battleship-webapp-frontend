import React from 'react';
import styles from './Board.module.css';

type BoardProps = {
  size: number;
  gridSize: number;
  children?: React.ReactNode;
};

function Board({ size, gridSize, children }: BoardProps) {
  return (
    <div
      className={styles.Board}
      style={{'--board-size': size, '--grid-size': `${gridSize}px`} as React.CSSProperties}
    >
      {children}
    </div>
  )
}

export default Board;