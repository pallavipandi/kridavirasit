"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Globe2,
  Gamepad2,
  Trophy,
  BookOpen,
} from "lucide-react";

type SelectedLanguage = {
  name: string;
  native: string;
  code: string;
};

export default function ProfilePage() {
  const router = useRouter();

  const [userName, setUserName] = useState("Explorer");
  const [language, setLanguage] =
    useState<SelectedLanguage | null>(null);

  useEffect(() => {
    const savedName = localStorage.getItem(
      "kridavirasat-user-name"
    );

    const savedLanguage = localStorage.getItem(
      "kridavirasat-language"
    );

    if (savedName) {
      setUserName(savedName);
    }

    if (savedLanguage) {
      try {
        setLanguage(JSON.parse(savedLanguage));
      } catch {
        setLanguage(null);
      }
    }
  }, []);

  return (
    <main className="profile-page">
      {/* NAVIGATION */}

      <nav className="profile-nav">
        <button
          className="profile-back"
          onClick={() => router.push("/home")}
        >
          <ArrowLeft size={18} />
          Back to Home
        </button>

        <div className="profile-logo">
          <span>🪷</span>

          <div>
            <strong>KRIDAVIRASAT</strong>
            <small>Indian Knowledge System</small>
          </div>
        </div>

        <button
          className="profile-games"
          onClick={() => router.push("/games")}
        >
          Explore Games →
        </button>
      </nav>

      {/* HEADER */}

      <section className="profile-header">
        <div className="profile-avatar">
          <User size={55} />
        </div>

        <small>MY HERITAGE JOURNEY</small>

        <h1>
          Welcome, <span>{userName}</span>
        </h1>

        <p>
          Your personal space for exploring India's games,
          languages and cultural heritage.
        </p>
      </section>

      {/* PROFILE CARD */}

      <section className="profile-card">
        <div className="profile-card-top">
          <div className="profile-card-avatar">
            {userName.charAt(0).toUpperCase()}
          </div>

          <div>
            <small>EXPLORER</small>
            <h2>{userName}</h2>
          </div>
        </div>

        <div className="profile-details">
          <div className="profile-detail">
            <Globe2 size={22} />

            <div>
              <small>SELECTED LANGUAGE</small>

              <strong>
                {language
                  ? `${language.native} · ${language.name}`
                  : "Not selected"}
              </strong>
            </div>
          </div>

          <div className="profile-detail">
            <Gamepad2 size={22} />

            <div>
              <small>GAMES AVAILABLE</small>
              <strong>6 Traditional Games</strong>
            </div>
          </div>
        </div>
      </section>

      {/* JOURNEY */}

      <section className="profile-journey">
        <div className="profile-section-heading">
          <small>YOUR JOURNEY</small>

          <h2>
            Discover. <span>Learn. Play.</span>
          </h2>

          <p>
            Continue exploring the heritage and knowledge
            preserved through generations.
          </p>
        </div>

        <div className="profile-actions">
          <button
            onClick={() => router.push("/games")}
          >
            <Gamepad2 size={26} />

            <div>
              <strong>Play Traditional Games</strong>

              <span>
                Explore all six games
              </span>
            </div>

            <span className="profile-arrow">
              →
            </span>
          </button>

          <button
            onClick={() => router.push("/language")}
          >
            <Globe2 size={26} />

            <div>
              <strong>Explore Languages</strong>

              <span>
                Discover India's languages
              </span>
            </div>

            <span className="profile-arrow">
              →
            </span>
          </button>

          <button
            onClick={() => router.push("/about")}
          >
            <BookOpen size={26} />

            <div>
              <strong>Explore Heritage</strong>

              <span>
                Learn about Indian knowledge
              </span>
            </div>

            <span className="profile-arrow">
              →
            </span>
          </button>

          <button
            onClick={() => router.push("/achievements")}
          >
            <Trophy size={26} />

            <div>
              <strong>View Achievements</strong>

              <span>
                Track your heritage journey
              </span>
            </div>

            <span className="profile-arrow">
              →
            </span>
          </button>
        </div>
      </section>

      {/* FOOTER */}

      <footer className="profile-footer">
        <div>🪷 KRIDAVIRASAT</div>

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