/**
 * lib/utils/formatters.ts
 * Fonctions de formatage génériques pour MRJC-BÉNIN
 * (nombres, devises, dates, texte)
 */

/* ─── Nombres ─────────────────────────────────────────────────────────────── */

/** Formate un nombre avec séparateur de milliers */
export function formatNumber(n: number, locale = "fr-FR"): string {
  return new Intl.NumberFormat(locale).format(n);
}

/** Formate un montant en FCFA */
export function formatCFA(amount: number, compact = false): string {
  if (compact && amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1).replace(".0", "")} M FCFA`;
  }
  if (compact && amount >= 1_000) {
    return `${(amount / 1_000).toFixed(0)} k FCFA`;
  }
  return `${new Intl.NumberFormat("fr-FR").format(amount)} FCFA`;
}

/** Formate un grand nombre en version compacte (ex: 85 000 → 85k) */
export function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}k`;
  return String(n);
}

/** Formate un pourcentage */
export function formatPercent(
  value: number,
  total: number,
  decimals = 0,
): string {
  if (total === 0) return "0%";
  return `${((value / total) * 100).toFixed(decimals)}%`;
}

/* ─── Dates ───────────────────────────────────────────────────────────────── */

/** Formate une date en français */
export function formatDateLong(date: string | Date, locale = "fr-BJ"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "Date invalide";
  return d.toLocaleDateString(locale, { dateStyle: "long" });
}

export function formatDateShort(date: string | Date, locale = "fr-BJ"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatDateRelative(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const diffMs = Date.now() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return "À l'instant";
  if (diffSec < 3600) return `Il y a ${Math.floor(diffSec / 60)} min`;
  if (diffSec < 86400) return `Il y a ${Math.floor(diffSec / 3600)} h`;
  if (diffSec < 86400 * 7) return `Il y a ${Math.floor(diffSec / 86400)} j`;
  if (diffSec < 86400 * 30)
    return `Il y a ${Math.floor(diffSec / 86400 / 7)} sem.`;
  if (diffSec < 86400 * 365)
    return `Il y a ${Math.floor(diffSec / 86400 / 30)} mois`;
  return formatDateLong(d);
}

/** Durée entre deux dates */
export function formatDuration(start: string, end?: string): string {
  const s = new Date(start);
  const e = end ? new Date(end) : new Date();
  const diffMs = e.getTime() - s.getTime();
  const days = Math.floor(diffMs / 86400000);

  if (days < 30) return `${days} jour${days > 1 ? "s" : ""}`;
  if (days < 365) return `${Math.floor(days / 30)} mois`;
  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);
  return months > 0
    ? `${years} an${years > 1 ? "s" : ""} ${months} mois`
    : `${years} an${years > 1 ? "s" : ""}`;
}

/** Formate pour <time> datetime attribute */
export function toISODateString(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString().split("T")[0];
}

/* ─── Texte ───────────────────────────────────────────────────────────────── */

/** Tronque un texte proprement */
export function truncate(str: string, maxLen: number, suffix = "…"): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - suffix.length).trimEnd() + suffix;
}

/** Pluralise un mot simple */
export function pluralize(
  count: number,
  singular: string,
  plural?: string,
): string {
  return count === 1
    ? `${count} ${singular}`
    : `${count} ${plural ?? singular + "s"}`;
}

/** Formate un nom propre (capitalize each word) */
export function formatName(name: string): string {
  return name.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Formate un numéro de téléphone béninois */
export function formatPhoneBJ(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 8) {
    return `+229 ${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 6)} ${digits.slice(6)}`;
  }
  return phone;
}

/** Initiales depuis un nom complet */
export function initials(name: string, count = 2): string {
  return name
    .split(/\s+/)
    .slice(0, count)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/* ─── Taille de fichier ───────────────────────────────────────────────────── */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} Ko`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} Mo`;
  return `${(bytes / 1024 ** 3).toFixed(2)} Go`;
}
