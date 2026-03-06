import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  dark?: boolean;
}

export default function Breadcrumb({
  items,
  className,
  dark = false,
}: BreadcrumbProps) {
  const allItems: BreadcrumbItem[] = [
    { label: "Accueil", href: "/" },
    ...items,
  ];

  return (
    <nav
      aria-label="Fil d'Ariane"
      className={cn("flex items-center flex-wrap gap-1", className)}
    >
      <ol
        className="flex items-center flex-wrap gap-1"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          return (
            <li
              key={index}
              className="flex items-center gap-1"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {index === 0 && (
                <Home
                  className={cn(
                    "w-3.5 h-3.5 flex-shrink-0",
                    dark ? "text-white/60" : "text-neutral-400",
                  )}
                />
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={cn(
                    "text-xs font-medium transition-colors hover:underline truncate max-w-[150px]",
                    dark
                      ? "text-white/70 hover:text-white"
                      : "text-neutral-500 hover:text-primary-600",
                  )}
                  itemProp="item"
                >
                  <span itemProp="name">{item.label}</span>
                </Link>
              ) : (
                <span
                  className={cn(
                    "text-xs font-semibold truncate max-w-[200px]",
                    dark ? "text-white" : "text-neutral-800",
                  )}
                  itemProp="name"
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <ChevronRight
                  className={cn(
                    "w-3 h-3 flex-shrink-0",
                    dark ? "text-white/30" : "text-neutral-300",
                  )}
                />
              )}
              <meta itemProp="position" content={String(index + 1)} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
