import React, { useRef, useEffect, useState, useCallback } from "react";
import { BsCheck2, BsX } from "react-icons/bs";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { generateBoard, generateOccupiedPositions } from "./Battleship";
import {
  IdMessage,
  Message,
  OpponentInfoMessage,
  PlayerFiredMessage,
  TurnMessage,
  zString,
  AnnounceWinnerMessage,
} from "./types/OnlineBattleship.types";
import type {
  IdMessageType,
  TurnMessageType,
  MessageType,
  OpponentInfoMessageType,
  PlayerFiredMessageType,
} from "./types/OnlineBattleship.types";
import { BoardEditor } from "./components/BoardEditor";
import { Scores } from "./components/Scores";
import { Board, Cell } from "./components";
import { EndGame } from "./components/EndGame";
import { Button } from "../../components";
import styles from "./styles/onlineBattleship.module.css";
import classNames from "classnames";

function OnlineBattleship() {
  // Queuing states
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isQueuing, setIsQueuing] = useState<boolean>(false);
  const [isMatched, setIsMatched] = useState<boolean>(false);
  const [opponentId, setOpponentId] = useState<string>("");

  // BoardEditor states
  const boardSize: number = 10;
  const gridSize: number = 50;

  const [editing, setEditing] = useState<boolean>(true);
  const [board, setBoard] = useState(() => generateBoard(boardSize));
  const [opponentBoard, setOpponentBoard] = useState(() =>
    generateBoard(boardSize)
  );
  const [occupiedPositions, setOccupiedPositions] = useState<boolean[][]>(() =>
    generateOccupiedPositions(boardSize)
  );
  const [isOpponentReady, setIsOpponentReady] = useState<boolean>(false);

  // Game states
  const [opponentOccupiedPositions, setOpponentOccupiedPositions] = useState<
    boolean[][]
  >(() => generateOccupiedPositions(boardSize));

  const [hitPositions, setHitPositions] = useState<boolean[][]>(() =>
    generateOccupiedPositions(boardSize)
  );
  const [opponentHitPositions, setOpponentHitPositions] = useState<boolean[][]>(
    () => generateOccupiedPositions(boardSize)
  );
  const [playerScore, setPlayerScore] = useState<number>(0);
  const [opponentScore, setOpponentScore] = useState<number>(0);
  const [playerTurn, setPlayerTurn] = useState<string>("");
  const [turn, setTurn] = useState<string>("first");

  // EndGame states
  const [winner, setWinner] = useState<string>("");
  const [loser, setLoser] = useState<string>("");
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const [gameResult, setGameResult] = useState<string>("");

  // Websockets
  const ws = useRef<WebSocket>();

  useEffect(() => {
    ws.current = new WebSocket(zString.parse(process.env.REACT_APP_BACKEND_URL));
    ws.current.onopen = () => {
      console.log("connected to websocket server");
      setIsConnected(true);
    };
    ws.current.onclose = () => {
      console.log("closed connection to websocket server");
    };

    const wsCurrent = ws.current;

    return () => {
      wsCurrent.close();
    };
  }, []);

  useEffect(() => {
    if (!ws.current) {
      return;
    }

    ws.current.onmessage = (event) => {
      // console.log(`message: ${event.data}`);
      const messageJSON: string = zString.parse(event.data);
      const message: any = JSON.parse(messageJSON);

      if (Object.hasOwn(message, "type")) {
        switch (message.type) {
          case "id":
            const parsedIdMessage: IdMessageType = IdMessage.parse(message);
            console.log(`id: ${parsedIdMessage.id}`);
            break;
          case "message":
            const parsedMessage: MessageType = Message.parse(message);
            console.log(parsedMessage);
            break;
          case "queued user":
            setIsQueuing(true);
            break;
          case "matched with user":
            setIsQueuing(false);
            setIsMatched(true);

            const parsedOpponentInfoMessage: OpponentInfoMessageType =
              OpponentInfoMessage.parse(message);
            setOpponentId(parsedOpponentInfoMessage.opponentId);
            break;
          case "opponent is ready":
            setIsOpponentReady(true);
            break;
          case "decide player turn":
            const parsedDecidePlayerTurnMessage: TurnMessageType =
              TurnMessage.parse(message);
            setPlayerTurn(parsedDecidePlayerTurnMessage.turn);
            break;
          case "turn":
            const parsedTurnMessage: TurnMessageType =
              TurnMessage.parse(message);
            setTurn(parsedTurnMessage.turn);
            break;
          case "opponent fired":
            const parsedPlayerFiredMessage: PlayerFiredMessageType =
              PlayerFiredMessage.parse(message);
            const { y, x } = parsedPlayerFiredMessage.position;

            // Check if opponent shot hit or miss
            if (occupiedPositions[y][x]) {
              // Hit
              setOpponentScore((score) => score + 1);
              setHitPositions((prevHitPositions) => {
                prevHitPositions[y][x] = true;
                return prevHitPositions;
              });
              ws.current?.send(
                JSON.stringify({
                  type: "report hit",
                  position: { y, x },
                })
              );
            } else {
              // Miss
              setHitPositions((prevHitPositions) => {
                prevHitPositions[y][x] = true;
                return prevHitPositions;
              });
              ws.current?.send(
                JSON.stringify({
                  type: "report miss",
                  position: { y, x },
                })
              );
            }
            break;
          case "reporting hit":
            {
              const { y, x } = PlayerFiredMessage.parse(message).position;
              setPlayerScore((score) => score + 1);
              setOpponentOccupiedPositions((prevOpponentOccupiedPositions) => {
                prevOpponentOccupiedPositions[y][x] = true;
                return prevOpponentOccupiedPositions;
              });
              setOpponentHitPositions((prevOpponentHitPositions) => {
                prevOpponentHitPositions[y][x] = true;
                return prevOpponentHitPositions;
              });
            }
            break;
          case "reporting miss":
            {
              const { y, x } = PlayerFiredMessage.parse(message).position;
              setOpponentHitPositions((prevOpponentHitPositions) => {
                prevOpponentHitPositions[y][x] = true;
                return prevOpponentHitPositions;
              });
            }
            break;
          case "announce winner":
            {
              const parsedAnnounceWinnerMessage =
                AnnounceWinnerMessage.parse(message);
              setGameEnded(true);
              setGameResult("win");
              setWinner(parsedAnnounceWinnerMessage.winner);
              setLoser(parsedAnnounceWinnerMessage.loser);
            }
            break;
          case "opponent disconnected":
            resetGame();
            break;
        }
      } else {
        console.error(`malformatted websocket message received: ${message}`);
      }
    };
  }, []);

  useEffect(() => {
    if (!editing) {
      const messageJson: string = JSON.stringify({ type: "ready" });
      ws.current?.send(messageJson);
    }
  }, [editing]);

  const resetGame = () => {
    // Set all the states back to default
    console.log("opponent disconnected, reseting game");
    setPlayerScore(0);
    setOpponentScore(0);
    setBoard(generateBoard(boardSize));
    setOpponentBoard(generateBoard(boardSize));
    setOccupiedPositions(generateOccupiedPositions(boardSize));
    setHitPositions(generateOccupiedPositions(boardSize));
    setOpponentHitPositions(generateOccupiedPositions(boardSize));
    setWinner("");
    setEditing(true);
    setGameEnded(false);
    setPlayerTurn("first");
    setGameResult("");
    setIsQueuing(false);
    setIsMatched(false);
    setOpponentId("");
    setIsOpponentReady(false);
  };

  const handleEnqueue = () => {
    if (!ws.current) {
      return;
    }

    const messageJSON: string = JSON.stringify({ type: "enqueue user" });
    ws.current?.send(messageJSON);
  };

  const canFire = useCallback(
    (y: number, x: number) =>
      playerTurn === turn && !opponentHitPositions[y][x],
    [opponentHitPositions, turn, playerTurn]
  );

  const playTurn = (y: number, x: number) => {
    console.log(`${playerTurn} firing at y: ${y}, x: ${x}`);
    if (canFire(y, x)) {
      ws.current?.send(
        JSON.stringify({
          type: "fired at position",
          position: { y, x },
        })
      );
    } else {
      return;
    }
  };

  return (
    <div>
      {!isQueuing && !isMatched && (
        <span style={{ fontSize: "40px" } as React.CSSProperties}>
          {"Not waiting in the queue."}
        </span>
      )}
      {isQueuing && (
        <span style={{ fontSize: "40px" } as React.CSSProperties}>
          {"Waiting in queue "}
          <AiOutlineLoading3Quarters
            className={classNames(styles.WaitingIcon)}
          />
        </span>
      )}
      {!isQueuing && isMatched && (editing || !isOpponentReady) && (
        <div>
          <div>
            <p>{`${opponentId} is your opponent!`}</p>
            {isOpponentReady ? (
              <span style={{ color: "green" } as React.CSSProperties}>
                {"Opponent is Ready"}
              </span>
            ) : (
              <span style={{ color: "gray" } as React.CSSProperties}>
                {!editing && "Opponent is currently editing their board..."}
              </span>
            )}
          </div>
          {editing ? (
            <BoardEditor
              board={board}
              boardSize={boardSize}
              gridSize={gridSize}
              occupiedPositions={occupiedPositions}
              setOccupiedPositions={setOccupiedPositions}
              setEditing={setEditing}
              editing={editing}
            />
          ) : (
            <Board size={boardSize} gridSize={gridSize}>
              {board.map((row, y) =>
                row.map((cell, x) => (
                  <Cell
                    key={cell.id}
                    {...cell}
                    occupied={occupiedPositions[y][x]}
                    hit={hitPositions[y][x]}
                  />
                ))
              )}
            </Board>
          )}
        </div>
      )}
      {!editing && isOpponentReady && isMatched && !gameEnded && (
        <div>
          <span style={{ textAlign: "center", fontSize: "40px" }}>
            <Scores playerScore={playerScore} opponentScore={opponentScore} />
          </span>
          {turn === playerTurn && "Your turn"}
          <div style={{ textAlign: "center" }}>
            <Board size={boardSize} gridSize={gridSize}>
              {board.map((row, y) =>
                row.map((cell, x) => (
                  <Cell
                    key={cell.id}
                    {...cell}
                    occupied={occupiedPositions[y][x]}
                    hit={hitPositions[y][x]}
                  />
                ))
              )}
            </Board>
            <Board size={boardSize} gridSize={gridSize}>
              {opponentBoard.map((row, y) =>
                row.map((cell, x) => (
                  <Cell
                    key={cell.id}
                    {...cell}
                    hidden={true}
                    occupied={opponentOccupiedPositions[y][x]}
                    hit={opponentHitPositions[y][x]}
                    playTurn={() => playTurn(y, x)}
                  />
                ))
              )}
            </Board>
          </div>
        </div>
      )}
      {gameEnded && (
        <EndGame
          winner={winner}
          loser={loser}
          gameResult={gameResult}
          resetGame={resetGame}
        />
      )}
      {!isQueuing && !isMatched && (
        <div
          style={
            { display: "flex", flexDirection: "column" } as React.CSSProperties
          }
        >
          <Button onClick={() => handleEnqueue()} disabled={isQueuing}>
            <span
              style={
                {
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                } as React.CSSProperties
              }
            >
              Join Queue
              {isConnected && (
                <BsCheck2 style={{ color: "green" } as React.CSSProperties} />
              )}
              {!isConnected && (
                <BsX style={{ color: "red" } as React.CSSProperties} />
              )}
            </span>
          </Button>
        </div>
      )}
    </div>
  );
}

export default OnlineBattleship;
