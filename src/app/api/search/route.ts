/**
 * API Route — GET /api/search
 * Recherche full-text sur l'ensemble du contenu MRJC-BÉNIN :
 * projets, articles, actualités, ressources, domaines.
 *
 * Query params :
 *   q       = string (obligatoire, min 2 caractères)
 *   type    = 'all' | 'projects' | 'news' | 'blog' | 'resources' | 'domains'
 *   limit   = number (défaut: 20, max: 50)
 *   page    = number (défaut: 1)
 *
 * Algorithme : score de pertinence sur titre (×3), excerpt (×2), tags (×2), description (×1)
 */

import { NextRequest, NextResponse } from "next/server";
import {
  rateLimit,
  getClientIp,
  RATE_LIMITS,
  addRateLimitHeaders,
} from "@/lib/rate-limit";
import projectsData from "@/data/projects.json";
import blogPostsData from "@/data/blog-posts.json";
import resourcesData from "@/data/resources.json";
import domainsData from "@/data/domains.json";
import type { Project } from "@/types/project.types";

export const runtime = "nodejs";

/* ─── Types ─────────────────────────────────────────────────────────────── */
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

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Supprimer accents
    .trim();
}

function scoreText(text: string, terms: string[]): number {
  const normalized = normalize(text);
  return terms.reduce((score, term) => {
    const normTerm = normalize(term);
    if (!normTerm) return score;
    // Correspondance exacte
    if (normalized.includes(normTerm)) {
      // Bonus si le terme est au début
      const idx = normalized.indexOf(normTerm);
      return score + 1 + (idx === 0 ? 0.5 : 0);
    }
    return score;
  }, 0);
}

function buildScore(
  item: {
    title?: string;
    excerpt?: string;
    description?: string;
    tags?: string[];
    subtitle?: string;
    keywords?: string[];
  },
  terms: string[],
): number {
  let score = 0;
  score += scoreText(item.title ?? "", terms) * 3;
  score += scoreText(item.subtitle ?? "", terms) * 2;
  score += scoreText(item.excerpt ?? "", terms) * 2;
  score += scoreText((item.tags ?? []).join(" "), terms) * 2;
  score += scoreText((item.keywords ?? []).join(" "), terms) * 2;
  // Supprimer les balises HTML pour la description
  const cleanDesc = (item.description ?? "").replace(/<[^>]*>/g, "");
  score += scoreText(cleanDesc, terms) * 1;
  return score;
}

/* ─── Indexeurs par type ─────────────────────────────────────────────────── */
function indexProjects(terms: string[]): SearchResult[] {
  const projects = projectsData as Project[];
  return projects
    .map((p) => {
      const excerpt = (p as { excerpt?: string }).excerpt ?? p.title;
      const score = buildScore(
        {
          title: p.title,
          excerpt,
          tags: p.tags ?? [],
          description: p.description ?? "",
        },
        terms,
      );
      return {
        id: p.id,
        type: "project" as const,
        title: p.title,
        excerpt: excerpt.slice(0, 160),
        url: `/projects/${p.slug}`,
        coverImage: p.coverImage,
        tags: p.tags ?? [],
        date: p.startDate,
        score,
        meta: {
          status: p.status,
          domain: p.domain,
        },
      };
    })
    .filter((r) => r.score > 0);
}

function indexBlogPosts(terms: string[], typeFilter?: string): SearchResult[] {
  const posts = blogPostsData as {
    id: string;
    slug: string;
    type: string;
    title: string;
    excerpt: string;
    coverImage?: string;
    tags?: string[];
    publishedAt?: string;
    category?: string;
  }[];
  return posts
    .filter((p) => !typeFilter || typeFilter === "all" || p.type === typeFilter)
    .map((p) => {
      const score = buildScore(
        { title: p.title, excerpt: p.excerpt, tags: p.tags },
        terms,
      );
      return {
        id: p.id,
        type: (p.type === "news" ? "news" : "blog") as SearchResult["type"],
        title: p.title,
        excerpt: p.excerpt.slice(0, 160),
        url: `/${p.type === "news" ? "news" : "blog"}/${p.slug}`,
        coverImage: p.coverImage,
        tags: p.tags ?? [],
        date: p.publishedAt,
        score,
        meta: { category: p.category ?? "" },
      };
    })
    .filter((r) => r.score > 0);
}

