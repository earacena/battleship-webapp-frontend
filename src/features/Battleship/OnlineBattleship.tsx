import React, { useRef, useEffect } from 'react';
import { Message, zString } from './types/OnlineBattleship.types';
import type { MessageType } from './types/OnlineBattleship.types';

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
      // console.log(`message: ${event.data}`);
      const messageJSON: string =  zString.parse(event.data);
      const message: any = JSON.parse(messageJSON);
      
      if (Object.hasOwn(message, 'type')) {
        switch (message.type) {
          case 'message':
            const parsedMessage: MessageType = Message.parse(message);
            console.log(parsedMessage);
            break;
        };
      } else {
        console.error(`malformatted websocket message received: ${message}`)
      }
    }
  }, []);

  return (
    <div>
      
    </div>
  );
}

export default OnlineBattleship;
