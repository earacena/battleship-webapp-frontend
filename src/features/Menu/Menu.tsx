import React from 'react';

type MenuProps = {
  setMode: (value: React.SetStateAction<string>) => void,
};

function Menu({ setMode }: MenuProps) {
  return (
    <div>
      <button onClick={() => setMode('solo')}>Solo</button>
      <button onClick={() => setMode('online')}> Online</button>
    </div>
  );
};

export default Menu;