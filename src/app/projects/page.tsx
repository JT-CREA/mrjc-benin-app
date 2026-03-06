import type { Metadata } from "next";
import { Suspense } from "react";
import PageHeader from "@/components/layout/PageHeader";
import ProjectsClient from "@/components/sections/projects/ProjectsClient";
import allProjects from "@/data/projects.json";
import type { Project } from "@/types/project.types";

export const metadata: Metadata = {
  title: "Nos Projets",
  description:
    "Découvrez les 47 projets de MRJC-BÉNIN en faveur du développement rural au Bénin : agriculture, santé, alphabétisation, autonomisation des femmes.",
  keywords: [
    "projets ONG Bénin",
    "développement rural",
    "agriculture durable",
    "MRJC-BÉNIN",
  ],
};

/* Statistiques calculées */
function computeStats(projects: Project[]) {
  const ongoing = projects.filter((p) => p.status === "ongoing").length;
  const completed = projects.filter((p) => p.status === "completed").length;
  const planned = projects.filter((p) => p.status === "planned").length;
  const totalBenef = projects.reduce(
    (sum, p) => sum + p.beneficiaries.reduce((s, b) => s + b.count, 0),
    0,
  );
  return { ongoing, completed, planned, totalBenef };
}

export default function ProjectsPage() {
  const projects = allProjects as Project[];
  const stats = computeStats(projects);

  return (
    <>
      <PageHeader
        tag="Nos Interventions"
        title="Nos Projets"
        subtitle="47 projets réalisés depuis 1985 dans 12 départements du Bénin. Explorez nos interventions passées, en cours et planifiées."
        breadcrumbs={[{ label: "Nos Projets" }]}
        image="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920"
      >
        {/* Stats rapides sous le titre */}
        <div className="flex flex-wrap gap-4 mt-2">
          {[
            {
              value: stats.ongoing,
              label: "En cours",
              color: "bg-primary-500",
            },
            {
              value: stats.completed,
              label: "Clôturés",
              color: "bg-neutral-500",
            },
            {
              value: stats.planned,
              label: "Planifiés",
              color: "bg-accent-500",
            },
            {
              value: `${Math.round(stats.totalBenef / 1000)}k+`,
              label: "Bénéficiaires",
              color: "bg-secondary-500",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm
                            border border-white/20 rounded-xl px-4 py-2"
            >
              <span
                className={`w-2 h-2 rounded-full ${s.color} flex-shrink-0`}
              />
              <span className="text-white font-bold text-sm">{s.value}</span>
              <span className="text-primary-200 text-xs">{s.label}</span>
            </div>
          ))}
        </div>
      </PageHeader>

      <Suspense
        fallback={
          <div className="container-mrjc py-20 text-center text-neutral-400">
            Chargement…
          </div>
        }
      >
        <ProjectsClient projects={projects} />
      </Suspense>
    </>
  );
}
