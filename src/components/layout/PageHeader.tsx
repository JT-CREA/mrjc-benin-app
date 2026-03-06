import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import Breadcrumb from "./Breadcrumb";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  tag?: string;
  breadcrumbs?: any[];
  stats?: { label: string; value: string }[];
  image?: string;
  imageAlt?: string;
  align?: "left" | "center";
  size?: "sm" | "md" | "lg";
  className?: string;
  children?: React.ReactNode;
}

const sizeClasses = {
  sm: "py-12 lg:py-16",
  md: "py-16 lg:py-24",
  lg: "py-24 lg:py-32",
};

export default function PageHeader({
  title,
  subtitle,
  tag,
  breadcrumbs,
  image,
  imageAlt = "",
  align = "left",
  size = "md",
  className,
  children,
}: PageHeaderProps) {
  return (
    <section
      className={cn(
        "relative bg-primary-700 overflow-hidden",
        sizeClasses[size],
        className,
      )}
    >
      {/* Image de fond */}
      {image && (
        <>
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority
            quality={75}
            className="object-cover opacity-25"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-primary-50/70" />
        </>
      )}

      {/* Accent gauche */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-500" />

      {/* Motifs décoratifs */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -right-20 -top-20 w-80 h-80 border border-primary-200/40 rounded-full" />
        <div className="absolute right-32 bottom-0 w-48 h-48 border border-primary-200/30 rounded-full" />
      </div>

      <div className="container-mrjc relative z-10">
        {/* Breadcrumb */}
        {breadcrumbs && (
          <div className="mb-6">
            <Breadcrumb items={breadcrumbs} dark />
          </div>
        )}

        <div
          className={cn(align === "center" && "text-center max-w-3xl mx-auto")}
        >
          {/* Tag */}
          {tag && (
            <div
              className={cn(
                "flex items-center gap-3 mb-4",
                align === "center" && "justify-center",
              )}
            >
              <span className="h-px w-8 bg-secondary-400 flex-shrink-0" />
              <span className="text-secondary-100 text-sm font-semibold uppercase tracking-widest">
                {tag}
              </span>
              <span className="h-px w-8 bg-secondary-400 flex-shrink-0" />
            </div>
          )}

          {/* Titre */}
          <h1
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white
                         leading-tight text-shadow mb-4"
          >
            {title}
          </h1>

          {/* Sous-titre */}
          {subtitle && (
            <p
              className="text-lg text-primary-50 max-w-2xl leading-relaxed mt-4"
              style={{
                marginLeft: align === "center" ? "auto" : undefined,
                marginRight: align === "center" ? "auto" : undefined,
              }}
            >
              {subtitle}
            </p>
          )}

          {children && <div className="mt-6">{children}</div>}
        </div>
      </div>
    </section>
  );
}
