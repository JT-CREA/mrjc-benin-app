/**
 * lib/utils/response.ts — MRJC-BÉNIN
 * Helpers pour réponses API Next.js standardisées
 * Format uniforme : { success, data?, error?, meta? }
 */

import { NextResponse } from "next/server";

/* ─── Types ─────────────────────────────────────────────────────────────── */
export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiError {
  success: false;
  error: string;
  code?: string;
  details?: unknown;
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/* ─── Réponses succès ────────────────────────────────────────────────────── */
export function ok<T>(
  data: T,
  meta?: Record<string, unknown>,
  status = 200,
): NextResponse<ApiSuccess<T>> {
  return NextResponse.json(
    { success: true, data, ...(meta ? { meta } : {}) },
    { status },
  );
}

export function created<T>(data: T, meta?: Record<string, unknown>) {
  return ok(data, meta, 201);
}

export function noContent() {
  return new NextResponse(null, { status: 204 });
}

export function okPaginated<T>(
  data: T[],
  pagination: PaginationMeta,
  extra?: Record<string, unknown>,
) {
  return NextResponse.json({
    success: true,
    data,
    meta: { pagination, ...extra },
  });
}

/* ─── Réponses erreur ────────────────────────────────────────────────────── */
export function badRequest(error: string, details?: unknown) {
  return NextResponse.json<ApiError>(
    {
      success: false,
      error,
      code: "BAD_REQUEST",
      ...(details ? { details } : {}),
    },
    { status: 400 },
  );
}

export function unauthorized(error = "Non authentifié.") {
  return NextResponse.json<ApiError>(
    { success: false, error, code: "UNAUTHORIZED" },
    { status: 401 },
  );
}

export function forbidden(error = "Accès refusé.") {
  return NextResponse.json<ApiError>(
    { success: false, error, code: "FORBIDDEN" },
    { status: 403 },
  );
}

export function notFound(resource = "Ressource") {
  return NextResponse.json<ApiError>(
    { success: false, error: `${resource} introuvable.`, code: "NOT_FOUND" },
    { status: 404 },
  );
}

export function conflict(error: string) {
  return NextResponse.json<ApiError>(
    { success: false, error, code: "CONFLICT" },
    { status: 409 },
  );
}

export function tooManyRequests(retryAfterSeconds?: number) {
  return NextResponse.json<ApiError>(
    {
      success: false,
      error: retryAfterSeconds
        ? `Trop de requêtes. Réessayez dans ${retryAfterSeconds}s.`
        : "Trop de requêtes.",
      code: "RATE_LIMITED",
    },
    {
      status: 429,
      headers: retryAfterSeconds
        ? { "Retry-After": String(retryAfterSeconds) }
        : {},
    },
  );
}

export function serverError(error?: unknown) {
  const message =
    process.env.NODE_ENV === "development" && error instanceof Error
      ? error.message
      : "Erreur interne du serveur.";

  return NextResponse.json<ApiError>(
    { success: false, error: message, code: "INTERNAL_ERROR" },
    { status: 500 },
  );
}

export function methodNotAllowed(allowed: string[]) {
  return NextResponse.json<ApiError>(
    {
      success: false,
      error: "Méthode non autorisée.",
      code: "METHOD_NOT_ALLOWED",
    },
    {
      status: 405,
      headers: { Allow: allowed.join(", ") },
    },
  );
}

/* ─── Helpers divers ─────────────────────────────────────────────────────── */

/** Calcule les métadonnées de pagination */
export function buildPagination(
  page: number,
  limit: number,
  total: number,
): PaginationMeta {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

/** Extrait page & limit depuis les searchParams avec des valeurs par défaut saines */
export function parsePagination(
  searchParams: URLSearchParams,
  defaults = { page: 1, limit: 12, maxLimit: 50 },
): { page: number; limit: number; skip: number } {
  const page = Math.max(
    1,
    parseInt(searchParams.get("page") ?? String(defaults.page), 10) || 1,
  );
  const limit = Math.min(
    defaults.maxLimit,
    Math.max(
      1,
      parseInt(searchParams.get("limit") ?? String(defaults.limit), 10) ||
        defaults.limit,
    ),
  );
  return { page, limit, skip: (page - 1) * limit };
}

/** Extrait l'IP client depuis les en-têtes Next.js */
export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "127.0.0.1"
  );
}
