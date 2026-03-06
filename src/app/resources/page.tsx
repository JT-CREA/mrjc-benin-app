"use client";

/**
 * Page Ressources — MRJC-BÉNIN  (version enrichie)
 * ─────────────────────────────────────────────────
 * 1. Publications (catégories + docs phares)
 * 2. Photothèque  — galerie 18 photos filtrable + lightbox + téléchargement
 * 3. Vidéothèque  — 8 vidéos YouTube via YouTubeEmbed (lazy, thumbnail, autoplay)
 * 4. Success Stories — 6 portraits transformés
 * 5. Storytelling — récits immersifs de terrain
 */

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  BarChart3,
  BookOpen,
  Presentation,
  Lightbulb,
  MessageSquare,
  ArrowRight,
  Download,
  Camera,
  Play,
  Star,
  Heart,
  Quote,
  X,
  ChevronRight,
  Eye,
  Share2,
  Users,
  MapPin,
  Calendar,
  ExternalLink,
  ZoomIn,
  Youtube,
  Filter,
} from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import YouTubeEmbed from "@/components/ui/YouTubeEmbed";

/* ══════════════════════════════════════════════════════════════════════════════
   ONGLETS
══════════════════════════════════════════════════════════════════════════════ */
const TABS = [
  { id: "publications", label: "Publications", icon: FileText, count: 24 },
  { id: "photos", label: "Photothèque", icon: Camera, count: 18 },
  { id: "videos", label: "Vidéothèque", icon: Play, count: 8 },
  { id: "success", label: "Success Stories", icon: Star, count: 8 },
  { id: "stories", label: "Storytelling", icon: Heart, count: 6 },
] as const;

type TabId = (typeof TABS)[number]["id"];

/* ══════════════════════════════════════════════════════════════════════════════
   DONNÉES — Publications
══════════════════════════════════════════════════════════════════════════════ */
const RESOURCE_CATEGORIES = [
  {
    id: "rapport-annuel",
    label: "Rapports Annuels",
    icon: BarChart3,
    color: "bg-primary-500",
    href: "/resources/annual-reports",
    count: 8,
  },
  {
    id: "guide-technique",
    label: "Guides Techniques",
    icon: BookOpen,
    color: "bg-accent-500",
    href: "/resources/technical-guides",
    count: 6,
  },
  {
    id: "etude-recherche",
    label: "Études & Recherches",
    icon: Lightbulb,
    color: "bg-secondary-500",
    href: "/resources/publications",
    count: 5,
  },
  {
    id: "document-cadre",
    label: "Documents Cadres",
    icon: FileText,
    color: "bg-purple-600",
    href: "/resources/publications",
    count: 3,
  },
  {
    id: "outil-pedagogique",
    label: "Outils Pédagogiques",
    icon: Presentation,
    color: "bg-emerald-600",
    href: "/resources/publications",
    count: 2,
  },
  {
    id: "communique",
    label: "Communiqués & Presse",
    icon: MessageSquare,
    color: "bg-neutral-600",
    href: "/resources/media-kit",
    count: 4,
  },
];

const FEATURED_DOCS = [
  {
    id: "1",
    title: "Rapport Annuel 2023",
    type: "Rapport",
    size: "4.2 Mo",
    downloads: 1_842,
    date: "2024-03",
    coverImage: "/assets/images/placeholder.svg",
    fileUrl: "#",
  },
  {
    id: "2",
    title: "Guide d'Accompagnement Agricole",
    type: "Guide technique",
    size: "2.8 Mo",
    downloads: 1_247,
    date: "2024-01",
    coverImage: "/assets/images/placeholder.svg",
    fileUrl: "#",
  },
  {
    id: "3",
    title: "Étude d'Impact 2022–2023",
    type: "Étude",
    size: "3.1 Mo",
    downloads: 987,
    date: "2023-11",
    coverImage: "/assets/images/placeholder.svg",
    fileUrl: "#",
  },
];

/* ══════════════════════════════════════════════════════════════════════════════
   DONNÉES — Photothèque (18 photos, 6 catégories)
══════════════════════════════════════════════════════════════════════════════ */
const PHOTO_FILTERS = [
  "Tous",
  "Agriculture",
  "Santé",
  "Éducation",
  "Femmes",
  "Terrain",
  "Événements",
];

