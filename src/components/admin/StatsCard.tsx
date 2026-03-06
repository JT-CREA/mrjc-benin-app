"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  trend?: number; // % de variation
  trendLabel?: string;
  icon: React.ElementType;
  iconColor?: string;
  iconBg?: string;
  description?: string;
  href?: string;
  loading?: boolean;
}

export default function StatsCard({
  title,
  value,
  trend,
  trendLabel = "vs mois dernier",
  icon: Icon,
  iconColor = "text-primary-600",
  iconBg = "bg-primary-50",
  description,
  href,
  loading = false,
}: StatsCardProps) {
  const trendPositive = (trend ?? 0) >= 0;
  const trendNeutral = trend === 0 || trend === undefined;

  const TrendIcon = trendNeutral
    ? Minus
    : trendPositive
      ? TrendingUp
      : TrendingDown;
  const trendColor = trendNeutral
    ? "text-gray-400"
    : trendPositive
      ? "text-green-600"
      : "text-red-500";
  const trendBg = trendNeutral
    ? "bg-gray-50"
    : trendPositive
      ? "bg-green-50"
      : "bg-red-50";

  const Wrapper = href ? "a" : "div";

  return (
    <motion.div
      whileHover={href ? { scale: 1.02, y: -2 } : {}}
      transition={{ duration: 0.15 }}
    >
      <Wrapper
        href={href}
        className={`block rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow ${href ? "cursor-pointer hover:shadow-md" : ""}`}
      >
        {loading ? (
          <div className="animate-pulse space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 rounded bg-gray-200" />
              <div className="h-10 w-10 rounded-xl bg-gray-200" />
            </div>
            <div className="h-8 w-20 rounded bg-gray-200" />
            <div className="h-3 w-32 rounded bg-gray-200" />
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-start justify-between">
              <p className="text-sm font-medium text-gray-500">{title}</p>
              <div className={`rounded-xl p-2.5 ${iconBg}`}>
                <Icon size={20} className={iconColor} />
              </div>
            </div>

            <div className="mb-2">
              <span className="text-3xl font-bold text-gray-900">{value}</span>
            </div>

            {(trend !== undefined || description) && (
              <div className="flex items-center gap-2">
                {trend !== undefined && (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${trendBg} ${trendColor}`}
                  >
                    <TrendIcon size={11} />
                    {Math.abs(trend)}%
                  </span>
                )}
                <span className="text-xs text-gray-400">
                  {description || trendLabel}
                </span>
              </div>
            )}
          </>
        )}
      </Wrapper>
    </motion.div>
  );
}
