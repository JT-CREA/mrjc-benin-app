"use client";

/**
 * Page — /videoteque
 * Vidéothèque complète MRJC-BÉNIN
 * ─────────────────────────────────────────────────────────────────────────────
 * • Grille de vidéos YouTube avec thumbnails haute qualité
 * • YouTubeEmbed activé : thumbnail → clic → lecture inline autoplay
 * • Lecteur modal plein écran sur demande
 * • Filtres : catégorie + année + recherche texte
 * • Vidéo vedette épinglée (mise en avant)
 * • Métadonnées complètes : durée, catégorie, année, description longue
 * • CTA abonnement chaîne YouTube
 * • Responsive mobile/tablette/desktop
 */

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Youtube,
  ExternalLink,
  Search,
  X,
  Clock,
  Calendar,
  Tag,
  Users,
  MapPin,
  ChevronRight,
  Star,
  ArrowRight,
  Eye,
} from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import YouTubeEmbed from "@/components/ui/YouTubeEmbed";

/* ══════════════════════════════════════════════════════════════════════════════
   DONNÉES — Catalogue vidéo (à remplacer par les vrais IDs YouTube MRJC-BÉNIN)
══════════════════════════════════════════════════════════════════════════════ */
const VIDEOS = [
  /* ── INSTITUTIONNEL ─────────────────────────────────────────────────────── */
  {
    id: "v01",
    videoId: "gCNeDWCI0vo",
    title: "MRJC-BÉNIN : 38 ans de développement rural",
    description:
      "Film institutionnel 2023. Vue d'ensemble de nos programmes, de nos partenaires et de notre impact sur les communautés rurales du Bénin depuis 1986.",
    category: "Institutionnel",
    tags: ["NGO", "Bénin", "Impact"],
    location: "National",
    year: 2023,
    duration: "18 min",
    featured: true,
  },
  {
    id: "v02",
    videoId: "PdFa8LiOatM",
    title: "Prix National Excellence ONG 2023",
    description:
      "Cérémonie de remise du Prix National d'Excellence ONG décerné par le Gouvernement béninois à MRJC-BÉNIN pour son impact sur les 5 dernières années.",
    category: "Institutionnel",
    tags: ["Prix", "Reconnaissance", "Gouvernement"],
    location: "Cotonou",
    year: 2023,
    duration: "5 min",
    featured: false,
  },
  {
    id: "v03",
    videoId: "7YHZFmV1iqQ",
    title: "Partenariat AFD — Filières agricoles Atacora",
    description:
      "Présentation du programme de développement des filières manioc et igname cofinancé par l'Agence Française de Développement à hauteur de 850 millions FCFA.",
    category: "Institutionnel",
    tags: ["AFD", "Partenariat", "Agriculture"],
    location: "Atacora",
    year: 2023,
    duration: "8 min",
    featured: false,
  },
  /* ── TERRAIN ─────────────────────────────────────────────────────────────── */
  {
    id: "v04",
    videoId: "tL-Mh-s7JLE",
    title: "Alphabétisation des femmes — Programme Borgou",
    description:
      "3 600 femmes formées en 2023 dans le département du Borgou. Reportage dans les villages de N'Dali, Kandi et Nikki où MRJC anime des classes d'alphabétisation en langue Bariba.",
    category: "Terrain",
    tags: ["Femmes", "Alphabétisation", "Borgou"],
    location: "Borgou",
    year: 2023,
    duration: "15 min",
    featured: false,
  },
  {
    id: "v05",
    videoId: "BHmkE7-ANKU",
    title: "Mission de terrain — Santé & Nutrition, Mono",
    description:
      "Reportage de la mission de suivi des programmes Santé & Nutrition dans le département du Mono. Vaccination, pesée des enfants et sensibilisation à la nutrition maternelle.",
    category: "Terrain",
    tags: ["Santé", "Nutrition", "Mono"],
    location: "Mono",
    year: 2024,
    duration: "9 min",
    featured: false,
  },
  {
    id: "v06",
    videoId: "aSBtcHdSBjI",
    title: "Agriculture durable — Techniques agro-écologiques",
    description:
      "Formation en techniques de compostage, maraîchage raisonné et rotation des cultures. 45 agriculteurs des villages de l'Atacora bénéficient d'un accompagnement technique sur 6 mois.",
    category: "Terrain",
    tags: ["Agriculture", "Atacora", "Formation"],
    location: "Atacora",
    year: 2024,
    duration: "12 min",
    featured: false,
  },
  /* ── TÉMOIGNAGES ─────────────────────────────────────────────────────────── */
  {
    id: "v07",
    videoId: "DcGLt0XfLQY",
    title: "Témoignage — Awa Idrissou, agricultrice, Borgou",
    description:
      "Comment la formation MRJC a transformé l'exploitation d'Awa Idrissou. En 18 mois, ses revenus ont triplé grâce aux techniques agro-écologiques et à la diversification des cultures.",
    category: "Témoignages",
    tags: ["Femmes", "Agriculture", "Impact"],
    location: "Borgou",
    year: 2024,
    duration: "7 min",
    featured: false,
  },
  {
    id: "v08",
    videoId: "Qw0BFhGSSUI",
    title: "Autonomisation des femmes — Groupement FAFEWA",
    description:
      "Comment 38 femmes de Savalou ont créé leur propre caisse de crédit et financement mutuel grâce à l'accompagnement MRJC. Aujourd'hui, le groupement gère 12 millions FCFA d'épargne.",
    category: "Témoignages",
    tags: ["Femmes", "Finance", "Collines"],
    location: "Collines",
    year: 2024,
    duration: "11 min",
    featured: false,
  },
  /* ── FORMATIONS ──────────────────────────────────────────────────────────── */
  {
    id: "v09",
    videoId: "fLeJJPxua3E",
    title: "Formation des agents de terrain — Méthode REFLECT",
    description:
      "Séminaire annuel des 45 agents de terrain de MRJC-BÉNIN. Renforcement des compétences en animation communautaire, méthode REFLECT et techniques d'alphabétisation fonctionnelle.",
    category: "Formations",
    tags: ["REFLECT", "Agents", "Formation"],
    location: "Cotonou",
    year: 2024,
    duration: "20 min",
    featured: false,
  },
  {
    id: "v10",
    videoId: "WQzxXMOiTOI",
    title: "Gestion des ressources naturelles — Module 3",
    description:
      "Module de formation sur la gestion durable des ressources naturelles, la lutte contre la déforestation et les techniques de reboisement. Destiné aux agriculteurs des zones de savane.",
    category: "Formations",
    tags: ["Environnement", "Reboisement", "Terre"],
    location: "Donga",
    year: 2023,
    duration: "25 min",
    featured: false,
  },
  {
    id: "v11",
    videoId: "kCc8FmEb1nY",
    title: "Leadership féminin — Programme LEAD Femmes",
    description:
      "Session de formation au leadership féminin et à la prise de parole en public. 120 femmes issues de 8 communes ont suivi ce module intensif sur 3 jours à Parakou.",
    category: "Formations",
    tags: ["Femmes", "Leadership", "Parakou"],
    location: "Borgou",
    year: 2024,
    duration: "14 min",
    featured: false,
  },
  /* ── REPORTAGES ──────────────────────────────────────────────────────────── */
  {
    id: "v12",
    videoId: "J7GY1Xg6X20",
    title: "Reportage : Les champs de l'espoir — Atacora",
    description:
      "Grand reportage immersif dans les champs du Nord-Bénin. Pendant 4 jours, notre équipe a suivi les agriculteurs accompagnés par MRJC dans leur quotidien de la saison des pluies.",
    category: "Reportages",
    tags: ["Agriculture", "Atacora", "Immersif"],
    location: "Atacora",
    year: 2024,
    duration: "28 min",
    featured: false,
  },
];

