"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sprout,
  HeartPulse,
  BookOpenText,
  UsersRound,
  Handshake,
  ArrowRight,
} from "lucide-react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { cn } from "@/lib/utils/cn";

/* ─────────────────────────────────────────────────────────────
   Données des domaines
───────────────────────────────────────────────────────────── */
const domains = [
  {
    id: "agricultural-council",
    slug: "conseil-agricole-entrepreneuriat",
    label: "Conseil Agricole & Entrepreneuriat",
    description:
      "Formation, appui-conseil et accompagnement des producteurs ruraux vers des pratiques agro-écologiques et une agriculture entrepreunariale rentable.",
    icon: Sprout,
    color: {
      bg: "bg-primary-50",
      border: "border-primary-200",
      icon: "bg-primary-500",
      text: "text-primary-700",
      hover: "hover:border-primary-400 hover:bg-primary-50",
      accent: "bg-primary-500",
    },
    stat: { value: "6 projets", label: "réalisés" },
    href: "/domains/conseil-agricole-entrepreneuriat",
  },
  {
    id: "community-health",
    slug: "sante-communautaire-nutrition",
    label: "Santé Communautaire & Nutrition",
    description:
      "Renforcement des systèmes de santé communautaires, amélioration de la nutrition maternelle et infantile, sensibilisation et accès aux soins.",
    icon: HeartPulse,
    color: {
      bg: "bg-accent-50",
      border: "border-accent-200",
      icon: "bg-accent-500",
      text: "text-accent-700",
      hover: "hover:border-accent-400 hover:bg-accent-50",
      accent: "bg-accent-500",
    },
    stat: { value: "230+", label: "villages couverts" },
    href: "/domains/sante-communautaire-nutrition",
  },
  {
    id: "literacy-education",
    slug: "alphabetisation-education",
    label: "Alphabétisation & Éducation",
    description:
      "Programmes d'alphabétisation en langues maternelles et fonctionnelle, accès à l'éducation non formelle, soutien à la scolarisation des enfants.",
    icon: BookOpenText,
    color: {
      bg: "bg-secondary-50",
      border: "border-secondary-200",
      icon: "bg-secondary-500",
      text: "text-secondary-700",
      hover: "hover:border-secondary-400 hover:bg-secondary-50",
      accent: "bg-secondary-500",
    },
    stat: { value: "3 604", label: "personnes alphabétisées" },
    href: "/domains/alphabetisation-education",
  },
  {
    id: "women-empowerment",
    slug: "autonomisation-femmes",
    label: "Autonomisation des Femmes",
    description:
      "Leadership féminin, entrepreneuriat, accès au microcrédit, lutte contre les violences basées sur le genre et participation à la gouvernance locale.",
    icon: UsersRound,
    color: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      icon: "bg-purple-600",
      text: "text-purple-700",
      hover: "hover:border-purple-400 hover:bg-purple-50",
      accent: "bg-purple-600",
    },
    stat: { value: "800+", label: "femmes leaders formées" },
    href: "/domains/autonomisation-femmes",
  },
  {
    id: "social-intermediation",
    slug: "intermediation-sociale",
    label: "Intermédiation Sociale",
    description:
      "Cohésion sociale, résolution des conflits, gouvernance locale participative, renforcement des organisations communautaires et de la société civile.",
    icon: Handshake,
    color: {
      bg: "bg-neutral-50",
      border: "border-neutral-200",
      icon: "bg-neutral-600",
      text: "text-neutral-700",
      hover: "hover:border-neutral-400 hover:bg-neutral-50",
      accent: "bg-neutral-600",
    },
    stat: { value: "47 projets", label: "depuis 1985" },
    href: "/domains/intermediation-sociale",
  },
];

/* ─────────────────────────────────────────────────────────────
   Carte de domaine
───────────────────────────────────────────────────────────── */
function DomainCard({
  domain,
  index,
  isVisible,
}: {
  domain: (typeof domains)[0];
  index: number;
  isVisible: boolean;
}) {
  const Icon = domain.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
    >
      <Link
        href={domain.href}
        className={cn(
          "group flex flex-col h-full bg-white rounded-2xl border-2 p-6",
          "transition-all duration-300",
          "hover:shadow-xl hover:-translate-y-1",
          domain.color.border,
          domain.color.hover,
        )}
      >
        {/* Icône */}
        <div
          className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center mb-5 flex-shrink-0",
            "transition-transform duration-300 group-hover:scale-110",
            domain.color.icon,
          )}
        >
          <Icon className="w-7 h-7 text-white" strokeWidth={1.5} />
        </div>

        {/* Contenu */}
        <div className="flex-1 space-y-3">
          <h3
            className={cn(
              "font-display font-bold text-lg leading-snug transition-colors",
              domain.color.text,
            )}
          >
            {domain.label}
          </h3>
          <p className="text-sm text-neutral-500 leading-relaxed line-clamp-3">
            {domain.description}
          </p>
        </div>

        {/* Footer carte */}
        <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between">
          <div>
            <span className={cn("text-sm font-bold", domain.color.text)}>
              {domain.stat.value}
            </span>
            <span className="text-xs text-neutral-400 ml-1.5">
              {domain.stat.label}
            </span>
          </div>
          <div
            className={cn(
              "flex items-center gap-1.5 text-xs font-semibold transition-all duration-200",
              domain.color.text,
              "group-hover:gap-2.5",
            )}
          >
            Découvrir
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Section principale
───────────────────────────────────────────────────────────── */
export default function ActionSection() {
  const { ref, isVisible } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
  });

  return (
    <section
      ref={ref}
      className="py-20 lg:py-28 bg-neutral-50"
      aria-labelledby="domains-heading"
    >
      <div className="container-mrjc">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="section-header"
        >
          <div className="section-tag">Notre Action</div>
          <h2 id="domains-heading" className="section-title">
            Cinq domaines d'expertise pour un impact global
          </h2>
          <p className="section-subtitle">
            Depuis presque 40 ans, MRJC-BÉNIN intervient de manière holistique
            pour accompagner les communautés rurales vers un développement
            autonome et durable.
          </p>
        </motion.div>

        {/* Grille domaines */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {domains.map((domain, index) => (
            <DomainCard
              key={domain.id}
              domain={domain}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>

        {/* CTA bas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <Link href="/domains" className="btn-outline">
            Explorer tous nos domaines
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
