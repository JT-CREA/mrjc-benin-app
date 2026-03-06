/**
 * GET /api/blog
 * Liste publique des articles de blog avec pagination, filtres et recherche
 * POST /api/blog  → protégée admin (création d'article)
 */

import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp, addRateLimitHeaders } from "@/lib/rate-limit";
import blogPostsData from "@/data/blog-posts.json";

export const runtime = "nodejs";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  category: string;
  tags?: string[];
  author: string;
  authorRole?: string;
  authorAvatar?: string;
  image?: string;
  publishedAt: string;
  updatedAt?: string;
  readTime?: number;
  featured?: boolean;
  status: "published" | "draft" | "archived";
  views?: number;
}

function parsePosts(): BlogPost[] {
  return (blogPostsData as unknown as BlogPost[]).filter(
    (p) => p.status === "published",
  );
}

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const rl = rateLimit(`blog:${ip}`, 120, 60);
  const rlHeaders = new Headers();
  addRateLimitHeaders(rlHeaders, rl, 120);

  if (!rl.success) {
    return NextResponse.json(
      { error: "Trop de requêtes." },
      { status: 429, headers: rlHeaders },
    );
  }

  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(
    24,
    Math.max(1, parseInt(searchParams.get("limit") ?? "9", 10)),
  );
  const category = searchParams.get("category") ?? "";
  const tag = searchParams.get("tag") ?? "";
  const q = searchParams.get("q") ?? "";
  const featured = searchParams.get("featured") === "true";
  const slug = searchParams.get("slug") ?? "";

  let posts = parsePosts();

  // Filtre par slug (article unique)
  if (slug) {
    const post = posts.find((p) => p.slug === slug);
    if (!post) {
      return NextResponse.json(
        { error: "Article introuvable." },
        { status: 404 },
      );
    }
    return NextResponse.json({ post }, { status: 200, headers: rlHeaders });
  }

  // Filtres
  if (category)
    posts = posts.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase(),
    );
  if (tag)
    posts = posts.filter((p) =>
      p.tags?.some((t) => t.toLowerCase() === tag.toLowerCase()),
    );
  if (featured) posts = posts.filter((p) => p.featured === true);
  if (q) {
    const ql = q.toLowerCase();
    posts = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(ql) ||
        p.excerpt.toLowerCase().includes(ql) ||
        p.author.toLowerCase().includes(ql),
    );
  }

  // Tri par date décroissante
  posts.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  // Pagination
  const total = posts.length;
  const totalPages = Math.ceil(total / limit);
  const items = posts.slice((page - 1) * limit, page * limit).map((p) => {
    const { content: _, ...rest } = p; // exclure le contenu complet du listing
    return rest;
  });

  // Catégories disponibles
  const categories = [...new Set(parsePosts().map((p) => p.category))].sort();

  return NextResponse.json(
    {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      categories,
    },
    { status: 200, headers: rlHeaders },
  );
}

export async function POST() {
  // Réservé à l'admin — gérée via /api/admin/blog
  return NextResponse.json(
    { error: "Méthode non autorisée. Utiliser /api/admin/blog." },
    { status: 405 },
  );
}
