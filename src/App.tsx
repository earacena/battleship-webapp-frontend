import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { TitleHeader } from "./components";
import { Battleship, OnlineBattleship } from "./features/Battleship";
import { Menu } from "./features/Menu";
import { Button } from "./components";

function App() {
  const navigate = useNavigate();

  return (
    <div
      className="App"
      style={
        {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        } as React.CSSProperties
      }
    >
      <Button
        style={{ border: "none", cursor: "pointer" } as React.CSSProperties}
        onClick={() => navigate("/")}
      >
        <TitleHeader title="BATTLESHIP" />
      </Button>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="solo" element={<Battleship />} />
        <Route path="online" element={<OnlineBattleship />} />
      </Routes>
    </div>
  );
}

export default App;
