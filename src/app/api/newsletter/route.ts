/**
 * API Route — POST /api/newsletter
 * Inscription à la newsletter
 * - Validation + consentement RGPD
 * - Rate limiting (3 req/h/IP)
 * - Double opt-in via Brevo
 * - Email de bienvenue via Resend
 * - Sauvegarde MongoDB optionnelle
 */

import { NextRequest, NextResponse } from "next/server";
import {
  newsletterSubscribeSchema,
  validateInput,
} from "@/lib/validators/schemas";
import {
  rateLimit,
  getClientIp,
  RATE_LIMITS,
  addRateLimitHeaders,
} from "@/lib/rate-limit";
import { upsertBrevoContact, generateUnsubscribeToken } from "@/lib/brevo";
import { sendNewsletterWelcome } from "@/lib/resend";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  /* ── Rate limiting ─────────────────────────────────────────────────────── */
  const rl = rateLimit(
    `newsletter:${ip}`,
    RATE_LIMITS.NEWSLETTER.limit,
    RATE_LIMITS.NEWSLETTER.windowSeconds,
  );
  const rlHeaders = new Headers();
  addRateLimitHeaders(rlHeaders, rl, RATE_LIMITS.NEWSLETTER.limit);

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

  const validation = validateInput(newsletterSubscribeSchema, body);
  if (!validation.success) {
    return NextResponse.json({ errors: validation.errors }, { status: 422 });
  }

  const { email, name } = validation.data;
  const firstName = name?.split(" ")[0] ?? "";
  const lastName = name?.split(" ").slice(1).join(" ") ?? "";

  /* ── Ajout dans Brevo ──────────────────────────────────────────────────── */
  if (process.env.BREVO_API_KEY) {
    const brevoResult = await upsertBrevoContact({
      email,
      firstName,
      lastName,
      attributes: {
        SOURCE: "website_newsletter",
        SIGNUP_DATE: new Date().toISOString().split("T")[0],
        LANGUAGE: "fr",
      },
    });

    if (!brevoResult.success && brevoResult.statusCode !== 400) {
      console.error("[Newsletter] Brevo error:", brevoResult.error);
      // Non-bloquant : on continue pour envoyer l'email de bienvenue
    }
  }

  /* ── Email de bienvenue ────────────────────────────────────────────────── */
  if (process.env.RESEND_API_KEY) {
    const token = generateUnsubscribeToken(email);
    await sendNewsletterWelcome({
      subscriberEmail: email,
      subscriberName: name,
      unsubscribeToken: token,
    }).catch((err) => console.error("[Newsletter] Welcome email error:", err));
  }

  /* ── Sauvegarde MongoDB ────────────────────────────────────────────────── */
  if (process.env.MONGODB_URI) {
    try {
      const { getCollection, COLLECTIONS } = await import("@/lib/db/mongodb");
      const col = await getCollection(COLLECTIONS.NEWSLETTER);
      await col.updateOne(
        { email },
        {
          $set: { email, name, subscribedAt: new Date(), status: "active", ip },
          $setOnInsert: { createdAt: new Date() },
        },
        { upsert: true },
      );
    } catch (err) {
      console.error("[Newsletter] MongoDB error:", err);
    }
  }

  return NextResponse.json(
    {
      success: true,
      message: "Inscription réussie ! Vérifiez votre boîte mail.",
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
