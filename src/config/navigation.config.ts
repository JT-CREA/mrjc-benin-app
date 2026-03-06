/**
 * navigation.config.ts — MRJC-BÉNIN
 * Modifications :
 *  - Menu "Contact" SUPPRIMÉ (doublon avec bouton CTA "Nous contacter")
 *  - Propriété `alignRight` pour éviter l'overflow des menus en fin de barre
 */

export interface NavItem {
  label: string;
  href: string;
  description?: string;
  icon?: string;
  badge?: string;
  /** Aligne le dropdown à droite (évite le débordement hors écran) */
  alignRight?: boolean;
  children?: NavItem[];
  featured?: {
    title: string;
    description: string;
    href: string;
    image?: string;
    /** ID YouTube → affiche le thumbnail de la vidéo dans le panel featured */
    videoId?: string;
    /** Libellé du bouton CTA (défaut : "En savoir plus") */
    cta?: string;
  };
}

export const navigationConfig: NavItem[] = [
  {
    label: "Accueil",
    href: "/",
  },
  {
    label: "Nous Connaître",
    href: "/about",
    children: [
      {
        label: "Histoire & Genèse",
        href: "/about/history",
        description: "L'aventure MRJC depuis 1985",
        icon: "📜",
      },
      {
        label: "Vision & Mission",
        href: "/about/vision-mission",
        description: "Notre raison d'être et nos ambitions",
        icon: "🎯",
      },
      {
        label: "Valeurs & Principes",
        href: "/about/values",
        description: "Les fondements de notre engagement",
        icon: "💎",
      },
      {
        label: "Notre Organisation",
        href: "/about/organization",
        description: "Gouvernance, équipe et structure",
        icon: "🏛️",
      },
    ],
    featured: {
      title: "Notre Histoire",
      description:
        "Depuis 1985, MRJC-BÉNIN accompagne les communautés rurales vers un développement durable et solidaire.",
      href: "/about/history",
    },
  },
  {
    label: "Domaines",
    href: "/domains",
    children: [
      {
        label: "Conseil Agricole & Entrepreneuriat",
        href: "/domains/conseil-agricole-entrepreneuriat",
        description: "Formation, appui-conseil et entrepreneuriat rural",
        icon: "🌾",
      },
      {
        label: "Santé Communautaire & Nutrition",
        href: "/domains/sante-communautaire-nutrition",
        description: "Promotion de la santé et amélioration nutritionnelle",
        icon: "🏥",
      },
      {
        label: "Alphabétisation & Éducation",
        href: "/domains/alphabetisation-education",
        description: "Accès à l'éducation et réduction de l'analphabétisme",
        icon: "📚",
      },
      {
        label: "Autonomisation des Femmes",
        href: "/domains/autonomisation-femmes",
        description: "Renforcement du leadership et de l'économie féminine",
        icon: "✊",
      },
      {
        label: "Intermédiation Sociale",
        href: "/domains/intermediation-sociale",
        description: "Cohésion sociale et gouvernance locale",
        icon: "🤝",
      },
    ],
    featured: {
      title: "Nos Expertises",
      description:
        "5 domaines d'intervention pour un impact holistique sur les communautés du Bénin.",
      href: "/domains",
    },
  },
  {
    label: "Nos Projets",
    href: "/projects",
    children: [
      {
        label: "Projets en cours",
        href: "/projects/ongoing",
        description: "Interventions actives sur le terrain",
        icon: "🔄",
        badge: "Actif",
      },
      {
        label: "Projets clôturés",
        href: "/projects/completed",
        description: "Bilan et leçons apprises",
        icon: "✅",
      },
      {
        label: "Notre Impact",
        href: "/impact",
        description: "Chiffres clés et résultats mesurés",
        icon: "📊",
      },
      {
        label: "Carte des interventions",
        href: "/projects#map",
        description: "Zones géographiques couvertes",
        icon: "🗺️",
      },
    ],
    featured: {
      title: "Projets Phares",
      description:
        "Découvrez nos interventions les plus impactantes à travers le Bénin.",
      href: "/projects",
    },
  },
  {
    label: "Ressources",
    href: "/resources",
    alignRight: true,
    children: [
      {
        label: "Actualités",
        href: "/news",
        description: "Dernières nouvelles et événements",
        icon: "📰",
        badge: "Nouveau",
      },
      {
        label: "Blog",
        href: "/blog",
        description: "Articles d'analyse et de réflexion",
        icon: "✍️",
      },
      {
        label: "Publications",
        href: "/resources/publications",
        description: "Success stories, rapports et études",
        icon: "📑",
      },
      {
        label: "Fiches Techniques",
        href: "/resources/technical-guides",
        description: "Guides et outils pratiques",
        icon: "📋",
      },
      {
        label: "Vidéothèque",
        href: "/videoteque",
        description: "Documentaires, terrain et témoignages",
        icon: "🎬",
        badge: "Nouveau",
      },
      {
        label: "Albums Photos",
        href: "/resources/photo-albums",
        description: "Galeries illustrées de nos actions",
        icon: "📸",
      },
      {
        label: "Rapports Annuels",
        href: "/resources/annual-reports",
        description: "Bilans annuels téléchargeables",
        icon: "📊",
      },
    ],
    featured: {
      title: "Vidéothèque",
      description:
        "Documentaires terrain, témoignages et séances de formation — toute la vidéographie de MRJC-BÉNIN.",
      href: "/videoteque",
      videoId: "gCNeDWCI0vo",
      cta: "Voir la vidéothèque",
    },
  },
  {
    label: "Travailler Avec Nous",
    href: "/work-with-us",
    alignRight: true,
    children: [
      {
        label: "Offres de Recrutement",
        href: "/work-with-us/jobs",
        description: "Rejoignez notre équipe",
        icon: "💼",
        badge: "Offres",
      },
      {
        label: "Bénévolat",
        href: "/work-with-us/volunteer",
        description: "Engagez-vous bénévolement",
        icon: "🙋",
      },
      {
        label: "Stages & Alternance",
        href: "/work-with-us/internship",
        description: "Opportunités académiques",
        icon: "🎓",
      },
      {
        label: "Collaboration & Partenariat",
        href: "/work-with-us/collaboration",
        description: "Travaillons ensemble",
        icon: "🤝",
      },
    ],
    featured: {
      title: "Rejoignez-Nous",
      description:
        "Plusieurs façons de contribuer à notre mission : emploi, bénévolat, partenariat.",
      href: "/work-with-us",
    },
  },
  /* ── "Contact" intentionnellement SUPPRIMÉ — doublon avec bouton CTA ── */
];

