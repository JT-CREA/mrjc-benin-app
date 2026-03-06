/**
 * POST /api/feedback
 * Soumission de retours utilisateurs (satisfaction, suggestions, bugs)
 * GET  /api/feedback → réservé admin (/api/admin/stats)
 */

import { NextRequest, NextResponse } from "next/server";
import {
  rateLimit,
  getClientIp,
  RATE_LIMITS,
  addRateLimitHeaders,
} from "@/lib/rate-limit";
import { sanitizeHtml } from "@/lib/utils/sanitize";

export const runtime = "nodejs";

const FEEDBACK_TYPES = [
  "satisfaction",
  "suggestion",
  "bug",
  "compliment",
  "autre",
] as const;
type FeedbackType = (typeof FEEDBACK_TYPES)[number];

interface FeedbackPayload {
  type: FeedbackType;
  rating?: number; // 1-5
  message: string;
  page?: string; // URL ou chemin de la page
  email?: string; // optionnel (pour suivi)
  website?: string; // honeypot
}

function validateFeedback(
  body: unknown,
): { ok: true; data: FeedbackPayload } | { ok: false; errors: string[] } {
  const errors: string[] = [];
  if (!body || typeof body !== "object")
    return { ok: false, errors: ["Corps invalide."] };

  const b = body as Record<string, unknown>;

  if (!b.type || !FEEDBACK_TYPES.includes(b.type as FeedbackType)) {
    errors.push(
      `Type invalide. Valeurs acceptées : ${FEEDBACK_TYPES.join(", ")}`,
    );
  }
  if (
    !b.message ||
    typeof b.message !== "string" ||
    b.message.trim().length < 5
  ) {
    errors.push("Le message doit contenir au moins 5 caractères.");
  }
  if (b.message && typeof b.message === "string" && b.message.length > 2000) {
    errors.push("Le message ne peut dépasser 2 000 caractères.");
  }
  if (b.rating !== undefined) {
    const r = Number(b.rating);
    if (isNaN(r) || r < 1 || r > 5)
      errors.push("La note doit être entre 1 et 5.");
  }
  if (b.email && typeof b.email === "string") {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email))
      errors.push("Email invalide.");
  }

  if (errors.length) return { ok: false, errors };

  return {
    ok: true,
    data: {
      type: b.type as FeedbackType,
      rating: b.rating !== undefined ? Number(b.rating) : undefined,
      message: sanitizeHtml(String(b.message).trim()),
      page: typeof b.page === "string" ? b.page.slice(0, 200) : undefined,
      email:
        typeof b.email === "string" ? b.email.toLowerCase().trim() : undefined,
      website: typeof b.website === "string" ? b.website : undefined,
    },
  };
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rl = rateLimit(
    `feedback:${ip}`,
    RATE_LIMITS.CONTACT.limit,
    RATE_LIMITS.CONTACT.windowSeconds,
  );
  const rlHeaders = new Headers();
  addRateLimitHeaders(rlHeaders, rl, RATE_LIMITS.CONTACT.limit);

  if (!rl.success) {
    return NextResponse.json(
      { error: `Limite atteinte. Réessayez dans ${rl.retryAfterSeconds}s.` },
      { status: 429, headers: rlHeaders },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Corps de requête invalide." },
      { status: 400 },
    );
  }

  const validation = validateFeedback(body);
  if (!validation.ok) {
    return NextResponse.json({ errors: validation.errors }, { status: 422 });
  }

  const { data } = validation;

  // Honeypot
  if (data.website && data.website.length > 0) {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  // Sauvegarde MongoDB
  if (process.env.MONGODB_URI) {
    try {
      const { getCollection } = await import("@/lib/db/mongodb");
      const col = await getCollection("feedback");
      await col.insertOne({
        ...data,
        ip,
        userAgent: request.headers.get("user-agent") ?? "",
        createdAt: new Date(),
        status: "new",
      } as any);
    } catch (err) {
      console.error("[Feedback] Erreur MongoDB:", err);
      // Non-bloquant
    }
  }

  return NextResponse.json(
    {
      success: true,
      message:
        "Merci pour votre retour ! Il nous aide à améliorer nos services.",
    },
    { status: 201, headers: rlHeaders },
  );
}

export async function GET() {
  return NextResponse.json(
    {
      error:
        "Endpoint réservé. Utilisez /api/admin/stats pour les données admin.",
    },
    { status: 403 },
  );
}
