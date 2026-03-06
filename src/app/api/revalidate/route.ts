/**
 * API Route — POST /api/revalidate
 * Revalidation ISR (Incremental Static Regeneration)
 * Utilisé par les webhooks CMS ou pipelines CI/CD
 *
 * Usage :
 *   POST /api/revalidate
 *   Body: { "secret": "xxx", "path": "/projects" }
 *   Body: { "secret": "xxx", "tag": "projects" }
 */

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { revalidateSchema, validateInput } from "@/lib/validators/schemas";
import { rateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";

export const runtime = "nodejs";

/* ─── Routes connues pour validation ────────────────────────────────────── */
const VALID_PATHS = new Set([
  "/",
  "/projects",
  "/projects/ongoing",
  "/projects/completed",
  "/news",
  "/blog",
  "/resources",
  "/resources/publications",
  "/resources/technical-guides",
  "/resources/annual-reports",
  "/impact",
  "/partners",
  "/about",
  "/contact",
]);

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  /* ── Rate limiting ─────────────────────────────────────────────────────── */
  const rl = rateLimit(
    `revalidate:${ip}`,
    RATE_LIMITS.REVALIDATE.limit,
    RATE_LIMITS.REVALIDATE.windowSeconds,
  );
  if (!rl.success) {
    return NextResponse.json(
      { error: "Trop de requêtes de revalidation." },
      { status: 429 },
    );
  }

  /* ── Parse & validate ──────────────────────────────────────────────────── */
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide." }, { status: 400 });
  }

  const validation = validateInput(revalidateSchema, body);
  if (!validation.success) {
    return NextResponse.json({ errors: validation.errors }, { status: 422 });
  }

  const { secret, path, tag } = validation.data;

  /* ── Vérification du secret ──────────────────────────────────────────────── */
  const expectedSecret = process.env.REVALIDATE_SECRET;
  if (!expectedSecret) {
    console.error("[Revalidate] REVALIDATE_SECRET non configuré.");
    return NextResponse.json(
      { error: "Configuration serveur manquante." },
      { status: 500 },
    );
  }

  // Comparaison en temps constant pour éviter timing attacks
  if (secret !== expectedSecret) {
    return NextResponse.json({ error: "Secret invalide." }, { status: 403 });
  }

  /* ── Revalidation ────────────────────────────────────────────────────────── */
  const revalidated: string[] = [];
  const errors: string[] = [];

  try {
    if (path) {
      // Revalidation d'un chemin spécifique
      if (path === "*") {
        // Revalidation complète de toutes les routes connues
        for (const p of VALID_PATHS) {
          revalidatePath(p);
          revalidated.push(p);
        }
      } else {
        revalidatePath(path);
        revalidated.push(path);
      }
    }

    if (tag) {
      revalidateTag(tag, {});
      revalidated.push(`[tag:${tag}]`);
    }
  } catch (err) {
    errors.push(String(err));
    console.error("[Revalidate] Error:", err);
  }

  if (errors.length > 0) {
    return NextResponse.json(
      { success: false, errors, revalidated },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    revalidated,
    timestamp: new Date().toISOString(),
  });
}

export async function GET() {
  return NextResponse.json(
    { error: "Méthode non autorisée." },
    { status: 405 },
  );
}
