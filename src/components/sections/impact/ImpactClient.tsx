"use client";
/**
 * Page — Notre Impact
 * Route: /impact
 * Dashboard interactif avec :
 * - KPIs animés par domaine
 * - Carte des zones d'intervention
 * - Alignement ODD (Objectifs Développement Durable)
 * - Évolution historique (timeline chiffres)
 * - Témoignages impact
 * - Appel à l'action partenariat
 */

import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Users,
  MapPin,
  Award,
  BookOpen,
  Heart,
  Sprout,
  Shield,
  ChevronRight,
  Target,
  Globe2,
  ArrowRight,
} from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";

// ─── Données Impact ───────────────────────────────────────────────────────────
const GLOBAL_KPIS = [
  {
    value: 85000,
    label: "Bénéficiaires directs",
    suffix: "+",
    icon: Users,
    color: "text-primary-600",
    bg: "bg-primary-50",
    border: "border-primary-200",
  },
  {
    value: 47,
    label: "Projets réalisés",
    suffix: "",
    icon: Target,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  {
    value: 230,
    label: "Villages touchés",
    suffix: "+",
    icon: MapPin,
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
  {
    value: 38,
    label: "Années d'expérience",
    suffix: "",
    icon: Award,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },
  {
    value: 35,
    label: "Partenaires actifs",
    suffix: "+",
    icon: Globe2,
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
  },
  {
    value: 12,
    label: "Départements couverts",
    suffix: "/12",
    icon: Shield,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
  },
];

const DOMAIN_IMPACTS = [
  {
    id: "agriculture",
    icon: Sprout,
    color: "primary",
    title: "Conseil Agricole & Entrepreneuriat",
    metrics: [
      { value: 6000, suffix: "+", label: "Producteurs formés" },
      { value: 45, suffix: "%", label: "Augmentation revenus" },
      { value: 15, suffix: "+", label: "Filières appuyées" },
      { value: 320, suffix: "", label: "Groupements structurés" },
    ],
    description:
      "Renforcement des capacités des agriculteurs en techniques agro-écologiques et gestion d'entreprises agricoles.",
    sdgs: [1, 2, 8, 12],
    progress: 85,
  },
  {
    id: "sante",
    icon: Heart,
    color: "red",
    title: "Santé Communautaire & Nutrition",
    metrics: [
      { value: 8500, suffix: "+", label: "Enfants suivis" },
      { value: 240, suffix: "", label: "Agents formés" },
      { value: 35, suffix: "%", label: "Réduction malnutrition" },
      { value: 48, suffix: "", label: "Villages couverts" },
    ],
    description:
      "Promotion de la santé maternelle, infantile et nutrition dans les zones rurales du Bénin.",
    sdgs: [2, 3, 5],
    progress: 78,
  },
  {
    id: "alphabetisation",
    icon: BookOpen,
    color: "blue",
    title: "Alphabétisation & Éducation",
    metrics: [
      { value: 3604, suffix: "", label: "Personnes alphabétisées" },
      { value: 85, suffix: "%", label: "Taux de rétention" },
      { value: 48, suffix: "", label: "Centres fonctionnels" },
      { value: 3, suffix: "", label: "Langues locales" },
    ],
    description:
      "Lutte contre l'analphabétisme et promotion de l'éducation non formelle pour adultes et jeunes.",
    sdgs: [4, 5, 10],
    progress: 72,
  },
  {
    id: "femmes",
    icon: Users,
    color: "pink",
    title: "Autonomisation des Femmes",
    metrics: [
      { value: 800, suffix: "+", label: "Leaders formées" },
      { value: 25, suffix: "%", label: "Élues locales" },
      { value: 350, suffix: "", label: "Entreprises créées" },
      { value: 1500, suffix: "+", label: "Bénéficiaires microcrédit" },
    ],
    description:
      "Renforcement du leadership féminin et de l'entrepreneuriat des femmes rurales.",
    sdgs: [1, 5, 8, 10],
    progress: 90,
  },
  {
    id: "intermediation",
    icon: Shield,
    color: "purple",
    title: "Intermédiation Sociale",
    metrics: [
      { value: 120, suffix: "+", label: "OCB renforcées" },
      { value: 85, suffix: "", label: "Conflits médiés" },
      { value: 45, suffix: "", label: "Plans locaux adoptés" },
      { value: 18, suffix: "", label: "Communes appuyées" },
    ],
    description:
      "Renforcement de la cohésion sociale et de la gouvernance locale participative.",
    sdgs: [10, 11, 16, 17],
    progress: 68,
  },
];

const SDG_DATA: Record<
  number,
  { emoji: string; label: string; color: string }
> = {
  1: { emoji: "🟥", label: "Pas de pauvreté", color: "#E5243B" },
  2: { emoji: "🟨", label: "Faim zéro", color: "#DDA63A" },
  3: { emoji: "🟩", label: "Bonne santé", color: "#4C9F38" },
  4: { emoji: "🟥", label: "Éducation de qualité", color: "#C5192D" },
  5: { emoji: "🟧", label: "Égalité des sexes", color: "#FF3A21" },
  8: { emoji: "🟥", label: "Travail décent", color: "#A21942" },
  10: { emoji: "🟪", label: "Inégalités réduites", color: "#DD1367" },
  11: { emoji: "🟠", label: "Villes durables", color: "#FD9D24" },
  12: { emoji: "🟡", label: "Consommation responsable", color: "#BF8B2E" },
  16: { emoji: "🔵", label: "Paix & Justice", color: "#00689D" },
  17: { emoji: "🔵", label: "Partenariats", color: "#19486A" },
};

const TIMELINE = [
  {
    year: 1985,
    label: "Fondation",
    desc: "Création de MRJC-BÉNIN",
    value: "0 bénéficiaires",
  },
  {
    year: 1995,
    label: "10 ans",
    desc: "Premiers projets agricoles",
    value: "5 000 bénéf.",
  },
  {
    year: 2005,
    label: "20 ans",
    desc: "Expansion santé communautaire",
    value: "18 000 bénéf.",
  },
  {
    year: 2015,
    label: "30 ans",
    desc: "Couverture nationale élargie",
    value: "45 000 bénéf.",
  },
  {
    year: 2023,
    label: "Aujourd'hui",
    desc: "Impact transformationnel",
    value: "85 000+ bénéf.",
  },
];

const ZONES = [
  { dept: "Atacora", projects: 8, color: "bg-primary-500" },
  { dept: "Borgou", projects: 12, color: "bg-primary-600" },
  { dept: "Donga", projects: 6, color: "bg-primary-400" },
  { dept: "Zou", projects: 9, color: "bg-green-600" },
  { dept: "Mono", projects: 5, color: "bg-green-500" },
  { dept: "Atlantique", projects: 7, color: "bg-blue-500" },
];

const COLOR_MAP: Record<
  string,
  { ring: string; bg: string; text: string; bar: string }
> = {
  primary: {
    ring: "ring-primary-300",
    bg: "bg-primary-50",
    text: "text-primary-700",
    bar: "bg-primary-500",
  },
  red: {
    ring: "ring-red-300",
    bg: "bg-red-50",
    text: "text-red-700",
    bar: "bg-red-500",
  },
  blue: {
    ring: "ring-blue-300",
    bg: "bg-blue-50",
    text: "text-blue-700",
    bar: "bg-blue-500",
  },
  pink: {
    ring: "ring-pink-300",
    bg: "bg-pink-50",
    text: "text-pink-700",
    bar: "bg-pink-500",
  },
  purple: {
    ring: "ring-purple-300",
    bg: "bg-purple-50",
    text: "text-purple-700",
    bar: "bg-purple-500",
  },
};

// ─── Hook compteur animé ──────────────────────────────────────────────────────
function useAnimatedCounter(target: number, inView: boolean, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = (target / duration) * 16;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return count;
}

function AnimatedKPI({
  value,
  suffix,
  label,
  icon: Icon,
  color,
  bg,
  border,
}: (typeof GLOBAL_KPIS)[0]) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const count = useAnimatedCounter(value, inView);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4, shadow: "lg" }}
      className={`bg-white rounded-2xl p-6 border ${border} shadow-sm hover:shadow-lg transition-all`}
    >
      <div
        className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center mb-4`}
      >
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div className={`text-4xl font-bold font-display ${color} mb-1`}>
        {count.toLocaleString("fr-FR")}
        {suffix}
      </div>
      <div className="text-sm text-gray-600 font-medium">{label}</div>
    </motion.div>
  );
}

// ─── Carte Bénin SVG stylisée ─────────────────────────────────────────────────
function BeninMap() {
  return (
    <div className="relative bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl p-8 flex flex-col items-center">
      <div className="text-center mb-6">
        <h3 className="font-bold text-gray-900 text-lg">Présence Nationale</h3>
        <p className="text-sm text-gray-500">12/12 Départements couverts</p>
      </div>
      {/* Représentation schématique Bénin */}
      <div className="relative w-48 h-80">
        {/* Nord */}
        <div className="absolute top-0 left-4 right-4">
          <div className="bg-primary-600 rounded-t-3xl px-3 py-3 text-center text-white text-xs font-medium shadow-md">
            Alibori
          </div>
          <div className="grid grid-cols-2 gap-1 mt-1">
            <div className="bg-primary-500 rounded-lg py-2 text-center text-white text-xs shadow">
              Atacora
            </div>
            <div className="bg-primary-400 rounded-lg py-2 text-center text-white text-xs shadow">
              Borgou
            </div>
          </div>
        </div>
        {/* Centre */}
        <div className="absolute top-28 left-2 right-2">
          <div className="grid grid-cols-2 gap-1">
            <div className="bg-green-500 rounded-lg py-2 text-center text-white text-xs shadow">
              Donga
            </div>
            <div className="bg-green-400 rounded-lg py-2 text-center text-white text-xs shadow">
              Collines
            </div>
          </div>
          <div className="grid grid-cols-2 gap-1 mt-1">
            <div className="bg-blue-500 rounded-lg py-2 text-center text-white text-xs shadow">
              Zou
            </div>
            <div className="bg-blue-400 rounded-lg py-2 text-center text-white text-xs shadow">
              Plateau
            </div>
          </div>
        </div>
        {/* Centre-Sud */}
        <div className="absolute top-52 left-2 right-2">
          <div className="grid grid-cols-3 gap-1">
            <div className="bg-orange-500 rounded-lg py-2 text-center text-white text-xs shadow">
              Mono
            </div>
            <div className="bg-orange-400 rounded-lg py-2 text-center text-white text-xs shadow">
              Couffo
            </div>
            <div className="bg-orange-300 rounded-lg py-2 text-center text-white text-xs shadow">
              Ouémé
            </div>
          </div>
        </div>
        {/* Sud */}
        <div className="absolute bottom-0 left-4 right-4">
          <div className="grid grid-cols-2 gap-1">
            <div className="bg-red-500 rounded-lg py-2 text-center text-white text-xs shadow">
              Atlantique
            </div>
            <div className="bg-red-400 rounded-lg py-2 text-center text-white text-xs shadow">
              Littoral
            </div>
          </div>
        </div>
        {/* Points d'animation */}
        {[
          { top: "15%", left: "30%" },
          { top: "35%", left: "60%" },
          { top: "55%", left: "40%" },
          { top: "70%", left: "20%" },
          { top: "80%", left: "55%" },
        ].map((pos, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-yellow-400 rounded-full border-2 border-white shadow-lg z-10"
            style={{ top: pos.top, left: pos.left }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
          />
        ))}
      </div>
      {/* Légende */}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {[
          ["Zones prioritaires", "bg-primary-500"],
          ["Zones d'expansion", "bg-green-500"],
          ["Zones d'appui", "bg-blue-500"],
        ].map(([label, bg]) => (
          <div
            key={label}
            className="flex items-center gap-1.5 text-xs text-gray-600"
          >
            <span className={`w-3 h-3 rounded-full ${bg}`} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Composant ODD ────────────────────────────────────────────────────────────
function SDGBadge({ number }: { number: number }) {
  const sdg = SDG_DATA[number];
  if (!sdg) return null;
  return (
    <motion.div
      whileHover={{ scale: 1.1, y: -2 }}
      title={sdg.label}
      className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold cursor-pointer shadow-sm"
      style={{ backgroundColor: sdg.color }}
    >
      {number}
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ImpactClient() {
  const [activeTab, setActiveTab] = useState("all");

  const activeDomains =
    activeTab === "all"
      ? DOMAIN_IMPACTS
      : DOMAIN_IMPACTS.filter((d) => d.id === activeTab);

  return (
    <>
      <PageHeader
        title="Notre Impact"
        subtitle="Des décennies d'engagement mesurable pour le Bénin rural"
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Notre Impact" },
        ]}
        stats={[
          { label: "Bénéficiaires", value: "85 000+" },
          { label: "Projets", value: "47" },
          { label: "Années", value: "38+" },
        ]}
      />

      {/* ── Section KPIs globaux ── */}
      <section className="section-mrjc bg-white">
        <div className="container-mrjc">
          <div className="text-center mb-12">
            <span className="section-tag">Chiffres Clés</span>
            <h2 className="section-title mt-2">Impact en Chiffres</h2>
            <p className="section-desc">
              38 ans d'action transformatrice sur le terrain au Bénin
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {GLOBAL_KPIS.map((kpi) => (
              <AnimatedKPI key={kpi.label} {...kpi} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Carte géographique ── */}
      <section className="section-mrjc bg-gray-50">
        <div className="container-mrjc">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="section-tag">Présence Géographique</span>
              <h2 className="section-title mt-2">Implantation Nationale</h2>
              <p className="text-gray-600 mt-4 leading-relaxed">
                MRJC-BÉNIN est présente dans les 12 départements du Bénin, avec
                une concentration particulière dans les zones rurales les plus
                vulnérables du Nord et du Centre.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {ZONES.map((z) => (
                  <div
                    key={z.dept}
                    className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm border border-gray-100"
                  >
                    <div className={`w-2 h-8 ${z.color} rounded-full`} />
                    <div>
                      <div className="font-semibold text-sm text-gray-900">
                        {z.dept}
                      </div>
                      <div className="text-xs text-gray-500">
                        {z.projects} projets
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/projects"
                className="btn-primary mt-8 inline-flex items-center gap-2"
              >
                Voir tous les projets <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <BeninMap />
          </div>
        </div>
      </section>

      {/* ── Impact par Domaine ── */}
      <section className="section-mrjc bg-white">
        <div className="container-mrjc">
          <div className="text-center mb-10">
            <span className="section-tag">Par Domaine</span>
            <h2 className="section-title mt-2">Impact Sectoriel</h2>
          </div>

          {/* Filtres */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === "all" ? "bg-primary-600 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              Tous les domaines
            </button>
            {DOMAIN_IMPACTS.map((d) => (
              <button
                key={d.id}
                onClick={() => setActiveTab(d.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === d.id ? "bg-primary-600 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {d.title.split(" ")[0]}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {activeDomains.map((domain, i) => {
                const Icon = domain.icon;
                const c = COLOR_MAP[domain.color];
                return (
                  <motion.div
                    key={domain.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                    className={`bg-white rounded-2xl border shadow-sm hover:shadow-lg transition-all overflow-hidden ring-1 ${c.ring}`}
                  >
                    {/* Header */}
                    <div className={`${c.bg} p-5`}>
                      <div
                        className={`w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm mb-3`}
                      >
                        <Icon className={`w-5 h-5 ${c.text}`} />
                      </div>
                      <h3 className={`font-bold text-sm ${c.text}`}>
                        {domain.title}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        {domain.description}
                      </p>

                      {/* Barre de progression */}
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Couverture des objectifs</span>
                          <span className={`font-bold ${c.text}`}>
                            {domain.progress}%
                          </span>
                        </div>
                        <div className="h-2 bg-white/60 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${domain.progress}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className={`h-full ${c.bar} rounded-full`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Métriques */}
                    <div className="grid grid-cols-2 gap-px bg-gray-100">
                      {domain.metrics.map((m) => {
                        const metricRef = useRef(null);
                        const inV = useInView(metricRef, { once: true });
                        const cnt = useAnimatedCounter(m.value, inV);
                        return (
                          <div
                            ref={metricRef}
                            key={m.label}
                            className="bg-white px-4 py-3"
                          >
                            <div
                              className={`text-xl font-bold font-display ${c.text}`}
                            >
                              {cnt.toLocaleString("fr-FR")}
                              {m.suffix}
                            </div>
                            <div className="text-xs text-gray-500">
                              {m.label}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* ODD */}
                    <div className="px-4 py-3 border-t border-gray-50">
                      <p className="text-xs text-gray-400 mb-2">
                        Objectifs de Développement Durable
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {domain.sdgs.map((n) => (
                          <SDGBadge key={n} number={n} />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── Timeline historique ── */}
      <section className="section-mrjc bg-gradient-to-br from-primary-900 to-primary-800">
        <div className="container-mrjc">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest bg-primary-700 text-primary-200 mb-3">
              Évolution
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-white">
              38 ans de croissance de l'impact
            </h2>
          </div>

          <div className="relative">
            {/* Ligne centrale */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary-600 transform -translate-x-1/2 hidden md:block" />

            <div className="space-y-8">
              {TIMELINE.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex items-center gap-6 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  <div className="flex-1 hidden md:block" />
                  <div className="w-12 h-12 bg-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 z-10 shadow-lg">
                    {item.year.toString().slice(-2)}
                  </div>
                  <div
                    className={`flex-1 bg-primary-800/60 border border-primary-700 rounded-2xl p-4 backdrop-blur-sm`}
                  >
                    <div className="text-secondary-400 font-bold text-lg">
                      {item.year}
                    </div>
                    <div className="text-white font-semibold mt-0.5">
                      {item.label} — {item.desc}
                    </div>
                    <div className="text-primary-300 text-sm mt-1 font-medium">
                      {item.value}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ODD alignement ── */}
      <section className="section-mrjc bg-white">
        <div className="container-mrjc">
          <div className="text-center mb-10">
            <span className="section-tag">Agenda 2030</span>
            <h2 className="section-title mt-2">Contribution aux ODD</h2>
            <p className="section-desc">
              Nos actions contribuent directement à 9 Objectifs de Développement
              Durable de l'ONU
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
            {Object.entries(SDG_DATA).map(([num, sdg]) => (
              <motion.div
                key={num}
                whileHover={{ scale: 1.05, y: -3 }}
                className="flex flex-col items-center gap-2 cursor-pointer"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-md"
                  style={{ backgroundColor: sdg.color }}
                >
                  {num}
                </div>
                <span className="text-xs text-gray-600 text-center max-w-[80px] leading-tight">
                  {sdg.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA partenariat ── */}
      <section className="section-mrjc bg-secondary-50 border-t border-secondary-100">
        <div className="container-mrjc text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold font-display text-gray-900 mb-4">
              Contribuez à amplifier cet impact
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
              En tant que partenaire technique, bailleur ou bénévole, vous
              pouvez multiplier l'impact de nos actions sur les communautés
              rurales du Bénin.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/work-with-us/collaboration"
                className="btn-primary inline-flex items-center gap-2"
              >
                Devenir partenaire <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/work-with-us/volunteer"
                className="btn-secondary inline-flex items-center gap-2"
              >
                S'engager bénévolement <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
