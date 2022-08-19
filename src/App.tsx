import React, { useState } from 'react';
import { TitleHeader } from './components';
import { Battleship, OnlineBattleship } from './features/Battleship';
import { Menu } from './features/Menu';

function App() {
  const [mode, setMode] = useState<string>('');

  return (
    <div className="App">
      <TitleHeader title="BATTLESHIP" />
      { mode === '' && <Menu setMode={setMode} />}
      { mode === 'solo' && <Battleship /> }
      { mode === 'online' && <OnlineBattleship />}
    </div>
  );
}

export default App;
