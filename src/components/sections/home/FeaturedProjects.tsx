"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Calendar,
  Users,
  ArrowRight,
  ExternalLink,
  Clock,
} from "lucide-react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import type { Project } from "@/types/project.types";
import projects from "@/data/projects.json";
import { cn } from "@/lib/utils/cn";

/* ─────────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────────── */
const domainLabels: Record<string, string> = {
  "agricultural-council": "Conseil Agricole",
  "community-health": "Santé Communautaire",
  "literacy-education": "Alphabétisation",
  "women-empowerment": "Autonomisation Femmes",
  "social-intermediation": "Intermédiation Sociale",
};

const domainColors: Record<string, string> = {
  "agricultural-council": "bg-primary-100 text-primary-700",
  "community-health": "bg-accent-100 text-accent-700",
  "literacy-education": "bg-secondary-100 text-secondary-700",
  "women-empowerment": "bg-purple-100 text-purple-700",
  "social-intermediation": "bg-neutral-100 text-neutral-700",
};

const statusConfig = {
  ongoing: {
    label: "En cours",
    className: "badge-ongoing",
    dot: "bg-primary-500",
  },
  completed: {
    label: "Clôturé",
    className: "badge-completed",
    dot: "bg-neutral-400",
  },
  planned: {
    label: "Planifié",
    className: "badge-planned",
    dot: "bg-accent-500",
  },
  suspended: {
    label: "Suspendu",
    className: "badge-hot",
    dot: "bg-orange-500",
  },
};

function formatBudget(amount?: number): string {
  if (!amount) return "";
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M FCFA`;
  if (amount >= 1_000) return `${Math.round(amount / 1000)}k FCFA`;
  return `${amount} FCFA`;
}

/* ─────────────────────────────────────────────────────────────
   Carte projet
───────────────────────────────────────────────────────────── */
function ProjectCard({
  project,
  index,
  isVisible,
}: {
  project: Project;
  index: number;
  isVisible: boolean;
}) {
  const status = statusConfig[project.status];
  const totalBeneficiaries = project.beneficiaries.reduce(
    (sum, b) => sum + b.count,
    0,
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.12, ease: "easeOut" }}
      className="card group flex flex-col overflow-hidden h-full"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden flex-shrink-0 bg-neutral-100">
        <Image
          src={project.coverImage}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Badges sur l'image */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className={cn("badge", status.className)}>
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full flex-shrink-0",
                status.dot,
              )}
            />
            {status.label}
          </span>
        </div>
        {project.budget && (
          <div className="absolute top-3 right-3">
            <span
              className="text-xs font-semibold bg-white/90 backdrop-blur-sm text-neutral-700
                             px-2.5 py-1 rounded-full"
            >
              {formatBudget(project.budget)}
            </span>
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="flex flex-col flex-1 p-5">
        {/* Domaine */}
        <div className="mb-3">
          <span
            className={cn(
              "text-xs font-semibold px-2.5 py-1 rounded-full",
              domainColors[project.domain] || "bg-neutral-100 text-neutral-600",
            )}
          >
            {domainLabels[project.domain] || project.domain}
          </span>
        </div>

        {/* Titre */}
        <h3
          className="font-display font-bold text-lg text-neutral-900 leading-snug
                       mb-2 group-hover:text-primary-700 transition-colors line-clamp-2"
        >
          {project.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-neutral-500 leading-relaxed line-clamp-2 mb-4 flex-1">
          {project.excerpt}
        </p>

        {/* Métadonnées */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <MapPin className="w-3.5 h-3.5 text-primary-400 flex-shrink-0" />
            <span className="truncate">{project.zone}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <Users className="w-3.5 h-3.5 text-primary-400 flex-shrink-0" />
            <span>{totalBeneficiaries.toLocaleString("fr-FR")} bénéf.</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <Calendar className="w-3.5 h-3.5 text-primary-400 flex-shrink-0" />
            <span>{new Date(project.startDate).getFullYear()}</span>
          </div>
          {project.duration && (
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <Clock className="w-3.5 h-3.5 text-primary-400 flex-shrink-0" />
              <span>{project.duration}</span>
            </div>
          )}
        </div>

        {/* Financement */}
        {project.funders.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.funders.slice(0, 2).map((f) => (
              <span
                key={f.name}
                className="text-2xs bg-neutral-50 border border-neutral-200 text-neutral-600
                               px-2 py-0.5 rounded-full"
              >
                {f.name}
              </span>
            ))}
            {project.funders.length > 2 && (
              <span
                className="text-2xs bg-neutral-50 border border-neutral-200 text-neutral-500
                               px-2 py-0.5 rounded-full"
              >
                +{project.funders.length - 2}
              </span>
            )}
          </div>
        )}

        {/* CTA */}
        <Link
          href={`/projects/${project.slug}`}
          className="btn-outline text-sm w-full justify-center group/btn mt-auto"
        >
          Voir la fiche projet
          <ExternalLink
            className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5
                                   group-hover/btn:-translate-y-0.5 transition-transform"
          />
        </Link>
      </div>
    </motion.article>
  );
}

/* ─────────────────────────────────────────────────────────────
   Filtres
───────────────────────────────────────────────────────────── */
const filters = [
  { id: "all", label: "Tous les projets" },
  { id: "ongoing", label: "En cours" },
  { id: "completed", label: "Clôturés" },
];

/* ─────────────────────────────────────────────────────────────
   Section principale
───────────────────────────────────────────────────────────── */
export default function FeaturedProjects() {
  const { ref, isVisible } = useIntersectionObserver<HTMLElement>({
    threshold: 0.05,
  });
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const allProjects = projects as Project[];
  const filtered =
    activeFilter === "all"
      ? allProjects.slice(0, 3)
      : allProjects.filter((p) => p.status === activeFilter).slice(0, 3);

  return (
    <section
      ref={ref}
      className="py-20 lg:py-28 bg-neutral-50"
      aria-labelledby="projects-heading"
    >
      <div className="container-mrjc">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10"
        >
          <div>
            <div className="section-tag justify-start">Nos Interventions</div>
            <h2
              id="projects-heading"
              className="font-display text-3xl lg:text-4xl font-bold
                                                  text-neutral-900 mt-2"
            >
              Projets phares & Réalisations
            </h2>
            <p className="text-neutral-500 mt-2 max-w-xl">
              Des interventions concrètes, des résultats mesurables, des
              communautés transformées.
            </p>
          </div>

          {/* Filtres */}
          <div
            className="flex items-center gap-2 bg-white rounded-xl p-1.5
                          border border-neutral-200 shadow-xs flex-shrink-0"
          >
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
                  activeFilter === filter.id
                    ? "bg-primary-500 text-white shadow-sm"
                    : "text-neutral-600 hover:bg-neutral-100",
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Grille */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.length > 0 ? (
              filtered.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  isVisible={isVisible}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-16 text-neutral-400">
                <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="font-semibold">Aucun projet trouvé</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* CTA voir tous */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Link href="/projects" className="btn-primary">
            Voir tous les projets ({allProjects.length})
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* Icône manquante */
function FolderOpen(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      {...props}
    >
      <path d="M5 19a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4l2 2h4a2 2 0 0 1 2 2v1M5 19h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2z" />
    </svg>
  );
}
