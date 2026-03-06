/**
 * components/shared/Card.tsx
 * Composant Card polyvalent — Design system MRJC-BÉNIN
 */

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

/* ─── Card de base ───────────────────────────────────────────────────────── */
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  border?: boolean;
  shadow?: "none" | "sm" | "md" | "lg";
  onClick?: () => void;
}

const PADDING_MAP = { none: "", sm: "p-4", md: "p-6", lg: "p-8" };
const SHADOW_MAP = {
  none: "",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
};

export function Card({
  children,
  className,
  hover = false,
  padding = "md",
  border = true,
  shadow = "sm",
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white rounded-2xl overflow-hidden",
        border && "border border-gray-100",
        SHADOW_MAP[shadow],
        hover &&
          "transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer",
        PADDING_MAP[padding],
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ─── Card avec image (Project / Blog) ───────────────────────────────────── */
interface ImageCardProps {
  title: string;
  excerpt?: string;
  image?: string;
  imageAlt?: string;
  href?: string;
  badge?: string;
  badgeColor?: string;
  date?: string;
  tags?: string[];
  footer?: React.ReactNode;
  className?: string;
  aspectRatio?: "video" | "square" | "4/3" | "3/2";
}

const ASPECT_MAP = {
  video: "aspect-video",
  square: "aspect-square",
  "4/3": "aspect-[4/3]",
  "3/2": "aspect-[3/2]",
};

export function ImageCard({
  title,
  excerpt,
  image,
  imageAlt,
  href,
  badge,
  badgeColor,
  date,
  tags,
  footer,
  className,
  aspectRatio = "video",
}: ImageCardProps) {
  const Wrapper = href ? Link : React.Fragment;
  const wrapperProps = href ? { href, className: "group" } : {};

  return (
    <div
      className={cn(
        "bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300",
        className,
      )}
    >
      {/* Image */}
      <div
        className={cn(
          "relative overflow-hidden bg-gray-100",
          ASPECT_MAP[aspectRatio],
        )}
      >
        {/* @ts-expect-error - conditional wrapper */}
        <Wrapper {...wrapperProps}>
          {image ? (
            <Image
              src={image}
              alt={imageAlt ?? title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
              <span className="text-primary-400 text-4xl">🌱</span>
            </div>
          )}
          {/* Overlay hover */}
          {href && (
            <div className="absolute inset-0 bg-primary-900/0 group-hover:bg-primary-900/10 transition-colors duration-300" />
          )}
        </Wrapper>
        {/* Badge */}
        {badge && (
          <span
            className={cn(
              "absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full",
              badgeColor ?? "bg-primary-600 text-white",
            )}
          >
            {badge}
          </span>
        )}
        {date && (
          <span className="absolute bottom-3 right-3 text-xs bg-black/60 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
            {date}
          </span>
        )}
      </div>

      {/* Contenu */}
      <div className="p-5">
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="text-[11px] font-medium px-2 py-0.5 bg-primary-50 text-primary-700 rounded-full"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {href ? (
          <Link href={href}>
            <h3 className="font-bold text-gray-900 text-base leading-snug mb-2 hover:text-primary-700 transition-colors line-clamp-2">
              {title}
            </h3>
          </Link>
        ) : (
          <h3 className="font-bold text-gray-900 text-base leading-snug mb-2 line-clamp-2">
            {title}
          </h3>
        )}

        {excerpt && (
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
            {excerpt}
          </p>
        )}

        {footer && (
          <div className="mt-4 pt-4 border-t border-gray-100">{footer}</div>
        )}
      </div>
    </div>
  );
}

/* ─── Stat Card ──────────────────────────────────────────────────────────── */
interface StatCardProps {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  color?: string;
  suffix?: string;
  className?: string;
}

export function StatCard({
  value,
  label,
  icon,
  color = "#1B6B3A",
  suffix = "",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center",
        className,
      )}
    >
      {icon && (
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: `${color}15` }}
        >
          <span style={{ color }}>{icon}</span>
        </div>
      )}
      <p className="text-3xl font-black font-display mb-1" style={{ color }}>
        {value}
        {suffix}
      </p>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
    </div>
  );
}

export default Card;
