/**
 * Page — Notre Impact
 * Route: /impact
 *
 * SERVER COMPONENT pur.
 * ImpactClient est déjà marqué 'use client' → peut être importé directement.
 * Pas besoin de dynamic({ ssr:false }) ici.
 */

import type { Metadata } from "next";
import { siteConfig } from "@/config/site.config";
import ImpactClient from "@/components/sections/impact/ImpactClient";

export const metadata: Metadata = {
  title: `Notre Impact | ${siteConfig.seo.defaultTitle}`,
  description:
    "Mesures et résultats de 38 ans d'engagement de MRJC-BÉNIN : 85 000 bénéficiaires directs, 47 projets réalisés, 230 villages touchés dans 12 départements du Bénin.",
  keywords: [
    "impact MRJC Bénin",
    "résultats ONG développement rural",
    "bénéficiaires Bénin",
    "mesure impact social",
    "ODD Bénin",
  ],
  openGraph: {
    title: "Notre Impact — MRJC-BÉNIN",
    description:
      "38 ans d'actions mesurées au service des communautés rurales du Bénin.",
    url: `${siteConfig.url}/impact`,
  },
};

export default function ImpactPage() {
  return <ImpactClient />;
}
