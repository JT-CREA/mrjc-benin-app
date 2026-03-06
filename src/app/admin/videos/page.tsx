"use client";

/**
 * Page — Admin / Vidéothèque
 * Route : /admin/videos
 * ─────────────────────────────────────────────────────────────────────────────
 * CRUD complet pour la gestion des vidéos YouTube de MRJC-BÉNIN :
 *  • Liste avec thumbnails YouTube en temps réel
 *  • Ajout/Édition via modale : ID YouTube, titre, description, catégorie,
 *    durée, localisation, année, tags, épinglée, statut publié/brouillon
 *  • Preview thumbnail YouTube live dans le formulaire
 *  • Suppression avec confirmation
 *  • Filtres : catégorie + statut + recherche texte
 *  • Statistiques par catégorie
 *  • Tri par épinglé > date > titre
 */

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Youtube,
  Play,
  Star,
  MapPin,
  Calendar,
  Clock,
  Tag,
  Eye,
  ExternalLink,
  X,
  Save,
  CheckCircle2,
  AlertCircle,
  Globe,
  Lock,
  BarChart3,
  Link2,
  Tv,
} from "lucide-react";

/* ══════════════════════════════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════════════════════════════ */
type VideoCategory =
  | "Institutionnel"
  | "Terrain"
  | "Témoignages"
  | "Formations"
  | "Reportages";
type VideoStatus = "published" | "draft";

interface Video {
  id: string;
  videoId: string; // ID YouTube (ex: gCNeDWCI0vo)
  title: string;
  description: string;
  caption: string; // Sous-titre court (affiché dans la grille publique)
  category: VideoCategory;
  year: number;
  duration: string; // ex: "18 min"
  location: string;
  tags: string[];
  featured: boolean; // Épinglée (vidéo à la une)
  status: VideoStatus;
  createdAt: string;
  updatedAt: string;
}

