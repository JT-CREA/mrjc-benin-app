export type ResourceType =
  | "rapport-annuel"
  | "guide-technique"
  | "etude-recherche"
  | "document-cadre"
  | "outil-pedagogique"
  | "presentation"
  | "communique"
  | "brochure";

export type ResourceCategory =
  | "institutionnel"
  | "agriculture"
  | "sante"
  | "education"
  | "genre"
  | "gouvernance"
  | "evaluation"
  | "communication";

export interface Resource {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  type: ResourceType;
  category: ResourceCategory;
  tags: string[];
  language: string;
  coverImage: string;
  fileUrl: string;
  fileSize?: string;
  fileType?: string;
  pages?: number;
  publishedAt: string;
  updatedAt?: string;
  authors?: string[];
  project?: string;
  featured?: boolean;
  downloads?: number;
  metaTitle?: string;
  metaDescription?: string;
}

export interface ResourceFilter {
  type?: ResourceType | "all";
  category?: ResourceCategory | "all";
  year?: number | "all";
  language?: string;
  search?: string;
}
