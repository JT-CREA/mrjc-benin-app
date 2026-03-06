"use client";

/**
 * Page — Admin Actualités
 * Route: /admin/news
 * Gestion complète des actualités :
 * - Liste filtrée (statut, catégorie, date)
 * - Création / édition inline
 * - Publication / dépublication
 * - Badge "urgent"
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
  AlertTriangle,
  XCircle,
  Newspaper,
  Calendar,
  Tag,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface NewsItem {
  id: string;
  title: string;
  category: string;
  author: string;
  status: "published" | "draft" | "scheduled";
  urgent: boolean;
  views: number;
  publishedAt: string;
  excerpt: string;
}

// ─── Données démo ─────────────────────────────────────────────────────────────
const INITIAL_NEWS: NewsItem[] = [
  {
    id: "n1",
    title: "Lancement du projet PROCASE II dans le département des Collines",
    category: "Projets",
    author: "Jean Biokou",
    status: "published",
    urgent: false,
    views: 1243,
    publishedAt: "2024-03-15",
    excerpt: "MRJC-BÉNIN lance une nouvelle phase...",
  },
  {
    id: "n2",
    title: "Atelier de formation sur les techniques agricoles durables",
    category: "Événements",
    author: "Marie Atchadé",
    status: "published",
    urgent: false,
    views: 876,
    publishedAt: "2024-03-10",
    excerpt: "Plus de 120 agriculteurs réunis...",
  },
  {
    id: "n3",
    title: "ALERTE : Insécurité alimentaire dans la zone sahélienne",
    category: "Alerte",
    author: "Admin",
    status: "published",
    urgent: true,
    views: 2891,
    publishedAt: "2024-03-08",
    excerpt: "Une situation critique appelle...",
  },
  {
    id: "n4",
    title: "Partenariat renforcé avec l'UNICEF pour la nutrition",
    category: "Partenariats",
    author: "Jean Biokou",
    status: "draft",
    urgent: false,
    views: 0,
    publishedAt: "2024-03-20",
    excerpt: "Un accord cadre signé...",
  },
  {
    id: "n5",
    title: "Résultats de l'alphabétisation — Bilan 2023",
    category: "Rapports",
    author: "Marie Atchadé",
    status: "scheduled",
    urgent: false,
    views: 0,
    publishedAt: "2024-03-22",
    excerpt: "Les données de l'année montrent...",
  },
  {
    id: "n6",
    title: "Journée internationale de la femme : MRJC célèbre ses leaders",
    category: "Événements",
    author: "Admin",
    status: "published",
    urgent: false,
    views: 1567,
    publishedAt: "2024-03-06",
    excerpt: "À l'occasion du 8 mars...",
  },
];

const CATEGORIES = [
  "Tous",
  "Projets",
  "Événements",
  "Partenariats",
  "Rapports",
  "Alerte",
];
const STATUS_OPTIONS = ["Tous", "published", "draft", "scheduled"] as const;

const STATUS_LABELS: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  published: {
    label: "Publié",
    color: "bg-emerald-100 text-emerald-700",
    icon: <CheckCircle2 size={11} />,
  },
  draft: {
    label: "Brouillon",
    color: "bg-gray-100 text-gray-600",
    icon: <Clock size={11} />,
  },
  scheduled: {
    label: "Programmé",
    color: "bg-blue-100 text-blue-700",
    icon: <Calendar size={11} />,
  },
};

// ─── Modale de création/édition ───────────────────────────────────────────────
function NewsFormModal({
  item,
  onClose,
  onSave,
}: {
  item: Partial<NewsItem> | null;
  onClose: () => void;
  onSave: (item: NewsItem) => void;
}) {
  const [form, setForm] = useState<Partial<NewsItem>>(
    item || {
      title: "",
      category: "Projets",
      status: "draft",
      urgent: false,
      author: "Admin",
      excerpt: "",
    },
  );

  const handleSave = () => {
    if (!form.title?.trim()) return;
    onSave({
      id: form.id || `n${Date.now()}`,
      title: form.title || "",
      category: form.category || "Projets",
      author: form.author || "Admin",
      status: form.status || "draft",
      urgent: form.urgent || false,
      views: form.views || 0,
      publishedAt: form.publishedAt || new Date().toISOString().split("T")[0],
      excerpt: form.excerpt || "",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 16 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {form.id ? "Modifier l'actualité" : "Nouvelle actualité"}
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
              placeholder="Titre de l'actualité"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Catégorie
              </label>
              <select
                value={form.category || "Projets"}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
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
                value={form.status || "draft"}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    status: e.target.value as NewsItem["status"],
                  }))
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
              >
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
                <option value="scheduled">Programmé</option>
              </select>
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
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Date de publication
              </label>
              <input
                type="date"
                value={form.publishedAt || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, publishedAt: e.target.value }))
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
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
              placeholder="Résumé court de l'actualité..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setForm((f) => ({ ...f, urgent: !f.urgent }))}
              className={`w-10 h-5 rounded-full transition-colors relative ${form.urgent ? "bg-red-500" : "bg-gray-200"}`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.urgent ? "translate-x-5" : "translate-x-0.5"}`}
              />
            </div>
            <span className="text-sm font-medium text-gray-700">
              Marquer comme urgent
            </span>
          </label>
        </div>

        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-colors"
          >
            {form.id ? "Enregistrer" : "Créer l'actualité"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsItem[]>(INITIAL_NEWS);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Tous");
  const [statusFilter, setStatusFilter] = useState<string>("Tous");
  const [modalItem, setModalItem] = useState<Partial<NewsItem> | null | false>(
    false,
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = news.filter((n) => {
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "Tous" || n.category === categoryFilter;
    const matchStatus = statusFilter === "Tous" || n.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  const handleSave = (item: NewsItem) => {
    setNews((prev) => {
      const exists = prev.find((n) => n.id === item.id);
      if (exists) return prev.map((n) => (n.id === item.id ? item : n));
      return [item, ...prev];
    });
    setModalItem(false);
  };

  const handleDelete = (id: string) => {
    setNews((prev) => prev.filter((n) => n.id !== id));
    setDeleteId(null);
  };

  const toggleStatus = (id: string) => {
    setNews((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, status: n.status === "published" ? "draft" : "published" }
          : n,
      ),
    );
  };

  const stats = {
    published: news.filter((n) => n.status === "published").length,
    draft: news.filter((n) => n.status === "draft").length,
    urgent: news.filter((n) => n.urgent).length,
    views: news.reduce((s, n) => s + n.views, 0),
  };

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Actualités
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {news.length} articles au total
          </p>
        </div>
        <button
          onClick={() => setModalItem({})}
          className="inline-flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors"
        >
          <Plus size={16} /> Nouvelle actualité
        </button>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Publiées",
            value: stats.published,
            color: "emerald",
            icon: <CheckCircle2 size={16} />,
          },
          {
            label: "Brouillons",
            value: stats.draft,
            color: "gray",
            icon: <Clock size={16} />,
          },
          {
            label: "Urgentes",
            value: stats.urgent,
            color: "red",
            icon: <AlertTriangle size={16} />,
          },
          {
            label: "Vues totales",
            value: stats.views.toLocaleString(),
            color: "blue",
            icon: <Eye size={16} />,
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
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une actualité..."
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-200 bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-200 bg-white"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s === "Tous" ? "Tous statuts" : STATUS_LABELS[s]?.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3.5">
                  TITRE
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3.5">
                  CATÉGORIE
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3.5">
                  AUTEUR
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3.5">
                  STATUT
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3.5">
                  VUES
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3.5">
                  DATE
                </th>
                <th className="text-right text-xs font-semibold text-gray-500 px-5 py-3.5">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((item, i) => {
                  const statusInfo = STATUS_LABELS[item.status];
                  return (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-5 py-4 max-w-xs">
                        <div className="flex items-center gap-2">
                          {item.urgent && (
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                          )}
                          <span className="text-sm font-medium text-gray-800 truncate">
                            {item.title}
                          </span>
                        </div>
                        {item.urgent && (
                          <span className="text-[10px] text-red-600 font-medium">
                            ● URGENT
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-primary-50 text-primary-700 text-xs font-medium">
                          <Tag size={10} />
                          {item.category}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {item.author}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => toggleStatus(item.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-opacity hover:opacity-70 ${statusInfo?.color}`}
                        >
                          {statusInfo?.icon}
                          {statusInfo?.label}
                        </button>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Eye size={12} className="text-gray-400" />
                          {item.views.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-400">
                        {item.publishedAt}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => window.open(`/news`, "_blank")}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                            title="Voir"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => setModalItem(item)}
                            className="p-1.5 rounded-lg text-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Modifier"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteId(item.id)}
                            className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <Newspaper
                      size={32}
                      className="mx-auto text-gray-300 mb-3"
                    />
                    <p className="text-gray-500 text-sm">
                      Aucune actualité trouvée
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modale création/édition */}
      <AnimatePresence>
        {modalItem !== false && (
          <NewsFormModal
            item={modalItem}
            onClose={() => setModalItem(false)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>

      {/* Confirmation suppression */}
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
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Supprimer l'actualité ?
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                Cette action est irréversible.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-2.5 text-sm font-medium bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  className="flex-1 py-2.5 text-sm font-medium bg-red-600 text-white rounded-xl hover:bg-red-700"
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
