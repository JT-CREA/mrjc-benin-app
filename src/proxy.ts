/**
 * proxy.ts — MRJC-BÉNIN
 * Proxy Next.js — Exécuté sur l'Edge Runtime avant chaque requête
 *
 * Pipeline de sécurité (dans l'ordre d'exécution) :
 *  1. Filtrage User-Agent malveillant
 *  2. Détection chemins suspicieux (path traversal, injection)
 *  3. Redirection HTTPS en production
 *  4. Protection routes /admin (JWT cookie httpOnly)
 *  5. Redirection login si déjà authentifié
 *  6. Headers de sécurité (CSP, HSTS, X-Frame, Permissions-Policy)
 *  7. CORS pour routes API publiques (GET seulement)
 *  8. Preflight OPTIONS
 *  9. Request ID pour le tracing
 * 10. Désactivation cache /admin et /api
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/* ─── Routes protégées ───────────────────────────────────────────────────── */
const ADMIN_PREFIX = "/admin";
const PUBLIC_ADMIN_PATHS = new Set(["/admin/login"]);

const PUBLIC_API_GET_PREFIXES = [
  "/api/projects",
  "/api/search",
  "/api/health",
  "/api/visitors",
  "/api/downloads",
  "/api/jobs",
];

/* ─── User-Agents bloqués ────────────────────────────────────────────────── */
const BLOCKED_UA = [
  /sqlmap/i,
  /nikto/i,
  /nessus/i,
  /masscan/i,
  /nmap/i,
  /dirbuster/i,
  /gobuster/i,
  /wfuzz/i,
  /acunetix/i,
  /burpsuite/i,
  /havij/i,
  /w3af/i,
];

/* ─── Patterns d'URL suspicieux ──────────────────────────────────────────── */
const SUSPICIOUS_PATH = [
  /\.\.\//,
  /\.(php|asp|aspx|jsp|cgi)$/i,
  /\/(etc|proc|sys)\//,
  /union\s+select/i,
  /<script/i,
  /javascript:/i,
];

/* ─── Matcher ────────────────────────────────────────────────────────────── */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|sw\\.js|manifest\\.webmanifest|assets/).*)",
  ],
};

/* ─── Vérification JWT Edge-compatible ───────────────────────────────────── */
function verifyJWTEdge(token: string): boolean {
  try {
    if (!token || token.length < 20) return false;
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")),
    ) as { exp?: number; sub?: string; role?: string };
    if (!payload.exp || !payload.sub) return false;
    if (payload.exp <= Math.floor(Date.now() / 1000)) return false;
    return ["super_admin", "admin", "editor", "viewer"].includes(
      payload.role ?? "",
    );
  } catch {
    return false;
  }
}

/* ─── Content Security Policy ────────────────────────────────────────────── */
function buildCSP(isProd: boolean): string {
  const script = isProd
    ? "'self' https://www.googletagmanager.com https://www.google-analytics.com"
    : "'self' 'unsafe-eval' 'unsafe-inline'";
  return [
    `default-src 'self'`,
    `script-src ${script}`,
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    `font-src 'self' https://fonts.gstatic.com data:`,
    `img-src 'self' data: blob: https://images.unsplash.com https://res.cloudinary.com https://picsum.photos https://www.google-analytics.com`,
    `connect-src 'self' https://api.brevo.com https://api.resend.com https://www.google-analytics.com`,
    `media-src 'self' https://res.cloudinary.com`,
    `frame-src 'none'`,
    `frame-ancestors 'none'`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    isProd ? `upgrade-insecure-requests` : "",
  ]
    .filter(Boolean)
    .join("; ");
}

/* ─── Proxy principal ───────────────────────────────────────────────── */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProd = process.env.NODE_ENV === "production";

  /* 1. Blocage User-Agent */
  const ua = request.headers.get("user-agent") ?? "";
  if (BLOCKED_UA.some((p) => p.test(ua))) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  /* 2. Chemins suspicieux */
  const fullPath = pathname + (request.nextUrl.search ?? "");
  if (SUSPICIOUS_PATH.some((p) => p.test(fullPath))) {
    return new NextResponse("Bad Request", { status: 400 });
  }

  /* 3. HTTPS */
  if (isProd && request.headers.get("x-forwarded-proto") === "http") {
    const url = new URL(request.url);
    url.protocol = "https:";
    return NextResponse.redirect(url, 301);
  }

  /* 4. Protection /admin */
  if (pathname.startsWith(ADMIN_PREFIX) && !PUBLIC_ADMIN_PATHS.has(pathname)) {
    const token = request.cookies.get("mrjc_admin_token")?.value;
    if (!token || !verifyJWTEdge(token)) {
      const url = new URL("/admin/login", request.url);
      url.searchParams.set("redirect", encodeURIComponent(pathname));
      if (token) url.searchParams.set("error", "session_expired");
      const res = NextResponse.redirect(url);
      if (token) res.cookies.delete("mrjc_admin_token");
      return res;
    }
  }

  /* 5. Déjà authentifié → redirection dashboard */
  if (pathname === "/admin/login") {
    const token = request.cookies.get("mrjc_admin_token")?.value;
    if (token && verifyJWTEdge(token)) {
      const redirect = request.nextUrl.searchParams.get("redirect");
      return NextResponse.redirect(
        new URL(
          redirect ? decodeURIComponent(redirect) : "/admin",
          request.url,
        ),
      );
    }
  }

  /* 6. Construction réponse */
  const response = NextResponse.next();

  /* Request ID tracing */
  response.headers.set("X-Request-ID", crypto.randomUUID());

  /* Headers de sécurité */
  if (isProd) {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload",
    );
  }
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(self), payment=(), usb=()",
  );
  response.headers.set("Content-Security-Policy", buildCSP(isProd));
  response.headers.set("X-XSS-Protection", "1; mode=block");

  /* 8. Cache admin/api */
  if (pathname.startsWith("/api") || pathname.startsWith("/admin")) {
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate",
    );
    response.headers.set("Pragma", "no-cache");
  }

  /* 7. CORS API publiques */
  const isPublicGet =
    request.method === "GET" &&
    PUBLIC_API_GET_PREFIXES.some((p) => pathname.startsWith(p));
  if (isPublicGet) {
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  }

  /* OPTIONS Preflight */
  if (request.method === "OPTIONS" && pathname.startsWith("/api")) {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  return response;
}
