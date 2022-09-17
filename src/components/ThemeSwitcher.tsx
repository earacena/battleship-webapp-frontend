import React, { useContext } from 'react';
import { BsSun, BsMoonFill } from 'react-icons/bs';
import { ThemeContext } from '../App';
import { Button } from './Button';

function ThemeSwitcher() {
  const { theme, setTheme } = useContext(ThemeContext);

  return(
    <Button
      style={{
        borderRadius: "50%",
        padding: "5px",
      } as React.CSSProperties}
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      {
        theme === 'light'
        ? (
            <BsMoonFill />
            ) : (
            <BsSun />
          )
      }
    </Button>
  );
}

export default ThemeSwitcher;