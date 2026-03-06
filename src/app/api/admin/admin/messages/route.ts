/**
 * /api/admin/messages
 * GET    → liste paginée des messages de contact
 * PATCH  → marquer lu / changer statut
 * DELETE → supprimer un ou plusieurs messages
 *
 * Protection : middleware JWT (mrjc_admin_token)
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/admin/auth";

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

  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "20", 10));
  const status = searchParams.get("status") ?? ""; // 'new' | 'read' | 'replied' | 'archived'
  const q = searchParams.get("q") ?? "";

  if (!process.env.MONGODB_URI) {
    return NextResponse.json(
      {
        items: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
        note: "MongoDB non configuré. Connectez la base de données.",
      },
      { status: 200 },
    );
  }

  try {
    const { getCollection, COLLECTIONS } = await import("@/lib/db/mongodb");
    const col = await getCollection(COLLECTIONS.MESSAGES);

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (q)
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { subject: { $regex: q, $options: "i" } },
        { message: { $regex: q, $options: "i" } },
      ];

    const total = await col.countDocuments(filter);
    const items = await col
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    // Compteurs par statut
    const [countNew, countRead, countReplied] = await Promise.all([
      col.countDocuments({ status: "new" }),
      col.countDocuments({ status: "read" }),
      col.countDocuments({ status: "replied" }),
    ]);

    return NextResponse.json(
      {
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        counts: { new: countNew, read: countRead, replied: countReplied },
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("[Admin/Messages GET]", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

/* ── PATCH — Changer statut ───────────────────────────────────────────────── */
export async function PATCH(request: NextRequest) {
  if (!auth(request))
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide." }, { status: 400 });
  }

  const { id, status } = body as { id?: string; status?: string };
  const VALID_STATUSES = ["new", "read", "replied", "archived"];

  if (!id || typeof id !== "string")
    return NextResponse.json({ error: "ID manquant." }, { status: 422 });
  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: `Statut invalide. Valeurs: ${VALID_STATUSES.join(", ")}` },
      { status: 422 },
    );
  }

  if (!process.env.MONGODB_URI) {
    return NextResponse.json(
      { error: "MongoDB non configuré." },
      { status: 503 },
    );
  }

  try {
    const { getCollection, COLLECTIONS } = await import("@/lib/db/mongodb");
    const { ObjectId } = await import("mongodb");
    const col = await getCollection(COLLECTIONS.MESSAGES);

    const result = await col.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status,
          updatedAt: new Date(),
          ...(status === "read" ? { readAt: new Date() } : {}),
        },
      },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Message introuvable." },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, id, status }, { status: 200 });
  } catch (err) {
    console.error("[Admin/Messages PATCH]", err);
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

  const { ids } = body as { ids?: string[] };
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json(
      { error: "Liste d'IDs manquante." },
      { status: 422 },
    );
  }
  if (ids.length > 100) {
    return NextResponse.json(
      { error: "Maximum 100 suppressions par requête." },
      { status: 422 },
    );
  }

  if (!process.env.MONGODB_URI) {
    return NextResponse.json(
      { error: "MongoDB non configuré." },
      { status: 503 },
    );
  }

  try {
    const { getCollection, COLLECTIONS } = await import("@/lib/db/mongodb");
    const { ObjectId } = await import("mongodb");
    const col = await getCollection(COLLECTIONS.MESSAGES);

    const objectIds = ids.map((id) => new ObjectId(id));
    const result = await col.deleteMany({ _id: { $in: objectIds } });

    return NextResponse.json(
      { success: true, deletedCount: result.deletedCount },
      { status: 200 },
    );
  } catch (err) {
    console.error("[Admin/Messages DELETE]", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
