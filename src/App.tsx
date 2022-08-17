import React, { useState } from 'react';
import { TitleHeader } from './components';
import { Battleship } from './features/Battleship';
import { Menu } from './features/Menu';

function App() {
  const [mode, setMode] = useState<string>('');

  return (
    <div className="App">
      <TitleHeader title="BATTLESHIP" />
      { mode === '' && <Menu setMode={setMode} />}
      { mode === 'solo' && <Battleship /> }
    </div>
  );
}

export default App;
