"use client";

/**
 * Page — Admin / Analytiques
 * Route: /admin/analytics
 * Sections :
 * - KPIs temps réel (visiteurs, pages vues, rebond, durée)
 * - Graphiques d'audience (7j, 30j, 90j, 1an)
 * - Top pages visitées
 * - Sources de trafic (donut chart)
 * - Couverture géographique Bénin (tableau + barre)
 * - Comportement utilisateur (scroll depth, device, browser)
 * - Téléchargements les plus populaires
 * - Tableau de bord newsletter (taux d'ouverture)
 */

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart2,
  Users,
  Eye,
  Clock,
  MousePointerClick,
  Download,
  Mail,
  Globe2,
  Smartphone,
  Monitor,
  Tablet,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Map,
  FileText,
  Activity,
  Share2,
  Minus,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Period = "7j" | "30j" | "90j" | "1an";

interface Metric {
  label: string;
  value: number;
  unit?: string;
  trend: number; // %
  icon: React.ElementType;
  color: string;
  bg: string;
  format?: "number" | "percent" | "duration" | "compact";
}

// ─── Génération de données démo ───────────────────────────────────────────────
function generateDailyData(
  days: number,
  baseVisitors: number,
  variance: number,
) {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    const v = Math.round(
      baseVisitors +
        Math.sin(i * 0.4) * variance +
        (Math.random() - 0.5) * variance * 0.5,
    );
    const pv = Math.round(v * (2.1 + Math.random() * 0.8));
    const dl = Math.round(v * (0.08 + Math.random() * 0.06));
    return {
      date: date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
      }),
      visitors: Math.max(20, v),
      pageViews: Math.max(40, pv),
      downloads: Math.max(0, dl),
    };
  });
}

const PERIOD_DAYS: Record<Period, number> = {
  "7j": 7,
  "30j": 30,
  "90j": 90,
  "1an": 365,
};

const CHART_DATA: Record<Period, ReturnType<typeof generateDailyData>> = {
  "7j": generateDailyData(7, 160, 60),
  "30j": generateDailyData(30, 145, 55),
  "90j": generateDailyData(90, 130, 50),
  "1an": generateDailyData(365, 110, 45),
};

const TOP_PAGES = [
  {
    path: "/",
    title: "Accueil",
    views: 4821,
    bounce: 32,
    duration: "2m 14s",
    trend: +12,
  },
  {
    path: "/domains",
    title: "Domaines d'Intervention",
    views: 2347,
    bounce: 28,
    duration: "3m 42s",
    trend: +8,
  },
  {
    path: "/projects",
    title: "Nos Projets",
    views: 1983,
    bounce: 35,
    duration: "2m 58s",
    trend: +15,
  },
  {
    path: "/about/history",
    title: "Notre Histoire",
    views: 1456,
    bounce: 41,
    duration: "4m 10s",
    trend: +3,
  },
  {
    path: "/resources/publications",
    title: "Publications",
    views: 1238,
    bounce: 22,
    duration: "5m 03s",
    trend: +21,
  },
  {
    path: "/contact",
    title: "Contact",
    views: 987,
    bounce: 29,
    duration: "1m 47s",
    trend: -4,
  },
  {
    path: "/blog",
    title: "Blog",
    views: 876,
    bounce: 38,
    duration: "3m 22s",
    trend: +6,
  },
  {
    path: "/work-with-us/jobs",
    title: "Offres d'Emploi",
    views: 754,
    bounce: 19,
    duration: "4m 31s",
    trend: +34,
  },
  {
    path: "/about/organization",
    title: "Notre Organisation",
    views: 643,
    bounce: 44,
    duration: "2m 05s",
    trend: -2,
  },
  {
    path: "/impact",
    title: "Notre Impact",
    views: 612,
    bounce: 25,
    duration: "3m 58s",
    trend: +18,
  },
];

const TRAFFIC_SOURCES = [
  { label: "Recherche organique", value: 42, color: "#2d6a2d" },
  { label: "Accès direct", value: 28, color: "#4a7c59" },
  { label: "Réseaux sociaux", value: 15, color: "#e8500a" },
  { label: "Sites référents", value: 10, color: "#f59e0b" },
  { label: "Email / Newsletter", value: 5, color: "#8b5cf6" },
];

