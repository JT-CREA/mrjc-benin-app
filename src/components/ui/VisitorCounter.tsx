"use client";

/**
 * Composant — VisitorCounter
 * Affiche les compteurs de visiteurs en temps réel dans le footer.
 * Design: badge discret ou widget détaillé selon le variant.
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Users, TrendingUp, Calendar } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface CounterData {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
}

interface VisitorCounterProps {
  variant?: "badge" | "widget" | "minimal";
  className?: string;
  refreshInterval?: number;
}

// ─── Formateur de nombres ─────────────────────────────────────────────────────
function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toLocaleString("fr-FR");
}

// ─── Compteur animé ───────────────────────────────────────────────────────────
function AnimatedNumber({
  value,
  className = "",
}: {
  value: number;
  className?: string;
}) {
  const [displayed, setDisplayed] = useState(value);
  const [prev, setPrev] = useState(value);

  useEffect(() => {
    if (value !== prev) {
      setPrev(displayed);
      setDisplayed(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={value}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 10, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={className}
      >
        {formatNumber(value)}
      </motion.span>
    </AnimatePresence>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────
export default function VisitorCounter({
  variant = "badge",
  className = "",
  refreshInterval = 60_000,
}: VisitorCounterProps) {
  const [data, setData] = useState<CounterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState(Math.floor(Math.random() * 8) + 3); // Simulation visiteurs en ligne

  // Fetch des stats
  const fetchData = async () => {
    try {
      const res = await fetch("/api/visitors", { cache: "no-store" });
      const json = await res.json();
      if (json.success) {
        setData(json.data);
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, refreshInterval);

    // Simuler la variation des visiteurs en ligne
    const onlineInterval = setInterval(() => {
      setOnline((prev) => {
        const change = Math.random() > 0.5 ? 1 : -1;
        return Math.max(1, Math.min(25, prev + change));
      });
    }, 15_000);

    return () => {
      clearInterval(interval);
      clearInterval(onlineInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshInterval]);

  if (loading) {
    return (
      <div className={`animate-pulse flex items-center gap-2 ${className}`}>
        <div className="h-4 w-4 rounded-full bg-gray-300" />
        <div className="h-3 w-20 rounded bg-gray-300" />
      </div>
    );
  }

  // ─── Variant: minimal ──────────────────────────────────────────────────────
  if (variant === "minimal") {
    return (
      <div
        className={`flex items-center gap-1.5 text-xs text-gray-500 ${className}`}
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
        </span>
        <span>
          <span className="font-semibold text-gray-700">{online}</span> en ligne
          ·{" "}
          <span className="font-semibold text-gray-700">
            {data ? formatNumber(data.total) : "—"}
          </span>{" "}
          visiteurs
        </span>
      </div>
    );
  }

  // ─── Variant: badge ────────────────────────────────────────────────────────
  if (variant === "badge") {
    return (
      <div
        className={`inline-flex items-center gap-3 rounded-full border border-gray-200 bg-white/80 px-4 py-2 text-sm shadow-sm backdrop-blur-sm ${className}`}
      >
        {/* Indicateur en ligne */}
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          <span className="font-medium text-green-700">{online} en ligne</span>
        </div>

        <span className="h-4 w-px bg-gray-300" />

        {/* Total visiteurs */}
        <div className="flex items-center gap-1.5 text-gray-600">
          <Eye size={14} className="text-primary-500" />
          <AnimatedNumber value={data?.total ?? 0} />
          <span className="text-xs text-gray-400">visiteurs</span>
        </div>

        {/* Aujourd'hui */}
        <div className="flex items-center gap-1.5 text-gray-600">
          <Calendar size={14} className="text-accent-500" />
          <AnimatedNumber value={data?.today ?? 0} />
          <span className="text-xs text-gray-400">auj.</span>
        </div>
      </div>
    );
  }

  // ─── Variant: widget ───────────────────────────────────────────────────────
  return (
    <div
      className={`rounded-xl border border-gray-100 bg-white p-4 shadow-md ${className}`}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">
          Statistiques visiteurs
        </h3>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          <span className="text-xs font-medium text-green-700">
            {online} en ligne
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          {
            icon: Users,
            label: "Total",
            value: data?.total ?? 0,
            color: "text-primary-600",
            bg: "bg-primary-50",
          },
          {
            icon: Calendar,
            label: "Aujourd'hui",
            value: data?.today ?? 0,
            color: "text-accent-600",
            bg: "bg-accent-50",
          },
          {
            icon: TrendingUp,
            label: "Cette semaine",
            value: data?.thisWeek ?? 0,
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            icon: Eye,
            label: "Ce mois",
            value: data?.thisMonth ?? 0,
            color: "text-purple-600",
            bg: "bg-purple-50",
          },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <motion.div
            key={label}
            whileHover={{ scale: 1.02 }}
            className={`rounded-lg p-3 ${bg}`}
          >
            <div className={`mb-1 flex items-center gap-1.5 ${color}`}>
              <Icon size={13} />
              <span className="text-xs font-medium">{label}</span>
            </div>
            <div className={`text-lg font-bold ${color}`}>
              <AnimatedNumber value={value} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
