"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const games = [
  {
    name: "Aadu Puli Aattam",
    description: "A traditional strategy game of goats and tigers.",
    path: "/games/aadu-puli-aattam",
    image: "/games/aadu-puli-aattam.png",
  },
  {
    name: "Chowka Bara",
    description: "A classic Indian board game of strategy and movement.",
    path: "/games/chowka-bara",
    image: "/games/chowka-bara.png",
  },
  {
    name: "Dayakattai",
    description: "A traditional dice-based game full of strategy.",
    path: "/games/dayakattai",
    image: "/games/dayakattai.png",
  },
  {
    name: "Ludo",
    description: "The familiar classic of dice, tokens and strategy.",
    path: "/games/ludo",
    image: "/games/ludo.png",
  },
  {
    name: "Pallankuzhi",
    description: "A traditional South Indian counting and strategy game.",
    path: "/games/pallankuzhi",
    image: "/games/pallankuzhi.png",
  },
  {
    name: "Paramapada Sopanam",
    description:
      "Climb the ladders and avoid the snakes in this classic game.",
    path: "/games/paramapada-sopanam",
    image: "/games/paramapada.png",
  },
];

export default function GamesPage() {
  const router = useRouter();

  return (
    <main className="games-page">
      <section className="games-hero">
        <Link
  href="/home"
  className="back-button"
>
  ← Back to Home
</Link>

        <div className="games-title">
          <span className="games-symbol">✦</span>

          <div>
            <p className="small-heading">TRADITIONAL PLAY</p>

            <h1>Our Games</h1>

            <p className="games-subtitle">
              Discover and play traditional Indian games
            </p>
          </div>

          <span className="games-symbol">✦</span>
        </div>
      </section>

      <section className="games-grid">
        {games.map((game) => (
          <div
            key={game.name}
            className="game-card"
            onClick={() => router.push(game.path)}
          >
            <div className="game-image-container">
              <img
                src={game.image}
                alt={game.name}
                className="game-image"
              />
            </div>

            <h2>{game.name}</h2>

            <p>{game.description}</p>

            <button
              type="button"
              className="play-button"
              onClick={(e) => {
                e.stopPropagation();
                router.push(game.path);
              }}
            >
              Play Game →
            </button>
          </div>
        ))}
      </section>
    </main>
  );
}