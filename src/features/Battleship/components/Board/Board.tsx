import React, { useContext } from 'react';
import styles from './Board.module.css';

import { ThemeContext } from '../../../../App';
import classNames from 'classnames';

type BoardProps = {
  size: number;
  gridSize: number;
  children?: React.ReactNode;
};

function Board({ size, gridSize, children }: BoardProps) {
  
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={classNames(
        styles.Board,
        theme === 'light' ? styles.LightMode : styles.DarkMode,
      )}
      style={{'--board-size': size, '--grid-size': `${gridSize}px`} as React.CSSProperties}
    >
      {children}
    </div>
  )
}

export default Board;