const PHOTOS = [
  {
    id: "p1",
    src: "/assets/images/placeholder.svg",
    alt: "Formation agricole — techniques de compostage",
    category: "Agriculture",
    location: "Atacora",
    year: 2024,
    desc: "Séance de démonstration en plein air avec 45 agriculteurs de la commune de Tanguiéta.",
  },
  {
    id: "p2",
    src: "/assets/images/placeholder.svg",
    alt: "Séance de sensibilisation santé maternelle",
    category: "Santé",
    location: "Zou",
    year: 2024,
    desc: "Vaccination et pesée des enfants de 0 à 5 ans dans le village de Djidja.",
  },
  {
    id: "p3",
    src: "/assets/images/placeholder.svg",
    alt: "Classe d'alphabétisation fonctionnelle — femmes",
    category: "Éducation",
    location: "Borgou",
    year: 2024,
    desc: "120 femmes apprennent à lire et compter en langue Bariba.",
  },
  {
    id: "p4",
    src: "/assets/images/placeholder.svg",
    alt: "Groupement féminin — réunion épargne & crédit",
    category: "Femmes",
    location: "Collines",
    year: 2024,
    desc: "Séance mensuelle du groupement FAFEWA de Savalou : 38 membres, 2,4 M FCFA épargnés.",
  },
  {
    id: "p5",
    src: "/assets/images/placeholder.svg",
    alt: "Visite de terrain — équipe MRJC & partenaires",
    category: "Terrain",
    location: "Mono",
    year: 2024,
    desc: "Mission conjointe de suivi avec la délégation de l'Union Européenne.",
  },
  {
    id: "p6",
    src: "/assets/images/placeholder.svg",
    alt: "Pépinière maraîchère collective — Atacora",
    category: "Agriculture",
    location: "Atacora",
    year: 2023,
    desc: "Production de plants de moringa et légumes enrichis pour la sécurité alimentaire.",
  },
  {
    id: "p7",
    src: "/assets/images/placeholder.svg",
    alt: "Distribution de kits nutritionnels",
    category: "Santé",
    location: "Zou",
    year: 2024,
    desc: "Remise de farines enrichies à 340 mères d'enfants malnutris, commune de Covè.",
  },
  {
    id: "p8",
    src: "/assets/images/placeholder.svg",
    alt: "Cérémonie de remise de diplômes d'alphabétisation",
    category: "Éducation",
    location: "Atlantique",
    year: 2024,
    desc: "248 femmes reçoivent leur certificat lors de la cérémonie de clôture 2024.",
  },
  {
    id: "p9",
    src: "/assets/images/placeholder.svg",
    alt: "Atelier leadership féminin — Collines",
    category: "Femmes",
    location: "Collines",
    year: 2024,
    desc: "Module 'Prise de parole en public' pour 60 femmes leaders rurales.",
  },
  {
    id: "p10",
    src: "/assets/images/placeholder.svg",
    alt: "Réunion communautaire de planification",
    category: "Terrain",
    location: "Borgou",
    year: 2024,
    desc: "Plan de développement du village de N'Dali : 200 habitants présents.",
  },
  {
    id: "p11",
    src: "/assets/images/placeholder.svg",
    alt: "Récolte riz — parcelle démonstrative",
    category: "Agriculture",
    location: "Donga",
    year: 2023,
    desc: "Rendement 3x supérieur à la moyenne grâce aux nouvelles semences certifiées.",
  },
  {
    id: "p12",
    src: "/assets/images/placeholder.svg",
    alt: "Campagne de vaccination contre la rougeole",
    category: "Santé",
    location: "Mono",
    year: 2024,
    desc: "1 850 enfants vaccinés en 5 jours dans 12 villages du département du Mono.",
  },
  {
    id: "p13",
    src: "/assets/images/placeholder.svg",
    alt: "Bibliothèque communautaire — Parakou",
    category: "Éducation",
    location: "Borgou",
    year: 2023,
    desc: "Inauguration de la bibliothèque de Ouèssè dotée de 2 000 ouvrages.",
  },
  {
    id: "p14",
    src: "/assets/images/placeholder.svg",
    alt: "Micro-financement — comité de crédit",
    category: "Femmes",
    location: "Donga",
    year: 2023,
    desc: "Déboursement du premier crédit du groupement Koossam de N'Dali : 500 000 FCFA.",
  },
  {
    id: "p15",
    src: "/assets/images/placeholder.svg",
    alt: "Formation agents de terrain — Cotonou",
    category: "Terrain",
    location: "Cotonou",
    year: 2024,
    desc: "Séminaire annuel des 45 agents de terrain : renforcement capacités monitoring.",
  },
  {
    id: "p16",
    src: "/assets/images/placeholder.svg",
    alt: "Assemblée générale annuelle MRJC 2024",
    category: "Événements",
    location: "Cotonou",
    year: 2024,
    desc: "AG 2024 : 120 membres élus, adoption du plan stratégique 2025-2030.",
  },
  {
    id: "p17",
    src: "/assets/images/placeholder.svg",
    alt: "Forum national des ONG — stand MRJC",
    category: "Événements",
    location: "Cotonou",
    year: 2024,
    desc: "MRJC-BÉNIN lauréat du Prix Excellence ONG du gouvernement béninois.",
  },
  {
    id: "p18",
    src: "/assets/images/placeholder.svg",
    alt: "Cérémonie partenariat AFD — signature",
    category: "Événements",
    location: "Cotonou",
    year: 2023,
    desc: "Signature de la convention AFD (850 millions FCFA) pour le programme filières agricoles.",
  },
];

/* ══════════════════════════════════════════════════════════════════════════════
   DONNÉES — Vidéothèque (8 vidéos YouTube)
   IDs réels de vidéos de développement en Afrique de l'Ouest (YouTube public)
══════════════════════════════════════════════════════════════════════════════ */
const VIDEO_CATEGORIES = [
  "Toutes",
  "Institutionnel",
  "Terrain",
  "Témoignages",
  "Formations",
];

const VIDEOS = [
  {
    videoId: "gCNeDWCI0vo",
    title: "MRJC-BÉNIN : 38 ans de développement rural",
    caption:
      "Film institutionnel 2023 — Vue d'ensemble de nos programmes et de notre impact.",
    category: "Institutionnel",
    year: 2023,
    duration: "18 min",
  },
  {
    videoId: "aSBtcHdSBjI",
    title: "Agriculture durable — Techniques agro-écologiques",
    caption: "Formation en compostage et maraîchage raisonné, Atacora 2024.",
    category: "Formations",
    year: 2024,
    duration: "12 min",
  },
  {
    videoId: "DcGLt0XfLQY",
    title: "Témoignage — Awa Idrissou, agricultrice, Borgou",
    caption:
      "Comment la formation MRJC a triplé le revenu de son exploitation.",
    category: "Témoignages",
    year: 2024,
    duration: "7 min",
  },
  {
    videoId: "BHmkE7-ANKU",
    title: "Mission terrain — Département du Mono",
    caption:
      "Reportage de la mission de suivi des programmes Santé & Nutrition.",
    category: "Terrain",
    year: 2024,
    duration: "9 min",
  },
  {
    videoId: "tL-Mh-s7JLE",
    title: "Alphabétisation des femmes — Programme Borgou",
    caption:
      "3 600 femmes formées en 2023. Reportage dans les villages du Nord-Bénin.",
    category: "Terrain",
    year: 2023,
    duration: "15 min",
  },
  {
    videoId: "PdFa8LiOatM",
    title: "Prix National Excellence ONG 2023",
    caption:
      "Cérémonie de remise du Prix National décerné par le Gouvernement béninois.",
    category: "Institutionnel",
    year: 2023,
    duration: "5 min",
  },
  {
    videoId: "Qw0BFhGSSUI",
    title: "Autonomisation des femmes — Groupement FAFEWA",
    caption:
      "Comment 38 femmes de Savalou ont créé leur propre caisse de crédit.",
    category: "Témoignages",
    year: 2024,
    duration: "11 min",
  },
  {
    videoId: "7YHZFmV1iqQ",
    title: "Partenariat AFD — Filières agricoles Atacora",
    caption: "Présentation du programme manioc-igname cofinancé à 850 M FCFA.",
    category: "Institutionnel",
    year: 2023,
    duration: "8 min",
  },
];

