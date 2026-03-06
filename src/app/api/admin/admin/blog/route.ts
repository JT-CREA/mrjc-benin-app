/**
 * /api/admin/blog
 * CRUD complet pour la gestion des articles de blog
 * GET    → liste (paginée + filtres statut)
 * POST   → créer un article
 * PATCH  → modifier un article
 * DELETE → supprimer (soft ou hard)
 *
 * Protection : middleware JWT cookie mrjc_admin_token
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/admin/auth";
import { sanitizeHtml } from "@/lib/utils/sanitize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function auth(req: NextRequest) {
  const token = req.cookies.get("mrjc_admin_token")?.value;
  return token && verifyAdminToken(token);
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const REQUIRED_FIELDS = [
  "title",
  "excerpt",
  "content",
  "category",
  "author",
] as const;

function validatePost(body: Record<string, unknown>): string[] {
  const errors: string[] = [];
  for (const field of REQUIRED_FIELDS) {
    if (!body[field] || String(body[field]).trim().length < 3) {
      errors.push(`Champ "${field}" requis (min. 3 caractères).`);
    }
  }
  if (body.title && String(body.title).length > 200)
    errors.push("Titre trop long (max 200).");
  if (body.excerpt && String(body.excerpt).length > 500)
    errors.push("Extrait trop long (max 500).");
  return errors;
}

/* ── GET ──────────────────────────────────────────────────────────────────── */
export async function GET(request: NextRequest) {
  if (!auth(request))
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "15", 10));
  const status = searchParams.get("status") ?? "";
  const q = searchParams.get("q") ?? "";

  if (!process.env.MONGODB_URI) {
    return NextResponse.json({
      items: [],
      pagination: { page, limit, total: 0, totalPages: 0 },
    });
  }

  try {
    const { getCollection } = await import("@/lib/db/mongodb");
    const col = await getCollection("blog_posts");

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (q)
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { author: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ];

    const total = await col.countDocuments(filter);
    const items = await col
      .find(filter, { projection: { content: 0 } })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    const [countPub, countDraft] = await Promise.all([
      col.countDocuments({ status: "published" }),
      col.countDocuments({ status: "draft" }),
    ]);

    return NextResponse.json({
      items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      counts: { published: countPub, draft: countDraft },
    });
  } catch (err) {
    console.error("[Admin/Blog GET]", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

/* ── POST — Créer ─────────────────────────────────────────────────────────── */
export async function POST(request: NextRequest) {
  if (!auth(request))
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide." }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const errors = validatePost(b);
  if (errors.length) return NextResponse.json({ errors }, { status: 422 });

  if (!process.env.MONGODB_URI) {
    return NextResponse.json(
      { error: "MongoDB non configuré." },
      { status: 503 },
    );
  }

  try {
    const { getCollection } = await import("@/lib/db/mongodb");
    const col = await getCollection("blog_posts");

    const slug = slugify(String(b.title));
    const existing = await col.findOne({ slug });

    const doc = {
      slug: existing ? `${slug}-${Date.now()}` : slug,
      title: sanitizeHtml(String(b.title).trim()),
      excerpt: sanitizeHtml(String(b.excerpt).trim()),
      content: sanitizeHtml(String(b.content).trim()),
      category: String(b.category),
      author: String(b.author),
      authorRole: String(b.authorRole ?? ""),
      tags: Array.isArray(b.tags) ? b.tags.map(String) : [],
      image: String(b.image ?? ""),
      featured: Boolean(b.featured),
      status: ["published", "draft", "archived"].includes(String(b.status))
        ? String(b.status)
        : "draft",
      publishedAt: b.status === "published" ? new Date() : null,
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
    };

    const result = await col.insertOne(doc as any);
    return NextResponse.json(
      { success: true, id: result.insertedId, slug: doc.slug },
      { status: 201 },
    );
  } catch (err) {
    console.error("[Admin/Blog POST]", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

/* ── PATCH — Modifier ─────────────────────────────────────────────────────── */
export async function PATCH(request: NextRequest) {
  if (!auth(request))
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide." }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const id = b.id;
  if (!id || typeof id !== "string")
    return NextResponse.json({ error: "ID manquant." }, { status: 422 });

  if (!process.env.MONGODB_URI) {
    return NextResponse.json(
      { error: "MongoDB non configuré." },
      { status: 503 },
    );
  }

  try {
    const { getCollection } = await import("@/lib/db/mongodb");
    const { ObjectId } = await import("mongodb");
    const col = await getCollection("blog_posts");

    const update: Record<string, unknown> = { updatedAt: new Date() };
    const updatable = [
      "title",
      "excerpt",
      "content",
      "category",
      "author",
      "authorRole",
      "image",
      "featured",
      "tags",
      "status",
    ];
    for (const key of updatable) {
      if (b[key] !== undefined) {
        update[key] = ["title", "excerpt", "content"].includes(key)
          ? sanitizeHtml(String(b[key]).trim())
          : b[key];
      }
    }
    if (b.status === "published" && !update.publishedAt)
      update.publishedAt = new Date();

    const result = await col.updateOne(
      { _id: new ObjectId(id) },
      { $set: update },
    );
    if (result.matchedCount === 0)
      return NextResponse.json(
        { error: "Article introuvable." },
        { status: 404 },
      );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[Admin/Blog PATCH]", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

/* ── DELETE ───────────────────────────────────────────────────────────────── */
export async function DELETE(request: NextRequest) {
  if (!auth(request))
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide." }, { status: 400 });
  }

  const { id, soft } = body as { id?: string; soft?: boolean };
  if (!id) return NextResponse.json({ error: "ID manquant." }, { status: 422 });

  if (!process.env.MONGODB_URI) {
    return NextResponse.json(
      { error: "MongoDB non configuré." },
      { status: 503 },
    );
  }

  try {
    const { getCollection } = await import("@/lib/db/mongodb");
    const { ObjectId } = await import("mongodb");
    const col = await getCollection("blog_posts");

    if (soft) {
      await col.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: "archived", updatedAt: new Date() } },
      );
    } else {
      await col.deleteOne({ _id: new ObjectId(id) });
    }

    return NextResponse.json(
      { success: true, action: soft ? "archived" : "deleted" },
      { status: 200 },
    );
  } catch (err) {
    console.error("[Admin/Blog DELETE]", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
