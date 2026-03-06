/**
 * API Route — POST /api/upload
 * Upload de médias (images, PDF) — réservé admin authentifié
 *
 * Pipeline :
 *  1. Vérification JWT (cookie httpOnly)
 *  2. Rate limiting strict (10 uploads/h/IP)
 *  3. Validation MIME type et taille
 *  4. Upload vers Cloudinary (si configuré) ou stockage local /public/uploads/
 *  5. Enregistrement métadonnées en MongoDB
 *  6. Retour URL publique + metadata
 */

import { NextRequest } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import crypto from "crypto";
import { rateLimit, getClientIp, addRateLimitHeaders } from "@/lib/rate-limit";
import {
  ok,
  serverError,
  unauthorized,
  badRequest,
  tooManyRequests,
} from "@/lib/utils/response";

export const runtime = "nodejs";

/* ─── Configuration ──────────────────────────────────────────────────────── */
const MAX_SIZE_BYTES =
  parseInt(process.env.MAX_UPLOAD_SIZE_MB ?? "10") * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
]);
const ALLOWED_EXTS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".pdf",
]);
const LOCAL_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

/* ─── Vérification JWT (Node runtime) ───────────────────────────────────── */
function verifyAdminToken(request: NextRequest): boolean {
  const token = request.cookies.get("mrjc_admin_token")?.value;
  if (!token) return false;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf-8"),
    ) as { exp?: number; role?: string };
    if (!payload.exp || payload.exp <= Math.floor(Date.now() / 1000))
      return false;
    return ["super_admin", "admin", "editor"].includes(payload.role ?? "");
  } catch {
    return false;
  }
}

/* ─── Upload Cloudinary ──────────────────────────────────────────────────── */
async function uploadToCloudinary(
  buffer: Buffer,
  filename: string,
  mimeType: string,
): Promise<{ url: string; publicId: string; width?: number; height?: number }> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary non configuré.");
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const publicId = `mrjc/${path.basename(filename, path.extname(filename))}_${timestamp}`;
  const folder = "mrjc-benin";

  // Signature
  const signatureStr = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto
    .createHash("sha1")
    .update(signatureStr)
    .digest("hex");

  const formData = new FormData();
  const blob = new Blob([buffer as any], { type: mimeType });
  formData.append("file", blob, filename);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", folder);
  formData.append("public_id", publicId);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    { method: "POST", body: formData },
  );

  if (!response.ok) {
    const err = (await response.json().catch(() => ({}))) as {
      error?: { message?: string };
    };
    throw new Error(
      `Cloudinary error: ${err.error?.message ?? response.statusText}`,
    );
  }

  const result = (await response.json()) as {
    secure_url: string;
    public_id: string;
    width?: number;
    height?: number;
  };

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
  };
}

/* ─── Upload local (fallback) ───────────────────────────────────────────── */
async function uploadLocally(
  buffer: Buffer,
  originalName: string,
): Promise<{ url: string; publicId: string }> {
  await fs.mkdir(LOCAL_UPLOAD_DIR, { recursive: true });

  const ext = path.extname(originalName).toLowerCase();
  const basename = path
    .basename(originalName, ext)
    .replace(/[^a-z0-9]/gi, "-")
    .toLowerCase();
  const filename = `${basename}-${Date.now()}${ext}`;
  const filepath = path.join(LOCAL_UPLOAD_DIR, filename);

  await fs.writeFile(filepath, buffer);

  return {
    url: `/uploads/${filename}`,
    publicId: filename,
  };
}

