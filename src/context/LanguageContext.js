"use client";

import { createContext, useState, useEffect } from "react";

export const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    let savedLanguage = localStorage.getItem("language");
    if (!savedLanguage || savedLanguage === null) {
      savedLanguage =
        (navigator.language || navigator.userLanguage).split("-")[0] || "en";
      localStorage.setItem("language", savedLanguage);
    }

    setLanguage(savedLanguage);
    loadTranslations(savedLanguage);
  }, []);

  const loadTranslations = async (lang) => {
    try {
      const res = await import(`@/locales/${lang}.json`);
      setTranslations(res);
    } catch (error) {
      console.error("Ошибка загрузки перевода:", error);
    }
  };

  const changeLanguage = (lang) => {
    localStorage.setItem("language", lang);
    setLanguage(lang);
    loadTranslations(lang);
  };

  return (
    <LanguageContext.Provider
      value={{ language, translations, changeLanguage }}
    >
      {children}
    </LanguageContext.Provider>
  );
}
