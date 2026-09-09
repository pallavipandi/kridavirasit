"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Color = "red" | "green" | "yellow" | "blue";

type Player = {
  name: string;
  color: Color;
  tokens: number[];
  finished: number;
};

const COLORS: Color[] = ["red", "green", "yellow", "blue"];

const COLOR_LABELS: Record<Color, string> = {
  red: "Crimson",
  green: "Forest",
  yellow: "Golden",
  blue: "Indigo",
};

/*
  ============================================================
  BOARD TRACK
  ============================================================

  The track is rotated so that:

  RED    = bottom-left
  GREEN  = top-left
  YELLOW = top-right
  BLUE   = bottom-right

  There are 52 outer-track positions.
*/

const TRACK: [number, number][] = [
  [8, 1],
  [8, 0],
  [7, 0],
  [6, 0],
  [6, 1],
  [6, 2],
  [6, 3],
  [6, 4],
  [6, 5],

  [5, 6],
  [4, 6],
  [3, 6],
  [2, 6],
  [1, 6],
  [0, 6],
  [0, 7],
  [0, 8],

  [1, 8],
  [2, 8],
  [3, 8],
  [4, 8],
  [5, 8],

  [6, 9],
  [6, 10],
  [6, 11],
  [6, 12],
  [6, 13],
  [6, 14],
  [7, 14],
  [8, 14],

  [8, 13],
  [8, 12],
  [8, 11],
  [8, 10],
  [8, 9],

  [9, 8],
  [10, 8],
  [11, 8],
  [12, 8],
  [13, 8],
  [14, 8],
  [14, 7],
  [14, 6],

  [13, 6],
  [12, 6],
  [11, 6],
  [10, 6],
  [9, 6],

  [8, 5],
  [8, 4],
  [8, 3],
  [8, 2],
];

/*
  Each player enters their own colored finishing lane
  after completing the 52-square outer journey.

  52,53,54,55,56 = final colored path
  57             = HOME / finished
*/

const HOME_LANES: Record<
  Color,
  [number, number][]
> = {
  red: [
    [7, 1],
    [7, 2],
    [7, 3],
    [7, 4],
    [7, 5],
  ],

  green: [
    [1, 7],
    [2, 7],
    [3, 7],
    [4, 7],
    [5, 7],
  ],

  yellow: [
    [7, 13],
    [7, 12],
    [7, 11],
    [7, 10],
    [7, 9],
  ],

  blue: [
    [13, 7],
    [12, 7],
    [11, 7],
    [10, 7],
    [9, 7],
  ],
};

/*
  Starting positions on the 52-square track.

  RED    -> 0
  GREEN  -> 13
  YELLOW -> 26
  BLUE   -> 39
*/

const START = [0, 13, 26, 39];

const FINISH = 57;

/*
  Safe positions.

  Starting squares are also safe.
*/
const SAFE = [
  0,
  8,
  13,
  21,
  26,
  34,
  39,
  47,
];

/*
  Find the track index from a board coordinate.
*/
function trackIndex(
  row: number,
  col: number
) {
  return TRACK.findIndex(
    ([r, c]) =>
      r === row && c === col
  );
}

/*
  ============================================================
  DICE
  ============================================================
*/

function DiceFace({
  value,
}: {
  value: number;
}) {
  const positions: Record<
    number,
    string[]
  > = {
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
    <span className="dice-face">
      {positions[value].map(
        (position, index) => (
          <span
            key={index}
            className={`dice-pip ${position}`}
          />
        )
      )}
    </span>
  );
}

/*
  ============================================================
  LUDO PAGE
  ============================================================
*/

