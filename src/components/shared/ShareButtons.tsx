"use client";

/**
 * components/shared/ShareButtons.tsx
 * Boutons de partage réseaux sociaux + copie de lien
 * Conforme RGPD : pas de SDK tiers chargé, liens directs uniquement
 */

import { useState, useCallback } from "react";
import { Twitter, Facebook, Linkedin, Mail, Link2, Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ShareButtonsProps {
  url?: string;
  title?: string;
  description?: string;
  hashtags?: string[];
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "rounded" | "pill" | "square";
  className?: string;
}

const sizeMap = {
  sm: { btn: "h-8 w-8", icon: 16 },
  md: { btn: "h-10 w-10", icon: 18 },
  lg: { btn: "h-12 w-12", icon: 20 },
};

type Platform = "twitter" | "facebook" | "linkedin" | "email" | "copy";

interface ShareConfig {
  label: string;
  color: string;
  icon: typeof Twitter;
  getUrl?: (
    url: string,
    title: string,
    description: string,
    hashtags: string[],
  ) => string;
}

const PLATFORMS: Record<Platform, ShareConfig> = {
  twitter: {
    label: "Twitter / X",
    color: "bg-black hover:bg-gray-800 text-white",
    icon: Twitter,
    getUrl: (url, title, _, hashtags) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}${hashtags.length ? `&hashtags=${hashtags.join(",")}` : ""}`,
  },
  facebook: {
    label: "Facebook",
    color: "bg-[#1877F2] hover:bg-[#1465d0] text-white",
    icon: Facebook,
    getUrl: (url) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  linkedin: {
    label: "LinkedIn",
    color: "bg-[#0A66C2] hover:bg-[#0855a0] text-white",
    icon: Linkedin,
    getUrl: (url, title) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  },
  email: {
    label: "Email",
    color: "bg-gray-600 hover:bg-gray-700 text-white",
    icon: Mail,
    getUrl: (url, title, description) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\n${url}`)}`,
  },
  copy: {
    label: "Copier le lien",
    color: "bg-green-600 hover:bg-green-700 text-white",
    icon: Link2,
  },
};

const RADIUS = {
  rounded: "rounded-lg",
  pill: "rounded-full",
  square: "rounded",
};

export default function ShareButtons({
  url,
  title = "MRJC-BÉNIN",
  description = "",
  hashtags = ["MRJCBENIN", "Bénin"],
  showLabel = false,
  size = "md",
  variant = "pill",
  className,
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const currentUrl =
    url ?? (typeof window !== "undefined" ? window.location.href : "");
  const { btn: btnSize, icon: iconSize } = sizeMap[size];
  const radius = RADIUS[variant];

  const handleShare = useCallback(
    (platform: Platform) => {
      if (platform === "copy") {
        navigator.clipboard.writeText(currentUrl).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
        return;
      }

      const config = PLATFORMS[platform];
      if (!config.getUrl) return;
      const shareUrl = config.getUrl(currentUrl, title, description, hashtags);
      window.open(
        shareUrl,
        "_blank",
        "width=640,height=480,noopener,noreferrer",
      );
    },
    [currentUrl, title, description, hashtags],
  );

  const platforms: Platform[] = [
    "twitter",
    "facebook",
    "linkedin",
    "email",
    "copy",
  ];

  return (
    <div
      className={cn("flex items-center gap-2 flex-wrap", className)}
      aria-label="Partager cet article"
    >
      {showLabel && (
        <span className="text-sm text-gray-500 font-medium mr-1">
          Partager :
        </span>
      )}

      {platforms.map((platform) => {
        const { label, color, icon: Icon } = PLATFORMS[platform];
        const isCopyDone = platform === "copy" && copied;

        return (
          <button
            key={platform}
            onClick={() => handleShare(platform)}
            aria-label={isCopyDone ? "Lien copié !" : `Partager sur ${label}`}
            title={isCopyDone ? "Lien copié !" : label}
            className={cn(
              "inline-flex items-center justify-center gap-2 transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              "focus-visible:ring-green-600 active:scale-95",
              btnSize,
              radius,
              color,
              showLabel ? "px-4 w-auto" : "",
            )}
          >
            {isCopyDone ? <Check size={iconSize} /> : <Icon size={iconSize} />}
            {showLabel && (
              <span className="text-sm font-medium whitespace-nowrap">
                {isCopyDone ? "Copié !" : label}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
