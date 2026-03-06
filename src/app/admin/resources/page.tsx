"use client";

/**
 * Page — Admin / Ressources  (version complète)
 * Route : /admin/resources
 * ──────────────────────────────────────────────────────────────────────────────
 * 5 onglets de gestion alignés sur la page publique /resources :
 *
 *  1. Publications  — CRUD documents (PDF/DOCX/XLSX/PPTX) + upload + stats
 *  2. Photothèque   — CRUD photos (URL ou upload) + catégorie + légende + localisation
 *  3. Vidéothèque   — CRUD vidéos YouTube (ID ou URL) + catégorie + durée
 *  4. Success Stories — CRUD portraits (bénéficiaire, domaine, impact, citation)
 *  5. Storytelling  — CRUD articles narratifs (titre, extrait, auteur, tag, date)
 */

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  FileText,
  Upload,
  Lock,
  Globe,
  XCircle,
  Camera,
  Play,
  Star,
  Heart,
  Youtube,
  MapPin,
  Calendar,
  Eye,
  Download,
  Quote,
  User,
  Image,
  Link2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Save,
} from "lucide-react";

/* ══════════════════════════════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════════════════════════════ */
type TabId = "publications" | "photos" | "videos" | "success" | "stories";

interface Publication {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  fileType: string;
  fileSize: string;
  downloads: number;
  publishedAt: string;
  isPublic: boolean;
  status: "published" | "draft";
}

interface Photo {
  id: string;
  alt: string;
  src: string;
  category: string;
  location: string;
  year: number;
  desc: string;
  credit: string;
  status: "published" | "draft";
}

interface Video {
  id: string;
  videoId: string;
  title: string;
  caption: string;
  category: string;
  year: number;
  duration: string;
  status: "published" | "draft";
}

interface SuccessStory {
  id: string;
  name: string;
  role: string;
  location: string;
  domain: string;
  year: number;
  portrait: string;
  headline: string;
  story: string;
  quote: string;
  impactValue: string;
  impactLabel: string;
  status: "published" | "draft";
}

interface StoryArticle {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  location: string;
  tag: string;
  coverImage: string;
  status: "published" | "draft";
}

/* ══════════════════════════════════════════════════════════════════════════════
   DONNÉES INITIALES
══════════════════════════════════════════════════════════════════════════════ */
const INIT_PUBLICATIONS: Publication[] = [
  {
    id: "p1",
    title: "Rapport Annuel 2023",
    subtitle: "Bilan des activités et impact",
    category: "Rapports Annuels",
    fileType: "PDF",
    fileSize: "4.2 MB",
    downloads: 487,
    publishedAt: "2024-02-01",
    isPublic: true,
    status: "published",
  },
  {
    id: "p2",
    title: "Guide Nutrition Communautaire",
    subtitle: "Manuel pour agents de santé",
    category: "Guides Techniques",
    fileType: "PDF",
    fileSize: "2.8 MB",
    downloads: 312,
    publishedAt: "2024-01-15",
    isPublic: true,
    status: "published",
  },
  {
    id: "p3",
    title: "Étude Impact Genre 2022",
    subtitle: "Analyse autonomisation des femmes",
    category: "Études & Recherches",
    fileType: "PDF",
    fileSize: "3.1 MB",
    downloads: 176,
    publishedAt: "2023-12-10",
    isPublic: true,
    status: "published",
  },
  {
    id: "p4",
    title: "Bilan Financier 2023",
    subtitle: "Comptes certifiés et rapport d'audit",
    category: "Documents Cadres",
    fileType: "XLSX",
    fileSize: "0.8 MB",
    downloads: 143,
    publishedAt: "2024-03-01",
    isPublic: false,
    status: "published",
  },
  {
    id: "p5",
    title: "Communiqué PROCASE II",
    subtitle: "Résultats mi-parcours du projet",
    category: "Communiqués",
    fileType: "PDF",
    fileSize: "0.4 MB",
    downloads: 89,
    publishedAt: "2024-03-10",
    isPublic: true,
    status: "draft",
  },
];

const INIT_PHOTOS: Photo[] = [
  {
    id: "ph1",
    alt: "Formation agricole — Atacora",
    src: "/assets/images/placeholder.svg",
    category: "Agriculture",
    location: "Atacora",
    year: 2024,
    desc: "Formation compostage avec 45 agriculteurs",
    credit: "MRJC Communication",
    status: "published",
  },
  {
    id: "ph2",
    alt: "Sensibilisation santé maternelle",
    src: "/assets/images/placeholder.svg",
    category: "Santé",
    location: "Zou",
    year: 2024,
    desc: "Vaccination et pesée des enfants",
    credit: "MRJC Communication",
    status: "published",
  },
  {
    id: "ph3",
    alt: "Classe d'alphabétisation",
    src: "/assets/images/placeholder.svg",
    category: "Éducation",
    location: "Borgou",
    year: 2024,
    desc: "120 femmes — langue Bariba",
    credit: "Séraphin Dah",
    status: "published",
  },
  {
    id: "ph4",
    alt: "Groupement féminin — épargne",
    src: "/assets/images/placeholder.svg",
    category: "Femmes",
    location: "Collines",
    year: 2024,
    desc: "Réunion mensuelle FAFEWA",
    credit: "MRJC Communication",
    status: "published",
  },
  {
    id: "ph5",
    alt: "Assemblée générale 2024",
    src: "/assets/images/placeholder.svg",
    category: "Événements",
    location: "Cotonou",
    year: 2024,
    desc: "AG annuelle MRJC-BÉNIN",
    credit: "MRJC Communication",
    status: "draft",
  },
];

