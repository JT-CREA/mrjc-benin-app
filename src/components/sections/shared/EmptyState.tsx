/**
 * EmptyState — Composant partagé
 * État vide générique avec icône, titre, message et action.
 */

import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { SearchX, FolderOpen, FileX, WifiOff } from "lucide-react";

type EmptyVariant = "search" | "list" | "file" | "offline" | "custom";

interface EmptyStateProps {
  variant?: EmptyVariant;
  emoji?: string;
  title?: string;
  description?: string;
  action?: { label: string; href?: string; onClick?: () => void };
  className?: string;
}

const VARIANTS: Record<
  EmptyVariant,
  { icon: React.ElementType; title: string; description: string }
> = {
  search: {
    icon: SearchX,
    title: "Aucun résultat",
    description:
      "Aucun élément ne correspond à votre recherche. Essayez d'autres termes.",
  },
  list: {
    icon: FolderOpen,
    title: "Liste vide",
    description: "Aucun élément disponible pour le moment.",
  },
  file: {
    icon: FileX,
    title: "Fichier introuvable",
    description: "Ce contenu n'existe pas ou a été déplacé.",
  },
  offline: {
    icon: WifiOff,
    title: "Hors connexion",
    description: "Vérifiez votre connexion internet et réessayez.",
  },
  custom: { icon: FolderOpen, title: "", description: "" },
};

export default function EmptyState({
  variant = "list",
  emoji,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const cfg = VARIANTS[variant];
  const Icon = cfg.icon;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-6 text-center",
        className,
      )}
    >
      {emoji ? (
        <div className="text-5xl mb-4" aria-hidden="true">
          {emoji}
        </div>
      ) : (
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-gray-400" />
        </div>
      )}

      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title ?? cfg.title}
      </h3>
      <p className="text-sm text-gray-500 max-w-sm">
        {description ?? cfg.description}
      </p>

      {action && (
        <div className="mt-6">
          {action.href ? (
            <Link href={action.href} className="btn-primary">
              {action.label}
            </Link>
          ) : (
            <button onClick={action.onClick} className="btn-primary">
              {action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
