"use client";

/**
 * Système i18n léger — MRJC-BÉNIN
 * Provider React Context + hook useTranslation
 * Langues: Français (défaut), English, Español
 * Persistance: localStorage
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

import fr from "./translations/fr.json";
import en from "./translations/en.json";
import es from "./translations/es.json";

// ─── Types ────────────────────────────────────────────────────────────────────
export type Locale = "fr" | "en" | "es";

export interface LanguageInfo {
  code: Locale;
  label: string;
  nativeLabel: string;
  flag: string; // Emoji drapeau
  flagSvg: string; // Chemin SVG (facultatif, sinon emoji)
  dir: "ltr" | "rtl";
}

export const LANGUAGES: Record<Locale, LanguageInfo> = {
  fr: {
    code: "fr",
    label: "Français",
    nativeLabel: "Français",
    flag: "🇫🇷",
    flagSvg: "/assets/flags/fr.svg",
    dir: "ltr",
  },
  en: {
    code: "en",
    label: "English",
    nativeLabel: "English",
    flag: "🇬🇧",
    flagSvg: "/assets/flags/en.svg",
    dir: "ltr",
  },
  es: {
    code: "es",
    label: "Español",
    nativeLabel: "Español",
    flag: "🇪🇸",
    flagSvg: "/assets/flags/es.svg",
    dir: "ltr",
  },
};

// ─── Dictionnaire ──────────────────────────────────────────────────────────────
type TranslationDict = typeof fr;

const TRANSLATIONS: Record<Locale, TranslationDict> = { fr, en, es };

// ─── Context ──────────────────────────────────────────────────────────────────
interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, vars?: Record<string, string>) => string;
  language: LanguageInfo;
  languages: LanguageInfo[];
  isChanging: boolean;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "mrjc_locale";
const DEFAULT_LOCALE: Locale = "fr";

// ─── Provider ─────────────────────────────────────────────────────────────────
export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [isChanging, setIsChanging] = useState(false);

  // Restauration depuis localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored && stored in TRANSLATIONS) {
      setLocaleState(stored);
    } else {
      // Détection auto de la langue navigateur
      const browserLang = navigator.language.split("-")[0] as Locale;
      if (browserLang in TRANSLATIONS) {
        setLocaleState(browserLang);
      }
    }
  }, []);

  const setLocale = useCallback(
    (newLocale: Locale) => {
      if (newLocale === locale) return;
      setIsChanging(true);
      setTimeout(() => {
        setLocaleState(newLocale);
        localStorage.setItem(STORAGE_KEY, newLocale);
        document.documentElement.lang = newLocale;
        document.documentElement.dir = LANGUAGES[newLocale].dir;
        setIsChanging(false);
      }, 150);
    },
    [locale],
  );

  // Fonction de traduction avec support des variables
  const t = useCallback(
    (key: string, vars?: Record<string, string>): string => {
      const dict = TRANSLATIONS[locale] as Record<string, unknown>;
      const parts = key.split(".");
      let value: unknown = dict;

      for (const part of parts) {
        if (
          typeof value === "object" &&
          value !== null &&
          part in (value as object)
        ) {
          value = (value as Record<string, unknown>)[part];
        } else {
          // Fallback sur le français
          let fallback: unknown = TRANSLATIONS.fr as Record<string, unknown>;
          for (const p of parts) {
            if (
              typeof fallback === "object" &&
              fallback !== null &&
              p in (fallback as object)
            ) {
              fallback = (fallback as Record<string, unknown>)[p];
            } else {
              return key; // Clé non trouvée
            }
          }
          return typeof fallback === "string" ? fallback : key;
        }
      }

      if (typeof value !== "string") return key;

      // Remplacement des variables: {varName}
      if (vars) {
        return value.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
      }

      return value;
    },
    [locale],
  );

  return (
    <I18nContext.Provider
      value={{
        locale,
        setLocale,
        t,
        language: LANGUAGES[locale],
        languages: Object.values(LANGUAGES),
        isChanging,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useTranslation doit être utilisé dans <I18nProvider>");
  }
  return ctx;
}

// ─── Hook simplifié ───────────────────────────────────────────────────────────
export function useLocale() {
  const { locale, setLocale, language, languages } = useTranslation();
  return { locale, setLocale, language, languages };
}
