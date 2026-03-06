"use client";

/**
 * HeroSection.tsx — MRJC-BÉNIN
 *
 * IMAGES : Gradients CSS uniquement — zéro dépendance réseau.
 * Raison : Unsplash ET Picsum timeout depuis le Bénin en développement.
 * En production, remplacer par des images locales dans public/assets/hero/
 */

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Users,
  Mail,
} from "lucide-react";

/* ─── Slides — backgrounds CSS (pas d'images externes) ────── */
const heroSlides = [
  {
    id: 1,
    bg: "linear-gradient(135deg, #0F3D22 0%, #1B6B3A 40%, #2D8A52 70%, #1B6B3A 100%)",
    bgAccent:
      "radial-gradient(ellipse at 70% 50%, rgba(245,158,11,0.15) 0%, transparent 60%)",
    tag: "Conseil Agricole & Entrepreneuriat",
    emoji: "🌿",
    title: "Un engagement au service des porteurs de changement",
    subtitle:
      "Depuis 1985, MRJC-BÉNIN accompagne les communautés rurales du Bénin vers l'autonomie, la dignité et le développement durable.",
    cta: { label: "Découvrir nos projets", href: "/projects" },
    ctaSecondary: { label: "Notre histoire", href: "/about/history" },
    stat: { value: "85 000+", label: "bénéficiaires" },
  },
  {
    id: 2,
    bg: "linear-gradient(135deg, #1a1a3e 0%, #2d3a6b 40%, #4a5fa8 70%, #2d3a6b 100%)",
    bgAccent:
      "radial-gradient(ellipse at 30% 60%, rgba(251,191,36,0.12) 0%, transparent 60%)",
    tag: "Autonomisation des Femmes",
    emoji: "👩‍🌾",
    title: "Des femmes fortes, des communautés résilientes",
    subtitle:
      "Nous renforçons le leadership féminin et créons les conditions d'une participation équitable des femmes à la vie économique et politique.",
    cta: { label: "Voir le programme", href: "/domains/autonomisation-femmes" },
    ctaSecondary: { label: "Publications", href: "/resources/publications" },
    stat: { value: "3 600+", label: "femmes alphabétisées" },
  },
  {
    id: 3,
    bg: "linear-gradient(135deg, #1a2e1e 0%, #2d5a3d 40%, #1B6B3A 70%, #0d2e1a 100%)",
    bgAccent:
      "radial-gradient(ellipse at 60% 40%, rgba(52,211,153,0.12) 0%, transparent 60%)",
    tag: "Santé Communautaire & Nutrition",
    emoji: "🏥",
    title: "Chaque enfant mérite de grandir en bonne santé",
    subtitle:
      "Nos programmes de nutrition communautaire et de santé préventive transforment la vie de milliers d'enfants et de familles dans les zones rurales.",
    cta: {
      label: "Notre approche santé",
      href: "/domains/sante-communautaire-nutrition",
    },
    ctaSecondary: { label: "Nous rejoindre", href: "/work-with-us" },
    stat: { value: "8 500", label: "enfants pris en charge" },
  },
];

/* ─── Variants ─────────────────────────────────────────────── */
const textV = {
  enter: { opacity: 0, y: 30 },
  center: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.4 } },
};

const bgV = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: { duration: 0.8 } },
  exit: { opacity: 0, transition: { duration: 0.5 } },
};