/* ─── POST /api/upload ───────────────────────────────────────────────────── */
export async function POST(request: NextRequest) {
  /* 1. Auth */
  if (!verifyAdminToken(request)) {
    return unauthorized("Authentification admin requise.");
  }

  /* 2. Rate limiting strict */
  const ip = getClientIp(request);
  const rl = rateLimit(`upload:${ip}`, 10, 3600);
  const rlHeaders = new Headers();
  addRateLimitHeaders(rlHeaders, rl, 10);

  if (!rl.success) {
    return tooManyRequests(rl.retryAfterSeconds);
  }

  /* 3. Parse multipart */
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return badRequest(
      "Corps de requête invalide. Attendu : multipart/form-data.",
    );
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return badRequest('Champ "file" manquant ou invalide.');
  }

  /* 4. Validation MIME et taille */
  if (!ALLOWED_TYPES.has(file.type)) {
    return badRequest(
      `Type de fichier non autorisé : ${file.type}. Types acceptés : JPEG, PNG, WebP, GIF, PDF.`,
    );
  }

  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_EXTS.has(ext)) {
    return badRequest(`Extension non autorisée : ${ext}.`);
  }

  if (file.size > MAX_SIZE_BYTES) {
    return badRequest(
      `Fichier trop volumineux : ${(file.size / 1024 / 1024).toFixed(1)} MB. Maximum : ${process.env.MAX_UPLOAD_SIZE_MB ?? 10} MB.`,
    );
  }

  /* 5. Lecture buffer */
  const buffer = Buffer.from(await file.arrayBuffer());

  /* 6. Upload */
  let uploadResult: {
    url: string;
    publicId: string;
    width?: number;
    height?: number;
  };

  try {
    const hasCloudinary = !!(
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    );

    if (hasCloudinary) {
      uploadResult = await uploadToCloudinary(buffer, file.name, file.type);
    } else {
      uploadResult = await uploadLocally(buffer, file.name);
    }
  } catch (error) {
    console.error("[API /upload] Erreur upload:", error);
    return serverError(
      error instanceof Error ? error : new Error("Échec de l'upload."),
    );
  }

  /* 7. Sauvegarde métadonnées MongoDB */
  const mediaDoc = {
    originalName: file.name,
    publicId: uploadResult.publicId,
    url: uploadResult.url,
    mimeType: file.type,
    size: file.size,
    width: uploadResult.width,
    height: uploadResult.height,
    uploadedAt: new Date().toISOString(),
    altText: formData.get("altText") as string | null,
    caption: formData.get("caption") as string | null,
  };

  try {
    const { connectToDatabase, COLLECTIONS } = await import("@/lib/db/mongodb");
    const { db } = await connectToDatabase();
    const result = await db.collection(COLLECTIONS.MEDIA).insertOne(mediaDoc);
    Object.assign(mediaDoc, { _id: result.insertedId });
  } catch {
    /* Non bloquant : l'upload a réussi, on continue sans DB */
    console.warn(
      "[API /upload] Impossible de sauvegarder en DB (continuable).",
    );
  }

  return ok(mediaDoc, undefined, 201);
}

/* ─── GET /api/upload — Liste des médias uploadés ───────────────────────── */
export async function GET(request: NextRequest) {
  if (!verifyAdminToken(request)) {
    return unauthorized("Authentification admin requise.");
  }

  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "20", 10));
  const type = searchParams.get("type"); // 'image' | 'pdf'
  const skip = (page - 1) * limit;

  try {
    const { connectToDatabase, COLLECTIONS } = await import("@/lib/db/mongodb");
    const { db } = await connectToDatabase();

    const filter: Record<string, unknown> = {};
    if (type === "image") filter.mimeType = { $regex: "^image/" };
    if (type === "pdf") filter.mimeType = "application/pdf";

    const [total, media] = await Promise.all([
      db.collection(COLLECTIONS.MEDIA).countDocuments(filter),
      db
        .collection(COLLECTIONS.MEDIA)
        .find(filter)
        .sort({ uploadedAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
    ]);

    return ok(media, {
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("[API /upload GET] Erreur:", error);
    return serverError(error);
  }
}

/* ─── DELETE /api/upload ─────────────────────────────────────────────────── */
export async function DELETE(request: NextRequest) {
  if (!verifyAdminToken(request)) {
    return unauthorized("Authentification admin requise.");
  }

  const { searchParams } = request.nextUrl;
  const publicId = searchParams.get("publicId");

  if (!publicId) return badRequest("Paramètre publicId requis.");

  try {
    /* Supprimer de Cloudinary */
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (cloudName && apiKey && apiSecret) {
      const timestamp = Math.floor(Date.now() / 1000);
      const sigStr = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
      const signature = crypto.createHash("sha1").update(sigStr).digest("hex");

      await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            public_id: publicId,
            api_key: apiKey,
            timestamp,
            signature,
          }),
        },
      );
    } else {
      /* Suppression locale */
      const localPath = path.join(LOCAL_UPLOAD_DIR, publicId);
      await fs.unlink(localPath).catch(() => null);
    }

    /* Supprimer de MongoDB */
    const { connectToDatabase, COLLECTIONS } = await import("@/lib/db/mongodb");
    const { db } = await connectToDatabase();
    await db.collection(COLLECTIONS.MEDIA).deleteOne({ publicId });

    return ok({ deleted: true, publicId });
  } catch (error) {
    console.error("[API /upload DELETE] Erreur:", error);
    return serverError(error);
  }
}
