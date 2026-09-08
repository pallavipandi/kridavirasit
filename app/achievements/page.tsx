"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Trophy,
  Gamepad2,
  Globe2,
  BookOpen,
  Star,
  Lock,
} from "lucide-react";

export default function AchievementsPage() {
  const router = useRouter();

  const [userName, setUserName] = useState("Explorer");

  useEffect(() => {
    const savedName = localStorage.getItem(
      "kridavirasat-user-name"
    );

    if (savedName) {
      setUserName(savedName);
    }
  }, []);

  const achievements = [
    {
      title: "Heritage Explorer",
      description:
        "Discover the traditional games preserved by KridaVirasat.",
      icon: <Gamepad2 size={28} />,
      progress: 6,
      total: 6,
      unlocked: true,
    },
    {
      title: "Language Explorer",
      description:
        "Explore India's rich collection of languages.",
      icon: <Globe2 size={28} />,
      progress: 1,
      total: 5,
      unlocked: false,
    },
    {
      title: "Knowledge Seeker",
      description:
        "Learn about the Indian Knowledge System and heritage.",
      icon: <BookOpen size={28} />,
      progress: 1,
      total: 3,
      unlocked: false,
    },
    {
      title: "Cultural Champion",
      description:
        "Explore different aspects of Indian cultural heritage.",
      icon: <Trophy size={28} />,
      progress: 1,
      total: 4,
      unlocked: false,
    },
  ];

  return (
    <main className="achievements-page">

      {/* NAVIGATION */}

      <nav className="achievements-nav">

        <button
          className="achievements-back"
          onClick={() => router.push("/home")}
        >
          <ArrowLeft size={18} />
          Back to Home
        </button>

        <div className="achievements-logo">
          <span>🪷</span>

          <div>
            <strong>KRIDAVIRASAT</strong>
            <small>Indian Knowledge System</small>
          </div>
        </div>

        <button
          className="achievements-games"
          onClick={() => router.push("/games")}
        >
          Explore Games →
        </button>

      </nav>

      {/* HERO */}

      <section className="achievements-hero">

        <div className="achievement-trophy">
          <Trophy size={55} />
        </div>

        <small>YOUR HERITAGE JOURNEY</small>

        <h1>
          Your <span>Achievements</span>
        </h1>

        <p>
          Keep exploring, learning and playing to discover
          more of India's rich heritage.
        </p>

      </section>

      {/* USER SUMMARY */}

      <section className="achievement-summary">

        <div className="summary-item">
          <Star size={25} />

          <div>
            <strong>1</strong>
            <span>Achievements Earned</span>
          </div>
        </div>

        <div className="summary-item">
          <Gamepad2 size={25} />

          <div>
            <strong>6</strong>
            <span>Games Available</span>
          </div>
        </div>

        <div className="summary-item">
          <Trophy size={25} />

          <div>
            <strong>25%</strong>
            <span>Journey Complete</span>
          </div>
        </div>

      </section>

      {/* ACHIEVEMENTS */}

      <section className="achievements-content">

        <div className="achievements-heading">
          <small>COLLECTION</small>

          <h2>
            Keep <span>Discovering</span>
          </h2>

          <p>
            Every game you explore and every piece of
            heritage you discover brings you closer to
            completing your journey.
          </p>
        </div>

        <div className="achievement-grid">

          {achievements.map((achievement) => (

            <article
              className={`achievement-card ${
                achievement.unlocked
                  ? "achievement-unlocked"
                  : "achievement-locked"
              }`}
              key={achievement.title}
            >

              <div className="achievement-icon">
                {achievement.icon}
              </div>

              <div className="achievement-card-content">

                <div className="achievement-status">

                  {achievement.unlocked ? (
                    <span className="unlocked">
                      ✓ UNLOCKED
                    </span>
                  ) : (
                    <span className="locked">
                      <Lock size={12} />
                      LOCKED
                    </span>
                  )}

                </div>

                <h3>{achievement.title}</h3>

                <p>
                  {achievement.description}
                </p>

                <div className="achievement-progress">

                  <div className="progress-top">
                    <span>Progress</span>

                    <strong>
                      {achievement.progress}/
                      {achievement.total}
                    </strong>
                  </div>

                  <div className="progress-bar">

                    <div
                      className="progress-fill"
                      style={{
                        width: `${
                          (achievement.progress /
                            achievement.total) *
                          100
                        }%`,
                      }}
                    />

                  </div>

                </div>

              </div>

            </article>

          ))}

        </div>

      </section>

      {/* MOTIVATION */}

      <section className="achievement-quote">

        <div>❈</div>

        <h2>
          Every discovery is a step
          towards preserving heritage.
        </h2>

        <p>
          Keep playing, keep learning and keep
          discovering the stories behind India's
          traditions.
        </p>

        <button
          onClick={() => router.push("/games")}
        >
          🎮 Continue Exploring
        </button>

      </section>

      {/* FOOTER */}

      <footer className="achievements-footer">

        <div>
          🪷 KRIDAVIRASAT
        </div>

        <p>
          Rediscover the Heritage of Indian Play
        </p>

        <small>
          © 2026 KRIDAVIRASAT · Indian Knowledge System
        </small>

      </footer>

    </main>
  );
}