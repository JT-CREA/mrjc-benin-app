import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  Download,
  Calendar,
  FileText,
  ArrowRight,
  Star,
} from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { siteConfig } from "@/config/site.config";
import DownloadButton from "@/components/ui/DownloadButton";

/* ── Métadonnées ── */
export const metadata: Metadata = {
  title: `Fiches & Guides Techniques | ${siteConfig.seo.defaultTitle}`,
  description:
    "Guides pratiques, fiches techniques et outils méthodologiques développés par MRJC-BÉNIN pour soutenir les praticiens du développement rural.",
  keywords: [
    "guides techniques MRJC",
    "fiches pratiques développement rural Bénin",
    "manuel maraîchage",
    "guide alphabétisation",
    "outil genre Bénin",
  ],
  openGraph: {
    title: "Fiches & Guides Techniques — MRJC-BÉNIN",
    description:
      "Ressources pratiques téléchargeables pour les acteurs du développement rural.",
    url: `${siteConfig.url}/resources/technical-guides`,
  },
};

/* ── Données ── */
const GUIDES = [
  {
    id: "g1",
    title: "Manuel Pratique de Maraîchage Durable",
    category: "Agriculture",
    domain: "Conseil Agricole",
    description:
      "Guide complet sur les techniques de maraîchage respectueuses de l'environnement — préparation du sol, gestion de l'eau, fertilisation biologique, protection phytosanitaire naturelle.",
    fileSize: "4.5 Mo",
    fileType: "PDF",
    pages: 72,
    year: 2023,
    downloads: 612,
    featured: true,
    languages: ["Français", "Fon"],
    url: "/assets/docs/guide-maraichage.pdf",
    cover: "/assets/images/guide-maraichage.jpg",
    tags: ["Agriculture", "Maraîchage", "Environnement"],
  },
  {
    id: "g2",
    title: "Guide Méthodologique Alphabétisation Fonctionnelle",
    category: "Éducation",
    domain: "Alphabétisation",
    description:
      "Méthode d'enseignement des langues nationales (Fon, Baatonum, Dendi) adaptée aux adultes ruraux. Comprend les plans de séance, outils d'évaluation et supports visuels.",
    fileSize: "6.1 Mo",
    fileType: "PDF",
    pages: 88,
    year: 2022,
    downloads: 287,
    featured: true,
    languages: ["Français", "Fon", "Baatonum", "Dendi"],
    url: "/assets/docs/guide-alphabetisation.pdf",
    cover: "/assets/images/guide-alpha.jpg",
    tags: ["Alphabétisation", "Éducation", "Langues nationales"],
  },
  {
    id: "g3",
    title: "Outil d'Analyse Genre et Développement",
    category: "Genre",
    domain: "Autonomisation des Femmes",
    description:
      "Cadre analytique et outils pratiques pour intégrer la dimension genre dans la conception, le suivi et l'évaluation des projets de développement.",
    fileSize: "2.8 Mo",
    fileType: "PDF",
    pages: 54,
    year: 2023,
    downloads: 189,
    featured: false,
    languages: ["Français"],
    url: "/assets/docs/outil-genre.pdf",
    cover: "/assets/images/guide-genre.jpg",
    tags: ["Genre", "Femmes", "Analyse"],
  },
  {
    id: "g4",
    title: "Guide Nutrition Communautaire — 1000 Premiers Jours",
    category: "Santé",
    domain: "Santé Communautaire",
    description:
      "Programme de nutrition basé sur la fenêtre des 1000 premiers jours. Contient les fiches de suivi, conseils d'allaitement, diversification alimentaire et WASH.",
    fileSize: "3.4 Mo",
    fileType: "PDF",
    pages: 60,
    year: 2022,
    downloads: 324,
    featured: true,
    languages: ["Français", "Fon"],
    url: "/assets/docs/guide-nutrition.pdf",
    cover: "/assets/images/guide-nutrition.jpg",
    tags: ["Nutrition", "Santé", "Enfants"],
  },
  {
    id: "g5",
    title: "Manuel de Facilitation — Médiation Communautaire",
    category: "Social",
    domain: "Intermédiation Sociale",
    description:
      "Techniques de facilitation, gestion des conflits et dynamiques de groupe pour les animateurs de développement communautaire en milieu rural.",
    fileSize: "2.1 Mo",
    fileType: "PDF",
    pages: 42,
    year: 2023,
    downloads: 143,
    featured: false,
    languages: ["Français"],
    url: "/assets/docs/manuel-mediation.pdf",
    cover: "/assets/images/guide-social.jpg",
    tags: ["Médiation", "Communauté", "Facilitation"],
  },
  {
    id: "g6",
    title: "Fiche Technique — Plan Local de Développement (PLD)",
    category: "Gouvernance",
    domain: "Intermédiation Sociale",
    description:
      "Processus participatif de planification locale, étapes, outils de diagnostic, priorisation et suivi des plans de développement des communautés.",
    fileSize: "1.6 Mo",
    fileType: "PDF",
    pages: 32,
    year: 2021,
    downloads: 98,
    featured: false,
    languages: ["Français"],
    url: "/assets/docs/fiche-pld.pdf",
    cover: "/assets/images/guide-gouvernance.jpg",
    tags: ["Gouvernance", "Planification", "Local"],
  },
  {
    id: "g7",
    title: "Guide Suivi-Évaluation — Projets de Développement Rural",
    category: "Méthodologie",
    domain: "Transversal",
    description:
      "Cadre de S&E participatif : définition des indicateurs SMART, collecte de données, analyses de performance, rapportage et apprentissage organisationnel.",
    fileSize: "3.9 Mo",
    fileType: "PDF",
    pages: 68,
    year: 2023,
    downloads: 412,
    featured: true,
    languages: ["Français"],
    url: "/assets/docs/guide-se.pdf",
    cover: "/assets/images/guide-se.jpg",
    tags: ["S&E", "Méthodologie", "Gestion de projet"],
  },
  {
    id: "g8",
    title: "Kit Entrepreneuriat Rural pour Femmes",
    category: "Entrepreneuriat",
    domain: "Autonomisation des Femmes",
    description:
      "Outils pratiques pour la création, la gestion et le développement d'activités génératrices de revenus (AGR) par les femmes en milieu rural.",
    fileSize: "2.4 Mo",
    fileType: "PDF",
    pages: 48,
    year: 2023,
    downloads: 276,
    featured: false,
    languages: ["Français", "Fon"],
    url: "/assets/docs/kit-entrepreneuriat-femmes.pdf",
    cover: "/assets/images/guide-entrepreneuriat.jpg",
    tags: ["Entrepreneuriat", "Femmes", "AGR"],
  },
];

