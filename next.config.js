/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,

  // 1. Indique à Next.js 16 d'accepter votre config Webpack personnalisée
  turbopack: {},

  /* ── Images ────────────────────────────────────────────────────────────── */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "via.placeholder.com" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
    formats: ["image/avif", "image/webp"],
    // 2. Désactivé l'optimisation pour éviter les erreurs 500/Timeout sur le serveur
    unoptimized: true,
    dangerouslyAllowSVG: true,
  },

  /* ── Headers de sécurité ───────────────────────────────────────────────── */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },

  /* ── Optimisations ───────────────────────────────────────────────────── */
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  /* ── Modules serveur (Crucial pour MongoDB) ──────────────────────────── */
  serverExternalPackages: ["mongoose", "mongodb"],

  /* ── Webpack (Gestion des dépendances lourdes) ───────────────────────── */
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        "mongodb-client-encryption": false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
