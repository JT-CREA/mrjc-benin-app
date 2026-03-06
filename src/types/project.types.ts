export type ProjectStatus = "ongoing" | "completed" | "planned" | "suspended";

export type ProjectDomain =
  | "agricultural-council"
  | "community-health"
  | "literacy-education"
  | "women-empowerment"
  | "social-intermediation";

export interface ProjectPartner {
  name: string;
  logo?: string;
  url?: string;
  role: "funder" | "technical" | "implementation" | "other";
}

export interface ProjectBeneficiary {
  type: string;
  count: number;
  description?: string;
}

export interface ProjectGalleryItem {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  date?: string;
}

export interface ProjectResult {
  indicator: string;
  target: number;
  achieved: number;
  unit: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  status: ProjectStatus;
  domain: ProjectDomain;
  domains?: ProjectDomain[]; // Multi-domaines
  tags: string[];

  // Contenu
  excerpt: string;
  description: string; // HTML/Markdown
  objectives: string[];
  activities: string[];
  methodology?: string;

  // Géographie
  zone: string;
  departments: string[];
  communes?: string[];
  villages?: string[];

  // Chronologie
  startDate: string; // ISO
  endDate?: string; // ISO
  duration?: string; // "24 mois"

  // Financement
  budget?: number; // FCFA
  currency?: string;
  funders: ProjectPartner[];
  partners?: ProjectPartner[];

  // Impact
  beneficiaries: ProjectBeneficiary[];
  results?: ProjectResult[];
  impactSummary?: string;

  // Médias
  coverImage: string;
  gallery?: ProjectGalleryItem[];
  documents?: { title: string; url: string; type: string }[];
  videoUrl?: string;

  // SEO & Meta
  metaTitle?: string;
  metaDescription?: string;

  // Contenu éditorial
  testimonial?: {
    quote: string;
    author: string;
    role: string;
    photo?: string;
  };

  successStory?: {
    title: string;
    content: string;
    documentUrl?: string;
  };

  // Timestamps
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  featured?: boolean;
  order?: number;
}

export interface ProjectFilter {
  status?: ProjectStatus | "all";
  domain?: ProjectDomain | "all";
  zone?: string;
  year?: number | "all";
  search?: string;
}

export interface ProjectListResponse {
  projects: Project[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}
