import React, { useContext } from "react";
import { ThemeContext } from '../../App';

import styles from './styles/button.module.css';

type ButtonProps = {
  onClick: () => void;
  disabled?: boolean,
  children?: React.ReactNode;
  style?: React.CSSProperties;
};

function Button({ onClick, disabled, children, style }: ButtonProps) {

  const { theme, setTheme } = useContext(ThemeContext);

  const defaultStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    margin: "10px",
    marginTop: "20px",
    fontSize: "30px",
    border: "none",
    borderRadius: "5px",
    cursor: 'pointer',
  }

  return (
    <button
      className={
        theme === 'light' ? styles.lightButton : styles.darkButton
      }
      style={
        {
          ...defaultStyle,
          ...style,
        } as React.CSSProperties
      }
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
