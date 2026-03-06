"use client";

/**
 * ClientLayout.tsx — MRJC-BÉNIN
 * ─────────────────────────────────────────────────────────────────────────────
 * RÔLE : Client Component shell qui contient tous les composants nécessitant
 *        ssr:false (framer-motion, localStorage, window, etc.)
 *
 * ARCHITECTURE Next.js 15 App Router :
 *   layout.tsx (Server Component)
 *     └── ClientLayout.tsx (Client Component) ← CE FICHIER
 *           ├── I18nProvider    (dynamic ssr:false)
 *           ├── NewsTicker      (dynamic ssr:false — framer-motion)
 *           ├── Navbar          (dynamic ssr:false — framer-motion)
 *           ├── {children}      (contenu des pages)
 *           ├── Footer          (dynamic ssr:false — framer-motion)
 *           ├── Toaster         (dynamic ssr:false — sonner)
 *           ├── WhatsAppButton  (dynamic ssr:false)
 *           ├── PWAUpdateBanner (dynamic ssr:false)
 *           └── CookieBanner    (dynamic ssr:false — framer-motion)
 *
 * RÈGLE NEXT.JS 15 : dynamic({ ssr: false }) est UNIQUEMENT autorisé
 * dans les Client Components ('use client'). Interdit dans les Server
 * Components — d'où cette séparation obligatoire.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

/* ─── Fallbacks statiques (évitent le layout shift) ──────────────────────── */

function TickerFallback() {
  return (
    <div
      className="bg-primary-900 border-b border-primary-800 h-10 flex items-center px-6"
      aria-hidden="true"
    >
      <span className="text-secondary-400 text-xs font-bold uppercase tracking-wider">
        ● En direct
      </span>
      <span className="text-primary-300 text-xs ml-4">MRJC-BÉNIN</span>
    </div>
  );
}

function NavbarFallback() {
  return (
    <header
      className="sticky top-10 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200
                 shadow-sm h-[72px] flex items-center px-6"
      aria-hidden="true"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary-100 animate-pulse" />
        <div className="w-36 h-5 rounded-lg bg-neutral-200 animate-pulse" />
      </div>
      <div className="ml-auto flex items-center gap-3">
        <div className="w-20 h-5 rounded bg-neutral-200 animate-pulse" />
        <div className="w-20 h-5 rounded bg-neutral-200 animate-pulse" />
        <div className="w-28 h-9 rounded-xl bg-primary-100 animate-pulse" />
      </div>
    </header>
  );
}

function FooterFallback() {
  return (
    <footer
      className="bg-primary-950 min-h-[280px] flex items-center justify-center"
      aria-label="Pied de page"
    >
      <div className="text-primary-700 text-sm animate-pulse">Chargement…</div>
    </footer>
  );
}

/* ─── Imports dynamiques — ssr:false autorisé ici (Client Component) ──────── */

const I18nProvider = dynamic(
  () =>
    import("@/lib/i18n/I18nProvider").then((m) => ({
      default: m.I18nProvider,
    })),
  { ssr: false, loading: () => null },
);

const NewsTicker = dynamic(() => import("@/components/layout/NewsTicker"), {
  ssr: false,
  loading: () => <TickerFallback />,
});

const Navbar = dynamic(() => import("@/components/layout/Navbar"), {
  ssr: false,
  loading: () => <NavbarFallback />,
});

const Footer = dynamic(() => import("@/components/layout/Footer"), {
  ssr: false,
  loading: () => <FooterFallback />,
});

const CookieBanner = dynamic(() => import("@/components/layout/CookieBanner"), {
  ssr: false,
});

const WhatsAppButton = dynamic(() => import("@/components/ui/WhatsAppButton"), {
  ssr: false,
});

const PWAUpdateBanner = dynamic(
  () => import("@/components/ui/PWAUpdateBanner"),
  { ssr: false },
);

const Toaster = dynamic(
  () => import("sonner").then((m) => ({ default: m.Toaster })),
  { ssr: false },
);

/* ─── Composant principal ────────────────────────────────────────────────── */

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <I18nProvider>
      <div className="page-wrapper flex flex-col min-h-screen">
        {/* Bandeau infos défilantes */}
        <NewsTicker />

        {/* Navigation principale */}
        <Navbar />

        {/* Contenu des pages (Server Components enfants) */}
        <main id="main-content" className="main-content flex-1" role="main">
          {children}
        </main>

        {/* Pied de page */}
        <Footer />
      </div>

      {/* Éléments flottants */}
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          style: { fontFamily: "Inter, sans-serif", fontSize: "14px" },
        }}
      />
      <WhatsAppButton />
      <PWAUpdateBanner />
      <CookieBanner />
    </I18nProvider>
  );
}
