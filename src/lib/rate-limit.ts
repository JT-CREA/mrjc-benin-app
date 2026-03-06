/**
 * lib/rate-limit.ts
 * Rate limiting in-memory pour les routes API Next.js
 * Compatible Edge Runtime & Node.js — Pas de dépendance externe
 */

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
  retryAfterSeconds?: number;
}

type RateLimitStore = Map<string, RateLimitEntry>;

/* ─── Store global ───────────────────────────────────────────────────────── */
declare global {
  // eslint-disable-next-line no-var
  var _rateLimitStore: RateLimitStore | undefined;
}

function getStore(): RateLimitStore {
  if (!global._rateLimitStore) {
    global._rateLimitStore = new Map();
  }
  return global._rateLimitStore;
}

/* ─── Nettoyage automatique (toutes les 5 minutes) ──────────────────────── */
let cleanupInterval: ReturnType<typeof setInterval> | null = null;

function startCleanup() {
  if (cleanupInterval) return;
  cleanupInterval = setInterval(
    () => {
      const store = getStore();
      const now = Date.now();
      for (const [key, entry] of store.entries()) {
        if (entry.resetAt < now) store.delete(key);
      }
    },
    5 * 60 * 1000,
  );

  if (cleanupInterval.unref) cleanupInterval.unref();
}

if (typeof process !== "undefined") startCleanup();

/* ─── Fonction principale de rate limiting ───────────────────────────────── */
/**
 * Vérifie si une clé (IP + endpoint) a dépassé la limite
 * @param key    Identifiant unique (ex: "contact:127.0.0.1")
 * @param limit  Nombre max de requêtes dans la fenêtre
 * @param window Fenêtre en secondes (ex: 3600 = 1 heure)
 */
export function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
): RateLimitResult {
  const store = getStore();
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  const entry = store.get(key);

  // Nouvelle fenêtre ou premier accès
  if (!entry || entry.resetAt < now) {
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return { success: true, remaining: limit - 1, resetAt };
  }

  // Limite atteinte
  if (entry.count >= limit) {
    const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000);
    return {
      success: false,
      remaining: 0,
      resetAt: entry.resetAt,
      retryAfterSeconds,
    };
  }

  // Incrémenter
  entry.count += 1;
  store.set(key, entry);

  return {
    success: true,
    remaining: limit - entry.count,
    resetAt: entry.resetAt,
  };
}

/* ─── Extracteur d'IP depuis NextRequest ────────────────────────────────── */
export function getClientIp(request: Request): string {
  // Vercel / Cloudflare
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  // Fallback
  return request.headers.get("x-real-ip") ?? "unknown";
}

/* ─── Presets de limites courantes ───────────────────────────────────────── */
export const RATE_LIMITS = {
  /** Formulaire contact : 5 envois / heure / IP */
  CONTACT: { limit: 5, windowSeconds: 3600 },

  /** Newsletter : 3 inscriptions / heure / IP */
  NEWSLETTER: { limit: 3, windowSeconds: 3600 },

  /** Visiteurs / analytics : 60 req / minute / IP */
  ANALYTICS: { limit: 60, windowSeconds: 60 },

  /** Téléchargements : 20 / heure / IP */
  DOWNLOADS: { limit: 20, windowSeconds: 3600 },

  /** Admin login : 10 tentatives / 15 minutes / IP */
  ADMIN_LOGIN: { limit: 10, windowSeconds: 900 },

  /** Revalidation : 20 / heure (appels CI/CD) */
  REVALIDATE: { limit: 20, windowSeconds: 3600 },

  /** Recherche : 60 req / minute / IP */
  SEARCH: { limit: 60, windowSeconds: 60 },

  /** Recrutement : 3 candidatures / heure / IP */
  RECRUITMENT: { limit: 3, windowSeconds: 3600 },

  /** Lecture API publique (projects, partners, resources) : 120 req / min / IP */
  API_READ: { limit: 120, windowSeconds: 60 },

  /** Upload médias : 10 / heure / IP */
  UPLOAD: { limit: 10, windowSeconds: 3600 },

  /** Feedback : 5 / heure / IP */
  FEEDBACK: { limit: 5, windowSeconds: 3600 },
} as const;

/* ─── Helper pour ajouter les headers de rate limit à une réponse ────────── */
export function addRateLimitHeaders(
  headers: Headers,
  result: RateLimitResult,
  limit: number,
): void {
  headers.set("X-RateLimit-Limit", String(limit));
  headers.set("X-RateLimit-Remaining", String(result.remaining));
  headers.set("X-RateLimit-Reset", String(Math.ceil(result.resetAt / 1000)));

  if (!result.success && result.retryAfterSeconds) {
    headers.set("Retry-After", String(result.retryAfterSeconds));
  }
}
