"use client";

/**
 * Page — Admin Blog
 * Route: /admin/blog
 * Gestion complète des articles de blog :
 * - CRUD complet avec éditeur
 * - Gestion tags / catégories
 * - Statistiques de lecture
 * - SEO meta preview
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Eye,
  Edit3,
  Trash2,
  CheckCircle2,
  Clock,
  BookOpen,
  Hash,
  XCircle,
  Star,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface BlogPost {
  id: string;
  title: string;
  category: string;
  author: string;
  status: "published" | "draft";
  featured: boolean;
  readingTime: number;
  views: number;
  publishedAt: string;
  tags: string[];
  excerpt: string;
}

// ─── Données démo ─────────────────────────────────────────────────────────────
const INITIAL_POSTS: BlogPost[] = [
  {
    id: "b1",
    title: "L'agroécologie comme levier de résilience des communautés rurales",
    category: "Agriculture",
    author: "Dr. Komlan Agbevor",
    status: "published",
    featured: true,
    readingTime: 8,
    views: 2341,
    publishedAt: "2024-03-12",
    tags: ["agroécologie", "résilience", "agriculture durable"],
    excerpt:
      "Comment l'adoption des pratiques agroécologiques transforme les exploitations...",
  },
  {
    id: "b2",
    title: "Femmes et leadership rural : défis et opportunités au Bénin",
    category: "Genre",
    author: "Aminata Sow",
    status: "published",
    featured: true,
    readingTime: 12,
    views: 1876,
    publishedAt: "2024-03-05",
    tags: ["genre", "leadership", "autonomisation"],
    excerpt: "Analyse des barrières structurelles et des leviers d'action...",
  },
  {
    id: "b3",
    title: "Réflexions sur l'alphabétisation des adultes en milieu rural",
    category: "Éducation",
    author: "Jean-Baptiste Hounsou",
    status: "published",
    featured: false,
    readingTime: 6,
    views: 987,
    publishedAt: "2024-02-28",
    tags: ["alphabétisation", "éducation", "adultes"],
    excerpt: "Un regard critique sur les méthodes d'alphabétisation...",
  },
  {
    id: "b4",
    title: "Le rôle des OCB dans la gouvernance locale au Bénin",
    category: "Gouvernance",
    author: "Marie Atchadé",
    status: "draft",
    featured: false,
    readingTime: 10,
    views: 0,
    publishedAt: "2024-03-18",
    tags: ["OCB", "gouvernance", "démocratie locale"],
    excerpt: "Les organisations communautaires de base comme acteurs clés...",
  },
  {
    id: "b5",
    title: "Nutrition et développement de l'enfant : ce que la recherche dit",
    category: "Santé",
    author: "Dr. Firmin Ahouansou",
    status: "published",
    featured: false,
    readingTime: 9,
    views: 1543,
    publishedAt: "2024-02-15",
    tags: ["nutrition", "santé", "enfance"],
    excerpt: "Les dernières données scientifiques sur l'impact nutritionnel...",
  },
];

const CATEGORIES = [
  "Tous",
  "Agriculture",
  "Genre",
  "Éducation",
  "Santé",
  "Gouvernance",
  "Environnement",
];

// ─── Modale Blog ──────────────────────────────────────────────────────────────
function BlogFormModal({
  item,
  onClose,
  onSave,
}: {
  item: Partial<BlogPost> | null;
  onClose: () => void;
  onSave: (item: BlogPost) => void;
}) {
  const [form, setForm] = useState<Partial<BlogPost>>(
    item || {
      title: "",
      category: "Agriculture",
      status: "draft",
      featured: false,
      author: "Admin",
      excerpt: "",
      readingTime: 5,
      tags: [],
    },
  );
  const [tagInput, setTagInput] = useState("");

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !form.tags?.includes(tag)) {
      setForm((f) => ({ ...f, tags: [...(f.tags || []), tag] }));
    }
    setTagInput("");
  };

  const removeTag = (t: string) =>
    setForm((f) => ({ ...f, tags: f.tags?.filter((x) => x !== t) }));

  const handleSave = () => {
    if (!form.title?.trim()) return;
    onSave({
      id: form.id || `b${Date.now()}`,
      title: form.title || "",
      category: form.category || "Agriculture",
      author: form.author || "Admin",
      status: form.status || "draft",
      featured: form.featured || false,
      readingTime: form.readingTime || 5,
      views: form.views || 0,
      publishedAt: form.publishedAt || new Date().toISOString().split("T")[0],
      tags: form.tags || [],
      excerpt: form.excerpt || "",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 16 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 my-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {form.id ? "Modifier l'article" : "Nouvel article"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100"
          >
            <XCircle size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Titre *
            </label>
            <input
              type="text"
              value={form.title || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              placeholder="Titre de l'article"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Catégorie
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
              >
                {CATEGORIES.filter((c) => c !== "Tous").map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Statut
              </label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    status: e.target.value as BlogPost["status"],
                  }))
                }
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
              >
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Lecture (min)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={form.readingTime || 5}
                onChange={(e) =>
                  setForm((f) => ({ ...f, readingTime: +e.target.value }))
                }
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Auteur
              </label>
              <input
                type="text"
                value={form.author || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, author: e.target.value }))
                }
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Date
              </label>
              <input
                type="date"
                value={form.publishedAt || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, publishedAt: e.target.value }))
                }
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Extrait
            </label>
            <textarea
              rows={3}
              value={form.excerpt || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, excerpt: e.target.value }))
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Tags
            </label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {(form.tags || []).map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium"
                >
                  <Hash size={10} />
                  {t}
                  <button
                    onClick={() => removeTag(t)}
                    className="ml-1 hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
                placeholder="Ajouter un tag..."
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
              <button
                onClick={addTag}
                className="px-3 py-2 bg-primary-100 text-primary-700 rounded-xl text-sm font-medium hover:bg-primary-200"
              >
                Ajouter
              </button>
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setForm((f) => ({ ...f, featured: !f.featured }))}
              className={`w-10 h-5 rounded-full transition-colors relative ${form.featured ? "bg-amber-400" : "bg-gray-200"}`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.featured ? "translate-x-5" : "translate-x-0.5"}`}
              />
            </div>
            <span className="text-sm font-medium text-gray-700">
              Article mis en avant
            </span>
          </label>
        </div>

        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-xl hover:bg-primary-700"
          >
            {form.id ? "Enregistrer" : "Créer l'article"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(INITIAL_POSTS);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Tous");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalItem, setModalItem] = useState<Partial<BlogPost> | null | false>(
    false,
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = posts.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.author.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "Tous" || p.category === categoryFilter;
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  const handleSave = (item: BlogPost) => {
    setPosts((prev) => {
      const exists = prev.find((p) => p.id === item.id);
      return exists
        ? prev.map((p) => (p.id === item.id ? item : p))
        : [item, ...prev];
    });
    setModalItem(false);
  };

  const stats = {
    published: posts.filter((p) => p.status === "published").length,
    draft: posts.filter((p) => p.status === "draft").length,
    featured: posts.filter((p) => p.featured).length,
    totalViews: posts.reduce((s, p) => s + p.views, 0),
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Blog
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {posts.length} articles au total
          </p>
        </div>
        <button
          onClick={() => setModalItem({})}
          className="inline-flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors"
        >
          <Plus size={16} /> Nouvel article
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Publiés",
            value: stats.published,
            icon: <CheckCircle2 size={16} />,
            color: "emerald",
          },
          {
            label: "Brouillons",
            value: stats.draft,
            icon: <Clock size={16} />,
            color: "gray",
          },
          {
            label: "Mis en avant",
            value: stats.featured,
            icon: <Star size={16} />,
            color: "amber",
          },
          {
            label: "Lectures totales",
            value: stats.totalViews.toLocaleString(),
            icon: <Eye size={16} />,
            color: "blue",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${s.color}-50 text-${s.color}-600`}
            >
              {s.icon}
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary-200"
          >
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary-200"
          >
            <option value="all">Tous statuts</option>
            <option value="published">Publiés</option>
            <option value="draft">Brouillons</option>
          </select>
        </div>
      </div>

      {/* Articles en grille */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        <AnimatePresence>
          {filtered.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-1 bg-primary-50 text-primary-700 rounded-lg text-xs font-medium">
                    {post.category}
                  </span>
                  {post.featured && (
                    <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-medium flex items-center gap-1">
                      <Star size={10} />
                      Mis en avant
                    </span>
                  )}
                </div>
                <span
                  className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    post.status === "published"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {post.status === "published" ? "Publié" : "Brouillon"}
                </span>
              </div>

              <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-2 line-clamp-2">
                {post.title}
              </h3>
              <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                {post.excerpt}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {post.tags.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-[10px]"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-400 mt-auto pt-3 border-t border-gray-50">
                <span>{post.author}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock size={10} />
                  {post.readingTime} min
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Eye size={10} />
                  {post.views.toLocaleString()}
                </span>
              </div>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setModalItem(post)}
                  className="flex-1 py-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
                >
                  <Edit3 size={12} /> Modifier
                </button>
                <button
                  onClick={() => setDeleteId(post.id)}
                  className="py-2 px-3 text-xs font-medium text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="col-span-3 py-16 text-center">
            <BookOpen size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">Aucun article trouvé</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {modalItem !== false && (
          <BlogFormModal
            item={modalItem}
            onClose={() => setModalItem(false)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center"
            >
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={22} className="text-red-500" />
              </div>
              <h3 className="text-lg font-bold mb-4">Supprimer l'article ?</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-2.5 text-sm bg-gray-100 rounded-xl hover:bg-gray-200"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    setPosts((p) => p.filter((x) => x.id !== deleteId));
                    setDeleteId(null);
                  }}
                  className="flex-1 py-2.5 text-sm bg-red-600 text-white rounded-xl hover:bg-red-700"
                >
                  Supprimer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
