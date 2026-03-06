/**
 * tailwind.config.ts — MRJC-BÉNIN
 * ─────────────────────────────────────────────────────────────────────────────
 * Couleurs extraites du logo officiel MRJC-BÉNIN :
 *   • Bleu ciel   (primary)   : #0081E2 — couleur principale logo (bandeau, ovale)
 *   • Jaune Bénin (accent)    : #E2CC00 — point jaune / drapeau Bénin
 *   • Vert forêt  (secondary) : #038732 — point vert / drapeau Bénin
 *   • Rouge Bénin (logo-red)  : #E20707 — point rouge / drapeau Bénin
 *   • Marine MRJC (navy)      : #1102A5 — texte "MRJC" logo
 *
 * Chaque palette 50–950 est calculée de manière perceptivement correcte ;
 * le shade 500 correspond exactement au hex officiel du logo.
 *
 * Police : Montserrat Variable (self-hosted, TTF via next/font/local)
 */

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      /* ═══════════════════════════════════════════════════════════════════════
         COULEURS — CHARTE OFFICIELLE MRJC-BÉNIN
         Palettes perceptives 50 → 950
         shade 500 = hex exact extrait du logo officiel
         ═══════════════════════════════════════════════════════════════════════ */
      colors: {
        /* ────────────────────────────────────────────────────────────────────
           BLEU CIEL — couleur principale logo (bandeau, fond ovale)
           Base officielle : #0081E2
           ──────────────────────────────────────────────────────────────────── */
        primary: {
          50: "#EBF4FE", // Bleu très pâle – fonds de section, highlight passif
          100: "#D5E8FD", // Bleu pâle – hover léger, badges
          200: "#A8D1FA", // Bleu clair – bordures, icônes secondaires
          300: "#6DB4F7", // Bleu moyen-clair – accents texte
          400: "#3299F0", // Bleu medium – CTA secondaires, liens
          500: "#0081E2", // ← HEX OFFICIEL logo MRJC (bandeau / ovale)
          600: "#0065B4", // Bleu foncé – hover btn primary
          700: "#004D88", // Bleu sombre – texte sombre branded
          800: "#003460", // Très sombre – footer, états actifs
          900: "#001E3A", // Quasi-noir bleuté – contraste max
          950: "#001020", // Noir bleuté – arrière-plans sombres
        },

        /* ────────────────────────────────────────────────────────────────────
           JAUNE BÉNIN — point jaune / drapeau Bénin
           Base officielle : #E2CC00
           ──────────────────────────────────────────────────────────────────── */
        accent: {
          50: "#FEFCE8", // Jaune très pâle – fonds section
          100: "#FDF8D0", // Jaune pâle – badges
          200: "#FAF09F", // Jaune doux – highlights
          300: "#F5E362", // Jaune vif clair – icônes
          400: "#EDD622", // Jaune vif – boutons secondaires
          500: "#E2CC00", // ← HEX OFFICIEL logo (point jaune / drapeau)
          600: "#B09E00", // Doré foncé – hover
          700: "#7F7200", // Brun doré – texte sur fond clair
          800: "#544C00", // Très sombre – contraste texte
          900: "#302B00", // Quasi-noir doré
          950: "#1A1700", // Noir doré – fond sombre
        },

        /* ────────────────────────────────────────────────────────────────────
           VERT FORÊT — point vert / drapeau Bénin
           Base officielle : #038732
           ──────────────────────────────────────────────────────────────────── */
        secondary: {
          50: "#E8F7ED", // Vert très pâle – fonds de page
          100: "#D0EFDA", // Vert pâle – badges succès
          200: "#9EDEB4", // Vert clair – bordures
          300: "#5FC988", // Vert moyen-clair – icônes
          400: "#1DB357", // Vert medium – accents
          500: "#038732", // ← HEX OFFICIEL logo (point vert / drapeau)
          600: "#026727", // Vert foncé – hover
          700: "#01481C", // Vert sombre – texte
          800: "#012D11", // Très sombre
          900: "#011809", // Quasi-noir verdâtre
          950: "#000C04", // Noir verdâtre
        },

        /* ────────────────────────────────────────────────────────────────────
           MARINE MRJC — texte "MRJC BÉNIN" dans le logo
           Base officielle : #1102A5
           ──────────────────────────────────────────────────────────────────── */
        navy: {
          50: "#ECEAF9", // Lavande très pâle – fonds
          100: "#D8D5F3", // Lavande pâle – badges
          200: "#AFA9E7", // Violet clair – bordures
          300: "#7C74D8", // Violet moyen – icônes
          400: "#4034C5", // Indigo medium – accents
          500: "#1102A5", // ← HEX OFFICIEL texte navy logo
          600: "#0D0282", // Navy foncé – hover
          700: "#09015D", // Navy sombre – texte
          800: "#05013A", // Très sombre
          900: "#030022", // Quasi-noir indigo
          950: "#010012", // Noir indigo
        },

        /* ────────────────────────────────────────────────────────────────────
           ROUGE BÉNIN — point rouge / drapeau Bénin
           Base officielle : #E20707
           ──────────────────────────────────────────────────────────────────── */
        "logo-red": {
          50: "#FDE8E8", // Rouge très pâle – fonds d'erreur
          100: "#FAD0D0", // Rouge pâle – badges erreur
          200: "#F59E9E", // Rouge clair – bordures
          300: "#EF6666", // Rouge moyen-clair – icônes warning
          400: "#E83030", // Rouge vif – accents
          500: "#E20707", // ← HEX OFFICIEL logo (point rouge / drapeau)
          600: "#B30505", // Rouge foncé – hover
          700: "#820404", // Rouge sombre – texte d'erreur
          800: "#560202", // Très sombre
          900: "#320101", // Quasi-noir rouge
          950: "#1C0000", // Noir rouge
        },

        /* ────────────────────────────────────────────────────────────────────
           NEUTRES — base froide avec tint bleu léger
           Cohérente avec le primary bleu ciel
           ──────────────────────────────────────────────────────────────────── */
        neutral: {
          50: "#F8F9FB",
          100: "#F1F3F7",
          200: "#E4E7EF",
          300: "#D0D5E3",
          400: "#9BA5BF",
          500: "#6B7594",
          600: "#4A5370",
          700: "#343A52",
          800: "#202437",
          900: "#141727",
          950: "#0A0C17",
        },

        /* ── Sémantiques (alias vers les palettes MRJC) ── */
        success: { DEFAULT: "#038732", light: "#E8F7ED", dark: "#01481C" },
        warning: { DEFAULT: "#E2CC00", light: "#FEFCE8", dark: "#7F7200" },
        error: { DEFAULT: "#E20707", light: "#FDE8E8", dark: "#820404" },
        info: { DEFAULT: "#0081E2", light: "#EBF4FE", dark: "#004D88" },
      },

      /* ═══════════════════════════════════════════════════════════════════════
         POLICES — Montserrat Variable (self-hosted, TTF via next/font/local)
         ═══════════════════════════════════════════════════════════════════════ */
      fontFamily: {
        sans: [
          "var(--font-montserrat)",
          "Montserrat",
          "Arial",
          "Helvetica",
          "sans-serif",
        ],
        body: [
          "var(--font-montserrat)",
          "Montserrat",
          "Arial",
          "Helvetica",
          "sans-serif",
        ],
        display: [
          "var(--font-montserrat)",
          "Montserrat",
          "Arial",
          "sans-serif",
        ],
        mono: ["Consolas", "Courier New", "monospace"],
      },

      /* ═══════════════════════════════════════════════════════════════════════
         TAILLES DE TEXTE (scale compatible Montserrat)
         ═══════════════════════════════════════════════════════════════════════ */
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "1rem" }],
        xs: ["0.75rem", { lineHeight: "1.25rem" }],
        sm: ["0.875rem", { lineHeight: "1.5rem" }],
        base: ["1rem", { lineHeight: "1.75rem" }],
        lg: ["1.125rem", { lineHeight: "1.875rem" }],
        xl: ["1.25rem", { lineHeight: "2rem" }],
        "2xl": ["1.5rem", { lineHeight: "2.25rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.5rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.75rem" }],
        "5xl": ["3rem", { lineHeight: "1.15" }],
        "6xl": ["3.75rem", { lineHeight: "1.10" }],
        "7xl": ["4.5rem", { lineHeight: "1.05" }],
        "8xl": ["6rem", { lineHeight: "1.00" }],
      },

      /* ═══════════════════════════════════════════════════════════════════════
         ESPACEMENTS ÉTENDUS
         ═══════════════════════════════════════════════════════════════════════ */
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "88": "22rem",
        "128": "32rem",
      },

      height: { "18": "4.5rem", "22": "5.5rem" },

      /* ═══════════════════════════════════════════════════════════════════════
         BORDER RADIUS
         ═══════════════════════════════════════════════════════════════════════ */
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },

      /* ═══════════════════════════════════════════════════════════════════════
         BOX SHADOWS — calibrées sur les couleurs officielles MRJC
         ═══════════════════════════════════════════════════════════════════════ */
      boxShadow: {
        /* Navigation glassmorphism */
        nav: "0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)",
        /* Cartes */
        card: "0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)",
        "card-hover":
          "0 8px 24px rgba(0,0,0,0.10), 0 16px 48px rgba(0,0,0,0.08)",
        /* Ombres brandées — rgba calé sur chaque hex officiel */
        primary: "0 4px 14px rgba(0,129,226,0.35)", // #0081E2 bleu ciel
        accent: "0 4px 14px rgba(226,204,0,0.40)", // #E2CC00 jaune Bénin
        secondary: "0 4px 14px rgba(3,135,50,0.35)", // #038732 vert forêt
        navy: "0 4px 14px rgba(17,2,165,0.30)", // #1102A5 marine MRJC
        "logo-red": "0 4px 14px rgba(226,7,7,0.35)", // #E20707 rouge Bénin
        /* Dropdown / mega-menu */
        dropdown:
          "0 20px 60px -10px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.04)",
        /* Focus ring bleu */
        "focus-ring": "0 0 0 3px rgba(0,129,226,0.25)",
      },

      /* ═══════════════════════════════════════════════════════════════════════
         ANIMATIONS
         ═══════════════════════════════════════════════════════════════════════ */
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-in-right": "slideInRight 0.4s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
        "bounce-gentle": "bounceGentle 2s ease-in-out infinite",
        shimmer: "shimmer 1.5s linear infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          from: { opacity: "0", transform: "translateX(20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        bounceGentle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        shimmer: {
          from: { backgroundPosition: "200% 0" },
          to: { backgroundPosition: "-200% 0" },
        },
      },

      /* ═══════════════════════════════════════════════════════════════════════
         TRANSITIONS & EASINGS
         ═══════════════════════════════════════════════════════════════════════ */
      transitionTimingFunction: {
        spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },

      /* ═══════════════════════════════════════════════════════════════════════
         MAX WIDTH
         ═══════════════════════════════════════════════════════════════════════ */
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
      },

      /* ═══════════════════════════════════════════════════════════════════════
         ASPECT RATIOS
         ═══════════════════════════════════════════════════════════════════════ */
      aspectRatio: {
        "4/3": "4 / 3",
        "3/2": "3 / 2",
        "5/3": "5 / 3",
      },
    },
  },

  /* ── Plugins (chargement conditionnel si installés) ── */
  plugins: [
    ...(() => {
      const plugins: any[] = [];
      try {
        plugins.push(require("@tailwindcss/typography"));
      } catch {}
      try {
        plugins.push(require("@tailwindcss/forms"));
      } catch {}
      try {
        plugins.push(require("@tailwindcss/aspect-ratio"));
      } catch {}
      try {
        plugins.push(require("@tailwindcss/container-queries"));
      } catch {}
      return plugins;
    })(),
  ],
};

export default config;
