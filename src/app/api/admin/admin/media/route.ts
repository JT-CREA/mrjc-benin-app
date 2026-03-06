/**
 * POST /api/admin/media
 * Upload de fichiers médias (images, PDFs)
 * Stratégie : Cloudinary si configuré, sinon répertoire public/uploads/
 *
 * GET /api/admin/media  → liste des médias uploadés (depuis DB ou dossier)
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/admin/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_SIZE_BYTES =
  parseInt(process.env.MAX_UPLOAD_SIZE_MB ?? "10", 10) * 1024 * 1024;
const ALLOWED_TYPES = (
  process.env.ALLOWED_FILE_TYPES ??
  "image/jpeg,image/png,image/webp,image/gif,application/pdf"
).split(",");

function auth(req: NextRequest) {
  const token = req.cookies.get("mrjc_admin_token")?.value;
  return token && verifyAdminToken(token);
}

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100);
}

async function uploadToCloudinary(
  buffer: Buffer,
  filename: string,
  mimeType: string,
) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary non configuré");
  }

  // Import dynamique de cloudinary v2
  const { v2: cloudinary } = await import("cloudinary");
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  const resourceType = mimeType === "application/pdf" ? "raw" : "image";
  const result = await new Promise<{
    secure_url: string;
    public_id: string;
    format: string;
    bytes: number;
  }>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "mrjc-benin",
          resource_type: resourceType,
          public_id: `${Date.now()}-${sanitizeFilename(filename)}`,
          overwrite: false,
        },
        (err, res) => {
          if (err || !res) reject(err ?? new Error("Upload échoué"));
          else resolve(res as typeof result);
        },
      )
      .end(buffer);
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    format: result.format,
    bytes: result.bytes,
    provider: "cloudinary" as const,
  };
}

async function saveLocally(buffer: Buffer, filename: string) {
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const uniqueName = `${Date.now()}-${sanitizeFilename(filename)}`;
  const filePath = path.join(uploadDir, uniqueName);
  await writeFile(filePath, buffer);

  return {
    url: `/uploads/${uniqueName}`,
    publicId: uniqueName,
    format: filename.split(".").pop() ?? "",
    bytes: buffer.length,
    provider: "local" as const,
  };
}

/* ── POST — Upload ────────────────────────────────────────────────────────── */
export async function POST(request: NextRequest) {
  if (!auth(request))
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "FormData invalide." }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file)
    return NextResponse.json(
      { error: "Aucun fichier fourni." },
      { status: 422 },
    );

  // Vérifications
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      {
        error: `Type non autorisé: ${file.type}. Autorisés: ${ALLOWED_TYPES.join(", ")}`,
      },
      { status: 422 },
    );
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      {
        error: `Fichier trop volumineux (max ${MAX_SIZE_BYTES / 1024 / 1024} Mo).`,
      },
      { status: 413 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = file.name;

  let uploadResult;
  try {
    if (process.env.CLOUDINARY_API_KEY) {
      uploadResult = await uploadToCloudinary(buffer, filename, file.type);
    } else {
      uploadResult = await saveLocally(buffer, filename);
    }
  } catch (err) {
    console.error("[Media Upload] Erreur:", err);
    return NextResponse.json(
      { error: "Erreur lors de l'upload. Réessayez." },
      { status: 500 },
    );
  }

  // Journalisation en DB
  if (process.env.MONGODB_URI) {
    try {
      const { getCollection } = await import("@/lib/db/mongodb");
      const col = await getCollection("media");
      await col.insertOne({
        ...uploadResult,
        originalName: filename,
        mimeType: file.type,
        uploadedAt: new Date(),
        alt: formData.get("alt") ?? "",
        caption: formData.get("caption") ?? "",
      } as any);
    } catch (err) {
      console.error("[Media] Échec journalisation DB:", err);
    }
  }

  return NextResponse.json(
    { success: true, file: uploadResult },
    { status: 201 },
  );
}

/* ── GET — Liste médias ───────────────────────────────────────────────────── */
export async function GET(request: NextRequest) {
  if (!auth(request))
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "24", 10));
  const type = searchParams.get("type") ?? ""; // 'image' | 'pdf'

  if (!process.env.MONGODB_URI) {
    return NextResponse.json(
      { items: [], pagination: { page, limit, total: 0, totalPages: 0 } },
      { status: 200 },
    );
  }

  try {
    const { getCollection } = await import("@/lib/db/mongodb");
    const col = await getCollection("media");

    const filter: Record<string, unknown> = {};
    if (type === "image")
      filter.mimeType = {
        $in: ["image/jpeg", "image/png", "image/webp", "image/gif"],
      };
    if (type === "pdf") filter.mimeType = "application/pdf";

    const total = await col.countDocuments(filter);
    const items = await col
      .find(filter)
      .sort({ uploadedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return NextResponse.json(
      {
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("[Admin/Media GET]", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

/* ── DELETE — Supprimer un média ──────────────────────────────────────────── */
export async function DELETE(request: NextRequest) {
  if (!auth(request))
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide." }, { status: 400 });
  }

  const { publicId, provider } = body as {
    publicId?: string;
    provider?: string;
  };
  if (!publicId)
    return NextResponse.json({ error: "publicId manquant." }, { status: 422 });

  if (provider === "cloudinary" && process.env.CLOUDINARY_API_KEY) {
    try {
      const { v2: cloudinary } = await import("cloudinary");
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      console.error("[Media Delete Cloudinary]", err);
    }
  }

  if (process.env.MONGODB_URI) {
    try {
      const { getCollection } = await import("@/lib/db/mongodb");
      const col = await getCollection("media");
      await col.deleteOne({ publicId });
    } catch (err) {
      console.error("[Media Delete DB]", err);
    }
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
