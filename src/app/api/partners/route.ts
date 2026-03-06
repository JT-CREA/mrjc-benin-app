/**
 * API Route — /api/partners
 * GET  : Liste des partenaires (publique, avec filtre par catégorie)
 * POST : Ajout partenaire (admin, non implémenté dans cette version)
 *
 * Stratégie : JSON statique en dev → MongoDB en production
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
  buildPagination,
  parsePagination,
} from "@/lib/utils/response";
import path from "path";
import { promises as fs } from "fs";

export const runtime = "nodejs";
export const revalidate = 3600; // 1h ISR

/* ─── Types ─────────────────────────────────────────────────────────────── */
interface Partner {
  id: string;
  name: string;
  logo: string;
  url?: string;
  category:
    | "institutional"
    | "financial"
    | "technical"
    | "media"
    | "academic"
    | "network";
  description?: string;
  country?: string;
  featured?: boolean;
  active?: boolean;
  since?: string;
}

/* ─── Catégories valides ─────────────────────────────────────────────────── */
const VALID_CATEGORIES = new Set([
  "institutional",
  "financial",
  "technical",
  "media",
  "academic",
  "network",
]);

/* ─── Chargement données JSON (fallback statique) ─────────────────────── */
async function loadPartnersFromFile(): Promise<Partner[]> {
  try {
    const filePath = path.join(process.cwd(), "src", "data", "partners.json");
    const raw = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    // Supporte les deux formats : tableau direct ou { partners: [] }
    return Array.isArray(parsed) ? parsed : (parsed.partners ?? []);
  } catch {
    return [];
  }
}

/* ─── Chargement depuis MongoDB (si dispo) ───────────────────────────────── */
async function loadPartnersFromDB(): Promise<Partner[] | null> {
  if (!process.env.MONGODB_URI) return null;
  try {
    const { connectToDatabase, COLLECTIONS } = await import("@/lib/db/mongodb");
    const { db } = await connectToDatabase();
    const partners = await db
      .collection<Partner>(COLLECTIONS.PARTNERS)
      .find({ active: { $ne: false } })
      .sort({ featured: -1, name: 1 })
      .toArray();
    return partners.length > 0 ? partners : null;
  } catch {
    return null;
  }
}

/* ─── GET /api/partners ─────────────────────────────────────────────────── */
export async function GET(request: NextRequest) {
  const ip = getClientIp(request);

  /* Rate limiting */
  const rl = rateLimit(
    `partners:${ip}`,
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
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");
  const search = searchParams.get("q")?.trim();
  const paginate = searchParams.get("paginate") === "true";

  /* Validation catégorie */
  if (category && !VALID_CATEGORIES.has(category)) {
    return badRequest(
      `Catégorie invalide. Valeurs acceptées : ${[...VALID_CATEGORIES].join(", ")}`,
    );
  }

  try {
    /* Charger les données */
    let partners =
      (await loadPartnersFromDB()) ?? (await loadPartnersFromFile());

    /* Filtres */
    if (category) {
      partners = partners.filter((p) => p.category === category);
    }
    if (featured === "true") {
      partners = partners.filter((p) => p.featured === true);
    }
    if (search) {
      const q = search.toLowerCase();
      partners = partners.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.country?.toLowerCase().includes(q),
      );
    }

    /* Tri : featured en premier, puis alphabétique */
    partners.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return a.name.localeCompare(b.name, "fr");
    });

    const total = partners.length;

    /* Pagination optionnelle */
    if (paginate) {
      const { page, limit, skip } = parsePagination(searchParams, {
        page: 1,
        limit: 12,
        maxLimit: 50,
      });
      const paginated = partners.slice(skip, skip + limit);
      const pagination = buildPagination(page, limit, total);
      return ok(paginated, { pagination, total }, 200);
    }

    /* Groupement par catégorie si demandé */
    if (searchParams.get("grouped") === "true") {
      const grouped: Record<string, Partner[]> = {};
      for (const p of partners) {
        if (!grouped[p.category]) grouped[p.category] = [];
        grouped[p.category].push(p);
      }
      return ok(grouped, { total }, 200);
    }

    const response = ok(partners, { total });
    /* Cache 1h côté CDN */
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=86400",
    );
    return response;
  } catch (error) {
    console.error("[API /partners] Erreur:", error);
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
