"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Download,
  FileText,
  BookOpen,
  BarChart3,
  FolderOpen,
  GraduationCap,
  Presentation,
  X,
  Calendar,
  Eye,
  Filter,
  ChevronDown,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import type { Resource } from "@/types/resource.types";
import { cn } from "@/lib/utils/cn";

/* ──────────────────────────────────────────────────────────
   Constantes
────────────────────────────────────────────────────────── */
const typeConfig: Record<
  string,
  { label: string; icon: React.ElementType; color: string }
> = {
  "rapport-annuel": {
    label: "Rapport Annuel",
    icon: BarChart3,
    color: "bg-primary-100 text-primary-700",
  },
  "guide-technique": {
    label: "Guide Technique",
    icon: BookOpen,
    color: "bg-secondary-100 text-secondary-700",
  },
  "etude-recherche": {
    label: "Étude & Recherche",
    icon: Eye,
    color: "bg-accent-100 text-accent-700",
  },
  "document-cadre": {
    label: "Document Cadre",
    icon: FileText,
    color: "bg-neutral-100 text-neutral-700",
  },
  "outil-pedagogique": {
    label: "Outil Pédagogique",
    icon: GraduationCap,
    color: "bg-green-100 text-green-700",
  },
  presentation: {
    label: "Présentation",
    icon: Presentation,
    color: "bg-blue-100 text-blue-700",
  },
  communique: {
    label: "Communiqué",
    icon: FileText,
    color: "bg-orange-100 text-orange-700",
  },
  brochure: {
    label: "Brochure",
    icon: FolderOpen,
    color: "bg-purple-100 text-purple-700",
  },
};

const categoryLabels: Record<string, string> = {
  institutionnel: "Institutionnel",
  agriculture: "Agriculture",
  sante: "Santé",
  education: "Éducation",
  genre: "Genre",
  gouvernance: "Gouvernance",
  evaluation: "Évaluation",
  communication: "Communication",
};

