'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import fr from '@/dictionaries/fr';
import en from '@/dictionaries/en';
import nl from '@/dictionaries/nl';

export const LOCALES = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
  { code: 'nl', label: 'NL' },
];

const DICTIONARIES = { fr, en, nl };
const STORAGE_KEY = 'gfl_locale';

const LocaleContext = createContext({ locale: 'fr', setLocale: () => {}, dict: fr });

function getByPath(obj, path) {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
}

export function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState('fr');

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (stored && DICTIONARIES[stored]) setLocaleState(stored);
  }, []);

  const setLocale = (next) => {
    if (!DICTIONARIES[next]) return;
    setLocaleState(next);
    localStorage.setItem(STORAGE_KEY, next);
    if (typeof document !== 'undefined') document.documentElement.lang = next;
  };

  const dict = DICTIONARIES[locale] || fr;

  const value = useMemo(() => ({ locale, setLocale, dict }), [locale, dict]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}

// t('nav.home') -> reads dict.nav.home, falling back to the French string
// (and finally the key itself) if a translation is missing.
export function useT() {
  const { dict } = useContext(LocaleContext);
  return (path) => getByPath(dict, path) ?? getByPath(fr, path) ?? path;
}
