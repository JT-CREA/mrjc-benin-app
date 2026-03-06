"use client";

import { useState } from "react";
import {
  Facebook,
  Twitter,
  Linkedin,
  Link2,
  Check,
  Share2,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ArticleShareButtonsProps {
  title: string;
  slug: string;
  showLabel?: boolean;
}

export default function ArticleShareButtons({
  title,
  slug,
  showLabel = false,
}: ArticleShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://mrjc-benin.org";
  const url = `${baseUrl}${slug}`;
  const encoded = encodeURIComponent(url);
  const titleEnc = encodeURIComponent(title);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* silent */
    }
  };

  const handleShare = (shareUrl: string) => {
    window.open(shareUrl, "_blank", "width=600,height=400,noopener,noreferrer");
  };

  const buttons = [
    {
      label: "Facebook",
      Icon: Facebook,
      onClick: () =>
        handleShare(`https://www.facebook.com/sharer/sharer.php?u=${encoded}`),
      className: "hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]",
    },
    {
      label: "Twitter/X",
      Icon: Twitter,
      onClick: () =>
        handleShare(
          `https://twitter.com/intent/tweet?url=${encoded}&text=${titleEnc}`,
        ),
      className:
        "hover:bg-neutral-900 hover:text-white hover:border-neutral-900",
    },
    {
      label: "LinkedIn",
      Icon: Linkedin,
      onClick: () =>
        handleShare(
          `https://www.linkedin.com/shareArticle?mini=true&url=${encoded}&title=${titleEnc}`,
        ),
      className: "hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]",
    },
    {
      label: copied ? "Copié !" : "Copier le lien",
      Icon: copied ? Check : Link2,
      onClick: handleCopy,
      className: copied
        ? "bg-green-50 text-green-600 border-green-300"
        : "hover:bg-neutral-100",
    },
  ];

  if (showLabel) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-neutral-500 font-medium flex items-center gap-1.5">
          <Share2 className="w-4 h-4" />
          Partager
        </span>
        {buttons.map(({ label, Icon, onClick, className }) => (
          <button
            key={label}
            onClick={onClick}
            title={label}
            aria-label={label}
            className={cn(
              "w-8 h-8 rounded-lg border border-neutral-200 flex items-center justify-center",
              "text-neutral-500 transition-all duration-200",
              className,
            )}
          >
            <Icon className="w-4 h-4" />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {buttons.map(({ label, Icon, onClick, className }) => (
        <button
          key={label}
          onClick={onClick}
          title={label}
          aria-label={label}
          className={cn(
            "w-8 h-8 rounded-lg border border-neutral-200 flex items-center justify-center",
            "text-neutral-500 transition-all duration-200",
            className,
          )}
        >
          <Icon className="w-3.5 h-3.5" />
        </button>
      ))}
    </div>
  );
}