const INIT_VIDEOS: Video[] = [
  {
    id: "v1",
    videoId: "gCNeDWCI0vo",
    title: "MRJC-BÉNIN : 38 ans de développement rural",
    caption: "Film institutionnel 2023",
    category: "Institutionnel",
    year: 2023,
    duration: "18 min",
    status: "published",
  },
  {
    id: "v2",
    videoId: "DcGLt0XfLQY",
    title: "Témoignage — Awa Idrissou, agricultrice",
    caption: "Comment MRJC a triplé ses revenus",
    category: "Témoignages",
    year: 2024,
    duration: "7 min",
    status: "published",
  },
  {
    id: "v3",
    videoId: "tL-Mh-s7JLE",
    title: "Alphabétisation des femmes — Borgou",
    caption: "3 600 femmes formées en 2023",
    category: "Terrain",
    year: 2023,
    duration: "15 min",
    status: "published",
  },
];

const INIT_SUCCESS: SuccessStory[] = [
  {
    id: "s1",
    name: "Awa Idrissou",
    role: "Agricultrice, 34 ans",
    location: "Borgou",
    domain: "Agriculture",
    year: 2024,
    portrait: "/assets/images/placeholder.svg",
    headline: "Du champ de survie au label bio : ×3 de revenus",
    story: "Avant MRJC, Awa cultivait 0,5 ha de maïs...",
    quote: "J'ai appris que la terre, c'est un être vivant.",
    impactValue: "×3",
    impactLabel: "revenus annuels",
    status: "published",
  },
  {
    id: "s2",
    name: "Martine Kpossou",
    role: "Animatrice santé, 29 ans",
    location: "Zou",
    domain: "Santé",
    year: 2024,
    portrait: "/assets/images/placeholder.svg",
    headline: "De mère analphabète à relais certifiée",
    story: "Martine a suivi le programme d'alphabétisation santé...",
    quote: "Savoir lire m'a donné la parole.",
    impactValue: "−30%",
    impactLabel: "malnutrition",
    status: "published",
  },
];

const INIT_STORIES: StoryArticle[] = [
  {
    id: "st1",
    title: "Dans les champs de l'Atacora, une révolution silencieuse",
    excerpt: "Le soleil se lève à peine sur les collines de Tanguiéta...",
    author: "Marie-Claire Ogouwale",
    date: "Mars 2024",
    readTime: "8 min",
    location: "Atacora",
    tag: "Agriculture",
    coverImage: "/assets/images/placeholder.svg",
    status: "published",
  },
  {
    id: "st2",
    title: "3 600 femmes apprennent à lire. Le Borgou change.",
    excerpt: "Au fond de la salle de classe de banco de Kandi...",
    author: "Séraphin Dah",
    date: "Février 2024",
    readTime: "6 min",
    location: "Borgou",
    tag: "Éducation",
    coverImage: "/assets/images/placeholder.svg",
    status: "published",
  },
];

/* ══════════════════════════════════════════════════════════════════════════════
   CONSTANTES
══════════════════════════════════════════════════════════════════════════════ */
const PUB_CATEGORIES = [
  "Rapports Annuels",
  "Guides Techniques",
  "Études & Recherches",
  "Documents Cadres",
  "Outils Pédagogiques",
  "Communiqués",
];
const PHOTO_CATS = [
  "Agriculture",
  "Santé",
  "Éducation",
  "Femmes",
  "Terrain",
  "Événements",
];
const VIDEO_CATS = ["Institutionnel", "Terrain", "Témoignages", "Formations"];
const DOMAINS = [
  "Agriculture",
  "Santé",
  "Éducation",
  "Femmes",
  "Jeunesse",
  "Environnement",
];
const STORY_TAGS = [
  "Agriculture",
  "Santé",
  "Éducation",
  "Femmes",
  "Jeunesse",
  "Histoire",
  "Terrain",
];
const FILE_TYPE_COLORS: Record<string, string> = {
  PDF: "bg-red-100 text-red-600",
  DOCX: "bg-blue-100 text-blue-600",
  XLSX: "bg-green-100 text-green-600",
  PPTX: "bg-orange-100 text-orange-600",
};

const TABS: {
  id: TabId;
  label: string;
  icon: React.ElementType;
  color: string;
}[] = [
  {
    id: "publications",
    label: "Publications",
    icon: FileText,
    color: "text-primary-600",
  },
  { id: "photos", label: "Photothèque", icon: Camera, color: "text-blue-600" },
  { id: "videos", label: "Vidéothèque", icon: Youtube, color: "text-red-600" },
  {
    id: "success",
    label: "Success Stories",
    icon: Star,
    color: "text-amber-600",
  },
  { id: "stories", label: "Storytelling", icon: Heart, color: "text-pink-600" },
];

/* ══════════════════════════════════════════════════════════════════════════════
   SOUS-COMPOSANTS : UI partagés
══════════════════════════════════════════════════════════════════════════════ */

