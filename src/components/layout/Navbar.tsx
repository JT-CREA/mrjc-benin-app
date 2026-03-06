"use client";

/**
 * Navbar.tsx — MRJC-BÉNIN
 *
 * CORRECTIONS :
 *  ✅ Mega-menus : positionnement left-0 (ancré à gauche du bouton)
 *     → plus de fenêtre restreinte/déformée → pleine largeur 780px visible
 *  ✅ Menu "Contact" supprimé (doublon avec bouton CTA "Nous contacter")
 *  ✅ Couleurs logo MRJC (vert forêt, bleu ciel, marine, jaune Bénin)
 *  ✅ Police Montserrat via variables CSS next/font
 *  ✅ Topbar coordonnées + sélecteur de langue
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  Search,
  Bell,
  Phone,
  ArrowRight,
  Leaf,
  ExternalLink,
  Mail,
} from "lucide-react";
import { navigationConfig, type NavItem } from "@/config/navigation.config";
import { siteConfig } from "@/config/site.config";
import { cn } from "@/lib/utils/cn";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";

/* ─── Variants animations ────────────────────────────────────────────────────*/
const megaMenuVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: [0, 0, 0.2, 1] },
  },
  exit: { opacity: 0, y: -6, scale: 0.97, transition: { duration: 0.15 } },
};

const mobileMenuVariants = {
  hidden: { opacity: 0, x: "100%" },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 280, damping: 28 },
  },
  exit: { opacity: 0, x: "100%", transition: { duration: 0.22 } },
};

const mobileItemVariants = {
  hidden: { opacity: 0, x: 16 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: 0.28, ease: "easeOut" },
  }),
};

/* ─── MegaMenuPanel ──────────────────────────────────────────────────────────
 * CORRECTION POSITIONNEMENT :
 *  • alignRight=true  → 'right-0'  : ancré au bord droit du bouton
 *  • alignRight=false → 'left-0'   : ancré au bord gauche du bouton
 *  On abandonne le centrage 'left-1/2 -translate-x-1/2' qui causait
 *  le débordement et la déformation des menus.
 *────────────────────────────────────────────────────────────────────────────*/
