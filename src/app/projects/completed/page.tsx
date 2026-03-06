import type { Metadata } from "next";
import { Suspense } from "react";
import PageHeader from "@/components/layout/PageHeader";
import ProjectsClient from "@/components/sections/projects/ProjectsClient";
import allProjects from "@/data/projects.json";
import type { Project } from "@/types/project.types";
import { siteConfig } from "@/config/site.config";

export const metadata: Metadata = {
  title: `Projets Achevés | ${siteConfig.seo.defaultTitle}`,
  description:
    "Bilan des projets achevés par MRJC-BÉNIN depuis 1985 : résultats mesurés, enseignements et impact durable sur les communautés rurales du Bénin.",
  keywords: [
    "projets achevés MRJC",
    "résultats ONG Bénin",
    "bilan projets développement",
    "impact MRJC-BÉNIN",
  ],
  openGraph: {
    title: "Projets Achevés — MRJC-BÉNIN",
    description:
      "Le bilan complet de nos projets terminés et leur impact mesuré.",
    url: `${siteConfig.url}/projects/completed`,
  },
};

export default function ProjectsCompletedPage() {
  const projects = (allProjects as Project[]).filter(
    (p) => p.status === "completed",
  );

  const totalBenef = projects.reduce(
    (sum, p) => sum + p.beneficiaries.reduce((s, b) => s + b.count, 0),
    0,
  );
  const totalBudget = projects.reduce((sum, p) => sum + (p.budget ?? 0), 0);
  const departments = [...new Set(projects.flatMap((p) => p.departments))];
  const avgAchievement = Math.round(
    projects
      .flatMap((p) => p.results ?? [])
      .reduce(
        (sum, r) => sum + (r.target > 0 ? (r.achieved / r.target) * 100 : 100),
        0,
      ) / Math.max(projects.flatMap((p) => p.results ?? []).length, 1),
  );

  return (
    <>
      <PageHeader
        title="Projets Achevés"
        subtitle="Témoignages d'un engagement de 38 ans — Des résultats concrets, mesurés et documentés au bénéfice des communautés rurales"
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Projets", href: "/projects" },
          { label: "Achevés" },
        ]}
        stats={[
          { label: "Projets terminés", value: `${projects.length}+` },
          {
            label: "Bénéficiaires total",
            value: `${(totalBenef / 1000).toFixed(0)}k+`,
          },
          {
            label: "Budget mobilisé",
            value: `${(totalBudget / 1000000).toFixed(0)}M FCFA`,
          },
          {
            label: "Départements touchés",
            value: departments.length.toString(),
          },
          { label: "Taux réalisation moyen", value: `${avgAchievement}%` },
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
