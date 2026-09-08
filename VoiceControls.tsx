"use client";

import { useState } from "react";
import { Volume2, Mic, Loader2 } from "lucide-react";

type VoiceControlsProps = {
  text: string;
  language?: string;
};

export default function VoiceControls({
  text,
  language = "en",
}: VoiceControlsProps) {
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);

  const speakText = async () => {
    if (!text) return;

    try {
      setSpeaking(true);

      const response = await fetch("http://127.0.0.1:5000/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          language,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "TTS failed");
      }
    } catch (error) {
      console.error("TTS error:", error);
      alert("Could not play speech.");
    } finally {
      setSpeaking(false);
    }
  };

  const listenToSpeech = async () => {
    try {
      setListening(true);

      const response = await fetch("http://127.0.0.1:5000/stt", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "STT failed");
      }

      console.log("Recognized speech:", data.text);

      alert(`You said: ${data.text}`);
    } catch (error) {
      console.error("STT error:", error);
      alert("Could not recognize speech.");
    } finally {
      setListening(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        alignItems: "center",
        marginTop: "15px",
      }}
    >
      <button
        type="button"
        onClick={speakText}
        disabled={speaking}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 16px",
          borderRadius: "10px",
          border: "1px solid #c9a66b",
          background: "#fffaf0",
          cursor: speaking ? "wait" : "pointer",
        }}
      >
        {speaking ? (
          <Loader2 size={18} />
        ) : (
          <Volume2 size={18} />
        )}

        {speaking ? "Speaking..." : "Listen"}
      </button>

      <button
        type="button"
        onClick={listenToSpeech}
        disabled={listening}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 16px",
          borderRadius: "10px",
          border: "1px solid #c9a66b",
          background: "#fffaf0",
          cursor: listening ? "wait" : "pointer",
        }}
      >
        {listening ? (
          <Loader2 size={18} />
        ) : (
          <Mic size={18} />
        )}

        {listening ? "Listening..." : "Speak"}
      </button>
    </div>
  );
}
