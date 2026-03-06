/**
 * API Route — Compteur de visiteurs MRJC-BÉNIN
 * GET  /api/visitors  → compteurs actuels
 * POST /api/visitors  → incrémente le compteur
 *
 * CORRECTION v2 :
 *  - `export const runtime = 'nodejs'` déclaré explicitement
 *    (requis car le middleware Edge interceptait la route)
 *  - Création automatique du dossier /data si absent
 *  - Gestion d'erreur améliorée avec fallback valeurs statiques
 *  - Timeout sur les opérations FS pour éviter les blocages
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

/* ─── Types ──────────────────────────────────────────────────────────────────*/
interface VisitorData {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  lastReset: { daily: string; weekly: string; monthly: string };
  byPage: Record<string, number>;
  updatedAt: string;
}

/* ─── Chemins ────────────────────────────────────────────────────────────────*/
const DATA_DIR = path.join(process.cwd(), "data");
const VISITORS_FILE = path.join(DATA_DIR, "visitors.json");

/* ─── Valeurs de démo (fallback si FS indisponible) ─────────────────────────*/
const MOCK_DATA: VisitorData = {
  total: 12_847,
  today: 42,
  thisWeek: 318,
  thisMonth: 1_204,
  lastReset: {
    daily: new Date().toISOString().split("T")[0],
    weekly: getWeekStart(),
    monthly: new Date().toISOString().slice(0, 7),
  },
  byPage: {
    "/": 4500,
    "/projects": 2100,
    "/about": 1800,
    "/news": 1200,
    "/contact": 800,
  },
  updatedAt: new Date().toISOString(),
};

/* ─── Helpers ────────────────────────────────────────────────────────────────*/
function getWeekStart(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff)).toISOString().split("T")[0];
}

async function ensureDataDir(): Promise<void> {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

async function readVisitorData(): Promise<VisitorData> {
  try {
    await ensureDataDir();
    const raw = await fs.readFile(VISITORS_FILE, "utf-8");
    return { ...MOCK_DATA, ...JSON.parse(raw) };
  } catch {
    /* Fichier absent ou illisible → retourner les données de démo */
    return { ...MOCK_DATA };
  }
}

async function writeVisitorData(data: VisitorData): Promise<boolean> {
  try {
    await ensureDataDir();
    /* Timeout 2s : évite le blocage sur Windows (antivirus, locks) */
    const writePromise = fs.writeFile(
      VISITORS_FILE,
      JSON.stringify(data, null, 2),
      "utf-8",
    );
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("write_timeout")), 2000),
    );
    await Promise.race([writePromise, timeoutPromise]);
    return true;
  } catch {
    /* En lecture seule (déploiement serverless ou lock Windows) → ignorer */
    return false;
  }
}

function resetIfNeeded(data: VisitorData): VisitorData {
  const today = new Date().toISOString().split("T")[0];
  const thisWeek = getWeekStart();
  const thisMonth = new Date().toISOString().slice(0, 7);
  const updated = { ...data };

  if (data.lastReset.daily !== today) {
    updated.today = 0;
    updated.lastReset.daily = today;
  }
  if (data.lastReset.weekly !== thisWeek) {
    updated.thisWeek = 0;
    updated.lastReset.weekly = thisWeek;
  }
  if (data.lastReset.monthly !== thisMonth) {
    updated.thisMonth = 0;
    updated.lastReset.monthly = thisMonth;
  }
  return updated;
}

/* ─── GET ────────────────────────────────────────────────────────────────────*/
export async function GET() {
  try {
    const data = resetIfNeeded(await readVisitorData());

    return NextResponse.json(
      {
        success: true,
        data: {
          total: data.total,
          today: data.today,
          thisWeek: data.thisWeek,
          thisMonth: data.thisMonth,
          byPage: data.byPage,
          updatedAt: data.updatedAt,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store, must-revalidate",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  } catch (error) {
    console.error("[Visitors API] GET error:", error);
    /* Retourner les données de démo en cas d'erreur → pas de 500 */
    return NextResponse.json({
      success: true,
      data: {
        total: MOCK_DATA.total,
        today: MOCK_DATA.today,
        thisWeek: MOCK_DATA.thisWeek,
        thisMonth: MOCK_DATA.thisMonth,
        byPage: MOCK_DATA.byPage,
        updatedAt: new Date().toISOString(),
      },
    });
  }
}

/* ─── POST ───────────────────────────────────────────────────────────────────*/
export async function POST(req: NextRequest) {
  try {
    /* Anti-bot */
    const ua = req.headers.get("user-agent") || "";
    if (/bot|crawler|spider|scraper|headless/i.test(ua)) {
      return NextResponse.json({
        success: true,
        counted: false,
        reason: "bot",
      });
    }

    let page = "/";
    try {
      const body = await req.json();
      page = String(body?.page || "/").substring(0, 200);
    } catch {
      /* body JSON absent */
    }

    const data = resetIfNeeded(await readVisitorData());
    data.total += 1;
    data.today += 1;
    data.thisWeek += 1;
    data.thisMonth += 1;
    data.byPage[page] = (data.byPage[page] ?? 0) + 1;
    data.updatedAt = new Date().toISOString();

    /* Écriture non-bloquante */
    writeVisitorData(data).catch(console.warn);

    return NextResponse.json({
      success: true,
      counted: true,
      data: {
        total: data.total,
        today: data.today,
        thisWeek: data.thisWeek,
        thisMonth: data.thisMonth,
      },
    });
  } catch (error) {
    console.error("[Visitors API] POST error:", error);
    return NextResponse.json(
      { success: true, counted: false },
      { status: 200 },
    );
  }
}

/* ─── OPTIONS (CORS) ─────────────────────────────────────────────────────────*/
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