const CATEGORIES = [
  "Tous",
  "Agriculture",
  "Éducation",
  "Santé",
  "Genre",
  "Social",
  "Gouvernance",
  "Méthodologie",
  "Entrepreneuriat",
];

const CATEGORY_COLORS: Record<string, string> = {
  Agriculture: "bg-green-100 text-green-700",
  Éducation: "bg-blue-100 text-blue-700",
  Santé: "bg-red-100 text-red-700",
  Genre: "bg-pink-100 text-pink-700",
  Social: "bg-orange-100 text-orange-700",
  Gouvernance: "bg-purple-100 text-purple-700",
  Méthodologie: "bg-gray-100 text-gray-700",
  Entrepreneuriat: "bg-yellow-100 text-yellow-700",
};

/* ── Guide Card ── */
function GuideCard({ guide }: { guide: (typeof GUIDES)[0] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group flex flex-col">
      {/* Couverture visuelle */}
      <div className="relative h-40 bg-gradient-to-br from-primary-700 to-primary-900 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <BookOpen className="w-24 h-24 text-white" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${CATEGORY_COLORS[guide.category] || "bg-gray-100 text-gray-700"}`}
          >
            {guide.category}
          </span>
          {guide.featured && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-yellow-400 text-yellow-900 flex items-center gap-1">
              <Star className="w-3 h-3" /> Phare
            </span>
          )}
        </div>
        {/* Info bas */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span className="text-white/80 text-xs flex items-center gap-1">
            <FileText className="w-3 h-3" />
            {guide.fileType} • {guide.pages} pages • {guide.fileSize}
          </span>
          <span className="text-white/70 text-xs flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {guide.year}
          </span>
        </div>
      </div>

      {/* Contenu */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-bold text-gray-900 text-base mb-2 line-clamp-2 group-hover:text-primary-700 transition-colors">
          {guide.title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">
          {guide.description}
        </p>

        {/* Langues */}
        <div className="flex flex-wrap gap-1 mb-4">
          {guide.languages.map((lang) => (
            <span
              key={lang}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
            >
              🌐 {lang}
            </span>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {guide.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs border border-gray-200 text-gray-500 px-2 py-0.5 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Download className="w-3.5 h-3.5" />
            {guide.downloads.toLocaleString()} télécharg.
          </span>
          <DownloadButton
            {...({
              url: guide.url,
              filename: `${guide.title.toLowerCase().replace(/\s+/g, "-")}.pdf`,
              resourceId: guide.id,
              label: "Télécharger",
              size: guide.fileSize || "Unknown",
              className: "",
            } as any)}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Page ── */
export default function TechnicalGuidesPage() {
  const featuredGuides = GUIDES.filter((g) => g.featured);
  const totalDownloads = GUIDES.reduce((s, g) => s + g.downloads, 0);

  return (
    <>
      <PageHeader
        title="Fiches & Guides Techniques"
        subtitle="Ressources pratiques et outils méthodologiques développés sur le terrain par les équipes MRJC-BÉNIN"
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Ressources", href: "/resources" },
          { label: "Guides Techniques" },
        ]}
        stats={[
          { label: "Guides disponibles", value: `${GUIDES.length}` },
          {
            label: "Téléchargements",
            value: `${totalDownloads.toLocaleString()}+`,
          },
          { label: "Langues", value: "4" },
          { label: "Libre accès", value: "100%" },
        ]}
      />

      <div className="container-mrjc py-16 space-y-16">
        {/* Guides phares */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="section-tag">⭐ Documents phares</div>
              <h2 className="text-2xl font-display font-bold text-gray-900 mt-2">
                Guides les plus consultés
              </h2>
              <p className="text-gray-600 mt-1">
                Nos ressources les plus demandées par les praticiens
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredGuides.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        </section>

        {/* Tous les guides */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="section-tag">📚 Médiathèque complète</div>
              <h2 className="text-2xl font-display font-bold text-gray-900 mt-2">
                Tous les guides ({GUIDES.length})
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {GUIDES.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        </section>

        {/* Catégories */}
        <section className="bg-gray-50 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="section-tag mx-auto">📂 Domaines thématiques</div>
            <h2 className="text-2xl font-display font-bold text-gray-900 mt-3">
              Explorer par catégorie
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {CATEGORIES.filter((c) => c !== "Tous").map((cat) => {
              const count = GUIDES.filter((g) => g.category === cat).length;
              return (
                <div
                  key={cat}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border cursor-pointer hover:shadow-sm transition-all ${CATEGORY_COLORS[cat] || "bg-gray-100 text-gray-700"}`}
                >
                  {cat}
                  {count > 0 && (
                    <span className="bg-white/60 text-xs px-1.5 py-0.5 rounded-full font-bold">
                      {count}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Proposer une ressource */}
        <section className="bg-primary-900 rounded-3xl p-8 md:p-12 text-center text-white">
          <div className="max-w-2xl mx-auto">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-display font-bold mb-3">
              Vous avez une ressource à partager ?
            </h2>
            <p className="text-primary-200 mb-6">
              MRJC-BÉNIN est ouvert à la mutualisation des savoirs. Si vous avez
              développé des outils pertinents pour le développement rural
              béninois, contactez-nous pour les publier.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-primary-800 font-semibold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors"
            >
              Soumettre une ressource
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
