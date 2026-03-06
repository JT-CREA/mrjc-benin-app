/**
 * API Route — POST /api/auth  (login)
 *             DELETE /api/auth (logout)
 *             GET /api/auth   (session actuelle)
 *
 * CORRECTIONS v3 :
 *  ✅ Cookie path='/' (pas '/admin') → le middleware le lit sur TOUTES les routes
 *  ✅ JWT avec sous-champ 'sub' ET 'role' requis par verifyJWTEdge()
 *  ✅ Gestion d'erreur robuste, réponses JSON cohérentes
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { DEMO_CREDENTIALS } from "@/lib/admin/auth";

/* ── Constantes ──────────────────────────────────────────────────────────── */
const COOKIE_NAME = "mrjc_admin_token";
const TOKEN_TTL_SEC = 8 * 60 * 60; // 8 heures
const MAX_ATTEMPTS = 5;
const LOCK_MS = 15 * 60 * 1000;

/* ── Rate limiting en mémoire ────────────────────────────────────────────── */
const loginAttempts = new Map<string, { count: number; lockedUntil: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = loginAttempts.get(ip);
  if (!rec) return false;
  if (rec.lockedUntil > now) return true;
  if (rec.lockedUntil > 0 && rec.lockedUntil <= now) {
    loginAttempts.delete(ip);
    return false;
  }
  return rec.count >= MAX_ATTEMPTS;
}

function recordFail(ip: string): void {
  const now = Date.now();
  const rec = loginAttempts.get(ip) ?? { count: 0, lockedUntil: 0 };
  rec.count += 1;
  if (rec.count >= MAX_ATTEMPTS) rec.lockedUntil = now + LOCK_MS;
  loginAttempts.set(ip, rec);
}

/* ── Génération JWT (HMAC-SHA256) ────────────────────────────────────────── */
function b64url(str: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(str)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
  }
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

async function signJWT(payload: Record<string, unknown>): Promise<string> {
  const secret =
    process.env.JWT_SECRET || "mrjc-benin-secret-dev-2024-change-in-prod";
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = b64url(JSON.stringify(payload));
  const data = `${header}.${body}`;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(data),
  );
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  return `${data}.${sigB64}`;
}

/* ── GET — Vérifier session ──────────────────────────────────────────────── */
export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token)
    return NextResponse.json({ authenticated: false }, { status: 401 });

  try {
    const parts = token.split(".");
    if (parts.length !== 3) throw new Error("invalid");
    const padded =
      parts[1].replace(/-/g, "+").replace(/_/g, "/") +
      "===".slice((parts[1].length + 3) % 4);
    const payload = JSON.parse(atob(padded));
    if (!payload.exp || payload.exp <= Math.floor(Date.now() / 1000))
      throw new Error("expired");
    return NextResponse.json({
      authenticated: true,
      user: { sub: payload.sub, role: payload.role, name: payload.name },
    });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}

/* ── POST — Login ────────────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

  /* Rate limiting */
  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        success: false,
        message: "Trop de tentatives. Réessayez dans 15 minutes.",
      },
      { status: 429 },
    );
  }

  /* Parse body */
  let email = "",
    password = "";
  try {
    const body = await req.json();
    email = String(body.email ?? "")
      .trim()
      .toLowerCase();
    password = String(body.password ?? "");
  } catch {
    return NextResponse.json(
      { success: false, message: "Corps de requête invalide." },
      { status: 400 },
    );
  }

  if (!email || !password) {
    return NextResponse.json(
      { success: false, message: "Email et mot de passe requis." },
      { status: 400 },
    );
  }

  /* Vérification identifiants */
  const match = DEMO_CREDENTIALS.find(
    (c) => c.email.toLowerCase() === email && c.password === password,
  );

  if (!match) {
    recordFail(ip);
    return NextResponse.json(
      { success: false, message: "Identifiants incorrects." },
      { status: 401 },
    );
  }

  /* Génération JWT */
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = now + TOKEN_TTL_SEC;

  const token = await signJWT({
    sub: match.user.id,
    name: match.user.name,
    email: match.user.email,
    role: match.user.role,
    permissions: match.user.permissions,
    iat: now,
    exp: expiresAt,
  });

  /* Réponse avec cookie ── CORRECTION : path='/' pas '/admin' ── */
  const res = NextResponse.json({
    success: true,
    message: "Connexion réussie.",
    user: {
      id: match.user.id,
      name: match.user.name,
      email: match.user.email,
      role: match.user.role,
      permissions: match.user.permissions,
    },
    expiresAt: new Date(expiresAt * 1000).toISOString(),
  });

  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: false, // false pour que le middleware Edge puisse le lire via request.cookies
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // lax pour la navigation normale
    path: "/", // ← CRITIQUE : '/' pour que le middleware le voie partout
    maxAge: TOKEN_TTL_SEC,
  });

  return res;
}

/* ── DELETE — Logout ─────────────────────────────────────────────────────── */
export async function DELETE() {
  const res = NextResponse.json({ success: true, message: "Déconnecté." });
  res.cookies.set(COOKIE_NAME, "", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
  return res;
}
