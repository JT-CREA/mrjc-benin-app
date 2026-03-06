/**
 * API Route — POST /api/contact
 * Traitement du formulaire de contact
 * - Validation Zod
 * - Rate limiting (5 req/h/IP)
 * - Honeypot anti-spam
 * - Envoi emails via Resend (confirmation + notification admin)
 * - Sauvegarde MongoDB optionnelle
 */

import { NextRequest, NextResponse } from "next/server";
import { contactSchema, validateInput } from "@/lib/validators/schemas";
import {
  rateLimit,
  getClientIp,
  RATE_LIMITS,
  addRateLimitHeaders,
} from "@/lib/rate-limit";
import {
  sendContactConfirmation,
  sendContactAdminNotification,
} from "@/lib/resend";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  /* ── Rate limiting ─────────────────────────────────────────────────────── */
  const rl = rateLimit(
    `contact:${ip}`,
    RATE_LIMITS.CONTACT.limit,
    RATE_LIMITS.CONTACT.windowSeconds,
  );
  const rlHeaders = new Headers();
  addRateLimitHeaders(rlHeaders, rl, RATE_LIMITS.CONTACT.limit);

  if (!rl.success) {
    return NextResponse.json(
      {
        error: `Trop de tentatives. Réessayez dans ${rl.retryAfterSeconds} secondes.`,
      },
      { status: 429, headers: rlHeaders },
    );
  }

  /* ── Parse & validate ──────────────────────────────────────────────────── */
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Corps de requête invalide." },
      { status: 400 },
    );
  }

  const validation = validateInput(contactSchema, body);
  if (!validation.success) {
    return NextResponse.json({ errors: validation.errors }, { status: 422 });
  }

  const data = validation.data;

  /* ── Honeypot anti-spam ────────────────────────────────────────────────── */
  if (data.website && data.website.length > 0) {
    // Robot détecté — répondre 200 pour ne pas révéler le honeypot
    return NextResponse.json({ success: true }, { status: 200 });
  }

  /* ── Envoi emails ──────────────────────────────────────────────────────── */
  const emailData = {
    senderName: data.name,
    senderEmail: data.email,
    subject: data.subject,
    message: data.message,
  };

  const [confirmResult, adminResult] = await Promise.allSettled([
    sendContactConfirmation(emailData),
    sendContactAdminNotification(emailData),
  ]);

  // Log des résultats (non bloquant)
  if (
    confirmResult.status === "rejected" ||
    (confirmResult.status === "fulfilled" && !confirmResult.value.success)
  ) {
    console.error("[Contact] Échec email confirmation:", confirmResult);
  }
  if (
    adminResult.status === "rejected" ||
    (adminResult.status === "fulfilled" && !adminResult.value.success)
  ) {
    console.error("[Contact] Échec email admin:", adminResult);
  }

  /* ── Sauvegarde MongoDB (optionnelle) ──────────────────────────────────── */
  if (process.env.MONGODB_URI) {
    try {
      const { getCollection, COLLECTIONS } = await import("@/lib/db/mongodb");
      const col = await getCollection(COLLECTIONS.MESSAGES);
      await col.insertOne({
        ...data,
        ip,
        createdAt: new Date(),
        status: "new",
        readAt: null,
      } as any);
    } catch (err) {
      // Non-bloquant : on continue même si MongoDB échoue
      console.error("[Contact] Échec sauvegarde MongoDB:", err);
    }
  }

  return NextResponse.json(
    {
      success: true,
      message: "Message envoyé avec succès. Nous vous répondrons dans 48h.",
    },
    { status: 200, headers: rlHeaders },
  );
}

export async function GET() {
  return NextResponse.json(
    { error: "Méthode non autorisée." },
    { status: 405 },
  );
}
