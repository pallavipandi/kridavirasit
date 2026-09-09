"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Player = {
  name: string;
  position: number;
};

type SnakeConfig = {
  from: number;
  to: number;
  color: string;
  accent: string;
  curve1: { x: number; y: number };
  curve2: { x: number; y: number };
};

type LadderConfig = {
  from: number;
  to: number;
};

/* =========================================================
   SNAKES
   ========================================================= */

const snakes: Record<number, number> = {
  99: 54,
  95: 72,
  92: 51,
  83: 19,
  73: 1,
  64: 36,
  59: 17,
  49: 11,
  46: 25,
  31: 9,
};

/* =========================================================
   LADDERS
   ========================================================= */

const ladders: Record<number, number> = {
  2: 23,
  7: 29,
  8: 47,
  15: 37,
  21: 42,
  28: 55,
  36: 57,
  51: 67,
  71: 91,
  78: 98,
};

/* =========================================================
   BOARD
   ========================================================= */

const boardSquares: number[] = [];

for (let rowFromBottom = 9; rowFromBottom >= 0; rowFromBottom--) {
  const start = rowFromBottom * 10 + 1;
  const end = start + 9;

  if (rowFromBottom % 2 === 0) {
    for (let number = start; number <= end; number++) {
      boardSquares.push(number);
    }
  } else {
    for (let number = end; number >= start; number--) {
      boardSquares.push(number);
    }
  }
}

/* =========================================================
   BOARD COLOURS
   ========================================================= */

const boardColors = [
  "board-red",
  "board-green",
  "board-yellow",
  "board-blue",
  "board-white",
];

/* =========================================================
   ROUND NUMBER
   ========================================================= */

function roundNumber(value: number, decimals = 4) {
  const multiplier = 10 ** decimals;

  return Math.round(value * multiplier) / multiplier;
}

/* =========================================================
   DICE
   ========================================================= */

function DiceFace({ value }: { value: number }) {
  const pipPositions: Record<number, string[]> = {
    1: ["center"],

    2: [
      "top-left",
      "bottom-right",
    ],

    3: [
      "top-left",
      "center",
      "bottom-right",
    ],

    4: [
      "top-left",
      "top-right",
      "bottom-left",
      "bottom-right",
    ],

    5: [
      "top-left",
      "top-right",
      "center",
      "bottom-left",
      "bottom-right",
    ],

    6: [
      "top-left",
      "top-right",
      "middle-left",
      "middle-right",
      "bottom-left",
      "bottom-right",
    ],
  };

  return (
    <div className="dice-face">
      {pipPositions[value].map((position, index) => (
        <span
          key={`${position}-${index}`}
          className={`dice-pip dice-pip-${position}`}
        />
      ))}
    </div>
  );
}

/* =========================================================
   MAIN PAGE
   ========================================================= */

