import { createContext, useContext, useEffect, useState } from 'react';
import type { Lang } from '@/i18n/translations';
import translations from '@/i18n/translations';

interface LanguageContextType {
  lang: Lang;
  toggleLang: () => void;
  t: typeof translations[Lang];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    return (localStorage.getItem('portfolio-lang') as Lang) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('portfolio-lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const toggleLang = () => setLang((prev) => (prev === 'en' ? 'ar' : 'en'));

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used inside LanguageProvider');
  return ctx;
}
