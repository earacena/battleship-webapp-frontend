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
      style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' } as React.CSSProperties}
    >
      <Button style={{ fontSize: '50px', padding: '10px' } as React.CSSProperties} onClick={() => navigate("/solo")}>
          Solo
          <span>
            <BsPerson />
          </span>
      </Button>
      <Button style={{ fontSize: '49px', padding: '10px' } as React.CSSProperties} onClick={() => navigate("/online")}>
        <span>
          Online
        </span>
        <span>
          <BsPerson />
          <BsPerson />
        </span>
      </Button>
    </div>
  );
};

export default Menu;