import { useDroppable } from '@dnd-kit/core';
import React from 'react';
import classNames from 'classnames';
import styles from './Cell.module.css';
import { ImCross } from 'react-icons/im';

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

  let selectedColor: string;
  let occupiedColor: string;
  if (selected) {
    selectedColor = '#DC3220';
  } else {
    if (occupied) {
      selectedColor = '#005AB5';
    } else {
      selectedColor = 'white';
    }
  }

  if (occupied) {
    if (hidden) {
      selectedColor = 'white';
      occupiedColor = 'white';
    } else {
      occupiedColor = '#005AB5';
    }
  } else {
    occupiedColor = 'white';
  }

  return (
    <div
      ref={setNodeRef}
      className={classNames(
        styles.Cell
      )}
      style={{
        '--occupied': occupiedColor,
        '--selected': selectedColor,
      } as React.CSSProperties}
      onClick={playTurn}
    >
      {children}
      {occupied && hit && <ImCross style={{ color: 'red'}} />}
      {!occupied && hit && <ImCross style={{ color: 'black'}} />}
    </div>
  )
};

export default Cell;