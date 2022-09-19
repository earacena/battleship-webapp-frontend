import React, { useContext } from "react";
import { ThemeContext } from "../App";

function Footer() {

  const { theme } = useContext(ThemeContext);

  return (
    <div
      style={{
        backgroundColor: theme === 'light' ? 'white' : '#212D40',
        color: theme === 'light' ? '#212D40' : 'white',
        margin: 'auto',
        padding: '5px',
        fontWeight: '600'
      } as React.CSSProperties}
    >
      Developed by Emanuel Aracena Beriguete{" "}
      (<a style={{ color: theme === 'light' ? 'slategray' : 'lightblue' }} href="https://www.github.com/earacena">@earacena</a>) •{" "}
      <a style={{ color: theme === 'light' ? 'slategray' : 'lightblue' }} href="https://www.github.com/earacena/battleship-webapp-frontend">
        Frontend
      </a>{" "}
      •{" "}
      <a style={{ color: theme === 'light' ? 'stategray' : 'lightblue' }} href="https://www.github.com/earacena/battleship-webapp-frontend">
        Backend
      </a>
    </div>
  );
}

export default Footer;
