/**
 * generateMetadata — MRJC-BÉNIN
 * Helper centralisé pour les métadonnées Next.js 14.
 * Utilisé par toutes les pages pour un SEO cohérent.
 */

import type { Metadata } from "next";
import { siteConfig } from "@/config/site.config";

interface MetaOptions {
  title: string;
  description: string;
  slug?: string;
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  keywords?: string[];
  publishedAt?: string;
  modifiedAt?: string;
  author?: string;
}

const BASE_URL = siteConfig.url ?? "https://mrjc-benin.org";
const DEFAULT_IMAGE = `${BASE_URL}/assets/images/og-default.jpg`;

export function generatePageMetadata(opts: MetaOptions): Metadata {
  const {
    title,
    description,
    slug = "",
    image = DEFAULT_IMAGE,
    type = "website",
    noIndex = false,
    keywords = [],
    publishedAt,
    modifiedAt,
    author = siteConfig.name,
  } = opts;

  const fullTitle = `${title} | ${siteConfig.name}`;
  const url = slug ? `${BASE_URL}/${slug.replace(/^\//, "")}` : BASE_URL;
  const ogImage = image.startsWith("http") ? image : `${BASE_URL}${image}`;

  const defaultKeywords = [
    "MRJC-BÉNIN",
    "ONG Bénin",
    "développement rural",
    "jeunesse chrétienne",
    "Mouvement Rural",
    "agriculture Bénin",
    "autonomisation femmes",
    "alphabétisation",
    "santé communautaire",
  ];

  return {
    title: fullTitle,
    description: description.slice(0, 160),
    keywords: [...defaultKeywords, ...keywords].join(", "),
    authors: [{ name: author }],
    creator: siteConfig.name,
    publisher: siteConfig.name,

    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },

    openGraph: {
      title: fullTitle,
      description: description.slice(0, 160),
      url,
      siteName: siteConfig.name,
      type,
      locale: siteConfig.locale ?? "fr_FR",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedAt && { publishedTime: publishedAt }),
      ...(modifiedAt && { modifiedTime: modifiedAt }),
    },

    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: description.slice(0, 160),
      images: [ogImage],
      creator: siteConfig.social?.twitter ?? "@mrjcbenin",
      site: siteConfig.social?.twitter ?? "@mrjcbenin",
    },

    alternates: {
      canonical: url,
    },

    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
  };
}

/** Métadonnées de fallback pour les routes dynamiques sans contenu */
export function notFoundMetadata(): Metadata {
  return {
    title: `Page introuvable | ${siteConfig.name}`,
    description: "Cette page n'existe pas ou a été déplacée.",
    robots: { index: false, follow: false },
  };
}
