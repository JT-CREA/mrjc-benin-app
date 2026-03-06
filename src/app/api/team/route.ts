/**
 * GET /api/team
 * Membres de l'équipe MRJC-BÉNIN
 * Filtres : group (leadership | staff | volunteers), department, featured
 */

import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp, addRateLimitHeaders } from "@/lib/rate-limit";
import teamData from "@/data/team.json";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const rl = rateLimit(`team:${ip}`, 60, 60);
  const rlHeaders = new Headers();
  addRateLimitHeaders(rlHeaders, rl, 60);

  if (!rl.success) {
    return NextResponse.json(
      { error: "Trop de requêtes." },
      { status: 429, headers: rlHeaders },
    );
  }

  const { searchParams } = request.nextUrl;
  const group = searchParams.get("group") ?? ""; // 'leadership' | 'staff' | 'volunteers'
  const department = searchParams.get("department") ?? "";
  const featured = searchParams.get("featured") === "true";
  const id = searchParams.get("id") ?? "";

  const data = teamData as Record<string, unknown[]>;

  // Retour d'un membre spécifique
  if (id) {
    const all = Object.values(data).flat() as Array<Record<string, unknown>>;
    const member = all.find((m) => m.id === id);
    if (!member)
      return NextResponse.json(
        { error: "Membre introuvable." },
        { status: 404 },
      );
    return NextResponse.json({ member }, { status: 200, headers: rlHeaders });
  }

  // Filtrage par groupe
  let result: Record<string, unknown[]> = {};

  if (group && data[group]) {
    result = { [group]: data[group] as Record<string, unknown>[] };
  } else {
    result = data as Record<string, unknown[]>;
  }

  // Filtre department / featured
  if (department || featured) {
    for (const key of Object.keys(result)) {
      let items = result[key] as Array<Record<string, unknown>>;
      if (department)
        items = items.filter(
          (m) =>
            (m.department as string)?.toLowerCase() ===
            department.toLowerCase(),
        );
      if (featured) items = items.filter((m) => m.featured === true);
      result[key] = items;
    }
  }

  return NextResponse.json(
    { team: result, total: Object.values(result).flat().length },
    { status: 200, headers: rlHeaders },
  );
}