/* ─── Composant ─────────────────────────────────────────────── */
export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const total = heroSlides.length;

  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);
  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + total) % total),
    [total],
  );

  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [isPlaying, next]);

  const slide = heroSlides[current];

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: "min(100vh, 800px)" }}
      aria-label="Bannière principale"
    >
      {/* ── Fond CSS animé ── */}
      <AnimatePresence mode="sync">
        <motion.div
          key={`bg-${slide.id}`}
          variants={bgV}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
          style={{ background: slide.bg }}
        >
          {/* Overlay lumineux */}
          <div
            className="absolute inset-0"
            style={{ background: slide.bgAccent }}
          />
          {/* Barre accent gauche */}
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-secondary-500" />
          {/* Motif géométrique */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
          >
            <div className="absolute -right-32 -top-32 w-[500px] h-[500px] border border-white/5 rounded-full" />
            <div className="absolute -right-16 -top-16 w-80 h-80 border border-white/5 rounded-full" />
            <div className="absolute right-8 top-8 w-48 h-48 border border-white/5 rounded-full" />
            <div className="absolute bottom-20 left-12 w-64 h-64 border border-white/5 rounded-full" />
            {/* Points décoratifs */}
            <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-secondary-400/30 rounded-full" />
            <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-secondary-400/20 rounded-full" />
            <div className="absolute bottom-1/3 left-1/4 w-3 h-3 bg-white/10 rounded-full" />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Contenu ── */}
      <div
        className="relative z-10 container-mrjc flex items-center"
        style={{ minHeight: "inherit" }}
      >
        <div className="grid lg:grid-cols-12 gap-8 items-center w-full py-24 lg:py-32">
          {/* Texte — 7 colonnes */}
          <div className="lg:col-span-7 xl:col-span-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${slide.id}`}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-6"
              >
                {/* Tag */}
                <motion.div
                  variants={textV}
                  className="flex items-center gap-3"
                >
                  <span className="h-px w-10 bg-secondary-400 flex-shrink-0" />
                  <span className="text-4xl">{slide.emoji}</span>
                  <span className="text-secondary-400 text-sm font-semibold uppercase tracking-widest">
                    {slide.tag}
                  </span>
                </motion.div>

                {/* Titre */}
                <motion.h1
                  variants={{
                    ...textV,
                    center: {
                      ...textV.center,
                      transition: {
                        duration: 0.7,
                        delay: 0.1,
                        ease: [0.25, 0.46, 0.45, 0.94] as const,
                      },
                    },
                  }}
                  className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight"
                >
                  {slide.title}
                </motion.h1>

                {/* Sous-titre */}
                <motion.p
                  variants={{
                    ...textV,
                    center: {
                      ...textV.center,
                      transition: {
                        duration: 0.7,
                        delay: 0.2,
                        ease: [0.25, 0.46, 0.45, 0.94] as const,
                      },
                    },
                  }}
                  className="text-lg text-white/80 max-w-xl leading-relaxed"
                >
                  {slide.subtitle}
                </motion.p>

                {/* Statistique */}
                <motion.div
                  variants={{
                    ...textV,
                    center: {
                      ...textV.center,
                      transition: { duration: 0.7, delay: 0.25 },
                    },
                  }}
                  className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-5 py-3"
                >
                  <Users className="w-5 h-5 text-secondary-400 flex-shrink-0" />
                  <div>
                    <span className="text-white font-display font-bold text-xl">
                      {slide.stat.value}
                    </span>
                    <span className="text-white/70 text-sm ml-2">
                      {slide.stat.label}
                    </span>
                  </div>
                </motion.div>

                {/* CTAs */}
                <motion.div
                  variants={{
                    ...textV,
                    center: {
                      ...textV.center,
                      transition: { duration: 0.7, delay: 0.3 },
                    },
                  }}
                  className="flex flex-wrap items-center gap-4 pt-2"
                >
                  <Link
                    href={slide.cta.href}
                    className="group inline-flex items-center gap-2.5 bg-secondary-500 text-white px-7 py-3.5 rounded-xl font-semibold text-base hover:bg-secondary-400 hover:-translate-y-0.5 transition-all duration-200 shadow-lg"
                  >
                    {slide.cta.label}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href={slide.ctaSecondary.href}
                    className="inline-flex items-center gap-2.5 text-white/90 border border-white/30 px-6 py-3.5 rounded-xl font-semibold text-sm hover:bg-white/10 hover:border-white/60 transition-all duration-200"
                  >
                    {slide.ctaSecondary.label}
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Carte impact — droite */}
          <div className="lg:col-span-5 xl:col-span-4 xl:col-start-8 hidden lg:block">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/90 text-sm font-semibold uppercase tracking-wider">
                  Notre Impact 2023
                </span>
                <Link
                  href="/impact"
                  className="text-secondary-400 text-xs hover:text-secondary-300 transition-colors"
                >
                  Voir tout →
                </Link>
              </div>

              {[
                {
                  label: "Bénéficiaires directs",
                  value: "85 000+",
                  icon: "👥",
                  color: "bg-primary-500",
                },
                {
                  label: "Projets actifs",
                  value: "6",
                  icon: "📋",
                  color: "bg-secondary-500",
                },
                {
                  label: "Départements couverts",
                  value: "8 / 12",
                  icon: "🗺️",
                  color: "bg-amber-600",
                },
                {
                  label: "Partenaires bailleurs",
                  value: "15+",
                  icon: "🤝",
                  color: "bg-primary-400",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                  className="flex items-center gap-4 bg-white/5 rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div
                    className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center text-lg flex-shrink-0`}
                  >
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="font-display font-bold text-xl text-white leading-none">
                      {item.value}
                    </div>
                    <div className="text-xs text-white/60 mt-0.5 truncate">
                      {item.label}
                    </div>
                  </div>
                </motion.div>
              ))}

              <Link
                href="/contact"
                className="w-full flex items-center justify-center gap-2 bg-secondary-500 text-white py-3 rounded-xl font-semibold text-sm hover:bg-secondary-400 transition-colors mt-2"
              >
                <Mail className="w-4 h-4" />
                Nous contacter
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Contrôles slider ── */}
      <div className="absolute bottom-8 left-0 right-0 z-20">
        <div className="container-mrjc flex items-center justify-between">
          <div className="flex items-center gap-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrent(i);
                  setIsPlaying(false);
                }}
                aria-label={`Slide ${i + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  i === current
                    ? "w-8 h-2 bg-secondary-500"
                    : "w-2 h-2 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                prev();
                setIsPlaying(false);
              }}
              aria-label="Précédent"
              className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all backdrop-blur-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                next();
                setIsPlaying(false);
              }}
              aria-label="Suivant"
              className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all backdrop-blur-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-1.5"
        aria-hidden="true"
      >
        <span className="text-white/40 text-[10px] uppercase tracking-widest font-medium">
          Défiler
        </span>
        <ChevronDown className="w-4 h-4 text-white/40" />
      </motion.div>
    </section>
  );
}
