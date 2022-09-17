import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';
import TitleHeader from './TitleHeader';
import ThemeSwitcher from './ThemeSwitcher';

function Header() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      } as React.CSSProperties}
    >
      <Button
        style={{
          border: "none",
          cursor: "pointer",
        } as React.CSSProperties}

        onClick={() => navigate("/")}
      >
        <TitleHeader title="BATTLESHIP" />
      </Button>
      <ThemeSwitcher />
    </div>
  );
}

export default Header;