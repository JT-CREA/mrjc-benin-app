/**
 * /api/admin/team
 * CRUD membres d'équipe
 * GET    → liste tous les membres
 * POST   → ajouter un membre
 * PATCH  → modifier un membre
 * DELETE → supprimer un membre
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/admin/auth";
import { sanitizeHtml } from "@/lib/utils/sanitize";
import teamData from "@/data/team.json";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function auth(req: NextRequest) {
  const token = req.cookies.get("mrjc_admin_token")?.value;
  return token && verifyAdminToken(token);
}

/* ── GET ──────────────────────────────────────────────────────────────────── */
export async function GET(request: NextRequest) {
  if (!auth(request))
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  if (!process.env.MONGODB_URI) {
    // Fallback : données JSON statiques
    const all = Object.values(teamData).flat();
    return NextResponse.json({
      team: teamData,
      total: all.length,
      source: "json",
    });
  }

  try {
    const { getCollection } = await import("@/lib/db/mongodb");
    const col = await getCollection("team_members");
    const items = await col
      .find({})
      .sort({ order: 1, createdAt: -1 })
      .toArray();

    return NextResponse.json({ items, total: items.length });
  } catch (err) {
    console.error("[Admin/Team GET]", err);
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
  if (!b.name || String(b.name).length < 2)
    errors.push("Nom requis (min. 2 chars).");
  if (!b.role) errors.push("Rôle requis.");
  if (
    !b.group ||
    !["leadership", "staff", "volunteers"].includes(String(b.group))
  ) {
    errors.push("Groupe invalide (leadership, staff, volunteers).");
  }
  if (errors.length) return NextResponse.json({ errors }, { status: 422 });

  if (!process.env.MONGODB_URI)
    return NextResponse.json(
      { error: "MongoDB non configuré." },
      { status: 503 },
    );

  try {
    const { getCollection } = await import("@/lib/db/mongodb");
    const col = await getCollection("team_members");

    const doc = {
      name: sanitizeHtml(String(b.name).trim()),
      role: sanitizeHtml(String(b.role).trim()),
      group: String(b.group),
      department: String(b.department ?? ""),
      bio: b.bio ? sanitizeHtml(String(b.bio).trim()) : "",
      email: String(b.email ?? ""),
      phone: String(b.phone ?? ""),
      photo: String(b.photo ?? ""),
      linkedin: String(b.linkedin ?? ""),
      featured: Boolean(b.featured),
      order: Number(b.order ?? 0),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await col.insertOne(doc as any);
    return NextResponse.json(
      { success: true, id: result.insertedId },
      { status: 201 },
    );
  } catch (err) {
    console.error("[Admin/Team POST]", err);
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
    const { getCollection } = await import("@/lib/db/mongodb");
    const { ObjectId } = await import("mongodb");
    const col = await getCollection("team_members");

    const sanitized: any = { ...updates, updatedAt: new Date() };
    if (sanitized.name)
      sanitized.name = sanitizeHtml(String(sanitized.name).trim());
    if (sanitized.role)
      sanitized.role = sanitizeHtml(String(sanitized.role).trim());
    if (sanitized.bio)
      sanitized.bio = sanitizeHtml(String(sanitized.bio).trim());
    delete sanitized.id;

    const result = await col.updateOne(
      { _id: new ObjectId(String(id)) },
      { $set: sanitized },
    );
    if (result.matchedCount === 0)
      return NextResponse.json(
        { error: "Membre introuvable." },
        { status: 404 },
      );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[Admin/Team PATCH]", err);
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

  const { id } = body as { id?: string };
  if (!id) return NextResponse.json({ error: "ID manquant." }, { status: 422 });
  if (!process.env.MONGODB_URI)
    return NextResponse.json(
      { error: "MongoDB non configuré." },
      { status: 503 },
    );

  try {
    const { getCollection } = await import("@/lib/db/mongodb");
    const { ObjectId } = await import("mongodb");
    const col = await getCollection("team_members");
    await col.deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[Admin/Team DELETE]", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
