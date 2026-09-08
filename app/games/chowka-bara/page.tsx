"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type PlayerColor = "red" | "green" | "yellow" | "blue";

type Player = {
  id: number;
  name: string;
  color: PlayerColor;
};

type Token = {
  id: number;
  player: number;
  step: number; // -1 = home, 0..24 = board, 25 = finished
};

const BOARD_SIZE = 5;
const TRACK_LENGTH = 25;
const TOKENS_PER_PLAYER = 4;

const COLORS: PlayerColor[] = [
  "red",
  "green",
  "yellow",
  "blue",
];

const COLOR_EMOJI: Record<PlayerColor, string> = {
  red: "🔴",
  green: "🟢",
  yellow: "🟡",
  blue: "🔵",
};

/*
  A 5 x 5 Chowka Bara inspired board.

  The outside cells form the movement track.
  The four corner regions represent player homes.
*/

const TRACK: number[] = [
  0, 1, 2, 3, 4,
  9, 14, 19, 24,
  23, 22, 21, 20,
  15, 10, 5,
];

const TRACK_COORDINATES: Record<number, [number, number]> = {
  0: [0, 0],
  1: [0, 1],
  2: [0, 2],
  3: [0, 3],
  4: [0, 4],

  5: [1, 4],
  6: [2, 4],
  7: [3, 4],
  8: [4, 4],

  9: [4, 3],
  10: [4, 2],
  11: [4, 1],
  12: [4, 0],

  13: [3, 0],
  14: [2, 0],
  15: [1, 0],
};

const SAFE_STEPS = [
  0,
  4,
  8,
  12,
  13,
  14,
  15,
];

function createPlayers(): Player[] {
  return [
    {
      id: 0,
      name: "Player 1",
      color: "red",
    },
    {
      id: 1,
      name: "Player 2",
      color: "green",
    },
    {
      id: 2,
      name: "Player 3",
      color: "yellow",
    },
    {
      id: 3,
      name: "Player 4",
      color: "blue",
    },
  ];
}

function createTokens(): Token[] {
  return Array.from(
    { length: 16 },
    (_, index) => ({
      id: index,
      player: Math.floor(index / 4),
      step: -1,
    })
  );
}

