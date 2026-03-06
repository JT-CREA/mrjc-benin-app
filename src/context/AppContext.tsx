"use client";

/**
 * context/AppContext.tsx
 * Contexte global MRJC-BÉNIN :
 * - Gestion du menu mobile (open/close)
 * - État de la recherche globale
 * - Bannière cookies (accepté/refusé)
 * - Langue active (i18n)
 * - Mode hors-ligne (PWA)
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";

/* ─── Types ──────────────────────────────────────────────────────────────── */
type Locale = "fr" | "en" | "es";
type CookieConsent = "accepted" | "refused" | "pending";

interface AppState {
  /* Navigation */
  isMobileMenuOpen: boolean;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;

  /* Recherche globale */
  isSearchOpen: boolean;
  searchQuery: string;
  openSearch: () => void;
  closeSearch: () => void;
  setSearchQuery: (q: string) => void;

  /* Cookies RGPD */
  cookieConsent: CookieConsent;
  acceptCookies: () => void;
  refuseCookies: () => void;

  /* Langue */
  locale: Locale;
  setLocale: (l: Locale) => void;

  /* PWA / Réseau */
  isOffline: boolean;
  isInstallable: boolean;
  installPWA: () => Promise<void>;
}

/* ─── Contexte ───────────────────────────────────────────────────────────── */
const AppContext = createContext<AppState | undefined>(undefined);

/* ─── Hook public ────────────────────────────────────────────────────────── */
export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp doit être utilisé dans un <AppProvider>");
  return ctx;
}

/* ─── Provider ───────────────────────────────────────────────────────────── */
interface AppProviderProps {
  children: ReactNode;
  initialLocale?: Locale;
}

export function AppProvider({
  children,
  initialLocale = "fr",
}: AppProviderProps) {
  /* Navigation mobile */
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* Recherche */
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  /* Cookies */
  const [cookieConsent, setCookieConsent] = useState<CookieConsent>("pending");

  /* Langue */
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  /* PWA */
  const [isOffline, setIsOffline] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const deferredPrompt = useRef<any>(null);

  /* ── Hydratation initiale ── */
  useEffect(() => {
    // Lire le consentement depuis localStorage
    const saved = localStorage.getItem(
      "mrjc_cookie_consent",
    ) as CookieConsent | null;
    if (saved === "accepted" || saved === "refused") {
      setCookieConsent(saved);
    }

    // Langue sauvegardée
    const savedLocale = localStorage.getItem("mrjc_locale") as Locale | null;
    if (savedLocale && ["fr", "en", "es"].includes(savedLocale)) {
      setLocaleState(savedLocale);
    }
  }, []);

  /* ── Détection réseau (PWA) ── */
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    setIsOffline(!navigator.onLine);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  /* ── Détection installation PWA ── */
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e;
      setIsInstallable(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  /* ── Fermeture menu sur Escape ── */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  /* ── Verrou scroll body quand menu/search ouverts ── */
  useEffect(() => {
    if (isMobileMenuOpen || isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen, isSearchOpen]);

  /* ── Actions ── */
  const openMobileMenu = useCallback(() => setMobileMenuOpen(true), []);
  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);
  const toggleMobileMenu = useCallback(() => setMobileMenuOpen((p) => !p), []);

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setSearchQuery("");
  }, []);

  const acceptCookies = useCallback(() => {
    setCookieConsent("accepted");
    localStorage.setItem("mrjc_cookie_consent", "accepted");
  }, []);

  const refuseCookies = useCallback(() => {
    setCookieConsent("refused");
    localStorage.setItem("mrjc_cookie_consent", "refused");
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("mrjc_locale", l);
    document.documentElement.lang = l;
  }, []);

  const installPWA = useCallback(async () => {
    if (!deferredPrompt.current) return;
    await deferredPrompt.current.prompt();
    const result = await deferredPrompt.current.userChoice;
    if (result.outcome === "accepted") setIsInstallable(false);
    deferredPrompt.current = null;
  }, []);

  /* ── Valeur du contexte ── */
  const value: AppState = {
    isMobileMenuOpen,
    openMobileMenu,
    closeMobileMenu,
    toggleMobileMenu,
    isSearchOpen,
    searchQuery,
    openSearch,
    closeSearch,
    setSearchQuery,
    cookieConsent,
    acceptCookies,
    refuseCookies,
    locale,
    setLocale,
    isOffline,
    isInstallable,
    installPWA,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export default AppContext;
