import React from "react";

type ButtonProps = {
  onClick: () => void;
  disabled?: boolean,
  children?: React.ReactNode;
  style?: React.CSSProperties;
};

function Button({ onClick, disabled, children, style }: ButtonProps) {
  return (
    <button
      style={
        {
          ...style,
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
