/**
 * components/shared/SectionTitle.tsx
 * En-tête de section réutilisable — Design system MRJC-BÉNIN
 */

import { cn } from "@/lib/utils/cn";

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  eyebrowColor?: string;
  className?: string;
  titleClass?: string;
  as?: "h1" | "h2" | "h3";
}

export default function SectionTitle({
  eyebrow,
  title,
  subtitle,
  align = "center",
  eyebrowColor = "text-primary-600",
  className,
  titleClass,
  as: Tag = "h2",
}: SectionTitleProps) {
  const alignClass = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  }[align];

  return (
    <div className={cn("flex flex-col gap-3", alignClass, className)}>
      {eyebrow && (
        <span
          className={cn(
            "text-xs font-bold uppercase tracking-[0.15em] inline-flex items-center gap-2",
            eyebrowColor,
          )}
        >
          <span className="w-6 h-px bg-current opacity-60" aria-hidden />
          {eyebrow}
          <span className="w-6 h-px bg-current opacity-60" aria-hidden />
        </span>
      )}

      <Tag
        className={cn(
          "font-black font-display text-gray-900 leading-tight",
          "text-2xl sm:text-3xl md:text-4xl",
          titleClass,
        )}
      >
        {title}
      </Tag>

      {subtitle && (
        <p
          className={cn(
            "text-gray-500 leading-relaxed max-w-2xl text-base md:text-lg",
            align === "center" && "mx-auto",
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
