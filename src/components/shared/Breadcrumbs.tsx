"use client";

/**
 * components/shared/Breadcrumbs.tsx
 * Fil d'Ariane accessible (aria + schema.org BreadcrumbList JSON-LD)
 */

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
  dark?: boolean; // mode sombre (sur fond coloré)
}

export default function Breadcrumbs({
  items,
  showHome = true,
  className,
  dark = false,
}: BreadcrumbsProps) {
  const allItems: BreadcrumbItem[] = [
    ...(showHome ? [{ label: "Accueil", href: "/" }] : []),
    ...items,
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.label,
      ...(item.href
        ? { item: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}${item.href}` }
        : {}),
    })),
  };

  const textColor = dark
    ? "text-white/70 hover:text-white"
    : "text-gray-500 hover:text-green-700";
  const activeColor = dark
    ? "text-white font-medium"
    : "text-gray-900 font-medium";
  const sepColor = dark ? "text-white/40" : "text-gray-300";

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav
        aria-label="Fil d'Ariane"
        className={cn("flex items-center flex-wrap gap-0.5", className)}
      >
        <ol className="flex items-center flex-wrap gap-0.5 list-none">
          {allItems.map((item, idx) => {
            const isLast = idx === allItems.length - 1;
            const isFirst = idx === 0 && showHome;

            return (
              <li key={idx} className="flex items-center">
                {idx > 0 && (
                  <ChevronRight
                    size={14}
                    className={cn("mx-1 flex-shrink-0", sepColor)}
                    aria-hidden="true"
                  />
                )}

                {isLast || !item.href ? (
                  <span
                    aria-current={isLast ? "page" : undefined}
                    className={cn(
                      "text-sm truncate max-w-[180px] sm:max-w-none",
                      activeColor,
                    )}
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1 text-sm transition-colors duration-150 truncate max-w-[180px] sm:max-w-none",
                      textColor,
                    )}
                  >
                    {isFirst && <Home size={13} aria-hidden />}
                    {isFirst ? (
                      <span className="sr-only">{item.label}</span>
                    ) : (
                      item.label
                    )}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
