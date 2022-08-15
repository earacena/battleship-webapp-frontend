import React from 'react';
import { TitleHeader } from './components';
import { Battleship } from './features/Battleship';

function App() {
  return (
    <div className="App">
      <TitleHeader title="BATTLESHIP" />
      <Battleship />
    </div>
  );
}

export default App;