function MegaMenuPanel({
  item,
  onClose,
}: {
  item: NavItem;
  onClose: () => void;
}) {
  if (!item.children) return null;

  const posClass = item.alignRight ? "right-0" : "left-0";

  return (
    <motion.div
      variants={megaMenuVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={cn(
        "absolute top-[calc(100%+6px)] w-[820px] max-w-[calc(100vw-2rem)]",
        "bg-white rounded-2xl z-50",
        posClass,
      )}
      style={{
        boxShadow:
          "0 24px 64px -12px rgba(0,0,0,0.20), 0 0 0 1px rgba(0,0,0,0.04)",
      }}
    >
      <div className="grid grid-cols-3 divide-x divide-neutral-100 rounded-2xl overflow-hidden">
        {/* ── Colonne sous-liens (2/3) ── */}
        <div className="col-span-2 p-6">
          <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-4 flex items-center gap-2">
            <span className="w-4 h-0.5 bg-primary-400 rounded-full inline-block" />
            {item.label}
          </p>
          <div className="grid grid-cols-2 gap-1">
            {item.children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                onClick={onClose}
                className="group flex items-start gap-3 p-3 rounded-xl
                           hover:bg-primary-50 transition-all duration-150"
              >
                {child.icon && (
                  <span
                    className="flex-shrink-0 w-9 h-9 bg-primary-100 rounded-xl
                                   flex items-center justify-center text-[18px]
                                   group-hover:bg-primary-200 transition-colors mt-0.5"
                  >
                    {child.icon}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="text-sm font-semibold text-neutral-800
                                     group-hover:text-primary-700 transition-colors"
                    >
                      {child.label}
                    </span>
                    {child.badge && (
                      <span
                        className="inline-flex items-center px-1.5 py-0.5 rounded-full
                                       text-[10px] font-bold bg-secondary-100 text-secondary-800"
                      >
                        {child.badge}
                      </span>
                    )}
                  </div>
                  {child.description && (
                    <p
                      className="text-xs text-neutral-500 mt-0.5 leading-relaxed
                                  group-hover:text-neutral-600 line-clamp-2"
                    >
                      {child.description}
                    </p>
                  )}
                </div>
                <ArrowRight
                  className="w-3.5 h-3.5 text-neutral-300 group-hover:text-primary-500
                                        flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100
                                        transition-all -translate-x-1 group-hover:translate-x-0"
                />
              </Link>
            ))}
          </div>
        </div>

        {/* ── Colonne featured (1/3) ── */}
        {item.featured && (
          <div
            className="p-6 flex flex-col justify-between min-h-[240px]"
            style={{
              background: "linear-gradient(135deg, #1B6B3A 0%, #003087 100%)",
            }}
          >
            <div>
              <div
                className="w-10 h-10 bg-white/20 rounded-xl flex items-center
                              justify-center mb-4"
              >
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-sans font-bold text-white text-base mb-2 leading-snug">
                {item.featured.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "rgba(255,255,255,0.75)" }}
              >
                {item.featured.description}
              </p>
            </div>
            <Link
              href={item.featured.href}
              onClick={onClose}
              className="inline-flex items-center gap-2 text-sm font-bold mt-5 group
                         transition-colors"
              style={{ color: "#FFC600" }}
            >
              En savoir plus
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>

      {/* ── Barre bas ── */}
      <div
        className="px-6 py-3 bg-neutral-50 border-t border-neutral-100
                      flex items-center justify-between rounded-b-2xl"
      >
        <span className="text-xs text-neutral-500 font-medium">
          Explorer toute la section
        </span>
        <Link
          href={item.href}
          onClick={onClose}
          className="inline-flex items-center gap-1.5 text-xs font-bold
                     text-primary-600 hover:text-primary-700 transition-colors"
        >
          Voir tout <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </motion.div>
  );
}

/* ─── NavDesktopItem ─────────────────────────────────────────────────────────*/
function NavDesktopItem({
  item,
  isActive,
  isOpen,
  onToggle,
  onClose,
}: {
  item: NavItem;
  isActive: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const hasChildren = Boolean(item.children?.length);

  if (!hasChildren) {
    return (
      <Link
        href={item.href}
        className={cn(
          "relative inline-flex items-center px-3 py-2 text-sm font-semibold",
          "rounded-lg transition-all duration-150",
          "hover:bg-primary-50 hover:text-primary-700",
          isActive ? "text-primary-600 bg-primary-50" : "text-neutral-700",
        )}
      >
        {item.label}
        {isActive && (
          <motion.span
            layoutId="nav-active-indicator"
            className="absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full bg-secondary-500"
          />
        )}
      </Link>
    );
  }

  return (
    /* relative INDISPENSABLE — le mega-menu s'ancre ici */
    <div className="relative">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={cn(
          "inline-flex items-center gap-1 px-3 py-2 text-sm font-semibold",
          "rounded-lg transition-all duration-150 select-none",
          "hover:bg-primary-50 hover:text-primary-700",
          isOpen || isActive
            ? "text-primary-600 bg-primary-50"
            : "text-neutral-700",
        )}
      >
        {item.label}
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && <MegaMenuPanel item={item} onClose={onClose} />}
      </AnimatePresence>
    </div>
  );
}

/* ─── MobileNavItem ──────────────────────────────────────────────────────────*/
function MobileNavItem({
  item,
  index,
  onClose,
}: {
  item: NavItem;
  index: number;
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = Boolean(item.children?.length);
  const pathname = usePathname();
  const isActive =
    pathname === item.href ||
    (item.href !== "/" && pathname.startsWith(item.href + "/"));

  return (
    <motion.div
      variants={mobileItemVariants}
      custom={index}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center justify-between">
        <Link
          href={item.href}
          onClick={hasChildren ? undefined : onClose}
          className={cn(
            "flex-1 flex items-center py-3.5 text-base font-semibold transition-colors",
            isActive
              ? "text-primary-600"
              : "text-neutral-800 hover:text-primary-600",
          )}
        >
          {item.label}
        </Link>
        {hasChildren && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 text-neutral-500 hover:text-primary-600 rounded-lg
                       hover:bg-primary-50 transition-all"
          >
            <motion.span
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.span>
          </button>
        )}
      </div>

      <AnimatePresence>
        {expanded && item.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden pl-4 border-l-2 border-primary-200 ml-2 mb-3"
          >
            {item.children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                onClick={onClose}
                className="flex items-center gap-3 py-2.5 text-sm text-neutral-600
                           hover:text-primary-600 transition-colors"
              >
                {child.icon && (
                  <span
                    className="w-7 h-7 bg-primary-50 rounded-lg flex items-center
                                   justify-center text-sm flex-shrink-0 border border-primary-100"
                  >
                    {child.icon}
                  </span>
                )}
                <span className="font-medium">{child.label}</span>
                {child.badge && (
                  <span
                    className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full
                                   bg-secondary-100 text-secondary-800"
                  >
                    {child.badge}
                  </span>
                )}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="border-b border-neutral-100" />
    </motion.div>
  );
}

/* ─── Navbar Principal ───────────────────────────────────────────────────────*/
export default function Navbar() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node))
        setOpenMenu(null);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 80);
  }, [searchOpen]);

  const handleMenuToggle = useCallback((label: string) => {
    setOpenMenu((prev) => (prev === label ? null : label));
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim())
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
  };

  return (
    <>
      {/* ═══ TOPBAR ═══════════════════════════════════════════════════════════ */}
      <div className="bg-primary-900 text-white py-2 hidden lg:block no-print">
        <div className="container-mrjc flex items-center justify-between text-xs">
          <div className="flex items-center gap-5">
            <a
              href={`tel:${siteConfig.contact.phone}`}
              className="flex items-center gap-1.5 text-primary-200 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3" />
              {siteConfig.contact.phone}
            </a>
            <span className="text-primary-700">|</span>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="text-primary-200 hover:text-white transition-colors"
            >
              {siteConfig.contact.email}
            </a>
          </div>
          <LanguageSwitcher variant="compact" align="right" />
        </div>
      </div>

      {/* ═══ NAVBAR PRINCIPALE ════════════════════════════════════════════════ */}
      <motion.nav
        ref={navRef}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-300 no-print",
          /* overflow-visible indispensable : les mega-menus ne doivent pas être coupés */
          "overflow-visible",
          /* Glassmorphism opaque ≥ 80% en toutes circonstances :
             - Au repos  : bg-white/92 + légère bordure basse
             - Au défilé : bg-white/96 + ombre marquée + backdrop-blur renforcé
             Le backdrop-blur assure la lisibilité sur toute image ou fond coloré sous-jacent */
          scrolled
            ? [
                "bg-white/96",
                "backdrop-blur-md",
                "shadow-[0_4px_24px_rgba(0,0,0,0.12),0_1px_0_rgba(0,0,0,0.05)]",
                "border-b border-neutral-200/80",
              ].join(" ")
            : [
                "bg-white/92",
                "backdrop-blur-sm",
                "border-b border-neutral-100",
              ].join(" "),
        )}
        aria-label="Navigation principale"
      >
        <div className="container-mrjc overflow-visible">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* ── Logo ── */}
            <Link
              href="/"
              className="flex items-center gap-3 flex-shrink-0 group"
            >
              <div className="relative w-10 h-10 lg:w-12 lg:h-12 flex-shrink-0">
                <Image
                  src="/assets/images/logo.svg"
                  alt="Logo MRJC-BÉNIN"
                  fill
                  unoptimized
                  className="object-contain"
                  sizes="48px"
                  priority
                  onError={() => {}}
                />
              </div>
              <div className="hidden sm:block">
                <div
                  className="font-sans font-bold text-lg lg:text-xl text-primary-800
                                leading-none group-hover:text-primary-600 transition-colors"
                >
                  MRJC-BÉNIN
                </div>
                <div
                  className="text-[10px] text-neutral-500 font-medium leading-none mt-0.5
                                hidden lg:block tracking-wide"
                >
                  Dignité Humaine - Equité & Genre
                </div>
              </div>
            </Link>

            {/* ── Liens Desktop ── */}
            <div
              className="hidden lg:flex items-center gap-0.5 relative overflow-visible"
              role="menubar"
            >
              {navigationConfig.map((item) => (
                <NavDesktopItem
                  key={item.href}
                  item={item}
                  isActive={
                    pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(item.href + "/"))
                  }
                  isOpen={openMenu === item.label}
                  onToggle={() => handleMenuToggle(item.label)}
                  onClose={() => setOpenMenu(null)}
                />
              ))}
            </div>

            {/* ── Actions droite ── */}
            <div className="flex items-center gap-2">
              {/* Recherche Desktop */}
              <div className="hidden md:flex items-center">
                <AnimatePresence mode="wait">
                  {searchOpen ? (
                    <motion.form
                      key="search-open"
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 240, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.28 }}
                      onSubmit={handleSearchSubmit}
                      className="flex items-center bg-neutral-100 rounded-xl overflow-hidden
                                 border border-neutral-200"
                    >
                      <input
                        ref={searchRef}
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Rechercher..."
                        className="flex-1 px-4 py-2 text-sm bg-transparent text-neutral-900
                                   placeholder:text-neutral-400 focus:outline-none min-w-0 font-sans"
                        aria-label="Recherche"
                      />
                      <button
                        type="submit"
                        className="px-3 py-2 text-neutral-500 hover:text-primary-600 transition-colors"
                      >
                        <Search className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="px-2 py-2 text-neutral-400 hover:text-neutral-600 transition-colors"
                        aria-label="Fermer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.form>
                  ) : (
                    <motion.button
                      key="search-icon"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => setSearchOpen(true)}
                      className="w-9 h-9 flex items-center justify-center rounded-xl
                                 text-neutral-600 hover:bg-primary-50 hover:text-primary-600
                                 transition-all duration-150"
                      aria-label="Ouvrir la recherche"
                    >
                      <Search className="w-4 h-4" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {/* Cloche */}
              <Link
                href="/news"
                className="hidden lg:flex w-9 h-9 items-center justify-center rounded-xl
                           text-neutral-600 hover:bg-primary-50 hover:text-primary-600
                           transition-all duration-150 relative"
                aria-label="Actualités"
              >
                <Bell className="w-4 h-4" />
                <span
                  className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full
                                 bg-[#E82129] ring-2 ring-white"
                />
              </Link>

              {/* ── CTA "Nous contacter" — seul bouton contact ── */}
              <Link
                href="/contact"
                className="hidden lg:inline-flex items-center gap-2 text-white
                           px-5 py-2.5 rounded-xl text-sm font-bold
                           hover:-translate-y-0.5 hover:shadow-lg
                           transition-all duration-150 active:translate-y-0"
                style={{
                  background:
                    "linear-gradient(135deg, #1B6B3A 0%, #175f33 100%)",
                  boxShadow: "0 4px 14px rgba(27,107,58,0.30)",
                }}
              >
                <Mail className="w-4 h-4" />
                Nous contacter
              </Link>

              {/* Burger Mobile */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-10 h-10 flex items-center justify-center
                           rounded-xl text-neutral-700 hover:bg-neutral-100 transition-all z-50"
                aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
                aria-expanded={mobileOpen}
              >
                <AnimatePresence mode="wait">
                  {mobileOpen ? (
                    <motion.span
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.14 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.14 }}
                    >
                      <Menu className="w-5 h-5" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ═══ MENU MOBILE ══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 right-0 h-full w-80 max-w-full bg-white z-50
                         lg:hidden shadow-2xl flex flex-col overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Menu mobile"
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-6 py-4 border-b border-primary-700"
                style={{
                  background:
                    "linear-gradient(135deg, #0a3019 0%, #1B6B3A 100%)",
                }}
              >
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3"
                >
                  <div className="relative w-9 h-9 flex-shrink-0">
                    <Image
                      src="/assets/images/logo.svg"
                      alt="Logo"
                      fill
                      unoptimized
                      className="object-contain"
                      sizes="36px"
                      onError={() => {}}
                    />
                  </div>
                  <span className="font-sans font-black text-white tracking-tight">
                    MRJC-BÉNIN
                  </span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg
                             text-primary-200 hover:text-white hover:bg-primary-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Recherche mobile */}
              <div className="px-5 py-4 border-b border-neutral-100 bg-neutral-50">
                <form onSubmit={handleSearchSubmit}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Rechercher..."
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200
                                 rounded-xl text-sm focus:outline-none focus:ring-2
                                 focus:ring-primary-400 focus:border-primary-400 font-sans"
                    />
                  </div>
                </form>
              </div>

              {/* Nav links */}
              <div className="flex-1 overflow-y-auto px-5 py-4">
                {navigationConfig.map((item, index) => (
                  <MobileNavItem
                    key={item.href}
                    item={item}
                    index={index}
                    onClose={() => setMobileOpen(false)}
                  />
                ))}
              </div>

              {/* Footer drawer */}
              <div className="px-5 py-5 border-t border-neutral-100 bg-neutral-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                    Langue
                  </span>
                  <LanguageSwitcher variant="pill" />
                </div>
                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="w-full flex items-center justify-center gap-2 text-white
                             py-3.5 rounded-xl font-bold text-sm transition-colors"
                  style={{
                    background: "linear-gradient(135deg, #1B6B3A, #003087)",
                  }}
                >
                  <Mail className="w-4 h-4" />
                  Nous contacter
                </Link>
                <p className="text-center text-xs text-neutral-400 font-medium">
                  {siteConfig.contact.phone}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
