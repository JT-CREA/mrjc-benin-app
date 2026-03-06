"use client";

/**
 * components/shared/Button.tsx
 * Composant Button universel — Design system MRJC-BÉNIN
 * Variants : primary | secondary | outline | ghost | danger | link
 * Sizes    : xs | sm | md | lg | xl
 */

import React, { forwardRef, type ButtonHTMLAttributes } from "react";
import Link, { type LinkProps } from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/* ─── Types ──────────────────────────────────────────────────────────────── */
type Variant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "link";
type Size = "xs" | "sm" | "md" | "lg" | "xl";
type IconPos = "left" | "right";

interface BaseButtonProps {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPos?: IconPos;
  fullWidth?: boolean;
  rounded?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/* Button natif */
type ButtonProps = BaseButtonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
    href?: undefined;
  };

/* Button-as-Link */
type LinkButtonProps = BaseButtonProps &
  Omit<LinkProps, "href"> & {
    href: string;
    target?: string;
    rel?: string;
  };

type CombinedProps = ButtonProps | LinkButtonProps;

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 " +
    "focus-visible:ring-primary-500 shadow-sm hover:shadow-md disabled:bg-primary-300",
  secondary:
    "bg-secondary-500 text-white hover:bg-secondary-600 active:bg-secondary-700 " +
    "focus-visible:ring-secondary-400 shadow-sm hover:shadow-md disabled:bg-secondary-300",
  outline:
    "border-2 border-primary-600 text-primary-700 bg-transparent " +
    "hover:bg-primary-50 active:bg-primary-100 focus-visible:ring-primary-500 disabled:border-gray-300 disabled:text-gray-400",
  ghost:
    "text-primary-700 bg-transparent hover:bg-primary-50 active:bg-primary-100 " +
    "focus-visible:ring-primary-400 disabled:text-gray-400",
  danger:
    "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 " +
    "focus-visible:ring-red-500 shadow-sm hover:shadow-md disabled:bg-red-300",
  link:
    "text-primary-600 hover:text-primary-800 underline-offset-4 hover:underline " +
    "focus-visible:ring-primary-400 p-0 h-auto disabled:text-gray-400",
};

const SIZE_CLASSES: Record<Size, string> = {
  xs: "text-xs  px-2.5 py-1    gap-1    h-7",
  sm: "text-sm  px-3.5 py-1.5  gap-1.5  h-8",
  md: "text-sm  px-4.5 py-2.5  gap-2    h-10",
  lg: "text-base px-6  py-3    gap-2.5  h-12",
  xl: "text-lg  px-8   py-3.5  gap-3    h-14",
};

const ICON_SIZES: Record<Size, string> = {
  xs: "w-3 h-3",
  sm: "w-3.5 h-3.5",
  md: "w-4 h-4",
  lg: "w-5 h-5",
  xl: "w-6 h-6",
};

/* ─── Composant ──────────────────────────────────────────────────────────── */
const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, CombinedProps>(
  (props, ref) => {
    const {
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      iconPos = "left",
      fullWidth = false,
      rounded = false,
      className,
      children,
      ...rest
    } = props;

    const isLink = "href" in props && props.href !== undefined;

    const baseClass = cn(
      // Base
      "inline-flex items-center justify-center font-semibold transition-all duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-60",
      "select-none",
      // Variant
      VARIANT_CLASSES[variant],
      // Size (skip for link variant)
      variant !== "link" && SIZE_CLASSES[size],
      // Shapes
      rounded ? "rounded-full" : "rounded-xl",
      // Width
      fullWidth && "w-full",
      className,
    );

    const iconClass = ICON_SIZES[size];

    const content = (
      <>
        {loading && (
          <Loader2
            className={cn(
              iconClass,
              "animate-spin",
              children
                ? iconPos === "left"
                  ? "-ml-0.5"
                  : "order-last -mr-0.5"
                : "",
            )}
            aria-hidden
          />
        )}
        {!loading && icon && iconPos === "left" && (
          <span className={cn(iconClass, "shrink-0 -ml-0.5")} aria-hidden>
            {icon}
          </span>
        )}
        {children && <span className="truncate">{children}</span>}
        {!loading && icon && iconPos === "right" && (
          <span
            className={cn(iconClass, "shrink-0 -mr-0.5 order-last")}
            aria-hidden
          >
            {icon}
          </span>
        )}
      </>
    );

    if (isLink) {
      const { href, target, rel, ...linkRest } = rest as LinkButtonProps;
      return (
        <Link
          href={href}
          target={target}
          rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
          className={baseClass}
          ref={ref as React.Ref<HTMLAnchorElement>}
          {...linkRest}
        >
          {content}
        </Link>
      );
    }

    const { type = "button", disabled, ...btnRest } = rest as ButtonProps;
    return (
      <button
        type={type}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        aria-busy={loading}
        className={baseClass}
        ref={ref as React.Ref<HTMLButtonElement>}
        {...btnRest}
      >
        {content}
      </button>
    );
  },
);

Button.displayName = "Button";
export default Button;
export type {
  ButtonProps,
  LinkButtonProps,
  Variant as ButtonVariant,
  Size as ButtonSize,
};
