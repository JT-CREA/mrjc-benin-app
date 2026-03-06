/**
 * Hook — useVisitorTracker
 * Suit automatiquement les visites de page.
 * Anti-double: utilise sessionStorage pour ne compter qu'une seule fois par session/page.
 */

"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface VisitorStats {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  loading: boolean;
  error: string | null;
}

interface UseVisitorTrackerOptions {
  /** Activer le tracking automatique (défaut: true) */
  track?: boolean;
  /** Intervalle de rafraîchissement en ms (0 = désactivé) */
  refreshInterval?: number;
}

export function useVisitorTracker(
  options: UseVisitorTrackerOptions = {},
): VisitorStats {
  const { track = true, refreshInterval = 0 } = options;
  const pathname = usePathname();

  const [stats, setStats] = useState<VisitorStats>({
    total: 0,
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    loading: true,
    error: null,
  });

  // ─── Fetch des stats actuelles ──────────────────────────────────────────────
  const fetchStats = async () => {
    try {
      const res = await fetch("/api/visitors", { cache: "no-store" });
      const json = await res.json();

      if (json.success) {
        setStats((prev) => ({
          ...prev,
          ...json.data,
          loading: false,
          error: null,
        }));
      }
    } catch (err) {
      setStats((prev) => ({
        ...prev,
        loading: false,
        error: "Erreur de chargement",
      }));
    }
  };

  // ─── Tracking de la visite ───────────────────────────────────────────────────
  useEffect(() => {
    if (!track || typeof window === "undefined") return;

    const sessionKey = `mrjc_visited_${pathname}`;
    const alreadyVisited = sessionStorage.getItem(sessionKey);

    if (!alreadyVisited) {
      sessionStorage.setItem(sessionKey, "1");

      fetch("/api/visitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: pathname }),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.counted) {
            setStats((prev) => ({
              ...prev,
              total: json.data.total,
              today: json.data.today,
              thisWeek: json.data.thisWeek,
              thisMonth: json.data.thisMonth,
              loading: false,
            }));
          }
        })
        .catch(() => fetchStats());
    } else {
      fetchStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, track]);

  // ─── Auto-refresh ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!refreshInterval) return;

    const interval = setInterval(fetchStats, refreshInterval);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshInterval]);

  return stats;
}

// ─── Hook léger pour le compteur downloads ────────────────────────────────────
interface DownloadStats {
  count: number;
  loading: boolean;
}

export function useDownloadCounter(resourceId: string): {
  stats: DownloadStats;
  trackDownload: () => Promise<void>;
} {
  const [stats, setStats] = useState<DownloadStats>({
    count: 0,
    loading: true,
  });

  useEffect(() => {
    fetch(`/api/downloads?resourceId=${encodeURIComponent(resourceId)}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setStats({ count: json.data.count, loading: false });
        }
      })
      .catch(() => setStats((prev) => ({ ...prev, loading: false })));
  }, [resourceId]);

  const trackDownload = async () => {
    try {
      const res = await fetch("/api/downloads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceId }),
      });
      const json = await res.json();
      if (json.success) {
        setStats({ count: json.data.newCount, loading: false });
      }
    } catch {
      // Silencieux
    }
  };

  return { stats, trackDownload };
}
