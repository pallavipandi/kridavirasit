"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type Word = {
  hindi: string;
  pronunciation: string;
  english: string;
  category: string;
};

const words: Word[] = [
  {
    hindi: "नमस्ते",
    pronunciation: "Namaste",
    english: "Hello / Greetings",
    category: "Greetings",
  },
  {
    hindi: "धन्यवाद",
    pronunciation: "Dhanyavaad",
    english: "Thank you",
    category: "Greetings",
  },
  {
    hindi: "हाँ",
    pronunciation: "Haan",
    english: "Yes",
    category: "Everyday",
  },
  {
    hindi: "नहीं",
    pronunciation: "Nahin",
    english: "No",
    category: "Everyday",
  },
  {
    hindi: "माँ",
    pronunciation: "Maa",
    english: "Mother",
    category: "Family",
  },
  {
    hindi: "पिता",
    pronunciation: "Pita",
    english: "Father",
    category: "Family",
  },
  {
    hindi: "भाई",
    pronunciation: "Bhai",
    english: "Brother",
    category: "Family",
  },
  {
    hindi: "बहन",
    pronunciation: "Behen",
    english: "Sister",
    category: "Family",
  },
  {
    hindi: "एक",
    pronunciation: "Ek",
    english: "One",
    category: "Numbers",
  },
  {
    hindi: "दो",
    pronunciation: "Do",
    english: "Two",
    category: "Numbers",
  },
  {
    hindi: "तीन",
    pronunciation: "Teen",
    english: "Three",
    category: "Numbers",
  },
  {
    hindi: "चार",
    pronunciation: "Chaar",
    english: "Four",
    category: "Numbers",
  },
  {
    hindi: "पाँच",
    pronunciation: "Paanch",
    english: "Five",
    category: "Numbers",
  },
  {
    hindi: "पानी",
    pronunciation: "Paani",
    english: "Water",
    category: "Everyday",
  },
  {
    hindi: "खाना",
    pronunciation: "Khaana",
    english: "Food",
    category: "Everyday",
  },
  {
    hindi: "घर",
    pronunciation: "Ghar",
    english: "House / Home",
    category: "Everyday",
  },
];

const categories = [
  "All",
  "Greetings",
  "Family",
  "Numbers",
  "Everyday",
];

const phrases = [
  {
    icon: "👋",
    hindi: "नमस्ते",
    pronunciation: "Namaste",
    english: "Hello / Greetings",
  },
  {
    icon: "🙏",
    hindi: "धन्यवाद",
    pronunciation: "Dhanyavaad",
    english: "Thank you",
  },
  {
    icon: "😊",
    hindi: "आप कैसे हैं?",
    pronunciation: "Aap kaise hain?",
    english: "How are you?",
  },
  {
    icon: "❤️",
    hindi: "मैं ठीक हूँ",
    pronunciation: "Main theek hoon",
    english: "I am fine",
  },
];

const quizQuestions = [
  {
    question: "What does “नमस्ते” mean?",
    options: ["Thank you", "Hello", "Water", "Mother"],
    answer: "Hello",
  },
  {
    question: "What is “धन्यवाद”?",
    options: ["Thank you", "Goodbye", "Father", "Food"],
    answer: "Thank you",
  },
  {
    question: "What does “माँ” mean?",
    options: ["Father", "Mother", "Sister", "Brother"],
    answer: "Mother",
  },
  {
    question: "What is “पानी”?",
    options: ["Food", "House", "Water", "One"],
    answer: "Water",
  },
  {
    question: "What does “तीन” mean?",
    options: ["Two", "Three", "Four", "Five"],
    answer: "Three",
  },
];

/* =========================================================
   SPEECH RECOGNITION TYPES
   ========================================================= */

interface SpeechRecognitionEventLike {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
        confidence: number;
      };
    };
  };
}

interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;

  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export default function HindiLanguagePage() {
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [currentCard, setCurrentCard] = useState(0);

  const [learnedWords, setLearnedWords] =
    useState<string[]>([]);

  const [quizIndex, setQuizIndex] = useState(0);

  const [quizScore, setQuizScore] = useState(0);

  const [quizFinished, setQuizFinished] =
    useState(false);

  const [answered, setAnswered] = useState(false);

  const [selectedAnswer, setSelectedAnswer] =
    useState<string | null>(null);

  /* =========================================================
     TTS
     ========================================================= */

  const speechRef =
    useRef<SpeechSynthesisUtterance | null>(null);

  const speakingRef = useRef(false);

  /* =========================================================
     STT
     ========================================================= */

  const recognitionRef =
    useRef<SpeechRecognitionInstance | null>(null);

  const [isListening, setIsListening] =
    useState(false);

  const [recognizedText, setRecognizedText] =
    useState("");

  const [sttError, setSttError] =
    useState("");

  /* =========================================================
     INITIALIZE TTS
     ========================================================= */

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!("speechSynthesis" in window)) {
      console.warn(
        "Speech synthesis is not supported by this browser."
      );
      return;
    }

    const handleVoicesChanged = () => {
      window.speechSynthesis.getVoices();
    };

    window.speechSynthesis.addEventListener(
      "voiceschanged",
      handleVoicesChanged
    );

    return () => {
      window.speechSynthesis.removeEventListener(
        "voiceschanged",
        handleVoicesChanged
      );

      window.speechSynthesis.cancel();

      speechRef.current = null;
      speakingRef.current = false;
    };
  }, []);

  /* =========================================================
     TTS - SPEAK HINDI
     ========================================================= */

  const speakHindi = (text: string) => {
    if (typeof window === "undefined") return;

    if (!("speechSynthesis" in window)) {
      alert(
        "Your browser does not support speech playback."
      );
      return;
    }

    try {
      const synth = window.speechSynthesis;

      synth.cancel();

      speechRef.current = null;
      speakingRef.current = false;

      window.setTimeout(() => {
        try {
          const utterance =
            new SpeechSynthesisUtterance(text);

          speechRef.current = utterance;
          speakingRef.current = true;

          const voices = synth.getVoices();

          const hindiVoice = voices.find((voice) =>
            voice.lang
              .toLowerCase()
              .startsWith("hi")
          );

          if (hindiVoice) {
            utterance.voice = hindiVoice;
            utterance.lang = hindiVoice.lang;
          } else {
            utterance.lang = "hi-IN";
          }

          utterance.rate = 0.85;
          utterance.pitch = 1;
          utterance.volume = 1;

          utterance.onstart = () => {
            speakingRef.current = true;
            console.log(
              "Hindi speech started:",
              text
            );
          };

          utterance.onend = () => {
            speakingRef.current = false;

            if (
              speechRef.current === utterance
            ) {
              speechRef.current = null;
            }

            console.log(
              "Hindi speech completed"
            );
          };

          utterance.onerror = (event) => {
            if (
              event.error === "canceled" ||
              event.error === "interrupted"
            ) {
              speakingRef.current = false;
              return;
            }

            speakingRef.current = false;

            console.warn(
              "Hindi speech could not be played:",
              event.error
            );

            if (
              speechRef.current === utterance
            ) {
              speechRef.current = null;
            }
          };

          synth.cancel();

          synth.speak(utterance);
        } catch (error) {
          speakingRef.current = false;

          console.warn(
            "Hindi speech could not start:",
            error
          );
        }
      }, 100);
    } catch (error) {
      speakingRef.current = false;

      console.warn(
        "Hindi speech error:",
        error
      );
    }
  };

  /* =========================================================
     STT - START LISTENING
     ========================================================= */

  const startListening = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSttError(
        "Speech recognition is not supported in this browser. Please use Google Chrome."
      );
      return;
    }

    /* Stop existing recognition */
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore
      }

      recognitionRef.current = null;
    }

    setRecognizedText("");
    setSttError("");

    const recognition =
      new SpeechRecognition();

    recognition.lang = "hi-IN";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsListening(true);
      setSttError("");
      console.log("Hindi STT started");
    };

    recognition.onresult = (event) => {
      let transcript = "";

      for (
        let i = 0;
        i < Object.keys(event.results).length;
        i++
      ) {
        const result = event.results[i];

        if (result && result[0]) {
          transcript += result[0].transcript;
        }
      }

      setRecognizedText(transcript);
    };

    recognition.onerror = (event) => {
      console.warn(
        "Hindi speech recognition error:",
        event.error
      );

      setIsListening(false);

      if (event.error === "not-allowed") {
        setSttError(
          "Microphone permission was denied. Please allow microphone access."
        );
      } else if (event.error === "no-speech") {
        setSttError(
          "No speech detected. Please try speaking again."
        );
      } else if (event.error === "network") {
        setSttError(
          "Speech recognition needs an internet connection in Chrome."
        );
      } else {
        setSttError(
          "Could not recognize speech. Please try again."
        );
      }
    };

    recognition.onend = () => {
      setIsListening(false);

      if (
        recognitionRef.current === recognition
      ) {
        recognitionRef.current = null;
      }

      console.log("Hindi STT ended");
    };

    try {
      recognition.start();
    } catch (error) {
      console.warn(
        "Could not start Hindi speech recognition:",
        error
      );

      setIsListening(false);
      setSttError(
        "Could not start the microphone. Please try again."
      );
    }
  };

  /* =========================================================
     STT - STOP LISTENING
     ========================================================= */

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore
      }

      recognitionRef.current = null;
    }

    setIsListening(false);
  };

  /* =========================================================
     CLEANUP STT
     ========================================================= */

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // Ignore
        }
      }
    };
  }, []);

  /* =========================================================
     FILTER WORDS
     ========================================================= */

  const filteredWords =
    selectedCategory === "All"
      ? words
      : words.filter(
          (word) =>
            word.category === selectedCategory
        );

  const currentWord =
    filteredWords[currentCard] ||
    filteredWords[0];

  const progress = Math.round(
    (learnedWords.length / words.length) * 100
  );

  /* =========================================================
     FLASHCARD FUNCTIONS
     ========================================================= */

  const changeCategory = (
    category: string
  ) => {
    setSelectedCategory(category);
    setCurrentCard(0);
    setRecognizedText("");
    setSttError("");
  };

  const previousCard = () => {
    if (filteredWords.length === 0) return;

    setCurrentCard((previous) =>
      previous <= 0
        ? filteredWords.length - 1
        : previous - 1
    );

    setRecognizedText("");
    setSttError("");
  };

  const nextCard = () => {
    if (filteredWords.length === 0) return;

    setCurrentCard((previous) =>
      previous >= filteredWords.length - 1
        ? 0
        : previous + 1
    );

    setRecognizedText("");
    setSttError("");
  };

  const markAsLearned = () => {
    if (!currentWord) return;

    setLearnedWords((previous) => {
      if (
        previous.includes(
          currentWord.hindi
        )
      ) {
        return previous;
      }

      return [
        ...previous,
        currentWord.hindi,
      ];
    });

    nextCard();
  };

  /* =========================================================
     QUIZ
     ========================================================= */

  const answerQuiz = (
    answer: string
  ) => {
    if (answered) return;

    setSelectedAnswer(answer);
    setAnswered(true);

    if (
      answer ===
      quizQuestions[quizIndex].answer
    ) {
      setQuizScore(
        (previous) => previous + 1
      );
    }
  };

  const nextQuestion = () => {
    if (
      quizIndex >=
      quizQuestions.length - 1
    ) {
      setQuizFinished(true);
      return;
    }

    setQuizIndex(
      (previous) => previous + 1
    );

    setAnswered(false);
    setSelectedAnswer(null);
  };

  const restartQuiz = () => {
    setQuizIndex(0);
    setQuizScore(0);
    setQuizFinished(false);
    setAnswered(false);
    setSelectedAnswer(null);
  };

  /* =========================================================
     PAGE
     ========================================================= */

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
            onClick={() =>
              router.push("/home")
            }
          >
            Home
          </button>

          <button
            onClick={() =>
              router.push("/games")
            }
          >
            Games
          </button>

          <button
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
            onClick={() =>
              router.push("/about")
            }
          >
            About
          </button>

          <button
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
          className="profile-button"
          onClick={() =>
            router.push("/profile")
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
          हिन्दी
        </div>

        <div className="tamil-hero-content">

          <button
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
            Learn{" "}
            <span>
              Hindi
            </span>
          </h1>

          <div className="tamil-hero-line" />

          <p>
            हिन्दी — Discover the beauty
            of Hindi through everyday
            words, pronunciation and
            Indian culture.
          </p>

          <div className="tamil-hero-tags">

            <span>
              हिन्दी
            </span>

            <span>
              हिंदी भाषा
            </span>

            <span>
              Indian Language
            </span>

          </div>

        </div>

        <div className="tamil-hero-art">

          <div className="tamil-mandala">

            <span>
              अ
            </span>

            <span>
              आ
            </span>

            <span>
              इ
            </span>

            <span>
              ई
            </span>

            <div>
              हिन्दी
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
                Your Hindi Journey
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
            Learn Hindi Words
          </h2>

          <p>
            Start with simple Hindi
            words and expressions that
            you can use in everyday
            conversations.
          </p>

        </div>

        <div className="tamil-category-bar">

          {categories.map(
            (category) => (

              <button
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
                {currentWord.hindi}
              </div>

              <div className="tamil-pronunciation">
                {currentWord.pronunciation}
              </div>

              <div className="flashcard-divider" />

              <div className="tamil-meaning">
                {currentWord.english}
              </div>

              {/* =================================================
                  TTS BUTTON
              ================================================= */}

              <button
                type="button"
                className="listen-button"
                onClick={() =>
                  speakHindi(
                    currentWord.hindi
                  )
                }
              >
                🔊 Listen to Pronunciation
              </button>

              {/* =================================================
                  STT BUTTON
              ================================================= */}

              <button
                type="button"
                className="listen-button"
                onClick={
                  isListening
                    ? stopListening
                    : startListening
                }
              >
                {isListening
                  ? "⏹ Stop Listening"
                  : "🎤 Speak Hindi"}
              </button>

              {/* =================================================
                  STT TEXT OUTPUT
              ================================================= */}

              {isListening && (
                <div
                  className="speech-status"
                  style={{
                    marginTop: "15px",
                    padding: "12px",
                    borderRadius: "10px",
                    background:
                      "rgba(255,255,255,0.12)",
                    textAlign: "center",
                  }}
                >
                  🎙️ Listening... Speak in Hindi
                </div>
              )}

              {recognizedText && (
                <div
                  className="speech-result"
                  style={{
                    marginTop: "15px",
                    padding: "15px",
                    borderRadius: "12px",
                    background:
                      "rgba(255,255,255,0.18)",
                    textAlign: "center",
                  }}
                >
                  <small>
                    YOUR SPEECH
                  </small>

                  <div
                    style={{
                      fontSize: "1.4rem",
                      fontWeight: 600,
                      marginTop: "6px",
                    }}
                  >
                    {recognizedText}
                  </div>
                </div>
              )}

              {sttError && (
                <div
                  style={{
                    marginTop: "12px",
                    padding: "10px",
                    borderRadius: "10px",
                    background:
                      "rgba(255,80,80,0.15)",
                    textAlign: "center",
                  }}
                >
                  ⚠️ {sttError}
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
                {currentCard + 1} /{" "}
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
          PHRASES
      ===================================================== */}

      <section className="tamil-phrases-section">

        <div className="tamil-section-heading">

          <small>
            EVERYDAY HINDI
          </small>

          <h2>
            Useful Phrases
          </h2>

          <p>
            Listen and practise these
            simple Hindi expressions.
          </p>

        </div>

        <div className="tamil-phrase-grid">

          {phrases.map((phrase) => (

            <article
              className="tamil-phrase-card"
              key={phrase.hindi}
            >

              <span>
                {phrase.icon}
              </span>

              <div>

                <strong>
                  {phrase.hindi}
                </strong>

                <small>
                  {phrase.pronunciation}
                </small>

                <p>
                  {phrase.english}
                </p>

              </div>

              {/* TTS */}

              <button
                type="button"
                onClick={() =>
                  speakHindi(
                    phrase.hindi
                  )
                }
                aria-label={`Listen to ${phrase.english}`}
              >
                🔊
              </button>

              {/* STT */}

              <button
                type="button"
                onClick={() => {
                  setRecognizedText("");
                  setSttError("");
                  startListening();
                }}
                aria-label={`Speak ${phrase.english}`}
              >
                🎤
              </button>

              {/* STT RESULT */}

              {recognizedText && (
                <div
                  style={{
                    width: "100%",
                    marginTop: "10px",
                    padding: "10px",
                    borderRadius: "10px",
                    background:
                      "rgba(255,255,255,0.15)",
                  }}
                >
                  <small>
                    YOUR SPEECH
                  </small>

                  <div
                    style={{
                      fontWeight: 600,
                      marginTop: "5px",
                    }}
                  >
                    {recognizedText}
                  </div>
                </div>
              )}

            </article>

          ))}

        </div>

      </section>

      {/* =====================================================
          QUIZ
      ===================================================== */}

      <section className="tamil-quiz-section">

        <div className="tamil-section-heading">

          <small>
            STEP 02 • TEST YOUR KNOWLEDGE
          </small>

          <h2>
            Hindi Quick Quiz
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
                    width: `${(
                      ((quizIndex + 1) /
                        quizQuestions.length) *
                      100
                    )}%`,
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
                      The correct answer
                      is{" "}
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
                    quizQuestions.length - 1
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
                  ? "Excellent! You have a great start with Hindi."
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
          हिन्दी
        </div>

        <div>

          <small>
            LANGUAGE & HERITAGE
          </small>

          <h2>
            Hindi is more than a language.
          </h2>

          <p>
            Hindi is widely spoken across
            India and has a rich literary
            and cultural tradition. Through
            its words, literature, poetry,
            songs and everyday expressions,
            the language connects people
            and carries stories across
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
            onClick={() =>
              router.push("/about")
            }
          >
            About
          </button>

          <button
            onClick={() =>
              router.push("/contact")
            }
          >
            Contact
          </button>

          <button
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