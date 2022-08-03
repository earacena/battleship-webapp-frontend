import React, { forwardRef } from 'react';
import { RiShip2Fill } from 'react-icons/ri';

export interface PieceProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  x: number;
  y: number;
  type: string;
  size: number;
  rotated: boolean;
};

const Piece = forwardRef<HTMLDivElement, PieceProps>(({children, ...props}, ref) => {
    return (
      <div ref={ref} {...props}> {children} </div>
    );
});

export default Piece;