"use client";

/**
 * Page — Galeries Photos
 * Route: /resources/photo-albums
 * Fonctionnalités :
 * - Grille d'albums par thème/année
 * - Lightbox plein écran (yet-another-react-lightbox)
 * - Filtres par domaine et année
 * - Compteur de photos par album
 * - Breadcrumb et metadata
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Camera, Calendar, Eye, ChevronRight, X, Images } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";

// ─── Données ──────────────────────────────────────────────────────────────────
interface Album {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  year: number;
  domain: string;
  photosCount: number;
  photos: { src: string; alt: string; caption?: string }[];
}

const ALBUMS: Album[] = [
  {
    id: "alb-001",
    title: "Formation Agriculteurs — Borgou 2024",
    description:
      "Sessions de formation en agro-écologie avec 320 producteurs du département du Borgou.",
    coverImage:
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80",
    year: 2024,
    domain: "agriculture",
    photosCount: 24,
    photos: [
      {
        src: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&q=80",
        alt: "Formation agriculteurs",
        caption: "Session technique sur les semences améliorées",
      },
      {
        src: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&q=80",
        alt: "Champ démonstration",
        caption: "Champ de démonstration agroécologique",
      },
      {
        src: "https://images.unsplash.com/photo-1529313780224-1a12b68bed16?w=1200&q=80",
        alt: "Groupe discussion",
        caption: "Discussion en groupe sur les pratiques",
      },
      {
        src: "https://images.unsplash.com/photo-1542601906897-ecd97d8ddd41?w=1200&q=80",
        alt: "Récoltes",
        caption: "Récolte de la saison principale 2024",
      },
    ],
  },
  {
    id: "alb-002",
    title: "Journée Mondiale Santé — Atacora 2024",
    description:
      "Campagne de sensibilisation santé maternelle et infantile dans 15 villages de l'Atacora.",
    coverImage:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
    year: 2024,
    domain: "sante",
    photosCount: 18,
    photos: [
      {
        src: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80",
        alt: "Pesée enfants",
        caption: "Pesée des enfants de 0-5 ans",
      },
      {
        src: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=1200&q=80",
        alt: "Consultation",
        caption: "Consultation nutritionnelle",
      },
      {
        src: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=1200&q=80",
        alt: "Formation agents",
        caption: "Formation des agents de santé communautaire",
      },
    ],
  },
  {
    id: "alb-003",
    title: "Remise Diplômes Alphabétisation 2023",
    description:
      "Cérémonie de remise de certificats pour 420 apprenants des centres d'alphabétisation.",
    coverImage:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
    year: 2023,
    domain: "alphabetisation",
    photosCount: 32,
    photos: [
      {
        src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80",
        alt: "Cérémonie",
        caption: "Remise de diplômes aux apprenants",
      },
      {
        src: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1200&q=80",
        alt: "Classe adultes",
        caption: "Cours d'alphabétisation en langue fon",
      },
      {
        src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80",
        alt: "Lecture",
        caption: "Atelier lecture et écriture",
      },
    ],
  },
  {
    id: "alb-004",
    title: "Forum Femmes Leaders — Parakou 2023",
    description:
      "800 femmes leaders issues de 45 communes se sont retrouvées pour partager leurs expériences.",
    coverImage:
      "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&q=80",
    year: 2023,
    domain: "femmes",
    photosCount: 45,
    photos: [
      {
        src: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=1200&q=80",
        alt: "Forum femmes",
        caption: "Plénière d'ouverture du Forum",
      },
      {
        src: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=1200&q=80",
        alt: "Atelier",
        caption: "Atelier leadership et prise de décision",
      },
      {
        src: "https://images.unsplash.com/photo-1607748851687-ba9a10438621?w=1200&q=80",
        alt: "Exposition",
        caption: "Exposition des produits artisanaux",
      },
    ],
  },
  {
    id: "alb-005",
    title: "Visite Terrain PROCASE II — 2023",
    description:
      "Mission de suivi du projet PROCASE II dans les zones d'intervention de la Donga.",
    coverImage:
      "https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?w=800&q=80",
    year: 2023,
    domain: "agriculture",
    photosCount: 15,
    photos: [
      {
        src: "https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?w=1200&q=80",
        alt: "Visite terrain",
        caption: "Inspection des parcelles de démonstration",
      },
      {
        src: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&q=80",
        alt: "Élevage",
        caption: "Unités d'élevage amélioré",
      },
    ],
  },
  {
    id: "alb-006",
    title: "Médiation Sociale — Collines 2022",
    description:
      "Séances de médiation et de renforcement de la cohésion sociale dans les Collines.",
    coverImage:
      "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&q=80",
    year: 2022,
    domain: "intermediation",
    photosCount: 20,
    photos: [
      {
        src: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1200&q=80",
        alt: "Réunion communautaire",
        caption: "Réunion de cohésion sociale",
      },
      {
        src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80",
        alt: "Discussion",
        caption: "Discussion inter-communautaire",
      },
    ],
  },
];

const DOMAIN_LABELS: Record<string, { label: string; color: string }> = {
  agriculture: {
    label: "🌾 Agriculture",
    color: "bg-green-100 text-green-700",
  },
  sante: { label: "🏥 Santé", color: "bg-red-100 text-red-700" },
  alphabetisation: {
    label: "📚 Alphabétisation",
    color: "bg-blue-100 text-blue-700",
  },
  femmes: { label: "✊ Femmes", color: "bg-pink-100 text-pink-700" },
  intermediation: {
    label: "🤝 Intermédiation",
    color: "bg-purple-100 text-purple-700",
  },
};

// ─── Composant Carte Album ────────────────────────────────────────────────────
function AlbumCard({ album, onOpen }: { album: Album; onOpen: () => void }) {
  const domainCfg = DOMAIN_LABELS[album.domain];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer"
      onClick={onOpen}
    >
      {/* Cover */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={album.coverImage}
          alt={album.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {/* Photos count */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
          <Camera className="w-3 h-3" />
          {album.photosCount} photos
        </div>
        {/* Hover icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
            <Eye className="w-6 h-6 text-primary-600" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {domainCfg && (
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${domainCfg.color}`}
            >
              {domainCfg.label}
            </span>
          )}
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Calendar className="w-3 h-3" />
            {album.year}
          </span>
        </div>
        <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2 group-hover:text-primary-700 transition-colors">
          {album.title}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-2">
          {album.description}
        </p>
        <div className="mt-3 flex items-center gap-1 text-xs font-medium text-primary-600 group-hover:gap-2 transition-all">
          Voir les photos <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PhotoAlbumsPage() {
  const [domainFilter, setDomainFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState<number | "all">("all");
  const [openAlbum, setOpenAlbum] = useState<Album | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const years = Array.from(new Set(ALBUMS.map((a) => a.year))).sort(
    (a, b) => b - a,
  );

  const filtered = ALBUMS.filter((a) => {
    const matchDomain = domainFilter === "all" || a.domain === domainFilter;
    const matchYear = yearFilter === "all" || a.year === yearFilter;
    return matchDomain && matchYear;
  });

  const totalPhotos = ALBUMS.reduce((acc, a) => acc + a.photosCount, 0);

  return (
    <>
      <PageHeader
        title="Galeries Photos"
        subtitle="Les moments forts de nos actions sur le terrain"
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Ressources", href: "/resources" },
          { label: "Galeries Photos" },
        ]}
        stats={[
          { label: "Albums", value: String(ALBUMS.length) },
          { label: "Photos", value: `${totalPhotos}+` },
          { label: "Années", value: `${years[years.length - 1]}—${years[0]}` },
        ]}
      />

      <section className="section-mrjc bg-white">
        <div className="container-mrjc">
          {/* Filtres */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {/* Domaine */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setDomainFilter("all")}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                  domainFilter === "all"
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Images className="w-3.5 h-3.5" /> Tous
              </button>
              {Object.entries(DOMAIN_LABELS).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => setDomainFilter(key)}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                    domainFilter === key
                      ? "bg-primary-600 text-white"
                      : `${cfg.color} hover:opacity-80`
                  }`}
                >
                  {cfg.label}
                </button>
              ))}
            </div>
            {/* Année */}
            <div className="flex items-center gap-2 ml-auto">
              <Calendar className="w-4 h-4 text-gray-400" />
              <select
                value={String(yearFilter)}
                onChange={(e) =>
                  setYearFilter(
                    e.target.value === "all" ? "all" : Number(e.target.value),
                  )
                }
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white"
              >
                <option value="all">Toutes années</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Grille Albums */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            <AnimatePresence mode="popLayout">
              {filtered.map((album) => (
                <AlbumCard
                  key={album.id}
                  album={album}
                  onOpen={() => setOpenAlbum(album)}
                />
              ))}
            </AnimatePresence>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <Camera className="w-14 h-14 mx-auto mb-3 text-gray-200" />
              <p className="font-medium">Aucun album pour ces critères</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Modal Album ── */}
      <AnimatePresence>
        {openAlbum && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-start justify-center overflow-y-auto p-4 pt-16"
            onClick={() => setOpenAlbum(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 40 }}
              className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header modal */}
              <div className="flex items-start justify-between p-5 border-b">
                <div>
                  <h2 className="font-bold text-gray-900 text-lg">
                    {openAlbum.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {openAlbum.description}
                  </p>
                </div>
                <button
                  onClick={() => setOpenAlbum(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {/* Grille photos */}
              <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {openAlbum.photos.map((photo, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    className="relative aspect-video rounded-xl overflow-hidden group cursor-zoom-in"
                    onClick={() => {
                      setLightboxIndex(idx);
                      setLightboxOpen(true);
                    }}
                  >
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {photo.caption && (
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                        <p className="text-white text-xs leading-tight">
                          {photo.caption}
                        </p>
                      </div>
                    )}
                  </motion.button>
                ))}
                {/* Placeholder photos restantes */}
                {openAlbum.photosCount > openAlbum.photos.length && (
                  <div className="aspect-video rounded-xl bg-gray-100 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200">
                    <Camera className="w-6 h-6 mb-1" />
                    <span className="text-xs">
                      +{openAlbum.photosCount - openAlbum.photos.length} photos
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      {openAlbum && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          index={lightboxIndex}
          slides={openAlbum.photos.map((p) => ({
            src: p.src,
            alt: p.alt,
            description: p.caption,
          }))}
        />
      )}
    </>
  );
}
