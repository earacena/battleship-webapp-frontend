import React from 'react';
import { useNavigate } from 'react-router-dom';

function Menu() {
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate("/solo")}>Solo</button>
      <button onClick={() => navigate("/online")}> Online</button>
    </div>
  );
};

export default Menu;