/**
 * lib/utils/crypto.ts — MRJC-BÉNIN
 * Utilitaires cryptographiques côté serveur (Node.js runtime uniquement)
 * - Hachage bcrypt des mots de passe admin
 * - Génération de tokens aléatoires sécurisés
 * - Chiffrement AES-256-GCM pour données sensibles
 */

import crypto from "crypto";

/* ─── Génération de tokens aléatoires ───────────────────────────────────── */

/** Token URL-safe aléatoire (32 octets par défaut = 64 hex chars) */
export function generateToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString("hex");
}

/** UUID v4 compatible Edge/Node */
export function generateUUID(): string {
  return crypto.randomUUID();
}

/** Token de vérification email (base64url, 32 octets) */
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString("base64url");
}

/* ─── Hachage bcrypt (mot de passe) ─────────────────────────────────────── */
// Note : bcryptjs est synchrone et safe en Node, mais lourd pour Edge Runtime.
// → Utilisez uniquement dans des Route Handlers avec `export const runtime = 'nodejs'`

export async function hashPassword(
  password: string,
  rounds = 12,
): Promise<string> {
  const { hash } = await import("bcryptjs");
  return hash(password, rounds);
}

export async function comparePassword(
  plain: string,
  hashed: string,
): Promise<boolean> {
  const { compare } = await import("bcryptjs");
  return compare(plain, hashed);
}

/* ─── HMAC-SHA256 (signature de tokens) ─────────────────────────────────── */
export function hmacSha256(data: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(data).digest("hex");
}

export function verifyHmac(
  data: string,
  secret: string,
  signature: string,
): boolean {
  const expected = hmacSha256(data, secret);
  // Comparaison temps constant pour éviter les timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(expected, "hex"),
    Buffer.from(signature, "hex"),
  );
}

/* ─── JWT HMAC-SHA256 (sans dépendance externe) ─────────────────────────── */
const b64u = (str: string) => Buffer.from(str).toString("base64url");

const parseB64u = (str: string) =>
  Buffer.from(str, "base64url").toString("utf-8");

export interface JWTPayload {
  sub: string;
  iat: number;
  exp: number;
  role?: string;
  [key: string]: unknown;
}

export function signJWT(payload: JWTPayload, secret: string): string {
  const header = b64u(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = b64u(JSON.stringify(payload));
  const sig = hmacSha256(`${header}.${body}`, secret);
  const sigB64 = Buffer.from(sig, "hex").toString("base64url");
  return `${header}.${body}.${sigB64}`;
}

export function verifyJWT(token: string, secret: string): JWTPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [header, body, sigB64] = parts;
    const expectedSig = Buffer.from(
      hmacSha256(`${header}.${body}`, secret),
      "hex",
    ).toString("base64url");

    if (!crypto.timingSafeEqual(Buffer.from(sigB64), Buffer.from(expectedSig)))
      return null;

    const payload = JSON.parse(parseB64u(body)) as JWTPayload;

    /* Vérifier expiration */
    if (payload.exp && payload.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/* ─── AES-256-GCM (chiffrement données sensibles) ───────────────────────── */
const ALGO = "aes-256-gcm";
const IV_LENGTH = 16;
const TAG_LENGTH = 16;

function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY ?? "";
  if (!key || key.length < 32) {
    throw new Error("ENCRYPTION_KEY invalide (minimum 32 hex chars).");
  }
  // Accepte clé hex (64 chars) ou binaire (32+ chars)
  return key.length === 64 && /^[0-9a-f]+$/i.test(key)
    ? Buffer.from(key, "hex")
    : Buffer.from(key.substring(0, 32), "utf-8");
}

export function encrypt(plaintext: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf-8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  // Format : iv(16) + tag(16) + encrypted → base64
  return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

export function decrypt(ciphertext: string): string {
  const key = getEncryptionKey();
  const buf = Buffer.from(ciphertext, "base64");
  const iv = buf.subarray(0, IV_LENGTH);
  const tag = buf.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
  const enc = buf.subarray(IV_LENGTH + TAG_LENGTH);
  const decipher = crypto.createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);
  return decipher.update(enc) + decipher.final("utf-8");
}

/* ─── Hash MD5 (ETag / cache busting) ───────────────────────────────────── */
export function md5(str: string): string {
  return crypto.createHash("md5").update(str).digest("hex");
}