export default function LudoPage() {
  const router = useRouter();

  const [players, setPlayers] =
    useState<Player[]>([
      {
        name: "Player 1",
        color: "red",
        tokens: [
          -1,
          -1,
          -1,
          -1,
        ],
        finished: 0,
      },

      {
        name: "Player 2",
        color: "green",
        tokens: [
          -1,
          -1,
          -1,
          -1,
        ],
        finished: 0,
      },

      {
        name: "Player 3",
        color: "yellow",
        tokens: [
          -1,
          -1,
          -1,
          -1,
        ],
        finished: 0,
      },

      {
        name: "Player 4",
        color: "blue",
        tokens: [
          -1,
          -1,
          -1,
          -1,
        ],
        finished: 0,
      },
    ]);

  const [currentPlayer, setCurrentPlayer] =
    useState(0);

  const [dice, setDice] =
    useState<number | null>(null);

  const [rolling, setRolling] =
    useState(false);

  const [winner, setWinner] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState(
      "Player 1's turn — tap the dice."
    );

  /*
    ==========================================================
    GET BOARD POSITION OF A TOKEN
    ==========================================================
  */

  function getTokenCoordinate(
    playerIndex: number,
    position: number
  ): [number, number] | null {
    if (position < 0) {
      return null;
    }

    /*
      Finished token is in the center.
    */
    if (position === FINISH) {
      return null;
    }

    /*
      Outer track.
    */
    if (position < 52) {
      const globalIndex =
        (START[playerIndex] +
          position) %
        52;

      return TRACK[globalIndex];
    }

    /*
      Colored final lane.
    */
    const playerColor =
      players[playerIndex].color;

    const lane =
      HOME_LANES[playerColor];

    const laneIndex =
      position - 52;

    if (
      laneIndex >= 0 &&
      laneIndex < lane.length
    ) {
      return lane[laneIndex];
    }

    return null;
  }

  /*
    ==========================================================
    MOVABLE TOKENS
    ==========================================================
  */

  function movableTokens(
    playerIndex: number,
    roll: number
  ) {
    return players[playerIndex].tokens
      .map(
        (position, index) => {
          /*
            Token is inside starting home.
          */
          if (position === -1) {
            return roll === 6
              ? index
              : null;
          }

          /*
            Finished tokens cannot move.
          */
          if (
            position === FINISH
          ) {
            return null;
          }

          /*
            Token must not go beyond HOME.
          */
          if (
            position + roll <=
            FINISH
          ) {
            return index;
          }

          return null;
        }
      )
      .filter(
        (x): x is number =>
          x !== null
      );
  }

  /*
    ==========================================================
    ROLL DICE
    ==========================================================
  */

  function rollDice() {
    if (
      rolling ||
      dice !== null ||
      winner
    ) {
      return;
    }

    setRolling(true);

    /*
      Random number from 1 to 6.
    */
    const value =
      Math.floor(
        Math.random() * 6
      ) + 1;

    setTimeout(() => {
      setRolling(false);
      setDice(value);

      const possible =
        movableTokens(
          currentPlayer,
          value
        );

      /*
        No legal move.
      */
      if (
        possible.length === 0
      ) {
        setMessage(
          `${players[currentPlayer].name} has no possible move.`
        );

        setTimeout(() => {
          /*
            Six gives another roll.
          */
          if (value === 6) {
            setDice(null);

            setMessage(
              `${players[currentPlayer].name} rolled a 6 — roll again.`
            );
          } else {
            nextPlayer();
          }
        }, 900);

        return;
      }

      /*
        Only one token can move.
      */
      if (
        possible.length === 1
      ) {
        setMessage(
          "Only one legal token — moving automatically."
        );

        setTimeout(() => {
          moveToken(
            possible[0],
            value,
            true
          );
        }, 650);

        return;
      }

      /*
        Multiple tokens.
      */
      setMessage(
        "Choose one of your available tokens."
      );
    }, 550);
  }

  /*
    ==========================================================
    MOVE TOKEN
    ==========================================================
  */

  function moveToken(
    tokenIndex: number,
    forcedRoll?: number,
    automatic = false
  ) {
    if (
      winner ||
      rolling
    ) {
      return;
    }

    const roll =
      forcedRoll ?? dice;

    if (roll === null) {
      return;
    }

    const possible =
      movableTokens(
        currentPlayer,
        roll
      );

    if (
      !possible.includes(
        tokenIndex
      )
    ) {
      setMessage(
        "That token cannot move with this roll."
      );

      return;
    }

    /*
      Deep copy players.
    */
    const updated =
      players.map(
        (player) => ({
          ...player,
          tokens: [
            ...player.tokens,
          ],
        })
      );

    const player =
      updated[currentPlayer];

    const oldPosition =
      player.tokens[tokenIndex];

    /*
      Six brings a token onto
      its starting square.
    */
    let newPosition: number;

    if (
      oldPosition === -1
    ) {
      newPosition = 0;
    } else {
      newPosition =
        oldPosition + roll;
    }

    player.tokens[tokenIndex] =
      newPosition;

    /*
      ========================================================
      CAPTURE
      ========================================================
    */

    if (
      newPosition < 52
    ) {
      const globalPosition =
        (START[currentPlayer] +
          newPosition) %
        52;

      /*
        Safe squares cannot be captured.
      */
      if (
        !SAFE.includes(
          globalPosition
        )
      ) {
        updated.forEach(
          (
            opponent,
            opponentIndex
          ) => {
            if (
              opponentIndex ===
              currentPlayer
            ) {
              return;
            }

            opponent.tokens.forEach(
              (
                opponentPosition,
                opponentTokenIndex
              ) => {
                if (
                  opponentPosition >=
                  0 &&
                  opponentPosition <
                    52
                ) {
                  const opponentGlobal =
                    (START[
                      opponentIndex
                    ] +
                      opponentPosition) %
                    52;

                  if (
                    opponentGlobal ===
                    globalPosition
                  ) {
                    opponent.tokens[
                      opponentTokenIndex
                    ] = -1;
                  }
                }
              }
            );
          }
        );
      }
    }

    /*
      ========================================================
      FINISHED TOKEN
      ========================================================
    */

    if (
      newPosition ===
      FINISH
    ) {
      player.finished += 1;
    }

    setPlayers(updated);

    /*
      Winner.
    */
    if (
      player.finished === 4
    ) {
      setWinner(
        player.name
      );

      setDice(null);

      setMessage(
        `🏆 ${player.name} has won the game!`
      );

      return;
    }

    /*
      Message.
    */
    if (automatic) {
      setMessage(
        `${player.name}'s only legal token moved automatically.`
      );
    } else {
      setMessage(
        `${player.name} moved token ${
          tokenIndex + 1
        }.`
      );
    }

    /*
      Six = another turn.
    */
    if (
      roll === 6
    ) {
      setDice(null);

      setMessage(
        `${player.name} rolled a 6 — roll again.`
      );

      return;
    }

    /*
      Normal next turn.
    */
    setTimeout(
      nextPlayer,
      550
    );
  }

  /*
    ==========================================================
    NEXT PLAYER
    ==========================================================
  */

  function nextPlayer() {
    const next =
      (currentPlayer + 1) %
      players.length;

    setCurrentPlayer(next);
    setDice(null);

    setMessage(
      `${players[next].name}'s turn — tap the dice.`
    );
  }

  /*
    ==========================================================
    TOKEN CLICK
    ==========================================================
  */

  function tokenClick(
    playerIndex: number,
    tokenIndex: number
  ) {
    /*
      Only current player.
    */
    if (
      playerIndex !==
      currentPlayer
    ) {
      setMessage(
        `It is ${players[currentPlayer].name}'s turn.`
      );

      return;
    }

    /*
      Need dice first.
    */
    if (
      dice === null
    ) {
      setMessage(
        "Tap the dice first."
      );

      return;
    }

    moveToken(
      tokenIndex
    );
  }

  /*
    ==========================================================
    RESTART
    ==========================================================
  */

  function restart() {
    setPlayers(
      players.map(
        (player) => ({
          ...player,
          tokens: [
            -1,
            -1,
            -1,
            -1,
          ],
          finished: 0,
        })
      )
    );

    setCurrentPlayer(0);
    setDice(null);
    setWinner(null);
    setRolling(false);

    setMessage(
      "Player 1's turn — tap the dice."
    );
  }

  /*
    ==========================================================
    RENDER TOKENS ON OUTER TRACK
    ==========================================================
  */

  function renderTrackTokens(
    row: number,
    col: number
  ) {
    const index =
      trackIndex(
        row,
        col
      );

    if (
      index === -1
    ) {
      return null;
    }

    const tokens: {
      player: number;
      token: number;
    }[] = [];

    players.forEach(
      (
        player,
        playerIndex
      ) => {
        player.tokens.forEach(
          (
            position,
            tokenIndex
          ) => {
            if (
              position >= 0 &&
              position < 52
            ) {
              const globalPosition =
                (START[
                  playerIndex
                ] +
                  position) %
                52;

              if (
                globalPosition ===
                index
              ) {
                tokens.push({
                  player:
                    playerIndex,
                  token:
                    tokenIndex,
                });
              }
            }
          }
        );
      }
    );

    return tokens.map(
      (item) => (
        <button
          key={`${item.player}-${item.token}`}
          className={`classic-token ${players[item.player].color}`}
          onClick={() =>
            tokenClick(
              item.player,
              item.token
            )
          }
          title={`${players[item.player].name} token ${
            item.token + 1
          }`}
        >
          {item.token + 1}
        </button>
      )
    );
  }

  /*
    ==========================================================
    RENDER HOME-LANE TOKENS
    ==========================================================
  */

  function renderLaneTokens(
    row: number,
    col: number
  ) {
    const tokens: {
      player: number;
      token: number;
    }[] = [];

    players.forEach(
      (
        player,
        playerIndex
      ) => {
        player.tokens.forEach(
          (
            position,
            tokenIndex
          ) => {
            const coordinate =
              getTokenCoordinate(
                playerIndex,
                position
              );

            if (
              coordinate &&
              coordinate[0] === row &&
              coordinate[1] === col
            ) {
              tokens.push({
                player:
                  playerIndex,
                token:
                  tokenIndex,
              });
            }
          }
        );
      }
    );

    return tokens.map(
      (item) => (
        <button
          key={`${item.player}-${item.token}`}
          className={`classic-token ${players[item.player].color}`}
          onClick={() =>
            tokenClick(
              item.player,
              item.token
            )
          }
        >
          {item.token + 1}
        </button>
      )
    );
  }

  /*
    ==========================================================
    HOME TOKENS
    ==========================================================
  */

  function homeTokens(
    playerIndex: number
  ) {
    return players[
      playerIndex
    ].tokens.map(
      (
        position,
        token
      ) => {
        /*
          Only show tokens that
          are actually inside home.
        */
        if (
          position !== -1
        ) {
          return null;
        }

        return (
          <button
            key={token}
            className={`home-token ${players[playerIndex].color}`}
            onClick={() =>
              tokenClick(
                playerIndex,
                token
              )
            }
          >
            {token + 1}
          </button>
        );
      }
    );
  }

  /*
    ==========================================================
    CENTER
    ==========================================================
  */

  function renderCenter() {
    return (
      <div className="classic-cell center-cell">
        <div className="center-design">
          <div className="center-red" />
          <div className="center-green" />
          <div className="center-yellow" />
          <div className="center-blue" />

          <span className="center-symbol">
            🪷
          </span>
        </div>
      </div>
    );
  }

  /*
    ==========================================================
    BOARD CELL
    ==========================================================
  */

  function renderCell(
    row: number,
    col: number
  ) {
    /*
      CENTER 3 x 3
    */
    if (
      row >= 6 &&
      row <= 8 &&
      col >= 6 &&
      col <= 8
    ) {
      return renderCenter();
    }

    /*
      GREEN HOME LANE
    */
    if (
      col === 7 &&
      row >= 1 &&
      row <= 5
    ) {
      return (
        <div className="classic-cell green-lane">
          {renderLaneTokens(
            row,
            col
          )}
        </div>
      );
    }

    /*
      BLUE HOME LANE
    */
    if (
      col === 7 &&
      row >= 9 &&
      row <= 13
    ) {
      return (
        <div className="classic-cell blue-lane">
          {renderLaneTokens(
            row,
            col
          )}
        </div>
      );
    }

    /*
      RED HOME LANE
    */
    if (
      row === 7 &&
      col >= 1 &&
      col <= 5
    ) {
      return (
        <div className="classic-cell red-lane">
          {renderLaneTokens(
            row,
            col
          )}
        </div>
      );
    }

    /*
      YELLOW HOME LANE
    */
    if (
      row === 7 &&
      col >= 9 &&
      col <= 13
    ) {
      return (
        <div className="classic-cell yellow-lane">
          {renderLaneTokens(
            row,
            col
          )}
        </div>
      );
    }

    /*
      OUTER TRACK
    */
    const index =
      trackIndex(
        row,
        col
      );

    if (
      index >= 0
    ) {
      return (
        <div
          className={`classic-cell track-cell ${
            SAFE.includes(index)
              ? "safe-cell"
              : ""
          }`}
        >
          {SAFE.includes(
            index
          ) && (
            <span className="star">
              ★
            </span>
          )}

          {renderTrackTokens(
            row,
            col
          )}
        </div>
      );
    }

    /*
      EMPTY
    */
    return (
      <div className="classic-cell empty-cell" />
    );
  }

  /*
    ==========================================================
    RETURN
    ==========================================================
  */

  return (
    <main className="ludo-page">

      {/* NAVIGATION */}

      <nav className="ludo-nav">

        <button
          className="ludo-nav-button"
          onClick={() =>
            router.push(
              "/games"
            )
          }
        >
          ← Games
        </button>

        <div className="ludo-logo">
          🪷 KRIDAVIRASAT
        </div>

        <button
          className="ludo-nav-button"
          onClick={() =>
            router.push(
              "/home"
            )
          }
        >
          Home
        </button>

      </nav>

      {/* HEADER */}

      <header className="ludo-header">

        <span>
          THE ROYAL GAME OF CHANCE & STRATEGY
        </span>

        <h1>
          Ludo
        </h1>

        <p>
          Inspired by the ancient Indian
          tradition of Pachisi
        </p>

        <div className="ludo-flower">
          ❈
        </div>

      </header>

      {/* GAME */}

      <section className="ludo-game-container">

        {/* BOARD */}

        <div className="classic-board-wrapper">

          <div className="classic-ludo-board">

            {/* GREEN — TOP LEFT */}

            <div className="classic-home green-home">

              <div className="home-title">
                GREEN
              </div>

              <div className="home-inner">
                {homeTokens(1)}
              </div>

            </div>

            {/* YELLOW — TOP RIGHT */}

            <div className="classic-home yellow-home">

              <div className="home-title">
                YELLOW
              </div>

              <div className="home-inner">
                {homeTokens(2)}
              </div>

            </div>

            {/* RED — BOTTOM LEFT */}

            <div className="classic-home red-home">

              <div className="home-title">
                RED
              </div>

              <div className="home-inner">
                {homeTokens(0)}
              </div>

            </div>

            {/* BLUE — BOTTOM RIGHT */}

            <div className="classic-home blue-home">

              <div className="home-title">
                BLUE
              </div>

              <div className="home-inner">
                {homeTokens(3)}
              </div>

            </div>

            {/* BOARD TRACK */}

            <div className="board-cells">

              {Array.from(
                {
                  length:
                    15 * 15,
                },
                (_, i) => {

                  const row =
                    Math.floor(
                      i / 15
                    );

                  const col =
                    i % 15;

                  /*
                    DO NOT draw board
                    cells over homes.
                  */

                  const inGreenHome =
                    row < 6 &&
                    col < 6;

                  const inYellowHome =
                    row < 6 &&
                    col > 8;

                  const inRedHome =
                    row > 8 &&
                    col < 6;

                  const inBlueHome =
                    row > 8 &&
                    col > 8;

                  if (
                    inGreenHome ||
                    inYellowHome ||
                    inRedHome ||
                    inBlueHome
                  ) {
                    return (
                      <div
                        key={i}
                        className="hidden-board-cell"
                      />
                    );
                  }

                  return (
                    <div
                      key={i}
                      className="board-grid-cell"
                    >
                      {renderCell(
                        row,
                        col
                      )}
                    </div>
                  );
                }
              )}

            </div>

          </div>

        </div>

        {/* SIDE PANEL */}

        <aside className="ludo-side-panel">

          <div className="ludo-panel-label">
            THE ROYAL JOURNEY
          </div>

          {/* CURRENT PLAYER */}

          <div className="ludo-current-player">

            <span>
              CURRENT TURN
            </span>

            <h2>
              {
                players[
                  currentPlayer
                ].name
              }
            </h2>

            <small>
              {
                COLOR_LABELS[
                  players[
                    currentPlayer
                  ].color
                ]
              }
            </small>

          </div>

          {/* DICE */}

          <div className="ludo-dice-section">

            <button
              className={`ludo-dice ${
                rolling
                  ? "ludo-dice-roll"
                  : ""
              }`}
              onClick={
                rollDice
              }
              disabled={
                rolling ||
                dice !== null ||
                winner !== null
              }
              aria-label="Roll dice"
            >

              {rolling ? (
                <span className="dice-rolling">
                  🎲
                </span>
              ) : dice !== null ? (
                <DiceFace
                  value={dice}
                />
              ) : (
                <span className="dice-question">
                  🎲
                </span>
              )}

            </button>

            <p className="ludo-dice-hint">

              {rolling
                ? "Rolling..."
                : dice !== null
                ? "Choose your token"
                : "Tap the dice"}

            </p>

          </div>

          {/* MESSAGE */}

          <div className="ludo-message">
            {message}
          </div>

          {/* PLAYERS */}

          <div className="ludo-player-list">

            {players.map(
              (
                player,
                index
              ) => (

                <div
                  key={index}
                  className={`ludo-player-row ${
                    currentPlayer ===
                    index
                      ? "ludo-active"
                      : ""
                  }`}
                >

                  <span
                    className={`ludo-mini-token ${player.color}`}
                  />

                  <div>

                    <strong>
                      {player.name}
                    </strong>

                    <small>
                      {
                        player.finished
                      }
                      /4 home
                    </small>

                  </div>

                </div>

              )
            )}

          </div>

          {/* RULES */}

          <details className="ludo-rules">

            <summary>
              How to Play
            </summary>

            <p>
              Tap the dice to roll.
            </p>

            <p>
              Roll a 6 to bring a
              token onto the board.
            </p>

            <p>
              Roll a 6 to get
              another turn.
            </p>

            <p>
              Landing on an opponent
              captures their token
              unless the square is safe.
            </p>

            <p>
              Reach the center with
              all four tokens to win.
            </p>

          </details>

          {/* RESTART */}

          <button
            className="ludo-restart"
            onClick={
              restart
            }
          >
            ↻ Restart Game
          </button>

        </aside>

      </section>

      {/* WINNER */}

      {winner && (

        <div className="ludo-winner-overlay">

          <div className="ludo-winner-card">

            <div className="ludo-trophy">
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
              has brought all four
              tokens home.
            </p>

            <div className="ludo-winner-buttons">

              <button
                onClick={
                  restart
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