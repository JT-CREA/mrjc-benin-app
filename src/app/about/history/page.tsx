"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  ChevronDown,
  MapPin,
  Users,
  Award,
  Sprout,
  BookOpen,
  Heart,
} from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

/* ─────────────────────────────────────────────────────────────
   Données Timeline
───────────────────────────────────────────────────────────── */
const timelineData = [
  {
    era: "1985 — 1990",
    title: "Fondation & Premiers Pas",
    color: "bg-primary-500",
    borderColor: "border-primary-500",
    textColor: "text-primary-600",
    icon: Sprout,
    events: [
      {
        year: "1985",
        title: "Création de MRJC-BÉNIN",
        description:
          "Le Mouvement Rural de Jeunesse Chrétienne du Bénin est fondé à Cotonou par 33 jeunes ruraux engagés, avec le soutien de la Conférence Épiscopale du Bénin. L'objectif fondateur : accompagner la jeunesse rurale vers un développement intégral.",
        image:
          "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600",
        milestone: true,
      },
      {
        year: "1987",
        title: "Premiers programmes de formation agricole",
        description:
          "Lancement des premières sessions de formation en techniques agricoles améliorées dans les départements de l'Atlantique et du Zou. 120 jeunes agriculteurs formés cette première année.",
      },
      {
        year: "1989",
        title: "Reconnaissance officielle",
        description:
          "MRJC-BÉNIN obtient la reconnaissance officielle du Gouvernement du Bénin en tant qu'Organisation Non Gouvernementale à vocation nationale.",
        milestone: true,
      },
    ],
  },
  {
    era: "1991 — 2000",
    title: "Croissance & Diversification",
    color: "bg-secondary-500",
    borderColor: "border-secondary-500",
    textColor: "text-secondary-600",
    icon: Users,
    events: [
      {
        year: "1992",
        title: "Extension aux 6 premiers départements",
        description:
          "Les programmes s'étendent à 6 des 12 départements du Bénin grâce à un premier financement de l'Union Européenne. 35 agents de terrain recrutés.",
      },
      {
        year: "1995",
        title: "Lancement des programmes d'alphabétisation",
        description:
          "Démarrage du premier projet d'alphabétisation fonctionnelle ciblant 2 000 femmes rurales en langues maternelles (Fon, Yoruba, Bariba). Une révolution dans notre approche.",
        image:
          "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600",
        milestone: true,
      },
      {
        year: "1998",
        title: "Création du pôle Santé Communautaire",
        description:
          "Diversification des activités avec l'intégration d'un programme de santé communautaire et nutrition. Partenariat établi avec le Ministère de la Santé du Bénin.",
      },
    ],
  },
  {
    era: "2001 — 2010",
    title: "Consolidation & Partenariats Stratégiques",
    color: "bg-accent-500",
    borderColor: "border-accent-500",
    textColor: "text-accent-600",
    icon: Award,
    events: [
      {
        year: "2003",
        title: "Premier partenariat avec l'AFD",
        description:
          "Signature d'une convention de partenariat avec l'Agence Française de Développement pour un programme d'appui aux filières agricoles d'un budget de 850 millions de FCFA.",
        milestone: true,
      },
      {
        year: "2006",
        title: "Lancement du programme Genre",
        description:
          "Création d'une unité dédiée à l'autonomisation des femmes et au leadership féminin, en réponse aux inégalités de genre observées sur le terrain.",
      },
      {
        year: "2008",
        title: "Extension nationale — 12 départements",
        description:
          "MRJC-BÉNIN est désormais présente dans les 12 départements du Bénin. L'effectif passe à 85 agents permanents et 230 agents de terrain.",
        image:
          "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600",
        milestone: true,
      },
      {
        year: "2010",
        title: "Prix national d'excellence ONG",
        description:
          "MRJC-BÉNIN reçoit le Prix National d'Excellence des ONG décerné par le Gouvernement béninois pour son impact en matière de développement rural.",
      },
    ],
  },
  {
    era: "2011 — 2020",
    title: "Innovation & Impact à Grande Échelle",
    color: "bg-purple-600",
    borderColor: "border-purple-500",
    textColor: "text-purple-600",
    icon: BookOpen,
    events: [
      {
        year: "2013",
        title: "50 000ème bénéficiaire",
        description:
          "MRJC-BÉNIN franchit le cap des 50 000 bénéficiaires cumulés depuis sa création, marquant un tournant symbolique fort.",
        milestone: true,
      },
      {
        year: "2016",
        title: "Numérisation des outils de terrain",
        description:
          "Introduction des outils numériques (tablettes, ODK Collect) pour la collecte de données et le suivi des bénéficiaires. Amélioration significative de la qualité des données.",
      },
      {
        year: "2018",
        title: "Programme phare Alfabétisation — Borgou",
        description:
          "Démarrage du plus grand programme d'alphabétisation de l'histoire de l'ONG : 3 600 femmes dans le Borgou, avec financement DDC et FODEFCA.",
        image:
          "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600",
        milestone: true,
      },
    ],
  },
  {
    era: "2021 — Aujourd'hui",
    title: "Nouvelle Ère & Vision 2030",
    color: "bg-emerald-600",
    borderColor: "border-emerald-500",
    textColor: "text-emerald-700",
    icon: Heart,
    events: [
      {
        year: "2022",
        title: "Lancement de 3 nouveaux projets majeurs",
        description:
          "Démarrage simultané de trois projets d'envergure : filière manioc Atacora (UE/AFD), nutrition Zou (UNICEF), leadership féminin Collines (ONU Femmes).",
        milestone: true,
      },
      {
        year: "2023",
        title: "85 000 bénéficiaires — Record historique",
        description:
          "MRJC-BÉNIN atteint 85 000 bénéficiaires cumulés en 2023, année record. Le rapport d'impact est disponible en téléchargement.",
        image:
          "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600",
        milestone: true,
      },
      {
        year: "2024",
        title: "Vision 2030 adoptée",
        description:
          "Le Conseil d'Administration adopte la Vision Stratégique 2030 visant à toucher 250 000 bénéficiaires et à renforcer la résilience des communautés rurales face au changement climatique.",
      },
    ],
  },
];

