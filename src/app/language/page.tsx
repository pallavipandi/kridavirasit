"use client";

import { motion } from "framer-motion";
import { ArrowRight, Search, Check } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../LanguageProvider";
import { LanguageCode } from "../translations";

type Language = {
  name: string;
  native: string;
  code: string;
  group: "Indian" | "International";
};

const languages: Language[] = [
  {
    name: "English",
    native: "English",
    code: "en",
    group: "Indian",
  },
  {
    name: "Hindi",
    native: "हिन्दी",
    code: "hi",
    group: "Indian",
  },
  {
    name: "Tamil",
    native: "தமிழ்",
    code: "ta",
    group: "Indian",
  },
  {
    name: "Telugu",
    native: "తెలుగు",
    code: "te",
    group: "Indian",
  },
  {
    name: "Kannada",
    native: "ಕನ್ನಡ",
    code: "kn",
    group: "Indian",
  },
  {
    name: "Malayalam",
    native: "മലയാളം",
    code: "ml",
    group: "Indian",
  },
  {
    name: "Bengali",
    native: "বাংলা",
    code: "bn",
    group: "Indian",
  },
  {
    name: "Marathi",
    native: "मराठी",
    code: "mr",
    group: "Indian",
  },
  {
    name: "Gujarati",
    native: "ગુજરાતી",
    code: "gu",
    group: "Indian",
  },
  {
    name: "Punjabi",
    native: "ਪੰਜਾਬੀ",
    code: "pa",
    group: "Indian",
  },
  {
    name: "Sanskrit",
    native: "संस्कृतम्",
    code: "sa",
    group: "Indian",
  },
  {
    name: "Urdu",
    native: "اردو",
    code: "ur",
    group: "Indian",
  },
  {
    name: "Odia",
    native: "ଓଡ଼ିଆ",
    code: "or",
    group: "Indian",
  },
  {
    name: "Assamese",
    native: "অসমীয়া",
    code: "as",
    group: "Indian",
  },
  {
    name: "Konkani",
    native: "कोंकणी",
    code: "gom",
    group: "Indian",
  },
  {
    name: "Kashmiri",
    native: "कॉशुर",
    code: "ks",
    group: "Indian",
  },
  {
    name: "Sindhi",
    native: "سنڌي",
    code: "sd",
    group: "Indian",
  },
  {
    name: "Maithili",
    native: "मैथिली",
    code: "mai",
    group: "Indian",
  },
  {
    name: "Manipuri",
    native: "মৈতৈলোন্",
    code: "mni",
    group: "Indian",
  },
  {
    name: "Nepali",
    native: "नेपाली",
    code: "ne",
    group: "Indian",
  },
  {
    name: "Spanish",
    native: "Español",
    code: "es",
    group: "International",
  },
  {
    name: "German",
    native: "Deutsch",
    code: "de",
    group: "International",
  },
  {
    name: "French",
    native: "Français",
    code: "fr",
    group: "International",
  },
  {
    name: "Korean",
    native: "한국어",
    code: "ko",
    group: "International",
  },
  {
    name: "Japanese",
    native: "日本語",
    code: "ja",
    group: "International",
  },
  {
    name: "Chinese",
    native: "中文",
    code: "zh",
    group: "International",
  },
  {
    name: "Arabic",
    native: "العربية",
    code: "ar",
    group: "International",
  },
  {
    name: "Portuguese",
    native: "Português",
    code: "pt",
    group: "International",
  },
  {
    name: "Russian",
    native: "Русский",
    code: "ru",
    group: "International",
  },
  {
    name: "Italian",
    native: "Italiano",
    code: "it",
    group: "International",
  },
];

export default function LanguagePage() {
  const router = useRouter();
  const { setLanguage } = useLanguage();

  const [selectedLanguage, setSelectedLanguage] =
    useState<Language | null>(null);

  const [search, setSearch] = useState("");

  const filteredLanguages = useMemo(() => {
    return languages.filter(
      (language) =>
        language.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        language.native.includes(search),
    );
  }, [search]);

  const indianLanguages = filteredLanguages.filter(
    (language) => language.group === "Indian",
  );

  const internationalLanguages = filteredLanguages.filter(
    (language) => language.group === "International",
  );

  const continueToWelcome = () => {
    if (!selectedLanguage) return;

    setLanguage(selectedLanguage.code as LanguageCode);

    localStorage.setItem(
      "kridavirasat-language",
      JSON.stringify(selectedLanguage),
    );

    router.push("/home");
  };

  return (
    <main className="language-page">
      <div className="heritage-border" />

      <div className="language-container">

        <motion.header
          className="language-header"
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >

          <h1 className="language-brand">
            KRIDAVIRASAT
          </h1>

          <h2 className="language-title">
            Choose Your Language
          </h2>

          <p className="language-subtitle">
            Begin your journey through India's heritage in a
            language you understand.
          </p>

        </motion.header>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div style={{ position: "relative" }}>
            <Search
              size={18}
              style={{
                position: "absolute",
                left: "18px",
                top: "17px",
                color: "#76563b",
              }}
            />

            <input
              className="language-search"
              style={{ paddingLeft: "48px" }}
              type="text"
              placeholder="Search for a language..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>
        </motion.div>

        <section>
          <h3 className="language-section-title">
            🇮🇳 Indian Languages
          </h3>

          <div className="language-grid">
            {indianLanguages.map((language) => (
              <LanguageCard
                key={language.code}
                language={language}
                selected={
                  selectedLanguage?.code === language.code
                }
                onSelect={setSelectedLanguage}
              />
            ))}
          </div>
        </section>

        <section>
          <h3 className="language-section-title">
            🌍 International Languages
          </h3>

          <div className="language-grid">
            {internationalLanguages.map((language) => (
              <LanguageCard
                key={language.code}
                language={language}
                selected={
                  selectedLanguage?.code === language.code
                }
                onSelect={setSelectedLanguage}
              />
            ))}
          </div>
        </section>

        {selectedLanguage && (
          <motion.div
            className="selected-language"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Selected language:{" "}
            {selectedLanguage.native} —{" "}
            {selectedLanguage.name}
          </motion.div>
        )}

        <button
          className="language-continue"
          disabled={!selectedLanguage}
          onClick={continueToWelcome}
        >
          Continue
          <ArrowRight
            size={16}
            style={{
              marginLeft: "10px",
              verticalAlign: "middle",
            }}
          />
        </button>
      </div>
    </main>
  );
}

function LanguageCard({
  language,
  selected,
  onSelect,
}: {
  language: Language;
  selected: boolean;
  onSelect: (language: Language) => void;
}) {
  return (
    <motion.button
      type="button"
      className={`language-card ${
        selected ? "selected" : ""
      }`}
      onClick={() => onSelect(language)}
      whileTap={{ scale: 0.98 }}
    >
      <span className="language-native">
        {language.native}

        {selected && (
          <Check
            size={18}
            style={{
              float: "right",
              color: "#9a6920",
            }}
          />
        )}
      </span>

      <span className="language-english">
        {language.name}
      </span>
    </motion.button>
  );
}