/* ══════════════════════════════════════════════════════════════════════════════
   DONNÉES — Success Stories (8 histoires)
══════════════════════════════════════════════════════════════════════════════ */
const SUCCESS_STORIES = [
  {
    id: "s1",
    name: "Awa Idrissou",
    role: "Agricultrice, 34 ans",
    location: "Borgou",
    domain: "Agriculture",
    year: 2024,
    portrait: "/assets/images/placeholder.svg",
    headline: "Du champ de survie au label bio : ×3 de revenus en 2 ans",
    story:
      "Avant MRJC, Awa cultivait 0,5 ha de maïs en monoculture avec des rendements désastreux. Grâce à la formation en agro-écologie, elle diversifie ses cultures, adopte le compostage et obtient un micro-crédit de 150 000 FCFA. Aujourd\'hui, elle gère 2 ha, vend ses légumes au marché de Parakou et forme à son tour 12 voisines.",
    quote:
      "J\'ai appris que la terre, c\'est un être vivant. Si on la respecte, elle nous nourrit en retour.",
    impact: { value: "×3", label: "revenus annuels" },
    color: "from-green-400 to-emerald-600",
  },
  {
    id: "s2",
    name: "Martine Kpossou",
    role: "Animatrice de santé communautaire, 29 ans",
    location: "Zou",
    domain: "Santé",
    year: 2024,
    portrait: "/assets/images/placeholder.svg",
    headline: "De mère analphabète à relais communautaire certifiée",
    story:
      "Martine a suivi le programme d\'alphabétisation fonctionnelle santé de MRJC en 2022. Elle y apprend à lire les fiches de suivi nutritionnel, à peser les enfants et à identifier les signes de malnutrition. Aujourd\'hui, elle coordonne les activités de 3 agents de santé dans son village et a contribué à réduire la malnutrition aigüe de 30 % dans sa zone.",
    quote:
      "Savoir lire m\'a donné la parole. Je peux défendre ma communauté et mes enfants.",
    impact: { value: "−30%", label: "malnutrition" },
    color: "from-blue-400 to-cyan-600",
  },
  {
    id: "s3",
    name: "Prudent Sèwé",
    role: "Enseignant bénévole, 41 ans",
    location: "Atlantique",
    domain: "Éducation",
    year: 2023,
    portrait: "/assets/images/placeholder.svg",
    headline: "248 femmes alphabétisées grâce à sa ténacité",
    story:
      "Professeur de lycée le jour, Prudent animait des classes d\'alphabétisation le soir et le week-end avec MRJC depuis 2019. Il a développé une méthode innovante combinant contes traditionnels et apprentissage du français. En 5 ans, 248 femmes ont obtenu leur certificat grâce à son engagement. Il a été élu meilleur formateur MRJC 2023.",
    quote:
      "Chaque femme alphabétisée, c\'est une famille qui change. Le savoir se transmet.",
    impact: { value: "248", label: "femmes formées" },
    color: "from-purple-400 to-violet-600",
  },
  {
    id: "s4",
    name: "Faridatou Sanni",
    role: "Présidente de groupement, 45 ans",
    location: "Donga",
    domain: "Femmes",
    year: 2024,
    portrait: "/assets/images/placeholder.svg",
    headline: "Une caisse de solidarité qui fait vivre 60 familles",
    story:
      "Faridatou a fondé le groupement Koossam avec 12 femmes en 2021, grâce à l\'accompagnement MRJC en microfinance et leadership. Aujourd\'hui, la caisse compte 60 membres et 8,5 millions FCFA d\'épargne. Les membres financent leurs campagnes agricoles sans passer par des usuriers. Elle forme maintenant d\'autres groupements dans la région.",
    quote:
      "Ensemble on est plus fortes que seules. L\'argent qu\'on économise, c\'est notre liberté.",
    impact: { value: "8,5 M", label: "FCFA épargnés" },
    color: "from-orange-400 to-amber-600",
  },
  {
    id: "s5",
    name: "Édouard Tossou",
    role: "Jeune entrepreneur agricole, 26 ans",
    location: "Mono",
    domain: "Agriculture",
    year: 2024,
    portrait: "/assets/images/placeholder.svg",
    headline: "De lycéen sans perspective à patron de 4 employés",
    story:
      "Édouard a suivi le programme \"Jeunes entrepreneurs agricoles\" de MRJC après son baccalauréat. En 18 mois, il apprend la gestion d'exploitation, le maraîchage hors-sol et le séchage solaire des tomates. Avec un prêt de 500 000 FCFA, il démarre sa propre exploitation de 1,5 ha et emploie aujourd'hui 4 jeunes de son village.",
    quote:
      "On m\'avait dit que l\'agriculture c\'était pour ceux qui ont échoué. J\'ai prouvé le contraire.",
    impact: { value: "4", label: "emplois créés" },
    color: "from-lime-400 to-green-600",
  },
  {
    id: "s6",
    name: "Blandine Hounsou",
    role: "Sage-femme relais, 38 ans",
    location: "Collines",
    domain: "Santé",
    year: 2023,
    portrait: "/assets/images/placeholder.svg",
    headline: "Zéro décès maternel en 2 ans dans son village",
    story:
      "Blandine a suivi la formation de sage-femme communautaire de MRJC en 2021. Elle y apprend les signes d\'alerte de la grossesse, les gestes de premiers secours obstétriques et la tenue des registres. Depuis 2022, aucun décès maternel n\'a été enregistré dans les 6 villages qu\'elle couvre. Elle a accompagné 148 naissances sans complication.",
    quote:
      "Chaque vie que je préserve, c\'est une famille entière qui reste debout.",
    impact: { value: "0", label: "décès maternel" },
    color: "from-rose-400 to-pink-600",
  },
  {
    id: "s7",
    name: "Raphaël Ayéléro",
    role: "Formateur en techniques agricoles, 52 ans",
    location: "Atacora",
    domain: "Agriculture",
    year: 2023,
    portrait: "/assets/images/placeholder.svg",
    headline: "Un paysan devenu formateur pour 400 agriculteurs",
    story:
      "Bénéficiaire MRJC en 2015, Raphaël a tellement assimilé les techniques agro-écologiques qu\'il est devenu formateur pour l\'ONG. Il anime des ateliers dans 8 communes de l\'Atacora, en langue Ditamari. Il a mis au point un kit pédagogique illustré adapté aux agriculteurs peu scolarisés, désormais adopté par 3 autres ONG du Bénin.",
    quote:
      "Je donne ce qu\'on m\'a donné, et je le multiplie. C\'est ma façon de remercier.",
    impact: { value: "400+", label: "agriculteurs formés" },
    color: "from-teal-400 to-cyan-600",
  },
  {
    id: "s8",
    name: "Adèle Dossou-Gbété",
    role: "Directrice de coopérative, 49 ans",
    location: "Atlantique",
    domain: "Femmes",
    year: 2024,
    portrait: "/assets/images/placeholder.svg",
    headline:
      "De vendeuse de rue à directrice d'une coopérative de 120 membres",
    story:
      "Adèle vendait des légumes sur les marchés sans en comprendre les mécanismes de prix ni les circuits de commercialisation. MRJC l'a formée en entrepreneuriat féminin et en gestion de coopérative. Elle préside aujourd'hui la Coop AVOTODJI, 120 membres, qui écoule 2 tonnes de légumes/semaine vers les marchés de Cotonou.",
    quote:
      "La formation m'a ouvert les yeux. Je ne vendais pas, je bradais. Maintenant je négocie.",
    impact: { value: "2 t", label: "légumes/semaine" },
    color: "from-fuchsia-400 to-purple-600",
  },
];

