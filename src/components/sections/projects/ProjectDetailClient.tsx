"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Calendar,
  Users,
  Clock,
  Download,
  Share2,
  ArrowLeft,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  FileText,
  BarChart3,
  Quote,
  Image as ImageIcon,
  X,
  CheckCircle2,
  Target,
  Activity,
  Building2,
  Handshake,
  TrendingUp,
  AlertCircle,
  Globe,
} from "lucide-react";
import type { Project } from "@/types/project.types";
import { cn } from "@/lib/utils/cn";
import Breadcrumb from "@/components/layout/Breadcrumb";

/* ─────────────────────────────────────────────────────────────
   Config couleurs
───────────────────────────────────────────────────────────── */
const DOMAIN_COLORS: Record<
  string,
  { bg: string; text: string; light: string }
> = {
  "agricultural-council": {
    bg: "bg-primary-500",
    text: "text-primary-600",
    light: "bg-primary-50",
  },
  "community-health": {
    bg: "bg-accent-500",
    text: "text-accent-600",
    light: "bg-accent-50",
  },
  "literacy-education": {
    bg: "bg-secondary-500",
    text: "text-secondary-600",
    light: "bg-secondary-50",
  },
  "women-empowerment": {
    bg: "bg-purple-600",
    text: "text-purple-600",
    light: "bg-purple-50",
  },
  "social-intermediation": {
    bg: "bg-neutral-600",
    text: "text-neutral-700",
    light: "bg-neutral-100",
  },
};

const DOMAIN_LABELS: Record<string, string> = {
  "agricultural-council": "Conseil Agricole & Entrepreneuriat",
  "community-health": "Santé Communautaire & Nutrition",
  "literacy-education": "Alphabétisation & Éducation",
  "women-empowerment": "Autonomisation des Femmes",
  "social-intermediation": "Intermédiation Sociale",
};

const STATUS_CONFIG: Record<
  string,
  { label: string; dot: string; cls: string }
