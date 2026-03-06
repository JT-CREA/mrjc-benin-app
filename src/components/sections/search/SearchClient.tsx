"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  FolderOpen,
  BookOpen,
  FileText,
  ArrowRight,
  Calendar,
  Tag,
  Filter,
} from "lucide-react";
import Fuse from "fuse.js";
import type { BlogPost } from "@/types/blog.types";
import type { Resource } from "@/types/resource.types";
import { cn } from "@/lib/utils/cn";

/* ─────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────── */
type ResultType = "project" | "post" | "resource";

interface SearchResult {
  id: string;
  type: ResultType;
  title: string;
  excerpt: string;
  image?: string;
  href: string;
  date?: string;
  tags?: string[];
  category?: string;
  score?: number;
}

/* ─────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────── */
function formatDate(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

const typeConfig: Record<
  ResultType,
  { label: string; icon: React.ElementType; color: string }
> = {
  project: {
    label: "Projet",
    icon: FolderOpen,
    color: "bg-primary-100 text-primary-700",
  },
  post: {
    label: "Article",
    icon: BookOpen,
    color: "bg-accent-100 text-accent-700",
  },
  resource: {
    label: "Ressource",
    icon: FileText,
    color: "bg-secondary-100 text-secondary-700",
  },
};

/* ─────────────────────────────────────────────────────────
   Carte résultat
───────────────────────────────────────────────────────── */
function ResultCard({
  result,
  index,
}: {
  result: SearchResult;
  index: number;
}) {
  const config = typeConfig[result.type];
  const Icon = config.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
    >
      <Link
        href={result.href}
        className="group flex gap-4 bg-white border border-neutral-100 rounded-2xl p-4
                       hover:shadow-md hover:border-primary-200 transition-all duration-200"
      >
        {/* Vignette */}
        {result.image && (
          <div className="relative w-20 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-neutral-100">
            <Image
              src={result.image}
              alt={result.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="80px"
            />
          </div>
        )}

        {/* Contenu */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span
              className={cn(
                "inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full",
                config.color,
              )}
            >
              <Icon className="w-3 h-3" />
              {config.label}
            </span>
            {result.category && (
              <span className="text-xs text-neutral-400">
                {result.category}
              </span>
            )}
            {result.date && (
              <span className="text-xs text-neutral-400 flex items-center gap-1 ml-auto">
                <Calendar className="w-3 h-3" />
                {formatDate(result.date)}
              </span>
            )}
          </div>

          <h3
            className="font-semibold text-sm text-neutral-900 leading-snug
                         group-hover:text-primary-700 transition-colors line-clamp-1 mb-1"
          >
            {result.title}
          </h3>

          <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2">
            {result.excerpt}
          </p>

          {result.tags && result.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {result.tags.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-0.5 text-2xs
                                          text-neutral-400 bg-neutral-50 px-1.5 py-0.5 rounded-full"
                >
                  <Tag className="w-2 h-2" />
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        <ArrowRight
          className="w-4 h-4 text-neutral-300 flex-shrink-0 self-center
                               group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all"
        />
      </Link>
    </motion.article>
  );
}

/* ─────────────────────────────────────────────────────────
   SearchClient
───────────────────────────────────────────────────────── */
export default function SearchClient({
  initialQuery,
  posts,
  projects,
  resources,
}: {
  initialQuery: string;
  posts: BlogPost[];
  projects: any[];
  resources: Resource[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [filter, setFilter] = useState<ResultType | "all">("all");

  /* Construire le corpus de recherche */
  const corpus = useMemo((): SearchResult[] => {
    const results: SearchResult[] = [];

    projects.forEach((p) =>
      results.push({
        id: p.id,
        type: "project",
        title: p.title,
        excerpt: p.excerpt || p.description?.slice(0, 120) || "",
        image: p.coverImage,
        href: `/projects/${p.slug}`,
        date: p.startDate,
        tags: p.tags || [],
        category: p.domain,
      }),
    );

    posts.forEach((p) =>
      results.push({
        id: p.id,
        type: "post",
        title: p.title,
        excerpt: p.excerpt,
        image: p.coverImage,
        href: `/${p.type === "news" ? "news" : "blog"}/${p.slug}`,
        date: p.publishedAt,
        tags: p.tags || [],
        category: p.category,
      }),
    );

    resources.forEach((r) =>
      results.push({
        id: r.id,
        type: "resource",
        title: r.title,
        excerpt: r.description,
        image: r.coverImage,
        href: `/resources/publications/${r.slug}`,
        date: r.publishedAt,
        tags: r.tags || [],
        category: r.type,
      }),
    );

    return results;
  }, [posts, projects, resources]);

  /* Fuse.js config */
  const fuse = useMemo(
    () =>
      new Fuse(corpus, {
        keys: [
          { name: "title", weight: 0.5 },
          { name: "excerpt", weight: 0.25 },
          { name: "tags", weight: 0.15 },
          { name: "category", weight: 0.1 },
        ],
        threshold: 0.35,
        includeScore: true,
        minMatchCharLength: 2,
      }),
    [corpus],
  );

  /* Résultats */
  const results = useMemo((): SearchResult[] => {
    if (!query.trim()) return [];
    const fuseResults = fuse.search(query);
    let items = fuseResults.map((r) => ({ ...r.item, score: r.score }));
    if (filter !== "all") items = items.filter((r) => r.type === filter);
    return items;
  }, [query, filter, fuse]);

  /* Sync URL */
  useEffect(() => {
    const url = query ? `/search?q=${encodeURIComponent(query)}` : "/search";
    router.replace(url, { scroll: false });
  }, [query, router]);

  const counts = useMemo(
    () => ({
      all: results.length,
      project: results.filter((r) => r.type === "project").length,
      post: results.filter((r) => r.type === "post").length,
      resource: results.filter((r) => r.type === "resource").length,
    }),
    [results],
  );

  return (
    <div className="py-12 lg:py-20 bg-neutral-50 min-h-screen">
      <div className="container-narrow">
        {/* Barre recherche */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un projet, un article, une ressource..."
            className="w-full pl-12 pr-12 py-4 bg-white border-2 border-neutral-200
                       rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-primary-300
                       focus:border-primary-400 transition-all shadow-sm"
            autoFocus
            aria-label="Recherche globale"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center
                               justify-center rounded-full bg-neutral-200 hover:bg-neutral-300
                               transition-colors"
            >
              <X className="w-4 h-4 text-neutral-600" />
            </button>
          )}
        </div>

        {/* Filtres type */}
        {query && results.length > 0 && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <Filter className="w-4 h-4 text-neutral-400 flex-shrink-0" />
            {(
              [
                { id: "all", label: "Tout", count: counts.all },
                { id: "project", label: "Projets", count: counts.project },
                { id: "post", label: "Articles", count: counts.post },
                { id: "resource", label: "Ressources", count: counts.resource },
              ] as { id: ResultType | "all"; label: string; count: number }[]
            ).map(({ id, label, count }) =>
              count > 0 || id === "all" ? (
                <button
                  key={id}
                  onClick={() => setFilter(id)}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs",
                    "font-semibold transition-all duration-200",
                    filter === id
                      ? "bg-primary-500 text-white"
                      : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50",
                  )}
                >
                  {label}
                  <span
                    className={cn(
                      "text-xs px-1.5 py-0.5 rounded-full",
                      filter === id
                        ? "bg-white/20"
                        : "bg-neutral-100 text-neutral-500",
                    )}
                  >
                    {count}
                  </span>
                </button>
              ) : null,
            )}
          </div>
        )}

        {/* Résultats */}
        <AnimatePresence mode="wait">
          {!query ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Search className="w-14 h-14 text-neutral-200 mx-auto mb-5" />
              <h2 className="font-display font-bold text-xl text-neutral-800 mb-2">
                Que recherchez-vous ?
              </h2>
              <p className="text-neutral-500 text-sm">
                Tapez des mots-clés pour trouver des projets, articles ou
                ressources.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {[
                  "agriculture",
                  "nutrition",
                  "femmes",
                  "alphabétisation",
                  "Atacora",
                ].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 bg-white border border-neutral-200 rounded-full
                                     text-sm text-neutral-600 hover:bg-primary-50
                                     hover:border-primary-200 hover:text-primary-700 transition-all"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : results.length === 0 ? (
            <motion.div
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-neutral-400 text-5xl mb-5">🔍</p>
              <h2 className="font-display font-bold text-xl text-neutral-800 mb-2">
                Aucun résultat pour « {query} »
              </h2>
              <p className="text-neutral-500 text-sm mb-4">
                Essayez avec d'autres mots-clés ou vérifiez l'orthographe.
              </p>
              <button
                onClick={() => setQuery("")}
                className="btn-outline text-sm"
              >
                Effacer la recherche
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-sm text-neutral-500 mb-5">
                <span className="font-bold text-neutral-800">
                  {results.length}
                </span>{" "}
                résultat(s) pour « {query} »
              </p>
              <div className="space-y-3">
                {results.map((result, i) => (
                  <ResultCard key={result.id} result={result} index={i} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
