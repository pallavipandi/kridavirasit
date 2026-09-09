"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] = useState("");

  function handleLogin() {
    setError("");

    const savedUser = localStorage.getItem(
      "kridavirasat-user"
    );

    if (!savedUser) {
      setError(
        "No account found. Please create an account first."
      );
      return;
    }

    const user = JSON.parse(savedUser);

    if (
      email.trim() !== user.email ||
      password !== user.password
    ) {
      setError(
        "Incorrect email or password."
      );
      return;
    }

    localStorage.setItem(
      "kridavirasat-user-name",
      user.name
    );

    localStorage.setItem(
      "kridavirasat-logged-in",
      "true"
    );

    router.push("/welcome");
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
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          padding: "50px 35px",
          border: "1px solid #d9ad57",
          borderRadius: "12px",
          background:
            "rgba(45, 21, 11, 0.96)",
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            fontSize: "60px",
          }}
        >
          🪷
        </div>

        <p
          style={{
            textAlign: "center",
            color: "#e8c879",
            fontSize: "11px",
            letterSpacing: "3px",
            fontFamily: "Arial, sans-serif",
          }}
        >
          INDIAN KNOWLEDGE SYSTEM PRESENTS
        </p>

        <h1
          style={{
            textAlign: "center",
            color: "#f1d58a",
            fontSize: "40px",
            letterSpacing: "4px",
            marginTop: "15px",
          }}
        >
          KRIDAVIRASAT
        </h1>

        <div
          style={{
            textAlign: "center",
            color: "#d9ad57",
            margin: "20px 0",
          }}
        >
          ✦
        </div>

        <h2
          style={{
            textAlign: "center",
            fontSize: "30px",
          }}
        >
          Welcome Back
        </h2>

        <p
          style={{
            textAlign: "center",
            color:
              "rgba(248,239,217,0.7)",
            marginBottom: "30px",
          }}
        >
          Continue your journey through
          Indian heritage.
        </p>

        <label style={labelStyle}>
          EMAIL ADDRESS
        </label>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          style={inputStyle}
        />

        <label
          style={{
            ...labelStyle,
            marginTop: "20px",
          }}
        >
          PASSWORD
        </label>

        <div
          style={{
            position: "relative",
          }}
        >
          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            style={{
              ...inputStyle,
              paddingRight: "50px",
            }}
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                !showPassword
              )
            }
            style={eyeButtonStyle}
          >
            {showPassword
              ? "🙈"
              : "👁️"}
          </button>
        </div>

        {error && (
          <p
            style={{
              textAlign: "center",
              color: "#ff9d8d",
              fontSize: "13px",
              marginTop: "18px",
            }}
          >
            ⚠️ {error}
          </p>
        )}

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            marginTop: "28px",
            padding: "16px",
            borderRadius: "7px",
            border:
              "1px solid #e8c879",
            background:
              "linear-gradient(135deg, #c8943e, #9b601e)",
            color: "#29160d",
            fontSize: "13px",
            fontWeight: "bold",
            letterSpacing: "2px",
            cursor: "pointer",
          }}
        >
          LOGIN →
        </button>

        <p
          style={{
            textAlign: "center",
            marginTop: "25px",
            color:
              "rgba(248,239,217,0.7)",
          }}
        >
          Don't have an account?
        </p>

        <button
          onClick={() =>
            router.push("/signup")
          }
          style={{
            width: "100%",
            padding: "13px",
            borderRadius: "7px",
            border:
              "1px solid rgba(232,200,121,0.5)",
            background: "transparent",
            color: "#e8c879",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          CREATE ACCOUNT
        </button>
      </div>
    </main>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  color: "#e8c879",
  fontSize: "12px",
  fontWeight: "bold",
  letterSpacing: "1px",
};

const inputStyle = {
  width: "100%",
  padding: "15px",
  borderRadius: "7px",
  border:
    "1px solid rgba(232,200,121,0.4)",
  background:
    "rgba(255,255,255,0.08)",
  color: "#fff7e6",
  outline: "none",
  fontSize: "15px",
  boxSizing: "border-box" as const,
};

const eyeButtonStyle = {
  position: "absolute" as const,
  right: "10px",
  top: "50%",
  transform: "translateY(-50%)",
  border: "none",
  background: "transparent",
  cursor: "pointer",
  fontSize: "18px",
};