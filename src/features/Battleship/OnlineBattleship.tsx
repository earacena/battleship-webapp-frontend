import React, { useRef, useEffect, useState } from 'react';
import { generateBoard, generateOccupiedPositions } from './Battleship';
import { IdMessage, Message, OpponentInfoMessage, zString } from './types/OnlineBattleship.types';
import type { IdMessageType, MessageType, OpponentInfoMessageType} from './types/OnlineBattleship.types';
import { BoardEditor } from './components/BoardEditor';

function OnlineBattleship() {
  // Queuing states
  const [isQueuing, setIsQueuing] = useState<boolean>(false);
  const [isMatched, setIsMatched] = useState<boolean>(false);
  const [opponentId, setOpponentId] = useState<string>('');

  // BoardEditor states
  const boardSize: number = 10;
  const gridSize: number = 50;

  const [editing, setEditing] = useState<boolean>(true);
  const [board, setBoard] = useState(() => generateBoard(boardSize));
  const [opponentBoard, setOpponentBoard] = useState(() => generateBoard(boardSize));
  const [occupiedPositions, setOccupiedPositions] = useState<boolean[][]>(() =>
    generateOccupiedPositions(boardSize)
  );
  const [isOpponentReady, setIsOpponentReady] = useState<boolean>(false);

  // Game states
  const [opponentOccupiedPositions] = useState<boolean[][]>(() =>
    generateOccupiedPositions(boardSize)
  );

  const [hitPositions, setHitPositions] = useState<boolean[][]>(() =>
    generateOccupiedPositions(boardSize)
  );
  const [opponentHitPositions, setOpponentHitPositions] = useState<boolean[][]>(
    () => generateOccupiedPositions(boardSize)
  );
  const [playerScore, setPlayerScore] = useState<number>(0);
  const [opponentScore, setOpponentScore] = useState<number>(0);
  const [playerTurn, setPlayerTurn] = useState<boolean>(true);

  // EndGame states
  const [winner, setWinner] = useState<string>("");
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const [gameResult, setGameResult] = useState<string>('');

  // Websockets
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
          case 'opponent is ready':
            setIsOpponentReady(true);
            break;
          case 'opponent disconnected':
            resetGame();
            break;
        };
      } else {
        console.error(`malformatted websocket message received: ${message}`)
      }
    }
  }, []);

  useEffect(() => {
    if (!editing) {
      const messageJson: string = JSON.stringify({ type: 'ready' });
      ws.current?.send(messageJson);
    }
  }, [editing]);

  const resetGame = () => {
    // Set all the states back to default
    console.log('opponent disconnected, reseting game');
    setPlayerScore(0);
    setOpponentScore(0);
    setBoard(generateBoard(boardSize));
    setOpponentBoard(generateBoard(boardSize));
    setOccupiedPositions(generateOccupiedPositions(boardSize));
    setHitPositions(generateOccupiedPositions(boardSize));
    setOpponentHitPositions(generateOccupiedPositions(boardSize));
    setWinner('');
    setEditing(true);
    setGameEnded(false);
    setPlayerTurn(true);
    setGameResult('');
    setIsQueuing(false);
    setIsMatched(false);
    setOpponentId('');
  };

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
      {!isQueuing && isMatched && (
        <div>
          <div>
            <p>{`${opponentId} is your opponent!`}</p>
            {isOpponentReady
            ? (
              <span style={{ color: 'green' } as React.CSSProperties}>
                {'Opponent is Ready'}
              </span> 
            ) : (
              <span style={{ color: 'gray' } as React.CSSProperties}>
                {!editing && 'Opponent is currently editing their board...' }
              </span>
            )}
          </div>
          <BoardEditor 
            board={board}
            boardSize={boardSize}
            gridSize={gridSize}
            occupiedPositions={occupiedPositions}
            setOccupiedPositions={setOccupiedPositions}
            setEditing={setEditing}
            editing={editing}
          />
        </div>
      )}
      {!isQueuing && !isMatched && <button onClick={handleEnqueue}>Queue for match</button>}
    </div>
  );
}

export default OnlineBattleship;
