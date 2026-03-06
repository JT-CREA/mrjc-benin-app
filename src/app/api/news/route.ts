/**
 * GET /api/news
 * Liste des actualités avec pagination, catégories et recherche full-text légère
 * Chargement depuis MongoDB (si connecté) ou fallback sur JSON statique
 */

import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp, addRateLimitHeaders } from "@/lib/rate-limit";

export const runtime = "nodejs";

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  category:
    | "actualite"
    | "communique"
    | "rapport"
    | "evenement"
    | "partenariat";
  categoryLabel: string;
  author?: string;
  image?: string;
  publishedAt: string;
  featured?: boolean;
  tags?: string[];
  status: "published" | "draft";
  views?: number;
  source?: string;
  externalUrl?: string;
}

// Données de fallback statiques (remplacées par MongoDB en production)
const FALLBACK_NEWS: NewsItem[] = [
  {
    id: "news-001",
    slug: "mrjc-benin-lance-programme-emploi-jeunes-2025",
    title: "MRJC-BÉNIN lance son programme d'insertion professionnelle 2025",
    excerpt:
      "Un nouveau programme visant 500 jeunes de 18-35 ans dans les départements du Littoral et de l'Ouémé démarre ce mois-ci.",
    category: "actualite",
    categoryLabel: "Actualité",
    author: "Équipe Communication",
    image: "/assets/images/news/emploi-jeunes-2025.jpg",
    publishedAt: "2025-01-15T09:00:00Z",
    featured: true,
    status: "published",
    views: 342,
    tags: ["emploi", "jeunesse", "formation"],
  },
  {
    id: "news-002",
    slug: "partenariat-unicef-education-rurale",
    title: "Nouveau partenariat avec l'UNICEF pour l'éducation rurale",
    excerpt:
      "MRJC-BÉNIN et l'UNICEF signent un accord de partenariat triennal pour améliorer l'accès à l'éducation dans les zones rurales.",
    category: "partenariat",
    categoryLabel: "Partenariat",
    author: "Direction Générale",
    image: "/assets/images/news/partenariat-unicef.jpg",
    publishedAt: "2025-01-08T10:00:00Z",
    featured: false,
    status: "published",
    views: 218,
    tags: ["éducation", "UNICEF", "partenariat"],
  },
  {
    id: "news-003",
    slug: "rapport-annuel-2024-disponible",
    title: "Rapport annuel 2024 : Bilan d'une année de transformation",
    excerpt:
      "Téléchargez notre rapport annuel 2024 détaillant les réalisations, l'impact et les perspectives de MRJC-BÉNIN.",
    category: "rapport",
    categoryLabel: "Rapport",
    author: "Service Reporting",
    image: "/assets/images/news/rapport-2024.jpg",
    publishedAt: "2024-12-31T08:00:00Z",
    featured: false,
    status: "published",
    views: 504,
    tags: ["rapport", "bilan", "2024"],
  },
  {
    id: "news-004",
    slug: "forum-climat-cotonou-mars-2025",
    title: "MRJC-BÉNIN organise le Forum Jeunesse & Climat à Cotonou",
    excerpt:
      "Plus de 300 jeunes acteurs climatiques attendus le 22 mars 2025 pour discuter des enjeux environnementaux au Bénin.",
    category: "evenement",
    categoryLabel: "Événement",
    author: "Pôle Environnement",
    image: "/assets/images/news/forum-climat.jpg",
    publishedAt: "2025-02-20T08:00:00Z",
    featured: true,
    status: "published",
    views: 178,
    tags: ["climat", "environnement", "forum"],
  },
  {
    id: "news-005",
    slug: "communique-appel-dons-urgence",
    title:
      "Communiqué : Appel à la solidarité pour les victimes des inondations",
    excerpt:
      "Face aux inondations dans le département du Mono, MRJC-BÉNIN lance un appel urgent à la solidarité et au soutien matériel.",
    category: "communique",
    categoryLabel: "Communiqué",
    author: "Direction Générale",
    image: "/assets/images/news/inondations-urgence.jpg",
    publishedAt: "2025-02-10T12:00:00Z",
    featured: false,
    status: "published",
    views: 892,
    tags: ["urgence", "inondations", "solidarité"],
  },
  {
    id: "news-006",
    slug: "formation-numerique-100-jeunes-parakou",
    title: "100 jeunes de Parakou formés aux métiers du numérique",
    excerpt:
      "La clôture du cycle de formation en développement web et marketing digital marque une étape importante pour MRJC-BÉNIN.",
    category: "actualite",
    categoryLabel: "Actualité",
    author: "Pôle Formation",
    image: "/assets/images/news/formation-numerique.jpg",
    publishedAt: "2025-01-28T11:00:00Z",
    featured: false,
    status: "published",
    views: 267,
    tags: ["numérique", "formation", "Parakou"],
  },
];