/* ─────────────────────────────────────────────────────────────
   Composant ÈreTimeline
───────────────────────────────────────────────────────────── */
function TimelineEra({
  era,
  index,
}: {
  era: (typeof timelineData)[0];
  index: number;
}) {
  const [expanded, setExpanded] = useState(index === timelineData.length - 1);
  const { ref, isVisible } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
  });
  const Icon = era.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="relative"
    >
      {/* Connecteur vertical (sauf dernier) */}
      {index < timelineData.length - 1 && (
        <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-neutral-200 z-0" />
      )}

      {/* En-tête de l'ère */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="relative z-10 w-full flex items-center gap-4 mb-2 group"
        aria-expanded={expanded}
      >
        {/* Icône ère */}
        <div
          className={`w-12 h-12 ${era.color} rounded-2xl flex items-center justify-center
                         flex-shrink-0 shadow-md group-hover:scale-105 transition-transform`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>

        <div className="flex-1 text-left">
          <span
            className={`text-xs font-bold uppercase tracking-widest ${era.textColor}`}
          >
            {era.era}
          </span>
          <h3
            className="font-display font-bold text-xl text-neutral-900 group-hover:text-primary-700
                         transition-colors leading-snug"
          >
            {era.title}
          </h3>
        </div>

        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="flex-shrink-0 text-neutral-400"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>

      {/* Événements */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pl-16 space-y-6 pb-8">
              {era.events.map((event, ei) => (
                <motion.div
                  key={event.year}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: ei * 0.08 }}
                  className={`relative bg-white rounded-2xl border-2 overflow-hidden
                              transition-all duration-300 hover:shadow-lg
                              ${event.milestone ? era.borderColor : "border-neutral-100"}`}
                >
                  {/* Badge milestone */}
                  {event.milestone && (
                    <div
                      className={`absolute top-0 right-0 ${era.color} text-white
                                     text-2xs font-bold px-3 py-1 rounded-bl-xl`}
                    >
                      ⭐ Étape clé
                    </div>
                  )}

                  <div
                    className={`flex flex-col ${event.image ? "md:flex-row" : ""}`}
                  >
                    {/* Image optionnelle */}
                    {event.image && (
                      <div className="relative md:w-48 h-40 md:h-auto flex-shrink-0 overflow-hidden bg-neutral-100">
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          className="object-cover"
                          sizes="192px"
                        />
                      </div>
                    )}

                    {/* Contenu */}
                    <div className="p-5 flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-bold
                                          px-2.5 py-1 rounded-full ${era.color.replace("bg-", "bg-").replace("500", "100").replace("600", "100")}
                                          ${era.textColor}`}
                        >
                          <Calendar className="w-3 h-3" />
                          {event.year}
                        </span>
                      </div>
                      <h4 className="font-display font-bold text-base text-neutral-900 mb-2 leading-snug">
                        {event.title}
                      </h4>
                      <p className="text-sm text-neutral-500 leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Page principale
───────────────────────────────────────────────────────────── */
export default function HistoryPage() {
  return (
    <>
      <PageHeader
        tag="Notre Histoire"
        title="Histoire & Genèse"
        subtitle="Depuis 1985, MRJC-BÉNIN écrit chaque jour une nouvelle page de l'histoire du développement rural béninois. Découvrez les étapes d'une aventure humaine de presque 40 ans."
        breadcrumbs={[
          { label: "Nous Connaître", href: "/about" },
          { label: "Histoire & Genèse" },
        ]}
        image="https://images.unsplash.com/photo-1461360228754-6e81c478b882?w=1920"
      />

      <div className="py-20 lg:py-28 bg-neutral-50">
        <div className="container-mrjc">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Colonne latérale */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-6">
                <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                  <h3 className="font-display font-bold text-lg text-neutral-900 mb-4">
                    Résumé historique
                  </h3>
                  <div className="space-y-3">
                    {[
                      { label: "Fondée en", value: "1985" },
                      { label: "Lieu", value: "Cotonou, Bénin" },
                      { label: "Fondateurs", value: "33 jeunes ruraux" },
                      { label: "Statut légal", value: "ONG nationale" },
                      { label: "Couverture", value: "12 départements" },
                      { label: "Bénéficiaires", value: "85 000+" },
                      { label: "Projets réalisés", value: "47" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex justify-between items-center
                                                       py-2 border-b border-neutral-100 last:border-0"
                      >
                        <span className="text-sm text-neutral-500">
                          {item.label}
                        </span>
                        <span className="text-sm font-bold text-neutral-900">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-primary-50 border border-primary-100 rounded-2xl p-6">
                  <MapPin className="w-6 h-6 text-primary-600 mb-3" />
                  <h4 className="font-bold text-neutral-900 mb-2">
                    Siège social
                  </h4>
                  <p className="text-sm text-neutral-600">
                    BP XXXX, Cotonou
                    <br />
                    République du Bénin
                    <br />
                    Afrique de l'Ouest
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline principale */}
            <div className="lg:col-span-2 space-y-4">
              <div className="mb-8">
                <div className="section-tag justify-start">
                  Frise Chronologique
                </div>
                <h2 className="font-display text-3xl font-bold text-neutral-900 mt-2">
                  Quatre décennies d'engagement
                </h2>
                <p className="text-neutral-500 mt-2">
                  Cliquez sur chaque période pour explorer les événements
                  marquants.
                </p>
              </div>

              {timelineData.map((era, index) => (
                <TimelineEra key={era.era} era={era} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
