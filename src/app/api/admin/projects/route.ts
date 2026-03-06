/**
 * /api/admin/projects
 * CRUD complet pour la gestion des projets
 * GET    → liste avec filtres (statut, domaine, pagination)
 * POST   → créer un projet
 * PATCH  → modifier un projet
 * DELETE → archiver / supprimer
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/admin/auth";
import { sanitizeHtml } from "@/lib/utils/sanitize";
import projectsData from "@/data/projects.json";

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

/* ── GET ──────────────────────────────────────────────────────────────────── */
export async function GET(request: NextRequest) {
  if (!auth(request))
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "12", 10));
  const status = searchParams.get("status") ?? "";
  const domain = searchParams.get("domain") ?? "";
  const q = searchParams.get("q") ?? "";

  if (!process.env.MONGODB_URI) {
    // Fallback JSON statique
    let projects = projectsData as Array<Record<string, unknown>>;
    if (status) projects = projects.filter((p) => p.status === status);
    if (domain)
      projects = projects.filter(
        (p) => String(p.domain ?? "").toLowerCase() === domain.toLowerCase(),
      );
    if (q) {
      const ql = q.toLowerCase();
      projects = projects.filter((p) =>
        String(p.title ?? "")
          .toLowerCase()
          .includes(ql),
      );
    }
    const total = projects.length;
    return NextResponse.json({
      items: projects.slice((page - 1) * limit, page * limit),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      source: "json",
    });
  }

  try {
    const { getCollection, COLLECTIONS } = await import("@/lib/db/mongodb");
    const col = await getCollection(COLLECTIONS.PROJECTS ?? "projects");

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (domain) filter.domain = { $regex: domain, $options: "i" };
    if (q)
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
      ];

    const total = await col.countDocuments(filter);
    const items = await col
      .find(filter)
      .sort({ startDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    const [ongoing, completed] = await Promise.all([
      col.countDocuments({ status: "ongoing" }),
      col.countDocuments({ status: "completed" }),
    ]);

    return NextResponse.json({
      items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      counts: { ongoing, completed, total },
    });
  } catch (err) {
    console.error("[Admin/Projects GET]", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

/* ── POST ─────────────────────────────────────────────────────────────────── */
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
  const errors: string[] = [];
  if (!b.title || String(b.title).length < 3)
    errors.push("Titre requis (min. 3 chars).");
  if (!b.description) errors.push("Description requise.");
  if (!b.domain) errors.push("Domaine requis.");
  if (
    !b.status ||
    !["ongoing", "completed", "planned"].includes(String(b.status))
  )
    errors.push("Statut invalide.");
  if (errors.length) return NextResponse.json({ errors }, { status: 422 });

  if (!process.env.MONGODB_URI)
    return NextResponse.json(
      { error: "MongoDB non configuré." },
      { status: 503 },
    );

  try {
    const { getCollection, COLLECTIONS } = await import("@/lib/db/mongodb");
    const col = await getCollection(COLLECTIONS.PROJECTS ?? "projects");

    const doc = {
      slug: slugify(String(b.title)),
      title: sanitizeHtml(String(b.title).trim()),
      description: sanitizeHtml(String(b.description).trim()),
      domain: String(b.domain),
      status: String(b.status),
      location: String(b.location ?? ""),
      budget: b.budget ?? null,
      beneficiaries: Array.isArray(b.beneficiaries) ? b.beneficiaries : [],
      funders: Array.isArray(b.funders) ? b.funders : [],
      image: String(b.image ?? ""),
      startDate: b.startDate ? new Date(String(b.startDate)) : new Date(),
      endDate: b.endDate ? new Date(String(b.endDate)) : null,
      tags: Array.isArray(b.tags) ? b.tags.map(String) : [],
      featured: Boolean(b.featured),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await col.insertOne(doc as any);
    return NextResponse.json(
      { success: true, id: result.insertedId, slug: doc.slug },
      { status: 201 },
    );
  } catch (err) {
    console.error("[Admin/Projects POST]", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

/* ── PATCH ────────────────────────────────────────────────────────────────── */
export async function PATCH(request: NextRequest) {
  if (!auth(request))
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide." }, { status: 400 });
  }

  const { id, ...updates } = body as Record<string, unknown>;
  if (!id) return NextResponse.json({ error: "ID manquant." }, { status: 422 });
  if (!process.env.MONGODB_URI)
    return NextResponse.json(
      { error: "MongoDB non configuré." },
      { status: 503 },
    );

  try {
    const { getCollection, COLLECTIONS } = await import("@/lib/db/mongodb");
    const { ObjectId } = await import("mongodb");
    const col = await getCollection(COLLECTIONS.PROJECTS ?? "projects");

    // Sanitize champs texte
    const sanitized: Record<string, unknown> = {
      ...updates,
      updatedAt: new Date(),
    };
    if (sanitized.title)
      sanitized.title = sanitizeHtml(String(sanitized.title).trim());
    if (sanitized.description)
      sanitized.description = sanitizeHtml(
        String(sanitized.description).trim(),
      );
    delete sanitized.id;

    const result = await col.updateOne(
      { _id: new ObjectId(String(id)) },
      { $set: sanitized },
    );
    if (result.matchedCount === 0)
      return NextResponse.json(
        { error: "Projet introuvable." },
        { status: 404 },
      );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[Admin/Projects PATCH]", err);
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

  const { id, hard } = body as { id?: string; hard?: boolean };
  if (!id) return NextResponse.json({ error: "ID manquant." }, { status: 422 });
  if (!process.env.MONGODB_URI)
    return NextResponse.json(
      { error: "MongoDB non configuré." },
      { status: 503 },
    );

  try {
    const { getCollection, COLLECTIONS } = await import("@/lib/db/mongodb");
    const { ObjectId } = await import("mongodb");
    const col = await getCollection(COLLECTIONS.PROJECTS ?? "projects");
    const oid = new ObjectId(id);

    if (hard) {
      await col.deleteOne({ _id: oid });
    } else {
      await col.updateOne(
        { _id: oid },
        { $set: { status: "archived", updatedAt: new Date() } },
      );
    }

    return NextResponse.json(
      { success: true, action: hard ? "deleted" : "archived" },
      { status: 200 },
    );
  } catch (err) {
    console.error("[Admin/Projects DELETE]", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
