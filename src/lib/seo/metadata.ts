/**
 * lib/seo/metadata.ts
 * Utilitaires SEO centralisés pour MRJC-BÉNIN
 * Génère les métadonnées Next.js 14 (Metadata API) de façon cohérente
 */

import type { Metadata, Viewport } from "next";
import { siteConfig } from "@/config/site.config";

/* ─── Types ─────────────────────────────────────────────────────────────── */
export interface PageSEOProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedAt?: string;
  updatedAt?: string;
  authors?: string[];
  keywords?: string[];
  noIndex?: boolean;
}

/* ─── Viewport commun ────────────────────────────────────────────────────── */
export const defaultViewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1B6B3A" },
    { media: "(prefers-color-scheme: dark)", color: "#0F3D22" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

/* ─── Métadonnées de base ─────────────────────────────────────────────────── */
export const defaultKeywords = [
  "MRJC-BÉNIN",
  "ONG Bénin",
  "développement rural",
  "agriculture durable",
  "alphabétisation",
  "autonomisation femmes",
  "santé communautaire",
  "intermédiation sociale",
  "Cotonou",
  "Bénin",
  "Afrique de l'Ouest",
  "NGO Benin",
  "rural development",
  "sustainable agriculture",
];

/* ─── Générateur principal ────────────────────────────────────────────────── */
export function generateMetadata(props: PageSEOProps): Metadata {
  const {
    title,
    description = siteConfig.description,
    image = siteConfig.seo.defaultImage,
    url,
    type = "website",
    publishedAt,
    updatedAt,
    authors = ["MRJC-BÉNIN"],
    keywords = [],
    noIndex = false,
  } = props;

  const fullTitle = `${title} | MRJC-BÉNIN`;
  const canonicalUrl = url ? `${siteConfig.url}${url}` : siteConfig.url;
  const imageUrl = image.startsWith("http")
    ? image
    : `${siteConfig.url}${image}`;
  const allKeywords = [...defaultKeywords, ...keywords];

  return {
    title: fullTitle,
    description,
    keywords: allKeywords.join(", "),
    authors: authors.map((a) => ({ name: a })),

    /* ── Canonical ── */
    alternates: {
      canonical: canonicalUrl,
      languages: {
        fr: canonicalUrl,
        en: `${canonicalUrl}?lang=en`,
      },
    },

    /* ── Open Graph ── */
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      type,
      locale: siteConfig.locale,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
          type: "image/jpeg",
        },
      ],
      ...(publishedAt && { publishedTime: publishedAt }),
      ...(updatedAt && { modifiedTime: updatedAt }),
      ...(type === "article" && { authors }),
    },

    /* ── Twitter / X ── */
    twitter: {
      card: siteConfig.seo.twitterCard,
      title: fullTitle,
      description,
      images: [imageUrl],
      site: siteConfig.social.twitter,
      creator: siteConfig.social.twitter,
    },

    /* ── Robots ── */
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },

    /* ── Divers ── */
    category: "ONG / Non-profit",
    classification: "Développement rural, ONG, Bénin",
    creator: siteConfig.name,
    publisher: siteConfig.name,
    generator: "Next.js 14",

    /* ── App icons ── */
    icons: {
      icon: [
        {
          url: "/assets/icons/favicon-16x16.png",
          sizes: "16x16",
          type: "image/png",
        },
        {
          url: "/assets/icons/favicon-32x32.png",
          sizes: "32x32",
          type: "image/png",
        },
        {
          url: "/assets/icons/favicon-96x96.png",
          sizes: "96x96",
          type: "image/png",
        },
      ],
      apple: [{ url: "/assets/icons/apple-touch-icon.png", sizes: "180x180" }],
      other: [
        {
          rel: "mask-icon",
          url: "/assets/icons/safari-pinned-tab.svg",
          color: "#1B6B3A",
        },
      ],
    },

    /* ── Manifest ── */
    manifest: "/manifest.webmanifest",
  };
}

/* ─── Helpers rapides ─────────────────────────────────────────────────────── */

/** Pour les pages About, Contact, etc. */
export function staticPageMeta(
  title: string,
  description?: string,
  noIndex = false,
): Metadata {
  return generateMetadata({ title, description, noIndex });
}

/** Pour les articles de blog / news */
export function articleMeta(params: {
  title: string;
  description: string;
  image?: string;
  slug: string;
  type: "blog" | "news";
  publishedAt?: string;
  updatedAt?: string;
  tags?: string[];
  author?: string;
}): Metadata {
  return generateMetadata({
    title: params.title,
    description: params.description,
    image: params.image,
    url: `/${params.type === "news" ? "news" : "blog"}/${params.slug}`,
    type: "article",
    publishedAt: params.publishedAt,
    updatedAt: params.updatedAt,
    keywords: params.tags,
    authors: params.author ? [params.author] : undefined,
  });
}

/** Pour les pages projet */
export function projectMeta(params: {
  title: string;
  description: string;
  image?: string;
  slug: string;
  keywords?: string[];
}): Metadata {
  return generateMetadata({
    title: params.title,
    description: params.description,
    image: params.image,
    url: `/projects/${params.slug}`,
    type: "article",
    keywords: params.keywords,
  });
}

/* ─── JSON-LD Schema.org ─────────────────────────────────────────────────── */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: siteConfig.fullName,
    alternateName: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/assets/images/logo.png`,
    foundingDate: String(siteConfig.founded),
    description: siteConfig.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Cotonou",
      addressCountry: "BJ",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: siteConfig.contact.email,
      telephone: siteConfig.contact.phone,
      availableLanguage: ["French"],
    },
    sameAs: [
      siteConfig.social.facebook,
      siteConfig.social.linkedin,
      siteConfig.social.twitter,
      siteConfig.social.youtube,
      siteConfig.social.instagram,
    ],
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  };
}

export function articleSchema(params: {
  title: string;
  description: string;
  image?: string;
  publishedAt?: string;
  updatedAt?: string;
  author?: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: params.title,
    description: params.description,
    image: params.image ? `${siteConfig.url}${params.image}` : undefined,
    datePublished: params.publishedAt,
    dateModified: params.updatedAt ?? params.publishedAt,
    author: {
      "@type": "Organization",
      name: params.author ?? siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/assets/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}${params.url}`,
    },
  };
}
