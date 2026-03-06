/**
 * Badge — UI component MRJC-BÉNIN
 * Étiquettes colorées pour statuts, catégories, tags.
 */

import { cn } from "@/lib/utils/cn";

type BadgeVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "gray";
type BadgeSize = "xs" | "sm" | "md";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  pill?: boolean;
  className?: string;
}

const VARIANTS: Record<BadgeVariant, string> = {
  primary: "bg-primary-100 text-primary-800 border-primary-200",
  secondary: "bg-secondary-100 text-secondary-800 border-secondary-200",
  accent: "bg-accent-100 text-accent-800 border-accent-200",
  success: "bg-green-100 text-green-800 border-green-200",
  warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
  error: "bg-red-100 text-red-800 border-red-200",
  info: "bg-blue-100 text-blue-800 border-blue-200",
  gray: "bg-gray-100 text-gray-700 border-gray-200",
};

const SIZES: Record<BadgeSize, string> = {
  xs: "px-1.5 py-0.5 text-2xs",
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
};

const DOT_COLORS: Record<BadgeVariant, string> = {
  primary: "bg-primary-500",
  secondary: "bg-secondary-500",
  accent: "bg-accent-500",
  success: "bg-green-500",
  warning: "bg-yellow-500",
  error: "bg-red-500",
  info: "bg-blue-500",
  gray: "bg-gray-400",
};

export function Badge({
  children,
  variant = "gray",
  size = "sm",
  dot,
  pill = true,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium border",
        VARIANTS[variant],
        SIZES[size],
        pill ? "rounded-full" : "rounded-md",
        className,
      )}
    >
      {dot && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full", DOT_COLORS[variant])}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}

/* ─── Status Badge (projet, offre, newsletter…) ──────────────────────────── */
interface StatusBadgeProps {
  status:
    | "ongoing"
    | "completed"
    | "planned"
    | "open"
    | "closed"
    | "draft"
    | "published";
  className?: string;
}

const STATUS_MAP: Record<
  string,
  { label: string; variant: BadgeVariant; dot?: boolean }
> = {
  ongoing: { label: "En cours", variant: "success", dot: true },
  completed: { label: "Clôturé", variant: "gray", dot: false },
  planned: { label: "Planifié", variant: "info", dot: true },
  open: { label: "Ouvert", variant: "success", dot: true },
  closed: { label: "Fermé", variant: "error", dot: false },
  draft: { label: "Brouillon", variant: "warning", dot: true },
  published: { label: "Publié", variant: "primary", dot: true },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const cfg = STATUS_MAP[status] ?? STATUS_MAP.draft;
  return (
    <Badge variant={cfg.variant} dot={cfg.dot} className={className}>
      {cfg.label}
    </Badge>
  );
}
