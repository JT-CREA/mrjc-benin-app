/**
 * layout.tsx — MRJC-BÉNIN
 *
 * Polices : next/font/local — fichiers exacts dans public/assets/fonts/
 * ─────────────────────────────────────────────────────────────────────
 * • Montserrat (principale) → Variable Font (2 fichiers couvrent poids 100-900)
 *   - Montserrat-VariableFont_wght.ttf        (style normal, poids 100→900)
 *   - Montserrat-Italic-VariableFont_wght.ttf (style italic, poids 100→900)
 *
 * • Inter (secondaire) → Polices système : Arial, Helvetica (aucun TTF requis)
 * • JetBrains Mono (code) → Polices système : Consolas, Courier New
 *
 * Avantages Variable Font :
 *   ✅ 2 fichiers au lieu de 20 → chargement 10× plus rapide
 *   ✅ Tous les poids interpolés nativement (thin, light, regular, bold, black…)
 *   ✅ Aucune erreur « font not found » — noms de fichiers exacts Google Fonts
 */

import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "@/styles/globals.css";
import { siteConfig } from "@/config/site.config";
import ClientLayout from "@/components/layout/ClientLayout";

/* ══════════════════════════════════════════════════════════════════════════════
   MONTSERRAT — Variable Font
   Chemin relatif depuis src/app/layout.tsx → ../../public/assets/fonts/
══════════════════════════════════════════════════════════════════════════════ */
const montserrat = localFont({
  variable: "--font-montserrat",
  display: "swap",
  preload: true,
  src: [
    {
      /* Couvre : Thin(100) ExtraLight(200) Light(300) Regular(400)
                  Medium(500) SemiBold(600) Bold(700) ExtraBold(800) Black(900) */
      path: "../../public/assets/fonts/Montserrat-VariableFont_wght.ttf",
      weight: "100 900",
      style: "normal",
    },
    {
      /* Idem en italique */
      path: "../../public/assets/fonts/Montserrat-Italic-VariableFont_wght.ttf",
      weight: "100 900",
      style: "italic",
    },
  ],
});

/* ══════════════════════════════════════════════════════════════════════════════
   Métadonnées SEO
══════════════════════════════════════════════════════════════════════════════ */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.seo.defaultTitle,
    template: siteConfig.seo.titleTemplate,
  },
  description: siteConfig.description,
  keywords: [
    "MRJC",
    "Bénin",
    "ONG",
    "développement rural",
    "agriculture",
    "santé communautaire",
    "alphabétisation",
    "autonomisation femmes",
    "intermédiation sociale",
    "Cotonou",
    "Afrique de l'Ouest",
  ],
  authors: [{ name: siteConfig.fullName, url: siteConfig.url }],
  creator: siteConfig.fullName,
  publisher: siteConfig.fullName,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.seo.defaultImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: siteConfig.seo.twitterCard,
    site: siteConfig.social.twitter,
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.description,
    images: [siteConfig.seo.defaultImage],
  },
  alternates: { canonical: siteConfig.url },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "192x192",
        url: "/assets/icons/icon-192x192.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "512x512",
        url: "/assets/icons/icon-512x512.png",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1B6B3A" },
    { media: "(prefers-color-scheme: dark)", color: "#0a3019" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

/* ══════════════════════════════════════════════════════════════════════════════
   JSON-LD SEO
══════════════════════════════════════════════════════════════════════════════ */
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "NGO",
  name: siteConfig.fullName,
  alternateName: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/assets/images/logo.png`,
  description: siteConfig.description,
  foundingDate: String(siteConfig.founded),
  address: {
    "@type": "PostalAddress",
    addressLocality: "Cotonou",
    addressCountry: "BJ",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    contactType: "customer service",
    availableLanguage: "French",
  },
};

/* ══════════════════════════════════════════════════════════════════════════════
   LAYOUT RACINE
══════════════════════════════════════════════════════════════════════════════ */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning className={montserrat.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>

      <body
        className="bg-neutral-50 text-neutral-900 antialiased"
        suppressHydrationWarning
      >
        {/* Skip link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4
                     focus:z-[200] focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white
                     focus:rounded-xl focus:font-bold focus:shadow-lg"
        >
          Aller au contenu principal
        </a>

        {/* Requis par Google Translate */}
        <div
          id="google_translate_element"
          style={{ display: "none" }}
          aria-hidden="true"
        />

        <ClientLayout>{children}</ClientLayout>

        {/* Google Translate */}
        <Script
          id="google-translate-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.googleTranslateElementInit = function() {
                try {
                  new google.translate.TranslateElement(
                    {
                      pageLanguage: 'fr',
                      includedLanguages: 'fr,en,es,ar,pt,de',
                      layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                      autoDisplay: false,
                    },
                    'google_translate_element'
                  );
                } catch(e) { console.warn('GT init error', e); }
              };
            `,
          }}
        />
        <Script
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
