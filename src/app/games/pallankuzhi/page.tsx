"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Phase = "info" | "players" | "game" | "winner";

export default function PallankuzhiPage() {
  const router = useRouter();

  const [phase, setPhase] = useState<Phase>("info");

  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");

  const [board, setBoard] = useState<number[]>(
    Array(14).fill(5)
  );

  const [scores, setScores] = useState([0, 0]);

  const [currentPlayer, setCurrentPlayer] = useState(0);

  const [message, setMessage] = useState(
    "Choose one of your pits to begin."
  );

  const [winner, setWinner] = useState("");

  const [showRules, setShowRules] = useState(false);

  /*
   * --------------------------------------------------
   * START GAME
   * --------------------------------------------------
   */

  function startGame() {
    if (!player1.trim() || !player2.trim()) {
      alert("Please enter both player names.");
      return;
    }

    setBoard(Array(14).fill(5));
    setScores([0, 0]);
    setCurrentPlayer(0);
    setMessage(
      `${player1}, choose one of your pits to begin.`
    );
    setPhase("game");
  }

  /*
   * --------------------------------------------------
   * RESTART
   * --------------------------------------------------
   */

  function restartGame() {
    setBoard(Array(14).fill(5));
    setScores([0, 0]);
    setCurrentPlayer(0);
    setWinner("");
    setMessage(
      `${player1}, choose one of your pits to begin.`
    );
    setPhase("game");
  }

  /*
   * --------------------------------------------------
   * END GAME CHECK
   * --------------------------------------------------
   */

  function checkGameEnd(
    updatedBoard: number[],
    updatedScores: number[]
  ) {
    const player1Empty = updatedBoard
      .slice(0, 7)
      .every((value) => value === 0);

    const player2Empty = updatedBoard
      .slice(7, 14)
      .every((value) => value === 0);

    if (!player1Empty && !player2Empty) {
      return false;
    }

    const finalScores = [...updatedScores];

    for (let i = 0; i < 7; i++) {
      finalScores[0] += updatedBoard[i];
      finalScores[1] += updatedBoard[i + 7];
    }

    setScores(finalScores);

    if (finalScores[0] > finalScores[1]) {
      setWinner(player1);
    } else if (finalScores[1] > finalScores[0]) {
      setWinner(player2);
    } else {
      setWinner("DRAW");
    }

    setPhase("winner");

    return true;
  }

  /*
   * --------------------------------------------------
   * PLAY PIT
   * --------------------------------------------------
   */

  function playPit(index: number) {
    /*
     * Player 1 owns pits 0–6.
     * Player 2 owns pits 7–13.
     */

    const belongsToPlayer =
      currentPlayer === 0
        ? index >= 0 && index <= 6
        : index >= 7 && index <= 13;

    if (!belongsToPlayer) {
      setMessage(
        `It is ${currentPlayer === 0 ? player1 : player2
        }'s turn. Choose one of your own pits.`
      );

      return;
    }

    if (board[index] === 0) {
      setMessage(
        "That pit is empty. Choose another pit."
      );

      return;
    }

    const newBoard = [...board];

    let seeds = newBoard[index];

    newBoard[index] = 0;

    let position = index;

    /*
     * DISTRIBUTE SEEDS
     */

    while (seeds > 0) {
      position = (position + 1) % 14;

      /*
       * Do not place seeds back into the
       * original pit during the same move.
       */

      if (position === index) {
        continue;
      }

      newBoard[position] += 1;
      seeds--;
    }

    /*
     * SIMPLE CAPTURE RULE
     *
     * If the final pit has exactly two or four seeds,
     * capture them if the pit belongs to the opponent.
     */

    let newScores = [...scores];

    const opponentStart =
      currentPlayer === 0 ? 7 : 0;

    const opponentEnd =
      currentPlayer === 0 ? 13 : 6;

    if (
      position >= opponentStart &&
      position <= opponentEnd &&
      (newBoard[position] === 2 ||
        newBoard[position] === 4)
    ) {
      newScores[currentPlayer] +=
        newBoard[position];

      setMessage(
        `${currentPlayer === 0 ? player1 : player2
        } captured ${newBoard[position]} seeds!`
      );

      newBoard[position] = 0;
    } else {
      setMessage(
        `${currentPlayer === 0 ? player1 : player2
        } played their move.`
      );
    }

    setBoard(newBoard);
    setScores(newScores);

    /*
     * Check if game ended.
     */

    const ended = checkGameEnd(
      newBoard,
      newScores
    );

    if (ended) {
      return;
    }

    /*
     * Change turn.
     */

    const nextPlayer =
      currentPlayer === 0 ? 1 : 0;

    setCurrentPlayer(nextPlayer);

    setMessage(
      `${nextPlayer === 0 ? player1 : player2
      }, it is your turn.`
    );
  }

  /*
   * --------------------------------------------------
   * INFO SCREEN
   * --------------------------------------------------
   */

  if (phase === "info") {
    return (
      <main className="pallankuzhi-page">

        <nav className="pallankuzhi-nav">

          <button
            className="pk-back"
            onClick={() => router.push("/games")}
          >
            ← Games
          </button>

          <div className="pk-nav-logo">
            🪷 KRIDAVIRASAT
          </div>

          <button
            className="pk-home"
            onClick={() => router.push("/home")}
          >
            Home
          </button>

        </nav>


        <section className="pk-hero">

          <div className="pk-hero-symbol">
            ❈
          </div>

          <small>
            TRADITIONAL GAME · SOUTH INDIA
          </small>

          <h1>
            Pallankuzhi
          </h1>

          <p className="pk-subtitle">
            The Ancient Game of Seeds
          </p>

          <div className="pk-divider">
            ✦
          </div>

          <p className="pk-introduction">

            A beautiful traditional counting and
            strategy game played across South India.
            Pallankuzhi combines mathematics,
            memory and strategy in a simple wooden
            board filled with seeds.

          </p>

        </section>


        <section className="pk-information">

          <div className="pk-info-card">

            <span className="pk-info-icon">
              🪔
            </span>

            <h2>
              About the Game
            </h2>

            <p>

              Pallankuzhi, also known in different
              regions by related names, is a traditional
              South Indian mancala-style game.

              <br />
              <br />

              It is traditionally played using a
              wooden board containing fourteen small
              pits. Players use seeds, shells or
              small stones as playing pieces.

              <br />
              <br />

              The game develops counting ability,
              concentration, planning and strategic
              thinking.

            </p>

          </div>


          <div className="pk-info-card">

            <span className="pk-info-icon">
              📜
            </span>

            <h2>
              In Ancient Times
            </h2>

            <p>

              Pallankuzhi was traditionally played
              in homes and communities, particularly
              across Tamil regions and other parts
              of South India.

              <br />
              <br />

              Wooden boards were often kept as
              household objects and games could be
              enjoyed by children and adults.

              <br />
              <br />

              Beyond entertainment, traditional games
              like Pallankuzhi helped develop mental
              arithmetic, patience and strategic
              thinking.

            </p>

          </div>

        </section>


        <section className="pk-how">

          <div className="pk-section-heading">

            <small>
              BEFORE YOU PLAY
            </small>

            <h2>
              How To Play
            </h2>

          </div>


          <div className="pk-rules-grid">

            <div>
              <span>01</span>
              <h3>Choose a Pit</h3>
              <p>
                Select one of the seven pits on
                your side of the board.
              </p>
            </div>

            <div>
              <span>02</span>
              <h3>Collect Seeds</h3>
              <p>
                All seeds from your selected pit
                are picked up.
              </p>
            </div>

            <div>
              <span>03</span>
              <h3>Distribute</h3>
              <p>
                Seeds are distributed one by one
                into the following pits.
              </p>
            </div>

            <div>
              <span>04</span>
              <h3>Capture</h3>
              <p>
                Strategic captures allow you to
                collect seeds and increase your score.
              </p>
            </div>

          </div>


          <button
            className="pk-start-reading"
            onClick={() => setPhase("players")}
          >
            I Understand — Set Up Game →
          </button>

        </section>


        <footer className="pk-footer">
          <span>🪷 KRIDAVIRASAT</span>
          <p>
            Rediscover the Heritage of Indian Play
          </p>
        </footer>

      </main>
    );
  }


  /*
   * --------------------------------------------------
   * PLAYER SETUP
   * --------------------------------------------------
   */

  if (phase === "players") {
    return (
      <main className="pallankuzhi-page">

        <nav className="pallankuzhi-nav">

          <button
            className="pk-back"
            onClick={() => setPhase("info")}
          >
            ← Back
          </button>

          <div className="pk-nav-logo">
            🪷 KRIDAVIRASAT
          </div>

          <button
            className="pk-home"
            onClick={() => router.push("/home")}
          >
            Home
          </button>

        </nav>


        <section className="pk-player-setup">

          <div className="pk-small-symbol">
            ❈
          </div>

          <small>
            PREPARE FOR PLAY
          </small>

          <h1>
            Who is playing?
          </h1>

          <p>
            Pallankuzhi is traditionally played
            between two players.
          </p>


          <div className="pk-player-cards">

            <div className="pk-player-card">

              <div className="player-number">
                01
              </div>

              <div className="player-icon">
                🪔
              </div>

              <label>
                Player One
              </label>

              <input
                value={player1}
                onChange={(e) =>
                  setPlayer1(e.target.value)
                }
                placeholder="Enter first player's name"
              />

            </div>


            <div className="pk-player-card">

              <div className="player-number">
                02
              </div>

              <div className="player-icon">
                🌿
              </div>

              <label>
                Player Two
              </label>

              <input
                value={player2}
                onChange={(e) =>
                  setPlayer2(e.target.value)
                }
                placeholder="Enter second player's name"
              />

            </div>

          </div>


          <button
            className="pk-begin-button"
            onClick={startGame}
          >
            Begin Pallankuzhi →
          </button>


          <button
            className="pk-rules-link"
            onClick={() => setShowRules(true)}
          >
            View Full Rules
          </button>

        </section>


        {showRules && (
          <div
            className="pk-modal-overlay"
            onClick={() => setShowRules(false)}
          >

            <div
              className="pk-rules-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <button
                className="pk-close"
                onClick={() =>
                  setShowRules(false)
                }
              >
                ×
              </button>

              <small>
                PALLANKUZHI
              </small>

              <h2>
                Game Rules
              </h2>

              <ol>

                <li>
                  Two players participate.
                </li>

                <li>
                  Each player controls seven pits.
                </li>

                <li>
                  Each pit begins with five seeds.
                </li>

                <li>
                  On your turn, choose one of
                  your pits.
                </li>

                <li>
                  Pick up all the seeds from that pit.
                </li>

                <li>
                  Distribute them one by one into
                  the following pits.
                </li>

                <li>
                  Captured seeds are added to your
                  score.
                </li>

                <li>
                  The player with the highest score
                  wins.
                </li>

              </ol>

            </div>

          </div>
        )}

      </main>
    );
  }


  /*
   * --------------------------------------------------
   * GAME BOARD
   * --------------------------------------------------
   */

  if (phase === "game") {
    return (
      <main className="pallankuzhi-page game-screen">

        <nav className="pallankuzhi-nav">

          <button
            className="pk-back"
            onClick={() => setPhase("players")}
          >
            ← Setup
          </button>

          <div className="pk-nav-logo">
            🪷 KRIDAVIRASAT
          </div>

          <button
            className="pk-home"
            onClick={() => setShowRules(true)}
          >
            Rules
          </button>

        </nav>


        <section className="pk-game-header">

          <small>
            PALLANKUZHI · THE GAME OF SEEDS
          </small>

          <h1>
            {currentPlayer === 0
              ? player1
              : player2}
            's Turn
          </h1>

          <p>
            {message}
          </p>

        </section>


        <section className="pk-scoreboard">

          <div
            className={
              currentPlayer === 0
                ? "score-card active-score"
                : "score-card"
            }
          >

            <small>
              PLAYER ONE
            </small>

            <strong>
              {player1}
            </strong>

            <span>
              {scores[0]} Seeds
            </span>

          </div>


          <div className="pk-vs">
            VS
          </div>


          <div
            className={
              currentPlayer === 1
                ? "score-card active-score"
                : "score-card"
            }
          >

            <small>
              PLAYER TWO
            </small>

            <strong>
              {player2}
            </strong>

            <span>
              {scores[1]} Seeds
            </span>

          </div>

        </section>


        <section className="pk-board-area">

          <div className="pk-board">

            <div className="board-label player-two-label">
              {player2}
            </div>


            <div className="pit-row">

              {board
                .slice(7, 14)
                .map((seeds, rowIndex) => {

                  const index = rowIndex + 7;

                  return (
                    <button
                      key={index}
                      className={
                        currentPlayer === 1
                          ? "seed-pit my-pit"
                          : "seed-pit"
                      }
                      onClick={() =>
                        playPit(index)
                      }
                    >

                      <span className="pit-number">
                        {index - 6}
                      </span>

                      <span className="seeds">
                        {seeds}
                      </span>

                      <span className="seed-dots">
                        {"●".repeat(
                          Math.min(seeds, 10)
                        )}
                      </span>

                    </button>
                  );

                })}

            </div>


            <div className="board-middle">

              <div className="board-decoration">
                🪷
              </div>

              <span>
                PALLANKUZHI
              </span>

              <small>
                GAME OF SEEDS
              </small>

            </div>


            <div className="pit-row">

              {board
                .slice(0, 7)
                .map((seeds, index) => {

                  return (
                    <button
                      key={index}
                      className={
                        currentPlayer === 0
                          ? "seed-pit my-pit"
                          : "seed-pit"
                      }
                      onClick={() =>
                        playPit(index)
                      }
                    >

                      <span className="pit-number">
                        {index + 1}
                      </span>

                      <span className="seeds">
                        {seeds}
                      </span>

                      <span className="seed-dots">
                        {"●".repeat(
                          Math.min(seeds, 10)
                        )}
                      </span>

                    </button>
                  );

                })}

            </div>


            <div className="board-label player-one-label">
              {player1}
            </div>

          </div>

        </section>


        <section className="pk-game-actions">

          <button
            onClick={restartGame}
          >
            ↻ Restart Game
          </button>

          <button
            onClick={() => setShowRules(true)}
          >
            ? Rules
          </button>

          <button
            onClick={() => router.push("/games")}
          >
            Choose Another Game
          </button>

        </section>


        {showRules && (
          <div
            className="pk-modal-overlay"
            onClick={() => setShowRules(false)}
          >

            <div
              className="pk-rules-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <button
                className="pk-close"
                onClick={() =>
                  setShowRules(false)
                }
              >
                ×
              </button>

              <small>
                PALLANKUZHI
              </small>

              <h2>
                How To Play
              </h2>

              <ol>

                <li>
                  The highlighted pits belong to
                  the player whose turn it is.
                </li>

                <li>
                  Click any pit containing seeds.
                </li>

                <li>
                  The seeds will automatically
                  distribute around the board.
                </li>

                <li>
                  Strategic captures increase
                  your score.
                </li>

                <li>
                  The player with the highest
                  final score wins.
                </li>

              </ol>

            </div>

          </div>
        )}

      </main>
    );
  }


  /*
   * --------------------------------------------------
   * WINNER SCREEN
   * --------------------------------------------------
   */

  return (
    <main className="pallankuzhi-page winner-screen">

      <div className="winner-decoration left">
        ❈
      </div>

      <div className="winner-decoration right">
        ❈
      </div>


      <section className="winner-card">

        <div className="winner-lotus">
          🪷
        </div>

        <small>
          THE GAME HAS ENDED
        </small>

        {winner === "DRAW" ? (

          <>
            <h1>
              A Noble Draw
            </h1>

            <p className="winner-name">
              {player1} & {player2}
            </p>

            <p>
              Both players demonstrated
              remarkable skill and strategy.
            </p>
          </>

        ) : (

          <>

            <h1>
              Congratulations!
            </h1>

            <p className="winner-name">
              🏆 {winner}
            </p>

            <p>
              You have mastered the ancient
              art of Pallankuzhi.
            </p>

          </>

        )}


        <div className="final-scores">

          <div>

            <small>
              {player1}
            </small>

            <strong>
              {scores[0]}
            </strong>

            <span>
              Seeds
            </span>

          </div>


          <div className="final-divider">
            ✦
          </div>


          <div>

            <small>
              {player2}
            </small>

            <strong>
              {scores[1]}
            </strong>

            <span>
              Seeds
            </span>

          </div>

        </div>


        <div className="appreciation">

          <div>
            ❈
          </div>

          <h2>
            Heritage Player
          </h2>

          <p>
            Your journey through Indian traditional
            games keeps our cultural heritage alive.
          </p>

          <strong>
            ✦ Keep playing. Keep the heritage alive. ✦
          </strong>

        </div>


        <div className="winner-buttons">

          <button
            onClick={restartGame}
          >
            Play Again
          </button>

          <button
            onClick={() => router.push("/games")}
          >
            Explore More Games
          </button>

          <button
            onClick={() => router.push("/home")}
          >
            Return Home
          </button>

        </div>

      </section>

    </main>
  );
}