export default function ParamapadaSopanamPage() {
  const router = useRouter();

  const [players, setPlayers] = useState<Player[]>([
    {
      name: "Player 1",
      position: 0,
    },
    {
      name: "Player 2",
      position: 0,
    },
  ]);

  const [currentPlayer, setCurrentPlayer] = useState(0);

  const [dice, setDice] = useState<number | null>(null);

  const [message, setMessage] = useState(
    "Roll the dice to begin your journey."
  );

  const [winner, setWinner] = useState<string | null>(null);

  const [rolling, setRolling] = useState(false);

  /* =========================================================
     GET SQUARE POSITION
     ========================================================= */

  function getSquarePosition(square: number) {
    const index = boardSquares.indexOf(square);

    if (index === -1) {
      return {
        x: 0.5,
        y: 0.5,
      };
    }

    const row = Math.floor(index / 10);
    const column = index % 10;

    return {
      x: column + 0.5,
      y: row + 0.5,
    };
  }

  /* =========================================================
     LADDER DRAWING
     ========================================================= */

  function renderLadder(from: number, to: number) {
    const start = getSquarePosition(from);
    const end = getSquarePosition(to);

    const dx = end.x - start.x;
    const dy = end.y - start.y;

    const length = Math.sqrt(dx * dx + dy * dy);

    if (length === 0) {
      return null;
    }

    const nx = -dy / length;
    const ny = dx / length;

    /*
      Thick black wooden ladder.
    */

    const railGap = 0.15;

    const x1a = roundNumber(
      start.x + nx * railGap
    );

    const y1a = roundNumber(
      start.y + ny * railGap
    );

    const x1b = roundNumber(
      start.x - nx * railGap
    );

    const y1b = roundNumber(
      start.y - ny * railGap
    );

    const x2a = roundNumber(
      end.x + nx * railGap
    );

    const y2a = roundNumber(
      end.y + ny * railGap
    );

    const x2b = roundNumber(
      end.x - nx * railGap
    );

    const y2b = roundNumber(
      end.y - ny * railGap
    );

    const rungCount = Math.max(
      4,
      Math.min(
        10,
        Math.floor(length * 1.45)
      )
    );

    const rungs = [];

    for (let i = 1; i < rungCount; i++) {
      const t = i / rungCount;

      const leftX = roundNumber(
        x1a + (x2a - x1a) * t
      );

      const leftY = roundNumber(
        y1a + (y2a - y1a) * t
      );

      const rightX = roundNumber(
        x1b + (x2b - x1b) * t
      );

      const rightY = roundNumber(
        y1b + (y2b - y1b) * t
      );

      rungs.push(
        <line
          key={`rung-${from}-${to}-${i}`}
          x1={leftX}
          y1={leftY}
          x2={rightX}
          y2={rightY}
          className="reference-ladder-rung"
        />
      );
    }

    return (
      <g
        key={`ladder-${from}-${to}`}
        className="reference-ladder"
      >
        {/* Ladder shadow */}

        <line
          x1={x1a + 0.05}
          y1={y1a + 0.06}
          x2={x2a + 0.05}
          y2={y2a + 0.06}
          className="reference-ladder-shadow"
        />

        <line
          x1={x1b + 0.05}
          y1={y1b + 0.06}
          x2={x2b + 0.05}
          y2={y2b + 0.06}
          className="reference-ladder-shadow"
        />

        {/* Thick rails */}

        <line
          x1={x1a}
          y1={y1a}
          x2={x2a}
          y2={y2a}
          className="reference-ladder-rail"
        />

        <line
          x1={x1b}
          y1={y1b}
          x2={x2b}
          y2={y2b}
          className="reference-ladder-rail"
        />

        {/* Rungs */}

        {rungs}
      </g>
    );
  }

  /* =========================================================
     SNAKE CONFIGURATION
     =========================================================

     Each snake gets its own control points.
     This creates large S-shaped / winding snakes.
     ========================================================= */

  const snakeConfigs: SnakeConfig[] = [
    {
      from: 99,
      to: 54,
      color: "#168b49",
      accent: "#a7cf22",
      curve1: { x: 7.5, y: 0.6 },
      curve2: { x: 7.7, y: 2.0 },
    },

    {
      from: 95,
      to: 72,
      color: "#e8b92d",
      accent: "#f15b2a",
      curve1: { x: 4.0, y: 1.1 },
      curve2: { x: 5.6, y: 2.1 },
    },

    {
      from: 92,
      to: 51,
      color: "#eee8df",
      accent: "#7c4ac1",
      curve1: { x: 8.7, y: 1.1 },
      curve2: { x: 8.8, y: 2.4 },
    },

    {
      from: 83,
      to: 19,
      color: "#f0c62b",
      accent: "#9b2935",
      curve1: { x: 1.5, y: 2.3 },
      curve2: { x: 2.7, y: 3.8 },
    },

    {
      from: 73,
      to: 1,
      color: "#f0c62b",
      accent: "#ee6b25",
      curve1: { x: 7.5, y: 2.9 },
      curve2: { x: 5.8, y: 5.0 },
    },

    {
      from: 64,
      to: 36,
      color: "#d7a978",
      accent: "#7d422c",
      curve1: { x: 2.0, y: 4.0 },
      curve2: { x: 2.6, y: 5.5 },
    },

    {
      from: 59,
      to: 17,
      color: "#f0c72d",
      accent: "#ee5331",
      curve1: { x: 7.8, y: 5.0 },
      curve2: { x: 6.0, y: 6.4 },
    },

    {
      from: 49,
      to: 11,
      color: "#eee7d8",
      accent: "#6942aa",
      curve1: { x: 4.8, y: 7.0 },
      curve2: { x: 5.4, y: 8.3 },
    },

    {
      from: 46,
      to: 25,
      color: "#f0c72b",
      accent: "#d94a28",
      curve1: { x: 5.0, y: 5.4 },
      curve2: { x: 5.0, y: 6.7 },
    },

    {
      from: 31,
      to: 9,
      color: "#16944b",
      accent: "#b3d326",
      curve1: { x: 9.2, y: 7.0 },
      curve2: { x: 8.3, y: 8.6 },
    },
  ];

  /* =========================================================
     SNAKE PATH
     ========================================================= */

  function createSnakePath(
    config: SnakeConfig
  ) {
    const start = getSquarePosition(
      config.from
    );

    const end = getSquarePosition(
      config.to
    );

    return [
      `M ${roundNumber(start.x)} ${roundNumber(start.y)}`,
      `C ${roundNumber(config.curve1.x)} ${roundNumber(
        config.curve1.y
      )}`,
      `${roundNumber(config.curve2.x)} ${roundNumber(
        config.curve2.y
      )}`,
      `${roundNumber(end.x)} ${roundNumber(end.y)}`,
    ].join(" ");
  }

  /* =========================================================
     SNAKE HEAD ANGLE
     ========================================================= */

  function getSnakeAngle(
    config: SnakeConfig
  ) {
    const start = getSquarePosition(
      config.from
    );

    const angle =
      (Math.atan2(
        config.curve1.y - start.y,
        config.curve1.x - start.x
      ) *
        180) /
      Math.PI;

    return roundNumber(angle, 2);
  }

  /* =========================================================
     SNAKE DRAWING
     ========================================================= */

  function renderSnake(
    config: SnakeConfig
  ) {
    const path =
      createSnakePath(config);

    const start =
      getSquarePosition(
        config.from
      );

    const end =
      getSquarePosition(
        config.to
      );

    const headAngle =
      getSnakeAngle(config);

    return (
      <g
        key={`snake-${config.from}-${config.to}`}
        className="reference-snake"
      >
        {/* =============================================
            SOFT SHADOW
            ============================================= */}

        <path
          d={path}
          className="reference-snake-shadow"
        />

        {/* =============================================
            BLACK OUTLINE
            ============================================= */}

        <path
          d={path}
          className="reference-snake-outline"
        />

        {/* =============================================
            MAIN COLOUR
            ============================================= */}

        <path
          d={path}
          className="reference-snake-body"
          style={{
            stroke: config.color,
          }}
        />

        {/* =============================================
            INNER STRIPE
            ============================================= */}

        <path
          d={path}
          className="reference-snake-stripe"
          style={{
            stroke: config.accent,
          }}
        />

        {/* =============================================
            PATTERN
            ============================================= */}

        <path
          d={path}
          className="reference-snake-pattern"
        />

        {/* =============================================
            HEAD
            ============================================= */}

        <g
          transform={`translate(${roundNumber(
            start.x
          )} ${roundNumber(
            start.y
          )}) rotate(${headAngle})`}
        >
          {/* Head outline */}

          <ellipse
            cx="0"
            cy="0"
            rx="0.34"
            ry="0.25"
            className="reference-snake-head-outline"
          />

          {/* Head */}

          <ellipse
            cx="0"
            cy="0"
            rx="0.29"
            ry="0.20"
            className="reference-snake-head"
            style={{
              fill: config.color,
            }}
          />

          {/* Head accent */}

          <path
            d="M -0.18 -0.11 Q 0 -0.19 0.17 -0.09"
            className="reference-snake-head-accent"
            style={{
              stroke: config.accent,
            }}
          />

          {/* Eye white */}

          <circle
            cx="0.13"
            cy="-0.08"
            r="0.065"
            className="reference-snake-eye-white"
          />

          {/* Eye */}

          <circle
            cx="0.145"
            cy="-0.08"
            r="0.031"
            className="reference-snake-eye"
          />

          {/* Small second eye detail */}

          <circle
            cx="0.157"
            cy="-0.09"
            r="0.009"
            className="reference-snake-eye-shine"
          />

          {/* Nose */}

          <ellipse
            cx="0.255"
            cy="0"
            rx="0.035"
            ry="0.022"
            className="reference-snake-nose"
          />

          {/* Forked tongue */}

          <path
            d="
              M 0.27 0
              L 0.40 0
              M 0.40 0
              L 0.47 -0.06
              M 0.40 0
              L 0.47 0.06
            "
            className="reference-snake-tongue"
          />
        </g>

        {/* =============================================
            TAIL
            ============================================= */}

        <path
          d="
            M -0.13 0
            Q 0 0.07 0.13 0
          "
          transform={`translate(${end.x} ${end.y})`}
          className="reference-snake-tail"
        />
      </g>
    );
  }

  /* =========================================================
     DICE ROLL
     ========================================================= */

  function rollDice() {
    if (rolling || winner) {
      return;
    }

    setRolling(true);

    const value =
      Math.floor(Math.random() * 6) + 1;

    setTimeout(() => {
      setDice(value);

      const updatedPlayers = [...players];

      const player =
        updatedPlayers[currentPlayer];

      let newPosition =
        player.position + value;

      /* ===============================================
         EXACT 100
         =============================================== */

      if (newPosition > 100) {
        setMessage(
          `${player.name} needs an exact number to reach 100.`
        );

        setRolling(false);

        setCurrentPlayer(
          (currentPlayer + 1) %
            updatedPlayers.length
        );

        return;
      }

      let specialMessage = "";

      /* ===============================================
         LADDER
         =============================================== */

      if (ladders[newPosition]) {
        const destination =
          ladders[newPosition];

        newPosition = destination;

        specialMessage =
          `🪜 ${player.name} climbed a ladder to ${destination}!`;
      }

      /* ===============================================
         SNAKE
         =============================================== */

      if (snakes[newPosition]) {
        const destination =
          snakes[newPosition];

        newPosition = destination;

        specialMessage =
          `🐍 ${player.name} slid down a snake to ${destination}!`;
      }

      updatedPlayers[currentPlayer] = {
        ...player,
        position: newPosition,
      };

      setPlayers(updatedPlayers);

      /* ===============================================
         WINNER
         =============================================== */

      if (newPosition === 100) {
        setWinner(player.name);

        setMessage(
          `🏆 ${player.name} has reached the sacred summit!`
        );

        setRolling(false);

        return;
      }

      if (specialMessage) {
        setMessage(specialMessage);
      } else {
        setMessage(
          `${player.name} moved to square ${newPosition}.`
        );
      }

      setCurrentPlayer(
        (currentPlayer + 1) %
          updatedPlayers.length
      );

      setRolling(false);
    }, 600);
  }

  /* =========================================================
     RESTART
     ========================================================= */

  function restartGame() {
    setPlayers(
      players.map((player) => ({
        ...player,
        position: 0,
      }))
    );

    setCurrentPlayer(0);
    setDice(null);
    setWinner(null);
    setRolling(false);

    setMessage(
      "Roll the dice to begin your journey."
    );
  }

  /* =========================================================
     PLAYERS ON SQUARE
     ========================================================= */

  function getPlayerAtSquare(
    square: number
  ) {
    return players.filter(
      (player) =>
        player.position === square
    );
  }

  /* =========================================================
     PAGE
     ========================================================= */

  return (
    <main className="sopanam-page">

      {/* =====================================================
          NAVIGATION
          ===================================================== */}

      <nav className="sopanam-nav">

        <button
          onClick={() =>
            router.push("/games")
          }
          className="sopanam-back"
        >
          ← Games
        </button>

        <div className="sopanam-logo">
          🪷 KRIDAVIRASAT
        </div>

        <button
          onClick={() =>
            router.push("/home")
          }
          className="sopanam-home"
        >
          Home
        </button>

      </nav>

      {/* =====================================================
          HEADER
          ===================================================== */}

      <section className="sopanam-header">

        <span>
          INDIAN KNOWLEDGE SYSTEM
        </span>

        <h1>
          Paramapada Sopanam
        </h1>

        <p>
          The ancient journey of virtue,
          destiny and wisdom
        </p>

        <div className="sopanam-symbol">
          ❈
        </div>

      </section>

      {/* =====================================================
          GAME AREA
          ===================================================== */}

      <section className="sopanam-game-area">

        {/* ===================================================
            BOARD
            =================================================== */}

        <div className="sopanam-board">

          {/* BOARD CELLS */}

          {boardSquares.map(
            (square, index) => {

              const playersHere =
                getPlayerAtSquare(
                  square
                );

              const colorClass =
                boardColors[
                  (square - 1) %
                    boardColors.length
                ];

              const isTop =
                square === 100;

              return (
                <div
                  key={square}
                  className={`sopanam-square ${colorClass} ${
                    isTop
                      ? "summit-square"
                      : ""
                  }`}
                >
                  <span className="square-number">
                    {square}
                  </span>

                  {isTop && (
                    <span className="summit-star">
                      ★
                    </span>
                  )}

                  {square === 1 && (
                    <span className="start-mark">
                      START
                    </span>
                  )}

                  <div className="players-on-square">
                    {playersHere.map(
                      (
                        player
                      ) => {
                        const playerIndex =
                          players.indexOf(
                            player
                          );

                        return (
                          <span
                            key={`${player.name}-${playerIndex}`}
                            className={`player-token player-${playerIndex}`}
                            title={
                              player.name
                            }
                          >
                            {playerIndex +
                              1}
                          </span>
                        );
                      }
                    )}
                  </div>
                </div>
              );
            }
          )}

          {/* =================================================
              SVG OVERLAY
              ================================================= */}

          <svg
            className="sopanam-board-overlay"
            viewBox="0 0 10 10"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/* LADDERS */}

            {Object.entries(
              ladders
            ).map(
              ([from, to]) =>
                renderLadder(
                  Number(from),
                  Number(to)
                )
            )}

            {/* SNAKES */}

            {snakeConfigs.map(
              (snake) =>
                renderSnake(
                  snake
                )
            )}
          </svg>
        </div>

        {/* ===================================================
            SIDE PANEL
            =================================================== */}

        <aside className="sopanam-panel">

          <div className="sopanam-panel-title">
            YOUR JOURNEY
          </div>

          {/* PLAYERS */}

          <div className="sopanam-players">

            <h2>
              Players
            </h2>

            {players.map(
              (
                player,
                index
              ) => (
                <div
                  key={index}
                  className={`sopanam-player ${
                    currentPlayer ===
                    index
                      ? "active-player"
                      : ""
                  }`}
                >
                  <span
                    className={`player-token player-${index}`}
                  >
                    {index + 1}
                  </span>

                  <div>
                    <strong>
                      {player.name}
                    </strong>

                    <small>
                      Square{" "}
                      {player.position}
                    </small>
                  </div>
                </div>
              )
            )}
          </div>

          {/* DICE */}

          <div className="sopanam-dice-area">

            <p>
              {
                players[
                  currentPlayer
                ].name
              }'s Turn
            </p>

            <div
              className={`sopanam-dice ${
                rolling
                  ? "dice-rolling"
                  : ""
              }`}
            >
              {dice ? (
                <DiceFace
                  value={dice}
                />
              ) : (
                <span className="dice-question">
                  🎲
                </span>
              )}
            </div>

            <button
              onClick={rollDice}
              disabled={
                rolling ||
                !!winner
              }
              className="roll-button"
            >
              {rolling
                ? "Rolling..."
                : "Roll Dice"}
            </button>
          </div>

          {/* MESSAGE */}

          <div className="sopanam-message">
            {message}
          </div>

          {/* RESTART */}

          <button
            onClick={restartGame}
            className="restart-button"
          >
            ↻ Restart Game
          </button>

        </aside>
      </section>

      {/* =====================================================
          WINNER
          ===================================================== */}

      {winner && (
        <div className="winner-overlay">

          <div className="winner-card">

            <div className="winner-symbol">
              🏆
            </div>

            <span>
              THE JOURNEY IS COMPLETE
            </span>

            <h2>
              Congratulations!
            </h2>

            <p>
              <strong>
                {winner}
              </strong>{" "}
              has reached the sacred
              summit of Paramapada
              Sopanam.
            </p>

            <div className="winner-quote">
              "The journey upward is the
              journey of wisdom."
            </div>

            <div className="winner-buttons">

              <button
                onClick={
                  restartGame
                }
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