function StatusBadge({ status }: { status: "published" | "draft" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold
      ${status === "published" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
    >
      {status === "published" ? (
        <CheckCircle2 size={10} />
      ) : (
        <AlertCircle size={10} />
      )}
      {status === "published" ? "Publié" : "Brouillon"}
    </span>
  );
}

function SearchBar({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative flex-1">
      <Search
        size={14}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl
                   focus:outline-none focus:ring-2 focus:ring-primary-200 bg-white"
      />
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

const INPUT_CLS =
  "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300";
const SELECT_CLS =
  "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-300";
const TEXTAREA_CLS =
  "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none";

function ModalShell({
  title,
  onClose,
  onSave,
  children,
}: {
  title: string;
  onClose: () => void;
  onSave: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-8"
      >
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-400"
          >
            <XCircle size={20} />
          </button>
        </div>
        <div className="px-8 py-6 space-y-5">{children}</div>
        <div className="flex justify-end gap-3 px-8 py-5 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200"
          >
            Annuler
          </button>
          <button
            onClick={onSave}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 inline-flex items-center gap-2"
          >
            <Save size={14} /> Enregistrer
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DeleteConfirm({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center"
      >
        <Trash2 size={32} className="mx-auto text-red-500 mb-4" />
        <h3 className="text-lg font-bold mb-2">Supprimer cet élément ?</h3>
        <p className="text-sm text-gray-500 mb-6">
          Cette action est irréversible.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 text-sm bg-gray-100 rounded-xl font-medium"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 text-sm bg-red-600 text-white rounded-xl font-medium hover:bg-red-700"
          >
            Supprimer
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function StatusToggle({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: "published" | "draft") => void;
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
      {(["draft", "published"] as const).map((s) => (
        <button
          key={s}
          onClick={() => onChange(s)}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all
            ${value === s ? (s === "published" ? "bg-green-600 text-white" : "bg-amber-500 text-white") : "text-gray-500 hover:bg-gray-100"}`}
        >
          {s === "published" ? "✅ Publié" : "📝 Brouillon"}
        </button>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   ONGLET 1 — PUBLICATIONS
══════════════════════════════════════════════════════════════════════════════ */
function PublicationsTab() {
  const [items, setItems] = useState<Publication[]>(INIT_PUBLICATIONS);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("Tous");
  const [modal, setModal] = useState<Partial<Publication> | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Publication>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  const openAdd = () => {
    setForm({
      category: PUB_CATEGORIES[0],
      fileType: "PDF",
      isPublic: true,
      status: "draft",
    });
    setModal({});
  };
  const openEdit = (item: Publication) => {
    setForm(item);
    setModal(item);
  };

  const filtered = items.filter((r) => {
    const q = search.toLowerCase();
    return (
      (r.title.toLowerCase().includes(q) ||
        r.subtitle.toLowerCase().includes(q)) &&
      (catFilter === "Tous" || r.category === catFilter)
    );
  });

  const handleSave = () => {
    if (!form.title?.trim()) return;
    const item: Publication = {
      id: form.id || `pub_${Date.now()}`,
      title: form.title!,
      subtitle: form.subtitle || "",
      category: form.category || PUB_CATEGORIES[0],
      fileType: form.fileType || "PDF",
      fileSize: form.fileSize || "—",
      downloads: form.downloads || 0,
      publishedAt: form.publishedAt || new Date().toISOString().split("T")[0],
      isPublic: form.isPublic ?? true,
      status: form.status || "draft",
    };
    setItems((prev) =>
      prev.find((r) => r.id === item.id)
        ? prev.map((r) => (r.id === item.id ? item : r))
        : [item, ...prev],
    );
    setModal(null);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex gap-3 flex-1">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Rechercher un document..."
          />
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className={`${SELECT_CLS} w-48`}
          >
            {["Tous", ...PUB_CATEGORIES].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <button
          onClick={openAdd}
          className="ml-3 inline-flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-700"
        >
          <Plus size={15} /> Ajouter
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {PUB_CATEGORIES.map((c) => (
          <div
            key={c}
            className="bg-white rounded-xl border border-gray-100 p-3 text-center cursor-pointer hover:border-primary-300 transition-colors"
            onClick={() => setCatFilter(c)}
          >
            <div className="text-xl font-bold text-primary-700">
              {items.filter((r) => r.category === c).length}
            </div>
            <div className="text-[10px] text-gray-500 leading-tight mt-0.5">
              {c
                .replace(" Annuels", "")
                .replace(" Techniques", "")
                .replace(" & Recherches", "")}
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {[
                  "Document",
                  "Catégorie",
                  "Type",
                  "Accès",
                  "Téléch.",
                  "Statut",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3.5"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <motion.tr
                  key={r.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${FILE_TYPE_COLORS[r.fileType] ?? "bg-gray-100 text-gray-600"}`}
                      >
                        {r.fileType}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-800">
                          {r.title}
                        </div>
                        <div className="text-xs text-gray-400">
                          {r.subtitle}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-xs text-gray-600">
                    {r.category}
                  </td>
                  <td className="px-4 py-4 text-xs text-gray-400">
                    {r.fileSize}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${r.isPublic ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                    >
                      {r.isPublic ? <Globe size={10} /> : <Lock size={10} />}{" "}
                      {r.isPublic ? "Public" : "Restreint"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-gray-700 flex items-center gap-1">
                    <Download size={12} className="text-gray-400" />{" "}
                    {r.downloads.toLocaleString()}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit(r)}
                        className="p-1.5 rounded-lg text-blue-400 hover:text-blue-600 hover:bg-blue-50"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteId(r.id)}
                        className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal !== null && (
          <ModalShell
            title={form.id ? "Modifier la publication" : "Nouvelle publication"}
            onClose={() => setModal(null)}
            onSave={handleSave}
          >
            {/* Upload zone */}
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center cursor-pointer hover:border-primary-300 hover:bg-primary-50/30 transition-all"
            >
              <Upload size={24} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-600">
                Déposer le fichier ici ou cliquer
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PDF, DOCX, XLSX, PPTX · Max 50 MB
              </p>
              <input
                ref={fileRef}
                type="file"
                className="hidden"
                accept=".pdf,.docx,.xlsx,.pptx"
              />
            </div>
            <Field label="Titre" required>
              <input
                value={form.title || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                className={INPUT_CLS}
                placeholder="Nom du document"
              />
            </Field>
            <Field label="Description courte">
              <input
                value={form.subtitle || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, subtitle: e.target.value }))
                }
                className={INPUT_CLS}
                placeholder="Sous-titre..."
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Catégorie">
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value }))
                  }
                  className={SELECT_CLS}
                >
                  {PUB_CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Type de fichier">
                <select
                  value={form.fileType}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, fileType: e.target.value }))
                  }
                  className={SELECT_CLS}
                >
                  {["PDF", "DOCX", "XLSX", "PPTX"].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Taille du fichier">
                <input
                  value={form.fileSize || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, fileSize: e.target.value }))
                  }
                  className={INPUT_CLS}
                  placeholder="Ex: 4.2 MB"
                />
              </Field>
              <Field label="Date de publication">
                <input
                  type="date"
                  value={form.publishedAt || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, publishedAt: e.target.value }))
                  }
                  className={INPUT_CLS}
                />
              </Field>
            </div>
            <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 rounded-xl">
              <div
                onClick={() =>
                  setForm((f) => ({ ...f, isPublic: !f.isPublic }))
                }
                className={`w-10 h-5 rounded-full transition-colors relative ${form.isPublic ? "bg-emerald-500" : "bg-gray-200"}`}
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isPublic ? "translate-x-5" : "translate-x-0.5"}`}
                />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Accès public (téléchargeable sans connexion)
              </span>
            </label>
            <Field label="Statut">
              <StatusToggle
                value={form.status || "draft"}
                onChange={(v) => setForm((f) => ({ ...f, status: v }))}
              />
            </Field>
          </ModalShell>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {deleteId && (
          <DeleteConfirm
            onCancel={() => setDeleteId(null)}
            onConfirm={() => {
              setItems((p) => p.filter((r) => r.id !== deleteId));
              setDeleteId(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   ONGLET 2 — PHOTOTHÈQUE
══════════════════════════════════════════════════════════════════════════════ */
function PhotosTab() {
  const [items, setItems] = useState<Photo[]>(INIT_PHOTOS);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("Tous");
  const [modal, setModal] = useState<boolean>(false);
  const [form, setForm] = useState<Partial<Photo>>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openAdd = () => {
    setForm({
      category: PHOTO_CATS[0],
      year: new Date().getFullYear(),
      status: "draft",
    });
    setModal(true);
  };
  const openEdit = (item: Photo) => {
    setForm(item);
    setModal(true);
  };

  const filtered = items.filter((r) => {
    const q = search.toLowerCase();
    return (
      (r.alt.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q)) &&
      (catFilter === "Tous" || r.category === catFilter)
    );
  });

  const handleSave = () => {
    if (!form.alt?.trim()) return;
    const item: Photo = {
      id: form.id || `ph_${Date.now()}`,
      alt: form.alt!,
      src: form.src || "/assets/images/placeholder.svg",
      category: form.category || PHOTO_CATS[0],
      location: form.location || "Bénin",
      year: form.year || new Date().getFullYear(),
      desc: form.desc || "",
      credit: form.credit || "MRJC Communication",
      status: form.status || "draft",
    };
    setItems((prev) =>
      prev.find((r) => r.id === item.id)
        ? prev.map((r) => (r.id === item.id ? item : r))
        : [item, ...prev],
    );
    setModal(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex gap-3 flex-1">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Rechercher une photo..."
          />
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className={`${SELECT_CLS} w-44`}
          >
            {["Tous", ...PHOTO_CATS].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <button
          onClick={openAdd}
          className="ml-3 inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700"
        >
          <Camera size={15} /> Ajouter une photo
        </button>
      </div>

      {/* Grille */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((photo) => (
          <div
            key={photo.id}
            className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-all"
          >
            <div className="relative h-40 bg-gray-100">
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => openEdit(photo)}
                  className="p-2 bg-white rounded-xl text-blue-600 hover:bg-blue-50"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={() => setDeleteId(photo.id)}
                  className="p-2 bg-white rounded-xl text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <span className="absolute top-2 left-2 text-[10px] font-bold bg-white/90 px-2 py-0.5 rounded-full text-gray-700">
                {photo.category}
              </span>
              <span className="absolute top-2 right-2">
                <StatusBadge status={photo.status} />
              </span>
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-gray-800 line-clamp-1">
                {photo.alt}
              </p>
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                <MapPin size={10} /> {photo.location} · {photo.year}
              </p>
              <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                {photo.desc}
              </p>
            </div>
          </div>
        ))}

        {/* Card "Ajouter" */}
        <button
          onClick={openAdd}
          className="flex flex-col items-center justify-center h-56 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl hover:border-blue-300 hover:bg-blue-50/30 transition-all text-gray-400 hover:text-blue-500"
        >
          <Camera size={28} className="mb-2" />
          <span className="text-sm font-medium">Ajouter une photo</span>
        </button>
      </div>

      <AnimatePresence>
        {modal && (
          <ModalShell
            title={form.id ? "Modifier la photo" : "Nouvelle photo"}
            onClose={() => setModal(false)}
            onSave={handleSave}
          >
            {/* Upload / URL */}
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 border-2 border-dashed border-gray-200 rounded-2xl p-5 text-center cursor-pointer hover:border-blue-300 transition-all">
                <Image size={22} className="mx-auto text-gray-400 mb-1.5" />
                <p className="text-sm font-medium text-gray-600">
                  Déposer une image
                </p>
                <p className="text-xs text-gray-400">
                  JPG, PNG, WEBP · Max 10 MB
                </p>
              </div>
            </div>
            <Field label="URL de l'image">
              <input
                value={form.src || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, src: e.target.value }))
                }
                className={INPUT_CLS}
                placeholder="/assets/images/nom-photo.jpg ou https://..."
              />
            </Field>
            <Field label="Légende / Description alt" required>
              <input
                value={form.alt || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, alt: e.target.value }))
                }
                className={INPUT_CLS}
                placeholder="Description concise de la photo"
              />
            </Field>
            <Field label="Description longue">
              <textarea
                value={form.desc || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, desc: e.target.value }))
                }
                className={TEXTAREA_CLS}
                rows={2}
                placeholder="Contexte détaillé de la photo..."
              />
            </Field>
            <div className="grid grid-cols-3 gap-4">
              <Field label="Catégorie">
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value }))
                  }
                  className={SELECT_CLS}
                >
                  {PHOTO_CATS.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Localisation">
                <input
                  value={form.location || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, location: e.target.value }))
                  }
                  className={INPUT_CLS}
                  placeholder="Ex: Atacora"
                />
              </Field>
              <Field label="Année">
                <input
                  type="number"
                  value={form.year || new Date().getFullYear()}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, year: parseInt(e.target.value) }))
                  }
                  className={INPUT_CLS}
                />
              </Field>
            </div>
            <Field label="Crédit photo">
              <input
                value={form.credit || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, credit: e.target.value }))
                }
                className={INPUT_CLS}
                placeholder="Ex: MRJC Communication, Séraphin Dah..."
              />
            </Field>
            <Field label="Statut">
              <StatusToggle
                value={form.status || "draft"}
                onChange={(v) => setForm((f) => ({ ...f, status: v }))}
              />
            </Field>
          </ModalShell>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {deleteId && (
          <DeleteConfirm
            onCancel={() => setDeleteId(null)}
            onConfirm={() => {
              setItems((p) => p.filter((r) => r.id !== deleteId));
              setDeleteId(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   ONGLET 3 — VIDÉOTHÈQUE
══════════════════════════════════════════════════════════════════════════════ */
function VideosTab() {
  const [items, setItems] = useState<Video[]>(INIT_VIDEOS);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("Toutes");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<Partial<Video>>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openAdd = () => {
    setForm({
      category: VIDEO_CATS[0],
      year: new Date().getFullYear(),
      status: "draft",
    });
    setModal(true);
  };
  const openEdit = (item: Video) => {
    setForm(item);
    setModal(true);
  };

  /* Extraire l'ID YouTube depuis une URL ou ID brut */
  const parseYouTubeId = (input: string): string => {
    const match = input.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?\/\s]+)/,
    );
    return match ? match[1] : input.trim();
  };

  const filtered = items.filter((r) => {
    const q = search.toLowerCase();
    return (
      (r.title.toLowerCase().includes(q) ||
        r.caption.toLowerCase().includes(q)) &&
      (catFilter === "Toutes" || r.category === catFilter)
    );
  });

  const handleSave = () => {
    if (!form.title?.trim() || !form.videoId?.trim()) return;
    const item: Video = {
      id: form.id || `vid_${Date.now()}`,
      videoId: parseYouTubeId(form.videoId!),
      title: form.title!,
      caption: form.caption || "",
      category: form.category || VIDEO_CATS[0],
      year: form.year || new Date().getFullYear(),
      duration: form.duration || "—",
      status: form.status || "draft",
    };
    setItems((prev) =>
      prev.find((r) => r.id === item.id)
        ? prev.map((r) => (r.id === item.id ? item : r))
        : [item, ...prev],
    );
    setModal(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex gap-3 flex-1">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Rechercher une vidéo..."
          />
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className={`${SELECT_CLS} w-44`}
          >
            {["Toutes", ...VIDEO_CATS].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <button
          onClick={openAdd}
          className="ml-3 inline-flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-700"
        >
          <Youtube size={15} /> Ajouter une vidéo
        </button>
      </div>

      {/* Cards vidéos */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((video) => (
          <div
            key={video.id}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-all group"
          >
            {/* Thumbnail YouTube */}
            <div className="relative h-44 bg-gray-900 overflow-hidden">
              <img
                src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                alt={video.title}
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/assets/images/placeholder.svg";
                }}
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                  <Play size={18} className="text-white fill-white ml-1" />
                </div>
              </div>
              <div className="absolute top-2 right-2 flex gap-1.5">
                <StatusBadge status={video.status} />
              </div>
              <span className="absolute bottom-2 right-2 text-xs font-bold bg-black/70 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                <Clock size={9} /> {video.duration}
              </span>
            </div>
            <div className="p-4">
              <span className="text-[10px] font-bold text-red-600 flex items-center gap-1 mb-1.5">
                <Youtube size={10} /> {video.category} · {video.year}
              </span>
              <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1">
                {video.title}
              </h3>
              <p className="text-xs text-gray-400 line-clamp-1 mb-3">
                {video.caption}
              </p>
              <div className="flex items-center justify-between">
                <code className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded font-mono">
                  {video.videoId}
                </code>
                <div className="flex gap-1">
                  <a
                    href={`https://youtube.com/watch?v=${video.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                  >
                    <Eye size={14} />
                  </a>
                  <button
                    onClick={() => openEdit(video)}
                    className="p-1.5 text-blue-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteId(video.id)}
                    className="p-1.5 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Card ajouter */}
        <button
          onClick={openAdd}
          className="flex flex-col items-center justify-center h-56 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl hover:border-red-300 hover:bg-red-50/30 transition-all text-gray-400 hover:text-red-500"
        >
          <Youtube size={28} className="mb-2" />
          <span className="text-sm font-medium">Ajouter une vidéo YouTube</span>
        </button>
      </div>

      <AnimatePresence>
        {modal && (
          <ModalShell
            title={form.id ? "Modifier la vidéo" : "Nouvelle vidéo YouTube"}
            onClose={() => setModal(false)}
            onSave={handleSave}
          >
            <Field label="ID ou URL YouTube" required>
              <input
                value={form.videoId || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, videoId: e.target.value }))
                }
                className={INPUT_CLS}
                placeholder="https://youtube.com/watch?v=XXXXXXXXXXX ou juste l'ID"
              />
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                <Link2 size={10} /> L'ID sera extrait automatiquement depuis une
                URL YouTube complète.
              </p>
            </Field>

            {/* Aperçu thumbnail si ID renseigné */}
            {form.videoId && (
              <div className="relative h-32 rounded-xl overflow-hidden bg-gray-900">
                <img
                  src={`https://img.youtube.com/vi/${parseYouTubeId(form.videoId)}/hqdefault.jpg`}
                  className="w-full h-full object-cover"
                  alt="Aperçu thumbnail"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <p className="text-white text-xs font-medium">
                    Aperçu thumbnail YouTube
                  </p>
                </div>
              </div>
            )}

            <Field label="Titre" required>
              <input
                value={form.title || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                className={INPUT_CLS}
                placeholder="Titre de la vidéo"
              />
            </Field>
            <Field label="Sous-titre / Légende">
              <input
                value={form.caption || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, caption: e.target.value }))
                }
                className={INPUT_CLS}
                placeholder="Courte description de la vidéo"
              />
            </Field>
            <div className="grid grid-cols-3 gap-4">
              <Field label="Catégorie">
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value }))
                  }
                  className={SELECT_CLS}
                >
                  {VIDEO_CATS.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Année">
                <input
                  type="number"
                  value={form.year || new Date().getFullYear()}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, year: parseInt(e.target.value) }))
                  }
                  className={INPUT_CLS}
                />
              </Field>
              <Field label="Durée">
                <input
                  value={form.duration || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, duration: e.target.value }))
                  }
                  className={INPUT_CLS}
                  placeholder="Ex: 12 min"
                />
              </Field>
            </div>
            <Field label="Statut">
              <StatusToggle
                value={form.status || "draft"}
                onChange={(v) => setForm((f) => ({ ...f, status: v }))}
              />
            </Field>
          </ModalShell>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {deleteId && (
          <DeleteConfirm
            onCancel={() => setDeleteId(null)}
            onConfirm={() => {
              setItems((p) => p.filter((r) => r.id !== deleteId));
              setDeleteId(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   ONGLET 4 — SUCCESS STORIES
══════════════════════════════════════════════════════════════════════════════ */
function SuccessTab() {
  const [items, setItems] = useState<SuccessStory[]>(INIT_SUCCESS);
  const [search, setSearch] = useState("");
  const [domainFilter, setDomainFilter] = useState("Tous");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<Partial<SuccessStory>>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openAdd = () => {
    setForm({
      domain: DOMAINS[0],
      year: new Date().getFullYear(),
      portrait: "/assets/images/placeholder.svg",
      status: "draft",
    });
    setModal(true);
  };
  const openEdit = (item: SuccessStory) => {
    setForm(item);
    setModal(true);
  };

  const filtered = items.filter((r) => {
    const q = search.toLowerCase();
    return (
      (r.name.toLowerCase().includes(q) ||
        r.headline.toLowerCase().includes(q)) &&
      (domainFilter === "Tous" || r.domain === domainFilter)
    );
  });

  const handleSave = () => {
    if (!form.name?.trim() || !form.headline?.trim()) return;
    const item: SuccessStory = {
      id: form.id || `ss_${Date.now()}`,
      name: form.name!,
      role: form.role || "",
      location: form.location || "",
      domain: form.domain || DOMAINS[0],
      year: form.year || new Date().getFullYear(),
      portrait: form.portrait || "/assets/images/placeholder.svg",
      headline: form.headline!,
      story: form.story || "",
      quote: form.quote || "",
      impactValue: form.impactValue || "—",
      impactLabel: form.impactLabel || "",
      status: form.status || "draft",
    };
    setItems((prev) =>
      prev.find((r) => r.id === item.id)
        ? prev.map((r) => (r.id === item.id ? item : r))
        : [item, ...prev],
    );
    setModal(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex gap-3 flex-1">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Rechercher une histoire..."
          />
          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            className={`${SELECT_CLS} w-40`}
          >
            {["Tous", ...DOMAINS].map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
        <button
          onClick={openAdd}
          className="ml-3 inline-flex items-center gap-2 bg-amber-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-amber-600"
        >
          <Star size={15} /> Ajouter une histoire
        </button>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 gap-5">
        {filtered.map((story) => (
          <div
            key={story.id}
            className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src={story.portrait}
                  alt={story.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-sm text-gray-900">
                      {story.name}
                    </p>
                    <p className="text-xs text-gray-500">{story.role}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[10px] font-semibold bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
                        {story.domain}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        <MapPin size={9} className="inline" /> {story.location}{" "}
                        · {story.year}
                      </span>
                    </div>
                  </div>
                  <div className="text-center bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 flex-shrink-0">
                    <p className="text-lg font-black text-amber-600">
                      {story.impactValue}
                    </p>
                    <p className="text-[9px] text-amber-500 leading-tight">
                      {story.impactLabel}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-800 mt-3 line-clamp-2">
              {story.headline}
            </p>
            <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 italic flex gap-1">
              <Quote
                size={10}
                className="text-primary-400 flex-shrink-0 mt-0.5"
              />{" "}
              {story.quote}
            </p>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
              <StatusBadge status={story.status} />
              <div className="flex gap-1">
                <button
                  onClick={() => openEdit(story)}
                  className="p-1.5 text-blue-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={() => setDeleteId(story.id)}
                  className="p-1.5 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={openAdd}
          className="flex flex-col items-center justify-center min-h-44 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl hover:border-amber-300 hover:bg-amber-50/30 transition-all text-gray-400 hover:text-amber-500"
        >
          <Star size={28} className="mb-2" />
          <span className="text-sm font-medium">Ajouter une Success Story</span>
        </button>
      </div>

      <AnimatePresence>
        {modal && (
          <ModalShell
            title={
              form.id ? "Modifier la Success Story" : "Nouvelle Success Story"
            }
            onClose={() => setModal(false)}
            onSave={handleSave}
          >
            <div className="grid grid-cols-2 gap-4">
              <Field label="Nom complet" required>
                <input
                  value={form.name || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className={INPUT_CLS}
                  placeholder="Prénom Nom"
                />
              </Field>
              <Field label="Rôle / Titre">
                <input
                  value={form.role || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, role: e.target.value }))
                  }
                  className={INPUT_CLS}
                  placeholder="Ex: Agricultrice, 34 ans"
                />
              </Field>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Field label="Domaine">
                <select
                  value={form.domain}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, domain: e.target.value }))
                  }
                  className={SELECT_CLS}
                >
                  {DOMAINS.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </Field>
              <Field label="Localisation">
                <input
                  value={form.location || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, location: e.target.value }))
                  }
                  className={INPUT_CLS}
                  placeholder="Ex: Borgou"
                />
              </Field>
              <Field label="Année">
                <input
                  type="number"
                  value={form.year || new Date().getFullYear()}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, year: parseInt(e.target.value) }))
                  }
                  className={INPUT_CLS}
                />
              </Field>
            </div>
            <Field label="URL Portrait (photo de la personne)">
              <input
                value={form.portrait || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, portrait: e.target.value }))
                }
                className={INPUT_CLS}
                placeholder="/assets/images/portrait-nom.jpg"
              />
            </Field>
            <Field label="Titre accrocheur" required>
              <input
                value={form.headline || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, headline: e.target.value }))
                }
                className={INPUT_CLS}
                placeholder="Ex: ×3 de revenus en 2 ans grâce à l'agro-écologie"
              />
            </Field>
            <Field label="Récit (texte de présentation)">
              <textarea
                value={form.story || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, story: e.target.value }))
                }
                className={TEXTAREA_CLS}
                rows={4}
                placeholder="Racontez l'histoire de cette personne avant/pendant/après..."
              />
            </Field>
            <Field label="Citation directe de la personne">
              <input
                value={form.quote || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, quote: e.target.value }))
                }
                className={INPUT_CLS}
                placeholder="Ex: J'ai appris que la terre, c'est un être vivant."
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Valeur d'impact (chiffre)">
                <input
                  value={form.impactValue || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, impactValue: e.target.value }))
                  }
                  className={INPUT_CLS}
                  placeholder="Ex: ×3 ou −30% ou 248"
                />
              </Field>
              <Field label="Libellé de l'impact">
                <input
                  value={form.impactLabel || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, impactLabel: e.target.value }))
                  }
                  className={INPUT_CLS}
                  placeholder="Ex: revenus annuels"
                />
              </Field>
            </div>
            <Field label="Statut">
              <StatusToggle
                value={form.status || "draft"}
                onChange={(v) => setForm((f) => ({ ...f, status: v }))}
              />
            </Field>
          </ModalShell>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {deleteId && (
          <DeleteConfirm
            onCancel={() => setDeleteId(null)}
            onConfirm={() => {
              setItems((p) => p.filter((r) => r.id !== deleteId));
              setDeleteId(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   ONGLET 5 — STORYTELLING
══════════════════════════════════════════════════════════════════════════════ */
function StoriesTab() {
  const [items, setItems] = useState<StoryArticle[]>(INIT_STORIES);
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("Tous");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<Partial<StoryArticle>>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openAdd = () => {
    setForm({
      tag: STORY_TAGS[0],
      coverImage: "/assets/images/placeholder.svg",
      status: "draft",
    });
    setModal(true);
  };
  const openEdit = (item: StoryArticle) => {
    setForm(item);
    setModal(true);
  };

  const filtered = items.filter((r) => {
    const q = search.toLowerCase();
    return (
      (r.title.toLowerCase().includes(q) ||
        r.author.toLowerCase().includes(q)) &&
      (tagFilter === "Tous" || r.tag === tagFilter)
    );
  });

  const handleSave = () => {
    if (!form.title?.trim()) return;
    const item: StoryArticle = {
      id: form.id || `st_${Date.now()}`,
      title: form.title!,
      excerpt: form.excerpt || "",
      author: form.author || "",
      date: form.date || "",
      readTime: form.readTime || "5 min",
      location: form.location || "",
      tag: form.tag || STORY_TAGS[0],
      coverImage: form.coverImage || "/assets/images/placeholder.svg",
      status: form.status || "draft",
    };
    setItems((prev) =>
      prev.find((r) => r.id === item.id)
        ? prev.map((r) => (r.id === item.id ? item : r))
        : [item, ...prev],
    );
    setModal(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex gap-3 flex-1">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Rechercher un article..."
          />
          <select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className={`${SELECT_CLS} w-40`}
          >
            {["Tous", ...STORY_TAGS].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <button
          onClick={openAdd}
          className="ml-3 inline-flex items-center gap-2 bg-pink-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-pink-700"
        >
          <Heart size={15} /> Ajouter un récit
        </button>
      </div>

      {/* Liste articles */}
      <div className="space-y-3">
        {filtered.map((article) => (
          <div
            key={article.id}
            className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-5 hover:shadow-md transition-all"
          >
            <div className="w-24 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full">
                      {article.tag}
                    </span>
                    <StatusBadge status={article.status} />
                  </div>
                  <h3 className="text-sm font-bold text-gray-800 line-clamp-1">
                    {article.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                    {article.excerpt}
                  </p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => openEdit(article)}
                    className="p-1.5 text-blue-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteId(article.id)}
                    className="p-1.5 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-400">
                <span className="flex items-center gap-1">
                  <User size={9} /> {article.author}
                </span>
                <span>
                  <Calendar size={9} className="inline" /> {article.date}
                </span>
                <span>
                  <Eye size={9} className="inline" /> {article.readTime}
                </span>
                <span>
                  <MapPin size={9} className="inline" /> {article.location}
                </span>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={openAdd}
          className="flex items-center justify-center gap-3 w-full py-8 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl hover:border-pink-300 hover:bg-pink-50/30 transition-all text-gray-400 hover:text-pink-500"
        >
          <Heart size={20} />
          <span className="text-sm font-medium">
            Ajouter un récit de terrain
          </span>
        </button>
      </div>

      <AnimatePresence>
        {modal && (
          <ModalShell
            title={form.id ? "Modifier le récit" : "Nouveau récit de terrain"}
            onClose={() => setModal(false)}
            onSave={handleSave}
          >
            <Field label="Titre de l'article" required>
              <input
                value={form.title || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                className={INPUT_CLS}
                placeholder="Titre accrocheur et descriptif"
              />
            </Field>
            <Field label="Extrait / Chapeau">
              <textarea
                value={form.excerpt || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, excerpt: e.target.value }))
                }
                className={TEXTAREA_CLS}
                rows={3}
                placeholder="Premier paragraphe de l'article, ton immersif..."
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Auteur(e)">
                <input
                  value={form.author || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, author: e.target.value }))
                  }
                  className={INPUT_CLS}
                  placeholder="Prénom Nom, Rédaction MRJC..."
                />
              </Field>
              <Field label="Date de publication">
                <input
                  value={form.date || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, date: e.target.value }))
                  }
                  className={INPUT_CLS}
                  placeholder="Ex: Mars 2024"
                />
              </Field>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Field label="Thème / Tag">
                <select
                  value={form.tag}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, tag: e.target.value }))
                  }
                  className={SELECT_CLS}
                >
                  {STORY_TAGS.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </Field>
              <Field label="Localisation">
                <input
                  value={form.location || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, location: e.target.value }))
                  }
                  className={INPUT_CLS}
                  placeholder="Ex: Atacora"
                />
              </Field>
              <Field label="Temps de lecture">
                <input
                  value={form.readTime || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, readTime: e.target.value }))
                  }
                  className={INPUT_CLS}
                  placeholder="Ex: 8 min"
                />
              </Field>
            </div>
            <Field label="Image de couverture (URL)">
              <input
                value={form.coverImage || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, coverImage: e.target.value }))
                }
                className={INPUT_CLS}
                placeholder="/assets/images/nom-image.jpg"
              />
            </Field>
            <Field label="Statut">
              <StatusToggle
                value={form.status || "draft"}
                onChange={(v) => setForm((f) => ({ ...f, status: v }))}
              />
            </Field>
          </ModalShell>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {deleteId && (
          <DeleteConfirm
            onCancel={() => setDeleteId(null)}
            onConfirm={() => {
              setItems((p) => p.filter((r) => r.id !== deleteId));
              setDeleteId(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   PAGE PRINCIPALE
══════════════════════════════════════════════════════════════════════════════ */
export default function AdminResourcesPage() {
  const [activeTab, setActiveTab] = useState<TabId>("publications");

  const counts: Record<TabId, number> = {
    publications: INIT_PUBLICATIONS.length,
    photos: INIT_PHOTOS.length,
    videos: INIT_VIDEOS.length,
    success: INIT_SUCCESS.length,
    stories: INIT_STORIES.length,
  };

  return (
    <div className="p-6 space-y-6 min-h-screen">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Ressources Multimédia
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestion centralisée des 5 rubriques de la page publique /resources
          </p>
        </div>
        <a
          href="/resources"
          target="_blank"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 border border-gray-200 hover:border-primary-300 rounded-xl px-4 py-2 transition-all"
        >
          <Eye size={14} /> Voir la page publique
        </a>
      </div>

      {/* Navigation onglets */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-6 py-4 text-sm font-semibold whitespace-nowrap
                            border-b-2 transition-all duration-200 flex-shrink-0
                            ${
                              active
                                ? `border-primary-600 text-primary-700 bg-primary-50/50`
                                : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                            }`}
              >
                <Icon
                  size={15}
                  className={active ? tab.color : "text-gray-400"}
                />
                {tab.label}
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full
                  ${active ? "bg-primary-100 text-primary-700" : "bg-gray-100 text-gray-500"}`}
                >
                  {counts[tab.id]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenu de l'onglet actif */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {activeTab === "publications" && <PublicationsTab />}
          {activeTab === "photos" && <PhotosTab />}
          {activeTab === "videos" && <VideosTab />}
          {activeTab === "success" && <SuccessTab />}
          {activeTab === "stories" && <StoriesTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
