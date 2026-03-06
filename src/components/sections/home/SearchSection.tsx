"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  ArrowRight,
  BookOpen,
  Newspaper,
  FolderKanban,
  FileText,
} from "lucide-react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useRouter } from "next/navigation";

const quickSearchLinks = [
  { label: "Projets en cours", href: "/projects/ongoing", icon: FolderKanban },
  { label: "Dernières actualités", href: "/news", icon: Newspaper },
  { label: "Publications", href: "/resources/publications", icon: BookOpen },
  {
    label: "Fiches techniques",
    href: "/resources/technical-guides",
    icon: FileText,
  },
];

const popularSearches = [
  "manioc",
  "nutrition",
  "alphabétisation",
  "femmes",
  "Atacora",
  "formation",
  "agriculture",
  "santé",
  "leadership",
];

export default function SearchSection() {
  const { ref, isVisible } = useIntersectionObserver<HTMLElement>({
    threshold: 0.15,
  });
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section
      ref={ref}
      className="py-16 bg-neutral-900 text-white"
      aria-labelledby="search-heading"
    >
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div
            className="w-14 h-14 bg-primary-500 rounded-2xl flex items-center
                          justify-center mx-auto mb-6"
          >
            <Search className="w-7 h-7 text-white" />
          </div>

          <h2
            id="search-heading"
            className="font-display text-2xl lg:text-3xl font-bold text-white mb-3"
          >
            Rechercher dans tout le site
          </h2>
          <p className="text-neutral-400 mb-8">
            Projets, articles, ressources, actualités — tout est accessible en
            un clic.
          </p>

          {/* Formulaire de recherche */}
          <form
            onSubmit={handleSearch}
            className="flex gap-3 max-w-xl mx-auto mb-8"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Projet, thème, département..."
                className="w-full pl-11 pr-4 py-3.5 bg-neutral-800 border border-neutral-700
                           rounded-xl text-white placeholder:text-neutral-500
                           focus:outline-none focus:ring-2 focus:ring-primary-500
                           focus:border-primary-500 transition-all text-base"
                aria-label="Recherche globale"
              />
            </div>
            <button
              type="submit"
              className="flex-shrink-0 bg-primary-500 text-white px-6 py-3.5 rounded-xl
                         font-semibold hover:bg-primary-400 transition-colors"
            >
              Chercher
            </button>
          </form>

          {/* Recherches populaires */}
          <div className="mb-10">
            <p className="text-xs text-neutral-500 uppercase tracking-wider mb-3">
              Thèmes populaires
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() =>
                    router.push(`/search?q=${encodeURIComponent(term)}`)
                  }
                  className="px-3 py-1.5 bg-neutral-800 border border-neutral-700 text-neutral-300
                             rounded-full text-sm hover:bg-neutral-700 hover:text-white
                             transition-all duration-200"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Liens rapides */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickSearchLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 15 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.08 }}
                >
                  <Link
                    href={link.href}
                    className="group flex items-center gap-3 p-4 bg-neutral-800 border
                               border-neutral-700 rounded-xl hover:border-primary-600
                               hover:bg-neutral-700 transition-all duration-200"
                  >
                    <Icon className="w-4 h-4 text-primary-400 flex-shrink-0" />
                    <span
                      className="text-sm font-medium text-neutral-300
                                     group-hover:text-white transition-colors truncate"
                    >
                      {link.label}
                    </span>
                    <ArrowRight
                      className="w-3.5 h-3.5 text-neutral-500 ml-auto flex-shrink-0
                                           group-hover:text-primary-400 group-hover:translate-x-0.5
                                           transition-all"
                    />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
