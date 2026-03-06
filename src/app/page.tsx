/**
 * page.tsx — Page d'accueil MRJC-BÉNIN
 *
 * SERVER COMPONENT pur — aucun dynamic({ ssr:false }) ici.
 * Toutes les sections sont déléguées à HomeContent.tsx ('use client').
 *
 * Ce fichier gère uniquement :
 *   • Métadonnées SEO / Open Graph
 *   • JSON-LD WebPage (structuré, server-side)
 *   • Rendu de <HomeContent /> (Client Component)
 */

import type { Metadata } from "next";
import { siteConfig } from "@/config/site.config";
import HomeContent from "@/components/sections/home/HomeContent";

/* ─── Métadonnées SEO ────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: siteConfig.seo.defaultTitle,
  description: siteConfig.description,
  keywords: [
    "MRJC-BÉNIN",
    "ONG Bénin",
    "développement rural Bénin",
    "agriculture durable",
    "santé communautaire",
    "alphabétisation",
    "autonomisation femmes Bénin",
    "projets développement",
    "Mouvement Rural Jeunesse Chrétienne",
  ],
  openGraph: {
    type: "website",
    url: siteConfig.url,
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.description,
    images: [
      {
        url: `${siteConfig.url}/assets/images/og-home.jpg`,
        width: 1200,
        height: 630,
      },
    ],
  },
  alternates: { canonical: siteConfig.url },
};

/* ─── JSON-LD ────────────────────────────────────────────────────────────── */

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: siteConfig.seo.defaultTitle,
  description: siteConfig.description,
  url: siteConfig.url,
  isPartOf: { "@type": "WebSite", name: siteConfig.name, url: siteConfig.url },
  about: {
    "@type": "NGO",
    name: siteConfig.fullName,
    url: siteConfig.url,
    foundingDate: String(siteConfig.founded),
    areaServed: { "@type": "Country", name: "Bénin" },
  },
};

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <>
      {/* JSON-LD rendu côté serveur */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      {/* Toutes les sections (Client Component) */}
      <HomeContent />
    </>
  );
}
