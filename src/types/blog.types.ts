export type PostCategory =
  | "agriculture"
  | "sante"
  | "education"
  | "femmes"
  | "gouvernance"
  | "partenariat"
  | "evenement"
  | "success-story"
  | "analyse";

export type PostStatus = "published" | "draft" | "archived";

export interface PostAuthor {
  id: string;
  name: string;
  role?: string;
  bio?: string;
  photo?: string;
  email?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  type: "blog" | "news";
  title: string;
  subtitle?: string;
  excerpt: string;
  content: string; // HTML
  status: PostStatus;

  // Taxonomie
  category: PostCategory;
  tags: string[];

  // Médias
  coverImage: string;
  coverImageAlt?: string;
  coverImageCaption?: string;
  gallery?: { src: string; alt: string; caption?: string }[];

  // Auteur & dates
  author: PostAuthor;
  publishedAt: string; // ISO
  updatedAt?: string;
  createdAt: string;

  // SEO
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;

  // Lecture
  readingTime?: number; // minutes

  // Engagement
  views?: number;
  likes?: number;
  featured?: boolean;
  urgent?: boolean;

  // Relations
  relatedProjectId?: string;
  relatedDomain?: string;
  relatedPostIds?: string[];
}

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: PostCategory;
  tags: string[];
  coverImage: string;
  publishedAt: string;
  source?: string;
  sourceUrl?: string;
  featured?: boolean;
  urgent?: boolean;
}

export interface BlogFilter {
  category?: PostCategory | "all";
  tag?: string;
  author?: string;
  year?: number | "all";
  month?: number;
  search?: string;
  featured?: boolean;
}

export interface BlogListResponse {
  posts: BlogPost[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}
