/**
 * components/shared/Spinner.tsx
 * Indicateurs de chargement et états vides — Design system MRJC-BÉNIN
 */

import React from "react";
import { cn } from "@/lib/utils/cn";

/* ─── Spinner ────────────────────────────────────────────────────────────── */
type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";

interface SpinnerProps {
  size?: SpinnerSize;
  color?: string;
  className?: string;
  label?: string;
}

const SPINNER_SIZES: Record<SpinnerSize, string> = {
  xs: "w-3 h-3 border",
  sm: "w-4 h-4 border",
  md: "w-6 h-6 border-2",
  lg: "w-8 h-8 border-2",
  xl: "w-12 h-12 border-3",
};

export function Spinner({
  size = "md",
  className,
  label = "Chargement…",
}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        "inline-block rounded-full border-gray-200 border-t-primary-600 animate-spin",
        SPINNER_SIZES[size],
        className,
      )}
    />
  );
}

/* ─── Page Loader (centré) ───────────────────────────────────────────────── */
export function PageLoader({
  message = "Chargement en cours…",
}: {
  message?: string;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[40vh] gap-4"
      role="status"
    >
      <div className="relative">
        <div className="w-14 h-14 rounded-full border-4 border-primary-100 border-t-primary-600 animate-spin" />
        <div
          className="absolute inset-2 w-10 h-10 rounded-full border-4 border-transparent border-t-secondary-400 animate-spin"
          style={{ animationDirection: "reverse", animationDuration: "0.8s" }}
        />
      </div>
      <p className="text-gray-500 text-sm font-medium animate-pulse">
        {message}
      </p>
    </div>
  );
}

/* ─── Section Loader (dans une section) ─────────────────────────────────── */
export function SectionLoader() {
  return (
    <div className="flex items-center justify-center py-16">
      <Spinner size="lg" />
    </div>
  );
}

/* ─── Empty State ────────────────────────────────────────────────────────── */
interface EmptyStateProps {
  icon?: React.ReactNode;
  emoji?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  emoji,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("text-center py-16 px-6", className)}>
      <div className="mb-4">
        {emoji && <div className="text-5xl mb-3">{emoji}</div>}
        {icon && (
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-gray-400">
            {icon}
          </div>
        )}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

/* ─── Error State ────────────────────────────────────────────────────────── */
interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Une erreur est survenue",
  description = "Impossible de charger les données. Veuillez réessayer.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn("text-center py-12 px-6", className)}>
      <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <span className="text-red-500 text-2xl">⚠️</span>
      </div>
      <h3 className="text-base font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
        {description}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors"
        >
          Réessayer
        </button>
      )}
    </div>
  );
}

/* ─── Skeleton Lines ─────────────────────────────────────────────────────── */
export function SkeletonLine({
  width = "full",
  height = "4",
}: {
  width?: string;
  height?: string;
}) {
  return (
    <div
      className={cn(
        `h-${height} bg-gray-200 rounded-full animate-pulse`,
        `w-${width}`,
      )}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm animate-pulse">
      <div className="aspect-video bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-gray-200 rounded-full w-1/4" />
        <div className="h-4 bg-gray-200 rounded-full w-3/4" />
        <div className="h-3 bg-gray-200 rounded-full w-full" />
        <div className="h-3 bg-gray-200 rounded-full w-5/6" />
        <div className="flex gap-2 pt-2">
          <div className="h-6 bg-gray-200 rounded-full w-16" />
          <div className="h-6 bg-gray-200 rounded-full w-20" />
        </div>
      </div>
    </div>
  );
}
