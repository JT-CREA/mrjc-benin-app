"use client";

import React, { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  X,
  MapPin,
  Calendar,
  Users,
  Clock,
  ExternalLink,
  LayoutGrid,
  LayoutList,
  ChevronDown,
  ArrowUpDown,
  Sprout,
  HeartPulse,
  BookOpenText,
  UsersRound,
  Handshake,
} from "lucide-react";
import type { Project } from "@/types/project.types";
import { cn } from "@/lib/utils/cn";

/* ─────────────────────────────────────────────────────────────
   Constantes
───────────────────────────────────────────────────────────── */
const DOMAIN_CONFIG: Record<
  string,
  { label: string; icon: React.ElementType; color: string; bg: string }
> = {
  "agricultural-council": {
    label: "Conseil Agricole",
    icon: Sprout,
    color: "text-primary-600",
    bg: "bg-primary-50 border-primary-200",
  },
  "community-health": {
    label: "Santé Communautaire",
    icon: HeartPulse,
    color: "text-accent-600",
    bg: "bg-accent-50 border-accent-200",
  },
  "literacy-education": {
    label: "Alphabétisation",
    icon: BookOpenText,
    color: "text-secondary-600",
    bg: "bg-secondary-50 border-secondary-200",
  },
  "women-empowerment": {
    label: "Autonomisation Femmes",
    icon: UsersRound,
    color: "text-purple-600",
    bg: "bg-purple-50 border-purple-200",
  },
  "social-intermediation": {
    label: "Intermédiation Sociale",
    icon: Handshake,
    color: "text-neutral-600",
    bg: "bg-neutral-50 border-neutral-200",
  },
};

const STATUS_CONFIG: Record<
  string,
  { label: string; dot: string; badge: string }
