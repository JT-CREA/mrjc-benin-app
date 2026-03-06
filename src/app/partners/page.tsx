import type { Metadata } from "next";
import { siteConfig } from "@/config/site.config";
import PageHeader from "@/components/layout/PageHeader";
import PartnersClient from "@/components/sections/partners/PartnersClient";
import partnersData from "@/data/partners.json";

export const metadata: Metadata = {
  title: `Nos Partenaires | ${siteConfig.seo.defaultTitle}`,
  description:
    "Découvrez les partenaires techniques, financiers et institutionnels qui soutiennent la mission de MRJC-BÉNIN depuis plus de 38 ans.",
  keywords: [
    "partenaires MRJC",
    "ONG partenaires Bénin",
    "UE Bénin",
    "UNICEF Bénin",
    "AFD Bénin",
  ],
  openGraph: {
    title: `Nos Partenaires | MRJC-BÉNIN`,
    description:
      "Institutions, bailleurs de fonds et organisations partenaires de MRJC-BÉNIN.",
    url: `${siteConfig.url}/partners`,
  },
};

export default function PartnersPage() {
  return (
    <>
      <PageHeader
        title="Nos Partenaires"
        subtitle="Des alliances stratégiques pour un impact amplifié sur les communautés rurales du Bénin"
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Partenaires" },
        ]}
        stats={[
          { label: "Partenaires actifs", value: "35+" },
          { label: "Pays représentés", value: "12" },
          { label: "Années de collaboration", value: "38+" },
        ]}
      />
      <PartnersClient partners={partnersData} />
    </>
  );
}
