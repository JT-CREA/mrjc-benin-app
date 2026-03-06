"use client";

/**
 * components/shared/Pagination.tsx
 * Pagination accessible et responsive avec ellipsis intelligente
 */

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  showFirstLast?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

function generatePages(
  current: number,
  total: number,
  siblings: number,
): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const left = Math.max(2, current - siblings);
  const right = Math.min(total - 1, current + siblings);
  const pages: (number | "...")[] = [1];

  if (left > 2) pages.push("...");
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < total - 1) pages.push("...");
  pages.push(total);

  return pages;
}

const sizeMap = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  siblingCount = 1,
  showFirstLast = true,
  className,
  size = "md",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = generatePages(page, totalPages, siblingCount);
  const btnBase = cn(
    "inline-flex items-center justify-center rounded-lg border font-medium",
    "transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-40",
    sizeMap[size],
  );

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        "flex items-center justify-center gap-1.5 select-none",
        className,
      )}
    >
      {/* Première page */}
      {showFirstLast && (
        <button
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          aria-label="Première page"
          className={cn(
            btnBase,
            "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300",
          )}
        >
          <ChevronsLeft size={16} />
        </button>
      )}

      {/* Précédent */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Page précédente"
        className={cn(
          btnBase,
          "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300",
        )}
      >
        <ChevronLeft size={16} />
      </button>

      {/* Numéros de page */}
      {pages.map((p, idx) =>
        p === "..." ? (
          <span
            key={`ellipsis-${idx}`}
            className={cn(
              "inline-flex items-center justify-center text-gray-400",
              sizeMap[size],
            )}
            aria-hidden
          >
            ···
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            disabled={p === page}
            aria-label={`Page ${p}`}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              btnBase,
              p === page
                ? "border-green-600 bg-green-600 text-white shadow-sm cursor-default"
                : "border-gray-200 bg-white text-gray-700 hover:bg-green-50 hover:border-green-300 hover:text-green-700",
            )}
          >
            {p}
          </button>
        ),
      )}

      {/* Suivant */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Page suivante"
        className={cn(
          btnBase,
          "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300",
        )}
      >
        <ChevronRight size={16} />
      </button>

      {/* Dernière page */}
      {showFirstLast && (
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
          aria-label="Dernière page"
          className={cn(
            btnBase,
            "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300",
          )}
        >
          <ChevronsRight size={16} />
        </button>
      )}

      {/* Indicateur textuel */}
      <span className="ml-3 text-sm text-gray-500 hidden sm:inline">
        Page <strong className="text-gray-900">{page}</strong> / {totalPages}
      </span>
    </nav>
  );
}
