import React, { createContext, Dispatch, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Battleship, OnlineBattleship } from "./features/Battleship";
import { Menu } from "./features/Menu";
import { Button } from "./components";
import { Header } from "./components";

import styles from './app.module.css';
import classNames from "classnames";

type ThemeContextProps = {
  theme: string;
  setTheme: Dispatch<string>;
}

export const ThemeContext = createContext<ThemeContextProps>({ theme: '', setTheme: () => null });

function App() {
  const [theme, setTheme] = useState<string>('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Header />
      <div
        className={classNames(
          styles.App,
          styles.FadeInComponentSlowly
        )}
        style={
          {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            "--background-color": theme === 'light' ? 'white' : 'darkslategray',
          } as React.CSSProperties
        }
      >
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="solo" element={<Battleship />} />
          <Route path="online" element={<OnlineBattleship />} />
        </Routes>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