/* ══════════════════════════════════════════════════════════════════════════════
   DONNÉES INITIALES
══════════════════════════════════════════════════════════════════════════════ */
const INIT_VIDEOS: Video[] = [
  {
    id: "v01",
    videoId: "gCNeDWCI0vo",
    title: "MRJC-BÉNIN : 38 ans de développement rural",
    description:
      "Film institutionnel 2023. Vue d'ensemble de nos programmes, partenaires et impact sur les communautés rurales du Bénin depuis 1986.",
    caption:
      "Film institutionnel 2023 — Vue d'ensemble de nos programmes et de notre impact.",
    category: "Institutionnel",
    year: 2023,
    duration: "18 min",
    location: "National",
    tags: ["NGO", "Bénin", "Impact"],
    featured: true,
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "v02",
    videoId: "PdFa8LiOatM",
    title: "Prix National Excellence ONG 2023",
    description:
      "Cérémonie de remise du Prix National d'Excellence ONG décerné par le Gouvernement béninois à MRJC-BÉNIN.",
    caption:
      "Cérémonie de remise du Prix National décerné par le Gouvernement béninois.",
    category: "Institutionnel",
    year: 2023,
    duration: "5 min",
    location: "Cotonou",
    tags: ["Prix", "Reconnaissance", "Gouvernement"],
    featured: false,
    status: "published",
    createdAt: "2024-01-20",
    updatedAt: "2024-01-20",
  },
  {
    id: "v03",
    videoId: "7YHZFmV1iqQ",
    title: "Partenariat AFD — Filières agricoles Atacora",
    description:
      "Présentation du programme manioc-igname cofinancé par l'AFD à 850 millions FCFA.",
    caption: "Présentation du programme manioc-igname cofinancé à 850 M FCFA.",
    category: "Institutionnel",
    year: 2023,
    duration: "8 min",
    location: "Atacora",
    tags: ["AFD", "Partenariat", "Agriculture"],
    featured: false,
    status: "published",
    createdAt: "2024-02-01",
    updatedAt: "2024-02-01",
  },
  {
    id: "v04",
    videoId: "tL-Mh-s7JLE",
    title: "Alphabétisation des femmes — Programme Borgou",
    description:
      "3 600 femmes formées en 2023. Reportage dans les villages du Nord-Bénin.",
    caption: "3 600 femmes formées en 2023 dans le département du Borgou.",
    category: "Terrain",
    year: 2023,
    duration: "15 min",
    location: "Borgou",
    tags: ["Femmes", "Alphabétisation", "Borgou"],
    featured: false,
    status: "published",
    createdAt: "2024-02-10",
    updatedAt: "2024-02-10",
  },
  {
    id: "v05",
    videoId: "BHmkE7-ANKU",
    title: "Mission de terrain — Santé & Nutrition, Mono",
    description:
      "Mission de suivi des programmes Santé & Nutrition. Vaccination, pesée enfants et sensibilisation nutritionnelle.",
    caption:
      "Reportage de la mission de suivi des programmes Santé & Nutrition.",
    category: "Terrain",
    year: 2024,
    duration: "9 min",
    location: "Mono",
    tags: ["Santé", "Nutrition", "Mono"],
    featured: false,
    status: "published",
    createdAt: "2024-03-05",
    updatedAt: "2024-03-05",
  },
  {
    id: "v06",
    videoId: "DcGLt0XfLQY",
    title: "Témoignage — Awa Idrissou, agricultrice, Borgou",
    description:
      "Comment la formation MRJC a triplé le revenu de son exploitation en 18 mois.",
    caption:
      "Comment la formation MRJC a triplé le revenu de son exploitation.",
    category: "Témoignages",
    year: 2024,
    duration: "7 min",
    location: "Borgou",
    tags: ["Femmes", "Agriculture", "Impact"],
    featured: false,
    status: "published",
    createdAt: "2024-03-15",
    updatedAt: "2024-03-15",
  },
  {
    id: "v07",
    videoId: "Qw0BFhGSSUI",
    title: "Autonomisation des femmes — Groupement FAFEWA",
    description:
      "Comment 38 femmes de Savalou ont créé leur caisse de crédit avec l'accompagnement MRJC.",
    caption:
      "38 femmes créent leur propre caisse de crédit et financement mutuel.",
    category: "Témoignages",
    year: 2024,
    duration: "11 min",
    location: "Collines",
    tags: ["Femmes", "Finance", "Collines"],
    featured: false,
    status: "published",
    createdAt: "2024-03-22",
    updatedAt: "2024-03-22",
  },
  {
    id: "v08",
    videoId: "aSBtcHdSBjI",
    title: "Agriculture durable — Techniques agro-écologiques",
    description:
      "Formation en compostage, maraîchage raisonné et rotation des cultures. 45 agriculteurs de l'Atacora.",
    caption: "Formation en compostage et maraîchage raisonné, Atacora 2024.",
    category: "Formations",
    year: 2024,
    duration: "12 min",
    location: "Atacora",
    tags: ["Agriculture", "Atacora", "Formation"],
    featured: false,
    status: "draft",
    createdAt: "2024-04-01",
    updatedAt: "2024-04-01",
  },
  {
    id: "v09",
    videoId: "fLeJJPxua3E",
    title: "Formation des agents de terrain — Méthode REFLECT",
    description:
      "Séminaire annuel des 45 agents de terrain. Renforcement des compétences en animation communautaire.",
    caption:
      "Séminaire annuel des 45 agents — méthode REFLECT et alphabétisation fonctionnelle.",
    category: "Formations",
    year: 2024,
    duration: "20 min",
    location: "Cotonou",
    tags: ["REFLECT", "Agents", "Formation"],
    featured: false,
    status: "draft",
    createdAt: "2024-04-10",
    updatedAt: "2024-04-10",
  },
  {
    id: "v10",
    videoId: "J7GY1Xg6X20",
    title: "Reportage : Les champs de l'espoir — Atacora",
    description:
      "Grand reportage immersif. 4 jours avec les agriculteurs de MRJC pendant la saison des pluies.",
    caption: "Grand reportage immersif dans les champs du Nord-Bénin.",
    category: "Reportages",
    year: 2024,
    duration: "28 min",
    location: "Atacora",
    tags: ["Agriculture", "Atacora", "Immersif"],
    featured: false,
    status: "published",
    createdAt: "2024-04-20",
    updatedAt: "2024-04-20",
  },
];

