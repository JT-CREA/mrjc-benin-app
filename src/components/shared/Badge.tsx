/**
 * components/shared/Badge.tsx
 * Composant Badge — Design system MRJC-BÉNIN
 */

import React from "react";
import { cn } from "@/lib/utils/cn";

type BadgeVariant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "outline";
type BadgeSize = "xs" | "sm" | "md";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  className?: string;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  default: "bg-gray-100  text-gray-700",
  primary: "bg-primary-100 text-primary-800",
  secondary: "bg-secondary-100 text-secondary-800",
  success: "bg-green-100 text-green-800",
  warning: "bg-amber-100 text-amber-800",
  danger: "bg-red-100   text-red-800",
  info: "bg-blue-100  text-blue-800",
  outline: "border border-gray-300 text-gray-700 bg-transparent",
};

const DOT_COLORS: Record<BadgeVariant, string> = {
  default: "bg-gray-400",
  primary: "bg-primary-600",
  secondary: "bg-secondary-600",
  success: "bg-green-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  info: "bg-blue-500",
  outline: "bg-gray-400",
};

const SIZE_CLASSES: Record<BadgeSize, string> = {
  xs: "text-[10px] px-1.5 py-0.5 gap-1",
  sm: "text-xs px-2 py-0.5 gap-1.5",
  md: "text-xs px-2.5 py-1 gap-2",
};

export default function Badge({
  children,
  variant = "default",
  size = "sm",
  dot = false,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-semibold rounded-full whitespace-nowrap",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
    >
      {dot && (
        <span
          className={cn(
            "rounded-full shrink-0",
            DOT_COLORS[variant],
            size === "xs"
              ? "w-1.5 h-1.5"
              : size === "sm"
                ? "w-2 h-2"
                : "w-2 h-2",
          )}
        />
      )}
      {children}
    </span>
  );
}

/* ─── Status Badge spécialisé ────────────────────────────────────────────── */
type ProjectStatus = "ongoing" | "completed" | "planned" | "paused";

const STATUS_CONFIG: Record<
  ProjectStatus,
  { label: string; variant: BadgeVariant }
> = {
  ongoing: { label: "En cours", variant: "success" },
  completed: { label: "Clôturé", variant: "default" },
  planned: { label: "Planifié", variant: "info" },
  paused: { label: "En pause", variant: "warning" },
};

export function StatusBadge({
  status,
  size = "sm",
}: {
  status: ProjectStatus;
  size?: BadgeSize;
}) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.ongoing;
  return (
    <Badge variant={config.variant} size={size} dot>
      {config.label}
    </Badge>
  );
}
