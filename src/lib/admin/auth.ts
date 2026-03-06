/**
 * Admin Auth Utils — MRJC-BÉNIN
 * Gestion de l'authentification admin via cookies sécurisés.
 * Production: remplacer par NextAuth.js / Auth0 / Supabase Auth
 */

// ─── Types ────────────────────────────────────────────────────────────────────
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "editor" | "viewer";
  avatar?: string;
  permissions: Permission[];
  lastLogin?: string;
}

export type Permission =
  | "content:read"
  | "content:write"
  | "content:delete"
  | "users:read"
  | "users:write"
  | "users:delete"
  | "settings:read"
  | "settings:write"
  | "analytics:read"
  | "media:read"
  | "media:write"
  | "media:delete";

export interface AdminRole {
  name: string;
  label: string;
  permissions: Permission[];
  color: string;
}

// ─── Définition des rôles ─────────────────────────────────────────────────────
export const ADMIN_ROLES: Record<AdminUser["role"], AdminRole> = {
  super_admin: {
    name: "super_admin",
    label: "Super Administrateur",
    color: "red",
    permissions: [
      "content:read",
      "content:write",
      "content:delete",
      "users:read",
      "users:write",
      "users:delete",
      "settings:read",
      "settings:write",
      "analytics:read",
      "media:read",
      "media:write",
      "media:delete",
    ],
  },
  admin: {
    name: "admin",
    label: "Administrateur",
    color: "orange",
    permissions: [
      "content:read",
      "content:write",
      "content:delete",
      "users:read",
      "users:write",
      "settings:read",
      "analytics:read",
      "media:read",
      "media:write",
      "media:delete",
    ],
  },
  editor: {
    name: "editor",
    label: "Éditeur",
    color: "blue",
    permissions: [
      "content:read",
      "content:write",
      "media:read",
      "media:write",
      "analytics:read",
    ],
  },
  viewer: {
    name: "viewer",
    label: "Lecteur",
    color: "gray",
    permissions: ["content:read", "analytics:read", "media:read"],
  },
};

// ─── Utilisateurs démo ────────────────────────────────────────────────────────
export const DEMO_USERS: AdminUser[] = [
  {
    id: "1",
    name: "Directeur Admin",
    email: "admin@mrjc-benin.org",
    role: "super_admin",
    avatar: "/assets/images/team/admin.jpg",
    permissions: ADMIN_ROLES.super_admin.permissions,
    lastLogin: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Marie Kodjovi",
    email: "editeur@mrjc-benin.org",
    role: "editor",
    permissions: ADMIN_ROLES.editor.permissions,
    lastLogin: new Date(Date.now() - 86400000).toISOString(),
  },
];

// ─── Cookie helper (côté client) ─────────────────────────────────────────────
const AUTH_COOKIE = "mrjc_admin_token";

export function setAdminToken(token: string): void {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + 8 * 60 * 60 * 1000); // 8h
  document.cookie = `${AUTH_COOKIE}=${token}; expires=${expires.toUTCString()}; path=/admin; SameSite=Strict`;
}

export function getAdminToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${AUTH_COOKIE}=([^;]*)`),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

export function clearAdminToken(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/admin`;
}

export function isAdminAuthenticated(): boolean {
  return !!getAdminToken();
}

// ─── Credentials démo ─────────────────────────────────────────────────────────
export const DEMO_CREDENTIALS = [
  {
    email: "admin@mrjc-benin.org",
    password: "Admin@MRJC2024",
    user: DEMO_USERS[0],
  },
  {
    email: "editeur@mrjc-benin.org",
    password: "Editor@MRJC2024",
    user: DEMO_USERS[1],
  },
];

export function authenticate(
  email: string,
  password: string,
): AdminUser | null {
  const match = DEMO_CREDENTIALS.find(
    (c) => c.email === email && c.password === password,
  );
  return match?.user ?? null;
}

// ─── Vérification JWT côté serveur ───────────────────────────────────────────
/**
 * Vérifie qu'un token JWT admin est valide et non expiré.
 * Compatible Edge Runtime (pas de dépendance Node.js).
 */
export function verifyAdminToken(token: string): boolean {
  try {
    if (!token || token.length < 50) return false;
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    // Décodage Base64URL sans atob (compatible Edge + Node)
    const decode = (str: string) => {
      const b64 = str.replace(/-/g, "+").replace(/_/g, "/");
      const padded = b64 + "===".slice((b64.length + 3) % 4);
      try {
        return JSON.parse(
          typeof Buffer !== "undefined"
            ? Buffer.from(padded, "base64").toString("utf-8")
            : atob(padded),
        );
      } catch {
        return null;
      }
    };

    const payload = decode(parts[1]);
    if (!payload || typeof payload !== "object") return false;
    if (!payload.sub || !payload.exp) return false;

    // Vérification expiration
    return payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

/**
 * Génère un token JWT simple (HMAC-SHA256) pour l'admin.
 * Pour la production, utiliser une librairie dédiée (jose, jsonwebtoken).
 */
export async function generateAdminToken(user: AdminUser): Promise<string> {
  const secret =
    process.env.JWT_SECRET ?? "fallback-dev-secret-change-in-production";
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 8 * 60 * 60; // 8 heures

  const header = { alg: "HS256", typ: "JWT" };
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    iat: now,
    exp,
  };

  const b64url = (obj: object) =>
    Buffer.from(JSON.stringify(obj)).toString("base64url");

  const headerB64 = b64url(header);
  const payloadB64 = b64url(payload);
  const signing = `${headerB64}.${payloadB64}`;

  // HMAC-SHA256 via Web Crypto (compatible Edge + Node 18+)
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
    new TextEncoder().encode(signing),
  );
  const sigB64 = Buffer.from(sig).toString("base64url");

  return `${signing}.${sigB64}`;
}

/**
 * Extraire le payload d'un token admin sans vérification de signature.
 * Utiliser UNIQUEMENT pour afficher des infos non-critiques côté client.
 */
export function decodeAdminToken(
  token: string,
): {
  sub: string;
  email: string;
  role: string;
  name: string;
  exp: number;
} | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "===".slice((b64.length + 3) % 4);
    const payload = JSON.parse(
      typeof Buffer !== "undefined"
        ? Buffer.from(padded, "base64").toString()
        : atob(padded),
    );
    return payload;
  } catch {
    return null;
  }
}