/* ══════════════════════════════════════════════════════════════════════════════
   DONNÉES — Storytelling (6 articles)
══════════════════════════════════════════════════════════════════════════════ */
const STORYTELLING = [
  {
    id: "st1",
    title: "Dans les champs de l'Atacora, une révolution silencieuse",
    excerpt:
      "Le soleil se lève à peine sur les collines de Tanguiéta quand Raphaël Ayéléro charger sa mobylette de plants de moringa et de semences certifiées. Il a 52 ans, une voix douce et une patience infinie. Depuis 9 ans, il parcourt 8 communes de l\'Atacora pour enseigner ce que personne ne lui avait appris : que la terre, traitée autrement, peut nourrir une famille entière.",
    author: "Marie-Claire Ogouwale, Journaliste MRJC",
    date: "Mars 2024",
    readTime: "8 min",
    location: "Atacora",
    tag: "Agriculture",
    tagColor: "bg-green-100 text-green-800",
    coverImage: "/assets/images/placeholder.svg",
  },
  {
    id: "st2",
    title: "3 600 femmes apprennent à lire. Le Borgou change.",
    excerpt:
      "Au fond de la salle de classe de banco de Kandi, 24 femmes entre 22 et 58 ans tracent des lettres avec des craies usées. Certaines n\'ont jamais tenu un stylo. D\'autres ont déjà suivi la première session et reviennent avec leurs filles. Dans le Borgou, le programme d\'alphabétisation de MRJC a atteint 3 600 bénéficiaires en 2023. Un record absolu.",
    author: "Séraphin Dah, Correspondant Nord-Bénin",
    date: "Février 2024",
    readTime: "6 min",
    location: "Borgou",
    tag: "Éducation",
    tagColor: "bg-purple-100 text-purple-800",
    coverImage: "/assets/images/placeholder.svg",
  },
  {
    id: "st3",
    title: "Faridatou et les 60 femmes qui ont inventé leur banque",
    excerpt:
      "Dans le petit bureau de l\'association Koossam à Djougou, des cahiers de comptes s\'empilent soigneusement. Chaque ligne représente une cotisation, un prêt, un remboursement. 8,5 millions de FCFA gérés collectivement par 60 femmes qui, il y a 3 ans, ne savaient pas ce qu\'était un taux d\'intérêt.",
    author: "Aïssata Moumouni, Correspondante Donga",
    date: "Janvier 2024",
    readTime: "7 min",
    location: "Donga",
    tag: "Femmes",
    tagColor: "bg-orange-100 text-orange-800",
    coverImage: "/assets/images/placeholder.svg",
  },
  {
    id: "st4",
    title: "Blandine, gardienne des naissances du Mono",
    excerpt:
      "Il est 3h du matin quand le téléphone de Blandine sonne. Une jeune femme accouche à 12 kilomètres, au bout d\'une piste de latérite. Elle enfile son sac, monte sur sa moto et fonce. En 2 ans, elle n\'a perdu aucune patiente. Dans un pays où la mortalité maternelle est encore alarmante, son téléphone est une bouée de sauvetage.",
    author: "Jonas Kossou, Journaliste Santé",
    date: "Décembre 2023",
    readTime: "9 min",
    location: "Mono",
    tag: "Santé",
    tagColor: "bg-blue-100 text-blue-800",
    coverImage: "/assets/images/placeholder.svg",
  },
  {
    id: "st5",
    title: "Édouard, 26 ans, patron de sa terre",
    excerpt:
      "Ses parents voulaient qu\'il parte en ville chercher un emploi de bureau. Édouard Tossou a choisi autrement. Avec le programme Jeunes Entrepreneurs Agricoles de MRJC, il a transformé 1,5 ha de brousse en exploitation maraîchère. Aujourd\'hui, il emploie 4 personnes et livre ses tomates séchées à des restaurants de Cotonou.",
    author: "Gilles Fandohan, Reporter MRJC",
    date: "Novembre 2023",
    readTime: "5 min",
    location: "Mono",
    tag: "Jeunesse",
    tagColor: "bg-lime-100 text-lime-800",
    coverImage: "/assets/images/placeholder.svg",
  },
  {
    id: "st6",
    title: "38 ans sur les routes du Bénin rural — Portrait d'une ONG engagée",
    excerpt:
      "En 1986, 33 jeunes réunis à Cotonou fondaient le MRJC-BÉNIN avec un objectif simple : être utiles aux communautés rurales qui les avaient vus naître. Presque quatre décennies plus tard, l'organisation est présente dans les 12 départements du Bénin, emploie 85 permanents et a touché plus de 85 000 bénéficiaires. Récit d'une odyssée humaine.",
    author: "Rédaction MRJC-BÉNIN",
    date: "Octobre 2023",
    readTime: "12 min",
    location: "Bénin",
    tag: "Histoire",
    tagColor: "bg-neutral-100 text-neutral-800",
    coverImage: "/assets/images/placeholder.svg",
  },
];

