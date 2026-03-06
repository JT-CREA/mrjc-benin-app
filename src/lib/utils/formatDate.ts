import { format, formatDistanceToNow, parseISO, isValid } from "date-fns";
import { fr } from "date-fns/locale";

/**
 * Formate une date ISO en format long français
 * Ex: "15 juillet 2024"
 */
export function formatDateLong(isoString: string): string {
  try {
    const date = parseISO(isoString);
    if (!isValid(date)) return isoString;
    return format(date, "d MMMM yyyy", { locale: fr });
  } catch {
    return isoString;
  }
}

/**
 * Formate une date ISO en format court
 * Ex: "15/07/2024"
 */
export function formatDateShort(isoString: string): string {
  try {
    const date = parseISO(isoString);
    if (!isValid(date)) return isoString;
    return format(date, "dd/MM/yyyy", { locale: fr });
  } catch {
    return isoString;
  }
}

/**
 * Formate une date avec le mois et l'année
 * Ex: "Juillet 2024"
 */
export function formatMonthYear(isoString: string): string {
  try {
    const date = parseISO(isoString);
    if (!isValid(date)) return isoString;
    return format(date, "MMMM yyyy", { locale: fr });
  } catch {
    return isoString;
  }
}

/**
 * Distance relative depuis maintenant
 * Ex: "il y a 3 jours"
 */
export function formatRelative(isoString: string): string {
  try {
    const date = parseISO(isoString);
    if (!isValid(date)) return isoString;
    return formatDistanceToNow(date, { locale: fr, addSuffix: true });
  } catch {
    return isoString;
  }
}

/**
 * Retourne l'année d'une date ISO
 */
export function getYear(isoString: string): number {
  try {
    return parseISO(isoString).getFullYear();
  } catch {
    return new Date().getFullYear();
  }
}

/**
 * Groupe un tableau d'items par année (basé sur une clé date)
 */
export function groupByYear<T extends Record<string, unknown>>(
  items: T[],
  dateKey: keyof T,
): Record<number, T[]> {
  return items.reduce<Record<number, T[]>>((acc, item) => {
    const year = getYear(item[dateKey] as string);
    if (!acc[year]) acc[year] = [];
    acc[year].push(item);
    return acc;
  }, {});
}

/**
 * Vérifie si une date est récente (< 30 jours)
 */
export function isRecent(isoString: string, days = 30): boolean {
  try {
    const date = parseISO(isoString);
    const diffMs = Date.now() - date.getTime();
    return diffMs < days * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}
