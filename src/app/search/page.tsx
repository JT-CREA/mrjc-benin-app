"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  FolderKanban,
  Newspaper,
  Filter,
  X,
  ArrowRight,
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import Fuse from "fuse.js";
import PageHeader from "@/components/layout/PageHeader";
import allProjects from "@/data/projects.json";
import allPosts from "@/data/blog-posts.json";
import type { Project } from "@/types/project.types";
import type { BlogPost } from "@/types/blog.types";
import { cn } from "@/lib/utils/cn";

/* ─────────────────────────────────────────────────────────────
   Index de recherche fusionnée
───────────────────────────────────────────────────────────── */
type SearchResult = {
  type: "project" | "post";
  id: string;
  title: string;
  excerpt: string;
  image: string;
  href: string;
  category?: string;
  status?: string;
};

function buildIndex(): SearchResult[] {
  const projectItems: SearchResult[] = (allProjects as Project[]).map((p) => ({
    type: "project",
    id: p.id,
    title: p.title,
    excerpt: p.excerpt,
    image: p.coverImage,
    href: `/projects/${p.slug}`,
    category: p.domain,
    status: p.status,
  }));

  const postItems: SearchResult[] = (allPosts as BlogPost[]).map((p) => ({
    type: "post",
    id: p.id,
    title: p.title,
    excerpt: p.excerpt,
    image: p.coverImage,
    href: `/${p.type === "news" ? "news" : "blog"}/${p.slug}`,
    category: p.category,
  }));

  return [...projectItems, ...postItems];
}

const fuseOptions = {
  keys: ["title", "excerpt"],
  threshold: 0.35,
  includeScore: true,
  minMatchCharLength: 2,
};

/* ─────────────────────────────────────────────────────────────
   Résultat individuel
───────────────────────────────────────────────────────────── */
function ResultCard({ item, index }: { item: SearchResult; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link
        href={item.href}
        className="group flex items-start gap-4 p-5 bg-white rounded-2xl border
                   border-neutral-100 hover:border-primary-200 hover:shadow-md
                   transition-all duration-200"
      >
        {/* Vignette */}
        <div className="relative w-24 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-neutral-100">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="96px"
          />
        </div>

        {/* Contenu */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            {item.type === "project" ? (
              <span
                className="inline-flex items-center gap-1 text-xs font-semibold
                               bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full"
              >
                <FolderKanban className="w-3 h-3" /> Projet
              </span>
            ) : (
              <span
                className="inline-flex items-center gap-1 text-xs font-semibold
                               bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-full"
              >
                <Newspaper className="w-3 h-3" /> Publication
              </span>
            )}
          </div>
          <h3
            className="font-bold text-neutral-900 leading-snug text-base
                         group-hover:text-primary-700 transition-colors line-clamp-1"
          >
            {item.title}
          </h3>
          <p className="text-sm text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
            {item.excerpt}
          </p>
        </div>

        <ArrowRight
          className="w-4 h-4 text-neutral-300 flex-shrink-0 self-center
                                group-hover:text-primary-500 group-hover:translate-x-0.5
                                transition-all mt-1"
        />
      </Link>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Logique recherche
───────────────────────────────────────────────────────────── */
function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [typeFilter, setTypeFilter] = useState<"all" | "project" | "post">(
    "all",
  );

  const index = useMemo(() => buildIndex(), []);
  const fuse = useMemo(() => new Fuse(index, fuseOptions), [index]);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setQuery(q);
  }, [searchParams]);

  const results = useMemo(() => {
    if (!query.trim() || query.trim().length < 2) return [];
    const raw = fuse.search(query.trim());
    return raw
      .map((r) => r.item)
      .filter((r) => typeFilter === "all" || r.type === typeFilter);
  }, [fuse, query, typeFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim())
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="container-mrjc py-12 lg:py-16">
      {/* Barre recherche */}
      <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-10">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher projets, actualités, ressources…"
              autoFocus
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-neutral-200
                         rounded-xl text-base focus:outline-none focus:border-primary-500
                         text-neutral-900 placeholder:text-neutral-400 transition-colors"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  router.push("/search");
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button type="submit" className="btn-primary px-6 flex-shrink-0">
            Chercher
          </button>
        </div>
      </form>

      {/* Filtres */}
      {query.trim() && (
        <div className="flex items-center gap-2 mb-6">
          <Filter className="w-4 h-4 text-neutral-500" />
          <span className="text-sm text-neutral-500">Filtrer :</span>
          {[
            { id: "all", label: "Tout" },
            { id: "project", label: "Projets" },
            { id: "post", label: "Publications" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setTypeFilter(f.id as typeof typeFilter)}
              className={cn(
                "px-4 py-1.5 rounded-xl text-sm font-semibold transition-all",
                typeFilter === f.id
                  ? "bg-primary-500 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* Résultats */}
      {!query.trim() ? (
        <div className="text-center py-20">
          <Search className="w-16 h-16 text-neutral-200 mx-auto mb-4" />
          <h2 className="font-display font-bold text-2xl text-neutral-700 mb-2">
            Que recherchez-vous ?
          </h2>
          <p className="text-neutral-400">
            Tapez au moins 2 caractères pour lancer la recherche.
          </p>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="font-display font-bold text-2xl text-neutral-800 mb-2">
            Aucun résultat pour « {query} »
          </h2>
          <p className="text-neutral-500 mb-6">
            Essayez avec d'autres mots-clés ou consultez nos rubriques
            directement.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/projects" className="btn-outline text-sm">
              Tous les projets
            </Link>
            <Link href="/news" className="btn-outline text-sm">
              Actualités
            </Link>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm text-neutral-500 mb-5">
            <strong className="text-neutral-900">
              {results.length} résultat{results.length > 1 ? "s" : ""}
            </strong>{" "}
            pour « {query} »
          </p>
          <div className="space-y-3 max-w-3xl mx-auto">
            {results.map((item, i) => (
              <ResultCard key={item.id} item={item} index={i} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <>
      <PageHeader
        tag="Recherche"
        title="Recherche globale"
        subtitle="Trouvez rapidement un projet, une actualité, une ressource ou une publication."
        breadcrumbs={[{ label: "Recherche" }]}
        size="sm"
      />
      <div className="bg-neutral-50 min-h-screen">
        <Suspense
          fallback={
            <div className="container-mrjc py-20 text-center text-neutral-400">
              Chargement de la recherche…
            </div>
          }
        >
          <SearchResults />
        </Suspense>
      </div>
    </>
  );
}
