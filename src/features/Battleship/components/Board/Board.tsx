import React from 'react';
import styles from './Board.module.css';

type BoardProps = {
  size: number;
  children: React.ReactNode;
};

function Board({ size, children }: BoardProps) {
  return (
    <div
      className={styles.Board}
      style={{'--size': size} as React.CSSProperties}
    >
      {children}
    </div>
  )
}

export default Board;