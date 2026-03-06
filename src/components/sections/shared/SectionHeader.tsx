/**
 * SectionHeader — Composant partagé MRJC-BÉNIN
 * En-tête unifié pour toutes les sections de contenu.
 * Supporte : tag coloré, titre, description, alignement, bouton CTA.
 */

import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { ArrowRight } from "lucide-react";

interface SectionHeaderProps {
  tag?: string;
  tagColor?: "primary" | "secondary" | "accent" | "green" | "orange" | "blue";
  title: string;
  description?: string;
  align?: "left" | "center" | "right";
  cta?: { label: string; href: string; variant?: "primary" | "outline" };
  className?: string;
  titleClass?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
}

const TAG_COLORS: Record<string, string> = {
  primary: "bg-primary-100 text-primary-700",
  secondary: "bg-secondary-100 text-secondary-700",
  accent: "bg-accent-100 text-accent-700",
  green: "bg-green-100 text-green-700",
  orange: "bg-orange-100 text-orange-700",
  blue: "bg-blue-100 text-blue-700",
};

const MAX_WIDTHS: Record<string, string> = {
  sm: "max-w-lg",
  md: "max-w-xl",
  lg: "max-w-2xl",
  xl: "max-w-3xl",
  full: "max-w-full",
};

const ALIGNS: Record<string, string> = {
  left: "text-left items-start",
  center: "text-center items-center",
  right: "text-right items-end",
};

export default function SectionHeader({
  tag,
  tagColor = "primary",
  title,
  description,
  align = "center",
  cta,
  className,
  titleClass,
  maxWidth = "lg",
}: SectionHeaderProps) {
  const alignClass = ALIGNS[align];
  const maxWClass = MAX_WIDTHS[maxWidth];
  const tagColorCls = TAG_COLORS[tagColor] ?? TAG_COLORS.primary;

  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        alignClass,
        align === "center" && "mx-auto",
        maxWClass,
        className,
      )}
    >
      {tag && (
        <span
          className={cn(
            "inline-flex items-center self-start px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider",
            tagColorCls,
            align === "center" && "self-center",
          )}
        >
          {tag}
        </span>
      )}

      <h2
        className={cn(
          "font-display font-bold text-gray-900 leading-tight",
          "text-2xl sm:text-3xl md:text-4xl",
          titleClass,
        )}
      >
        {title}
      </h2>

      {description && (
        <p
          className={cn(
            "text-gray-600 leading-relaxed",
            align === "center" && "mx-auto",
            maxWClass === "max-w-full" ? "" : "max-w-2xl",
          )}
        >
          {description}
        </p>
      )}

      {cta && (
        <div className={cn("mt-2", align === "center" && "mx-auto")}>
          {cta.variant === "outline" ? (
            <Link
              href={cta.href}
              className="btn-outline inline-flex items-center gap-2"
            >
              {cta.label} <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              href={cta.href}
              className="btn-primary inline-flex items-center gap-2"
            >
              {cta.label} <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