function indexResources(terms: string[]): SearchResult[] {
  const resources = resourcesData as {
    id: string;
    slug: string;
    title: string;
    description: string;
    tags?: string[];
    category?: string;
    publishedAt?: string;
    coverImage?: string;
    fileType?: string;
    downloadUrl?: string;
  }[];
  return resources
    .map((r) => {
      const score = buildScore(
        { title: r.title, description: r.description, tags: r.tags },
        terms,
      );
      return {
        id: r.id,
        type: "resource" as const,
        title: r.title,
        excerpt: r.description.slice(0, 160),
        url: r.downloadUrl ?? `/resources`,
        tags: r.tags ?? [],
        date: r.publishedAt,
        score,
        meta: { category: r.category ?? "", fileType: r.fileType ?? "" },
      };
    })
    .filter((r) => r.score > 0);
}

function indexDomains(terms: string[]): SearchResult[] {
  const domains = domainsData as unknown as {
    id: string;
    slug: string;
    name: string;
    description: string;
    keywords?: string[];
    icon?: string;
  }[];
  return domains
    .map((d) => {
      const score = buildScore(
        { title: d.name, description: d.description, keywords: d.keywords },
        terms,
      );
      return {
        id: d.id,
        type: "domain" as const,
        title: d.name,
        excerpt: d.description.slice(0, 160),
        url: `/domains/${d.slug}`,
        score,
      };
    })
    .filter((r) => r.score > 0);
}

/* ─── Handler GET ────────────────────────────────────────────────────────── */
export async function GET(request: NextRequest) {
  /* Rate limiting */
  const ip = getClientIp(request);
  const rl = rateLimit(
    `search:${ip}`,
    RATE_LIMITS.SEARCH?.limit ?? 60,
    RATE_LIMITS.SEARCH?.windowSeconds ?? 60,
  );
  if (!rl.success) {
    return NextResponse.json(
      { error: "Trop de requêtes. Veuillez réessayer dans un moment." },
      { status: 429 },
    );
  }

  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") ?? "").trim();
  const typeFilter = searchParams.get("type") ?? "all";
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(
    50,
    Math.max(1, Number(searchParams.get("limit") ?? 20)),
  );

  /* Validation */
  if (!query || query.length < 2) {
    return NextResponse.json(
      {
        error: "La requête doit contenir au moins 2 caractères.",
        results: [],
        total: 0,
      },
      { status: 400 },
    );
  }

  if (query.length > 200) {
    return NextResponse.json(
      { error: "Requête trop longue (200 caractères max)." },
      { status: 400 },
    );
  }

  /* Tokenisation */
  const terms = query
    .split(/\s+/)
    .filter((t) => t.length >= 2)
    .slice(0, 10); // Max 10 termes

  if (!terms.length) {
    return NextResponse.json({ results: [], total: 0, query, page, limit });
  }

  /* Indexation selon le filtre */
  let results: SearchResult[] = [];

  if (typeFilter === "all" || typeFilter === "projects") {
    results.push(...indexProjects(terms));
  }
  if (typeFilter === "all" || typeFilter === "news") {
    results.push(...indexBlogPosts(terms, "news"));
  }
  if (typeFilter === "all" || typeFilter === "blog") {
    results.push(...indexBlogPosts(terms, "blog"));
  }
  if (typeFilter === "all" || typeFilter === "resources") {
    results.push(...indexResources(terms));
  }
  if (typeFilter === "all" || typeFilter === "domains") {
    results.push(...indexDomains(terms));
  }

  /* Tri par pertinence décroissante */
  results.sort((a, b) => b.score - a.score);

  /* Agrégation des types pour les facettes */
  const facets = results.reduce<Record<string, number>>((acc, r) => {
    acc[r.type] = (acc[r.type] ?? 0) + 1;
    return acc;
  }, {});

  /* Pagination */
  const total = results.length;
  const start = (page - 1) * limit;
  const paginated = results.slice(start, start + limit);

  const headers = new Headers({
    "Cache-Control": "no-store",
    "X-Total-Count": String(total),
  });
  addRateLimitHeaders(headers, rl, RATE_LIMITS.SEARCH?.limit ?? 60);

  return NextResponse.json(
    {
      results: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      query,
      terms,
      facets,
      hasMore: start + limit < total,
    },
    { status: 200, headers },
  );
}
