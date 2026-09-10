"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Word = {
  tamil: string;
  pronunciation: string;
  english: string;
  category: string;
};

type TamilSpeechRecognitionResult = {
  transcript: string;
  confidence?: number;
};

type TamilSpeechRecognitionEvent = Event & {
  results: {
    length: number;
    [index: number]: {
      [index: number]: TamilSpeechRecognitionResult;
    };
  };
};

type TamilSpeechRecognitionErrorEvent = Event & {
  error: string;
};

interface TamilSpeechRecognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;

  onstart: (() => void) | null;

  onresult:
    | ((event: TamilSpeechRecognitionEvent) => void)
    | null;

  onerror:
    | ((event: TamilSpeechRecognitionErrorEvent) => void)
    | null;

  onend: (() => void) | null;
}

type TamilSpeechRecognitionConstructor =
  new () => TamilSpeechRecognition;

/* ============================================================
   TAMIL WORDS
   ============================================================ */

const words: Word[] = [
  {
    tamil: "வணக்கம்",
    pronunciation: "Vanakkam",
    english: "Hello / Greetings",
    category: "Greetings",
  },
  {
    tamil: "நன்றி",
    pronunciation: "Nandri",
    english: "Thank you",
    category: "Greetings",
  },
  {
    tamil: "ஆம்",
    pronunciation: "Aam",
    english: "Yes",
    category: "Everyday",
  },
  {
    tamil: "இல்லை",
    pronunciation: "Illai",
    english: "No",
    category: "Everyday",
  },
  {
    tamil: "அம்மா",
    pronunciation: "Amma",
    english: "Mother",
    category: "Family",
  },
  {
    tamil: "அப்பா",
    pronunciation: "Appa",
    english: "Father",
    category: "Family",
  },
  {
    tamil: "அண்ணன்",
    pronunciation: "Annan",
    english: "Elder brother",
    category: "Family",
  },
  {
    tamil: "அக்கா",
    pronunciation: "Akka",
    english: "Elder sister",
    category: "Family",
  },
  {
    tamil: "ஒன்று",
    pronunciation: "Ondru",
    english: "One",
    category: "Numbers",
  },
  {
    tamil: "இரண்டு",
    pronunciation: "Irandu",
    english: "Two",
    category: "Numbers",
  },
  {
    tamil: "மூன்று",
    pronunciation: "Moondru",
    english: "Three",
    category: "Numbers",
  },
  {
    tamil: "நான்கு",
    pronunciation: "Naangu",
    english: "Four",
    category: "Numbers",
  },
  {
    tamil: "ஐந்து",
    pronunciation: "Ainthu",
    english: "Five",
    category: "Numbers",
  },
  {
    tamil: "தண்ணீர்",
    pronunciation: "Thanneer",
    english: "Water",
    category: "Everyday",
  },
  {
    tamil: "சாப்பாடு",
    pronunciation: "Saappaadu",
    english: "Food / Meal",
    category: "Everyday",
  },
  {
    tamil: "வீடு",
    pronunciation: "Veedu",
    english: "House / Home",
    category: "Everyday",
  },
];

/* ============================================================
   QUIZ
   ============================================================ */

const quizQuestions = [
  {
    question: "What does “வணக்கம்” mean?",
    options: ["Thank you", "Hello", "Water", "Mother"],
    answer: "Hello",
  },
  {
    question: "What is “நன்றி”?",
    options: ["Thank you", "Goodbye", "Father", "Food"],
    answer: "Thank you",
  },
  {
    question: "What does “அம்மா” mean?",
    options: ["Father", "Mother", "Sister", "Brother"],
    answer: "Mother",
  },
  {
    question: "What is “தண்ணீர்”?",
    options: ["Food", "House", "Water", "One"],
    answer: "Water",
  },
  {
    question: "What does “மூன்று” mean?",
    options: ["Two", "Three", "Four", "Five"],
    answer: "Three",
  },
];

const categories = [
  "All",
  "Greetings",
  "Family",
  "Numbers",
  "Everyday",
];

/* ============================================================
   COMPONENT
   ============================================================ */

