import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BsPerson } from 'react-icons/bs';
import { Button } from '../../components';

import styles from '../../app.module.css';

function Menu() {
  const navigate = useNavigate();

  return (
    <div 
      className={styles.FadeInComponentQuickly}
      style={{ display: 'flex', flexDirection: 'row' } as React.CSSProperties}
    >
      <Button onClick={() => navigate("/solo")}>
         Solo
        <BsPerson />
      </Button>
      <Button onClick={() => navigate("/online")}>
        Online
        <span>
          <BsPerson />
          <BsPerson />
        </span>
      </Button>
    </div>
  );
};

export default Menu;