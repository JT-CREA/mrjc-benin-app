/**
 * /api/admin/subscribers
 * GET    → liste paginée des abonnés newsletter
 * DELETE → désabonner / supprimer un abonné
 * POST   → exporter en CSV
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/admin/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function auth(req: NextRequest) {
  const token = req.cookies.get("mrjc_admin_token")?.value;
  return token && verifyAdminToken(token);
}

/* ── GET — Liste abonnés ──────────────────────────────────────────────────── */
export async function GET(request: NextRequest) {
  if (!auth(request))
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "25", 10));
  const status = searchParams.get("status") ?? ""; // 'active' | 'unsubscribed' | 'bounced'
  const q = searchParams.get("q") ?? "";
  const format = searchParams.get("format") ?? ""; // 'csv' pour export

  if (!process.env.MONGODB_URI) {
    return NextResponse.json(
      {
        items: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
        note: "MongoDB non configuré.",
      },
      { status: 200 },
    );
  }

  try {
    const { getCollection, COLLECTIONS } = await import("@/lib/db/mongodb");
    const col = await getCollection(COLLECTIONS.NEWSLETTER);

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (q)
      filter.$or = [
        { email: { $regex: q, $options: "i" } },
        { name: { $regex: q, $options: "i" } },
      ];

    const total = await col.countDocuments(filter);
    const items = await col
      .find(filter)
      .sort({ subscribedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    // Export CSV
    if (format === "csv") {
      const allSubs = await col.find({ status: "active" }).toArray();
      const csv = [
        "Email,Nom,Date inscription,Statut",
        ...allSubs.map(
          (s: any) =>
            `"${s.email}","${s.name ?? ""}","${s.subscribedAt ? new Date(s.subscribedAt).toLocaleDateString("fr-FR") : ""}","${s.status}"`,
        ),
      ].join("\n");

      return new NextResponse(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="subscribers-${new Date().toISOString().split("T")[0]}.csv"`,
        },
      });
    }

    const [countActive, countUnsub] = await Promise.all([
      col.countDocuments({ status: "active" }),
      col.countDocuments({ status: "unsubscribed" }),
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
        counts: { active: countActive, unsubscribed: countUnsub, total },
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("[Admin/Subscribers GET]", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

/* ── DELETE — Supprimer abonné ────────────────────────────────────────────── */
export async function DELETE(request: NextRequest) {
  if (!auth(request))
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide." }, { status: 400 });
  }

  const { email, hardDelete } = body as {
    email?: string;
    hardDelete?: boolean;
  };

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email manquant." }, { status: 422 });
  }

  if (!process.env.MONGODB_URI) {
    return NextResponse.json(
      { error: "MongoDB non configuré." },
      { status: 503 },
    );
  }

  try {
    const { getCollection, COLLECTIONS } = await import("@/lib/db/mongodb");
    const col = await getCollection(COLLECTIONS.NEWSLETTER);

    if (hardDelete) {
      // Suppression définitive
      await col.deleteOne({ email: email.toLowerCase() });
    } else {
      // Désabonnement doux (conserve l'enregistrement)
      await col.updateOne(
        { email: email.toLowerCase() },
        {
          $set: {
            status: "unsubscribed",
            unsubscribedAt: new Date(),
            unsubscribedBy: "admin",
          },
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        action: hardDelete ? "deleted" : "unsubscribed",
        email,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("[Admin/Subscribers DELETE]", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
