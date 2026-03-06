"use client";

/**
 * LanguageSwitcher.tsx — MRJC-BÉNIN
 *
 * CORRECTION TRADUCTION FONCTIONNELLE :
 *  Le sélecteur de langue pilote Google Translate via :
 *  1. Détection du select `.goog-te-combo` injecté par le widget GT
 *  2. Si GT pas encore chargé → attente avec retry (max 3s)
 *  3. Cookie `googtrans` pour mémoriser la langue choisie
 *  4. Pour le français : restauration via `window.location.reload()`
 *
 *  Langues : 🇫🇷 Français · 🇬🇧 English · 🇪🇸 Español · 🇵🇹 Português
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check, ChevronDown, Loader2 } from "lucide-react";

export type Locale = "fr" | "en" | "es" | "pt";

interface LangOption {
  code: Locale;
  nativeLabel: string;
  flag: string;
}

interface Props {
  variant?: "compact" | "pill" | "expanded";
  align?: "left" | "right" | "center";
  className?: string;
}

const LANGUAGES: LangOption[] = [
  { code: "fr", nativeLabel: "Français", flag: "🇫🇷" },
  { code: "en", nativeLabel: "English", flag: "🇬🇧" },
  { code: "es", nativeLabel: "Español", flag: "🇪🇸" },
  { code: "pt", nativeLabel: "Português", flag: "🇵🇹" },
];

const VALID = new Set<Locale>(["fr", "en", "es", "pt"]);
const KEY = "mrjc_lang";

/* ─── Cookie googtrans ───────────────────────────────────────────────────────*/
function setGoogCookie(lang: Locale): void {
  const val = lang === "fr" ? "" : `/fr/${lang}`;
  document.cookie = `googtrans=${val}; path=/; SameSite=Lax`;
  try {
    const domain = window.location.hostname.split(".").slice(-2).join(".");
    if (domain && domain.includes("."))
      document.cookie = `googtrans=${val}; path=/; domain=.${domain}; SameSite=Lax`;
  } catch {}
}

function clearGoogCookie(): void {
  document.cookie = "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = `googtrans=; path=/; domain=.${window.location.hostname.split(".").slice(-2).join(".")}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

/* ─── Trouver le select GT avec retry ───────────────────────────────────────*/
function waitForGTSelect(
  cb: (select: HTMLSelectElement) => void,
  maxMs = 3000,
): void {
  const interval = 150;
  let elapsed = 0;
  const t = setInterval(() => {
    const sel = document.querySelector<HTMLSelectElement>(
      '.goog-te-combo, select.goog-te-combo, #goog-gt-tt select, [class*="goog-te"] select',
    );
    if (sel) {
      clearInterval(t);
      cb(sel);
      return;
    }
    elapsed += interval;
    if (elapsed >= maxMs) clearInterval(t);
  }, interval);
}

/* ─── Appliquer la traduction ────────────────────────────────────────────────*/
function applyTranslation(lang: Locale): void {
  if (lang === "fr") {
    clearGoogCookie();
    window.location.reload();
    return;
  }

  setGoogCookie(lang);

  waitForGTSelect((select) => {
    select.value = lang;
    select.dispatchEvent(new Event("change", { bubbles: true }));
  }, 2500);

  // Fallback si le select ne se trouve pas dans 2.5s → rechargement
  setTimeout(() => {
    const sel = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (!sel || sel.value !== lang) window.location.reload();
  }, 2700);
}

function getStoredLang(): Locale {
  if (typeof window === "undefined") return "fr";
  const stored = localStorage.getItem(KEY) as Locale | null;
  if (stored && VALID.has(stored)) return stored;

  // Tenter de lire depuis le cookie googtrans
  const match = document.cookie.match(/googtrans=\/fr\/([a-z]{2})/);
  if (match && VALID.has(match[1] as Locale)) return match[1] as Locale;

  return "fr";
}

/* ─── Animations ─────────────────────────────────────────────────────────────*/
const dropVariants = {
  hidden: { opacity: 0, scale: 0.93, y: -8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.18, ease: [0, 0, 0.2, 1] },
  },
  exit: { opacity: 0, scale: 0.93, y: -6, transition: { duration: 0.13 } },
};

