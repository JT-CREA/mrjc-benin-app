/**
 * Service Worker — MRJC-BÉNIN PWA
 * Stratégies de cache :
 * - Pages HTML : Network First (fraîcheur max) + fallback offline
 * - Assets statiques : Cache First (JS, CSS, images)
 * - API : Network Only (toujours à jour)
 */

const CACHE_VERSION = "mrjc-benin-v1.0.0";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;

const PRECACHE_URLS = [
  "/",
  "/offline",
  "/projects",
  "/resources",
  "/contact",
  "/about",
  "/domains",
];

const STATIC_EXTENSIONS = [".js", ".css", ".woff2", ".woff", ".ttf"];
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".svg", ".ico"];

// ── Installation ──────────────────────────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()),
  );
});

// ── Activation ────────────────────────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter(
              (name) =>
                name.startsWith("mrjc-benin-") &&
                name !== STATIC_CACHE &&
                name !== DYNAMIC_CACHE,
            )
            .map((name) => caches.delete(name)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// ── Interception des requêtes ─────────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorer les requêtes non-GET et les API
  if (request.method !== "GET") return;
  if (url.pathname.startsWith("/api/")) return;
  if (url.pathname.startsWith("/admin")) return;
  if (!url.protocol.startsWith("http")) return;

  const ext = url.pathname.split(".").pop()?.toLowerCase() || "";

  // Assets statiques → Cache First
  if (STATIC_EXTENSIONS.includes(`.${ext}`)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Images → Cache First avec expiration longue
  if (IMAGE_EXTENSIONS.includes(`.${ext}`)) {
    event.respondWith(cacheFirst(request, DYNAMIC_CACHE));
    return;
  }

  // Pages HTML → Network First + fallback
  event.respondWith(networkFirstWithFallback(request));
});

// ── Stratégies ────────────────────────────────────────────────────────────────
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response("", { status: 503 });
  }
}

async function networkFirstWithFallback(request) {
  try {
    const response = await fetch(request, {
      signal: AbortSignal.timeout(5000),
    });
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return (
      caches.match("/offline") ||
      new Response("<h1>Hors ligne</h1>", {
        headers: { "Content-Type": "text/html" },
      })
    );
  }
}
