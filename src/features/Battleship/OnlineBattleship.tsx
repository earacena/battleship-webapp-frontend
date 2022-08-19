import React, { useRef, useEffect } from 'react';

function OnlineBattleship() {
  const ws = useRef<WebSocket>();

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8080');
    ws.current.onopen = () => {
      console.log('connected to websocket server');
      ws.current?.send('hi from client');
    };
    ws.current.onclose = () => {
      console.log('closed connection to websocket server');
    };

    const wsCurrent = ws.current;

    return () => {
      wsCurrent.close();
    }
  }, []);

  useEffect(() => {
    if (!ws.current) {
      return;
    }

    ws.current.onmessage = (event) => {
      console.log(`message: ${event.data}`);
    }
  }, []);

  return (
    <div>
      
    </div>
  );
}

export default OnlineBattleship;
