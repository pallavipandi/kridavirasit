"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess(false);

    // Name validation
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    // Email validation
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Password validation
    if (!password) {
      setError("Please create a password.");
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must contain at least 8 characters."
      );
      return;
    }

    // Confirm password
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    /*
     * FRONTEND DEMO
     *
     * This stores the signup information locally only
     * for the prototype.
     *
     * Do NOT use localStorage for real production
     * authentication.
     */
    localStorage.setItem(
      "kridavirasatUser",
      JSON.stringify({
        name: name.trim(),
        email: email.trim(),
      })
    );

    setSuccess(true);

    // Go to home after signup
    setTimeout(() => {
      router.push("/home");
    }, 1200);
  };

  return (
    <main className="signup-page">

      {/* =========================
          BACKGROUND DECORATIONS
      ========================= */}

      <div className="signup-decoration signup-decoration-one">
        ॐ
      </div>

      <div className="signup-decoration signup-decoration-two">
        ✦
      </div>

      <div className="signup-decoration signup-decoration-three">
        🪷
      </div>

      {/* =========================
          NAVIGATION
      ========================= */}

      <nav className="signup-nav">

        <div
          className="signup-logo"
          onClick={() => router.push("/home")}
        >
          <span className="signup-logo-flower">
            🪷
          </span>

          <div>
            <strong>KRIDAVIRASAT</strong>

            <small>
              Indian Knowledge System
            </small>
          </div>
        </div>

        <button
          className="signup-nav-login"
          onClick={() => router.push("/login")}
        >
          Already have an account?
          <span> Login</span>
        </button>

      </nav>

      {/* =========================
          SIGNUP CONTAINER
      ========================= */}

      <section className="signup-container">

        {/* =========================
            LEFT SIDE
        ========================= */}

        <div className="signup-intro">

          <div className="signup-intro-symbol">
            🪷
          </div>

          <small className="signup-intro-eyebrow">
            INDIAN KNOWLEDGE SYSTEM
          </small>

          <h1>
            Begin Your
            <span>
              {" "}Heritage Journey
            </span>
          </h1>

          <div className="signup-intro-line" />

          <p>
            Create your KRIDAVIRASAT account
            and rediscover the rich heritage of
            Indian games, languages and culture.
          </p>

          <div className="signup-benefits">

            <div className="signup-benefit">
              <span>🎮</span>

              <div>
                <strong>
                  Explore Traditional Games
                </strong>

                <small>
                  Play and rediscover India's
                  traditional games.
                </small>
              </div>
            </div>

            <div className="signup-benefit">
              <span>🗣️</span>

              <div>
                <strong>
                  Learn Indian Languages
                </strong>

                <small>
                  Learn words, phrases and
                  pronunciation.
                </small>
              </div>
            </div>

            <div className="signup-benefit">
              <span>🏆</span>

              <div>
                <strong>
                  Track Your Achievements
                </strong>

                <small>
                  Keep track of your learning
                  and gaming journey.
                </small>
              </div>
            </div>

          </div>

        </div>

        {/* =========================
            SIGNUP CARD
        ========================= */}

        <div className="signup-card">

          <div className="signup-card-header">

            <div className="signup-card-icon">
              ✨
            </div>

            <div>
              <small>
                WELCOME TO KRIDAVIRASAT
              </small>

              <h2>
                Create Account
              </h2>

              <p>
                Join us and start your journey.
              </p>
            </div>

          </div>

          {/* =========================
              FORM
          ========================= */}

          <form onSubmit={handleSignup}>

            {/* NAME */}

            <div className="signup-field">

              <label htmlFor="name">
                Full Name
              </label>

              <div className="signup-input-wrapper">

                <span className="signup-input-icon">
                  👤
                </span>

                <input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  autoComplete="name"
                />

              </div>

            </div>

            {/* EMAIL */}

            <div className="signup-field">

              <label htmlFor="email">
                Email Address
              </label>

              <div className="signup-input-wrapper">

                <span className="signup-input-icon">
                  ✉️
                </span>

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  autoComplete="email"
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div className="signup-field">

              <label htmlFor="password">
                Password
              </label>

              <div className="signup-input-wrapper">

                <span className="signup-input-icon">
                  🔒
                </span>

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword
                    ? "🙈"
                    : "👁️"}
                </button>

              </div>

              <small className="password-hint">
                Use at least 8 characters.
              </small>

            </div>

            {/* CONFIRM PASSWORD */}

            <div className="signup-field">

              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <div className="signup-input-wrapper">

                <span className="signup-input-icon">
                  🔐
                </span>

                <input
                  id="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showConfirmPassword
                    ? "🙈"
                    : "👁️"}
                </button>

              </div>

            </div>

            {/* ERROR */}

            {error && (
              <div className="signup-error">
                ⚠️ {error}
              </div>
            )}

            {/* SUCCESS */}

            {success && (
              <div className="signup-success">
                ✓ Account created successfully!
                Redirecting...
              </div>
            )}

            {/* SUBMIT */}

            <button
              type="submit"
              className="signup-submit-button"
            >
              Create My Account
              <span>→</span>
            </button>

          </form>

          {/* LOGIN */}

          <div className="signup-login-text">

            Already have an account?

            <button
              onClick={() =>
                router.push("/login")
              }
            >
              Login
            </button>

          </div>

          {/* DIVIDER */}

          <div className="signup-divider">
            <span>OR</span>
          </div>

          {/* CONTINUE AS GUEST */}

          <button
            type="button"
            className="guest-button"
            onClick={() =>
              router.push("/home")
            }
          >
            Continue as Guest
          </button>

          <p className="signup-note">
            By creating an account, you can
            keep track of your learning progress
            and achievements.
          </p>

        </div>

      </section>

      {/* =========================
          FOOTER
      ========================= */}

      <footer className="signup-footer">

        <span>
          🪷 KRIDAVIRASAT
        </span>

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