/**
 * API Route — /api/resources
 * GET    /api/resources          → Liste paginée avec filtres
 * GET    /api/resources?slug=x   → Ressource individuelle
 *
 * Types : rapport, guide, etude, newsletter, outil, video, podcast
 * Auth  : lecture publique / écriture admin uniquement
 */

import { NextRequest, NextResponse } from "next/server";
import {
  rateLimit,
  getClientIp,
  RATE_LIMITS,
  addRateLimitHeaders,
} from "@/lib/rate-limit";
import {
  ok,
  serverError,
  badRequest,
  notFound,
  buildPagination,
  parsePagination,
} from "@/lib/utils/response";
import path from "path";
import { promises as fs } from "fs";

export const runtime = "nodejs";
export const revalidate = 1800; // 30 min ISR

/* ─── Types ─────────────────────────────────────────────────────────────── */
interface Resource {
  id: string;
  slug: string;
  title: string;
  description: string;
  type:
    | "rapport"
    | "guide"
    | "etude"
    | "newsletter"
    | "outil"
    | "video"
    | "podcast";
  domain?: string;
  year?: number;
  language?: "fr" | "en" | "fon" | "yoruba";
  fileUrl?: string;
  fileSize?: string;
  coverImage?: string;
  authors?: string[];
  tags?: string[];
  featured?: boolean;
  downloadCount?: number;
  publishedAt: string;
  updatedAt?: string;
}

const VALID_TYPES = new Set([
  "rapport",
  "guide",
  "etude",
  "newsletter",
  "outil",
  "video",
  "podcast",
]);

/* ─── Chargement JSON statique ────────────────────────────────────────── */
async function loadResourcesFromFile(): Promise<Resource[]> {
  try {
    const filePath = path.join(process.cwd(), "src", "data", "resources.json");
    const raw = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : (parsed.resources ?? []);
  } catch {
    return [];
  }
}

/* ─── Chargement MongoDB ─────────────────────────────────────────────── */
async function loadResourcesFromDB(): Promise<Resource[] | null> {
  if (!process.env.MONGODB_URI) return null;
  try {
    const { connectToDatabase, COLLECTIONS } = await import("@/lib/db/mongodb");
    const { db } = await connectToDatabase();
    const resources = await db
      .collection<Resource>(COLLECTIONS.RESOURCES)
      .find({})
      .sort({ publishedAt: -1 })
      .toArray();
    return resources.length > 0 ? resources : null;
  } catch {
    return null;
  }
}

/* ─── GET /api/resources ─────────────────────────────────────────────── */
export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const rl = rateLimit(
    `resources:${ip}`,
    RATE_LIMITS.API_READ.limit,
    RATE_LIMITS.API_READ.windowSeconds,
  );
  const rlHeaders = new Headers();
  addRateLimitHeaders(rlHeaders, rl, RATE_LIMITS.API_READ.limit);

  if (!rl.success) {
    return NextResponse.json(
      { success: false, error: "Trop de requêtes." },
      { status: 429, headers: rlHeaders },
    );
  }

  const { searchParams } = request.nextUrl;
  const slug = searchParams.get("slug");
  const type = searchParams.get("type");
  const domain = searchParams.get("domain");
  const language = searchParams.get("language");
  const year = searchParams.get("year");
  const featured = searchParams.get("featured");
  const search = searchParams.get("q")?.trim();

  /* Validation type */
  if (type && !VALID_TYPES.has(type)) {
    return badRequest(
      `Type invalide. Valeurs acceptées : ${[...VALID_TYPES].join(", ")}`,
    );
  }

  try {
    let resources =
      (await loadResourcesFromDB()) ?? (await loadResourcesFromFile());

    /* ── Ressource individuelle par slug ── */
    if (slug) {
      const resource = resources.find((r) => r.slug === slug);
      if (!resource) return notFound("Ressource");
      return ok(resource);
    }

    /* ── Filtres ── */
    if (type) resources = resources.filter((r) => r.type === type);
    if (domain) resources = resources.filter((r) => r.domain === domain);
    if (language) resources = resources.filter((r) => r.language === language);
    if (year)
      resources = resources.filter((r) => r.year === parseInt(year, 10));
    if (featured === "true") resources = resources.filter((r) => r.featured);

    if (search) {
      const q = search.toLowerCase();
      resources = resources.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.tags?.some((t) => t.toLowerCase().includes(q)) ||
          r.authors?.some((a) => a.toLowerCase().includes(q)),
      );
    }

    /* Tri par date décroissante */
    resources.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );

    const total = resources.length;
    const { page, limit, skip } = parsePagination(searchParams, {
      page: 1,
      limit: 12,
      maxLimit: 50,
    });
    const paginated = resources.slice(skip, skip + limit);
    const pagination = buildPagination(page, limit, total);

    /* Statistiques agrégées */
    const typesCount = resources.reduce<Record<string, number>>((acc, r) => {
      acc[r.type] = (acc[r.type] ?? 0) + 1;
      return acc;
    }, {});

    const years = [
      ...new Set(
        resources
          .map((r) => r.year)
          .filter(Boolean)
          .sort((a, b) => b! - a!),
      ),
    ];

    const response = ok(paginated, { pagination, total, typesCount, years });
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=1800, stale-while-revalidate=3600",
    );
    return response;
  } catch (error) {
    console.error("[API /resources] Erreur:", error);
    return serverError(error);
  }
}

/* ─── OPTIONS ───────────────────────────────────────────────────────────── */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
