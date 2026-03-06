/**
 * API Route — GET /api/newsletter/unsubscribe?token=xxx&email=xxx
 *             POST /api/newsletter/unsubscribe { email, token }
 * Désabonnement newsletter avec vérification de token
 */

import { NextRequest, NextResponse } from "next/server";
import { unsubscribeBrevoContact, verifyUnsubscribeToken } from "@/lib/brevo";

export const runtime = "nodejs";

/* ─── GET — Lien depuis l'email ──────────────────────────────────────────── */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";

  if (!token || !email) {
    return new NextResponse(
      htmlResponse(
        "Lien invalide",
        "❌ Lien de désabonnement invalide ou expiré.",
        false,
      ),
      {
        status: 400,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      },
    );
  }

  // Vérification du token
  const valid = verifyUnsubscribeToken(token, email);
  if (!valid) {
    return new NextResponse(
      htmlResponse(
        "Token invalide",
        "❌ Ce lien de désabonnement est invalide.",
        false,
      ),
      {
        status: 403,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      },
    );
  }

  // Désabonnement Brevo
  if (process.env.BREVO_API_KEY) {
    await unsubscribeBrevoContact(email).catch((err) =>
      console.error("[Unsubscribe] Brevo error:", err),
    );
  }

  // Mise à jour MongoDB
  if (process.env.MONGODB_URI) {
    try {
      const { getCollection, COLLECTIONS } = await import("@/lib/db/mongodb");
      const col = await getCollection(COLLECTIONS.NEWSLETTER);
      await col.updateOne(
        { email },
        { $set: { status: "unsubscribed", unsubscribedAt: new Date() } },
      );
    } catch (err) {
      console.error("[Unsubscribe] MongoDB error:", err);
    }
  }

  return new NextResponse(
    htmlResponse(
      "Désabonnement confirmé",
      "✅ Vous avez bien été désabonné(e) de notre newsletter. Vous ne recevrez plus nos emails.",
      true,
    ),
    { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}

/* ─── POST — Via formulaire / JS ─────────────────────────────────────────── */
export async function POST(request: NextRequest) {
  let body: { email?: string; token?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide." }, { status: 400 });
  }

  const { email, token } = body;

  if (!email) {
    return NextResponse.json({ error: "Email requis." }, { status: 400 });
  }

  // Si token fourni, vérifier
  if (token) {
    const valid = verifyUnsubscribeToken(token, email);
    if (!valid) {
      return NextResponse.json({ error: "Token invalide." }, { status: 403 });
    }
  }

  // Désabonnement
  if (process.env.BREVO_API_KEY) {
    await unsubscribeBrevoContact(email).catch(console.error);
  }

  if (process.env.MONGODB_URI) {
    try {
      const { getCollection, COLLECTIONS } = await import("@/lib/db/mongodb");
      const col = await getCollection(COLLECTIONS.NEWSLETTER);
      await col.updateOne(
        { email },
        { $set: { status: "unsubscribed", unsubscribedAt: new Date() } },
      );
    } catch (err) {
      console.error("[Unsubscribe] MongoDB error:", err);
    }
  }

  return NextResponse.json({
    success: true,
    message: "Désabonnement effectué.",
  });
}

/* ─── Template HTML page de confirmation ────────────────────────────────── */
function htmlResponse(
  title: string,
  message: string,
  success: boolean,
): string {
  const color = success ? "#2d6a2d" : "#dc2626";
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} — MRJC-BÉNIN</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
           background: #f8faf8; display: flex; align-items: center;
           justify-content: center; min-height: 100vh; padding: 24px; }
    .card { background: #fff; border-radius: 16px; padding: 40px 32px;
            max-width: 480px; width: 100%; text-align: center;
            box-shadow: 0 8px 32px rgba(0,0,0,0.10); }
    .icon { font-size: 48px; margin-bottom: 16px; }
    h1 { font-size: 22px; font-weight: 700; color: #1f2937; margin-bottom: 12px; }
    p  { font-size: 14px; color: #6b7280; line-height: 1.6; margin-bottom: 24px; }
    a  { display: inline-block; background: ${color}; color: #fff;
         font-size: 14px; font-weight: 600; padding: 12px 28px;
         border-radius: 10px; text-decoration: none; }
    .logo { font-size: 12px; color: #9ca3af; margin-top: 24px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">${success ? "🌿" : "⚠️"}</div>
    <h1>${title}</h1>
    <p>${message}</p>
    <a href="https://mrjc-benin.org">Retourner au site</a>
    <p class="logo">MRJC-BÉNIN — mrjc-benin.org</p>
  </div>
</body>
</html>`;
}
