/**
 * Service Worker — MRJC-BÉNIN PWA
 *
 * Stratégies de cache :
 *  • Assets statiques (JS, CSS, fonts, images) → Cache First (1 an)
 *  • Pages HTML                                → Network First + fallback cache
 *  • API                                       → Network Only (pas de cache)
 *  • Offline                                   → /offline si réseau absent
 *
 * Pages pré-cachées au install (accessibles OFFLINE) :
 *  /, /about, /domains, /projects, /news, /resources, /contact, /offline
 */

const CACHE_VER = "mrjc-v2";
const STATIC_CACHE = `${CACHE_VER}-static`;
const PAGE_CACHE = `${CACHE_VER}-pages`;
const IMG_CACHE = `${CACHE_VER}-images`;

const PRECACHE_PAGES = [
  "/",
  "/offline",
  "/about",
  "/domains",
  "/projects",
  "/news",
  "/resources",
  "/contact",
  "/impact",
  "/work-with-us",
];

const PRECACHE_ASSETS = [
  "/assets/images/logo.png",
  "/assets/icons/icon-192x192.png",
  "/assets/icons/icon-512x512.png",
  "/favicon.ico",
];

const STATIC_EXTS = [".js", ".css", ".woff", ".woff2", ".ttf"];
const IMAGE_EXTS = [".jpg", ".jpeg", ".png", ".webp", ".svg", ".ico", ".gif"];

/* ── Installation ────────────────────────────────────────────────────────── */
self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.allSettled([
      /* Cache pages principales */
      caches
        .open(PAGE_CACHE)
        .then((cache) =>
          Promise.allSettled(
            PRECACHE_PAGES.map((url) =>
              cache
                .add(url)
                .catch(() =>
                  console.warn("[SW] Page non mise en cache :", url),
                ),
            ),
          ),
        ),
      /* Cache assets critiques */
      caches
        .open(STATIC_CACHE)
        .then((cache) =>
          Promise.allSettled(
            PRECACHE_ASSETS.map((url) =>
              cache
                .add(url)
                .catch(() =>
                  console.warn("[SW] Asset non mis en cache :", url),
                ),
            ),
          ),
        ),
    ]).then(() => self.skipWaiting()),
  );
});

/* ── Activation ──────────────────────────────────────────────────────────── */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter(
              (n) =>
                n.startsWith("mrjc-") &&
                ![STATIC_CACHE, PAGE_CACHE, IMG_CACHE].includes(n),
            )
            .map((n) => caches.delete(n)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

/* ── Interception fetch ──────────────────────────────────────────────────── */
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  /* Ignorer non-GET, API, admin, chrome-extension */
  if (request.method !== "GET") return;
  if (!url.protocol.startsWith("http")) return;
  if (url.pathname.startsWith("/api/")) return;
  if (url.pathname.startsWith("/admin")) return;
  if (url.pathname.startsWith("/_next/webpack")) return;

  const ext = url.pathname.split(".").pop()?.toLowerCase() ?? "";

  /* ─── Assets statiques → Cache First ─── */
  if (
    STATIC_EXTS.includes(`.${ext}`) ||
    url.pathname.startsWith("/_next/static/")
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request)
          .then((res) => {
            if (res.ok) {
              const clone = res.clone();
              caches.open(STATIC_CACHE).then((c) => c.put(request, clone));
            }
            return res;
          })
          .catch(() => new Response("Asset indisponible", { status: 503 }));
      }),
    );
    return;
  }

  /* ─── Images → Cache First avec fallback SVG ─── */
  if (IMAGE_EXTS.includes(`.${ext}`)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request)
          .then((res) => {
            if (res.ok) {
              const clone = res.clone();
              caches.open(IMG_CACHE).then((c) => c.put(request, clone));
            }
            return res;
          })
          .catch(
            () =>
              new Response(
                `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150">
              <rect width="200" height="150" fill="#eaf5ee"/>
              <text x="100" y="80" text-anchor="middle" fill="#1B6B3A" font-size="14" font-family="Arial">
                Image indisponible
              </text>
            </svg>`,
                { headers: { "Content-Type": "image/svg+xml" } },
              ),
          );
      }),
    );
    return;
  }

  /* ─── Pages HTML → Network First + fallback cache ─── */
  if (
    request.headers.get("Accept")?.includes("text/html") ||
    !ext ||
    ext === "html"
  ) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(PAGE_CACHE).then((c) => c.put(request, clone));
          }
          return res;
        })
        .catch(async () => {
          /* Réseau absent : essayer le cache */
          const cached = await caches.match(request);
          if (cached) return cached;

          /* Fallback page offline */
          const offline = await caches.match("/offline");
          return (
            offline ||
            new Response(
              '<html><body style="font-family:Arial;text-align:center;padding:4rem">' +
                "<h1>Hors ligne</h1><p>Veuillez vérifier votre connexion.</p>" +
                '<a href="/">Retour accueil</a></body></html>',
              { headers: { "Content-Type": "text/html;charset=utf-8" } },
            )
          );
        }),
    );
    return;
  }
});

/* ── Notification de mise à jour ─────────────────────────────────────────── */
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});
