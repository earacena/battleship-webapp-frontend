import React, { forwardRef } from 'react';
import { RiShip2Fill } from 'react-icons/ri';

export interface PieceProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  position: { x: number, y: number },
  type: string;
  size: number;
  gridSize: number;
  vertical: boolean;
  children?: React.ReactNode
};

const Piece = forwardRef<HTMLDivElement, PieceProps>(({children, ...props}, ref) => {
  const {vertical, gridSize,...pieceProps } = props;
  return (
    <div ref={ref} {...pieceProps}> {children} </div>
  );
});

export default Piece;