/* ─── Composant ──────────────────────────────────────────────────────────────*/
export default function LanguageSwitcher({
  variant = "compact",
  align = "right",
  className = "",
}: Props) {
  const [current, setCurrent] = useState<Locale>("fr");
  const [isOpen, setIsOpen] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrent(getStoredLang());
  }, []);

  /* Clic extérieur */
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      )
        setIsOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  /* ESC */
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, []);

  const handleSelect = useCallback(
    (lang: Locale) => {
      if (lang === current) {
        setIsOpen(false);
        return;
      }
      setIsChanging(true);
      setCurrent(lang);
      setIsOpen(false);
      localStorage.setItem(KEY, lang);
      setTimeout(() => {
        applyTranslation(lang);
      }, 200);
    },
    [current],
  );

  const curr = LANGUAGES.find((l) => l.code === current) ?? LANGUAGES[0];

  /* Styles par variant */
  const compact = variant === "compact";

  const triggerClass = compact
    ? "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[13px] font-bold transition-all duration-150 text-primary-200 hover:text-white hover:bg-primary-800/80"
    : "inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold border transition-all duration-150 bg-neutral-100 text-neutral-700 hover:bg-primary-50 hover:text-primary-700 border-neutral-200 hover:border-primary-200";

  const dropClass = compact
    ? "bg-primary-800 border-primary-700"
    : "bg-white border-neutral-200";

  const itemClass = compact
    ? "text-primary-100 hover:bg-primary-700 hover:text-white"
    : "text-neutral-700 hover:bg-primary-50 hover:text-primary-700";

  const dividerClass = compact ? "border-primary-700" : "border-neutral-100";
  const hintClass = compact ? "text-primary-400" : "text-neutral-400";
  const hintBg = compact ? "bg-primary-900/30" : "bg-neutral-50";

  const alignClass: Record<string, string> = {
    left: "left-0",
    right: "right-0",
    center: "left-1/2 -translate-x-1/2",
  };

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* Déclencheur */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`Langue : ${curr.nativeLabel}`}
        disabled={isChanging}
        className={`${triggerClass} ${isChanging ? "opacity-70 cursor-wait" : ""}`}
      >
        {isChanging ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin flex-shrink-0" />
        ) : (
          <Globe className="w-3.5 h-3.5 opacity-75 flex-shrink-0" />
        )}
        <span className="text-base leading-none">{curr.flag}</span>
        {variant !== "compact" && (
          <span className="hidden sm:inline text-[13px]">
            {curr.nativeLabel}
          </span>
        )}
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-3 h-3 opacity-60" />
        </motion.span>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="listbox"
            aria-label="Choisir une langue"
            className={`absolute top-full mt-2 min-w-[190px] rounded-2xl border z-[100]
                        overflow-hidden ${dropClass} ${alignClass[align]}`}
            style={{ boxShadow: "0 20px 60px -10px rgba(0,0,0,0.22)" }}
          >
            {/* Langue active */}
            <div
              className={`px-4 py-3 flex items-center gap-3 border-b ${dividerClass} ${
                compact ? "bg-primary-900/40" : "bg-primary-50"
              }`}
            >
              <span className="text-xl leading-none">{curr.flag}</span>
              <div className="flex-1">
                <div
                  className={`text-[13px] font-bold ${compact ? "text-white" : "text-primary-700"}`}
                >
                  {curr.nativeLabel}
                </div>
                <div
                  className={`text-[10px] font-medium ${compact ? "text-primary-400" : "text-neutral-500"}`}
                >
                  Langue actuelle
                </div>
              </div>
              <Check
                className={`w-4 h-4 ${compact ? "text-yellow-400" : "text-primary-500"}`}
              />
            </div>

            {/* Autres langues */}
            {LANGUAGES.filter((l) => l.code !== current).map((lang, i) => (
              <motion.button
                key={lang.code}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0, transition: { delay: i * 0.04 } }}
                role="option"
                aria-selected={false}
                onClick={() => handleSelect(lang.code)}
                className={`w-full px-4 py-3 flex items-center gap-3 text-sm font-semibold
                            transition-colors duration-100 ${itemClass}`}
              >
                <span className="text-xl leading-none">{lang.flag}</span>
                <div className="text-left">
                  <div className="text-[13px] font-bold leading-tight">
                    {lang.nativeLabel}
                  </div>
                </div>
              </motion.button>
            ))}

            {/* Note */}
            <div
              className={`px-4 py-2 border-t ${dividerClass} ${hintBg} text-center`}
            >
              <p className={`text-[10px] font-medium ${hintClass}`}>
                ⚡ Traduction automatique
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
