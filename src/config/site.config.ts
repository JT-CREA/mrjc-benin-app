export const siteConfig = {
  name: "MRJC-BÉNIN",
  fullName: "Mouvement Rural de Jeunesse Chrétienne du Bénin",
  tagline: "Un engagement au service des porteurs de changement",
  description:
    "ONG béninoise spécialisée dans le développement rural, l'autonomisation des communautés, la santé communautaire, l'éducation et l'entrepreneuriat agricole.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://mrjc-benin.org",
  locale: "fr_BJ",
  language: "fr",
  country: "Bénin",
  founded: 1985,
  legalStatus: "Organisation Non Gouvernementale (ONG)",
  registrationNumber: "92/029/MISAT/DAI/SCC/ASSOC du 16 novembre 1992",

  contact: {
    address: "Comè, Bénin",
    addressFull: "BP 188, Comè, République du Bénin",
    phone: "+229 01 97 12 06 27",
    phoneBureau: "+229 01 67 78 76 66",
    email: "mrjccome@yahoo.fr",
    emailInfo: "info@mrjc-benin.org",
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+22997120627",
    mapCoordinates: { lat: 6.3654, lng: 2.4183 }, // Cotonou
  },

  social: {
    facebook:
      process.env.NEXT_PUBLIC_FACEBOOK_PAGE || "https://facebook.com/mrjcbenin",
    twitter: process.env.NEXT_PUBLIC_TWITTER_HANDLE || "@mrjcbenin",
    linkedin:
      process.env.NEXT_PUBLIC_LINKEDIN_PAGE ||
      "https://linkedin.com/company/mrjc-benin",
    youtube:
      process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL ||
      "https://youtube.com/@mrjcbenin",
    instagram:
      process.env.NEXT_PUBLIC_INSTAGRAM_PAGE ||
      "https://instagram.com/mrjcbenin",
  },

  seo: {
    titleTemplate: "%s | MRJC-BÉNIN",
    defaultTitle:
      "MRJC-BÉNIN — Mouvement Rural de Jeunesse Chrétienne du Bénin",
    defaultImage: "/assets/images/og-default.jpg",
    twitterCard: "summary_large_image" as const,
  },

  analytics: {
    gaId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "",
    matomoUrl: process.env.NEXT_PUBLIC_MATOMO_URL || "",
    matomoSiteId: process.env.NEXT_PUBLIC_MATOMO_SITE_ID || "1",
  },

  impactStats: {
    beneficiaries: 85000,
    projects: 47,
    villages: 230,
    years: new Date().getFullYear() - 1985,
    partners: 35,
  },

  domains: [
    {
      id: "agricultural-council",
      name: "Conseil Agricole & Entrepreneuriat",
      slug: "conseil-agricole-entrepreneuriat",
      icon: "🌾",
      color: "#1B6B3A",
    },
    {
      id: "community-health",
      name: "Santé Communautaire & Nutrition",
      slug: "sante-communautaire-nutrition",
      icon: "🏥",
      color: "#2D5F8A",
    },
    {
      id: "literacy-education",
      name: "Alphabétisation & Éducation",
      slug: "alphabetisation-education",
      icon: "📚",
      color: "#D4870A",
    },
    {
      id: "women-empowerment",
      name: "Autonomisation des Femmes",
      slug: "autonomisation-femmes",
      icon: "✊",
      color: "#8B2252",
    },
    {
      id: "social-intermediation",
      name: "Intermédiation Sociale",
      slug: "intermediation-sociale",
      icon: "🤝",
      color: "#455A64",
    },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
