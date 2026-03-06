"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Tag,
  X,
  TrendingUp,
} from "lucide-react";
import type { BlogPost } from "@/types/blog.types";
import { cn } from "@/lib/utils/cn";

/* ──────────────────────────────────────────────────────────
   Constants
────────────────────────────────────────────────────────── */
const POSTS_PER_PAGE = 6;

const categoryStyles: Record<string, { bg: string; text: string }> = {
  agriculture: { bg: "bg-primary-100", text: "text-primary-700" },
  sante: { bg: "bg-accent-100", text: "text-accent-700" },
  education: { bg: "bg-secondary-100", text: "text-secondary-700" },
  femmes: { bg: "bg-purple-100", text: "text-purple-700" },
  gouvernance: { bg: "bg-neutral-100", text: "text-neutral-600" },
  partenariat: { bg: "bg-blue-100", text: "text-blue-700" },
  evenement: { bg: "bg-orange-100", text: "text-orange-700" },
  "success-story": { bg: "bg-green-100", text: "text-green-700" },
  analyse: { bg: "bg-indigo-100", text: "text-indigo-700" },
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

/* ──────────────────────────────────────────────────────────
   Helpers
────────────────────────────────────────────────────────── */
function formatDate(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

function getCategoryStyle(cat: string) {
  return (
    categoryStyles[cat] || { bg: "bg-neutral-100", text: "text-neutral-600" }
  );
}

/* ──────────────────────────────────────────────────────────
   PostCard
────────────────────────────────────────────────────────── */
function PostCard({ post, index }: { post: BlogPost; index: number }) {
  const slug =
    post.type === "news" ? `/news/${post.slug}` : `/blog/${post.slug}`;
  const style = getCategoryStyle(post.category);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="group bg-white rounded-2xl border border-neutral-100 overflow-hidden
                 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden flex-shrink-0 bg-neutral-100">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {post.featured && (
          <div className="absolute top-3 left-3">
            <span className="text-xs font-bold bg-secondary-500 text-white px-2.5 py-1 rounded-full">
              ⭐ À la une
            </span>
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center flex-wrap gap-2 mb-3">
          <span
            className={cn(
              "text-xs font-semibold px-2.5 py-1 rounded-full",
              style.bg,
              style.text,
            )}
          >
            {categoryLabels[post.category] || post.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-neutral-400">
            <Calendar className="w-3 h-3" />
            {formatDate(post.publishedAt)}
          </span>
        </div>

        <h2
          className="font-display font-bold text-lg text-neutral-900 leading-snug mb-2
                       group-hover:text-primary-700 transition-colors line-clamp-2"
        >
          {post.title}
        </h2>

        {post.subtitle && (
          <p className="text-xs text-neutral-500 italic mb-2 line-clamp-1">
            {post.subtitle}
          </p>
        )}

        <p className="text-sm text-neutral-500 leading-relaxed line-clamp-3 mb-4 flex-1">
          {post.excerpt}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-2xs text-neutral-400
                                         bg-neutral-50 px-2 py-0.5 rounded-full border border-neutral-200"
              >
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 min-w-0">
            <User className="w-3 h-3 flex-shrink-0" />
            <span className="truncate max-w-[100px]">{post.author.name}</span>
            {post.readingTime && (
              <>
                <span className="text-neutral-300 flex-shrink-0">•</span>
                <Clock className="w-3 h-3 flex-shrink-0" />
                <span className="flex-shrink-0">{post.readingTime} min</span>
              </>
            )}
          </div>
          <Link
            href={slug}
            className="inline-flex items-center gap-1 text-xs font-bold text-primary-600
                           hover:text-primary-700 group/link transition-colors flex-shrink-0"
          >
            Lire
            <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

/* ──────────────────────────────────────────────────────────
   PostCardFeatured  
────────────────────────────────────────────────────────── */
function PostCardFeatured({ post }: { post: BlogPost }) {
  const slug =
    post.type === "news" ? `/news/${post.slug}` : `/blog/${post.slug}`;
  const style = getCategoryStyle(post.category);

  return (
    <Link
      href={slug}
      className="group flex flex-col lg:flex-row bg-white rounded-3xl border border-neutral-100
                     overflow-hidden mb-10 shadow-sm hover:shadow-2xl transition-all duration-300"
    >
      <div className="relative lg:w-1/2 h-64 lg:h-auto bg-neutral-100 flex-shrink-0">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="50vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
        <div className="absolute top-4 left-4">
          <span className="text-xs font-bold bg-secondary-500 text-white px-3 py-1 rounded-full shadow">
            ⭐ Article vedette
          </span>
        </div>
      </div>
      <div className="flex flex-col justify-center p-8 lg:p-12">
        <div className="flex items-center flex-wrap gap-2 mb-4">
          <span
            className={cn(
              "text-xs font-semibold px-2.5 py-1.5 rounded-full",
              style.bg,
              style.text,
            )}
          >
            {categoryLabels[post.category] || post.category}
          </span>
          <span className="text-xs text-neutral-400 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(post.publishedAt)}
          </span>
          {post.readingTime && (
            <span className="text-xs text-neutral-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readingTime} min de lecture
            </span>
          )}
        </div>

        <h2
          className="font-display font-bold text-2xl lg:text-3xl text-neutral-900
                       group-hover:text-primary-700 transition-colors leading-tight mb-3"
        >
          {post.title}
        </h2>
        {post.subtitle && (
          <p className="text-sm font-medium text-neutral-500 italic mb-3">
            {post.subtitle}
          </p>
        )}
        <p className="text-neutral-500 leading-relaxed mb-6 line-clamp-3">
          {post.excerpt}
        </p>

        <div className="flex items-center gap-3">
          {post.author.photo && (
            <Image
              src={post.author.photo}
              alt={post.author.name}
              width={36}
              height={36}
              className="rounded-full object-cover border-2 border-primary-200"
            />
          )}
          <div>
            <p className="text-sm font-semibold text-neutral-800">
              {post.author.name}
            </p>
            {post.author.role && (
              <p className="text-xs text-neutral-500">{post.author.role}</p>
            )}
          </div>
          <div className="ml-auto inline-flex items-center gap-2 text-sm font-bold text-primary-600">
            Lire l'article
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ──────────────────────────────────────────────────────────
   Sidebar
────────────────────────────────────────────────────────── */
function Sidebar({
  posts,
  activeCategory,
  onCategoryChange,
}: {
  posts: BlogPost[];
  activeCategory: string;
  onCategoryChange: (c: string) => void;
}) {
  const categoryCounts = useMemo(() => {
    return posts.reduce<Record<string, number>>((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {});
  }, [posts]);

  const allTags = useMemo(() => {
    const freq: Record<string, number> = {};
    posts.forEach((p) =>
      p.tags?.forEach((t) => {
        freq[t] = (freq[t] || 0) + 1;
      }),
    );
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15);
  }, [posts]);

  const recentPosts = [...posts]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .slice(0, 4);

  return (
    <aside className="space-y-6">
      {/* Catégories */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-6">
        <h3 className="font-display font-bold text-base text-neutral-900 mb-4 flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary-500" /> Catégories
        </h3>
        <ul className="space-y-1.5">
          {[
            { id: "all", label: "Tous les articles", count: posts.length },
            ...Object.entries(categoryCounts).map(([id, count]) => ({
              id,
              label: categoryLabels[id] || id,
              count,
            })),
          ].map((cat) => {
            const active = activeCategory === cat.id;
            return (
              <li key={cat.id}>
                <button
                  onClick={() => onCategoryChange(cat.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm",
                    "transition-all duration-200 font-medium text-left",
                    active
                      ? "bg-primary-500 text-white"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-primary-700",
                  )}
                >
                  <span>{cat.label}</span>
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full font-semibold",
                      active
                        ? "bg-white/20 text-white"
                        : "bg-neutral-100 text-neutral-500",
                    )}
                  >
                    {cat.count}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Articles récents */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-6">
        <h3 className="font-display font-bold text-base text-neutral-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary-500" /> Récents
        </h3>
        <ul className="space-y-4">
          {recentPosts.map((p) => (
            <li key={p.id} className="group flex gap-3">
              <div className="relative w-16 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-neutral-100">
                <Image
                  src={p.coverImage}
                  alt={p.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="64px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/${p.type === "news" ? "news" : "blog"}/${p.slug}`}
                  className="block text-sm font-semibold text-neutral-800 leading-snug
                                 group-hover:text-primary-700 transition-colors line-clamp-2"
                >
                  {p.title}
                </Link>
                <span className="text-xs text-neutral-400 mt-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(p.publishedAt)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Tags */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-6">
        <h3 className="font-display font-bold text-base text-neutral-900 mb-4 flex items-center gap-2">
          <Tag className="w-4 h-4 text-primary-500" /> Tags populaires
        </h3>
        <div className="flex flex-wrap gap-2">
          {allTags.map(([tag, count]) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs
                             bg-neutral-50 text-neutral-600 border border-neutral-200
                             hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200
                             transition-all duration-200 cursor-pointer"
            >
              {tag}
              <span className="text-neutral-400 font-semibold">{count}</span>
            </span>
          ))}
        </div>
      </div>

      {/* CTA Newsletter */}
      <div className="bg-primary-500 rounded-2xl p-6 text-white">
        <h3 className="font-display font-bold text-base mb-2">
          Newsletter MRJC
        </h3>
        <p className="text-primary-200 text-sm leading-relaxed mb-4">
          Recevez nos articles et actualités directement dans votre boite mail.
        </p>
        <Link
          href="/#newsletter"
          className="w-full block text-center bg-secondary-500 text-white py-2.5
                         rounded-xl text-sm font-semibold hover:bg-secondary-400 transition-colors"
        >
          S'abonner gratuitement
        </Link>
      </div>
    </aside>
  );
}

/* ──────────────────────────────────────────────────────────
   Pagination
────────────────────────────────────────────────────────── */
function Pagination({
  page,
  total,
  perPage,
  onPageChange,
}: {
  page: number;
  total: number;
  perPage: number;
  onPageChange: (p: number) => void;
}) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="w-10 h-10 rounded-xl border border-neutral-200 bg-white flex items-center
                   justify-center text-neutral-500 hover:bg-primary-50 hover:border-primary-200
                   disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        aria-label="Page précédente"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={cn(
            "w-10 h-10 rounded-xl text-sm font-semibold transition-all",
            p === page
              ? "bg-primary-500 text-white border border-primary-500"
              : "bg-white border border-neutral-200 text-neutral-600 hover:bg-primary-50 hover:border-primary-200",
          )}
          aria-current={p === page ? "page" : undefined}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="w-10 h-10 rounded-xl border border-neutral-200 bg-white flex items-center
                   justify-center text-neutral-500 hover:bg-primary-50 hover:border-primary-200
                   disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        aria-label="Page suivante"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   BlogClient principal
────────────────────────────────────────────────────────── */
export default function BlogClient({
  initialPosts,
  type,
}: {
  initialPosts: BlogPost[];
  type: "blog" | "news" | "all";
}) {
  const [search, setSearch] = useState("");
  const [activeCategory, setCategory] = useState("all");
  const [page, setPage] = useState(1);

  /* Filtrage */
  const filtered = useMemo(() => {
    let result = initialPosts;
    if (type !== "all") result = result.filter((p) => p.type === type);
    if (activeCategory !== "all")
      result = result.filter((p) => p.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q)),
      );
    }
    return result.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
  }, [initialPosts, type, activeCategory, search]);

  /* Reset page on filter change */
  const handleSearch = (v: string) => {
    setSearch(v);
    setPage(1);
  };
  const handleCategory = (c: string) => {
    setCategory(c);
    setPage(1);
  };

  const featured = filtered.find((p) => p.featured);
  const listPosts = filtered.filter(
    (p) => !p.featured || filtered.indexOf(p) > 0,
  );
  const paged = listPosts.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE,
  );

  return (
    <div className="py-14 lg:py-20 bg-neutral-50 min-h-screen">
      <div className="container-mrjc">
        {/* Barre recherche */}
        <div className="relative mb-10 max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Rechercher un article, une thématique..."
            className="w-full pl-11 pr-10 py-3.5 bg-white border border-neutral-200 rounded-2xl
                       text-sm focus:outline-none focus:ring-2 focus:ring-primary-300
                       focus:border-primary-400 transition-all shadow-sm"
            aria-label="Recherche dans les articles"
          />
          {search && (
            <button
              onClick={() => handleSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center
                               justify-center rounded-full bg-neutral-200 hover:bg-neutral-300 transition-colors"
            >
              <X className="w-3.5 h-3.5 text-neutral-600" />
            </button>
          )}
        </div>

        {/* Résultat recherche */}
        {search && (
          <p className="text-sm text-neutral-500 mb-6">
            <span className="font-semibold text-neutral-800">
              {filtered.length}
            </span>{" "}
            résultat(s) pour « {search} »
          </p>
        )}

        <div className="grid lg:grid-cols-[1fr_300px] gap-10">
          {/* Colonne principale */}
          <main>
            {/* Article vedette */}
            {featured && !search && page === 1 && (
              <PostCardFeatured post={featured} />
            )}

            {/* Grille articles */}
            <AnimatePresence mode="wait">
              {paged.length > 0 ? (
                <motion.div
                  key={`${activeCategory}-${search}-${page}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {paged.map((post, i) => (
                    <PostCard key={post.id} post={post} index={i} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 text-neutral-400"
                >
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-40" />
                  <p className="text-lg font-semibold text-neutral-500">
                    Aucun article trouvé
                  </p>
                  <p className="text-sm mt-2">
                    Modifiez votre recherche ou les filtres.
                  </p>
                  <button
                    onClick={() => {
                      handleSearch("");
                      handleCategory("all");
                    }}
                    className="mt-4 btn-outline text-sm"
                  >
                    Réinitialiser les filtres
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination */}
            <Pagination
              page={page}
              total={listPosts.length}
              perPage={POSTS_PER_PAGE}
              onPageChange={(p) => {
                setPage(p);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </main>

          {/* Sidebar */}
          <Sidebar
            posts={initialPosts}
            activeCategory={activeCategory}
            onCategoryChange={handleCategory}
          />
        </div>
      </div>
    </div>
  );
}
