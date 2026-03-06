import type { Metadata } from "next";
import { Suspense } from "react";
import PageHeader from "@/components/layout/PageHeader";
import ProjectsClient from "@/components/sections/projects/ProjectsClient";
import allProjects from "@/data/projects.json";
import type { Project } from "@/types/project.types";
import { siteConfig } from "@/config/site.config";

export const metadata: Metadata = {
  title: `Projets en Cours | ${siteConfig.seo.defaultTitle}`,
  description:
    "Découvrez les projets en cours de MRJC-BÉNIN : agriculture durable, santé communautaire, alphabétisation et autonomisation des femmes dans les zones rurales du Bénin.",
  keywords: [
    "projets en cours MRJC",
    "projets ONG Bénin",
    "développement rural actif",
    "projets actuels MRJC-BÉNIN",
  ],
  openGraph: {
    title: "Projets en Cours — MRJC-BÉNIN",
    description: "Nos projets actuellement en cours d'exécution au Bénin.",
    url: `${siteConfig.url}/projects/ongoing`,
  },
};

export default function ProjectsOngoingPage() {
  const projects = (allProjects as Project[]).filter(
    (p) => p.status === "ongoing",
  );

  const totalBenef = projects.reduce(
    (sum, p) => sum + p.beneficiaries.reduce((s, b) => s + b.count, 0),
    0,
  );
  const totalBudget = projects.reduce((sum, p) => sum + (p.budget ?? 0), 0);
  const departments = [...new Set(projects.flatMap((p) => p.departments))];

  return (
    <>
      <PageHeader
        title="Projets en Cours"
        subtitle="Des actions concrètes menées aujourd'hui pour transformer durablement les communautés rurales du Bénin"
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Projets", href: "/projects" },
          { label: "En cours" },
        ]}
        stats={[
          { label: "Projets actifs", value: `${projects.length}` },
          {
            label: "Bénéficiaires",
            value: `${(totalBenef / 1000).toFixed(0)}k+`,
          },
          {
            label: "Budget total",
            value: `${(totalBudget / 1000000).toFixed(0)}M FCFA`,
          },
          { label: "Départements couverts", value: `${departments.length}` },
        ]}
      />

      <Suspense
        fallback={
          <div className="container-mrjc py-24 text-center text-gray-400">
            Chargement…
          </div>
        }
      >
        <ProjectsClient projects={projects} />
      </Suspense>
    </>
  );
}