export default function ChowkaBaraPage() {
  const router = useRouter();

  const [players, setPlayers] =
    useState<Player[]>(createPlayers());

  const [playerCount, setPlayerCount] =
    useState(2);

  const [tokens, setTokens] =
    useState<Token[]>(createTokens());

  const [currentPlayer, setCurrentPlayer] =
    useState(0);

  const [roll, setRoll] =
    useState<number | null>(null);

  const [selectedToken, setSelectedToken] =
    useState<number | null>(null);

  const [winner, setWinner] =
    useState<number | null>(null);

  const [message, setMessage] =
    useState(
      "Roll the traditional cowrie dice to begin."
    );

  const [rolling, setRolling] =
    useState(false);

  const [started, setStarted] =
    useState(false);

  const activePlayers = useMemo(
    () => players.slice(0, playerCount),
    [players, playerCount]
  );

  function startGame() {
    setStarted(true);
    setTokens(createTokens());
    setCurrentPlayer(0);
    setRoll(null);
    setSelectedToken(null);
    setWinner(null);
    setMessage(
      `${players[0].name}'s turn. Roll the cowrie dice.`
    );
  }

  function resetGame() {
    setStarted(false);
    setTokens(createTokens());
    setCurrentPlayer(0);
    setRoll(null);
    setSelectedToken(null);
    setWinner(null);
    setMessage(
      "Choose the number of players and begin."
    );
  }

  function rollDice() {
    if (
      !started ||
      rolling ||
      winner !== null
    ) {
      return;
    }

    setRolling(true);
    setSelectedToken(null);

    const finalRoll =
      Math.floor(Math.random() * 4) + 1;

    setTimeout(() => {
      setRoll(finalRoll);
      setRolling(false);

      const playerTokens = tokens.filter(
        (token) =>
          token.player === currentPlayer
      );

      const movable = playerTokens.filter(
        (token) =>
          getPossibleDestination(
            token,
            finalRoll
          ) !== null
      );

      if (movable.length === 0) {
        setMessage(
          `${players[currentPlayer].name} has no possible move.`
        );

        setTimeout(() => {
          nextTurn();
        }, 900);

        return;
      }

      /*
        If only one token can move,
        automatically move it.
      */

      if (movable.length === 1) {
        moveToken(
          movable[0],
          finalRoll
        );
      } else {
        setMessage(
          `${players[currentPlayer].name}, choose a token to move.`
        );
      }
    }, 550);
  }

  function getPossibleDestination(
    token: Token,
    dice: number
  ): number | null {
    if (token.step === 25) {
      return null;
    }

    /*
      A token in home enters the board
      when the player rolls a 1.
    */

    if (token.step === -1) {
      if (dice === 1) {
        return 0;
      }

      return null;
    }

    const destination =
      token.step + dice;

    if (destination > TRACK_LENGTH) {
      return null;
    }

    return destination;
  }

  function moveToken(
    token: Token,
    dice: number
  ) {
    const destination =
      getPossibleDestination(
        token,
        dice
      );

    if (destination === null) {
      return;
    }

    let updatedTokens = tokens.map(
      (current) =>
        current.id === token.id
          ? {
              ...current,
              step: destination,
            }
          : current
    );

    /*
      Capture an opponent token if
      the destination is not a safe square.
    */

    if (
      destination >= 0 &&
      destination < TRACK_LENGTH &&
      !SAFE_STEPS.includes(destination)
    ) {
      const opponent = updatedTokens.find(
        (other) =>
          other.id !== token.id &&
          other.player !== currentPlayer &&
          other.step === destination
      );

      if (opponent) {
        updatedTokens =
          updatedTokens.map((other) =>
            other.id === opponent.id
              ? {
                  ...other,
                  step: -1,
                }
              : other
          );

        setMessage(
          `${players[currentPlayer].name} captured an opponent token!`
        );
      }
    }

    setTokens(updatedTokens);
    setSelectedToken(null);

    const playerFinished =
      updatedTokens.filter(
        (item) =>
          item.player === currentPlayer &&
          item.step === 25
      ).length;

    if (
      playerFinished === TOKENS_PER_PLAYER
    ) {
      setWinner(currentPlayer);

      setMessage(
        `${players[currentPlayer].name} has won Chowka Bara!`
      );

      return;
    }

    /*
      Rolling a 4 gives another turn,
      representing the traditional bonus-turn
      idea used in several regional versions.
    */

    if (dice === 4) {
      setRoll(null);

      setMessage(
        `${players[currentPlayer].name} rolled a 4 and gets another turn!`
      );

      return;
    }

    nextTurn();
  }

  function nextTurn() {
    const next =
      (currentPlayer + 1) %
      activePlayers.length;

    setCurrentPlayer(next);
    setRoll(null);
    setSelectedToken(null);

    setMessage(
      `${activePlayers[next].name}'s turn. Roll the cowrie dice.`
    );
  }

  function handleTokenClick(
    token: Token
  ) {
    if (
      !started ||
      winner !== null ||
      token.player !== currentPlayer ||
      roll === null
    ) {
      return;
    }

    const destination =
      getPossibleDestination(
        token,
        roll
      );

    if (destination === null) {
      setMessage(
        "That token cannot move with this roll."
      );

      return;
    }

    setSelectedToken(token.id);

    setMessage(
      `${players[currentPlayer].name} selected a token.`
    );
  }

  function confirmSelectedToken() {
    if (
      selectedToken === null ||
      roll === null
    ) {
      return;
    }

    const token = tokens.find(
      (item) =>
        item.id === selectedToken
    );

    if (!token) {
      return;
    }

    moveToken(token, roll);
  }

  function getTokenBoardPosition(
    token: Token
  ): [number, number] | null {
    if (
      token.step < 0 ||
      token.step >= TRACK_LENGTH
    ) {
      return null;
    }

    const cell =
      TRACK[token.step % TRACK.length];

    return [
      Math.floor(cell / BOARD_SIZE),
      cell % BOARD_SIZE,
    ];
  }

  function tokensOnCell(
    cellIndex: number
  ) {
    return tokens.filter((token) => {
      const position =
        getTokenBoardPosition(token);

      if (!position) {
        return false;
      }

      return (
        position[0] * BOARD_SIZE +
          position[1] ===
        cellIndex
      );
    });
  }

  function renderToken(
    token: Token
  ) {
    const position =
      getTokenBoardPosition(token);

    if (!position) {
      return null;
    }

    const cellIndex =
      position[0] * BOARD_SIZE +
      position[1];

    const cellTokens =
      tokensOnCell(cellIndex);

    const index =
      cellTokens.findIndex(
        (item) => item.id === token.id
      );

    const offset =
      index === 0
        ? [0, 0]
        : index === 1
        ? [18, 0]
        : index === 2
        ? [0, 18]
        : [18, 18];

    const selected =
      selectedToken === token.id;

    const movable =
      token.player === currentPlayer &&
      roll !== null &&
      getPossibleDestination(
        token,
        roll
      ) !== null;

    return (
      <button
        key={token.id}
        className={`chowka-token ${tokenPlayerClass(
          token.player
        )} ${selected ? "selected" : ""} ${
          movable ? "movable" : ""
        }`}
        style={{
          left: `calc(${
            (position[1] * 20) + 10
          }% + ${offset[0]}px)`,
          top: `calc(${
            (position[0] * 20) + 10
          }% + ${offset[1]}px)`,
        }}
        onClick={() =>
          handleTokenClick(token)
        }
      >
        {token.player + 1}
      </button>
    );
  }

  function tokenPlayerClass(
    player: number
  ) {
    return `player-${player}`;
  }

  function renderHomeTokens(
    player: number
  ) {
    const homeTokens =
      tokens.filter(
        (token) =>
          token.player === player &&
          token.step === -1
      );

    return (
      <div className="chowka-home-tokens">
        {homeTokens.map((token) => (
          <button
            key={token.id}
            className={`chowka-home-token ${tokenPlayerClass(
              player
            )}`}
            onClick={() =>
              handleTokenClick(token)
            }
          >
            {token.id % 4 + 1}
          </button>
        ))}
      </div>
    );
  }

  function renderBoardCell(
    index: number
  ) {
    const isSafe =
      SAFE_STEPS.includes(index);

    const center =
      index === 12;

    const cellTokens =
      tokensOnCell(index);

    return (
      <div
        key={index}
        className={`chowka-cell ${
          isSafe ? "safe" : ""
        } ${center ? "center" : ""}`}
      >
        {center && (
          <div className="chowka-center-symbol">
            🪷
          </div>
        )}

        {isSafe && !center && (
          <span className="safe-symbol">
            ✦
          </span>
        )}

        {cellTokens.map(renderToken)}
      </div>
    );
  }

  if (!started) {
    return (
      <main className="chowka-page">
        <nav className="chowka-nav">
          <button
            className="chowka-nav-button"
            onClick={() =>
              router.push("/games")
            }
          >
            ← Games
          </button>

          <div className="chowka-logo">
            🪷 KRIDAVIRASAT
          </div>

          <button
            className="chowka-nav-button"
            onClick={() =>
              router.push("/home")
            }
          >
            Home
          </button>
        </nav>

        <section className="chowka-start">
          <div className="chowka-eyebrow">
            TRADITIONAL SOUTH INDIAN GAME
          </div>

          <h1>Chowka Bara</h1>

          <p className="chowka-subtitle">
            A classic race and strategy game
            from the Indian subcontinent.
          </p>

          <div className="chowka-start-card">
            <div className="chowka-start-art">
              🪷
            </div>

            <h2>
              Prepare the Game
            </h2>

            <p>
              Choose how many people will play.
              Each player controls four tokens.
            </p>

            <label>
              Number of Players
            </label>

            <div className="player-count">
              {[2, 3, 4].map((count) => (
                <button
                  key={count}
                  className={
                    playerCount === count
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setPlayerCount(count)
                  }
                >
                  {count}
                </button>
              ))}
            </div>

            <div className="chowka-player-list">
              {players
                .slice(0, playerCount)
                .map((player, index) => (
                  <div
                    key={player.id}
                    className="chowka-player-input"
                  >
                    <span>
                      {COLOR_EMOJI[player.color]}
                    </span>

                    <input
                      value={player.name}
                      onChange={(event) => {
                        const updated = [
                          ...players,
                        ];

                        updated[index] = {
                          ...updated[index],
                          name:
                            event.target.value,
                        };

                        setPlayers(updated);
                      }}
                      placeholder={`Player ${
                        index + 1
                      } name`}
                    />
                  </div>
                ))}
            </div>

            <button
              className="chowka-start-button"
              onClick={startGame}
            >
              Begin Chowka Bara
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="chowka-page">
      <nav className="chowka-nav">
        <button
          className="chowka-nav-button"
          onClick={() =>
            router.push("/games")
          }
        >
          ← Games
        </button>

        <div className="chowka-logo">
          🪷 KRIDAVIRASAT
        </div>

        <button
          className="chowka-nav-button"
          onClick={() =>
            router.push("/home")
          }
        >
          Home
        </button>
      </nav>

      <header className="chowka-header">
        <div className="chowka-eyebrow">
          INDIAN KNOWLEDGE SYSTEM PRESENTS
        </div>

        <h1>Chowka Bara</h1>

        <p>
          Roll • Race • Capture • Reach Home
        </p>
      </header>

      <section className="chowka-layout">
        <div className="chowka-board-wrapper">
          <div className="chowka-board">
            {Array.from(
              { length: 25 },
              (_, index) =>
                renderBoardCell(index)
            )}
          </div>

          <div className="chowka-homes">
            {activePlayers.map(
              (player) => (
                <div
                  key={player.id}
                  className={`chowka-home ${
                    tokenPlayerClass(
                      player.id
                    )
                  }`}
                >
                  <div className="home-title">
                    {COLOR_EMOJI[player.color]}{" "}
                    {player.name}
                  </div>

                  {renderHomeTokens(
                    player.id
                  )}
                </div>
              )
            )}
          </div>
        </div>

        <aside className="chowka-control">
          <div className="current-player">
            <small>
              CURRENT PLAYER
            </small>

            <strong>
              {
                COLOR_EMOJI[
                  players[
                    currentPlayer
                  ].color
                ]
              }{" "}
              {
                players[
                  currentPlayer
                ].name
              }
            </strong>
          </div>

          <div className="cowrie-dice">
            <div
              className={`cowrie ${
                rolling ? "rolling" : ""
              }`}
              onClick={rollDice}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" ||
                  event.key === " "
                ) {
                  rollDice();
                }
              }}
            >
              {roll === null
                ? "◉"
                : "⚀⚁⚂⚃".charAt(
                    Math.max(
                      0,
                      roll - 1
                    )
                  )}
            </div>

            <p>
              Tap the dice to roll
            </p>
          </div>

          <div className="roll-result">
            {roll !== null ? (
              <>
                <span>
                  Roll
                </span>

                <strong>
                  {roll}
                </strong>
              </>
            ) : (
              <span>
                Awaiting roll
              </span>
            )}
          </div>

          <div className="chowka-message">
            {message}
          </div>

          {selectedToken !== null &&
            roll !== null && (
              <button
                className="confirm-move"
                onClick={
                  confirmSelectedToken
                }
              >
                Move Selected Token
              </button>
            )}

          <button
            className="restart-button"
            onClick={resetGame}
          >
            ↻ Restart
          </button>

          <div className="chowka-rules">
            <h3>
              How To Play
            </h3>

            <p>
              🎲 Tap the cowrie dice to
              roll.
            </p>

            <p>
              🏠 A token enters the board
              with the required opening
              roll.
            </p>

            <p>
              🏃 Move your token around
              the board according to
              the number rolled.
            </p>

            <p>
              ⚔️ Land on an opponent's
              unprotected token to send
              it home.
            </p>

            <p>
              ✦ Safe spaces protect
              tokens from capture.
            </p>

            <p>
              🏆 Get all four tokens
              home to win.
            </p>
          </div>
        </aside>
      </section>

      <section className="chowka-history">
        <div className="chowka-eyebrow">
          HERITAGE
        </div>

        <h2>
          The Story Behind Chowka Bara
        </h2>

        <p>
          Chowka Bara is a traditional
          Indian race and strategy game
          associated particularly with
          Karnataka and neighbouring
          regions. It belongs to the
          family of games in which players
          move pieces around a board while
          balancing chance and strategy.
        </p>

        <p>
          Traditional games like Chowka
          Bara were often played in homes,
          courtyards and village
          communities. They provided
          entertainment while encouraging
          counting, planning, observation,
          patience and friendly
          competition.
        </p>

        <div className="heritage-grid">
          <div>
            <span>🎲</span>

            <h3>
              Chance
            </h3>

            <p>
              The dice introduces
              unpredictability.
            </p>
          </div>

          <div>
            <span>🧠</span>

            <h3>
              Strategy
            </h3>

            <p>
              Players must decide which
              token should move.
            </p>
          </div>

          <div>
            <span>🤝</span>

            <h3>
              Community
            </h3>

            <p>
              Traditional games brought
              families and communities
              together.
            </p>
          </div>

          <div>
            <span>🪷</span>

            <h3>
              Heritage
            </h3>

            <p>
              Kridavirasat helps preserve
              these traditions digitally.
            </p>
          </div>
        </div>
      </section>

      {winner !== null && (
        <div className="chowka-overlay">
          <div className="chowka-winner">
            <div className="winner-lamp">
              🪔
            </div>

            <div className="chowka-eyebrow">
              KRIDAVIRASAT CHAMPION
            </div>

            <h2>
              Congratulations!
            </h2>

            <p>
              <strong>
                {
                  players[winner].name
                }
              </strong>{" "}
              has mastered Chowka Bara!
            </p>

            <div className="winner-badge">
              🏆
            </div>

            <p>
              You have carried the spirit
              of traditional Indian play
              to victory.
            </p>

            <div className="winner-actions">
              <button
                onClick={startGame}
              >
                Play Again
              </button>

              <button
                onClick={() =>
                  router.push(
                    "/games"
                  )
                }
              >
                Choose Another Game
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}