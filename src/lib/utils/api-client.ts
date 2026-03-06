/**
 * lib/utils/api-client.ts
 * Client HTTP typé pour les appels API côté client
 * Gestion centralisée : erreurs, timeouts, retry, auth token
 */

export interface ApiResponse<T = unknown> {
  data: T | null;
  error: string | null;
  status: number;
  ok: boolean;
}

interface RequestOptions extends RequestInit {
  timeout?: number; // ms (défaut : 15 000)
  retry?: number; // nombre de tentatives (défaut : 0)
  retryDelay?: number; // ms entre tentatives (défaut : 500)
}

const DEFAULT_TIMEOUT = 15_000;
const BASE_URL =
  typeof window !== "undefined" ? "" : (process.env.NEXT_PUBLIC_SITE_URL ?? "");

/* ── Fetch avec timeout ───────────────────────────────────────────────────── */
async function fetchWithTimeout(
  url: string,
  options: RequestOptions,
): Promise<Response> {
  const { timeout = DEFAULT_TIMEOUT, ...fetchOptions } = options;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    return await fetch(url, { ...fetchOptions, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/* ── Client générique ─────────────────────────────────────────────────────── */
async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const { retry = 0, retryDelay = 500, ...rest } = options;
  const url = `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  let attempt = 0;
  let lastError = "";
  let lastStatus = 0;

  while (attempt <= retry) {
    try {
      const response = await fetchWithTimeout(url, rest);
      lastStatus = response.status;

      if (!response.ok) {
        let errorMsg = `Erreur HTTP ${response.status}`;
        try {
          const errBody = await response.json();
          errorMsg = errBody.error ?? errBody.message ?? errorMsg;
        } catch {
          /* ignore */
        }
        lastError = errorMsg;

        // Pas de retry sur les erreurs client (4xx)
        if (response.status < 500) break;
        throw new Error(errorMsg);
      }

      let data: T | null = null;
      const contentType = response.headers.get("Content-Type") ?? "";

      if (contentType.includes("application/json")) {
        data = (await response.json()) as T;
      } else if (contentType.includes("text/")) {
        data = (await response.text()) as unknown as T;
      }

      return { data, error: null, status: response.status, ok: true };
    } catch (err) {
      const isAbort = err instanceof Error && err.name === "AbortError";
      lastError = isAbort
        ? `Requête expirée (${rest.timeout ?? DEFAULT_TIMEOUT}ms)`
        : String(err);

      if (attempt < retry) {
        await new Promise((r) => setTimeout(r, retryDelay * (attempt + 1)));
      }
      attempt++;
    }
  }

  return { data: null, error: lastError, status: lastStatus, ok: false };
}

/* ── Méthodes raccourcies ─────────────────────────────────────────────────── */
export const apiClient = {
  get<T>(path: string, opts: RequestOptions = {}): Promise<ApiResponse<T>> {
    return request<T>(path, { method: "GET", ...opts });
  },

  post<T>(
    path: string,
    body: unknown,
    opts: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    return request<T>(path, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(opts.headers ?? {}) },
      body: JSON.stringify(body),
      ...opts,
    });
  },

  patch<T>(
    path: string,
    body: unknown,
    opts: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    return request<T>(path, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...(opts.headers ?? {}) },
      body: JSON.stringify(body),
      ...opts,
    });
  },

  put<T>(
    path: string,
    body: unknown,
    opts: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    return request<T>(path, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...(opts.headers ?? {}) },
      body: JSON.stringify(body),
      ...opts,
    });
  },

  delete<T>(
    path: string,
    body?: unknown,
    opts: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    return request<T>(path, {
      method: "DELETE",
      ...(body
        ? {
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        : {}),
      ...opts,
    });
  },

  upload<T>(
    path: string,
    formData: FormData,
    opts: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    return request<T>(path, {
      method: "POST",
      body: formData,
      timeout: 60_000,
      ...opts,
    });
  },
};

/* ── Hooks utilitaires ────────────────────────────────────────────────────── */

/** Construit une URL avec query params depuis un objet */
export function buildUrl(
  path: string,
  params: Record<string, string | number | boolean | undefined | null>,
): string {
  const sp = new URLSearchParams();
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined && val !== null && val !== "") {
      sp.set(key, String(val));
    }
  }
  const query = sp.toString();
  return query ? `${path}?${query}` : path;
}

/** Extraction du message d'erreur d'une ApiResponse */
export function getErrorMessage(
  response: ApiResponse<unknown>,
  fallback = "Une erreur est survenue.",
): string {
  return response.error ?? fallback;
}

export default apiClient;