export const footerNavigation = {
  organisation: [
    { label: "Qui sommes-nous", href: "/about" },
    { label: "Notre Histoire", href: "/about/history" },
    { label: "Vision & Mission", href: "/about/vision-mission" },
    { label: "Notre Équipe", href: "/about/organization" },
    { label: "Nos Partenaires", href: "/partners" },
  ],
  actions: [
    { label: "Nos Projets", href: "/projects" },
    { label: "Domaines d'Intervention", href: "/domains" },
    { label: "Tableau de Bord Impact", href: "/impact" },
    { label: "Devenir Bénévole", href: "/work-with-us/volunteer" },
  ],
  resources: [
    { label: "Actualités", href: "/news" },
    { label: "Blog", href: "/blog" },
    { label: "Vidéothèque", href: "/videoteque" },
    { label: "Publications", href: "/resources/publications" },
    { label: "Fiches Techniques", href: "/resources/technical-guides" },
    { label: "Rapports Annuels", href: "/resources/annual-reports" },
  ],
  legal: [
    { label: "Mentions Légales", href: "/legal-mentions" },
    { label: "Politique de Confidentialité", href: "/privacy-policy" },
    { label: "Politique des Cookies", href: "/cookie-policy" },
    { label: "Conditions d'Utilisation", href: "/terms-of-use" },
    { label: "Déclaration d'Accessibilité", href: "/accessibility" },
  ],
};
