"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, User, ArrowRight, Zap } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import blogPosts from "@/data/blog-posts.json";
import { type BlogPost } from "@/types/blog.types";
import { cn } from "@/lib/utils/cn";

/* ─────────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────────── */
function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

const categoryStyles: Record<string, string> = {
  agriculture: "bg-primary-50 text-primary-700",
  sante: "bg-accent-50 text-accent-700",
  education: "bg-secondary-50 text-secondary-700",
  femmes: "bg-purple-50 text-purple-700",
  gouvernance: "bg-neutral-100 text-neutral-700",
  partenariat: "bg-blue-50 text-blue-700",
  evenement: "bg-orange-50 text-orange-700",
  "success-story": "bg-green-50 text-green-700",
  analyse: "bg-indigo-50 text-indigo-700",
};

const categoryLabels: Record<string, string> = {
  agriculture: "Agriculture",
  sante: "Santé",
  education: "Éducation",
  femmes: "Femmes",
  gouvernance: "Gouvernance",
  partenariat: "Partenariat",
  evenement: "Événement",
  "success-story": "Success Story",
  analyse: "Analyse",
};

/* ─────────────────────────────────────────────────────────────
   Carte Post — Grande (hero)
───────────────────────────────────────────────────────────── */
function PostCardLarge({
  post,
  isVisible,
}: {
  post: BlogPost;
  isVisible: boolean;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, x: -30 }}
      animate={isVisible ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="card group overflow-hidden flex flex-col md:flex-row h-full"
    >
      {/* Image */}
      <div className="relative md:w-2/5 h-56 md:h-auto overflow-hidden bg-neutral-100 flex-shrink-0">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 40vw"
        />
        {post.urgent && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 badge badge-hot">
              <Zap className="w-3 h-3" /> Urgent
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span
            className={cn(
              "text-xs font-semibold px-2.5 py-1 rounded-full",
              post.type === "news"
                ? "bg-white/90 text-neutral-700"
                : "bg-primary-600 text-white",
            )}
          >
            {post.type === "news" ? "📰 Actualité" : "✍️ Blog"}
          </span>
        </div>
      </div>

      {/* Contenu */}
      <div className="flex flex-col p-6 flex-1">
        {/* Catégorie + date */}
        <div className="flex items-center flex-wrap gap-2 mb-3">
          <span
            className={cn(
              "text-xs font-semibold px-2.5 py-1 rounded-full",
              categoryStyles[post.category] ||
                "bg-neutral-100 text-neutral-600",
            )}
          >
            {categoryLabels[post.category] || post.category}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-neutral-400">
            <Calendar className="w-3 h-3" />
            {formatDate(post.publishedAt)}
          </span>
        </div>

        {/* Titre */}
        <h3
          className="font-display font-bold text-xl text-neutral-900 leading-snug mb-2
                       group-hover:text-primary-700 transition-colors line-clamp-2"
        >
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-neutral-500 leading-relaxed line-clamp-3 mb-4 flex-1">
          {post.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <User className="w-3.5 h-3.5" />
            <span className="truncate max-w-[120px]">{post.author.name}</span>
            {post.readingTime && (
              <>
                <span className="text-neutral-300">•</span>
                <Clock className="w-3.5 h-3.5" />
                <span>{post.readingTime} min</span>
              </>
            )}
          </div>
          <Link
            href={`/${post.type === "news" ? "news" : "blog"}/${post.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold
                       text-primary-600 hover:text-primary-700 group/link transition-colors"
          >
            Lire
            <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

/* ─────────────────────────────────────────────────────────────
   Carte Post — Petite (liste)
───────────────────────────────────────────────────────────── */
function PostCardSmall({
  post,
  index,
  isVisible,
}: {
  post: BlogPost;
  index: number;
  isVisible: boolean;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, x: 20 }}
      animate={isVisible ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      className="group flex items-start gap-4 p-4 bg-white rounded-xl border border-neutral-100
                 hover:border-primary-200 hover:shadow-sm transition-all duration-200"
    >
      {/* Vignette */}
      <div className="relative w-20 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-neutral-100">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="80px"
        />
      </div>

      {/* Contenu */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={cn(
              "text-2xs font-semibold px-2 py-0.5 rounded-full",
              categoryStyles[post.category] ||
                "bg-neutral-100 text-neutral-600",
            )}
          >
            {categoryLabels[post.category] || post.category}
          </span>
          {post.urgent && (
            <span className="text-2xs font-bold text-red-600 flex items-center gap-0.5">
              <Zap className="w-2.5 h-2.5" /> Urgent
            </span>
          )}
        </div>
        <Link
          href={`/${post.type === "news" ? "news" : "blog"}/${post.slug}`}
          className="block text-sm font-bold text-neutral-800 leading-snug
                     group-hover:text-primary-700 transition-colors line-clamp-2"
        >
          {post.title}
        </Link>
        <div className="flex items-center gap-2 mt-1.5 text-xs text-neutral-400">
          <Calendar className="w-3 h-3" />
          {formatDate(post.publishedAt)}
        </div>
      </div>
    </motion.article>
  );
}

/* ─────────────────────────────────────────────────────────────
   Section principale
───────────────────────────────────────────────────────────── */
type FilterType = "all" | "news" | "blog";

export default function LatestNewsSection() {
  const { ref, isVisible } = useIntersectionObserver<HTMLElement>({
    threshold: 0.05,
  });
  const [activeType, setActiveType] = useState<FilterType>("all");

  const allPosts = blogPosts as BlogPost[];
  const filtered =
    activeType === "all"
      ? allPosts
      : allPosts.filter((p) => p.type === activeType);

  const featured = filtered[0];
  const rest = filtered.slice(1, 5);

  return (
    <section
      ref={ref}
      className="py-20 lg:py-28 bg-white"
      aria-labelledby="news-heading"
    >
      <div className="container-mrjc">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
        >
          <div>
            <div className="section-tag justify-start">
              Publications & Actualités
            </div>
            <h2
              id="news-heading"
              className="font-display text-3xl lg:text-4xl font-bold text-neutral-900 mt-2"
            >
              Nos Dernières Publications
            </h2>
          </div>

          {/* Filtres type */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {[
              { id: "all", label: "Tout" },
              { id: "news", label: "📰 Actualités" },
              { id: "blog", label: "✍️ Blog" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveType(f.id as FilterType)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200",
                  activeType === f.id
                    ? "bg-primary-500 text-white shadow-sm"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Layout principal */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeType}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid lg:grid-cols-2 gap-8"
          >
            {/* Article principal */}
            {featured && (
              <div className="lg:row-span-2">
                <PostCardLarge post={featured} isVisible={isVisible} />
              </div>
            )}

            {/* Liste des autres */}
            <div className="space-y-3">
              {rest.map((post, index) => (
                <PostCardSmall
                  key={post.id}
                  post={post}
                  index={index}
                  isVisible={isVisible}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link href="/news" className="btn-outline">
            Toutes les actualités
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/blog" className="btn-ghost">
            Explorer le blog
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