const GEO_DATA = [
  { dept: "Atlantique / Cotonou", visitors: 3421, pct: 34.2 },
  { dept: "Borgou", visitors: 2156, pct: 21.6 },
  { dept: "Zou", visitors: 1245, pct: 12.5 },
  { dept: "Mono / Couffo", visitors: 987, pct: 9.9 },
  { dept: "Atacora / Donga", visitors: 832, pct: 8.3 },
  { dept: "Alibori", visitors: 654, pct: 6.5 },
  { dept: "Plateau / Ouémé", residents: 421, visitors: 421, pct: 4.2 },
  { dept: "Collines", visitors: 280, pct: 2.8 },
];

const DEVICE_DATA = [
  { type: "Mobile", icon: Smartphone, value: 64, color: "bg-primary-500" },
  { type: "Desktop", icon: Monitor, value: 29, color: "bg-blue-500" },
  { type: "Tablette", icon: Tablet, value: 7, color: "bg-orange-500" },
];

const TOP_DOWNLOADS = [
  {
    name: "Rapport Annuel 2023",
    type: "PDF",
    downloads: 847,
    size: "3.2 Mo",
    trend: +23,
  },
  {
    name: "Guide Technique Maraîchage",
    type: "PDF",
    downloads: 612,
    size: "1.8 Mo",
    trend: +11,
  },
  {
    name: "Rapport Bilan 2022",
    type: "PDF",
    downloads: 489,
    size: "2.9 Mo",
    trend: -5,
  },
  {
    name: "Étude Impact Genre 2023",
    type: "PDF",
    downloads: 324,
    size: "2.1 Mo",
    trend: +18,
  },
  {
    name: "Manuel Alphabétisation",
    type: "PDF",
    downloads: 287,
    size: "4.5 Mo",
    trend: +7,
  },
];

const NEWSLETTER_STATS = {
  subscribers: 847,
  openRate: 38.4,
  clickRate: 12.7,
  unsubscribeRate: 0.8,
  lastCampaign: {
    subject: "Newsletter Juin 2024 — Bilan PROCASE II",
    date: "15 Jun 2024",
    sent: 820,
    opened: 315,
    clicked: 104,
  },
};

// ─── Utilitaires ──────────────────────────────────────────────────────────────
function formatValue(value: number, format?: Metric["format"]): string {
  switch (format) {
    case "compact":
      return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toString();
    case "percent":
      return `${value.toFixed(1)}%`;
    case "duration":
      const m = Math.floor(value / 60);
      const s = value % 60;
      return `${m}m ${s.toString().padStart(2, "0")}s`;
    default:
      return value.toLocaleString("fr-FR");
  }
}