async function fetchFromDB(params: {
  page: number;
  limit: number;
  category: string;
  q: string;
  slug: string;
}) {
  if (!process.env.MONGODB_URI) return null;
  try {
    const { getCollection, COLLECTIONS } = await import("@/lib/db/mongodb");
    const col = await getCollection(COLLECTIONS.NEWS ?? "news");
    const filter: Record<string, unknown> = { status: "published" };
    if (params.category) filter.category = params.category;
    if (params.slug) filter.slug = params.slug;
    if (params.q) filter.$text = { $search: params.q };

    if (params.slug) {
      const doc = await col.findOne(filter);
      return doc ? { type: "single", item: doc } : null;
    }

    const total = await col.countDocuments(filter);
    const items = await col
      .find(filter, { projection: { content: 0 } })
      .sort({ publishedAt: -1 })
      .skip((params.page - 1) * params.limit)
      .limit(params.limit)
      .toArray();

    return { type: "list", items, total };
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const rl = rateLimit(`news:${ip}`, 120, 60);
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
    Math.max(1, parseInt(searchParams.get("limit") ?? "6", 10)),
  );
  const category = searchParams.get("category") ?? "";
  const q = searchParams.get("q") ?? "";
  const slug = searchParams.get("slug") ?? "";
  const featured = searchParams.get("featured") === "true";

  // Essai MongoDB d'abord
  const dbResult = await fetchFromDB({ page, limit, category, q, slug });

  if (dbResult?.type === "single") {
    return NextResponse.json(
      { item: dbResult.item },
      { status: 200, headers: rlHeaders },
    );
  }

  if (dbResult?.type === "list") {
    const totalPages = Math.ceil((dbResult.total ?? 0) / limit);
    return NextResponse.json(
      {
        items: dbResult.items,
        pagination: {
          page,
          limit,
          total: dbResult.total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
      { status: 200, headers: rlHeaders },
    );
  }

  // Fallback JSON statique
  let news = FALLBACK_NEWS.filter((n) => n.status === "published");
  if (slug) {
    const item = news.find((n) => n.slug === slug);
    if (!item)
      return NextResponse.json(
        { error: "Actualité introuvable." },
        { status: 404 },
      );
    return NextResponse.json({ item }, { status: 200, headers: rlHeaders });
  }
  if (category) news = news.filter((n) => n.category === category);
  if (featured) news = news.filter((n) => n.featured);
  if (q) {
    const ql = q.toLowerCase();
    news = news.filter(
      (n) =>
        n.title.toLowerCase().includes(ql) ||
        n.excerpt.toLowerCase().includes(ql),
    );
  }
  news.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  const total = news.length;
  const totalPages = Math.ceil(total / limit);
  const items = news
    .slice((page - 1) * limit, page * limit)
    .map(({ content: _, ...n }) => n);

  const categories = [...new Set(FALLBACK_NEWS.map((n) => n.category))];

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
