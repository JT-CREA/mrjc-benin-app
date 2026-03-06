/**
 * GET /api/admin/stats
 * Dashboard admin — métriques agrégées
 * Requiert : cookie mrjc_admin_token valide (vérifié par middleware)
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/admin/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface DashboardStats {
  visitors: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
    trend: number; // % évolution vs semaine précédente
  };
  messages: {
    total: number;
    unread: number;
    today: number;
  };
  newsletter: {
    subscribers: number;
    active: number;
    unsubscribed: number;
    thisMonth: number;
  };
  downloads: {
    total: number;
    thisMonth: number;
    topResources: Array<{ title: string; count: number }>;
  };
  feedback: {
    total: number;
    averageRating: number;
    byType: Record<string, number>;
    satisfaction: { positive: number; neutral: number; negative: number };
  };
  projects: {
    total: number;
    ongoing: number;
    completed: number;
  };
}

async function getStatsFromDB(): Promise<Partial<DashboardStats>> {
  const { connectToDatabase, COLLECTIONS } = await import("@/lib/db/mongodb");
  const { db } = await connectToDatabase();

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfDay);
  startOfWeek.setDate(startOfDay.getDate() - 7);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const prevWeekStart = new Date(startOfWeek);
  prevWeekStart.setDate(startOfWeek.getDate() - 7);

  const [
    visitorsTotal,
    visitorsToday,
    visitorsThisWeek,
    visitorsThisMonth,
    visitorsPrevWeek,
    messagesTotal,
    messagesUnread,
    messagesToday,
    newsletterAll,
    downloadsTotal,
    downloadsThisMonth,
    topDownloads,
    feedbackAll,
    feedbackByType,
  ] = await Promise.allSettled([
    // Visitors
    db.collection(COLLECTIONS.VISITORS).countDocuments(),
    db
      .collection(COLLECTIONS.VISITORS)
      .countDocuments({ createdAt: { $gte: startOfDay } }),
    db
      .collection(COLLECTIONS.VISITORS)
      .countDocuments({ createdAt: { $gte: startOfWeek } }),
    db
      .collection(COLLECTIONS.VISITORS)
      .countDocuments({ createdAt: { $gte: startOfMonth } }),
    db
      .collection(COLLECTIONS.VISITORS)
      .countDocuments({ createdAt: { $gte: prevWeekStart, $lt: startOfWeek } }),
    // Messages
    db.collection(COLLECTIONS.MESSAGES).countDocuments(),
    db.collection(COLLECTIONS.MESSAGES).countDocuments({ status: "new" }),
    db
      .collection(COLLECTIONS.MESSAGES)
      .countDocuments({ createdAt: { $gte: startOfDay } }),
    // Newsletter
    db
      .collection(COLLECTIONS.NEWSLETTER)
      .find({}, { projection: { status: 1, createdAt: 1 } })
      .toArray(),
    // Downloads
    db.collection(COLLECTIONS.DOWNLOADS).countDocuments(),
    db
      .collection(COLLECTIONS.DOWNLOADS)
      .countDocuments({ downloadedAt: { $gte: startOfMonth } }),
    db
      .collection(COLLECTIONS.DOWNLOADS)
      .aggregate([
        { $group: { _id: "$resourceTitle", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $project: { title: "$_id", count: 1, _id: 0 } },
      ])
      .toArray(),
    // Feedback
    db.collection("feedback").find({}).toArray(),
    db
      .collection("feedback")
      .aggregate([{ $group: { _id: "$type", count: { $sum: 1 } } }])
      .toArray(),
  ]);

  function val<T>(r: PromiseSettledResult<T>, fallback: T): T {
    return r.status === "fulfilled" ? r.value : fallback;
  }

  const visitors_this_week = val(visitorsThisWeek, 0) as number;
  const visitors_prev_week = val(visitorsPrevWeek, 0) as number;
  const trend =
    visitors_prev_week === 0
      ? 100
      : Math.round(
          ((visitors_this_week - visitors_prev_week) / visitors_prev_week) *
            100,
        );

  const nlData = val(newsletterAll, []) as Array<Record<string, unknown>>;
  const nlActive = nlData.filter((s) => s.status === "active").length;
  const nlUnsub = nlData.filter((s) => s.status === "unsubscribed").length;
  const nlMonth = nlData.filter(
    (s) => s.createdAt instanceof Date && s.createdAt >= startOfMonth,
  ).length;

  const feedbackData = val(feedbackAll, []) as Array<Record<string, unknown>>;
  const ratings = feedbackData
    .filter((f) => typeof f.rating === "number")
    .map((f) => f.rating as number);
  const avgRating =
    ratings.length > 0
      ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) /
        10
      : 0;
  const positive = feedbackData.filter((f) => (f.rating as number) >= 4).length;
  const negative = feedbackData.filter((f) => (f.rating as number) <= 2).length;
  const neutral = feedbackData.length - positive - negative;

  const fByType: Record<string, number> = {};
  (val(feedbackByType, []) as Array<{ _id: string; count: number }>).forEach(
    (row) => {
      if (row._id) fByType[row._id] = row.count;
    },
  );

  return {
    visitors: {
      total: val(visitorsTotal, 0) as number,
      today: val(visitorsToday, 0) as number,
      thisWeek: visitors_this_week,
      thisMonth: val(visitorsThisMonth, 0) as number,
      trend,
    },
    messages: {
      total: val(messagesTotal, 0) as number,
      unread: val(messagesUnread, 0) as number,
      today: val(messagesToday, 0) as number,
    },
    newsletter: {
      subscribers: nlData.length,
      active: nlActive,
      unsubscribed: nlUnsub,
      thisMonth: nlMonth,
    },
    downloads: {
      total: val(downloadsTotal, 0) as number,
      thisMonth: val(downloadsThisMonth, 0) as number,
      topResources: val(topDownloads, []) as Array<{
        title: string;
        count: number;
      }>,
    },
    feedback: {
      total: feedbackData.length,
      averageRating: avgRating,
      byType: fByType,
      satisfaction: { positive, neutral, negative },
    },
  };
}

function getMockStats(): DashboardStats {
  return {
    visitors: {
      total: 1247,
      today: 23,
      thisWeek: 189,
      thisMonth: 642,
      trend: 12,
    },
    messages: { total: 87, unread: 5, today: 2 },
    newsletter: {
      subscribers: 324,
      active: 298,
      unsubscribed: 26,
      thisMonth: 18,
    },
    downloads: {
      total: 1563,
      thisMonth: 234,
      topResources: [
        { title: "Rapport Annuel 2024", count: 412 },
        { title: "Guide Insertion Professionnelle", count: 287 },
        { title: "Bilan Projet Éducation", count: 198 },
      ],
    },
    feedback: {
      total: 45,
      averageRating: 4.2,
      byType: { satisfaction: 28, suggestion: 12, bug: 5 },
      satisfaction: { positive: 35, neutral: 7, negative: 3 },
    },
    projects: { total: 12, ongoing: 7, completed: 5 },
  };
}

export async function GET(request: NextRequest) {
  // Vérification du token admin
  const token = request.cookies.get("mrjc_admin_token")?.value;
  if (!token || !verifyAdminToken(token)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  try {
    let stats: Partial<DashboardStats> = {};

    if (process.env.MONGODB_URI) {
      stats = await getStatsFromDB();
    }

    // Compléter avec mock si données manquantes
    const mock = getMockStats();
    const result: DashboardStats = {
      visitors: stats.visitors ?? mock.visitors,
      messages: stats.messages ?? mock.messages,
      newsletter: stats.newsletter ?? mock.newsletter,
      downloads: stats.downloads ?? mock.downloads,
      feedback: stats.feedback ?? mock.feedback,
      projects: stats.projects ?? mock.projects,
    };

    return NextResponse.json(
      { stats: result, generatedAt: new Date().toISOString() },
      { status: 200 },
    );
  } catch (err) {
    console.error("[Admin Stats] Erreur:", err);
    return NextResponse.json(
      { error: "Erreur interne du serveur." },
      { status: 500 },
    );
  }
}
