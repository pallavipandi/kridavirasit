"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import {
  translations,
  getLanguage,
  LanguageCode,
} from "./translations";

type TranslationData = (typeof translations)["en"];

type LanguageContextType = {
  language: LanguageCode;
  t: TranslationData;
  setLanguage: (language: LanguageCode) => void;
};

const LanguageContext = createContext<
  LanguageContextType | undefined
>(undefined);

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [language, setLanguageState] =
    useState<LanguageCode>("en");

  useEffect(() => {
    const savedLanguage = getLanguage();

    console.log("GLOBAL LANGUAGE LOADED:", savedLanguage);

    setLanguageState(savedLanguage);
    document.documentElement.lang = savedLanguage;
  }, []);

  const setLanguage = (newLanguage: LanguageCode) => {
    console.log("GLOBAL LANGUAGE CHANGED:", newLanguage);

    localStorage.setItem(
      "kridavirasat-language",
      JSON.stringify({
        code: newLanguage,
      })
    );

    setLanguageState(newLanguage);
    document.documentElement.lang = newLanguage;
  };

  const t = translations[language] || translations.en;

  return (
    <LanguageContext.Provider
      value={{
        language,
        t,
        setLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
}