import React from 'react';
import styles from './Label.module.css';

export type LabelProps = {
  vertical: boolean;
  content: string;
};

function Label({ vertical, content }: LabelProps) {

  return (
    <span
      className={styles.Label}
      style={{'--rotation': vertical ? '90deg' : '0deg'} as React.CSSProperties}
    >
      {content}
    </span>
  )
}

export default Label;