const CATEGORIES: VideoCategory[] = [
  "Institutionnel",
  "Terrain",
  "Témoignages",
  "Formations",
  "Reportages",
];
const YEARS = [2024, 2023, 2022, 2021];

/* ══════════════════════════════════════════════════════════════════════════════
   STYLES CONSTANTS
══════════════════════════════════════════════════════════════════════════════ */
const CAT_COLORS: Record<VideoCategory, { pill: string; dot: string }> = {
  Institutionnel: {
    pill: "bg-primary-100 text-primary-700",
    dot: "bg-primary-500",
  },
  Terrain: { pill: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  Témoignages: { pill: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
  Formations: { pill: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
  Reportages: { pill: "bg-purple-100 text-purple-700", dot: "bg-purple-500" },
};

const INPUT_CLS = `w-full px-3.5 py-2.5 text-sm border border-neutral-200 rounded-xl
  bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400
  placeholder-neutral-400 transition-shadow`;

const TEXTAREA_CLS = `w-full px-3.5 py-2.5 text-sm border border-neutral-200 rounded-xl
  bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400
  placeholder-neutral-400 transition-shadow resize-none`;

/* ══════════════════════════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════════════════════════ */
function extractVideoId(input: string): string {
  // Accepte l'ID seul (11 chars) ou une URL YouTube complète
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/,
    /^([A-Za-z0-9_-]{11})$/,
  ];
  for (const p of patterns) {
    const m = input.match(p);
    if (m) return m[1];
  }
  return input.trim();
}

function newId(): string {
  return `v${Date.now().toString(36)}`;
}

function today(): string {
  return new Date().toISOString().split("T")[0];
}

/* ══════════════════════════════════════════════════════════════════════════════
   SOUS-COMPOSANTS UI
══════════════════════════════════════════════════════════════════════════════ */
function StatusBadge({ status }: { status: VideoStatus }) {
  return status === "published" ? (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
      <CheckCircle2 size={10} /> Publié
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
      <AlertCircle size={10} /> Brouillon
    </span>
  );
}

function CategoryPill({ category }: { category: VideoCategory }) {
  const c = CAT_COLORS[category];
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${c.pill}`}
    >
      <Tag size={9} /> {category}
    </span>
  );
}

/* ── Preview YouTube thumbnail ── */
function YoutubeThumbnail({
  videoId,
  size = "md",
}: {
  videoId: string;
  size?: "sm" | "md" | "lg";
}) {
  const [err, setErr] = useState(false);
  const [quality, setQuality] = useState<"maxresdefault" | "hqdefault">(
    "maxresdefault",
  );

  if (!videoId)
    return (
      <div
        className={`bg-neutral-100 rounded-xl flex items-center justify-center
      ${size === "sm" ? "h-16" : size === "md" ? "h-28" : "h-44"}`}
      >
        <Youtube size={size === "sm" ? 20 : 28} className="text-neutral-300" />
      </div>
    );

  return (
    <div
      className={`relative rounded-xl overflow-hidden bg-neutral-900
      ${size === "sm" ? "h-16" : size === "md" ? "h-28" : "h-44"}`}
    >
      {!err ? (
        <>
          <img
            src={`https://img.youtube.com/vi/${videoId}/${quality}.jpg`}
            alt="Aperçu YouTube"
            className="w-full h-full object-cover"
            onError={() => {
              if (quality === "maxresdefault") setQuality("hqdefault");
              else setErr(true);
            }}
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
              <Play size={12} className="text-white fill-white ml-0.5" />
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full text-neutral-400 flex-col gap-1">
          <Youtube size={20} />
          <span className="text-[10px]">ID invalide</span>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   FORMULAIRE VIDÉO (Modale Add / Edit)
══════════════════════════════════════════════════════════════════════════════ */
type VideoFormData = Omit<Video, "id" | "createdAt" | "updatedAt">;

const EMPTY_FORM: VideoFormData = {
  videoId: "",
  title: "",
  description: "",
  caption: "",
  category: "Institutionnel",
  year: new Date().getFullYear(),
  duration: "",
  location: "",
  tags: [],
  featured: false,
  status: "draft",
};

interface VideoFormProps {
  initial?: Video | null;
  onSave: (data: VideoFormData) => void;
  onClose: () => void;
}

function VideoForm({ initial, onSave, onClose }: VideoFormProps) {
  const [form, setForm] = useState<VideoFormData>(initial ?? EMPTY_FORM);
  const [tagInput, setTagInput] = useState("");
  const [rawUrl, setRawUrl] = useState(initial?.videoId ?? "");

  const set = useCallback(
    <K extends keyof VideoFormData>(k: K, v: VideoFormData[K]) =>
      setForm((f) => ({ ...f, [k]: v })),
    [],
  );

  const handleUrlChange = (val: string) => {
    setRawUrl(val);
    set("videoId", extractVideoId(val));
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) {
      set("tags", [...form.tags, t]);
    }
    setTagInput("");
  };

  const removeTag = (t: string) =>
    set(
      "tags",
      form.tags.filter((x) => x !== t),
    );

  const canSave = form.videoId.length >= 5 && form.title.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl my-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center">
              <Youtube size={18} className="text-red-600" />
            </div>
            <div>
              <h2 className="font-bold text-neutral-900">
                {initial ? "Modifier la vidéo" : "Ajouter une vidéo"}
              </h2>
              <p className="text-xs text-neutral-400">Vidéothèque MRJC-BÉNIN</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-neutral-100 text-neutral-400 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 grid md:grid-cols-[1fr_220px] gap-8">
          {/* ── Colonne gauche : champs ── */}
          <div className="space-y-5">
            {/* ID / URL YouTube */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wide">
                ID ou URL YouTube <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Link2
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  value={rawUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="gCNeDWCI0vo  ou  https://youtu.be/gCNeDWCI0vo"
                  className={INPUT_CLS + " pl-9"}
                />
              </div>
              {form.videoId && (
                <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">
                  <CheckCircle2 size={10} /> ID extrait :{" "}
                  <code className="font-mono font-bold">{form.videoId}</code>
                </p>
              )}
            </div>

            {/* Titre */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wide">
                Titre <span className="text-red-500">*</span>
              </label>
              <input
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Titre complet de la vidéo"
                className={INPUT_CLS}
              />
            </div>

            {/* Sous-titre (caption) */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wide">
                Sous-titre court{" "}
                <span className="text-neutral-400">
                  (affiché dans la grille)
                </span>
              </label>
              <input
                value={form.caption}
                onChange={(e) => set("caption", e.target.value)}
                placeholder="Une phrase de description courte…"
                className={INPUT_CLS}
              />
            </div>

            {/* Description longue */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wide">
                Description longue
              </label>
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={3}
                placeholder="Description détaillée affichée dans la modale lecteur…"
                className={TEXTAREA_CLS}
              />
            </div>

            {/* Catégorie + Année + Durée */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wide">
                  Catégorie
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    set("category", e.target.value as VideoCategory)
                  }
                  className={INPUT_CLS}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wide">
                  Année
                </label>
                <select
                  value={form.year}
                  onChange={(e) => set("year", Number(e.target.value))}
                  className={INPUT_CLS}
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wide">
                  Durée
                </label>
                <input
                  value={form.duration}
                  onChange={(e) => set("duration", e.target.value)}
                  placeholder="12 min"
                  className={INPUT_CLS}
                />
              </div>
            </div>

            {/* Localisation */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wide">
                Localisation
              </label>
              <div className="relative">
                <MapPin
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  value={form.location}
                  onChange={(e) => set("location", e.target.value)}
                  placeholder="Atacora, Borgou, Cotonou, National…"
                  className={INPUT_CLS + " pl-9"}
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wide">
                Tags
              </label>
              <div className="flex gap-2 mb-2 flex-wrap">
                {form.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 bg-neutral-100 text-neutral-700 text-xs px-2.5 py-1 rounded-full font-medium"
                  >
                    #{t}
                    <button
                      onClick={() => removeTag(t)}
                      className="ml-0.5 text-neutral-400 hover:text-red-500 transition-colors"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                  placeholder="Ajouter un tag…"
                  className={INPUT_CLS + " flex-1"}
                />
                <button
                  onClick={addTag}
                  className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-sm font-semibold rounded-xl transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Options : Épinglée + Statut */}
            <div className="flex flex-wrap gap-4 pt-2">
              {/* Toggle Épinglée */}
              <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                <div
                  onClick={() => set("featured", !form.featured)}
                  className={`relative w-10 h-5 rounded-full transition-colors duration-200
                    ${form.featured ? "bg-amber-400" : "bg-neutral-200"}`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200
                    ${form.featured ? "translate-x-5" : "translate-x-0"}`}
                  />
                </div>
                <Star
                  size={14}
                  className={
                    form.featured
                      ? "text-amber-500 fill-amber-500"
                      : "text-neutral-400"
                  }
                />
                <span className="text-sm text-neutral-700 font-medium">
                  Épinglée (vidéo à la une)
                </span>
              </label>

              {/* Statut */}
              <div className="flex items-center gap-2 bg-neutral-50 rounded-xl p-1">
                {(["published", "draft"] as VideoStatus[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => set("status", s)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                      ${
                        form.status === s
                          ? s === "published"
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "bg-amber-500 text-white shadow-sm"
                          : "text-neutral-500 hover:text-neutral-700"
                      }`}
                  >
                    {s === "published" ? (
                      <Globe size={11} />
                    ) : (
                      <Lock size={11} />
                    )}
                    {s === "published" ? "Publié" : "Brouillon"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Colonne droite : aperçu YouTube ── */}
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide mb-2">
                Aperçu thumbnail
              </p>
              <YoutubeThumbnail videoId={form.videoId} size="lg" />
            </div>

            {form.videoId && (
              <a
                href={`https://www.youtube.com/watch?v=${form.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-red-600 hover:text-red-700 font-semibold"
              >
                <ExternalLink size={12} /> Vérifier sur YouTube
              </a>
            )}

            {/* Résumé métadonnées */}
            {form.category && (
              <div className="bg-neutral-50 rounded-xl p-4 space-y-2.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-3">
                  Aperçu carte
                </p>
                <CategoryPill category={form.category} />
                <p className="text-sm font-bold text-neutral-800 line-clamp-2">
                  {form.title || "Titre de la vidéo"}
                </p>
                {form.duration && (
                  <p className="text-xs text-neutral-400 flex items-center gap-1">
                    <Clock size={10} /> {form.duration}
                  </p>
                )}
                {form.location && (
                  <p className="text-xs text-neutral-400 flex items-center gap-1">
                    <MapPin size={10} /> {form.location}
                  </p>
                )}
                <StatusBadge status={form.status} />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-8 py-5 border-t border-neutral-100 bg-neutral-50 rounded-b-3xl">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-neutral-600 hover:text-neutral-800 rounded-xl hover:bg-neutral-100 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={() => canSave && onSave(form)}
            disabled={!canSave}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all
              ${
                canSave
                  ? "bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow-md"
                  : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
              }`}
          >
            <Save size={14} /> {initial ? "Enregistrer" : "Ajouter la vidéo"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   MODALE CONFIRMATION SUPPRESSION
══════════════════════════════════════════════════════════════════════════════ */
function DeleteConfirm({
  video,
  onConfirm,
  onCancel,
}: {
  video: Video;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Trash2 size={18} className="text-red-600" />
          </div>
          <div>
            <h3 className="font-bold text-neutral-900">Supprimer la vidéo</h3>
            <p className="text-xs text-neutral-500">
              Cette action est irréversible
            </p>
          </div>
        </div>
        <YoutubeThumbnail videoId={video.videoId} size="sm" />
        <p className="text-sm text-neutral-600 mt-3 mb-5 font-medium line-clamp-2">
          {video.title}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 text-sm font-semibold border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 text-sm font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
          >
            Supprimer
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   CARTE VIDÉO (liste admin)
══════════════════════════════════════════════════════════════════════════════ */
function VideoRow({
  video,
  onEdit,
  onDelete,
  onToggleStatus,
  onToggleFeatured,
}: {
  video: Video;
  onEdit: (v: Video) => void;
  onDelete: (v: Video) => void;
  onToggleStatus: (id: string) => void;
  onToggleFeatured: (id: string) => void;
}) {
  const [hover, setHover] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="bg-white rounded-2xl border border-neutral-100 hover:border-neutral-200 hover:shadow-md
                 transition-all duration-200 overflow-hidden"
    >
      <div className="flex items-stretch gap-0">
        {/* Thumbnail */}
        <div className="w-44 flex-shrink-0 relative">
          <YoutubeThumbnail videoId={video.videoId} size="md" />
          {video.featured && (
            <div className="absolute top-2 left-2">
              <span className="inline-flex items-center gap-1 bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                <Star size={8} className="fill-amber-900" /> Vedette
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 px-5 py-4 min-w-0">
          <div className="flex items-start gap-3 mb-2">
            <CategoryPill category={video.category} />
            <StatusBadge status={video.status} />
            {video.featured && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600">
                <Star size={10} className="fill-amber-500" /> Épinglée
              </span>
            )}
          </div>
          <h3 className="font-bold text-neutral-900 leading-snug line-clamp-1 mb-1">
            {video.title}
          </h3>
          <p className="text-xs text-neutral-400 line-clamp-1 mb-3">
            {video.caption}
          </p>
          <div className="flex items-center gap-4 text-xs text-neutral-400">
            <span className="flex items-center gap-1">
              <Clock size={10} /> {video.duration}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={10} /> {video.location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={10} /> {video.year}
            </span>
            <code className="font-mono text-neutral-300 text-[10px]">
              {video.videoId}
            </code>
          </div>
        </div>

        {/* Actions */}
        <div
          className={`flex flex-col items-center justify-center gap-2 px-4 border-l border-neutral-100
          transition-all duration-200 ${hover ? "bg-neutral-50" : "bg-white"}`}
        >
          {/* Toggle featured */}
          <button
            onClick={() => onToggleFeatured(video.id)}
            title={video.featured ? "Retirer de la une" : "Mettre à la une"}
            className={`p-2 rounded-xl transition-colors
              ${
                video.featured
                  ? "bg-amber-100 text-amber-600 hover:bg-amber-200"
                  : "text-neutral-300 hover:text-amber-500 hover:bg-amber-50"
              }`}
          >
            <Star
              size={15}
              className={video.featured ? "fill-amber-500" : ""}
            />
          </button>

          {/* Toggle statut */}
          <button
            onClick={() => onToggleStatus(video.id)}
            title={
              video.status === "published" ? "Passer en brouillon" : "Publier"
            }
            className={`p-2 rounded-xl transition-colors
              ${
                video.status === "published"
                  ? "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                  : "bg-amber-100 text-amber-600 hover:bg-amber-200"
              }`}
          >
            {video.status === "published" ? (
              <Globe size={15} />
            ) : (
              <Lock size={15} />
            )}
          </button>

          {/* Voir sur YouTube */}
          <a
            href={`https://www.youtube.com/watch?v=${video.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl text-neutral-300 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Voir sur YouTube"
          >
            <ExternalLink size={15} />
          </a>

          {/* Éditer */}
          <button
            onClick={() => onEdit(video)}
            className="p-2 rounded-xl text-neutral-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
            title="Modifier"
          >
            <Edit3 size={15} />
          </button>

          {/* Supprimer */}
          <button
            onClick={() => onDelete(video)}
            className="p-2 rounded-xl text-neutral-300 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Supprimer"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   PAGE PRINCIPALE
══════════════════════════════════════════════════════════════════════════════ */
export default function AdminVideosPage() {
  const [videos, setVideos] = useState<Video[]>(INIT_VIDEOS);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<VideoCategory | "Toutes">(
    "Toutes",
  );
  const [statusFilter, setStatusFilter] = useState<VideoStatus | "Tous">(
    "Tous",
  );
  const [editTarget, setEditTarget] = useState<Video | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Video | null>(null);

  /* ── Stats ── */
  const stats = useMemo(
    () => ({
      total: videos.length,
      published: videos.filter((v) => v.status === "published").length,
      draft: videos.filter((v) => v.status === "draft").length,
      featured: videos.filter((v) => v.featured).length,
      byCategory: CATEGORIES.map((c) => ({
        cat: c,
        count: videos.filter((v) => v.category === c).length,
      })),
    }),
    [videos],
  );

  /* ── Filtrage ── */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return videos
      .filter((v) => {
        const matchQ =
          !q ||
          v.title.toLowerCase().includes(q) ||
          v.location.toLowerCase().includes(q) ||
          v.videoId.toLowerCase().includes(q);
        const matchCat = catFilter === "Toutes" || v.category === catFilter;
        const matchSt = statusFilter === "Tous" || v.status === statusFilter;
        return matchQ && matchCat && matchSt;
      })
      .sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return b.year - a.year || a.title.localeCompare(b.title);
      });
  }, [videos, search, catFilter, statusFilter]);

  /* ── Actions CRUD ── */
  const handleAdd = (data: VideoFormData) => {
    const now = today();
    setVideos((vs) => [
      { ...data, id: newId(), createdAt: now, updatedAt: now },
      ...vs,
    ]);
    setShowAdd(false);
  };

  const handleEdit = (data: VideoFormData) => {
    if (!editTarget) return;
    setVideos((vs) =>
      vs.map((v) =>
        v.id === editTarget.id ? { ...v, ...data, updatedAt: today() } : v,
      ),
    );
    setEditTarget(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setVideos((vs) => vs.filter((v) => v.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const handleToggleStatus = (id: string) =>
    setVideos((vs) =>
      vs.map((v) =>
        v.id === id
          ? {
              ...v,
              status: v.status === "published" ? "draft" : "published",
              updatedAt: today(),
            }
          : v,
      ),
    );

  const handleToggleFeatured = (id: string) =>
    setVideos((vs) =>
      vs.map((v) =>
        v.id === id ? { ...v, featured: !v.featured, updatedAt: today() } : v,
      ),
    );

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      {/* ── En-tête ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-red-100 rounded-2xl flex items-center justify-center">
              <Youtube size={20} className="text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900">Vidéothèque</h1>
          </div>
          <p className="text-sm text-neutral-500 ml-13">
            Gestion des vidéos YouTube MRJC-BÉNIN — {videos.length} vidéo
            {videos.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/videoteque"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2.5 text-sm border border-neutral-200 rounded-xl
                       text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50 transition-colors font-medium"
          >
            <Eye size={14} /> Voir la page publique
          </a>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white
                       text-sm font-bold rounded-xl transition-colors shadow-sm hover:shadow-md"
          >
            <Plus size={16} /> Ajouter une vidéo
          </button>
        </div>
      </div>

      {/* ── Statistiques ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total",
            value: stats.total,
            icon: Tv,
            color: "bg-neutral-100 text-neutral-700",
          },
          {
            label: "Publiées",
            value: stats.published,
            icon: Globe,
            color: "bg-emerald-100 text-emerald-700",
          },
          {
            label: "Brouillon",
            value: stats.draft,
            icon: Lock,
            color: "bg-amber-100 text-amber-700",
          },
          {
            label: "Épinglées",
            value: stats.featured,
            icon: Star,
            color: "bg-yellow-100 text-yellow-700",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white rounded-2xl border border-neutral-100 p-5 flex items-center gap-4 shadow-sm"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}
            >
              <Icon size={18} />
            </div>
            <div>
              <p className="text-2xl font-black text-neutral-900 leading-none">
                {value}
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Par catégorie ── */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4 flex items-center gap-2">
          <BarChart3 size={12} /> Répartition par catégorie
        </p>
        <div className="grid grid-cols-5 gap-3">
          {stats.byCategory.map(({ cat, count }) => {
            const c = CAT_COLORS[cat as VideoCategory];
            const pct = stats.total
              ? Math.round((count / stats.total) * 100)
              : 0;
            return (
              <div key={cat}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold text-neutral-600">
                    {cat}
                  </span>
                  <span className="text-[11px] font-bold text-neutral-800">
                    {count}
                  </span>
                </div>
                <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${c.dot}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Filtres + Recherche ── */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-4 shadow-sm flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-52">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher titre, lieu, ID YouTube…"
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-neutral-200 rounded-xl bg-neutral-50
                       focus:outline-none focus:ring-2 focus:ring-primary-200 focus:bg-white transition-all"
          />
        </div>

        {/* Filtre catégorie */}
        <div className="flex gap-1.5 flex-wrap">
          {(["Toutes", ...CATEGORIES] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCatFilter(c)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all
                ${
                  catFilter === c
                    ? "bg-neutral-900 text-white shadow-sm"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Filtre statut */}
        <div className="flex gap-1.5">
          {(["Tous", "published", "draft"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all
                ${
                  statusFilter === s
                    ? s === "published"
                      ? "bg-emerald-600 text-white"
                      : s === "draft"
                        ? "bg-amber-500 text-white"
                        : "bg-neutral-900 text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
            >
              {s === "published"
                ? "Publiées"
                : s === "draft"
                  ? "Brouillons"
                  : "Tous statuts"}
            </button>
          ))}
        </div>

        {/* Compteur */}
        <p className="text-xs text-neutral-400 ml-auto">
          <span className="font-bold text-neutral-700">{filtered.length}</span>{" "}
          résultat{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* ── Liste des vidéos ── */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl border border-neutral-100 p-16 text-center"
            >
              <Youtube size={40} className="mx-auto text-neutral-300 mb-3" />
              <p className="font-semibold text-neutral-600">
                Aucune vidéo trouvée
              </p>
              <p className="text-sm text-neutral-400 mt-1">
                Modifiez vos filtres ou ajoutez une vidéo
              </p>
              <button
                onClick={() => setShowAdd(true)}
                className="mt-5 px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors"
              >
                <Plus size={14} className="inline mr-1.5" /> Ajouter une vidéo
              </button>
            </motion.div>
          ) : (
            filtered.map((video) => (
              <VideoRow
                key={video.id}
                video={video}
                onEdit={setEditTarget}
                onDelete={setDeleteTarget}
                onToggleStatus={handleToggleStatus}
                onToggleFeatured={handleToggleFeatured}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* ── Modales ── */}
      <AnimatePresence>
        {showAdd && (
          <VideoForm onSave={handleAdd} onClose={() => setShowAdd(false)} />
        )}
        {editTarget && (
          <VideoForm
            initial={editTarget}
            onSave={handleEdit}
            onClose={() => setEditTarget(null)}
          />
        )}
        {deleteTarget && (
          <DeleteConfirm
            video={deleteTarget}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
