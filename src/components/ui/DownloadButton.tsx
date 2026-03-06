"use client";

/**
 * Composant — DownloadButton
 * Bouton de téléchargement avec compteur dynamique intégré.
 * Track automatiquement chaque téléchargement via l'API.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Check, Loader2, FileText } from "lucide-react";
import { useDownloadCounter } from "@/hooks/useVisitorTracker";

interface DownloadButtonProps {
  resourceId: string;
  title: string;
  fileUrl: string;
  fileType?: string;
  fileSize?: string;
  variant?: "primary" | "outline" | "minimal";
  className?: string;
}

export default function DownloadButton({
  resourceId,
  title,
  fileUrl,
  fileType = "PDF",
  fileSize,
  variant = "primary",
  className = "",
}: DownloadButtonProps) {
  const { stats, trackDownload } = useDownloadCounter(resourceId);
  const [state, setState] = useState<"idle" | "loading" | "success">("idle");

  const handleDownload = async () => {
    if (state !== "idle") return;

    setState("loading");

    try {
      // Track le téléchargement
      await trackDownload();

      // Déclencher le téléchargement
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = `${title}.${fileType.toLowerCase()}`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setState("success");
      setTimeout(() => setState("idle"), 2500);
    } catch {
      setState("idle");
    }
  };

  const icons = {
    idle: <Download size={16} />,
    loading: <Loader2 size={16} className="animate-spin" />,
    success: <Check size={16} />,
  };

  const labels = {
    idle: "Télécharger",
    loading: "Préparation...",
    success: "Téléchargé !",
  };

  // ─── Variant: minimal (lien texte) ──────────────────────────────────────────
  if (variant === "minimal") {
    return (
      <button
        onClick={handleDownload}
        disabled={state !== "idle"}
        className={`group inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-800 transition-colors ${className}`}
      >
        <FileText size={14} />
        <span>{title}</span>
        <span className="text-xs text-gray-400">
          ({stats.loading ? "…" : stats.count} téléch.)
        </span>
        <Download
          size={13}
          className="opacity-0 transition-opacity group-hover:opacity-100"
        />
      </button>
    );
  }

  // ─── Variants: primary / outline ────────────────────────────────────────────
  const baseClasses =
    "relative inline-flex items-center gap-2.5 rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed";

  const variantClasses = {
    primary:
      "bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow-md disabled:opacity-70",
    outline:
      "border-2 border-primary-500 text-primary-600 hover:bg-primary-50 disabled:opacity-60",
  };

  const successClasses =
    state === "success" ? "!bg-green-600 !border-green-600 !text-white" : "";

  return (
    <motion.button
      onClick={handleDownload}
      disabled={state !== "idle"}
      whileHover={state === "idle" ? { scale: 1.02 } : {}}
      whileTap={state === "idle" ? { scale: 0.98 } : {}}
      className={`${baseClasses} ${variantClasses[variant]} ${successClasses} ${className}`}
    >
      {icons[state]}
      <span>{labels[state]}</span>

      {/* Badge compteur */}
      {!stats.loading && stats.count > 0 && (
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            variant === "primary"
              ? "bg-white/20 text-white"
              : "bg-primary-100 text-primary-700"
          }`}
        >
          {stats.count}
        </span>
      )}

      {/* Méta fichier */}
      {fileSize && state === "idle" && (
        <span
          className={`ml-1 text-xs ${
            variant === "primary" ? "text-white/70" : "text-gray-400"
          }`}
        >
          {fileType} · {fileSize}
        </span>
      )}
    </motion.button>
  );
}
