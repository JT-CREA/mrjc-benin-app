import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utilitaire de fusion de classes Tailwind
 * Combine clsx et tailwind-merge pour éviter les conflits
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
