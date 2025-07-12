import React, { createContext, useContext, useState, ReactNode } from 'react';
import { translations, Language } from '../i18n';

interface LanguageContextProps {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (section: keyof typeof translations['en'], key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const stored = localStorage.getItem('lang') as Language | null;
    return stored || 'es';
  });

  const setLang = (newLang: Language) => {
    localStorage.setItem('lang', newLang);
    setLangState(newLang);
  };

  const t = (section: keyof typeof translations['en'], key: string) => {
    // @ts-ignore
    return translations[lang][section]?.[key] || translations['es'][section]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
