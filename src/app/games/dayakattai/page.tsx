"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Player = {
  id: number;
  name: string;
  color: string;
  pieces: number[];
};

const COLORS = ["#a62d20", "#23633f", "#28569b", "#b87918"];

const DEFAULT_NAMES = [
  "Player 1",
  "Player 2",
  "Player 3",
  "Player 4",
];

/*
  DAYAKATTAI / THAAYAM

  This is a simplified digital version inspired by
  traditional Tamil race-game mechanics.

  - 2–4 players
  - 4 pieces per player
  - Pieces begin at HOME
  - A special roll of 1, 5 or 6 can bring a piece onto the board
  - Pieces move around the common track
  - Safe squares cannot be captured
  - Capturing sends an opponent piece home
  - Capturing gives another turn
  - Exact roll is required to reach the final HOME
*/

const TRACK_LENGTH = 48;

const SAFE_SQUARES = [
  0,
  6,
  12,
  18,
  24,
  30,
  36,
  42,
];

function createPlayers(count: number): Player[] {
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    name: DEFAULT_NAMES[index],
    color: COLORS[index],
    pieces: [-1, -1, -1, -1],
  }));
}

function getRoll(): number {
  return Math.floor(Math.random() * 6) + 1;
}

export default function DayakattaiPage() {
  const router = useRouter();

  const [playerCount, setPlayerCount] = useState(2);
  const [players, setPlayers] = useState<Player[]>(createPlayers(2));

  const [gameStarted, setGameStarted] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(0);

  const [dice, setDice] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);

  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);

  const [message, setMessage] = useState(
    "Player 1, throw the Dayakattai."
  );

  const [winner, setWinner] = useState<number | null>(null);

  function changePlayerCount(count: number) {
    setPlayerCount(count);
    setPlayers(createPlayers(count));
  }

  function changeName(index: number, value: string) {
    setPlayers((old) =>
      old.map((player, i) =>
        i === index
          ? {
              ...player,
              name: value || DEFAULT_NAMES[index],
            }
          : player
      )
    );
  }

  function startGame() {
    setPlayers(createPlayers(playerCount));
    setCurrentPlayer(0);
    setDice(null);
    setSelectedPiece(null);
    setWinner(null);
    setMessage("Player 1, throw the Dayakattai.");
    setGameStarted(true);
  }

  function resetGame() {
    startGame();
  }

  function isEnteringRoll(value: number) {
    return value === 1 || value === 5 || value === 6;
  }

  function canMove(position: number, roll: number) {
    if (position === TRACK_LENGTH) {
      return false;
    }

    if (position === -1) {
      return isEnteringRoll(roll);
    }

    return position + roll <= TRACK_LENGTH;
  }

  function getMovablePieces(player: Player, roll: number) {
    return player.pieces
      .map((position, index) =>
        canMove(position, roll) ? index : -1
      )
      .filter((index) => index !== -1);
  }

  function rollDice() {
    if (
      rolling ||
      dice !== null ||
      winner !== null ||
      !gameStarted
    ) {
      return;
    }

    setRolling(true);
    setSelectedPiece(null);

    setTimeout(() => {
      const result = getRoll();

      setDice(result);
      setRolling(false);

      const player = players[currentPlayer];
      const movable = getMovablePieces(player, result);

      if (movable.length === 0) {
        setMessage(
          `${player.name} cannot make a move with ${result}.`
        );

        setTimeout(() => {
          nextTurn(result);
        }, 900);

        return;
      }

      /*
        If there is only one legal piece,
        automatically move it.
      */

      if (movable.length === 1) {
        setMessage(
          `${player.name} has only one possible move.`
        );

        setTimeout(() => {
          movePiece(movable[0], result);
        }, 650);

        return;
      }

      setMessage(
        `${player.name}, choose a piece to move.`
      );
    }, 650);
  }

  function movePiece(pieceIndex: number, roll: number) {
    const player = players[currentPlayer];

    const oldPosition = player.pieces[pieceIndex];

    if (!canMove(oldPosition, roll)) {
      setMessage("That piece cannot move with this roll.");
      return;
    }

    let newPosition = oldPosition;

    /*
      A piece entering from HOME starts
      at the beginning of the track.
    */

    if (oldPosition === -1) {
      newPosition = 0;
    } else {
      newPosition = oldPosition + roll;
    }

    const updatedPlayers = players.map((p, index) => {
      if (index !== currentPlayer) {
        return p;
      }

      return {
        ...p,
        pieces: p.pieces.map((piece, index2) =>
          index2 === pieceIndex ? newPosition : piece
        ),
      };
    });

    let captured = false;

    /*
      Capture opponent pieces.

      We use the player's relative position
      on the common track.
    */

    if (
      newPosition >= 0 &&
      newPosition < TRACK_LENGTH &&
      !SAFE_SQUARES.includes(newPosition)
    ) {
      updatedPlayers.forEach((opponent, opponentIndex) => {
        if (opponentIndex === currentPlayer) {
          return;
        }

        opponent.pieces.forEach((opponentPosition, pieceIndex2) => {
          if (opponentPosition === newPosition) {
            captured = true;

            updatedPlayers[opponentIndex] = {
              ...updatedPlayers[opponentIndex],
              pieces: updatedPlayers[opponentIndex].pieces.map(
                (piece, i) => (i === pieceIndex2 ? -1 : piece)
              ),
            };
          }
        });
      });
    }

    setPlayers(updatedPlayers);

    const currentPieces = updatedPlayers[currentPlayer].pieces;

    const hasWon = currentPieces.every(
      (piece) => piece === TRACK_LENGTH
    );

    if (hasWon) {
      setWinner(currentPlayer);
      setDice(null);
      setSelectedPiece(null);
      setMessage(
        `${player.name} has mastered Dayakattai!`
      );
      return;
    }

    setDice(null);
    setSelectedPiece(null);

    if (captured) {
      setMessage(
        `${player.name} captured an opponent piece! Another turn.`
      );
      return;
    }

    /*
      Traditional regional versions vary,
      but this digital version grants another
      turn for a 1, 5 or 6.
    */

    nextTurn(roll);
  }

  function nextTurn(roll: number) {
    if (roll === 1 || roll === 5 || roll === 6) {
      setMessage(
        `${players[currentPlayer].name} gets another turn!`
      );
      return;
    }

    const next = (currentPlayer + 1) % players.length;

    setCurrentPlayer(next);
    setDice(null);

    setMessage(
      `${players[next].name}, throw the Dayakattai.`
    );
  }

  function choosePiece(index: number) {
    if (dice === null || winner !== null) {
      return;
    }

    const player = players[currentPlayer];

    if (!canMove(player.pieces[index], dice)) {
      setMessage(
        "That piece cannot move with the current roll."
      );
      return;
    }

    setSelectedPiece(index);
  }

  function confirmMove() {
    if (selectedPiece === null || dice === null) {
      return;
    }

    movePiece(selectedPiece, dice);
  }

  /*
    Convert the track position into a visual board cell.
  */

  function getCellPosition(position: number) {
    const cells = [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [1, 4],
      [2, 4],
      [3, 4],
      [4, 4],
      [4, 3],
      [4, 2],
      [4, 1],
      [4, 0],
      [3, 0],
      [2, 0],
      [1, 0],

      [1, 1],
      [1, 2],
      [1, 3],
      [2, 3],
      [3, 3],
      [3, 2],
      [3, 1],
      [2, 1],

      [2, 2],
    ];

    return cells[position % cells.length];
  }

  function getPiecesAt(position: number) {
    const result: {
      player: number;
      piece: number;
    }[] = [];

    players.forEach((player) => {
      player.pieces.forEach((piecePosition, pieceIndex) => {
        if (
          piecePosition >= 0 &&
          piecePosition < TRACK_LENGTH &&
          piecePosition % 25 === position
        ) {
          result.push({
            player: player.id,
            piece: pieceIndex,
          });
        }
      });
    });

    return result;
  }

  function getHomePieces(player: Player) {
    return player.pieces.filter((piece) => piece === -1);
  }

  return (
    <main className="dayakattai-page">
      <nav className="dayakattai-nav">
        <button
          className="dayakattai-nav-button"
          onClick={() => router.push("/games")}
        >
          ← Games
        </button>

        <div className="dayakattai-brand">
          🪷 KRIDAVIRASAT
        </div>

        <button
          className="dayakattai-nav-button"
          onClick={() => router.push("/home")}
        >
          Home
        </button>
      </nav>

      {!gameStarted ? (
        <section className="dayakattai-setup">
          <div className="dayakattai-setup-card">
            <div className="dayakattai-eyebrow">
              INDIAN KNOWLEDGE SYSTEM
            </div>

            <div className="dayakattai-symbol">☸</div>

            <h1>Dayakattai</h1>

            <h3>Thaayam • Traditional Tamil Game</h3>

            <p>
              Enter the world of an ancient Tamil race game
              where strategy, chance and patience determine
              the champion.
            </p>

            <div className="dayakattai-divider">
              ❈ ❈ ❈
            </div>

            <h2>Choose Players</h2>

            <div className="dayakattai-player-count">
              {[2, 3, 4].map((count) => (
                <button
                  key={count}
                  className={
                    playerCount === count ? "selected" : ""
                  }
                  onClick={() => changePlayerCount(count)}
                >
                  {count} Players
                </button>
              ))}
            </div>

            <div className="dayakattai-names">
              {Array.from({ length: playerCount }).map(
                (_, index) => (
                  <input
                    key={index}
                    placeholder={DEFAULT_NAMES[index]}
                    onChange={(event) =>
                      changeName(index, event.target.value)
                    }
                  />
                )
              )}
            </div>

            <button
              className="dayakattai-start"
              onClick={startGame}
            >
              Begin Dayakattai
            </button>
          </div>
        </section>
      ) : (
        <>
          <header className="dayakattai-header">
            <div className="dayakattai-eyebrow">
              TRADITIONAL TAMIL BOARD GAME
            </div>

            <h1>Dayakattai</h1>

            <p>
              A digital interpretation of the ancient game
              of Thaayam
            </p>
          </header>

          <section className="dayakattai-game-layout">
            <div className="dayakattai-board-container">
              <div className="dayakattai-board">
                {Array.from({ length: 25 }).map((_, index) => {
                  const pieces = getPiecesAt(index);

                  const isSafe = SAFE_SQUARES.includes(index);

                  return (
                    <div
                      key={index}
                      className={`dayakattai-cell ${
                        isSafe ? "safe" : ""
                      } ${
                        index === 12 ? "center" : ""
                      }`}
                    >
                      {index === 12 ? (
                        <div className="dayakattai-home">
                          <span>🪷</span>
                          <small>HOME</small>
                        </div>
                      ) : (
                        <>
                          {isSafe && (
                            <span className="dayakattai-star">
                              ✦
                            </span>
                          )}

                          <span className="dayakattai-cell-number">
                            {index + 1}
                          </span>

                          <div className="dayakattai-pieces">
                            {pieces.map((piece) => (
                              <button
                                key={`${piece.player}-${piece.piece}`}
                                className={`dayakattai-piece ${
                                  piece.player === currentPlayer &&
                                  selectedPiece === piece.piece
                                    ? "selected"
                                    : ""
                                }`}
                                style={{
                                  background:
                                    COLORS[piece.player],
                                }}
                                onClick={() => {
                                  if (
                                    piece.player ===
                                    currentPlayer
                                  ) {
                                    choosePiece(piece.piece);
                                  }
                                }}
                              >
                                {piece.piece + 1}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="dayakattai-board-caption">
                <span>✦ Safe Square</span>
                <span>🪷 Home</span>
              </div>
            </div>

            <aside className="dayakattai-control-panel">
              <div className="dayakattai-current-label">
                CURRENT PLAYER
              </div>

              <div
                className="dayakattai-current-player"
                style={{
                  borderColor: COLORS[currentPlayer],
                }}
              >
                <span
                  style={{
                    background: COLORS[currentPlayer],
                  }}
                />

                {players[currentPlayer].name}
              </div>

              <div className="dayakattai-dice-area">
                <div className="dayakattai-dice-title">
                  DAYAKATTAI
                </div>

                <button
                  className={`dayakattai-dice ${
                    rolling ? "rolling" : ""
                  }`}
                  onClick={rollDice}
                  disabled={
                    rolling ||
                    dice !== null ||
                    winner !== null
                  }
                >
                  {rolling ? "✦" : dice ?? "🎲"}
                </button>

                <p>Tap the dice to throw</p>
              </div>

              {dice !== null && (
                <div className="dayakattai-result">
                  <span>YOUR THROW</span>
                  <strong>{dice}</strong>
                </div>
              )}

              {selectedPiece !== null && (
                <button
                  className="dayakattai-confirm"
                  onClick={confirmMove}
                >
                  Move Piece {selectedPiece + 1}
                </button>
              )}

              <div className="dayakattai-message">
                {message}
              </div>

              <div className="dayakattai-players">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className={`dayakattai-player-row ${
                      player.id === currentPlayer
                        ? "active"
                        : ""
                    }`}
                  >
                    <span
                      className="player-dot"
                      style={{
                        background: player.color,
                      }}
                    />

                    <div>
                      <strong>{player.name}</strong>

                      <small>
                        {player.pieces.filter(
                          (piece) => piece === TRACK_LENGTH
                        ).length}{" "}
                        home •{" "}
                        {getHomePieces(player).length}{" "}
                        waiting
                      </small>
                    </div>
                  </div>
                ))}
              </div>

              <button
                className="dayakattai-restart"
                onClick={resetGame}
              >
                ↻ Restart Game
              </button>
            </aside>
          </section>

          <section className="dayakattai-history">
            <div className="dayakattai-eyebrow">
              HERITAGE
            </div>

            <h2>Thaayam — A Game of Patience & Strategy</h2>

            <p>
              Dayakattai, also known as Thaayam in Tamil,
              belongs to a family of traditional Indian race
              games. The game historically used wooden
              throwing pieces or dice-like implements and
              required players to combine chance with strategic
              movement.
            </p>

            <p>
              Regional rules can differ. Kridavirasat presents
              a digital interpretation designed to make the
              traditional style accessible to modern players
              while preserving its strategic character.
            </p>
          </section>
        </>
      )}

      {winner !== null && (
        <div className="dayakattai-overlay">
          <div className="dayakattai-winner">
            <div className="dayakattai-trophy">🏆</div>

            <div className="dayakattai-eyebrow">
              HERITAGE CHAMPION
            </div>

            <h2>Congratulations!</h2>

            <h3
              style={{
                color: COLORS[winner],
              }}
            >
              {players[winner].name}
            </h3>

            <p>
              You brought all four pieces home and mastered
              this round of Dayakattai.
            </p>

            <div className="dayakattai-winner-buttons">
              <button onClick={resetGame}>
                Play Again
              </button>

              <button
                onClick={() => router.push("/games")}
              >
                Other Games
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}