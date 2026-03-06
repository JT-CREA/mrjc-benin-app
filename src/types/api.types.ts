/**
 * types/api.types.ts
 * Types TypeScript pour toutes les réponses API MRJC-BÉNIN
 */

/* ─── Réponse générique ──────────────────────────────────────────────────── */
export interface ApiResponse<T = unknown> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: Record<string, string[] | undefined>;
}

export interface PaginatedResponse<T> {
  items?: T[];
  results?: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
  hasMore?: boolean;
}

/* ─── Contact ─────────────────────────────────────────────────────────────── */
export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  organization?: string;
  gdprConsent: boolean;
  website?: string; // honeypot
}

/* ─── Newsletter ──────────────────────────────────────────────────────────── */
export interface NewsletterPayload {
  email: string;
  firstName?: string;
  lastName?: string;
  gdprConsent: boolean;
  language?: "fr" | "en" | "es";
  source?: string;
  website?: string; // honeypot
}

export interface NewsletterSubscriber {
  email: string;
  firstName?: string;
  status: "pending" | "confirmed" | "unsubscribed";
  subscribedAt: string;
  confirmedAt?: string;
  unsubscribedAt?: string;
  source?: string;
  language?: string;
}

/* ─── Recrutement ─────────────────────────────────────────────────────────── */
export interface RecruitmentPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  linkedin?: string;
  jobId?: string;
  jobTitle?: string;
  type: "emploi" | "stage" | "volontariat" | "spontanee";
  domain?: string;
  coverLetter: string;
  cvUrl?: string;
  availability?: string;
  startDate?: string;
  gdprConsent: boolean;
  website?: string; // honeypot
}

/* ─── Jobs ────────────────────────────────────────────────────────────────── */
export interface JobPosting {
  id: string;
  slug?: string;
  title: string;
  type: "full-time" | "part-time" | "contract" | "internship" | "volunteer";
  department: string;
  domain: string;
  location: string;
  salary?: string;
  deadline: string;
  publishedAt: string;
  status: "open" | "closed" | "draft";
  featured: boolean;
  description: string;
  missions: string[];
  profile: string[];
  benefits: string[];
  contact: string;
}

export interface JobsApiResponse {
  jobs: JobPosting[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  departments: string[];
  domains: string[];
}

/* ─── Visiteurs ───────────────────────────────────────────────────────────── */
export interface VisitorStats {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  byPage: Record<string, number>;
  updatedAt: string;
}

/* ─── Téléchargements ─────────────────────────────────────────────────────── */
export interface DownloadStats {
  total: number;
  byResource: Record<
    string,
    {
      count: number;
      title?: string;
      lastDownloaded: string;
    }
  >;
  updatedAt: string;
}

/* ─── Recherche ───────────────────────────────────────────────────────────── */
export interface SearchResult {
  id: string;
  type: "project" | "news" | "blog" | "resource" | "domain";
  title: string;
  excerpt: string;
  url: string;
  coverImage?: string;
  tags?: string[];
  date?: string;
  score: number;
  meta?: Record<string, string | number | boolean>;
}

export interface SearchApiResponse extends PaginatedResponse<SearchResult> {
  results: SearchResult[];
  query: string;
  terms: string[];
  facets: Record<string, number>;
}

/* ─── Auth ────────────────────────────────────────────────────────────────── */
export interface AuthSession {
  authenticated: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    permissions: string[];
  } | null;
  expiresAt?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

/* ─── Revalidation ────────────────────────────────────────────────────────── */
export interface RevalidatePayload {
  secret: string;
  path?: string;
  tag?: string;
}

/* ─── Projets API ─────────────────────────────────────────────────────────── */
export interface ProjectsApiResponse {
  projects: import("./project.types").Project[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters: {
    domains: string[];
    departments: string[];
    statusCounts: Record<string, number>;
  };
}

/* ─── Rate limiting headers ───────────────────────────────────────────────── */
export interface RateLimitHeaders {
  "X-RateLimit-Limit": string;
  "X-RateLimit-Remaining": string;
  "X-RateLimit-Reset": string;
}