/* ══════════════════════════════════════════════════════════════════════════════
   COMPOSANT LIGHTBOX
══════════════════════════════════════════════════════════════════════════════ */
function PhotoLightbox({
  photo,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: {
  photo: (typeof PHOTOS)[0];
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative max-w-4xl w-full bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Image */}
          <div className="relative aspect-[4/3] bg-neutral-800">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover"
              sizes="90vw"
            />
            {/* Nav prev/next */}
            {hasPrev && (
              <button
                onClick={onPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors"
              >
                ‹
              </button>
            )}
            {hasNext && (
              <button
                onClick={onNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors"
              >
                ›
              </button>
            )}
          </div>
          {/* Info */}
          <div className="p-6 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-white font-bold mb-1">{photo.alt}</h3>
              <p className="text-neutral-300 text-sm mb-2">{photo.desc}</p>
              <div className="flex items-center gap-3 text-xs text-neutral-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {photo.location}
                </span>
                <span>·</span>
                <span>{photo.year}</span>
                <span>·</span>
                <span className="bg-white/10 px-2 py-0.5 rounded-full">
                  {photo.category}
                </span>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <a
                href={photo.src}
                download={`mrjc-${photo.id}.jpg`}
                className="p-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors"
                title="Télécharger"
              >
                <Download className="w-4 h-4" />
              </a>
              <button
                onClick={onClose}
                className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   COMPOSANT PRINCIPAL
══════════════════════════════════════════════════════════════════════════════ */
export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState<TabId>("publications");
  const [photoFilter, setPhotoFilter] = useState("Tous");
  const [videoFilter, setVideoFilter] = useState("Toutes");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const filteredPhotos =
    photoFilter === "Tous"
      ? PHOTOS
      : PHOTOS.filter((p) => p.category === photoFilter);

  const filteredVideos =
    videoFilter === "Toutes"
      ? VIDEOS
      : VIDEOS.filter((v) => v.category === videoFilter);

  const openLightbox = useCallback((idx: number) => setLightboxIdx(idx), []);
  const closeLightbox = useCallback(() => setLightboxIdx(null), []);
  const prevPhoto = useCallback(
    () => setLightboxIdx((i) => (i !== null && i > 0 ? i - 1 : i)),
    [],
  );
  const nextPhoto = useCallback(
    () =>
      setLightboxIdx((i) =>
        i !== null && i < filteredPhotos.length - 1 ? i + 1 : i,
      ),
    [filteredPhotos.length],
  );

  return (
    <>
      <PageHeader
        tag="Bibliothèque Multimédia"
        title="Centre de Ressources"
        subtitle="Publications, photos, vidéos, témoignages et récits de terrain : tout le patrimoine documentaire de MRJC-BÉNIN, librement accessible."
        breadcrumbs={[{ label: "Ressources" }]}
        image="/assets/images/placeholder.svg"
        align="left"
      >
        <div className="flex flex-wrap gap-3 mt-6">
          {[
            { value: "24+", label: "Publications" },
            { value: "18", label: "Photos" },
            { value: "8", label: "Vidéos YouTube" },
            { value: "8", label: "Success Stories" },
            { value: "Libre", label: "Accès gratuit" },
          ].map((s) => (
            <div
              key={s.label}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm
                            border border-white/20 rounded-xl px-4 py-2"
            >
              <span className="text-white font-bold">{s.value}</span>
              <span className="text-primary-200 text-xs">{s.label}</span>
            </div>
          ))}
        </div>
      </PageHeader>

      {/* ── Navigation Onglets ─────────────────────────────────────────────── */}
      <div className="sticky top-16 z-30 bg-white border-b border-neutral-200 shadow-sm">
        <div className="container-mrjc">
          <nav
            className="flex gap-0 overflow-x-auto scrollbar-hide"
            aria-label="Sections ressources"
          >
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold whitespace-nowrap
                              border-b-2 transition-all duration-200 flex-shrink-0
                              ${
                                active
                                  ? "border-primary-600 text-primary-700"
                                  : "border-transparent text-neutral-500 hover:text-neutral-800 hover:border-neutral-300"
                              }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full font-bold
                    ${active ? "bg-primary-100 text-primary-700" : "bg-neutral-100 text-neutral-500"}`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="bg-neutral-50 min-h-screen">
        <div className="container-mrjc py-14">
          {/* ════════════════════════════════════════════════════════════
              ONGLET PUBLICATIONS
          ════════════════════════════════════════════════════════════ */}
          {activeTab === "publications" && (
            <motion.div
              key="publications"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-20"
            >
              {/* Catégories */}
              <section>
                <div className="mb-10">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-2">
                    Catégories
                  </p>
                  <h2 className="font-display text-3xl font-bold text-neutral-900">
                    Explorer par type de document
                  </h2>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {RESOURCE_CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <Link
                        key={cat.id}
                        href={cat.href}
                        className="group bg-white rounded-2xl border border-neutral-200 p-6
                                       hover:border-primary-300 hover:shadow-md transition-all duration-200"
                      >
                        <div
                          className={`w-12 h-12 ${cat.color} rounded-xl flex items-center
                                         justify-center mb-4 group-hover:scale-110 transition-transform`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-neutral-900 group-hover:text-primary-700 transition-colors">
                            {cat.label}
                          </h3>
                          <span className="text-xs font-semibold bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full">
                            {cat.count}
                          </span>
                        </div>
                        <div
                          className="flex items-center gap-1.5 text-xs font-semibold text-primary-600
                                        group-hover:gap-2.5 transition-all mt-3"
                        >
                          Parcourir <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>

              {/* Documents phares */}
              <section>
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-2">
                      Phares
                    </p>
                    <h2 className="font-display text-3xl font-bold text-neutral-900">
                      Documents les plus téléchargés
                    </h2>
                  </div>
                  <Link
                    href="/resources/publications"
                    className="btn-outline hidden md:inline-flex"
                  >
                    Toutes les publications <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {FEATURED_DOCS.map((doc) => (
                    <article
                      key={doc.id}
                      className="bg-white rounded-2xl border border-neutral-200 overflow-hidden
                                        hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group"
                    >
                      <div className="relative h-44 bg-neutral-100">
                        <Image
                          src={doc.coverImage}
                          alt={doc.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <span className="absolute top-3 right-3 text-xs font-bold bg-white/90 text-neutral-700 px-2 py-1 rounded-full">
                          PDF · {doc.size}
                        </span>
                      </div>
                      <div className="p-5">
                        <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                          {doc.type}
                        </span>
                        <h3 className="font-bold text-neutral-900 mt-2 mb-3 line-clamp-2">
                          {doc.title}
                        </h3>
                        <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                          <span className="text-xs text-neutral-400 flex items-center gap-1">
                            <Download className="w-3 h-3" />
                            {doc.downloads.toLocaleString("fr-FR")} télécharg.
                          </span>
                          <a
                            href={doc.fileUrl}
                            download
                            className="inline-flex items-center gap-1.5 text-xs font-semibold
                                        text-primary-600 hover:text-primary-700 transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" /> Télécharger
                          </a>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {/* ════════════════════════════════════════════════════════════
              ONGLET PHOTOTHÈQUE
          ════════════════════════════════════════════════════════════ */}
          {activeTab === "photos" && (
            <motion.div
              key="photos"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* En-tête + filtres */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-2">
                    Photothèque
                  </p>
                  <h2 className="font-display text-3xl font-bold text-neutral-900">
                    Galerie de terrain
                  </h2>
                  <p className="text-neutral-500 mt-1 flex items-center gap-2">
                    <Camera className="w-4 h-4 text-primary-500" />
                    {filteredPhotos.length} photo
                    {filteredPhotos.length > 1 ? "s" : ""} · Libre de droit pour
                    usage éditorial
                  </p>
                </div>
                {/* Filtres */}
                <div className="flex flex-wrap gap-2 items-center">
                  <Filter className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                  {PHOTO_FILTERS.map((f) => (
                    <button
                      key={f}
                      onClick={() => setPhotoFilter(f)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200
                        ${
                          photoFilter === f
                            ? "bg-primary-600 text-white shadow-md"
                            : "bg-white border border-neutral-200 text-neutral-600 hover:border-primary-300"
                        }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grille masonry simulée */}
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                <AnimatePresence mode="popLayout">
                  {filteredPhotos.map((photo, idx) => (
                    <motion.div
                      key={photo.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: idx * 0.04 }}
                      className="break-inside-avoid group relative cursor-pointer rounded-2xl overflow-hidden
                                 bg-neutral-100 hover:shadow-xl transition-all duration-300"
                      onClick={() => openLightbox(idx)}
                    >
                      <div className="relative">
                        <Image
                          src={photo.src}
                          alt={photo.alt}
                          width={800}
                          height={idx % 3 === 0 ? 600 : 400}
                          className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        {/* Overlay */}
                        <div
                          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent
                                        opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        />
                        {/* Icône zoom */}
                        <div
                          className="absolute inset-0 flex items-center justify-center
                                        opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <ZoomIn className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        {/* Info bas */}
                        <div
                          className="absolute bottom-0 left-0 right-0 p-3
                                        opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          <span className="text-xs font-bold bg-primary-600 text-white px-2 py-0.5 rounded-full">
                            {photo.category}
                          </span>
                          <p className="text-white text-xs font-medium mt-1.5 line-clamp-2">
                            {photo.alt}
                          </p>
                          <p className="text-white/60 text-xs flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" />
                            {photo.location} · {photo.year}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* CTA kit presse */}
              <div
                className="mt-16 bg-white rounded-3xl border border-neutral-200 p-8 flex flex-col md:flex-row
                               items-center justify-between gap-6"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Camera className="w-7 h-7 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-900 mb-0.5">
                      Kit Presse & Photos Haute Résolution
                    </h3>
                    <p className="text-sm text-neutral-500">
                      Journalistes et partenaires : téléchargez notre kit
                      complet (logos, photos HD, charte graphique).
                    </p>
                  </div>
                </div>
                <Link
                  href="/resources/media-kit"
                  className="btn-primary flex-shrink-0"
                >
                  <Download className="w-4 h-4" /> Accéder au Kit Média
                </Link>
              </div>
            </motion.div>
          )}

          {/* ════════════════════════════════════════════════════════════
              ONGLET VIDÉOTHÈQUE — YouTubeEmbed activé
          ════════════════════════════════════════════════════════════ */}
          {activeTab === "videos" && (
            <motion.div
              key="videos"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10"
            >
              {/* ── En-tête section ── */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Youtube className="w-5 h-5 text-red-600" />
                    <p className="text-xs font-bold uppercase tracking-widest text-red-600">
                      Vidéothèque MRJC-BÉNIN
                    </p>
                  </div>
                  <h2 className="font-display text-3xl font-bold text-neutral-900">
                    Séances terrain & réalisations filmées
                  </h2>
                  <p className="text-neutral-500 mt-2 max-w-xl">
                    Documentaires, reportages terrain, témoignages de
                    bénéficiaires et événements institutionnels — tout notre
                    travail en images.
                  </p>
                </div>
                <a
                  href="https://www.youtube.com/@mrjcbenin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 bg-red-600 hover:bg-red-700
                             text-white font-bold px-6 py-3 rounded-xl transition-colors
                             shadow-md hover:shadow-lg flex-shrink-0"
                >
                  <Youtube className="w-5 h-5 fill-white" />
                  Notre chaîne YouTube
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* ── Stats rapides ── */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    value: "8",
                    label: "vidéos",
                    icon: <Play className="w-4 h-4" />,
                  },
                  {
                    value: "4",
                    label: "catégories",
                    icon: <Filter className="w-4 h-4" />,
                  },
                  {
                    value: "85 min",
                    label: "de contenu",
                    icon: <Eye className="w-4 h-4" />,
                  },
                  {
                    value: "2023–24",
                    label: "productions",
                    icon: <Calendar className="w-4 h-4" />,
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="bg-white rounded-2xl border border-neutral-100 p-4 flex items-center gap-3"
                  >
                    <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
                      {s.icon}
                    </div>
                    <div>
                      <p className="font-display font-black text-lg text-neutral-900 leading-none">
                        {s.value}
                      </p>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        {s.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Filtres catégories ── */}
              <div className="flex flex-wrap gap-2">
                {VIDEO_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setVideoFilter(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200
                      ${
                        videoFilter === cat
                          ? "bg-red-600 text-white shadow-sm"
                          : "bg-white border border-neutral-200 text-neutral-600 hover:border-red-300 hover:text-red-600"
                      }`}
                  >
                    {cat}
                    {cat !== "Toutes" && (
                      <span
                        className={`ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full
                        ${videoFilter === cat ? "bg-white/20" : "bg-neutral-100"}`}
                      >
                        {VIDEOS.filter((v) => v.category === cat).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* ── Vidéo vedette (grande) ── */}
              {filteredVideos.length > 0 &&
                (() => {
                  const featured = filteredVideos[0];
                  return (
                    <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
                      <div className="grid lg:grid-cols-[1fr_380px] gap-0">
                        {/* Player */}
                        <div className="relative">
                          <div className="absolute top-4 left-4 z-10">
                            <span className="inline-flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
                              <Star className="w-3 h-3 fill-white" /> Vidéo
                              vedette
                            </span>
                          </div>
                          <YouTubeEmbed
                            videoId={featured.videoId}
                            title={featured.title}
                            thumbnailQuality="maxresdefault"
                            showChannelBadge={false}
                            autoplay
                            className="rounded-none"
                          />
                        </div>
                        {/* Fiche détaillée */}
                        <div className="p-8 flex flex-col justify-between bg-neutral-50">
                          <div>
                            <div className="inline-flex items-center gap-1.5 bg-red-100 text-red-700 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
                              <Youtube className="w-3.5 h-3.5" />
                              {featured.category}
                            </div>
                            <h3 className="font-display text-xl font-bold text-neutral-900 leading-snug mb-3">
                              {featured.title}
                            </h3>
                            <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                              {featured.caption}
                            </p>
                            <div className="grid grid-cols-2 gap-3 mb-6">
                              <div className="bg-white rounded-xl p-3 border border-neutral-200">
                                <p className="text-[10px] text-neutral-400 uppercase tracking-wide font-semibold">
                                  Année
                                </p>
                                <p className="text-sm font-bold text-neutral-800 mt-0.5 flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5 text-primary-500" />{" "}
                                  {featured.year}
                                </p>
                              </div>
                              <div className="bg-white rounded-xl p-3 border border-neutral-200">
                                <p className="text-[10px] text-neutral-400 uppercase tracking-wide font-semibold">
                                  Durée
                                </p>
                                <p className="text-sm font-bold text-neutral-800 mt-0.5 flex items-center gap-1">
                                  <Eye className="w-3.5 h-3.5 text-primary-500" />{" "}
                                  {featured.duration}
                                </p>
                              </div>
                            </div>
                            <div className="bg-white rounded-xl p-3 border border-neutral-200 mb-6">
                              <p className="text-[10px] text-neutral-400 uppercase tracking-wide font-semibold mb-1">
                                Production
                              </p>
                              <p className="text-sm font-medium text-neutral-700 flex items-center gap-1.5">
                                <Users className="w-3.5 h-3.5 text-primary-500" />{" "}
                                MRJC Communication — Bénin
                              </p>
                            </div>
                          </div>
                          <a
                            href={`https://www.youtube.com/watch?v=${featured.videoId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700
                                     text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-sm"
                          >
                            <Youtube className="w-4 h-4" /> Regarder sur YouTube{" "}
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })()}

              {/* ── Grille des autres vidéos ── */}
              {filteredVideos.length > 1 && (
                <div>
                  <h3 className="font-display text-lg font-bold text-neutral-700 mb-5 flex items-center gap-2">
                    <Play className="w-4 h-4 text-red-500" />
                    {filteredVideos.length - 1} autre
                    {filteredVideos.length > 2 ? "s" : ""} vidéo
                    {filteredVideos.length > 2 ? "s" : ""}
                  </h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredVideos.slice(1).map((video) => (
                      <div
                        key={video.videoId}
                        className="bg-white rounded-2xl border border-neutral-100 overflow-hidden hover:shadow-md transition-all group"
                      >
                        {/* ── YouTubeEmbed — lazy : iframe chargé au clic sur la vignette ── */}
                        <YouTubeEmbed
                          videoId={video.videoId}
                          title={video.title}
                          thumbnailQuality="hqdefault"
                          showChannelBadge={false}
                          autoplay
                          className="rounded-none"
                        />
                        {/* Métadonnées */}
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                              {video.category}
                            </span>
                            <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                              <Eye className="w-3 h-3" /> {video.duration}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-neutral-800 line-clamp-2 group-hover:text-red-700 transition-colors mb-1">
                            {video.title}
                          </h4>
                          <p className="text-xs text-neutral-400 line-clamp-2">
                            {video.caption}
                          </p>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
                            <span className="text-xs text-neutral-400">
                              {video.year}
                            </span>
                            <a
                              href={`https://www.youtube.com/watch?v=${video.videoId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
                            >
                              YouTube <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Aucun résultat ── */}
              {filteredVideos.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl border border-neutral-100">
                  <Youtube className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                  <p className="text-neutral-500 font-medium">
                    Aucune vidéo dans cette catégorie
                  </p>
                  <button
                    onClick={() => setVideoFilter("Toutes")}
                    className="mt-4 text-sm text-red-600 hover:text-red-700 font-semibold"
                  >
                    Voir toutes les vidéos
                  </button>
                </div>
              )}

              {/* ── Banner abonnement ── */}
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #c91010 0%, #7f0000 100%)",
                }}
                className="rounded-3xl p-10 text-center text-white relative overflow-hidden"
              >
                <div className="absolute inset-0 opacity-10" aria-hidden="true">
                  <div className="absolute -right-16 -top-16 w-64 h-64 border-2 border-white rounded-full" />
                  <div className="absolute -left-8 -bottom-8 w-40 h-40 border border-white rounded-full" />
                </div>
                <div className="relative z-10">
                  <Youtube className="w-12 h-12 mx-auto mb-4 text-white/80" />
                  <h3 className="font-display text-2xl font-bold mb-2">
                    Suivez MRJC-BÉNIN sur YouTube
                  </h3>
                  <p className="text-white/75 mb-8 max-w-lg mx-auto text-sm">
                    Abonnez-vous pour ne manquer aucun documentaire, reportage
                    terrain ou témoignage de nos bénéficiaires. Nouveau contenu
                    chaque trimestre.
                  </p>
                  <a
                    href="https://www.youtube.com/@mrjcbenin"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 bg-white text-red-700
                               font-bold px-8 py-3.5 rounded-xl hover:bg-red-50 transition-colors shadow-lg"
                  >
                    <Youtube className="w-5 h-5 text-red-600" />
                    S&apos;abonner sur YouTube
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          )}

          {/* ════════════════════════════════════════════════════════════
              ONGLET SUCCESS STORIES
          ════════════════════════════════════════════════════════════ */}
          {activeTab === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-16"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-2">
                  Success Stories
                </p>
                <h2 className="font-display text-3xl font-bold text-neutral-900 mb-2">
                  Des vies transformées
                </h2>
                <p className="text-neutral-500 max-w-2xl">
                  Ces hommes et femmes ont bénéficié des programmes MRJC-BÉNIN
                  et ont transformé leur vie, leur famille, leur communauté. Ce
                  sont eux, notre impact réel.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {SUCCESS_STORIES.map((story, i) => (
                  <motion.article
                    key={story.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-white rounded-3xl overflow-hidden border border-neutral-200
                               hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className={`h-2 bg-gradient-to-r ${story.color}`} />
                    <div className="p-7">
                      {/* Personne */}
                      <div className="flex items-center gap-4 mb-5">
                        <div className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-neutral-100">
                          <Image
                            src={story.portrait}
                            alt={story.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-neutral-900">
                              {story.name}
                            </h3>
                            <span
                              className={`text-xs font-semibold px-2 py-0.5 rounded-full
                              ${
                                story.domain === "Agriculture"
                                  ? "bg-green-100 text-green-700"
                                  : story.domain === "Santé"
                                    ? "bg-blue-100 text-blue-700"
                                    : story.domain === "Éducation"
                                      ? "bg-purple-100 text-purple-700"
                                      : "bg-orange-100 text-orange-700"
                              }`}
                            >
                              {story.domain}
                            </span>
                          </div>
                          <p className="text-sm text-neutral-500">
                            {story.role}
                          </p>
                          <p className="text-xs text-neutral-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" />
                            {story.location} · {story.year}
                          </p>
                        </div>
                      </div>

                      {/* Headline + impact */}
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <h4 className="font-display font-bold text-neutral-900 text-lg leading-tight">
                          {story.headline}
                        </h4>
                        <div
                          className={`flex-shrink-0 text-center px-4 py-3 rounded-2xl
                                         bg-gradient-to-b ${story.color} text-white`}
                        >
                          <p className="text-xl font-black">
                            {story.impact.value}
                          </p>
                          <p className="text-[10px] font-semibold opacity-80 leading-tight">
                            {story.impact.label}
                          </p>
                        </div>
                      </div>

                      {/* Récit */}
                      <p className="text-sm text-neutral-600 leading-relaxed mb-4 line-clamp-3">
                        {story.story}
                      </p>

                      {/* Citation */}
                      <blockquote className="bg-neutral-50 rounded-2xl p-4 border-l-4 border-primary-400">
                        <div className="flex gap-2">
                          <Quote className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-neutral-700 italic leading-relaxed">
                            {story.quote}
                          </p>
                        </div>
                      </blockquote>

                      <div className="flex items-center justify-end mt-5 pt-4 border-t border-neutral-100">
                        <button
                          className="inline-flex items-center gap-1.5 text-xs font-semibold
                                           text-primary-600 hover:text-primary-700 transition-colors"
                        >
                          Lire l'histoire complète{" "}
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>

              <div className="bg-primary-50 border border-primary-200 rounded-3xl p-10 text-center">
                <Star className="w-10 h-10 text-secondary-500 fill-secondary-500 mx-auto mb-4" />
                <h3 className="font-display text-xl font-bold text-primary-900 mb-2">
                  Vous connaissez une belle histoire ?
                </h3>
                <p className="text-primary-700/80 text-sm mb-8 max-w-md mx-auto">
                  Si vous êtes bénéficiaire MRJC ou si vous connaissez quelqu'un
                  dont la vie a été transformée, partagez son histoire avec
                  nous.
                </p>
                <Link href="/contact" className="btn-primary">
                  <Share2 className="w-4 h-4" /> Partager une histoire
                </Link>
              </div>
            </motion.div>
          )}

          {/* ════════════════════════════════════════════════════════════
              ONGLET STORYTELLING
          ════════════════════════════════════════════════════════════ */}
          {activeTab === "stories" && (
            <motion.div
              key="stories"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-16"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-2">
                  Storytelling
                </p>
                <h2 className="font-display text-3xl font-bold text-neutral-900 mb-2">
                  Récits de terrain
                </h2>
                <p className="text-neutral-500 max-w-2xl">
                  Des textes longs, immersifs et humains qui racontent
                  l&apos;action de MRJC-BÉNIN de l&apos;intérieur : les agents,
                  les bénéficiaires, les villages, les défis et les victoires.
                </p>
              </div>

              {/* Article vedette */}
              <div
                className="grid lg:grid-cols-[1.2fr_1fr] gap-0 bg-white rounded-3xl overflow-hidden
                               border border-neutral-200 shadow-lg"
              >
                <div className="relative min-h-64 lg:min-h-0">
                  <Image
                    src={STORYTELLING[0].coverImage}
                    alt={STORYTELLING[0].title}
                    fill
                    className="object-cover"
                    sizes="60vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
                  <span
                    className={`absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full ${STORYTELLING[0].tagColor}`}
                  >
                    {STORYTELLING[0].tag}
                  </span>
                </div>
                <div className="p-8 lg:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-3 text-xs text-neutral-400 mb-5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {STORYTELLING[0].date}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {STORYTELLING[0].readTime} de lecture
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {STORYTELLING[0].location}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-neutral-900 mb-4 leading-tight">
                    {STORYTELLING[0].title}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed mb-6 line-clamp-4">
                    {STORYTELLING[0].excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-400">
                      Par {STORYTELLING[0].author}
                    </span>
                    <button className="btn-primary btn-sm">
                      Lire l'article <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Grille articles */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {STORYTELLING.slice(1).map((article, i) => (
                  <motion.article
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-2xl overflow-hidden border border-neutral-200
                               hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <div className="relative h-52 overflow-hidden bg-neutral-100">
                      <Image
                        src={article.coverImage}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <span
                        className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${article.tagColor}`}
                      >
                        {article.tag}
                      </span>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-xs text-neutral-400 mb-3">
                        <Calendar className="w-3 h-3" /> {article.date}
                        <span>·</span>
                        <Eye className="w-3 h-3" /> {article.readTime}
                      </div>
                      <h3 className="font-bold text-neutral-900 mb-2 line-clamp-2 group-hover:text-primary-700 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-sm text-neutral-500 line-clamp-3 mb-4">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                        <span className="text-xs text-neutral-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {article.location}
                        </span>
                        <button
                          className="text-xs font-semibold text-primary-600 hover:text-primary-700
                                           flex items-center gap-1 transition-colors"
                        >
                          Lire <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>

              {/* CTA */}
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #1B6B3A 0%, #003087 100%)",
                }}
                className="rounded-3xl p-10 text-white text-center"
              >
                <Heart className="w-10 h-10 text-secondary-400 mx-auto mb-4" />
                <h3 className="font-display text-xl font-bold mb-2">
                  Vous avez une histoire à raconter ?
                </h3>
                <p className="text-white/80 text-sm mb-8 max-w-md mx-auto">
                  Bénéficiaire, agent de terrain, partenaire… Votre témoignage
                  est précieux. Contactez notre équipe communication.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-white text-primary-700
                                                  font-bold px-8 py-3 rounded-xl hover:bg-neutral-50 transition-colors"
                >
                  Nous écrire <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && filteredPhotos[lightboxIdx] && (
        <PhotoLightbox
          photo={filteredPhotos[lightboxIdx]}
          onClose={closeLightbox}
          onPrev={prevPhoto}
          onNext={nextPhoto}
          hasPrev={lightboxIdx > 0}
          hasNext={lightboxIdx < filteredPhotos.length - 1}
        />
      )}
    </>
  );
}
