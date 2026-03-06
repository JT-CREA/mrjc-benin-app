"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  FolderOpen,
  MapPin,
  Building2,
  CalendarDays,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { useCounterAnimation } from "@/hooks/useCounterAnimation";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

/* ─────────────────────────────────────────────────────────────
   Statistiques
───────────────────────────────────────────────────────────── */
const stats = [
  {
    id: "beneficiaries",
    end: 85000,
    suffix: "+",
    label: "Bénéficiaires",
    sublabel: "personnes touchées directement",
    icon: Users,
    color: "text-primary-600",
    bgColor: "bg-primary-50",
    borderColor: "border-primary-200",
  },
  {
    id: "projects",
    end: 47,
    suffix: "",
    label: "Projets",
    sublabel: "réalisés depuis la création",
    icon: FolderOpen,
    color: "text-secondary-600",
    bgColor: "bg-secondary-50",
    borderColor: "border-secondary-200",
  },
  {
    id: "villages",
    end: 230,
    suffix: "+",
    label: "Villages",
    sublabel: "couverts par nos interventions",
    icon: MapPin,
    color: "text-accent-600",
    bgColor: "bg-accent-50",
    borderColor: "border-accent-200",
  },
  {
    id: "partners",
    end: 35,
    suffix: "+",
    label: "Partenaires",
    sublabel: "bailleurs et partenaires techniques",
    icon: Building2,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
  {
    id: "years",
    end: new Date().getFullYear() - 1985,
    suffix: " ans",
    label: "D'expérience",
    sublabel: "au service des communautés rurales",
    icon: CalendarDays,
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
  },
];

/* ─────────────────────────────────────────────────────────────
   Carte statistique individuelle
───────────────────────────────────────────────────────────── */
function StatCard({
  stat,
  index,
  isVisible,
}: {
  stat: (typeof stats)[0];
  index: number;
  isVisible: boolean;
}) {
  const { count, ref } = useCounterAnimation({
    end: stat.end,
    duration: 2200,
    easing: "easeOut",
  });

  const Icon = stat.icon;
  const displayValue =
    stat.end >= 10000
      ? `${Math.round((count / 1000) * 10) / 10}k`
      : Math.round(count).toLocaleString("fr-FR");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={isVisible ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className={`bg-white rounded-2xl border-2 p-6 text-center
                  transition-all duration-300 hover:shadow-lg hover:-translate-y-1
                  ${stat.borderColor}`}
    >
      {/* Icône */}
      <div
        className={`w-14 h-14 ${stat.bgColor} rounded-2xl flex items-center
                       justify-center mx-auto mb-4`}
      >
        <Icon className={`w-7 h-7 ${stat.color}`} strokeWidth={1.5} />
      </div>

      {/* Chiffre animé */}
      <div className="mb-2">
        <span
          ref={ref as React.RefObject<HTMLSpanElement>}
          className={`font-display text-4xl lg:text-5xl font-black ${stat.color} leading-none`}
        >
          {displayValue}
        </span>
        <span className={`font-display text-2xl font-bold ${stat.color}`}>
          {stat.suffix}
        </span>
      </div>

      {/* Label */}
      <h3 className="font-bold text-neutral-900 text-base mb-1">
        {stat.label}
      </h3>
      <p className="text-xs text-neutral-500 leading-relaxed">
        {stat.sublabel}
      </p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Barre de progression de résultats
───────────────────────────────────────────────────────────── */
function ResultBar({
  label,
  value,
  max,
  color,
  isVisible,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  isVisible: boolean;
}) {
  const pct = Math.min((value / max) * 100, 100);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-neutral-700">{label}</span>
        <span className="text-sm font-bold text-neutral-900">
          {value.toLocaleString("fr-FR")}
        </span>
      </div>
      <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={isVisible ? { width: `${pct}%` } : {}}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Section principale
───────────────────────────────────────────────────────────── */
export default function ImpactSection() {
  const { ref, isVisible } = useIntersectionObserver<HTMLElement>({
    threshold: 0.1,
  });

  return (
    <section
      ref={ref}
      className="py-20 lg:py-28 bg-white"
      aria-labelledby="impact-heading"
    >
      <div className="container-mrjc">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="section-header"
        >
          <div className="section-tag">Notre Impact</div>
          <h2 id="impact-heading" className="section-title">
            Des résultats concrets, des vies transformées
          </h2>
          <p className="section-subtitle">
            Chaque chiffre représente une vie transformée, une communauté
            renforcée. Voici l'impact de quatre décennies d'engagement au Bénin.
          </p>
        </motion.div>

        {/* Grille statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-16">
          {stats.map((stat, index) => (
            <StatCard
              key={stat.id}
              stat={stat}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>

        {/* Résultats détaillés */}
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Résultats 2023 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-primary-600" />
              <h3 className="font-display font-bold text-2xl text-neutral-900">
                Résultats 2023
              </h3>
            </div>
            <p className="text-neutral-600 leading-relaxed">
              L'exercice 2023 a marqué un tournant dans l'amplification de notre
              impact. Voici les principaux indicateurs de résultats de nos
              projets actifs.
            </p>

            <div className="space-y-5">
              <ResultBar
                label="Producteurs formés en bonnes pratiques agricoles"
                value={4200}
                max={5000}
                color="bg-primary-500"
                isVisible={isVisible}
              />
              <ResultBar
                label="Enfants < 5 ans suivis nutritionnellement"
                value={8500}
                max={10000}
                color="bg-accent-500"
                isVisible={isVisible}
              />
              <ResultBar
                label="Femmes bénéficiaires de microcrédit"
                value={1800}
                max={2500}
                color="bg-secondary-500"
                isVisible={isVisible}
              />
              <ResultBar
                label="Agents communautaires formés"
                value={640}
                max={800}
                color="bg-purple-500"
                isVisible={isVisible}
              />
            </div>

            <Link href="/impact" className="btn-primary mt-4 w-fit">
              Tableau de bord complet
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Carte géographique simplifiée */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-primary-50 rounded-3xl p-8 border border-primary-100"
          >
            <h3 className="font-display font-bold text-xl text-neutral-900 mb-6">
              Couverture géographique
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                {
                  dept: "Atacora",
                  projets: 3,
                  communes: 8,
                  color: "bg-primary-500",
                },
                {
                  dept: "Borgou",
                  projets: 4,
                  communes: 12,
                  color: "bg-accent-500",
                },
                {
                  dept: "Zou",
                  projets: 2,
                  communes: 6,
                  color: "bg-secondary-500",
                },
                {
                  dept: "Collines",
                  projets: 2,
                  communes: 5,
                  color: "bg-purple-500",
                },
                {
                  dept: "Ouémé",
                  projets: 1,
                  communes: 3,
                  color: "bg-emerald-600",
                },
                {
                  dept: "Mono",
                  projets: 1,
                  communes: 4,
                  color: "bg-amber-600",
                },
              ].map((item) => (
                <div
                  key={item.dept}
                  className="bg-white rounded-xl p-4 border border-neutral-100
                                hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`w-2 h-2 rounded-full ${item.color} flex-shrink-0`}
                    />
                    <span className="text-sm font-bold text-neutral-800">
                      {item.dept}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-neutral-500">
                      <span className="font-semibold text-neutral-700">
                        {item.projets}
                      </span>{" "}
                      projets
                    </div>
                    <div className="text-xs text-neutral-500">
                      <span className="font-semibold text-neutral-700">
                        {item.communes}
                      </span>{" "}
                      communes
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl p-4 border border-primary-200 text-center">
              <p className="text-sm font-semibold text-primary-800 mb-1">
                8 départements sur 12 au Bénin
              </p>
              <p className="text-xs text-neutral-500">
                Couverture nationale en expansion continue
              </p>
            </div>

            <Link
              href="/projects#map"
              className="btn-outline w-full justify-center mt-4 text-sm"
            >
              Voir la carte interactive
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