// ─── Composant Graphique Barres ───────────────────────────────────────────────
function BarChart({
  data,
  metric,
  color,
  height = 180,
}: {
  data: ReturnType<typeof generateDailyData>;
  metric: "visitors" | "pageViews" | "downloads";
  color: string;
  height?: number;
}) {
  const max = Math.max(...data.map((d) => d[metric]));
  const step = Math.ceil(data.length / 12); // show ~12 labels max

  return (
    <div className="relative" style={{ height }}>
      <div className="absolute inset-0 flex items-end gap-0.5 md:gap-1">
        {data.map((d, i) => {
          const pct = max > 0 ? (d[metric] / max) * 100 : 0;
          return (
            <div
              key={i}
              className="flex-1 flex flex-col items-center gap-0.5 h-full justify-end group relative"
            >
              {/* Tooltip */}
              <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                <div className="font-bold">{d[metric].toLocaleString()}</div>
                <div className="text-gray-400">{d.date}</div>
              </div>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${pct}%` }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.008,
                  ease: "easeOut",
                }}
                className={`w-full rounded-t-sm ${color} opacity-80 group-hover:opacity-100 transition-opacity min-h-[2px]`}
              />
            </div>
          );
        })}
      </div>
      {/* X axis labels */}
      <div className="absolute -bottom-5 inset-x-0 flex gap-0.5 md:gap-1">
        {data.map((d, i) => (
          <div key={i} className="flex-1 text-center">
            {i % step === 0 && (
              <span className="text-2xs text-gray-400 truncate block">
                {d.date.split(" ")[0]}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Composant Donut Chart (sources trafic) ───────────────────────────────────
function DonutChart({ data }: { data: typeof TRAFFIC_SOURCES }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const total = data.reduce((s, d) => s + d.value, 0);
  let cumAngle = -90;

  const segments = data.map((d, i) => {
    const angle = (d.value / total) * 360;
    const startAngle = cumAngle;
    cumAngle += angle;
    const endAngle = cumAngle;
    const r = 60;
    const cx = 80,
      cy = 80;
    const toRad = (a: number) => (a * Math.PI) / 180;
    const x1 = cx + r * Math.cos(toRad(startAngle));
    const y1 = cy + r * Math.sin(toRad(startAngle));
    const x2 = cx + r * Math.cos(toRad(endAngle));
    const y2 = cy + r * Math.sin(toRad(endAngle));
    const large = angle > 180 ? 1 : 0;
    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
    return { ...d, path, angle, i };
  });

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative shrink-0">
        <svg width="160" height="160" viewBox="0 0 160 160">
          {segments.map((seg) => (
            <path
              key={seg.i}
              d={seg.path}
              fill={seg.color}
              stroke="white"
              strokeWidth="2"
              className="transition-opacity cursor-pointer"
              style={{
                opacity: hovered === null || hovered === seg.i ? 1 : 0.4,
              }}
              onMouseEnter={() => setHovered(seg.i)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
          <circle cx="80" cy="80" r="38" fill="white" />
          <text
            x="80"
            y="76"
            textAnchor="middle"
            className="text-sm font-bold"
            fontSize="18"
            fill="#1f2937"
          >
            {hovered !== null ? `${data[hovered].value}%` : `${total}%`}
          </text>
          <text x="80" y="94" textAnchor="middle" fontSize="10" fill="#6b7280">
            {hovered !== null ? data[hovered].label.split(" ")[0] : "Total"}
          </text>
        </svg>
      </div>
      <div className="space-y-2 flex-1">
        {data.map((d, i) => (
          <div
            key={i}
            className="flex items-center gap-2 cursor-pointer group"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: d.color }}
            />
            <span
              className={`text-xs flex-1 transition-colors ${hovered === i ? "text-gray-900 font-medium" : "text-gray-600"}`}
            >
              {d.label}
            </span>
            <span className="text-xs font-bold text-gray-800">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Composant Tendance ───────────────────────────────────────────────────────
function Trend({ value }: { value: number }) {
  if (value === 0)
    return (
      <span className="flex items-center gap-0.5 text-gray-500 text-xs">
        <Minus className="w-3 h-3" /> 0%
      </span>
    );
  const isUp = value > 0;
  return (
    <span
      className={`flex items-center gap-0.5 text-xs font-medium ${isUp ? "text-green-600" : "text-red-500"}`}
    >
      {isUp ? (
        <ArrowUpRight className="w-3.5 h-3.5" />
      ) : (
        <ArrowDownRight className="w-3.5 h-3.5" />
      )}
      {isUp ? "+" : ""}
      {value}%
    </span>
  );
}

// ─── Page Principale ──────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("30j");
  const [chartMetric, setChartMetric] = useState<
    "visitors" | "pageViews" | "downloads"
  >("visitors");
  const [lastRefresh] = useState(
    new Date().toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  );

  const chartData = CHART_DATA[period];
  const periodDays = PERIOD_DAYS[period];

  // Calcul KPIs selon la période
  const totalVisitors = useMemo(
    () => chartData.reduce((s, d) => s + d.visitors, 0),
    [chartData],
  );
  const totalPageViews = useMemo(
    () => chartData.reduce((s, d) => s + d.pageViews, 0),
    [chartData],
  );
  const totalDownloads = useMemo(
    () => chartData.reduce((s, d) => s + d.downloads, 0),
    [chartData],
  );
  const avgSession = 147; // secondes

  const METRICS: Metric[] = [
    {
      label: "Visiteurs uniques",
      value: totalVisitors,
      trend: +14.2,
      icon: Users,
      color: "text-primary-600",
      bg: "bg-primary-50",
      format: "compact",
    },
    {
      label: "Pages vues",
      value: totalPageViews,
      trend: +8.7,
      icon: Eye,
      color: "text-blue-600",
      bg: "bg-blue-50",
      format: "compact",
    },
    {
      label: "Téléchargements",
      value: totalDownloads,
      trend: +21.3,
      icon: Download,
      color: "text-orange-600",
      bg: "bg-orange-50",
      format: "compact",
    },
    {
      label: "Taux de rebond",
      value: 34.8,
      unit: "%",
      trend: -3.1,
      icon: MousePointerClick,
      color: "text-purple-600",
      bg: "bg-purple-50",
      format: "percent",
    },
    {
      label: "Durée session",
      value: avgSession,
      trend: +5.4,
      icon: Clock,
      color: "text-green-600",
      bg: "bg-green-50",
      format: "duration",
    },
    {
      label: "Visiteurs actifs",
      value: 23,
      trend: +2,
      icon: Activity,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-primary-600" />
            Tableau de Bord Analytiques
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Audience, comportement et performances — Dernière mise à jour :{" "}
            {lastRefresh}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Sélecteur de période */}
          <div className="flex items-center bg-gray-100 rounded-xl p-1">
            {(["7j", "30j", "90j", "1an"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  period === p
                    ? "bg-white text-primary-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors bg-white">
            <RefreshCw className="w-3.5 h-3.5" />
            Actualiser
          </button>
        </div>
      </div>

      {/* ── KPIs ── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {METRICS.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-4"
          >
            <div className="flex items-start justify-between mb-2">
              <div
                className={`w-9 h-9 ${m.bg} rounded-xl flex items-center justify-center`}
              >
                <m.icon className={`w-4 h-4 ${m.color}`} />
              </div>
              <Trend value={m.trend} />
            </div>
            <div className="mt-1">
              <p className="text-2xl font-bold text-gray-900">
                {formatValue(m.value, m.format)}
              </p>
              <p className="text-xs text-gray-500 mt-0.5 leading-tight">
                {m.label}
              </p>
              <p className="text-2xs text-gray-400 mt-0.5">vs. période préc.</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Graphique principal ── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="font-bold text-gray-900">Évolution de l'audience</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {periodDays} derniers jours — {chartData.length} points de données
            </p>
          </div>
          <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
            {[
              {
                key: "visitors",
                label: "Visiteurs",
                color: "text-primary-600",
              },
              { key: "pageViews", label: "Pages vues", color: "text-blue-600" },
              {
                key: "downloads",
                label: "Télécharg.",
                color: "text-orange-600",
              },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setChartMetric(key as typeof chartMetric)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  chartMetric === key
                    ? "bg-white shadow-sm text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="pb-6">
          <BarChart
            data={chartData}
            metric={chartMetric}
            color={
              chartMetric === "visitors"
                ? "bg-primary-500"
                : chartMetric === "pageViews"
                  ? "bg-blue-400"
                  : "bg-orange-400"
            }
            height={200}
          />
        </div>
      </div>

      {/* ── 2 colonnes : Top pages + Sources trafic ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Top pages */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b flex items-center justify-between">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-primary-600" />
              Pages les plus visitées
            </h2>
            <span className="text-xs text-gray-400">{period}</span>
          </div>
          <div className="divide-y divide-gray-50">
            {TOP_PAGES.map((page, i) => {
              const maxViews = TOP_PAGES[0].views;
              const pct = (page.views / maxViews) * 100;
              return (
                <motion.div
                  key={page.path}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="px-5 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-400 w-4">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {page.title}
                          </p>
                          <p className="text-xs text-gray-400 font-mono truncate">
                            {page.path}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 ml-2">
                          <span className="text-sm font-bold text-gray-800">
                            {page.views.toLocaleString()}
                          </span>
                          <Trend value={page.trend} />
                        </div>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.6, delay: i * 0.05 }}
                          className="h-full bg-primary-400 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Sources trafic */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-primary-600" />
              Sources de trafic
            </h2>
            <DonutChart data={TRAFFIC_SOURCES} />
          </div>

          {/* Appareils */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-blue-600" />
              Appareils utilisés
            </h2>
            <div className="space-y-3">
              {DEVICE_DATA.map((d) => (
                <div key={d.type}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <d.icon className="w-3.5 h-3.5 text-gray-500" />
                      <span className="text-sm text-gray-700">{d.type}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                      {d.value}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${d.value}%` }}
                      transition={{ duration: 0.6 }}
                      className={`h-full rounded-full ${d.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Couverture géographique ── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <Map className="w-4 h-4 text-primary-600" />
            Couverture géographique — Bénin
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Distribution des visiteurs par département
          </p>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GEO_DATA.map((d, i) => (
              <motion.div
                key={d.dept}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 text-xs font-bold text-gray-400 text-right shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700 truncate">
                      {d.dept}
                    </span>
                    <span className="text-sm font-bold text-gray-900 ml-2 shrink-0">
                      {d.visitors.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${d.pct}%` }}
                      transition={{ duration: 0.5, delay: i * 0.04 }}
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: `hsl(${140 - i * 10}, ${60 - i * 3}%, ${40 + i * 3}%)`,
                      }}
                    />
                  </div>
                </div>
                <div className="text-xs text-gray-500 w-10 text-right shrink-0">
                  {d.pct}%
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 2 colonnes bas : Téléchargements + Newsletter ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top téléchargements */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Download className="w-4 h-4 text-orange-600" />
              Documents les plus téléchargés
            </h2>
          </div>
          <div className="divide-y divide-gray-50">
            {TOP_DOWNLOADS.map((d, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {d.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {d.type} • {d.size}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-gray-800">
                    {d.downloads.toLocaleString()}
                  </p>
                  <Trend value={d.trend} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter stats */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-purple-600" />
              Performance Newsletter
            </h2>
          </div>
          <div className="p-5 space-y-4">
            {/* KPIs newsletter */}
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: "Abonnés actifs",
                  value: `${NEWSLETTER_STATS.subscribers}`,
                  color: "text-purple-700",
                  bg: "bg-purple-50",
                },
                {
                  label: "Taux d'ouverture",
                  value: `${NEWSLETTER_STATS.openRate}%`,
                  color: "text-green-700",
                  bg: "bg-green-50",
                },
                {
                  label: "Taux de clic",
                  value: `${NEWSLETTER_STATS.clickRate}%`,
                  color: "text-blue-700",
                  bg: "bg-blue-50",
                },
                {
                  label: "Désinscription",
                  value: `${NEWSLETTER_STATS.unsubscribeRate}%`,
                  color: "text-red-700",
                  bg: "bg-red-50",
                },
              ].map(({ label, value, color, bg }) => (
                <div key={label} className={`${bg} rounded-xl p-3 text-center`}>
                  <p className={`text-xl font-bold ${color}`}>{value}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Dernière campagne */}
            <div className="border border-gray-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-800">
                  Dernière campagne
                </h3>
                <span className="text-xs text-gray-400">
                  {NEWSLETTER_STATS.lastCampaign.date}
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-3 italic">
                "{NEWSLETTER_STATS.lastCampaign.subject}"
              </p>
              {[
                {
                  label: "Envoyés",
                  value: NEWSLETTER_STATS.lastCampaign.sent,
                  pct: 100,
                },
                {
                  label: "Ouverts",
                  value: NEWSLETTER_STATS.lastCampaign.opened,
                  pct:
                    (NEWSLETTER_STATS.lastCampaign.opened /
                      NEWSLETTER_STATS.lastCampaign.sent) *
                    100,
                },
                {
                  label: "Cliqués",
                  value: NEWSLETTER_STATS.lastCampaign.clicked,
                  pct:
                    (NEWSLETTER_STATS.lastCampaign.clicked /
                      NEWSLETTER_STATS.lastCampaign.sent) *
                    100,
                },
              ].map(({ label, value, pct }) => (
                <div key={label} className="mb-2">
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-gray-600">{label}</span>
                    <span className="font-medium text-gray-800">
                      {value} ({pct.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-purple-400 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
