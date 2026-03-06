"use client";

/**
 * Composant — PartnersClient
 * Rendu côté client de la page /partners :
 * - Filtres par catégorie
 * - Grille animée avec logos
 * - Détail partenaire au survol
 * - Section témoignages partenaires
 * - Appel à candidature partenariat
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Globe,
  ExternalLink,
  Handshake,
  Building2,
  Landmark,
  Users,
  ArrowRight,
  Star,
} from "lucide-react";

interface Partner {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  url: string;
  category: string;
  country: string;
  featured: boolean;
}

interface PartnersClientProps {
  partners: Partner[];
}

const CATEGORY_CONFIG: Record<
  string,
  { label: string; icon: React.ElementType; color: string; bg: string }
> = {
  all: {
    label: "Tous",
    icon: Globe,
    color: "text-gray-700",
    bg: "bg-gray-100",
  },
  bailleur: {
    label: "Bailleurs de fonds",
    icon: Building2,
    color: "text-blue-700",
    bg: "bg-blue-50",
  },
  "agence-onu": {
    label: "Agences ONU",
    icon: Globe,
    color: "text-teal-700",
    bg: "bg-teal-50",
  },
  technique: {
    label: "Partenaires techniques",
    icon: Handshake,
    color: "text-purple-700",
    bg: "bg-purple-50",
  },
  institution: {
    label: "Institutions",
    icon: Landmark,
    color: "text-orange-700",
    bg: "bg-orange-50",
  },
  ong: {
    label: "ONG / Associations",
    icon: Users,
    color: "text-green-700",
    bg: "bg-green-50",
  },
};

const PARTNER_TESTIMONIALS = [
  {
    quote:
      "MRJC-BÉNIN est un partenaire d'excellence, capable de transformer les ressources en impacts réels et mesurables sur le terrain.",
    author: "Représentant UE au Bénin",
    org: "Délégation de l'Union Européenne au Bénin",
    initials: "UE",
    color: "bg-blue-600",
  },
  {
    quote:
      "La rigueur de gestion et la proximité communautaire de MRJC-BÉNIN en font un partenaire de confiance pour nos programmes.",
    author: "Coordonnateur UNICEF",
    org: "UNICEF Bénin",
    initials: "UN",
    color: "bg-teal-600",
  },
  {
    quote:
      "Un partenaire fiable qui apporte une vraie valeur ajoutée dans l'autonomisation des femmes rurales du Bénin.",
    author: "Responsable de programme",
    org: "ONU Femmes Bénin",
    initials: "ONU",
    color: "bg-purple-600",
  },
];

const PARTNERSHIP_MODALITIES = [
  {
    icon: "💰",
    title: "Co-financement",
    desc: "Apport financier conjoint pour des projets à grande échelle",
  },
  {
    icon: "🔧",
    title: "Assistance technique",
    desc: "Partage d'expertise et renforcement de capacités",
  },
  {
    icon: "🤝",
    title: "Sous-contrat",
    desc: "Exécution de composantes spécifiques de programmes",
  },
  {
    icon: "📊",
    title: "Consortium",
    desc: "Réponses conjointes à des appels à projets compétitifs",
  },
  {
    icon: "🔬",
    title: "Recherche & Données",
    desc: "Accès à nos données pour la recherche et l'évaluation",
  },
  {
    icon: "🏫",
    title: "Formation",
    desc: "Renforcement mutuel des compétences des équipes",
  },
];

export default function PartnersClient({ partners }: PartnersClientProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const categories = [
    "all",
    ...Array.from(new Set(partners.map((p) => p.category))),
  ];

  const filtered =
    activeCategory === "all"
      ? partners
      : partners.filter((p) => p.category === activeCategory);

  const featured = partners.filter((p) => p.featured);

  return (
    <>
      {/* ── Partenaires vedettes ── */}
      <section className="section-mrjc bg-white">
        <div className="container-mrjc">
          <div className="text-center mb-10">
            <span className="section-tag">Partenaires Stratégiques</span>
            <h2 className="section-title mt-2">Nos Partenaires Principaux</h2>
            <p className="section-desc">
              Ces organisations partagent notre vision d'un Bénin rural prospère
              et autonome
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {featured.map((p, i) => (
              <motion.a
                key={p.id}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -4, scale: 1.03 }}
                className="group flex flex-col items-center justify-center gap-2 bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-lg hover:border-primary-200 transition-all"
              >
                <div className="w-16 h-16 flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden">
                  <img
                    src={p.logo}
                    alt={p.name}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                      (e.target as HTMLImageElement).parentElement!.innerHTML =
                        `<span class="text-xl font-bold text-primary-600">${p.shortName}</span>`;
                    }}
                  />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-gray-900">
                    {p.shortName}
                  </p>
                  <p className="text-2xs text-gray-400">{p.country}</p>
                </div>
                <ExternalLink className="w-3 h-3 text-gray-300 group-hover:text-primary-400 transition-colors" />
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Grille complète avec filtres ── */}
      <section className="section-mrjc bg-gray-50">
        <div className="container-mrjc">
          <div className="text-center mb-8">
            <span className="section-tag">Tous les Partenaires</span>
            <h2 className="section-title mt-2">Réseau Complet</h2>
          </div>

          {/* Filtres */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((cat) => {
              const cfg = CATEGORY_CONFIG[cat] || {
                label: cat,
                icon: Globe,
                color: "text-gray-700",
                bg: "bg-gray-100",
              };
              const Icon = cfg.icon;
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary-600 text-white shadow-md"
                      : `${cfg.bg} ${cfg.color} hover:opacity-80`
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cfg.label || cat}
                  <span
                    className={`text-xs ${isActive ? "text-primary-200" : "text-gray-400"}`}
                  >
                    (
                    {
                      (cat === "all"
                        ? partners
                        : partners.filter((p) => p.category === cat)
                      ).length
                    }
                    )
                  </span>
                </button>
              );
            })}
          </div>

          {/* Grille */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((p, i) => (
                <motion.a
                  key={p.id}
                  layout
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.03 }}
                  whileHover={{ y: -3, scale: 1.02 }}
                  onHoverStart={() => setHoveredId(p.id)}
                  onHoverEnd={() => setHoveredId(null)}
                  className="group relative flex flex-col items-center justify-center gap-2 bg-white border border-gray-100 rounded-xl p-3 hover:shadow-md hover:border-primary-200 transition-all"
                >
                  <div className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
                    <img
                      src={p.logo}
                      alt={p.name}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                        (
                          e.target as HTMLImageElement
                        ).parentElement!.innerHTML =
                          `<span class="text-sm font-bold text-primary-600">${p.shortName}</span>`;
                      }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-gray-800 truncate max-w-full">
                      {p.shortName || p.name}
                    </p>
                  </div>
                  {/* Tooltip */}
                  <AnimatePresence>
                    {hoveredId === p.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap z-10 shadow-lg"
                      >
                        {p.name}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-4 border-transparent border-t-gray-900" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.a>
              ))}
            </AnimatePresence>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              Aucun partenaire dans cette catégorie
            </div>
          )}
        </div>
      </section>

      {/* ── Témoignages partenaires ── */}
      <section className="section-mrjc bg-white">
        <div className="container-mrjc">
          <div className="text-center mb-10">
            <span className="section-tag">Ce qu'ils disent</span>
            <h2 className="section-title mt-2">Témoignages Partenaires</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {PARTNER_TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
              >
                <div className="flex items-center gap-1 text-yellow-400 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-700 text-sm leading-relaxed italic mb-6">
                  "{t.quote}"
                </blockquote>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 ${t.color} rounded-xl flex items-center justify-center text-white text-xs font-bold`}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {t.author}
                    </p>
                    <p className="text-xs text-gray-500">{t.org}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Modalités de partenariat ── */}
      <section className="section-mrjc bg-primary-50">
        <div className="container-mrjc">
          <div className="text-center mb-10">
            <span className="section-tag">Collaborer avec nous</span>
            <h2 className="section-title mt-2">Modalités de Partenariat</h2>
            <p className="section-desc">
              Plusieurs façons de collaborer selon vos objectifs
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {PARTNERSHIP_MODALITIES.map((mod, i) => (
              <motion.div
                key={mod.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-white rounded-2xl p-5 border border-primary-100 hover:shadow-md transition-all"
              >
                <div className="text-3xl mb-3">{mod.icon}</div>
                <h3 className="font-bold text-gray-900 mb-1">{mod.title}</h3>
                <p className="text-sm text-gray-600">{mod.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/work-with-us/collaboration"
              className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4"
            >
              Proposer un partenariat <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