export default function TamilLanguagePage() {
  const router = useRouter();

  /* ============================================================
     FLASHCARD STATE
     ============================================================ */

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [currentCard, setCurrentCard] = useState(0);

  /* ============================================================
     QUIZ STATE
     ============================================================ */

  const [quizIndex, setQuizIndex] = useState(0);

  const [quizScore, setQuizScore] = useState(0);

  const [quizFinished, setQuizFinished] = useState(false);

  const [answered, setAnswered] = useState(false);

  const [selectedAnswer, setSelectedAnswer] =
    useState<string | null>(null);

  /* ============================================================
     LEARNING PROGRESS
     ============================================================ */

  const [learnedWords, setLearnedWords] =
    useState<string[]>([]);

  /* ============================================================
     SPEECH STATE
     ============================================================ */

  const [isSpeaking, setIsSpeaking] =
    useState(false);

  const [isListening, setIsListening] =
    useState(false);

  const [isRecognizing, setIsRecognizing] =
    useState(false);

  const [recognizedText, setRecognizedText] =
    useState("");

  const [speechError, setSpeechError] =
    useState("");

  /* ============================================================
     AUDIO REF
     ============================================================ */

  const audioRef = useRef<HTMLAudioElement | null>(null);

  /* ============================================================
     SPEECH RECOGNITION REF
     ============================================================ */

  const recognitionRef =
    useRef<TamilSpeechRecognition | null>(null);

  /* ============================================================
     WRITE STRING INTO WAV HEADER
     ============================================================ */

  function writeString(
    view: DataView,
    offset: number,
    value: string
  ) {
    for (let i = 0; i < value.length; i++) {
      view.setUint8(
        offset + i,
        value.charCodeAt(i)
      );
    }
  }

  /* ============================================================
     CONVERT GEMINI PCM AUDIO TO WAV
     ============================================================ */

  const pcmToWav = (
    base64: string,
    sampleRate = 24000,
    channels = 1,
    bitsPerSample = 16
  ): Blob => {
    const binaryString = atob(base64);

    const pcmData = new Uint8Array(
      binaryString.length
    );

    for (
      let i = 0;
      i < binaryString.length;
      i++
    ) {
      pcmData[i] =
        binaryString.charCodeAt(i);
    }

    const bytesPerSample =
      bitsPerSample / 8;

    const blockAlign =
      channels * bytesPerSample;

    const byteRate =
      sampleRate * blockAlign;

    const dataSize =
      pcmData.length;

    const buffer = new ArrayBuffer(
      44 + dataSize
    );

    const view =
      new DataView(buffer);

    /* RIFF */

    writeString(
      view,
      0,
      "RIFF"
    );

    view.setUint32(
      4,
      36 + dataSize,
      true
    );

    writeString(
      view,
      8,
      "WAVE"
    );

    /* fmt */

    writeString(
      view,
      12,
      "fmt "
    );

    view.setUint32(
      16,
      16,
      true
    );

    view.setUint16(
      20,
      1,
      true
    );

    view.setUint16(
      22,
      channels,
      true
    );

    view.setUint32(
      24,
      sampleRate,
      true
    );

    view.setUint32(
      28,
      byteRate,
      true
    );

    view.setUint16(
      32,
      blockAlign,
      true
    );

    view.setUint16(
      34,
      bitsPerSample,
      true
    );

    /* data */

    writeString(
      view,
      36,
      "data"
    );

    view.setUint32(
      40,
      dataSize,
      true
    );

    const output =
      new Uint8Array(buffer);

    output.set(
      pcmData,
      44
    );

    return new Blob(
      [output],
      {
        type: "audio/wav",
      }
    );
  };

  /* ============================================================
     TEXT TO SPEECH
     GEMINI API
     ============================================================ */

  const speakTamil = async (
    text: string
  ) => {
    if (!text.trim()) {
      return;
    }

    if (
      typeof window ===
      "undefined"
    ) {
      return;
    }

    try {
      /* ---------------------------------------------
         Stop previous audio
         --------------------------------------------- */

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }

      setSpeechError("");
      setIsSpeaking(true);

      /* ---------------------------------------------
         CALL NEXT.JS API
         --------------------------------------------- */

      const response = await fetch(
        "/api/tts",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Accept:
              "application/json",
          },
          body: JSON.stringify({
            text: text.trim(),
            language: "Tamil",
          }),
        }
      );

      /* =================================================
         IMPORTANT FIX

         Do NOT directly call response.json().

         If /api/tts returns an HTML error page,
         response.json() produces:

         Unexpected token '<'
         
         We first read the response as text and then
         safely convert it to JSON.
         ================================================= */

      const responseText =
        await response.text();

      console.log(
        "TTS API status:",
        response.status
      );

      console.log(
        "TTS API response:",
        responseText
      );

      let data: {
        audio?: string;
        error?: string;
        message?: string;
      } = {};

      try {
        data = JSON.parse(
          responseText
        );
      } catch {
        /* ---------------------------------------------
           The API returned HTML or another non-JSON
           response.
           --------------------------------------------- */

        if (
          responseText
            .trim()
            .startsWith("<!DOCTYPE") ||
          responseText
            .trim()
            .startsWith("<html") ||
          responseText
            .trim()
            .startsWith("<")
        ) {
          throw new Error(
            "The /api/tts API route returned an HTML page instead of JSON. Check that app/api/tts/route.ts exists and that the Next.js server is running correctly."
          );
        }

        throw new Error(
          "The Tamil speech API returned an invalid response."
        );
      }

      /* ---------------------------------------------
         CHECK API STATUS
         --------------------------------------------- */

      if (!response.ok) {
        throw new Error(
          data?.error ||
            data?.message ||
            `Tamil speech API failed with status ${response.status}.`
        );
      }

      /* ---------------------------------------------
         CHECK AUDIO
         --------------------------------------------- */

      if (!data?.audio) {
        throw new Error(
          "Gemini did not return any audio."
        );
      }

      /* ---------------------------------------------
         GEMINI PCM → WAV
         --------------------------------------------- */

      const wavBlob =
        pcmToWav(
          data.audio,
          24000,
          1,
          16
        );

      const audioUrl =
        URL.createObjectURL(
          wavBlob
        );

      /* ---------------------------------------------
         CREATE AUDIO
         --------------------------------------------- */

      const audio =
        new Audio(audioUrl);

      audioRef.current =
        audio;

      audio.volume = 1;

      /* ---------------------------------------------
         AUDIO PLAY
         --------------------------------------------- */

      audio.onplay = () => {
        setIsSpeaking(true);
      };

      /* ---------------------------------------------
         AUDIO FINISHED
         --------------------------------------------- */

      audio.onended = () => {
        setIsSpeaking(false);

        URL.revokeObjectURL(
          audioUrl
        );

        audioRef.current =
          null;
      };

      /* ---------------------------------------------
         AUDIO ERROR
         --------------------------------------------- */

      audio.onerror = () => {
        console.error(
          "Tamil audio playback error"
        );

        setIsSpeaking(false);

        URL.revokeObjectURL(
          audioUrl
        );

        audioRef.current =
          null;

        setSpeechError(
          "The Tamil audio was generated but could not be played."
        );
      };

      /* ---------------------------------------------
         PLAY AUDIO
         --------------------------------------------- */

      await audio.play();
    } catch (error) {
      console.error(
        "Tamil TTS error:",
        error
      );

      setIsSpeaking(false);

      if (
        error instanceof Error
      ) {
        setSpeechError(
          error.message
        );
      } else {
        setSpeechError(
          "Could not generate Tamil pronunciation."
        );
      }
    }
  };

  /* ============================================================
     STOP TEXT TO SPEECH
     ============================================================ */

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.currentTime = 0;

      audioRef.current = null;
    }

    setIsSpeaking(false);
  };

  /* ============================================================
     SPEECH RECOGNITION
     ============================================================ */

  const startRecording = () => {
    if (
      isListening ||
      isRecognizing ||
      typeof window ===
        "undefined"
    ) {
      return;
    }

    setSpeechError("");
    setRecognizedText("");

    const speechWindow =
      window as unknown as {
        SpeechRecognition?: TamilSpeechRecognitionConstructor;
        webkitSpeechRecognition?: TamilSpeechRecognitionConstructor;
      };

    const SpeechRecognition =
      speechWindow.SpeechRecognition ||
      speechWindow.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError(
        "Speech recognition is not supported by this browser. Please use Google Chrome or Microsoft Edge."
      );

      return;
    }

    try {
      const recognition =
        new SpeechRecognition();

      recognitionRef.current =
        recognition;

      /* Tamil */

      recognition.lang =
        "ta-IN";

      recognition.continuous =
        false;

      recognition.interimResults =
        true;

      /* ---------------------------------------------
         START
         --------------------------------------------- */

      recognition.onstart = () => {
        setIsListening(true);
        setIsRecognizing(false);
        setSpeechError("");
      };

      /* ---------------------------------------------
         RESULT
         --------------------------------------------- */

      recognition.onresult = (
        event
      ) => {
        let transcript = "";

        for (
          let i = 0;
          i < event.results.length;
          i++
        ) {
          transcript +=
            event.results[i][0]
              .transcript;
        }

        setRecognizedText(
          transcript.trim()
        );
      };

      /* ---------------------------------------------
         ERROR
         --------------------------------------------- */

      recognition.onerror = (
        event
      ) => {
        console.error(
          "Tamil speech recognition error:",
          event
        );

        setIsListening(false);
        setIsRecognizing(false);

        switch (
          event.error
        ) {
          case "not-allowed":
            setSpeechError(
              "Microphone permission was denied. Please allow microphone access in your browser."
            );
            break;

          case "no-speech":
            setSpeechError(
              "No speech was detected. Please speak clearly and try again."
            );
            break;

          case "audio-capture":
            setSpeechError(
              "No microphone was found. Please connect a microphone and try again."
            );
            break;

          case "network":
            setSpeechError(
              "Speech recognition needs an internet connection. Please check your connection and try again."
            );
            break;

          default:
            setSpeechError(
              "Could not recognize Tamil speech. Please try again."
            );
        }
      };

      /* ---------------------------------------------
         END
         --------------------------------------------- */

      recognition.onend = () => {
        setIsListening(false);
        setIsRecognizing(false);

        recognitionRef.current =
          null;
      };

      setIsRecognizing(true);

      recognition.start();
    } catch (error) {
      console.error(
        "Tamil speech recognition error:",
        error
      );

      setIsListening(false);
      setIsRecognizing(false);

      setSpeechError(
        "Could not start Tamil speech recognition. Please try again."
      );
    }
  };

  /* ============================================================
     STOP SPEECH RECOGNITION
     ============================================================ */

  const stopRecording = () => {
    const recognition =
      recognitionRef.current;

    if (recognition) {
      try {
        recognition.stop();
      } catch {
        // Already stopped.
      }
    }

    setIsListening(false);
    setIsRecognizing(false);
  };

  /* ============================================================
     MICROPHONE BUTTON
     ============================================================ */

  const handleMicrophoneClick =
    () => {
      if (isListening) {
        stopRecording();
      } else {
        startRecording();
      }
    };

  /* ============================================================
     FILTER WORDS
     ============================================================ */

  const filteredWords =
    useMemo(() => {
      if (
        selectedCategory ===
        "All"
      ) {
        return words;
      }

      return words.filter(
        (word) =>
          word.category ===
          selectedCategory
      );
    }, [
      selectedCategory,
    ]);

  /* ============================================================
     SAFE CURRENT CARD
     ============================================================ */

  const safeCurrentCard =
    Math.min(
      currentCard,
      Math.max(
        filteredWords.length - 1,
        0
      )
    );

  const currentWord =
    filteredWords[
      safeCurrentCard
    ] ||
    filteredWords[0];

  /* ============================================================
     PROGRESS
     ============================================================ */

  const progress =
    Math.round(
      (learnedWords.length /
        words.length) *
        100
    );

  /* ============================================================
     MARK WORD AS LEARNED
     ============================================================ */

  const markAsLearned = () => {
    if (!currentWord) {
      return;
    }

    setLearnedWords(
      (previous) => {
        if (
          previous.includes(
            currentWord.tamil
          )
        ) {
          return previous;
        }

        return [
          ...previous,
          currentWord.tamil,
        ];
      }
    );

    if (
      safeCurrentCard <
      filteredWords.length - 1
    ) {
      setCurrentCard(
        (previous) =>
          previous + 1
      );
    }
  };

  /* ============================================================
     NEXT CARD
     ============================================================ */

  const nextCard = () => {
    if (
      filteredWords.length ===
      0
    ) {
      return;
    }

    stopSpeaking();

    setCurrentCard(
      (previous) =>
        previous >=
        filteredWords.length - 1
          ? 0
          : previous + 1
    );
  };

  /* ============================================================
     PREVIOUS CARD
     ============================================================ */

  const previousCard = () => {
    if (
      filteredWords.length ===
      0
    ) {
      return;
    }

    stopSpeaking();

    setCurrentCard(
      (previous) =>
        previous <= 0
          ? filteredWords.length - 1
          : previous - 1
    );
  };

  /* ============================================================
     CHANGE CATEGORY
     ============================================================ */

  const changeCategory = (
    category: string
  ) => {
    if (isListening) {
      stopRecording();
    }

    stopSpeaking();

    setSelectedCategory(
      category
    );

    setCurrentCard(0);

    setRecognizedText("");

    setSpeechError("");
  };

  /* ============================================================
     QUIZ
     ============================================================ */

  const answerQuiz = (
    answer: string
  ) => {
    if (answered) {
      return;
    }

    setSelectedAnswer(answer);

    setAnswered(true);

    if (
      answer ===
      quizQuestions[
        quizIndex
      ].answer
    ) {
      setQuizScore(
        (previous) =>
          previous + 1
      );
    }
  };

  /* ============================================================
     NEXT QUESTION
     ============================================================ */

  const nextQuestion = () => {
    if (
      quizIndex >=
      quizQuestions.length - 1
    ) {
      setQuizFinished(true);
      return;
    }

    setQuizIndex(
      (previous) =>
        previous + 1
    );

    setAnswered(false);

    setSelectedAnswer(null);
  };

  /* ============================================================
     RESTART QUIZ
     ============================================================ */

  const restartQuiz = () => {
    setQuizIndex(0);

    setQuizScore(0);

    setQuizFinished(false);

    setAnswered(false);

    setSelectedAnswer(null);
  };

  /* ============================================================
     RENDER
     ============================================================ */

  return (
    <main className="tamil-page">

      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <nav className="krida-nav">

        <div
          className="krida-logo"
          onClick={() =>
            router.push("/home")
          }
        >
          <span className="logo-flower">
            🪷
          </span>

          <div>
            <strong>
              KRIDAVIRASAT
            </strong>

            <small>
              Indian Knowledge System
            </small>
          </div>
        </div>

        <div className="krida-desktop-menu">

          <button
            type="button"
            onClick={() =>
              router.push("/home")
            }
          >
            Home
          </button>

          <button
            type="button"
            onClick={() =>
              router.push("/games")
            }
          >
            Games
          </button>

          <button
            type="button"
            className="nav-active"
            onClick={() =>
              router.push(
                "/learn-language"
              )
            }
          >
            Learn Language
          </button>

          <button
            type="button"
            onClick={() =>
              router.push("/about")
            }
          >
            About
          </button>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/achievements"
              )
            }
          >
            Achievements
          </button>

        </div>

        <button
          type="button"
          className="profile-button"
          onClick={() =>
            router.push(
              "/profile"
            )
          }
        >
          👤
        </button>

      </nav>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="tamil-hero">

        <div className="tamil-hero-pattern">
          தமிழ்
        </div>

        <div className="tamil-hero-content">

          <button
            type="button"
            className="tamil-back-button"
            onClick={() =>
              router.push(
                "/learn-language"
              )
            }
          >
            ← Back to Languages
          </button>

          <div className="tamil-eyebrow">
            LANGUAGE • HERITAGE • CULTURE
          </div>

          <h1>
            Learn
            <span>
              Tamil
            </span>
          </h1>

          <div className="tamil-hero-line" />

          <p>
            தமிழ் — Discover the beauty
            of one of India's classical
            languages through words,
            pronunciation and culture.
          </p>

          <div className="tamil-hero-tags">

            <span>
              தமிழ்
            </span>

            <span>
              தமிழ் மொழி
            </span>

            <span>
              Classical Language
            </span>

          </div>

        </div>

        <div className="tamil-hero-art">

          <div className="tamil-mandala">

            <span>அ</span>
            <span>ஆ</span>
            <span>இ</span>
            <span>ஈ</span>

            <div>
              தமிழ்
            </div>

          </div>

          <div className="tamil-lotus">
            🪷
          </div>

        </div>

      </section>

      {/* =====================================================
          PROGRESS
      ===================================================== */}

      <section className="tamil-progress-section">

        <div className="tamil-progress-card">

          <div className="progress-icon">
            📚
          </div>

          <div className="progress-info">

            <div className="progress-title-row">

              <h3>
                Your Tamil Journey
              </h3>

              <strong>
                {progress}%
              </strong>

            </div>

            <div className="progress-track">

              <div
                className="progress-fill"
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>

            <p>
              {learnedWords.length} of{" "}
              {words.length} words
              explored
            </p>

          </div>

          <div className="progress-badge">

            {progress >= 100
              ? "🏆 Completed"
              : "🌱 Learning"}

          </div>

        </div>

      </section>

      {/* =====================================================
          LEARN WORDS
      ===================================================== */}

      <section className="tamil-learn-section">

        <div className="tamil-section-heading">

          <small>
            STEP 01 • BUILD YOUR VOCABULARY
          </small>

          <h2>
            Learn Tamil Words
          </h2>

          <p>
            Start with simple words and
            expressions that you can use
            in everyday conversations.
          </p>

        </div>

        <div className="tamil-category-bar">

          {categories.map(
            (category) => (
              <button
                type="button"
                key={category}
                className={
                  selectedCategory ===
                  category
                    ? "category-active"
                    : ""
                }
                onClick={() =>
                  changeCategory(
                    category
                  )
                }
              >
                {category}
              </button>
            )
          )}

        </div>

        {currentWord && (

          <div className="tamil-flashcard-wrapper">

            <div className="tamil-flashcard">

              <div className="flashcard-label">
                {currentWord.category}
              </div>

              <div className="tamil-script-large">
                {currentWord.tamil}
              </div>

              <div className="tamil-pronunciation">
                {currentWord.pronunciation}
              </div>

              <div className="flashcard-divider" />

              <div className="tamil-meaning">
                {currentWord.english}
              </div>

              {/* =================================================
                  TEXT TO SPEECH
                  ================================================= */}

              <button
                type="button"
                className="listen-button"
                onClick={() =>
                  isSpeaking
                    ? stopSpeaking()
                    : speakTamil(
                        currentWord.tamil
                      )
                }
                disabled={
                  isListening ||
                  isRecognizing
                }
              >
                {isSpeaking
                  ? "⏹️ Stop Speaking"
                  : "🔊 Listen to Pronunciation"}
              </button>

              {/* =================================================
                  SPEECH RECOGNITION
                  ================================================= */}

              <button
                type="button"
                className="listen-button"
                onClick={
                  handleMicrophoneClick
                }
                disabled={
                  isSpeaking ||
                  isRecognizing
                }
              >
                {isListening
                  ? "⏹️ Stop Recording"
                  : isRecognizing
                  ? "⏳ Listening..."
                  : "🎤 Speak Tamil"}
              </button>

              {recognizedText && (

                <div className="recognized-speech">

                  <small>
                    You said:
                  </small>

                  <strong>
                    {recognizedText}
                  </strong>

                </div>

              )}

              {speechError && (

                <div className="speech-error">

                  ⚠️ {speechError}

                </div>

              )}

            </div>

            <div className="flashcard-controls">

              <button
                type="button"
                onClick={
                  previousCard
                }
              >
                ← Previous
              </button>

              <span>
                {safeCurrentCard + 1} /{" "}
                {filteredWords.length}
              </span>

              <button
                type="button"
                onClick={
                  nextCard
                }
              >
                Next →
              </button>

            </div>

            <button
              type="button"
              className="learned-button"
              onClick={
                markAsLearned
              }
            >
              ✓ I Learned This
            </button>

          </div>

        )}

      </section>

      {/* =====================================================
          QUICK PHRASES
      ===================================================== */}

      <section className="tamil-phrases-section">

        <div className="tamil-section-heading">

          <small>
            EVERYDAY TAMIL
          </small>

          <h2>
            Useful Phrases
          </h2>

          <p>
            Try these simple expressions
            in everyday conversations.
          </p>

        </div>

        <div className="tamil-phrase-grid">

          {/* VANAKKAM */}

          <article className="tamil-phrase-card">

            <span>👋</span>

            <div>

              <strong>
                வணக்கம்
              </strong>

              <small>
                Vanakkam
              </small>

              <p>
                Hello / Greetings
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                isSpeaking
                  ? stopSpeaking()
                  : speakTamil(
                      "வணக்கம்"
                    )
              }
              disabled={
                isListening ||
                isRecognizing
              }
              aria-label="Listen to Vanakkam"
            >
              {isSpeaking
                ? "⏹️"
                : "🔊"}
            </button>

          </article>

          {/* NANDRI */}

          <article className="tamil-phrase-card">

            <span>🙏</span>

            <div>

              <strong>
                நன்றி
              </strong>

              <small>
                Nandri
              </small>

              <p>
                Thank you
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                isSpeaking
                  ? stopSpeaking()
                  : speakTamil(
                      "நன்றி"
                    )
              }
              disabled={
                isListening ||
                isRecognizing
              }
              aria-label="Listen to Nandri"
            >
              {isSpeaking
                ? "⏹️"
                : "🔊"}
            </button>

          </article>

          {/* HOW ARE YOU */}

          <article className="tamil-phrase-card">

            <span>😊</span>

            <div>

              <strong>
                எப்படி இருக்கிறீர்கள்?
              </strong>

              <small>
                Eppadi irukkireergal?
              </small>

              <p>
                How are you?
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                isSpeaking
                  ? stopSpeaking()
                  : speakTamil(
                      "எப்படி இருக்கிறீர்கள்?"
                    )
              }
              disabled={
                isListening ||
                isRecognizing
              }
              aria-label="Listen to How are you"
            >
              {isSpeaking
                ? "⏹️"
                : "🔊"}
            </button>

          </article>

          {/* I AM FINE */}

          <article className="tamil-phrase-card">

            <span>❤️</span>

            <div>

              <strong>
                நன்றாக இருக்கிறேன்
              </strong>

              <small>
                Nandraaga irukkiren
              </small>

              <p>
                I am fine
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                isSpeaking
                  ? stopSpeaking()
                  : speakTamil(
                      "நன்றாக இருக்கிறேன்"
                    )
              }
              disabled={
                isListening ||
                isRecognizing
              }
              aria-label="Listen to I am fine"
            >
              {isSpeaking
                ? "⏹️"
                : "🔊"}
            </button>

          </article>

        </div>

      </section>

      {/* =====================================================
          SPEAKING PRACTICE
      ===================================================== */}

      <section className="tamil-speaking-section">

        <div className="tamil-section-heading">

          <small>
            STEP 02 • SPEAK & PRACTISE
          </small>

          <h2>
            Practice Speaking Tamil
          </h2>

          <p>
            Listen to the pronunciation,
            then speak the Tamil word
            into your microphone.
          </p>

        </div>

        <div className="tamil-speaking-card">

          <div className="speaking-word">
            {currentWord?.tamil}
          </div>

          <div className="speaking-pronunciation">
            {currentWord?.pronunciation}
          </div>

          <button
            type="button"
            className="speaking-listen-button"
            onClick={() =>
              currentWord &&
              (
                isSpeaking
                  ? stopSpeaking()
                  : speakTamil(
                      currentWord.tamil
                    )
              )
            }
            disabled={
              isListening ||
              isRecognizing ||
              !currentWord
            }
          >
            {isSpeaking
              ? "⏹️ Stop Speaking"
              : "🔊 Hear the Word"}
          </button>

          <button
            type="button"
            className="speaking-microphone-button"
            onClick={
              handleMicrophoneClick
            }
            disabled={
              isSpeaking ||
              isRecognizing
            }
          >
            {isListening
              ? "⏹️ Stop Recording"
              : isRecognizing
              ? "⏳ Listening..."
              : "🎤 Speak Now"}
          </button>

          {recognizedText && (

            <div className="recognized-speech speaking-result">

              <small>
                Speech Recognition Result
              </small>

              <strong>
                {recognizedText}
              </strong>

            </div>

          )}

          {speechError && (

            <div className="speech-error">

              ⚠️ {speechError}

            </div>

          )}

        </div>

      </section>

      {/* =====================================================
          QUIZ
      ===================================================== */}

      <section className="tamil-quiz-section">

        <div className="tamil-section-heading">

          <small>
            STEP 03 • TEST YOUR KNOWLEDGE
          </small>

          <h2>
            Tamil Quick Quiz
          </h2>

          <p>
            See how much you remember
            from the words you have
            learned.
          </p>

        </div>

        <div className="tamil-quiz-card">

          {!quizFinished ? (

            <>

              <div className="quiz-top">

                <span>
                  Question{" "}
                  {quizIndex + 1} of{" "}
                  {quizQuestions.length}
                </span>

                <strong>
                  Score: {quizScore}
                </strong>

              </div>

              <div className="quiz-progress">

                <div
                  style={{
                    width: `${
                      ((quizIndex + 1) /
                        quizQuestions.length) *
                      100
                    }%`,
                  }}
                />

              </div>

              <h3>
                {
                  quizQuestions[
                    quizIndex
                  ].question
                }
              </h3>

              <div className="quiz-options">

                {quizQuestions[
                  quizIndex
                ].options.map(
                  (option) => {

                    let className =
                      "quiz-option";

                    if (answered) {

                      if (
                        option ===
                        quizQuestions[
                          quizIndex
                        ].answer
                      ) {
                        className +=
                          " quiz-correct";
                      }

                      if (
                        option ===
                          selectedAnswer &&
                        option !==
                          quizQuestions[
                            quizIndex
                          ].answer
                      ) {
                        className +=
                          " quiz-wrong";
                      }
                    }

                    return (

                      <button
                        type="button"
                        key={option}
                        className={
                          className
                        }
                        onClick={() =>
                          answerQuiz(
                            option
                          )
                        }
                        disabled={
                          answered
                        }
                      >

                        {option}

                        {answered &&
                          option ===
                            quizQuestions[
                              quizIndex
                            ].answer && (

                            <span>
                              ✓
                            </span>

                          )}

                      </button>

                    );
                  }
                )}

              </div>

              {answered && (

                <div className="quiz-feedback">

                  {selectedAnswer ===
                  quizQuestions[
                    quizIndex
                  ].answer ? (

                    <p className="correct-text">
                      🎉 Correct!
                      Well done.
                    </p>

                  ) : (

                    <p className="wrong-text">
                      Not quite.
                      The correct
                      answer is{" "}
                      <strong>
                        {
                          quizQuestions[
                            quizIndex
                          ].answer
                        }
                      </strong>
                      .
                    </p>

                  )}

                  <button
                    type="button"
                    className="next-question-button"
                    onClick={
                      nextQuestion
                    }
                  >
                    {quizIndex ===
                    quizQuestions.length -
                      1
                      ? "See Result →"
                      : "Next Question →"}
                  </button>

                </div>

              )}

            </>

          ) : (

            <div className="quiz-result">

              <div className="result-trophy">
                {quizScore ===
                quizQuestions.length
                  ? "🏆"
                  : "🌟"}
              </div>

              <small>
                QUIZ COMPLETE
              </small>

              <h3>
                You scored{" "}
                {quizScore} /{" "}
                {quizQuestions.length}
              </h3>

              <p>
                {quizScore ===
                quizQuestions.length
                  ? "Excellent! You have a great start with Tamil."
                  : "Good effort! Keep practising and try again."}
              </p>

              <button
                type="button"
                className="restart-quiz-button"
                onClick={
                  restartQuiz
                }
              >
                🔄 Try Again
              </button>

            </div>

          )}

        </div>

      </section>

      {/* =====================================================
          CULTURAL NOTE
      ===================================================== */}

      <section className="tamil-culture-section">

        <div className="tamil-culture-symbol">
          தமிழ்
        </div>

        <div>

          <small>
            LANGUAGE & HERITAGE
          </small>

          <h2>
            Tamil is more than a language.
          </h2>

          <p>
            Tamil has a long literary and
            cultural tradition. Through
            its words, literature, songs
            and everyday expressions,
            the language carries stories
            and knowledge across
            generations.
          </p>

        </div>

      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="krida-footer">

        <div className="footer-logo">
          🪷 KRIDAVIRASAT
        </div>

        <p>
          Rediscover the Heritage of
          Indian Play
        </p>

        <div className="footer-links">

          <button
            type="button"
            onClick={() =>
              router.push("/about")
            }
          >
            About
          </button>

          <button
            type="button"
            onClick={() =>
              router.push("/contact")
            }
          >
            Contact
          </button>

          <button
            type="button"
            onClick={() =>
              router.push("/feedback")
            }
          >
            Feedback
          </button>

        </div>

        <small>
          © 2026 KRIDAVIRASAT · Indian
          Knowledge System
        </small>

      </footer>

    </main>
  );
}