const CATEGORIES = [
  "Toutes",
  "Institutionnel",
  "Terrain",
  "Témoignages",
  "Formations",
  "Reportages",
];
const YEARS = ["Toutes", "2024", "2023", "2022"];

/* ══════════════════════════════════════════════════════════════════════════════
   STATS
══════════════════════════════════════════════════════════════════════════════ */
const STATS = [
  { value: `${VIDEOS.length}+`, label: "Vidéos disponibles" },
  { value: "5", label: "Catégories" },
  { value: "180h+", label: "De contenu filmé" },
  { value: "12k+", label: "Vues cumulées" },
];

/* ══════════════════════════════════════════════════════════════════════════════
   COULEURS CATÉGORIES
══════════════════════════════════════════════════════════════════════════════ */
const CAT_COLORS: Record<string, { bg: string; text: string; border: string }> =
  {
    Institutionnel: {
      bg: "bg-primary-100",
      text: "text-primary-700",
      border: "border-primary-300",
    },
    Terrain: {
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      border: "border-emerald-300",
    },
    Témoignages: {
      bg: "bg-amber-100",
      text: "text-amber-700",
      border: "border-amber-300",
    },
    Formations: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      border: "border-blue-300",
    },
    Reportages: {
      bg: "bg-purple-100",
      text: "text-purple-700",
      border: "border-purple-300",
    },
  };

