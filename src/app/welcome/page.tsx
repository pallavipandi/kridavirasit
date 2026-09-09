"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type SavedUser = {
  name: string;
  email: string;
  password: string;
};

export default function WelcomePage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      /*
       * First try to get the name saved during
       * Sign Up / Login.
       */
      const savedName = localStorage.getItem(
        "kridavirasat-user-name"
      );

      if (savedName) {
        setName(savedName);
        setLoading(false);
        return;
      }

      /*
       * If the separate name value does not exist,
       * try to get the user account.
       */
      const savedUser = localStorage.getItem(
        "kridavirasat-user"
      );

      if (savedUser) {
        const user: SavedUser =
          JSON.parse(savedUser);

        if (user.name) {
          setName(user.name);

          localStorage.setItem(
            "kridavirasat-user-name",
            user.name
          );
        }
      }
    } catch (error) {
      console.error(
        "Could not load user information:",
        error
      );
    }

    setLoading(false);
  }, []);

  function enterKridavirasat() {
    if (name.trim() === "") {
      return;
    }

    /*
     * Save the user's name.
     */
    localStorage.setItem(
      "kridavirasat-user-name",
      name.trim()
    );

    /*
     * Mark the user as logged in.
     */
    localStorage.setItem(
      "kridavirasat-logged-in",
      "true"
    );

    /*
     * Go to the main website.
     */
    router.push("/home");
  }

  function goToLogin() {
    router.push("/login");
  }

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #30160d, #5b3019, #241008)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#f8efd9",
          textAlign: "center",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "55px",
              marginBottom: "20px",
            }}
          >
            🪷
          </div>

          <p
            style={{
              color: "#e8c879",
              letterSpacing: "2px",
              fontFamily:
                "Arial, sans-serif",
            }}
          >
            PREPARING YOUR JOURNEY...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #30160d, #5b3019, #241008)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
        color: "#f8efd9",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "650px",
          padding: "50px 35px",
          border: "1px solid #d9ad57",
          borderRadius: "12px",
          background:
            "rgba(45, 21, 11, 0.95)",
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* =========================
            LOTUS
        ========================= */}

        <div
          style={{
            fontSize: "60px",
            marginBottom: "20px",
          }}
        >
          🪷
        </div>

        {/* =========================
            EYEBROW
        ========================= */}

        <p
          style={{
            color: "#e8c879",
            fontSize: "11px",
            letterSpacing: "3px",
            fontFamily:
              "Arial, sans-serif",
          }}
        >
          INDIAN KNOWLEDGE SYSTEM PRESENTS
        </p>

        {/* =========================
            LOGO
        ========================= */}

        <h1
          style={{
            color: "#f1d58a",
            fontSize:
              "clamp(38px, 8vw, 65px)",
            letterSpacing: "5px",
            marginTop: "15px",
          }}
        >
          KRIDAVIRASAT
        </h1>

        {/* =========================
            DECORATION
        ========================= */}

        <div
          style={{
            color: "#d9ad57",
            fontSize: "22px",
            margin: "20px 0",
          }}
        >
          ✦
        </div>

        {/* =========================
            WELCOME MESSAGE
        ========================= */}

        <h2
          style={{
            fontSize: "30px",
            marginBottom: "12px",
          }}
        >
          Welcome
          {name
            ? `, ${name}`
            : ""}
        </h2>

        <p
          style={{
            color:
              "rgba(248,239,217,0.7)",
            fontSize: "16px",
            lineHeight: "1.7",
            fontStyle: "italic",
          }}
        >
          Every game carries a story.
          <br />
          Every story carries a piece of
          our heritage.
        </p>

        {/* =========================
            NAME SECTION
        ========================= */}

        <div
          style={{
            marginTop: "35px",
            textAlign: "left",
          }}
        >
          <label
            htmlFor="name"
            style={{
              display: "block",
              marginBottom: "10px",
              color: "#e8c879",
              fontFamily:
                "Arial, sans-serif",
              fontSize: "12px",
              fontWeight: "bold",
              letterSpacing: "1px",
            }}
          >
            WHAT SHOULD WE CALL YOU?
          </label>

          <input
            id="name"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                enterKridavirasat();
              }
            }}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "7px",
              border:
                "1px solid rgba(232,200,121,0.4)",
              background:
                "rgba(255,255,255,0.08)",
              color: "#fff7e6",
              outline: "none",
              fontSize: "16px",
              fontFamily:
                "Arial, sans-serif",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* =========================
            ENTER BUTTON
        ========================= */}

        <button
          onClick={enterKridavirasat}
          disabled={!name.trim()}
          style={{
            width: "100%",
            marginTop: "28px",
            padding: "16px",
            borderRadius: "7px",
            border:
              "1px solid #e8c879",
            background: name.trim()
              ? "linear-gradient(135deg, #c8943e, #9b601e)"
              : "#765b3d",
            color: "#29160d",
            fontFamily:
              "Arial, sans-serif",
            fontSize: "13px",
            fontWeight: "bold",
            letterSpacing: "2px",
            cursor: name.trim()
              ? "pointer"
              : "not-allowed",
          }}
        >
          ENTER KRIDAVIRASAT →
        </button>

        {/* =========================
            LOGIN / SWITCH ACCOUNT
        ========================= */}

        <button
          onClick={goToLogin}
          style={{
            width: "100%",
            marginTop: "15px",
            padding: "13px",
            borderRadius: "7px",
            border:
              "1px solid rgba(232,200,121,0.45)",
            background: "transparent",
            color: "#e8c879",
            fontFamily:
              "Arial, sans-serif",
            fontSize: "12px",
            fontWeight: "bold",
            letterSpacing: "1px",
            cursor: "pointer",
          }}
        >
          SWITCH ACCOUNT
        </button>
      </div>
    </main>
  );
}