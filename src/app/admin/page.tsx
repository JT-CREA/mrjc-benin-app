"use client";

/**
 * Page — Admin Dashboard
 * Route: /admin
 * Vue d'ensemble complète avec :
 * - KPIs clés (projets, articles, visiteurs, messages)
 * - Graphique d'activité 7 jours
 * - Activités récentes
 * - Raccourcis rapides
 * - Statut du site
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FolderOpen,
  Users,
  MessageSquare,
  Eye,
  Download,
  TrendingUp,
  Globe2,
  BookOpen,
  FileText,
  Mail,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Activity,
  ArrowRight,
  Target,
} from "lucide-react";
import StatsCard from "@/components/admin/StatsCard";
import Link from "next/link";

// ─── Données démo ─────────────────────────────────────────────────────────────
const ACTIVITY_DATA = [
  { day: "Lun", visitors: 124, downloads: 18 },
  { day: "Mar", visitors: 189, downloads: 24 },
  { day: "Mer", visitors: 156, downloads: 31 },
  { day: "Jeu", visitors: 203, downloads: 19 },
  { day: "Ven", visitors: 178, downloads: 28 },
  { day: "Sam", visitors: 92, downloads: 12 },
  { day: "Dim", visitors: 68, downloads: 9 },
];

const RECENT_ACTIVITIES = [
  {
    icon: FolderOpen,
    color: "bg-blue-100 text-blue-600",
    text: 'Projet "PROCASE II Phase 2" mis à jour',
    time: "Il y a 12 min",
    type: "update",
  },
  {
    icon: MessageSquare,
    color: "bg-orange-100 text-orange-600",
    text: "3 nouveaux messages de contact reçus",
    time: "Il y a 35 min",
    type: "message",
  },
  {
    icon: Mail,
    color: "bg-green-100 text-green-600",
    text: "12 nouveaux abonnés à la newsletter",
    time: "Il y a 1h",
    type: "subscribe",
  },
  {
    icon: BookOpen,
    color: "bg-purple-100 text-purple-600",
    text: 'Article "Récoltes 2024" publié',
    time: "Il y a 2h",
    type: "publish",
  },
  {
    icon: Download,
    color: "bg-primary-100 text-primary-600",
    text: "Rapport Annuel 2023 téléchargé 47 fois",
    time: "Il y a 3h",
    type: "download",
  },
  {
    icon: Users,
    color: "bg-pink-100 text-pink-600",
    text: 'Fiche équipe "Dr. Aminou" ajoutée',
    time: "Il y a 1 jour",
    type: "add",
  },
];

const QUICK_ACTIONS = [
  {
    icon: Plus,
    label: "Nouvel article",
    href: "/admin/blog?action=new",
    color: "bg-purple-500 hover:bg-purple-600",
  },
  {
    icon: Plus,
    label: "Nouveau projet",
    href: "/admin/projects?action=new",
    color: "bg-blue-500 hover:bg-blue-600",
  },
  {
    icon: Plus,
    label: "Nouvelle actu",
    href: "/admin/news?action=new",
    color: "bg-red-500 hover:bg-red-600",
  },
  {
    icon: Plus,
    label: "Ajouter ressource",
    href: "/admin/resources?action=new",
    color: "bg-green-500 hover:bg-green-600",
  },
];

const SITE_STATUS = [
  { label: "Site web", status: "ok", latency: "142ms" },
  { label: "API Contact", status: "ok", latency: "89ms" },
  { label: "Newsletter", status: "ok", latency: "234ms" },
  { label: "Stockage médias", status: "warning", latency: "78%" },
];

// ─── Mini chart SVG ───────────────────────────────────────────────────────────
function MiniBarChart({
  data,
  valueKey,
}: {
  data: typeof ACTIVITY_DATA;
  valueKey: "visitors" | "downloads";
}) {
  const max = Math.max(...data.map((d) => d[valueKey]));
  const color = valueKey === "visitors" ? "#3B82F6" : "#10B981";

  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((d, i) => {
        const height = max > 0 ? (d[valueKey] / max) * 100 : 0;
        return (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              style={{ backgroundColor: color, minHeight: 2 }}
              className="w-full rounded-t-sm opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
              title={`${d.day}: ${d[valueKey]}`}
            />
            <span className="text-[9px] text-gray-400">{d.day}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [visitorData, setVisitorData] = useState({ total: 0, today: 0 });
  const [downloadData, setDownloadData] = useState({ total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/visitors").then((r) => r.json()),
      fetch("/api/downloads").then((r) => r.json()),
    ])
      .then(([v, d]) => {
        if (v.success) setVisitorData(v.data);
        if (d.success) setDownloadData(d.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            {new Date().toLocaleDateString("fr-FR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Site en ligne
          </span>
          <Link
            href="/"
            target="_blank"
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Voir le site →
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {[
          {
            title: "Visiteurs totaux",
            value: loading ? "..." : visitorData.total.toLocaleString("fr-FR"),
            trend: 12,
            icon: Eye,
            iconColor: "text-blue-600",
            iconBg: "bg-blue-50",
            href: "/admin/analytics",
          },
          {
            title: "Projets actifs",
            value: "18",
            trend: 5,
            icon: FolderOpen,
            iconColor: "text-primary-600",
            iconBg: "bg-primary-50",
            href: "/admin/projects",
          },
          {
            title: "Téléchargements",
            value: loading ? "..." : downloadData.total.toLocaleString("fr-FR"),
            trend: 23,
            icon: Download,
            iconColor: "text-green-600",
            iconBg: "bg-green-50",
            href: "/admin/resources",
          },
          {
            title: "Messages en attente",
            value: "7",
            trend: -2,
            icon: MessageSquare,
            iconColor: "text-orange-600",
            iconBg: "bg-orange-50",
            href: "/admin/messages",
          },
        ].map((card) => (
          <motion.div key={card.title} variants={itemVariants}>
            <StatsCard {...card} loading={loading} />
          </motion.div>
        ))}
      </motion.div>

      {/* Second row of KPIs */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {[
          {
            title: "Articles blog",
            value: "42",
            trend: 8,
            icon: BookOpen,
            iconColor: "text-purple-600",
            iconBg: "bg-purple-50",
            href: "/admin/blog",
          },
          {
            title: "Abonnés newsletter",
            value: "847",
            trend: 15,
            icon: Mail,
            iconColor: "text-pink-600",
            iconBg: "bg-pink-50",
            href: "/admin/newsletter",
          },
          {
            title: "Partenaires actifs",
            value: "35",
            trend: 3,
            icon: Users,
            iconColor: "text-teal-600",
            iconBg: "bg-teal-50",
            href: "/admin/partners",
          },
          {
            title: "Ressources publiées",
            value: "124",
            trend: 18,
            icon: FileText,
            iconColor: "text-amber-600",
            iconBg: "bg-amber-50",
            href: "/admin/resources",
          },
        ].map((card) => (
          <motion.div key={card.title} variants={itemVariants}>
            <StatsCard {...card} loading={false} />
          </motion.div>
        ))}
      </motion.div>

      {/* Charts + Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Visitor chart */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-800">
                Activité 7 derniers jours
              </h2>
              <p className="text-xs text-gray-400">
                Visiteurs et téléchargements
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                Visiteurs
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                Téléchargements
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Visiteurs
              </p>
              <MiniBarChart data={ACTIVITY_DATA} valueKey="visitors" />
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Téléchargements
              </p>
              <MiniBarChart data={ACTIVITY_DATA} valueKey="downloads" />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-gray-100 pt-4">
            {[
              {
                label: "Visiteurs auj.",
                value: visitorData.today || "—",
                icon: Eye,
              },
              { label: "Pages vues", value: "2 847", icon: Activity },
              { label: "Taux de rebond", value: "38%", icon: TrendingUp },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-lg font-bold text-gray-800">{value}</p>
                <p className="text-xs text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent activity */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
        >
          <h2 className="mb-4 text-base font-semibold text-gray-800">
            Activités récentes
          </h2>
          <ul className="space-y-3">
            {RECENT_ACTIVITIES.map((activity, i) => {
              const Icon = activity.icon;
              return (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <div className={`mt-0.5 rounded-lg p-1.5 ${activity.color}`}>
                    <Icon size={13} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-700 leading-snug">
                      {activity.text}
                    </p>
                    <p className="mt-0.5 text-[10px] text-gray-400">
                      {activity.time}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </ul>
          <Link
            href="/admin/analytics"
            className="mt-4 flex items-center gap-1 text-xs font-medium text-primary-600 hover:underline"
          >
            Voir toute l'activité <ArrowRight size={12} />
          </Link>
        </motion.div>
      </div>

      {/* Quick actions + Site status */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
        >
          <h2 className="mb-4 text-base font-semibold text-gray-800">
            Actions rapides
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.label} href={action.href}>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-2.5 rounded-xl p-3.5 text-sm font-medium text-white transition-colors ${action.color}`}
                  >
                    <Icon size={16} />
                    {action.label}
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Upcoming tasks */}
          <div className="mt-4 rounded-xl bg-amber-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-800">
              <Target size={14} />
              <span>Tâches en attente</span>
            </div>
            <ul className="space-y-1.5">
              {[
                { text: "Rapport annuel 2024 à publier", urgent: true },
                { text: "Mettre à jour 3 fiches projet", urgent: false },
                { text: "Répondre aux messages en attente (7)", urgent: true },
              ].map((task, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-xs text-amber-700"
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${task.urgent ? "bg-red-500" : "bg-amber-400"}`}
                  />
                  {task.text}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Site status */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
        >
          <h2 className="mb-4 text-base font-semibold text-gray-800">
            Statut du système
          </h2>
          <ul className="space-y-3">
            {SITE_STATUS.map((item) => (
              <li
                key={item.label}
                className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3"
              >
                <div className="flex items-center gap-2.5">
                  {item.status === "ok" ? (
                    <CheckCircle2 size={16} className="text-green-500" />
                  ) : item.status === "warning" ? (
                    <AlertTriangle size={16} className="text-amber-500" />
                  ) : (
                    <Clock size={16} className="text-red-500" />
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      item.status === "ok"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {item.status === "ok" ? "Opérationnel" : "Attention"}
                  </span>
                  <span className="text-xs text-gray-400">{item.latency}</span>
                </div>
              </li>
            ))}
          </ul>

          {/* Domain infos */}
          <div className="mt-4 rounded-xl border border-gray-100 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Globe2 size={14} className="text-primary-500" />
              <span>Informations domaine</span>
            </div>
            <div className="space-y-1.5 text-xs text-gray-500">
              <div className="flex justify-between">
                <span>Domaine</span>
                <span className="font-mono text-gray-700">mrjc-benin.org</span>
              </div>
              <div className="flex justify-between">
                <span>SSL</span>
                <span className="text-green-600 font-medium">
                  Valide · 280 jours
                </span>
              </div>
              <div className="flex justify-between">
                <span>Dernière mise à jour</span>
                <span className="text-gray-700">Aujourd'hui 09:14</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
