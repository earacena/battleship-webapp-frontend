import React, { useRef, useEffect, useState } from 'react';
import { IdMessage, Message, OpponentInfoMessage, zString } from './types/OnlineBattleship.types';
import type { IdMessageType, MessageType, OpponentInfoMessageType} from './types/OnlineBattleship.types';

function OnlineBattleship() {
  const [isQueuing, setIsQueuing] = useState<boolean>(false);
  const [isMatched, setIsMatched] = useState<boolean>(false);
  const [opponentId, setOpponentId] = useState<string>('');

  const ws = useRef<WebSocket>();

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8080');
    ws.current.onopen = () => {
      console.log('connected to websocket server');
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
          case 'id':
            const parsedIdMessage: IdMessageType = IdMessage.parse(message);
            console.log(`id: ${parsedIdMessage.message}`);
            break;
          case 'message':
            const parsedMessage: MessageType = Message.parse(message);
            console.log(parsedMessage);
            break;
          case 'queued user':
            setIsQueuing(true);
            break;
          case 'matched with user':
            setIsQueuing(false);
            setIsMatched(true);

            const parsedOpponentInfoMessage: OpponentInfoMessageType = OpponentInfoMessage.parse(message);
            setOpponentId(parsedOpponentInfoMessage.message);
            break;
        };
      } else {
        console.error(`malformatted websocket message received: ${message}`)
      }
    }
  }, []);

  const handleEnqueue = () => {
    if (!ws.current) {
      return;
    }

    const messageJSON: string = JSON.stringify({ type: 'enqueue user' });
    ws.current?.send(messageJSON);
  };

  return (
    <div>
      {!isQueuing && !isMatched && "Currently not waiting in a queue"}
      {isQueuing && "Waiting in a queue..."}
      {!isQueuing && isMatched && `${opponentId} is your opponent`}
      <button onClick={handleEnqueue}>Queue for match</button>
    </div>
  );
}

export default OnlineBattleship;