/* ══════════════════════════════════════════════════════════════════════════════
   COMPOSANT CARTE VIDÉO
══════════════════════════════════════════════════════════════════════════════ */
interface VideoCardProps {
  video: (typeof VIDEOS)[0];
  onSelect: (v: (typeof VIDEOS)[0]) => void;
  large?: boolean;
}

function VideoCard({ video, onSelect, large = false }: VideoCardProps) {
  const col = CAT_COLORS[video.category] ?? {
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-gray-200",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      layout
      className={`group bg-white rounded-2xl border border-neutral-200 overflow-hidden
                  hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col`}
    >
      {/* ── Embed YouTube inline ── */}
      <div className={large ? "aspect-video" : "aspect-video"}>
        <YouTubeEmbed
          videoId={video.videoId}
          title={video.title}
          thumbnailQuality="maxresdefault"
          autoplay
          showChannelBadge={false}
          className="rounded-none h-full"
        />
      </div>

      {/* ── Métadonnées ── */}
      <div className="p-4 flex flex-col flex-1">
        {/* Catégorie + durée */}
        <div className="flex items-center justify-between mb-3">
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1
                           rounded-full ${col.bg} ${col.text}`}
          >
            <Tag size={9} /> {video.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-neutral-400 font-medium">
            <Clock size={11} /> {video.duration}
          </span>
        </div>

        {/* Titre */}
        <h3
          className={`font-bold text-neutral-900 leading-snug mb-2 flex-1
                        ${large ? "text-lg" : "text-sm"} line-clamp-2`}
        >
          {video.title}
        </h3>

        {/* Description (carte large uniquement) */}
        {large && (
          <p className="text-sm text-neutral-500 leading-relaxed mb-4 line-clamp-2">
            {video.description}
          </p>
        )}

        {/* Localisation + année */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-neutral-100">
          <span className="flex items-center gap-1.5 text-xs text-neutral-400">
            <MapPin size={11} className="text-primary-400" />
            {video.location}
          </span>
          <span className="flex items-center gap-1 text-xs text-neutral-400">
            <Calendar size={11} className="text-primary-400" />
            {video.year}
          </span>
        </div>

        {/* Bouton "Voir en grand" */}
        <button
          onClick={() => onSelect(video)}
          className="mt-3 w-full text-xs font-semibold text-primary-600 hover:text-primary-700
                     py-2 rounded-xl hover:bg-primary-50 transition-colors flex items-center justify-center gap-1.5"
        >
          <Eye size={12} /> Voir en plein écran
        </button>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   MODAL LECTEUR PLEIN ÉCRAN
══════════════════════════════════════════════════════════════════════════════ */
function VideoModal({
  video,
  onClose,
}: {
  video: (typeof VIDEOS)[0];
  onClose: () => void;
}) {
  const col = CAT_COLORS[video.category] ?? {
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-gray-200",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.94, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.94, y: 10 }}
        className="bg-white rounded-3xl overflow-hidden shadow-2xl w-full max-w-4xl"
      >
        {/* Header modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full ${col.bg} ${col.text}`}
            >
              {video.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-neutral-400">
              <Clock size={11} /> {video.duration}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Lecteur */}
        <div className="aspect-video bg-black">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0&modestbranding=1&color=white`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Infos */}
        <div className="px-6 py-5">
          <h2 className="font-display text-xl font-bold text-neutral-900 mb-2">
            {video.title}
          </h2>
          <p className="text-sm text-neutral-500 leading-relaxed mb-4">
            {video.description}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400">
            <span className="flex items-center gap-1">
              <MapPin size={11} className="text-primary-500" /> {video.location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={11} className="text-primary-500" /> {video.year}
            </span>
            <span className="flex items-center gap-1">
              <Users size={11} className="text-primary-500" /> MRJC
              Communication
            </span>
            <a
              href={`https://www.youtube.com/watch?v=${video.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-red-600 font-semibold hover:text-red-700 ml-auto"
            >
              <Youtube size={11} /> Ouvrir sur YouTube{" "}
              <ExternalLink size={11} />
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   PAGE PRINCIPALE
══════════════════════════════════════════════════════════════════════════════ */
export default function VideothequeePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Toutes");
  const [year, setYear] = useState("Toutes");
  const [selected, setSelected] = useState<(typeof VIDEOS)[0] | null>(null);

  const featured = VIDEOS.find((v) => v.featured);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return VIDEOS.filter((v) => {
      const matchSearch =
        !q ||
        v.title.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q) ||
        v.location.toLowerCase().includes(q);
      const matchCat = category === "Toutes" || v.category === category;
      const matchYear = year === "Toutes" || String(v.year) === year;
      return matchSearch && matchCat && matchYear;
    });
  }, [search, category, year]);

  const resetFilters = () => {
    setSearch("");
    setCategory("Toutes");
    setYear("Toutes");
  };
  const hasFilters = search || category !== "Toutes" || year !== "Toutes";

  return (
    <>
      {/* ── Header ── */}
      <PageHeader
        tag="Médiathèque"
        title="Vidéothèque"
        subtitle="Documentaires, reportages de terrain, témoignages de bénéficiaires et sessions de formation filmées — l'action de MRJC-BÉNIN en images."
        breadcrumbs={[
          { label: "Ressources", href: "/resources" },
          { label: "Vidéothèque" },
        ]}
        image="/assets/images/placeholder.svg"
        align="left"
      />

      {/* ── Stats ── */}
      <section className="bg-primary-700 py-10">
        <div className="container-mrjc">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center text-white">
                <p className="font-display text-3xl font-black">{stat.value}</p>
                <p className="text-sm text-primary-200 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-neutral-50 min-h-screen py-16 lg:py-24">
        <div className="container-mrjc space-y-16">
          {/* ── Vidéo vedette ── */}
          {featured && (
            <section>
              <div className="flex items-center gap-3 mb-8">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <h2 className="font-display text-2xl font-bold text-neutral-900">
                  Vidéo à la une
                </h2>
              </div>
              <div className="grid lg:grid-cols-[1.7fr_1fr] gap-8 items-start">
                {/* Lecteur */}
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <YouTubeEmbed
                    videoId={featured.videoId}
                    title={featured.title}
                    caption={featured.description}
                    thumbnailQuality="maxresdefault"
                    autoplay
                    showChannelBadge
                    className="rounded-none"
                  />
                </div>

                {/* Infos */}
                <div className="bg-white rounded-2xl border border-neutral-200 p-7 flex flex-col gap-5 shadow-sm">
                  <div>
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full mb-4
                                     ${CAT_COLORS[featured.category]?.bg} ${CAT_COLORS[featured.category]?.text}`}
                    >
                      <Youtube size={11} className="fill-current" />{" "}
                      {featured.category}
                    </span>
                    <h3 className="font-display text-xl font-bold text-neutral-900 leading-tight mb-3">
                      {featured.title}
                    </h3>
                    <p className="text-sm text-neutral-500 leading-relaxed">
                      {featured.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {[
                      { icon: Clock, val: featured.duration },
                      { icon: Calendar, val: String(featured.year) },
                      { icon: MapPin, val: featured.location },
                      { icon: Users, val: "MRJC Comm." },
                    ].map(({ icon: Icon, val }) => (
                      <div
                        key={val}
                        className="flex items-center gap-2 text-neutral-500"
                      >
                        <Icon
                          size={14}
                          className="text-primary-500 flex-shrink-0"
                        />
                        <span className="truncate">{val}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-3 pt-2">
                    <button
                      onClick={() => setSelected(featured)}
                      className="btn-primary w-full justify-center"
                    >
                      <Play size={14} className="fill-white" /> Voir en plein
                      écran
                    </button>
                    <a
                      href={`https://www.youtube.com/watch?v=${featured.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline w-full justify-center text-sm"
                    >
                      <ExternalLink size={13} /> Ouvrir sur YouTube
                    </a>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-100">
                    {featured.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-full font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ── Barre de filtres ── */}
          <section className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              {/* Search */}
              <div className="relative flex-1">
                <Search
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher une vidéo, un lieu, un thème..."
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-neutral-200 rounded-xl
                             focus:outline-none focus:ring-2 focus:ring-primary-200 bg-neutral-50"
                />
              </div>

              {/* Catégorie */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide hidden lg:block">
                  Catégorie
                </span>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                        ${
                          category === cat
                            ? "bg-primary-600 text-white shadow-sm"
                            : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Année */}
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="text-sm border border-neutral-200 rounded-xl px-3 py-2.5 bg-white
                           focus:outline-none focus:ring-2 focus:ring-primary-200 text-neutral-700"
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y === "Toutes" ? "Toute année" : y}
                  </option>
                ))}
              </select>

              {/* Reset */}
              {hasFilters && (
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-red-600
                             transition-colors px-3 py-2.5 rounded-xl hover:bg-red-50"
                >
                  <X size={14} /> Effacer
                </button>
              )}
            </div>

            {/* Compteur */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-100">
              <p className="text-sm text-neutral-500">
                <span className="font-bold text-neutral-900">
                  {filtered.length}
                </span>{" "}
                vidéo{filtered.length !== 1 ? "s" : ""} trouvée
                {filtered.length !== 1 ? "s" : ""}
                {hasFilters && (
                  <span className="text-primary-600"> · filtres actifs</span>
                )}
              </p>
              <a
                href="https://www.youtube.com/@mrjcbenin"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-red-600 font-semibold hover:text-red-700"
              >
                <Youtube size={14} className="fill-red-600" /> Notre chaîne
                YouTube
                <ExternalLink size={12} />
              </a>
            </div>
          </section>

          {/* ── Grille vidéos ── */}
          <section>
            {filtered.length === 0 ? (
              <div className="py-24 text-center">
                <Youtube size={40} className="mx-auto text-neutral-300 mb-4" />
                <h3 className="text-lg font-bold text-neutral-700 mb-2">
                  Aucune vidéo ne correspond
                </h3>
                <p className="text-neutral-400 text-sm mb-6">
                  Essayez de modifier vos filtres ou votre recherche.
                </p>
                <button onClick={resetFilters} className="btn-primary">
                  Voir toutes les vidéos
                </button>
              </div>
            ) : (
              <motion.div
                layout
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {filtered.map((video) => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      onSelect={setSelected}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </section>

          {/* ── Catégories par thème ── */}
          <section className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-neutral-900 mb-6">
              Explorer par thème
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {CATEGORIES.filter((c) => c !== "Toutes").map((cat) => {
                const count = VIDEOS.filter((v) => v.category === cat).length;
                const col = CAT_COLORS[cat] ?? {
                  bg: "bg-gray-100",
                  text: "text-gray-700",
                  border: "border-gray-200",
                };
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategory(cat);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`flex items-center justify-between p-4 rounded-xl border-2
                               ${category === cat ? `${col.border} ${col.bg}` : "border-neutral-200 hover:border-neutral-300 bg-neutral-50"}
                               transition-all group`}
                  >
                    <div className="text-left">
                      <p
                        className={`font-bold text-sm ${cat === category ? col.text : "text-neutral-700"}`}
                      >
                        {cat}
                      </p>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        {count} vidéo{count !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <ChevronRight
                      size={16}
                      className={`${category === cat ? col.text : "text-neutral-400"} group-hover:translate-x-0.5 transition-transform`}
                    />
                  </button>
                );
              })}
            </div>
          </section>

          {/* ── CTA abonnement YouTube ── */}
          <section
            className="rounded-3xl p-10 text-center text-white overflow-hidden relative"
            style={{
              background: "linear-gradient(135deg, #1B6B3A 0%, #003087 100%)",
            }}
          >
            {/* Cercles décoratifs */}
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5" />

            <div className="relative z-10 max-w-xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Youtube size={32} className="text-red-400 fill-red-400" />
                <h2 className="font-display text-2xl font-bold">
                  Abonnez-vous à notre chaîne
                </h2>
              </div>
              <p className="text-white/80 mb-8 leading-relaxed">
                Recevez en temps réel nos documentaires, reportages de terrain
                et témoignages de bénéficiaires. Rejoignez des milliers de
                personnes qui suivent l&apos;action de MRJC-BÉNIN.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://www.youtube.com/@mrjcbenin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700
                              text-white font-bold px-8 py-3.5 rounded-xl transition-colors shadow-lg"
                >
                  <Youtube size={18} className="fill-white" />
                  S&apos;abonner sur YouTube
                  <ExternalLink size={14} />
                </a>
                <Link
                  href="/resources"
                  className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25
                             text-white border border-white/30 font-semibold px-8 py-3.5 rounded-xl transition-colors"
                >
                  Voir toutes nos ressources
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ── Modal lecteur ── */}
      <AnimatePresence>
        {selected && (
          <VideoModal video={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
