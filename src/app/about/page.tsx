"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Gamepad2, BookOpen, Users, Brain } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AboutPage() {
  const router = useRouter();

  return (
    <main className="about-page">
      {/* NAVIGATION */}
      <nav className="about-nav">
        <button
          className="about-back"
          onClick={() => router.push("/home")}
        >
          <ArrowLeft size={18} />
          Back to Home
        </button>

        <div className="about-logo">
          <span>🪷</span>
          <div>
            <strong>KRIDAVIRASAT</strong>
            <small>Indian Knowledge System</small>
          </div>
        </div>

        <button
          className="about-games-button"
          onClick={() => router.push("/games")}
        >
          Explore Games →
        </button>
      </nav>

      {/* HERO */}
      <section className="about-hero">
        <motion.div
          className="about-hero-content"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="about-label">
            ✦ BEYOND THE GAMES ✦
          </div>

          <h1>
            Discover the
            <span> Heritage of Indian Play</span>
          </h1>

          <div className="about-divider" />

          <p>
            KridaVirasat is a journey into India's traditional games,
            knowledge and cultural heritage — bringing the wisdom of
            generations into an interactive digital experience.
          </p>
        </motion.div>

        <motion.div
          className="about-hero-art"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="about-mandala">
            <span>🪷</span>
          </div>

          <div className="about-floating about-float-one">
            🎲
          </div>

          <div className="about-floating about-float-two">
            🪔
          </div>

          <div className="about-floating about-float-three">
            🏛️
          </div>
        </motion.div>
      </section>

      {/* INTRODUCTION */}
      <section className="about-introduction">
        <div className="about-section-heading">
          <small>OUR PURPOSE</small>
          <h2>Play. Learn. Preserve.</h2>
        </div>

        <p>
          Traditional Indian games were never simply a way to pass time.
          They were part of everyday life and helped generations learn
          strategy, patience, mathematics, memory, teamwork and
          decision-making.
        </p>

        <p>
          KridaVirasat brings these experiences into the digital world,
          allowing today's generation to discover the games and stories
          that have been passed down through generations.
        </p>
      </section>

      {/* VALUES */}
      <section className="about-values">
        <div className="about-section-heading centered">
          <small>THE KNOWLEDGE WITHIN PLAY</small>
          <h2>More Than Just Games</h2>
        </div>

        <div className="about-values-grid">
          <ValueCard
            icon={<Gamepad2 size={28} />}
            title="Traditional Play"
            text="Experience games that have been played across generations and regions of India."
          />

          <ValueCard
            icon={<Brain size={28} />}
            title="Learning"
            text="Discover how traditional play develops strategy, memory, mathematics and problem-solving."
          />

          <ValueCard
            icon={<Users size={28} />}
            title="Community"
            text="Understand how games brought families, friends and communities together."
          />

          <ValueCard
            icon={<BookOpen size={28} />}
            title="Heritage"
            text="Explore the stories, traditions and knowledge connected with India's cultural heritage."
          />
        </div>
      </section>

      {/* KNOWLEDGE SECTION */}
      <section className="about-knowledge">
        <div className="knowledge-art">
          <div className="knowledge-circle">
            🪷
          </div>
        </div>

        <div className="knowledge-content">
          <small>INDIAN KNOWLEDGE SYSTEM</small>

          <h2>
            Wisdom Hidden
            <span> Within Play</span>
          </h2>

          <p>
            Indian traditional games often combined entertainment with
            practical learning. Players learned to observe, calculate,
            remember, plan and work with others while enjoying the game.
          </p>

          <div className="knowledge-list">
            <div>
              <span>01</span>
              <strong>Strategy</strong>
            </div>

            <div>
              <span>02</span>
              <strong>Mathematics</strong>
            </div>

            <div>
              <span>03</span>
              <strong>Memory</strong>
            </div>

            <div>
              <span>04</span>
              <strong>Teamwork</strong>
            </div>
          </div>
        </div>
      </section>

      {/* HERITAGE QUOTE */}
      <section className="about-quote">
        <div className="quote-symbol">❈</div>

        <p>
          "When we preserve the games of our ancestors,
          we preserve the stories, knowledge and values
          carried within them."
        </p>

        <span>— KRIDAVIRASAT</span>
      </section>

      {/* CALL TO ACTION */}
      <section className="about-cta">
        <small>READY TO EXPLORE?</small>

        <h2>
          Rediscover the Joy
          <span> of Traditional Play</span>
        </h2>

        <p>
          Explore traditional Indian games and begin your journey
          through India's living heritage.
        </p>

        <div className="about-cta-buttons">
          <button
            className="about-primary-button"
            onClick={() => router.push("/games")}
          >
            🎮 Explore Games
          </button>

          <button
            className="about-secondary-button"
            onClick={() => router.push("/home")}
          >
            Return Home
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="about-footer">
        <div className="about-footer-logo">
          🪷 KRIDAVIRASAT
        </div>

        <p>Rediscover the Heritage of Indian Play</p>

        <small>
          © 2026 KRIDAVIRASAT · Indian Knowledge System
        </small>
      </footer>
    </main>
  );
}

function ValueCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <motion.div
      className="about-value-card"
      whileHover={{ y: -7 }}
      transition={{ duration: 0.2 }}
    >
      <div className="value-icon">{icon}</div>

      <h3>{title}</h3>

      <p>{text}</p>
    </motion.div>
  );
}