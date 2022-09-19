import React, { createContext, Dispatch, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Battleship, OnlineBattleship } from "./features/Battleship";
import { Menu } from "./features/Menu";
import { Header } from "./components";

import styles from './app.module.css';
import classNames from "classnames";
import Footer from "./components/Footer";

type ThemeContextProps = {
  theme: string;
  setTheme: Dispatch<string>;
}

export const ThemeContext = createContext<ThemeContextProps>({ theme: '', setTheme: () => null });

function App() {
  const [theme, setTheme] = useState<string>('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div
        className={classNames(
          styles.App,
          styles.FadeInComponentSlowly,
          theme === 'light' ? styles.LightMode : styles.DarkMode,
        )}
        style={
          {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: '100vh'
          } as React.CSSProperties
        }
      >
        <Header />
        <span style={{ display: 'flex', flexGrow: 1 } as React.CSSProperties}>
          <Routes>
            <Route path="/" element={<Menu />} />
            <Route path="solo" element={<Battleship />} />
            <Route path="online" element={<OnlineBattleship />} />
          </Routes>
        </span>
        <Footer />
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
