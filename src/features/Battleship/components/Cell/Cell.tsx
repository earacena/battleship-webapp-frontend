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
  playTurn?: () => void;
};

function Cell({ id, x, y, hit, occupied, playTurn, selected, children }: CellProps) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={classNames(
        styles.Cell
      )}
      style={{
        '--occupied': occupied ? '#005AB5' : 'white',
        '--selected': selected ? '#DC3220' : occupied ? '#005AB5' : 'white',
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