/* ──────────────────────────────────────────────────────────
   Carte ressource
────────────────────────────────────────────────────────── */
function ResourceCard({
  resource,
  index,
}: {
  resource: Resource;
  index: number;
}) {
  const typeInfo = typeConfig[resource.type] || {
    label: resource.type,
    icon: FileText,
    color: "bg-neutral-100 text-neutral-700",
  };
  const Icon = typeInfo.icon;

  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    month: "short",
    year: "numeric",
  }).format(new Date(resource.publishedAt));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group bg-white rounded-2xl border border-neutral-100 overflow-hidden
                 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      {/* Image */}
      <div className="relative h-44 bg-neutral-100 overflow-hidden flex-shrink-0">
        <Image
          src={resource.coverImage}
          alt={resource.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
        {resource.featured && (
          <div className="absolute top-3 left-3">
            <span className="text-xs font-bold bg-secondary-500 text-white px-2.5 py-1 rounded-full">
              ⭐ Featured
            </span>
          </div>
        )}
        {/* Overlay type */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm",
              typeInfo.color,
            )}
          >
            <Icon className="w-3 h-3" />
            {typeInfo.label}
          </span>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-neutral-400 bg-neutral-50 px-2 py-0.5 rounded-full">
            {categoryLabels[resource.category] || resource.category}
          </span>
          <span className="text-xs text-neutral-400 flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {formattedDate}
          </span>
        </div>

        <h3
          className="font-display font-bold text-base text-neutral-900 leading-snug mb-2
                       group-hover:text-primary-700 transition-colors line-clamp-2"
        >
          {resource.title}
        </h3>

        {resource.subtitle && (
          <p className="text-xs text-neutral-500 italic mb-2 line-clamp-1">
            {resource.subtitle}
          </p>
        )}

        <p className="text-sm text-neutral-500 leading-relaxed line-clamp-3 mb-4 flex-1">
          {resource.description}
        </p>

        {/* Méta fichier */}
        <div className="flex items-center gap-3 mb-4 text-xs text-neutral-400">
          {resource.fileType && (
            <span className="flex items-center gap-1 bg-neutral-50 px-2 py-1 rounded-lg border border-neutral-200 font-semibold text-neutral-600">
              <FileText className="w-3 h-3" /> {resource.fileType}
            </span>
          )}
          {resource.fileSize && <span>{resource.fileSize}</span>}
          {resource.pages && <span>{resource.pages} pages</span>}
          {resource.downloads != null && (
            <span className="flex items-center gap-1 ml-auto">
              <Download className="w-3 h-3" /> {resource.downloads}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <a
            href={resource.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="flex-1 inline-flex items-center justify-center gap-2 bg-primary-500
                       text-white text-sm font-semibold py-2.5 rounded-xl
                       hover:bg-primary-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            Télécharger
          </a>
          <Link
            href={`/resources/publications/${resource.slug}`}
            className="w-10 h-10 inline-flex items-center justify-center rounded-xl
                       border border-neutral-200 text-neutral-500 hover:bg-neutral-50
                       hover:border-neutral-300 transition-all flex-shrink-0"
            title="Voir la fiche"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────
   ResourcesClient
────────────────────────────────────────────────────────── */
export default function ResourcesClient({
  resources,
}: {
  resources: Resource[];
}) {
  const [search, setSearch] = useState("");
  const [activeType, setType] = useState<string>("all");
  const [activeCat, setCat] = useState<string>("all");
  const [sortBy, setSort] = useState<"recent" | "popular">("recent");
  const [showFilters, setShowF] = useState(false);

  /* Déduplique les types et catégories */
  const types = useMemo(
    () => [...new Set(resources.map((r) => r.type))],
    [resources],
  );
  const categories = useMemo(
    () => [...new Set(resources.map((r) => r.category))],
    [resources],
  );

  /* Filtrage + tri */
  const filtered = useMemo(() => {
    let result = resources;
    if (activeType !== "all")
      result = result.filter((r) => r.type === activeType);
    if (activeCat !== "all")
      result = result.filter((r) => r.category === activeCat);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    if (sortBy === "recent") {
      result = [...result].sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      );
    } else {
      result = [...result].sort(
        (a, b) => (b.downloads || 0) - (a.downloads || 0),
      );
    }
    return result;
  }, [resources, activeType, activeCat, search, sortBy]);

  const totalDownloads = resources.reduce((s, r) => s + (r.downloads || 0), 0);

  return (
    <div className="py-14 lg:py-20 bg-neutral-50 min-h-screen">
      <div className="container-mrjc">
        {/* Stats globales */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            {
              label: "Documents disponibles",
              value: resources.length,
              icon: FolderOpen,
            },
            {
              label: "Total téléchargements",
              value: `${totalDownloads}+`,
              icon: Download,
            },
            {
              label: "Catégories thématiques",
              value: categories.length,
              icon: Filter,
            },
          ].map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="bg-white rounded-2xl p-5 border border-neutral-100
                                         shadow-xs text-center"
            >
              <Icon className="w-5 h-5 text-primary-500 mx-auto mb-2" />
              <div className="font-display font-bold text-2xl text-neutral-900">
                {value}
              </div>
              <div className="text-xs text-neutral-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Barre de recherche + tri */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un document, un thème..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-neutral-200 rounded-xl
                         text-sm focus:outline-none focus:ring-2 focus:ring-primary-300
                         focus:border-primary-400 transition-all shadow-xs"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center
                                 justify-center rounded-full bg-neutral-200"
              >
                <X className="w-3 h-3 text-neutral-600" />
              </button>
            )}
          </div>

          {/* Tri */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSort(e.target.value as "recent" | "popular")}
              className="appearance-none bg-white border border-neutral-200 rounded-xl px-4 py-3
                         pr-8 text-sm text-neutral-700 focus:outline-none focus:ring-2
                         focus:ring-primary-300 cursor-pointer shadow-xs"
            >
              <option value="recent">Plus récent</option>
              <option value="popular">Plus téléchargé</option>
            </select>
            <ChevronDown
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4
                                    text-neutral-400 pointer-events-none"
            />
          </div>

          <button
            onClick={() => setShowF(!showFilters)}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold",
              "border transition-all shadow-xs",
              showFilters
                ? "bg-primary-500 text-white border-primary-500"
                : "bg-white text-neutral-700 border-neutral-200 hover:border-primary-200",
            )}
          >
            <Filter className="w-4 h-4" />
            Filtres
            {(activeType !== "all" || activeCat !== "all") && (
              <span
                className="bg-secondary-500 text-white text-xs w-5 h-5 rounded-full
                               flex items-center justify-center"
              >
                {Number(activeType !== "all") + Number(activeCat !== "all")}
              </span>
            )}
          </button>
        </div>

        {/* Panneau filtres */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-white rounded-2xl border border-neutral-200 p-5">
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Types */}
                  <div>
                    <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">
                      Type de document
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: "all", label: "Tous" },
                        ...types.map((t) => ({
                          id: t,
                          label: typeConfig[t]?.label || t,
                        })),
                      ].map(({ id, label }) => (
                        <button
                          key={id}
                          onClick={() => setType(id)}
                          className={cn(
                            "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all",
                            activeType === id
                              ? "bg-primary-500 text-white"
                              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200",
                          )}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Catégories */}
                  <div>
                    <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">
                      Thématique
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: "all", label: "Toutes" },
                        ...categories.map((c) => ({
                          id: c,
                          label: categoryLabels[c] || c,
                        })),
                      ].map(({ id, label }) => (
                        <button
                          key={id}
                          onClick={() => setCat(id)}
                          className={cn(
                            "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all",
                            activeCat === id
                              ? "bg-primary-500 text-white"
                              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200",
                          )}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {(activeType !== "all" || activeCat !== "all") && (
                  <div className="mt-4 pt-4 border-t border-neutral-100">
                    <button
                      onClick={() => {
                        setType("all");
                        setCat("all");
                      }}
                      className="text-sm text-red-600 font-semibold hover:text-red-700 transition-colors
                                 flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      Réinitialiser les filtres
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Résultats */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-neutral-500">
            <span className="font-bold text-neutral-800">
              {filtered.length}
            </span>{" "}
            document(s)
            {search && <> pour « {search} »</>}
          </p>
        </div>

        {/* Grille */}
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key={`${activeType}-${activeCat}-${search}-${sortBy}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((resource, i) => (
                <ResourceCard key={resource.id} resource={resource} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 text-neutral-400"
            >
              <FolderOpen className="w-14 h-14 mx-auto mb-4 opacity-40" />
              <p className="text-lg font-semibold text-neutral-500">
                Aucun document trouvé
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setType("all");
                  setCat("all");
                }}
                className="mt-4 btn-outline text-sm"
              >
                Effacer les filtres
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA contact pour ressources */}
        <div
          className="mt-16 bg-primary-50 border border-primary-100 rounded-3xl p-8 lg:p-12
                        flex flex-col lg:flex-row items-center gap-8"
        >
          <div className="flex-1">
            <h3 className="font-display font-bold text-2xl text-neutral-900 mb-2">
              Vous ne trouvez pas ce que vous cherchez ?
            </h3>
            <p className="text-neutral-600">
              Contactez notre équipe pour toute demande de documents
              spécifiques, données de projets, ou informations sur nos
              activités.
            </p>
          </div>
          <Link href="/contact" className="btn-primary flex-shrink-0">
            Contacter l'équipe
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
