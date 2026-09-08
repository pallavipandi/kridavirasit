"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Piece = {
  type: "tiger" | "goat";
  id: number;
  position: number;
};

const POINTS = [
  { x: 50, y: 8 },
  { x: 25, y: 25 },
  { x: 50, y: 25 },
  { x: 75, y: 25 },
  { x: 12, y: 50 },
  { x: 30, y: 50 },
  { x: 50, y: 50 },
  { x: 70, y: 50 },
  { x: 88, y: 50 },
  { x: 25, y: 75 },
  { x: 50, y: 75 },
  { x: 75, y: 75 },
  { x: 50, y: 92 },
];

const CONNECTIONS = [
  [0, 1],
  [0, 2],
  [0, 3],

  [1, 2],
  [2, 3],

  [1, 4],
  [1, 5],
  [2, 5],
  [2, 6],
  [2, 7],
  [3, 7],
  [3, 8],

  [4, 5],
  [5, 6],
  [6, 7],
  [7, 8],

  [4, 9],
  [5, 9],
  [5, 10],
  [6, 10],
  [7, 10],
  [7, 11],
  [8, 11],

  [9, 10],
  [10, 11],

  [9, 12],
  [10, 12],
  [11, 12],
];

const SAFE_POINTS = [0, 2, 4, 8, 12];

function createInitialPieces(): Piece[] {
  return [
    { type: "tiger", id: 0, position: 0 },
    { type: "tiger", id: 1, position: 2 },
    { type: "tiger", id: 2, position: 3 },

    ...Array.from({ length: 15 }, (_, i) => ({
      type: "goat" as const,
      id: i,
      position: -1,
    })),
  ];
}