> = {
  ongoing: {
    label: "En cours",
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  completed: {
    label: "Clôturé",
    dot: "bg-neutral-400",
    badge: "bg-neutral-50 text-neutral-700 border-neutral-200",
  },
  planned: {
    label: "Planifié",
    dot: "bg-accent-500",
    badge: "bg-accent-50 text-accent-700 border-accent-200",
  },
  suspended: {
    label: "Suspendu",
    dot: "bg-orange-500",
    badge: "bg-orange-50 text-orange-700 border-orange-200",
  },
};

const ALL_DEPARTMENTS = [
  "Atacora",
  "Borgou",
  "Zou",
  "Collines",
  "Mono",
  "Ouémé",
  "Atlantique",
  "Donga",
  "Alibori",
  "Couffo",
  "Littoral",
  "Plateau",
];

function formatBudget(amount: number): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M FCFA`;
  if (amount >= 1_000) return `${Math.round(amount / 1_000)}k FCFA`;
  return `${amount} FCFA`;
}

/* ─────────────────────────────────────────────────────────────
   Carte projet — vue grille
───────────────────────────────────────────────────────────── */
function ProjectCardGrid({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const domain = DOMAIN_CONFIG[project.domain];
  const status = STATUS_CONFIG[project.status];
  const DomainIcon = domain?.icon ?? Sprout;
  const totalBenef = project.beneficiaries.reduce((s, b) => s + b.count, 0);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.3) }}
      className="group bg-white rounded-2xl border border-neutral-100 overflow-hidden
                 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      {/* Image */}
      <div className="relative h-52 bg-neutral-100 overflow-hidden flex-shrink-0">
        <Image
          src={project.coverImage}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/40 to-transparent" />

        {/* Badges overlay */}
        <div className="absolute top-3 left-3">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border",
              status.badge,
            )}
          >
            <span className={cn("w-1.5 h-1.5 rounded-full", status.dot)} />
            {status.label}
          </span>
        </div>

        {project.budget && (
          <div className="absolute top-3 right-3">
            <span
              className="text-xs font-semibold bg-white/90 backdrop-blur-sm
                             text-neutral-700 px-2.5 py-1 rounded-full"
            >
              {formatBudget(project.budget)}
            </span>
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="flex flex-col flex-1 p-5">
        {/* Domaine */}
        {domain && (
          <div className="flex items-center gap-2 mb-3">
            <div
              className={cn(
                "flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border",
                domain.bg,
                domain.color,
              )}
            >
              <DomainIcon className="w-3 h-3" />
              {domain.label}
            </div>
          </div>
        )}

        {/* Titre */}
        <h3
          className="font-display font-bold text-base text-neutral-900 leading-snug mb-2
                       group-hover:text-primary-700 transition-colors line-clamp-2 flex-shrink-0"
        >
          {project.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-neutral-500 leading-relaxed line-clamp-2 flex-1 mb-4">
          {project.excerpt}
        </p>

        {/* Méta */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mb-4">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <MapPin className="w-3.5 h-3.5 text-primary-400 flex-shrink-0" />
            <span className="truncate">{project.zone}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <Users className="w-3.5 h-3.5 text-primary-400 flex-shrink-0" />
            <span>{totalBenef.toLocaleString("fr-FR")}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <Calendar className="w-3.5 h-3.5 text-primary-400 flex-shrink-0" />
            <span>{new Date(project.startDate).getFullYear()}</span>
          </div>
          {project.duration && (
            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <Clock className="w-3.5 h-3.5 text-primary-400 flex-shrink-0" />
              <span>{project.duration}</span>
            </div>
          )}
        </div>

        {/* Bailleurs */}
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
              <span className="text-2xs text-neutral-400 px-1">
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
          Voir la fiche
          <ExternalLink
            className="w-3.5 h-3.5 group-hover/btn:-translate-y-0.5
                                   group-hover/btn:translate-x-0.5 transition-transform"
          />
        </Link>
      </div>
    </motion.article>
  );
}

/* ─────────────────────────────────────────────────────────────
   Carte projet — vue liste
───────────────────────────────────────────────────────────── */
function ProjectCardList({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const domain = DOMAIN_CONFIG[project.domain];
  const status = STATUS_CONFIG[project.status];
  const totalBenef = project.beneficiaries.reduce((s, b) => s + b.count, 0);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.2) }}
      className="group bg-white rounded-2xl border border-neutral-100 overflow-hidden
                 hover:shadow-lg hover:border-primary-200 transition-all duration-300
                 flex flex-col sm:flex-row"
    >
      {/* Image */}
      <div className="relative w-full sm:w-48 h-40 sm:h-auto flex-shrink-0 overflow-hidden bg-neutral-100">
        <Image
          src={project.coverImage}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="192px"
        />
      </div>

      {/* Contenu */}
      <div className="flex-1 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          {/* Statut + domaine */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 text-2xs font-semibold px-2 py-0.5 rounded-full border",
                status.badge,
              )}
            >
              <span className={cn("w-1 h-1 rounded-full", status.dot)} />
              {status.label}
            </span>
            {domain && (
              <span className="text-2xs font-medium text-neutral-500">
                {domain.label}
              </span>
            )}
          </div>

          <h3
            className="font-display font-bold text-base text-neutral-900 leading-snug mb-1
                         group-hover:text-primary-700 transition-colors line-clamp-1"
          >
            {project.title}
          </h3>
          <p className="text-xs text-neutral-500 line-clamp-2 mb-2">
            {project.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <div className="flex items-center gap-1 text-xs text-neutral-400">
              <MapPin className="w-3 h-3" /> {project.zone}
            </div>
            <div className="flex items-center gap-1 text-xs text-neutral-400">
              <Users className="w-3 h-3" /> {totalBenef.toLocaleString("fr-FR")}{" "}
              bénéf.
            </div>
            {project.budget && (
              <div className="text-xs font-semibold text-neutral-600">
                {formatBudget(project.budget)}
              </div>
            )}
          </div>
        </div>

        <Link
          href={`/projects/${project.slug}`}
          className="btn-primary text-sm flex-shrink-0 whitespace-nowrap"
        >
          Voir la fiche
        </Link>
      </div>
    </motion.article>
  );
}

/* ─────────────────────────────────────────────────────────────
   Composant principal
───────────────────────────────────────────────────────────── */
type ViewMode = "grid" | "list";
type SortKey =
  | "default"
  | "budget-desc"
  | "budget-asc"
  | "date-desc"
  | "date-asc"
  | "benef-desc";

interface Filters {
  search: string;
  status: string;
  domain: string;
  department: string;
}

export default function ProjectsClient({ projects }: { projects: Project[] }) {
  const [view, setView] = useState<ViewMode>("grid");
  const [sort, setSort] = useState<SortKey>("default");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    status: "",
    domain: "",
    department: "",
  });

  const setFilter = useCallback((key: keyof Filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? "" : value,
    }));
  }, []);

  const clearFilters = () =>
    setFilters({ search: "", status: "", domain: "", department: "" });

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  /* Filtrage + tri */
  const processed = useMemo(() => {
    let result = [...projects];

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.zone.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    if (filters.status)
      result = result.filter((p) => p.status === filters.status);
    if (filters.domain)
      result = result.filter((p) => p.domain === filters.domain);
    if (filters.department)
      result = result.filter((p) => p.departments.includes(filters.department));

    switch (sort) {
      case "budget-desc":
        return result.sort((a, b) => (b.budget ?? 0) - (a.budget ?? 0));
      case "budget-asc":
        return result.sort((a, b) => (a.budget ?? 0) - (b.budget ?? 0));
      case "date-desc":
        return result.sort(
          (a, b) =>
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
        );
      case "date-asc":
        return result.sort(
          (a, b) =>
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
        );
      case "benef-desc":
        return result.sort((a, b) => {
          const sumA = a.beneficiaries.reduce((s, x) => s + x.count, 0);
          const sumB = b.beneficiaries.reduce((s, x) => s + x.count, 0);
          return sumB - sumA;
        });
      default:
        return result.sort((a, b) => (a.order || 0) - (b.order || 0));
    }
  }, [projects, filters, sort]);

  return (
    <div className="py-10 bg-neutral-50">
      <div className="container-mrjc">
        {/* ── Barre de recherche + contrôles ── */}
        <div
          className="bg-white rounded-2xl border border-neutral-200 p-4 mb-6
                        flex flex-col md:flex-row gap-3"
        >
          {/* Recherche */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="search"
              value={filters.search}
              onChange={(e) => setFilter("search", e.target.value)}
              placeholder="Rechercher un projet, thème, zone…"
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-neutral-200 rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                         bg-neutral-50 placeholder:text-neutral-400"
            />
          </div>

          {/* Tri */}
          <div className="relative">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="pl-9 pr-8 py-2.5 text-sm border border-neutral-200 rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-primary-500
                         bg-neutral-50 appearance-none cursor-pointer"
            >
              <option value="default">Tri par défaut</option>
              <option value="date-desc">Plus récents d'abord</option>
              <option value="date-asc">Plus anciens d'abord</option>
              <option value="budget-desc">Budget (décroissant)</option>
              <option value="budget-asc">Budget (croissant)</option>
              <option value="benef-desc">Bénéficiaires (décroissant)</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
          </div>

          {/* Filtres avancés */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all",
              filtersOpen || activeFilterCount > 0
                ? "bg-primary-500 text-white"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200",
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtres
            {activeFilterCount > 0 && (
              <span className="bg-white/30 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Vue grille / liste */}
          <div className="flex items-center border border-neutral-200 rounded-xl overflow-hidden flex-shrink-0">
            {[
              { id: "grid", Icon: LayoutGrid },
              { id: "list", Icon: LayoutList },
            ].map(({ id, Icon }) => (
              <button
                key={id}
                onClick={() => setView(id as ViewMode)}
                className={cn(
                  "p-2.5 transition-colors",
                  view === id
                    ? "bg-primary-500 text-white"
                    : "text-neutral-400 hover:bg-neutral-100",
                )}
                aria-label={id === "grid" ? "Vue grille" : "Vue liste"}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>

        {/* ── Filtres avancés (expandable) ── */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-white rounded-2xl border border-neutral-200 p-5 space-y-5">
                {/* Statut */}
                <div>
                  <p className="text-xs font-bold text-neutral-600 uppercase tracking-wider mb-2.5">
                    Statut du projet
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                      <button
                        key={key}
                        onClick={() => setFilter("status", key)}
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                          filters.status === key
                            ? "bg-primary-500 text-white border-primary-500"
                            : `${cfg.badge} hover:opacity-80`,
                        )}
                      >
                        <span
                          className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)}
                        />
                        {cfg.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Domaine */}
                <div>
                  <p className="text-xs font-bold text-neutral-600 uppercase tracking-wider mb-2.5">
                    Domaine d'intervention
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(DOMAIN_CONFIG).map(([key, cfg]) => {
                      const Icon = cfg.icon;
                      return (
                        <button
                          key={key}
                          onClick={() => setFilter("domain", key)}
                          className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                            filters.domain === key
                              ? "bg-primary-500 text-white border-primary-500"
                              : `${cfg.bg} ${cfg.color} hover:opacity-80`,
                          )}
                        >
                          <Icon className="w-3 h-3" />
                          {cfg.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Département */}
                <div>
                  <p className="text-xs font-bold text-neutral-600 uppercase tracking-wider mb-2.5">
                    Département du Bénin
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {ALL_DEPARTMENTS.map((dept) => (
                      <button
                        key={dept}
                        onClick={() => setFilter("department", dept)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                          filters.department === dept
                            ? "bg-primary-500 text-white border-primary-500"
                            : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-primary-300",
                        )}
                      >
                        {dept}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Réinitialiser */}
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    <X className="w-4 h-4" /> Réinitialiser tous les filtres
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Résultats count ── */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-neutral-500">
            <span className="font-bold text-neutral-900">
              {processed.length}
            </span>{" "}
            projet{processed.length !== 1 ? "s" : ""} trouvé
            {processed.length !== 1 ? "s" : ""}
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="ml-2 text-primary-600 hover:underline text-xs"
              >
                (effacer les filtres)
              </button>
            )}
          </p>
          {/* Filtres actifs pills */}
          {activeFilterCount > 0 && (
            <div className="hidden sm:flex items-center gap-2">
              {filters.status && (
                <span
                  className="inline-flex items-center gap-1 text-xs bg-primary-50 text-primary-700
                                 border border-primary-200 px-2.5 py-1 rounded-full"
                >
                  {STATUS_CONFIG[filters.status]?.label}
                  <button onClick={() => setFilter("status", filters.status)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.domain && (
                <span
                  className="inline-flex items-center gap-1 text-xs bg-primary-50 text-primary-700
                                 border border-primary-200 px-2.5 py-1 rounded-full"
                >
                  {DOMAIN_CONFIG[filters.domain]?.label}
                  <button onClick={() => setFilter("domain", filters.domain)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.department && (
                <span
                  className="inline-flex items-center gap-1 text-xs bg-primary-50 text-primary-700
                                 border border-primary-200 px-2.5 py-1 rounded-full"
                >
                  {filters.department}
                  <button
                    onClick={() => setFilter("department", filters.department)}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Grille / Liste ── */}
        <AnimatePresence mode="wait">
          {processed.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="font-bold text-neutral-800 text-lg mb-2">
                Aucun projet trouvé
              </h3>
              <p className="text-neutral-500 text-sm mb-6">
                Essayez de modifier vos critères de recherche ou de filtrage.
              </p>
              <button onClick={clearFilters} className="btn-outline text-sm">
                <X className="w-4 h-4" /> Effacer les filtres
              </button>
            </motion.div>
          ) : view === "grid" ? (
            <motion.div
              key="grid"
              layout
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {processed.map((project, i) => (
                <ProjectCardGrid key={project.id} project={project} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div key="list" layout className="space-y-4">
              {processed.map((project, i) => (
                <ProjectCardList key={project.id} project={project} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
