/**
 * manifest.ts — PWA Manifest MRJC-BÉNIN
 * Servi automatiquement par Next.js sur /manifest.webmanifest
 *
 * CORRECTION : Suppression des shortcuts/screenshots qui
 * pointent vers des fichiers PNG inexistants (500 en cascade).
 * Seules les icônes réelles (générées depuis logo.png) sont déclarées.
 */

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MRJC-BÉNIN — Développement Rural",
    short_name: "MRJC-BÉNIN",
    description:
      "ONG béninoise pour le développement rural, l'autonomisation des communautés et la santé.",
    start_url: "/",
    display: "standalone",
    background_color: "#1B6B3A",
    theme_color: "#1B6B3A",
    orientation: "portrait",
    scope: "/",
    lang: "fr",
    dir: "ltr",
    categories: ["nonprofit", "education", "health"],

    icons: [
      {
        src: "/assets/icons/icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/assets/icons/icon-96x96.png",
        sizes: "96x96",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/assets/icons/icon-128x128.png",
        sizes: "128x128",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/assets/icons/icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/assets/icons/icon-152x152.png",
        sizes: "152x152",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/assets/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/assets/icons/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/assets/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],

    /* Shortcuts simplifiés — sans icônes dédiées (évite 404) */
    shortcuts: [
      {
        name: "Nos Projets",
        short_name: "Projets",
        description: "Voir tous les projets de MRJC-BÉNIN",
        url: "/projects",
      },
      {
        name: "Actualités",
        short_name: "Actualités",
        description: "Dernières nouvelles de MRJC-BÉNIN",
        url: "/news",
      },
      {
        name: "Contact",
        short_name: "Contact",
        description: "Contacter MRJC-BÉNIN",
        url: "/contact",
      },
    ],
  };
}