export default function AaduPuliAattamPage() {
  const router = useRouter();

  const [pieces, setPieces] = useState<Piece[]>(
    createInitialPieces()
  );

  const [turn, setTurn] = useState<"tiger" | "goat">("goat");

  const [selected, setSelected] = useState<number | null>(
    null
  );

  const [goatsPlaced, setGoatsPlaced] = useState(0);
  const [capturedGoats, setCapturedGoats] = useState(0);

  const [winner, setWinner] = useState<
    "tiger" | "goat" | null
  >(null);

  const [message, setMessage] = useState(
    "Goat player's turn. Place a goat on the board."
  );

  function resetGame() {
    setPieces(createInitialPieces());
    setTurn("goat");
    setSelected(null);
    setGoatsPlaced(0);
    setCapturedGoats(0);
    setWinner(null);
    setMessage(
      "Goat player's turn. Place a goat on the board."
    );
  }

  function areConnected(a: number, b: number) {
    return CONNECTIONS.some(
      ([x, y]) =>
        (x === a && y === b) ||
        (x === b && y === a)
    );
  }

  function pieceAt(position: number) {
    return pieces.find(
      (piece) => piece.position === position
    );
  }

  function tigerCanJump(
    tigerPosition: number,
    destination: number
  ) {
    if (!areConnected(tigerPosition, destination)) {
      return false;
    }

    return true;
  }

  function getTigerCaptureMoves(
    tigerPosition: number
  ) {
    const captures: {
      middle: number;
      landing: number;
    }[] = [];

    CONNECTIONS.forEach(([a, b]) => {
      if (a !== tigerPosition && b !== tigerPosition) {
        return;
      }

      const adjacent = a === tigerPosition ? b : a;

      if (pieceAt(adjacent)?.type !== "goat") {
        return;
      }

      CONNECTIONS.forEach(([c, d]) => {
        if (c !== adjacent && d !== adjacent) {
          return;
        }

        const landing = c === adjacent ? d : c;

        if (landing === tigerPosition) {
          return;
        }

        if (!areConnected(adjacent, landing)) {
          return;
        }

        if (!pieceAt(landing)) {
          captures.push({
            middle: adjacent,
            landing,
          });
        }
      });
    });

    return captures;
  }

  function getValidTigerDestinations(
    tigerPosition: number
  ) {
    const destinations: number[] = [];

    CONNECTIONS.forEach(([a, b]) => {
      if (a === tigerPosition && !pieceAt(b)) {
        destinations.push(b);
      }

      if (b === tigerPosition && !pieceAt(a)) {
        destinations.push(a);
      }
    });

    return destinations;
  }

  function getCaptureForDestination(
    tigerPosition: number,
    destination: number
  ) {
    const path = CONNECTIONS.filter(
      ([a, b]) =>
        (a === tigerPosition && b === destination) ||
        (a === destination && b === tigerPosition)
    );

    if (path.length > 0) {
      return null;
    }

    /*
      Find a goat between tiger and destination
      using the board's graph.
    */

    for (const middle of POINTS.map((_, i) => i)) {
      if (
        pieceAt(middle)?.type !== "goat"
      ) {
        continue;
      }

      if (
        areConnected(tigerPosition, middle) &&
        areConnected(middle, destination) &&
        !pieceAt(destination)
      ) {
        return middle;
      }
    }

    return null;
  }

  function handlePointClick(position: number) {
    if (winner) {
      return;
    }

    /*
      GOAT TURN
    */

    if (turn === "goat") {
      if (goatsPlaced >= 15) {
        setMessage(
          "All goats have been placed. Select a goat to move."
        );

        return;
      }

      if (pieceAt(position)) {
        return;
      }

      const newGoat: Piece = {
        type: "goat",
        id: goatsPlaced,
        position,
      };

      const updated = [...pieces, newGoat];

      setPieces(updated);
      setGoatsPlaced(goatsPlaced + 1);

      setSelected(null);

      /*
        Once all goats are placed,
        the goat can continue moving.
      */

      setTurn("tiger");

      setMessage(
        "Tiger player's turn. Select a tiger."
      );

      return;
    }

    /*
      TIGER TURN
    */

    const clickedPiece = pieceAt(position);

    if (
      clickedPiece &&
      clickedPiece.type === "tiger"
    ) {
      setSelected(clickedPiece.id);

      setMessage(
        "Tiger selected. Choose an empty connected point or a capture point."
      );

      return;
    }

    if (selected === null) {
      setMessage("Select one of the tigers first.");
      return;
    }

    const tiger = pieces.find(
      (piece) =>
        piece.type === "tiger" &&
        piece.id === selected
    );

    if (!tiger) {
      return;
    }

    const normalMoves = getValidTigerDestinations(
      tiger.position
    );

    if (normalMoves.includes(position)) {
      moveTiger(
        tiger.id,
        tiger.position,
        position,
        null
      );

      return;
    }

    const capturedGoat =
      getCaptureForDestination(
        tiger.position,
        position
      );

    if (capturedGoat !== null) {
      moveTiger(
        tiger.id,
        tiger.position,
        position,
        capturedGoat
      );

      return;
    }

    setMessage("That is not a valid tiger move.");
  }

  function moveTiger(
    tigerId: number,
    oldPosition: number,
    newPosition: number,
    capturedGoat: number | null
  ) {
    let updated = pieces.map((piece) =>
      piece.type === "tiger" &&
      piece.id === tigerId
        ? {
            ...piece,
            position: newPosition,
          }
        : piece
    );

    if (capturedGoat !== null) {
      updated = updated.map((piece) =>
        piece.type === "goat" &&
        piece.position === capturedGoat
          ? {
              ...piece,
              position: -1,
            }
          : piece
      );

      setCapturedGoats((value) => value + 1);

      setMessage(
        "Tiger captured a goat! Tiger gets another turn."
      );

      setPieces(updated);
      setSelected(null);

      /*
        Tigers win if enough goats have been captured.
      */

      if (capturedGoats + 1 >= 5) {
        setWinner("tiger");

        setMessage(
          "The tigers have overcome the goats!"
        );

        return;
      }

      return;
    }

    setPieces(updated);
    setSelected(null);

    setTurn("goat");

    setMessage(
      "Goat player's turn. Move a goat or place another goat."
    );

    /*
      Check whether goats have any possible moves.
    */

    if (goatsPlaced >= 15) {
      setTimeout(() => {
        checkGoatBlock(updated);
      }, 50);
    }
  }

  function handleGoatPieceClick(
    pieceId: number
  ) {
    if (winner || turn !== "goat") {
      return;
    }

    if (goatsPlaced < 15) {
      setMessage(
        "More goats still need to be placed."
      );

      return;
    }

    const goat = pieces.find(
      (piece) =>
        piece.type === "goat" &&
        piece.id === pieceId
    );

    if (!goat || goat.position === -1) {
      return;
    }

    setSelected(pieceId);

    setMessage(
      "Goat selected. Choose an empty connected point."
    );
  }

  function handleGoatDestination(position: number) {
    if (
      winner ||
      turn !== "goat" ||
      selected === null
    ) {
      return;
    }

    const goat = pieces.find(
      (piece) =>
        piece.type === "goat" &&
        piece.id === selected
    );

    if (!goat || goat.position === -1) {
      return;
    }

    if (pieceAt(position)) {
      return;
    }

    if (!areConnected(goat.position, position)) {
      setMessage(
        "Goats can only move along connected lines."
      );

      return;
    }

    const updated = pieces.map((piece) =>
      piece.type === "goat" &&
      piece.id === selected
        ? {
            ...piece,
            position,
          }
        : piece
    );

    setPieces(updated);
    setSelected(null);

    setTurn("tiger");

    setMessage(
      "Tiger player's turn. Select a tiger."
    );
  }

  function checkGoatBlock(currentPieces: Piece[]) {
    const goats = currentPieces.filter(
      (piece) =>
        piece.type === "goat" &&
        piece.position !== -1
    );

    const tigers = currentPieces.filter(
      (piece) => piece.type === "tiger"
    );

    let tigerHasMove = false;

    tigers.forEach((tiger) => {
      const normalMoves =
        getValidTigerDestinationsForState(
          tiger.position,
          currentPieces
        );

      if (normalMoves.length > 0) {
        tigerHasMove = true;
      }

      const captureMoves =
        getCaptureMovesForState(
          tiger.position,
          currentPieces
        );

      if (captureMoves.length > 0) {
        tigerHasMove = true;
      }
    });

    if (!tigerHasMove && goats.length > 0) {
      setWinner("goat");

      setMessage(
        "The goats have successfully blocked all tigers!"
      );
    }
  }

  function getValidTigerDestinationsForState(
    tigerPosition: number,
    state: Piece[]
  ) {
    const result: number[] = [];

    CONNECTIONS.forEach(([a, b]) => {
      if (
        a === tigerPosition &&
        !state.some(
          (piece) => piece.position === b
        )
      ) {
        result.push(b);
      }

      if (
        b === tigerPosition &&
        !state.some(
          (piece) => piece.position === a
        )
      ) {
        result.push(a);
      }
    });

    return result;
  }

  function getCaptureMovesForState(
    tigerPosition: number,
    state: Piece[]
  ) {
    const result: number[] = [];

    const occupied = (position: number) =>
      state.find(
        (piece) => piece.position === position
      );

    for (const middle of POINTS.map((_, i) => i)) {
      if (
        occupied(middle)?.type !== "goat"
      ) {
        continue;
      }

      if (!areConnected(tigerPosition, middle)) {
        continue;
      }

      CONNECTIONS.forEach(([a, b]) => {
        if (a === middle && b !== tigerPosition) {
          if (!occupied(b)) {
            result.push(b);
          }
        }

        if (b === middle && a !== tigerPosition) {
          if (!occupied(a)) {
            result.push(a);
          }
        }
      });
    }

    return result;
  }

  function renderLines() {
    return CONNECTIONS.map(([a, b], index) => {
      const p1 = POINTS[a];
      const p2 = POINTS[b];

      return (
        <line
          key={index}
          x1={`${p1.x}%`}
          y1={`${p1.y}%`}
          x2={`${p2.x}%`}
          y2={`${p2.y}%`}
          className="aadu-line"
        />
      );
    });
  }

  function renderPiece(piece: Piece) {
    if (piece.position === -1) {
      return null;
    }

    const point = POINTS[piece.position];

    const isSelected =
      piece.id === selected;

    return (
      <button
        key={`${piece.type}-${piece.id}`}
        className={`aadu-piece ${
          piece.type === "tiger"
            ? "tiger-piece"
            : "goat-piece"
        } ${isSelected ? "selected" : ""}`}
        style={{
          left: `${point.x}%`,
          top: `${point.y}%`,
        }}
        onClick={(event) => {
          event.stopPropagation();

          if (piece.type === "tiger") {
            if (turn === "tiger") {
              setSelected(piece.id);

              setMessage(
                "Tiger selected. Choose where to move."
              );
            }
          } else {
            handleGoatPieceClick(piece.id);
          }
        }}
      >
        {piece.type === "tiger" ? "🐅" : "🐐"}
      </button>
    );
  }

  function isValidDestination(position: number) {
    if (selected === null) {
      return false;
    }

    if (turn === "goat") {
      const goat = pieces.find(
        (piece) =>
          piece.type === "goat" &&
          piece.id === selected
      );

      if (!goat || goat.position === -1) {
        return false;
      }

      return (
        !pieceAt(position) &&
        areConnected(goat.position, position)
      );
    }

    const tiger = pieces.find(
      (piece) =>
        piece.type === "tiger" &&
        piece.id === selected
    );

    if (!tiger) {
      return false;
    }

    if (
      getValidTigerDestinations(
        tiger.position
      ).includes(position)
    ) {
      return true;
    }

    return (
      getCaptureForDestination(
        tiger.position,
        position
      ) !== null
    );
  }

  return (
    <main className="aadu-page">
      <nav className="aadu-nav">
        <button
          onClick={() => router.push("/games")}
          className="aadu-nav-button"
        >
          ← Games
        </button>

        <div className="aadu-brand">
          🪷 KRIDAVIRASAT
        </div>

        <button
          onClick={() => router.push("/home")}
          className="aadu-nav-button"
        >
          Home
        </button>
      </nav>

      <header className="aadu-header">
        <div className="aadu-eyebrow">
          TRADITIONAL SOUTH INDIAN STRATEGY GAME
        </div>

        <h1>Aadu Puli Aattam</h1>

        <p>
          The ancient game of Goats and Tigers
        </p>
      </header>

      <section className="aadu-layout">
        <div className="aadu-board-card">
          <div className="aadu-board">
            <svg
              className="aadu-lines"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {renderLines()}
            </svg>

            {POINTS.map((point, index) => (
              <button
                key={index}
                className={`aadu-point ${
                  SAFE_POINTS.includes(index)
                    ? "safe"
                    : ""
                } ${
                  isValidDestination(index)
                    ? "valid"
                    : ""
                }`}
                style={{
                  left: `${point.x}%`,
                  top: `${point.y}%`,
                }}
                onClick={() => {
                  if (
                    turn === "goat" &&
                    selected !== null
                  ) {
                    handleGoatDestination(index);
                  } else {
                    handlePointClick(index);
                  }
                }}
              >
                {SAFE_POINTS.includes(index) && (
                  <span>✦</span>
                )}
              </button>
            ))}

            {pieces.map(renderPiece)}
          </div>

          <div className="aadu-board-key">
            <span>
              <b>✦</b> Traditional safe point
            </span>

            <span>
              🐅 Tiger
            </span>

            <span>
              🐐 Goat
            </span>
          </div>
        </div>

        <aside className="aadu-panel">
          <div className="aadu-turn-label">
            CURRENT TURN
          </div>

          <div
            className={`aadu-turn ${
              turn === "tiger"
                ? "tiger-turn"
                : "goat-turn"
            }`}
          >
            {turn === "tiger"
              ? "🐅 Tiger Player"
              : "🐐 Goat Player"}
          </div>

          <div className="aadu-message">
            {message}
          </div>

          <div className="aadu-score-card">
            <div className="aadu-score tiger-score">
              <span>🐅</span>

              <div>
                <strong>Tigers</strong>

                <small>
                  3 Tigers
                </small>
              </div>
            </div>

            <div className="aadu-score">
              <span>🐐</span>

              <div>
                <strong>Goats</strong>

                <small>
                  {goatsPlaced}/15 placed
                </small>
              </div>
            </div>

            <div className="aadu-captured">
              Goats captured:
              <strong>
                {capturedGoats}/5
              </strong>
            </div>
          </div>

          <div className="aadu-rules">
            <h3>How To Play</h3>

            <p>
              🐐 Goats must surround and block the
              tigers.
            </p>

            <p>
              🐅 Tigers move along the lines and
              capture goats by jumping over them.
            </p>

            <p>
              The goats win when the tigers can no
              longer make a legal move.
            </p>

            <p>
              The tigers win after capturing
              five goats.
            </p>
          </div>

          <button
            className="aadu-reset"
            onClick={resetGame}
          >
            ↻ Restart Game
          </button>
        </aside>
      </section>

      <section className="aadu-history">
        <div className="aadu-eyebrow">
          HERITAGE OF THE GAME
        </div>

        <h2>
          Aadu Puli Aattam
        </h2>

        <p>
          Aadu Puli Aattam, meaning “Goat and Tiger
          Game”, is a traditional asymmetric strategy
          game associated with South India. One side
          controls a small number of powerful tigers,
          while the other controls a larger group of
          goats.
        </p>

        <p>
          The unequal forces make the game especially
          interesting: the tigers rely on mobility and
          capturing, while the goats depend on
          cooperation, positioning and blocking.
        </p>

        <div className="aadu-history-cards">
          <div>
            <span>🐅</span>
            <h3>Tiger Strategy</h3>
            <p>
              Use mobility and carefully planned
              captures.
            </p>
          </div>

          <div>
            <span>🐐</span>
            <h3>Goat Strategy</h3>
            <p>
              Build a defensive formation and
              restrict the tigers.
            </p>
          </div>

          <div>
            <span>🪷</span>
            <h3>Cultural Heritage</h3>
            <p>
              Discover traditional South Indian
              games through Kridavirasat.
            </p>
          </div>
        </div>
      </section>

      {winner && (
        <div className="aadu-overlay">
          <div className="aadu-winner">
            <div className="aadu-trophy">
              🏆
            </div>

            <div className="aadu-eyebrow">
              KRIDAVIRASAT CHAMPION
            </div>

            <h2>
              {winner === "tiger"
                ? "The Tigers Win!"
                : "The Goats Win!"}
            </h2>

            <p>
              {winner === "tiger"
                ? "Five goats have been captured. The tigers have conquered the board."
                : "The tigers are completely blocked. The goats have defended their herd!"}
            </p>

            <div className="aadu-winner-buttons">
              <button onClick={resetGame}>
                Play Again
              </button>

              <button
                onClick={() =>
                  router.push("/games")
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