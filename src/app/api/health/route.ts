/**
 * API Route — GET /api/health
 * Endpoint de santé pour monitoring et CI/CD
 *
 * Retourne :
 * - Statut général : healthy | degraded | unhealthy
 * - Ping MongoDB
 * - Versions des dépendances clés
 * - Uptime du processus
 * - Mémoire utilisée
 * - Variables d'environnement critiques (présence seulement)
 *
 * Accès : Public (GET) — rate-limited à 60 req/min
 */

import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

/* ─── Types ──────────────────────────────────────────────────────────────── */
type ServiceStatus = "ok" | "degraded" | "error" | "disabled";
type OverallStatus = "healthy" | "degraded" | "unhealthy";

interface ServiceCheck {
  status: ServiceStatus;
  message?: string;
  latencyMs?: number;
}

interface HealthResponse {
  status: OverallStatus;
  timestamp: string;
  version: string;
  uptime: number; // secondes
  environment: string;
  services: {
    database: ServiceCheck;
    email: ServiceCheck;
    newsletter: ServiceCheck;
    search: ServiceCheck;
  };
  system: {
    memoryUsedMb: number;
    memoryTotalMb: number;
    nodeVersion: string;
    nextVersion: string;
  };
  checks: {
    jwtSecret: boolean;
    mongoUri: boolean;
    resendKey: boolean;
    brevoKey: boolean;
    siteUrl: boolean;
    revalidateKey: boolean;
  };
}

/* ─── Vérifications individuelles ────────────────────────────────────────── */
async function checkDatabase(): Promise<ServiceCheck> {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri || mongoUri.includes("VOTRE_MOT_DE_PASSE")) {
    return { status: "disabled", message: "MONGODB_URI non configurée" };
  }

  const start = Date.now();
  try {
    const { pingDatabase } = await import("@/lib/db/mongodb");
    const ok = await pingDatabase();
    const latencyMs = Date.now() - start;
    return ok
      ? { status: "ok", latencyMs }
      : { status: "error", message: "Ping échoué", latencyMs };
  } catch (err) {
    return {
      status: "error",
      message: String(err).slice(0, 100),
      latencyMs: Date.now() - start,
    };
  }
}

async function checkEmail(): Promise<ServiceCheck> {
  const key = process.env.RESEND_API_KEY;
  if (!key || key.startsWith("re_VOTRE")) {
    return { status: "disabled", message: "RESEND_API_KEY non configurée" };
  }
  return { status: "ok", message: "Resend configuré" };
}

async function checkNewsletter(): Promise<ServiceCheck> {
  const key = process.env.BREVO_API_KEY;
  if (!key || key.startsWith("xkeysib-VOTRE")) {
    return { status: "disabled", message: "BREVO_API_KEY non configurée" };
  }
  return { status: "ok", message: "Brevo configuré" };
}

function checkSearch(): ServiceCheck {
  // Recherche in-memory : toujours disponible
  return { status: "ok", message: "Recherche in-memory active" };
}

/* ─── Handler ────────────────────────────────────────────────────────────── */
export async function GET(request: NextRequest) {
  /* Rate limiting */
  const ip = getClientIp(request);
  const rl = rateLimit(`health:${ip}`, 60, 60);
  if (!rl.success) {
    return NextResponse.json({ error: "Trop de requêtes." }, { status: 429 });
  }

  /* Checks parallèles */
  const [database, email, newsletter] = await Promise.all([
    checkDatabase(),
    checkEmail(),
    checkNewsletter(),
  ]);
  const search = checkSearch();

  /* Statut global */
  const statuses = [
    database.status,
    email.status,
    newsletter.status,
    search.status,
  ];
  let overall: OverallStatus = "healthy";
  if (statuses.includes("error")) overall = "unhealthy";
  else if (statuses.includes("degraded")) overall = "degraded";

  /* Mémoire */
  const mem = process.memoryUsage();
  const memMB = Math.round(mem.heapUsed / 1024 / 1024);
  const memTotal = Math.round(mem.heapTotal / 1024 / 1024);

  /* Checks env */
  const checks = {
    jwtSecret: (process.env.JWT_SECRET?.length ?? 0) > 30,
    mongoUri:
      !!process.env.MONGODB_URI && !process.env.MONGODB_URI.includes("VOTRE"),
    resendKey:
      !!process.env.RESEND_API_KEY &&
      !process.env.RESEND_API_KEY.startsWith("re_VOTRE"),
    brevoKey:
      !!process.env.BREVO_API_KEY &&
      !process.env.BREVO_API_KEY.startsWith("xkeysib-VOTRE"),
    siteUrl: !!process.env.NEXT_PUBLIC_SITE_URL,
    revalidateKey: !!process.env.REVALIDATION_SECRET,
  };

  const payload: HealthResponse = {
    status: overall,
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version ?? "1.0.0",
    uptime: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV ?? "unknown",
    services: { database, email, newsletter, search },
    system: {
      memoryUsedMb: memMB,
      memoryTotalMb: memTotal,
      nodeVersion: process.version,
      nextVersion: "14.x",
    },
    checks,
  };

  return NextResponse.json(payload, {
    status: overall === "unhealthy" ? 503 : 200,
    headers: {
      "Cache-Control": "no-store",
      "X-Health-Status": overall,
    },
  });
}

/* ─── HEAD pour les health checks load balancer ─────────────────────────── */
export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: { "X-Health": "ok", "Cache-Control": "no-store" },
  });
}