> = {
  ongoing: {
    label: "En cours",
    dot: "bg-emerald-500",
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  completed: {
    label: "Clôturé",
    dot: "bg-neutral-400",
    cls: "bg-neutral-50 text-neutral-700 border-neutral-200",
  },
  planned: {
    label: "Planifié",
    dot: "bg-accent-500",
    cls: "bg-accent-50 text-accent-700 border-accent-200",
  },
  suspended: {
    label: "Suspendu",
    dot: "bg-orange-500",
    cls: "bg-orange-50 text-orange-700 border-orange-200",
  },
};

function formatBudget(amount?: number, currency = "XOF"): string {
  if (!amount) return "N/A";
  const label = currency === "XOF" ? "FCFA" : currency;
  if (amount >= 1_000_000)
    return `${(amount / 1_000_000).toFixed(1)} M ${label}`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)} k ${label}`;
  return `${amount} ${label}`;
}

function formatDateFr(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

/* ─────────────────────────────────────────────────────────────
   Galerie lightbox
───────────────────────────────────────────────────────────── */
function Lightbox({
  images,
  initialIndex,
  onClose,
}: {
  images: Project["gallery"];
  initialIndex: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(initialIndex);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Bouton fermer */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-xl
                   flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
        aria-label="Fermer"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Navigation */}
      {images && images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrent((c) => (c - 1 + images.length) % images.length);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-xl
                       flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
            aria-label="Précédente"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrent((c) => (c + 1) % images.length);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-xl
                       flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
            aria-label="Suivante"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Image */}
      <div
        className="relative max-w-5xl max-h-[80vh] w-full mx-16"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.25 }}
            className="relative w-full aspect-video"
          >
            <Image
              src={images?.[current]?.src || ""}
              alt={images?.[current]?.caption || ""}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </motion.div>
        </AnimatePresence>
        {images?.[current]?.caption && (
          <p className="mt-4 text-center text-sm text-white/70">
            {images?.[current]?.caption}
          </p>
        )}
        {images && images.length > 1 && (
          <p className="text-center text-xs text-white/40 mt-2">
            {current + 1} / {images.length}
          </p>
        )}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Onglets
───────────────────────────────────────────────────────────── */
const TABS = [
  { id: "overview", label: "Vue générale", icon: Globe },
  { id: "results", label: "Résultats", icon: BarChart3 },
  { id: "gallery", label: "Galerie", icon: ImageIcon },
  { id: "documents", label: "Documents", icon: FileText },
];

/* ─────────────────────────────────────────────────────────────
   Composant principal
───────────────────────────────────────────────────────────── */
export default function ProjectDetailClient({
  project,
  relatedProjects,
}: {
  project: Project;
  relatedProjects: Project[];
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);

  const domain =
    DOMAIN_COLORS[project.domain] || DOMAIN_COLORS["agricultural-council"];
  const status = STATUS_CONFIG[project.status] || STATUS_CONFIG["ongoing"];
  const totalBenef = project.beneficiaries.reduce((s, b) => s + b.count, 0);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: project.title, url });
    } else {
      await navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    }
  };

  const scrollToTabs = () =>
    tabsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <>
      {/* ── Breadcrumb ── */}
      <div className="bg-neutral-50 border-b border-neutral-100">
        <div className="container-mrjc py-3">
          <Breadcrumb
            items={[
              { label: "Nos Projets", href: "/projects" },
              { label: project.title },
            ]}
          />
        </div>
      </div>

      {/* ── Hero projet ── */}
      <section className="relative bg-primary-950 overflow-hidden">
        {/* Image fond */}
        <div className="absolute inset-0">
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            priority
            quality={80}
            className="object-cover opacity-25"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-950/80 via-primary-950/60 to-primary-950/90" />
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary-500" />
        </div>

        <div className="relative z-10 container-mrjc py-16 lg:py-24">
          {/* Retour */}
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-primary-300
                       hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Retour aux projets
          </Link>

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Colonne texte (2/3) */}
            <div className="lg:col-span-2 space-y-5">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border",
                    status.cls,
                  )}
                >
                  <span
                    className={cn(
                      "w-1.5 h-1.5 rounded-full flex-shrink-0",
                      status.dot,
                    )}
                  />
                  {status.label}
                </span>
                <span
                  className={cn(
                    "text-xs font-semibold px-3 py-1.5 rounded-full text-white",
                    domain.bg,
                  )}
                >
                  {DOMAIN_LABELS[project.domain]}
                </span>
                {project.tags.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2.5 py-1 bg-white/10 text-white/70 rounded-full"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              {/* Titre */}
              <h1 className="font-display text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight">
                {project.title}
              </h1>
              {project.subtitle && (
                <p className="text-lg text-primary-200 leading-relaxed">
                  {project.subtitle}
                </p>
              )}

              {/* Métadonnées */}
              <div className="flex flex-wrap gap-5 pt-2">
                {[
                  { icon: MapPin, label: project.zone },
                  {
                    icon: Calendar,
                    label: `${formatDateFr(project.startDate)} → ${project.endDate ? formatDateFr(project.endDate) : "En cours"}`,
                  },
                  { icon: Clock, label: project.duration || "—" },
                  {
                    icon: Users,
                    label: `${totalBenef.toLocaleString("fr-FR")} bénéficiaires`,
                  },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 text-sm text-primary-200"
                  >
                    <Icon className="w-4 h-4 text-secondary-400 flex-shrink-0" />
                    <span>{label}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={scrollToTabs}
                  className="btn-secondary text-sm"
                >
                  Voir les détails
                </button>
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 border
                             border-white/20 text-white rounded-xl text-sm font-semibold
                             hover:bg-white/20 transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  {copySuccess ? "Lien copié !" : "Partager"}
                </button>
              </div>
            </div>

            {/* Sidebar hero — Budget & Financement */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
                Informations clés
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-xs text-primary-300">Budget total</span>
                  <span className="text-sm font-bold text-white">
                    {formatBudget(project.budget, project.currency)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-xs text-primary-300">
                    Communes ciblées
                  </span>
                  <span className="text-sm font-bold text-white">
                    {project.communes?.length || "—"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-xs text-primary-300">Villages</span>
                  <span className="text-sm font-bold text-white">
                    {project.villages || "—"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-xs text-primary-300">Partenaires</span>
                  <span className="text-sm font-bold text-white">
                    {project.funders.length} bailleurs
                  </span>
                </div>
              </div>

              {/* Bailleurs */}
              <div>
                <p className="text-xs text-primary-300 mb-2 font-medium">
                  Financements
                </p>
                <div className="space-y-1.5">
                  {project.funders.map((f) => (
                    <div key={f.name} className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-secondary-400 rounded-full"
                          style={{ width: `${(f as any).share || 0}%` }}
                        />
                      </div>
                      <span className="text-2xs text-white/70 w-24 truncate">
                        {f.name}
                      </span>
                      <span className="text-2xs font-bold text-white w-8 text-right">
                        {(f as any).share || 0}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Onglets ── */}
      <div
        ref={tabsRef}
        className="sticky top-16 z-30 bg-white border-b border-neutral-200 shadow-sm"
      >
        <div className="container-mrjc">
          <div className="flex overflow-x-auto scrollbar-none -mb-px">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-5 py-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-all",
                    isActive
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-neutral-500 hover:text-neutral-800 hover:border-neutral-300",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Contenu onglets ── */}
      <div className="container-mrjc py-12 lg:py-16">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Zone principale */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {/* ─── Onglet Vue générale ─── */}
                {activeTab === "overview" && (
                  <div className="space-y-10">
                    {/* Description */}
                    <div>
                      <h2 className="font-display text-2xl font-bold text-neutral-900 mb-4 flex items-center gap-3">
                        <Globe className="w-6 h-6 text-primary-500" />
                        Présentation du projet
                      </h2>
                      <div
                        className="prose-mrjc"
                        dangerouslySetInnerHTML={{
                          __html: project.description,
                        }}
                      />
                    </div>

                    {/* Objectifs */}
                    {project.objectives.length > 0 && (
                      <div>
                        <h3 className="font-display text-xl font-bold text-neutral-900 mb-4 flex items-center gap-3">
                          <Target className="w-5 h-5 text-secondary-500" />
                          Objectifs
                        </h3>
                        <ul className="space-y-3">
                          {project.objectives.map((obj, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <span
                                className={cn(
                                  "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold text-white",
                                  domain.bg,
                                )}
                              >
                                {i + 1}
                              </span>
                              <span className="text-neutral-700">{obj}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Activités */}
                    {project.activities.length > 0 && (
                      <div>
                        <h3 className="font-display text-xl font-bold text-neutral-900 mb-4 flex items-center gap-3">
                          <Activity className="w-5 h-5 text-accent-500" />
                          Activités principales
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {project.activities.map((act, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-3 p-4 bg-neutral-50 rounded-xl border border-neutral-100"
                            >
                              <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-neutral-700">
                                {act}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Zone géographique */}
                    {project.communes && (
                      <div>
                        <h3 className="font-display text-xl font-bold text-neutral-900 mb-4 flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-purple-500" />
                          Zone d'intervention
                        </h3>
                        <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-100">
                          <p className="text-sm font-semibold text-neutral-600 mb-3">
                            {project.zone} — {project.departments?.join(", ")}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {project.communes.map((c) => (
                              <span
                                key={c}
                                className="text-xs bg-white border border-neutral-200
                                                       text-neutral-700 px-3 py-1.5 rounded-full font-medium"
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                          {project.villages && (
                            <p className="text-sm text-neutral-500 mt-3">
                              <strong className="text-neutral-800">
                                {project.villages} villages
                              </strong>{" "}
                              couverts
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Témoignage intégré */}
                    {project.testimonial && (
                      <div
                        className={cn(
                          "rounded-2xl p-6 border",
                          domain.light,
                          "border-" + domain.bg.replace("bg-", ""),
                        )}
                      >
                        <Quote
                          className={cn("w-8 h-8 mb-3 opacity-50", domain.text)}
                        />
                        <blockquote className="text-neutral-700 text-lg italic leading-relaxed mb-4">
                          "{project.testimonial.quote}"
                        </blockquote>
                        <div className="flex items-center gap-3">
                          {project.testimonial.photo && (
                            <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                              <Image
                                src={project.testimonial.photo}
                                alt={project.testimonial.author}
                                fill
                                className="object-cover"
                                sizes="40px"
                              />
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-sm text-neutral-900">
                              {project.testimonial.author}
                            </p>
                            <p className="text-xs text-neutral-500">
                              {project.testimonial.role}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ─── Onglet Résultats ─── */}
                {activeTab === "results" && (
                  <div className="space-y-8">
                    <h2 className="font-display text-2xl font-bold text-neutral-900 flex items-center gap-3">
                      <BarChart3 className="w-6 h-6 text-primary-500" />
                      Résultats & Impact
                    </h2>

                    {/* Résumé impact */}
                    {project.impactSummary && (
                      <div className="bg-primary-50 border-l-4 border-primary-500 rounded-r-2xl p-5">
                        <p className="flex items-start gap-3 text-primary-800 font-medium">
                          <TrendingUp className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary-500" />
                          {project.impactSummary}
                        </p>
                      </div>
                    )}

                    {/* Résultats liste */}
                    {project.results && project.results.length > 0 && (
                      <div>
                        <h3 className="font-bold text-lg text-neutral-900 mb-4">
                          Indicateurs de résultats
                        </h3>
                        <div className="space-y-3">
                          {project.results.map((r, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-3 p-4 bg-white
                                                     border border-neutral-100 rounded-xl shadow-xs"
                            >
                              <div
                                className={cn(
                                  "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0",
                                  domain.bg,
                                )}
                              >
                                <CheckCircle2 className="w-4 h-4 text-white" />
                              </div>
                              <p className="text-neutral-700 pt-1">
                                {(r as any).label ||
                                  (r as any).text ||
                                  "Résultat non défini"}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Bénéficiaires breakdown */}
                    <div>
                      <h3 className="font-bold text-lg text-neutral-900 mb-4">
                        Bénéficiaires par catégorie
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {project.beneficiaries.map((b, i) => (
                          <div
                            key={i}
                            className="bg-neutral-50 rounded-2xl p-5 border border-neutral-100"
                          >
                            <div className="font-display font-bold text-3xl text-neutral-900 mb-1">
                              {b.count.toLocaleString("fr-FR")}
                            </div>
                            <div className="text-sm font-semibold text-neutral-600">
                              {(b as any).category || "Bénéficiaire"}
                            </div>
                            {(b as any).gender &&
                              (b as any).gender !== "mixte" && (
                                <div className="text-xs text-neutral-400 mt-1">
                                  Cible :{" "}
                                  {(b as any).gender === "femme"
                                    ? "♀ Femmes"
                                    : "♂ Hommes"}
                                </div>
                              )}
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 p-4 bg-primary-50 rounded-xl text-center">
                        <span className="font-display font-bold text-2xl text-primary-700">
                          {totalBenef.toLocaleString("fr-FR")}
                        </span>
                        <span className="text-sm text-primary-600 ml-2">
                          bénéficiaires au total
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── Onglet Galerie ─── */}
                {activeTab === "gallery" && (
                  <div>
                    <h2 className="font-display text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
                      <ImageIcon className="w-6 h-6 text-primary-500" />
                      Galerie photos
                    </h2>
                    {project.gallery && project.gallery.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                        {project.gallery?.map((img, i) => (
                          <button
                            key={i}
                            onClick={() => setLightboxIndex(i)}
                            className="group relative aspect-video rounded-xl overflow-hidden
                                       bg-neutral-100 cursor-zoom-in"
                          >
                            <Image
                              src={img.src || ""}
                              alt={img.caption || ""}
                              fill
                              className="object-cover transition-transform duration-300
                                              group-hover:scale-105"
                              sizes="(max-width: 640px) 50vw, 33vw"
                            />
                            <div
                              className="absolute inset-0 bg-black/0 group-hover:bg-black/30
                                            transition-colors flex items-center justify-center"
                            >
                              <ExternalLink
                                className="w-6 h-6 text-white opacity-0
                                                        group-hover:opacity-100 transition-opacity"
                              />
                            </div>
                            {img.caption && (
                              <div
                                className="absolute bottom-0 inset-x-0 p-2 bg-black/60
                                              text-white text-xs opacity-0 group-hover:opacity-100
                                              transition-opacity"
                              >
                                {img.caption}
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16 text-neutral-400 bg-neutral-50 rounded-2xl">
                        <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-40" />
                        <p>Aucune photo disponible pour ce projet.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* ─── Onglet Documents ─── */}
                {activeTab === "documents" && (
                  <div>
                    <h2 className="font-display text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
                      <FileText className="w-6 h-6 text-primary-500" />
                      Documents du projet
                    </h2>
                    {project.documents && project.documents.length > 0 ? (
                      <div className="space-y-3">
                        {project.documents.map((doc, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-4 p-4 bg-white border
                                                   border-neutral-100 rounded-xl hover:border-primary-200
                                                   hover:shadow-sm transition-all group"
                          >
                            <div
                              className="w-10 h-10 bg-primary-50 rounded-xl flex items-center
                                            justify-center flex-shrink-0"
                            >
                              <FileText className="w-5 h-5 text-primary-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm text-neutral-900 truncate">
                                {doc.title}
                              </p>
                              <p className="text-xs text-neutral-400 capitalize">
                                {doc.type}
                              </p>
                            </div>
                            <a
                              href={doc.url}
                              download
                              className="flex items-center gap-1.5 text-xs font-semibold text-primary-600
                                         hover:text-primary-700 transition-colors flex-shrink-0"
                            >
                              <Download className="w-4 h-4" />
                              Télécharger
                            </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16 text-neutral-400 bg-neutral-50 rounded-2xl">
                        <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
                        <p>Aucun document disponible pour ce projet.</p>
                      </div>
                    )}
                    <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-700">
                        Certains documents peuvent être soumis à une demande
                        d'accès.{" "}
                        <Link
                          href="/contact"
                          className="underline font-semibold hover:no-underline"
                        >
                          Nous contacter
                        </Link>
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Sidebar ── */}
          <aside className="space-y-6">
            {/* Partenaires techniques */}
            {project.partners && project.partners.length > 0 && (
              <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-100">
                <h3 className="font-bold text-sm text-neutral-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Handshake className="w-4 h-4 text-primary-500" />
                  Partenaires techniques
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.partners.map((p) => (
                    <span
                      key={(p as any).name || (p as any).id}
                      className="text-xs bg-white border border-neutral-200
                                             text-neutral-700 px-2.5 py-1.5 rounded-lg font-medium"
                    >
                      {(p as any).name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Bailleurs */}
            <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-100">
              <h3 className="font-bold text-sm text-neutral-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-secondary-500" />
                Bailleurs de fonds
              </h3>
              <div className="space-y-3">
                {project.funders.map((f) => (
                  <div
                    key={f.name}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-neutral-800">
                        {f.name}
                      </p>
                      <p className="text-xs text-neutral-400 capitalize">
                        {(f as any).type || "Partenaire"}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "text-xs font-bold px-2.5 py-1 rounded-full",
                        domain.light,
                        domain.text,
                      )}
                    >
                      {(f as any).share || 0}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Partager */}
            <div className="bg-white rounded-2xl p-5 border border-neutral-100">
              <h3 className="font-bold text-sm text-neutral-800 mb-3">
                Partager ce projet
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    label: "Facebook",
                    href: `https://facebook.com/sharer?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`,
                    color: "bg-[#1877F2] hover:bg-[#166FE5]",
                  },
                  {
                    label: "Twitter",
                    href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(project.title)}&url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`,
                    color: "bg-[#1DA1F2] hover:bg-[#1a94da]",
                  },
                  {
                    label: "WhatsApp",
                    href: `https://wa.me/?text=${encodeURIComponent(project.title + " " + (typeof window !== "undefined" ? window.location.href : ""))}`,
                    color: "bg-[#25D366] hover:bg-[#20bd5a]",
                  },
                  {
                    label: "LinkedIn",
                    href: `https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`,
                    color: "bg-[#0A66C2] hover:bg-[#0958a8]",
                  },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "text-xs text-center font-semibold text-white py-2.5 rounded-lg transition-colors",
                      s.color,
                    )}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
              <button
                onClick={handleShare}
                className="w-full mt-2 text-xs font-semibold text-neutral-600 py-2.5
                           bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors"
              >
                {copySuccess ? "✅ Lien copié !" : "🔗 Copier le lien"}
              </button>
            </div>

            {/* CTA Soutenir */}
            <div className="bg-primary-500 rounded-2xl p-5 text-white">
              <h3 className="font-display font-bold text-lg mb-2">
                Collaborer sur ce projet
              </h3>
              <p className="text-sm text-primary-100 mb-4 leading-relaxed">
                Vous souhaitez devenir partenaire ou bénévole sur ce projet ?
                Contactez-nous.
              </p>
              <Link
                href="/work-with-us/collaboration"
                className="w-full flex items-center justify-center gap-2
                                             bg-white text-primary-700 py-3 rounded-xl font-bold text-sm
                                             hover:bg-primary-50 transition-colors"
              >
                🤝 Devenir partenaire
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* ── Projets connexes ── */}
      {relatedProjects.length > 0 && (
        <section className="bg-neutral-50 border-t border-neutral-100 py-16">
          <div className="container-mrjc">
            <h2 className="font-display text-2xl font-bold text-neutral-900 mb-8">
              Autres projets dans ce domaine
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProjects.map((p) => {
                const s = STATUS_CONFIG[p.status];
                return (
                  <Link
                    key={p.id}
                    href={`/projects/${p.slug}`}
                    className="group bg-white rounded-2xl border border-neutral-100 overflow-hidden
                               hover:border-primary-200 hover:shadow-md transition-all duration-200"
                  >
                    <div className="relative h-40 bg-neutral-100">
                      <Image
                        src={p.coverImage}
                        alt={p.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, 33vw"
                      />
                      <div className="absolute top-3 left-3">
                        <span
                          className={cn(
                            "text-xs font-semibold px-2.5 py-1 rounded-full border",
                            s.cls,
                          )}
                        >
                          {s.label}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3
                        className="font-bold text-sm text-neutral-900 line-clamp-2
                                     group-hover:text-primary-700 transition-colors"
                      >
                        {p.title}
                      </h3>
                      <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                        {p.excerpt}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={project.gallery}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
