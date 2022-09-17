import { useDroppable } from '@dnd-kit/core';
import React, { useContext } from 'react';
import classNames from 'classnames';
import styles from './Cell.module.css';
import { ImCross } from 'react-icons/im';

import { ThemeContext } from '../../../../App';

export type CellProps = {
  id: string;
  x: number,
  y: number,
  occupied: boolean;
  selected: boolean;
  hit?: boolean;
  children?: React.ReactElement | undefined;
  hidden?: boolean;
  playTurn?: () => void;
};

function Cell({ id, x, y, hit, occupied, playTurn, hidden, selected, children }: CellProps) {
  const { setNodeRef } = useDroppable({ id });

  const { theme } = useContext(ThemeContext);

  let styleClass;

  if (theme === 'light') {
    if (hidden) {
      styleClass = styles.LightMode;
    } else if (selected && occupied) {
      styleClass = styles.LightSelected;
    } else if (occupied) {
      styleClass = styles.LightOccupied;
    }
  } else {
    if (hidden) {
      styleClass = styles.DarkMode;
    } else if (selected && occupied) {
      styleClass = styles.DarkSelected;
    } else if (occupied) {
      styleClass = styles.DarkOccupied;
    } else {
      styleClass = styles.DarkMode;
    }
  }

  return (
    <div
      ref={setNodeRef}
      className={classNames(
        styles.Cell,
        styleClass
      )}
      onClick={playTurn}
    >
      {children}
      {occupied && hit && <ImCross style={{ color: '#AF0404'}} />}
      {!occupied && hit && <ImCross style={{ color: '#293241'}} />}
    </div>
  )
};

export default Cell;