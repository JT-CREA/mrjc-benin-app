"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, X, ChevronRight, Radio } from "lucide-react";

interface TickerItem {
  id: string;
  text: string;
  href?: string;
  urgent?: boolean;
  category?: string;
}

const DEFAULT_ITEMS: TickerItem[] = [
  {
    id: "1",
    text: "Nouveau projet : Appui à la filière manioc dans l'Atacora — 1 200 producteurs bénéficiaires",
    href: "/projects/appui-filiere-manioc-atacora",
    category: "Projet",
  },
  {
    id: "2",
    text: "Recrutement ouvert : Responsable Suivi-Évaluation — Candidatures jusqu'au 30 août 2024",
    href: "/work-with-us/recruitment",
    urgent: true,
    category: "Recrutement",
  },
  {
    id: "3",
    text: "Publication : Rapport d'impact 2023 disponible en téléchargement",
    href: "/resources/annual-reports",
    category: "Publication",
  },
  {
    id: "4",
    text: "MRJC-BÉNIN participe au Forum National du Développement Rural — Cotonou, 15-17 septembre 2024",
    href: "/news",
    category: "Événement",
  },
  {
    id: "5",
    text: "85 000 bénéficiaires touchés en 2023 — Consultez notre tableau de bord d'impact",
    href: "/impact",
    category: "Impact",
  },
];

export default function NewsTicker() {
  const [visible, setVisible] = useState(true);
  const [items] = useState<TickerItem[]>(DEFAULT_ITEMS);
  const [isPaused, setIsPaused] = useState(false);

  if (!visible) return null;

  return (
    <div
      className="bg-primary-900 border-b border-primary-800 h-10 flex items-center
                 overflow-hidden relative z-30 no-print"
      role="marquee"
      aria-label="Informations défilantes"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Label gauche */}
      <div className="flex-shrink-0 flex items-center gap-2 px-4 bg-secondary-500 h-full z-10">
        <motion.span
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Radio className="w-3.5 h-3.5 text-white" />
        </motion.span>
        <span className="text-white text-xs font-bold uppercase tracking-wider whitespace-nowrap">
          En direct
        </span>
      </div>

      {/* Contenu défilant */}
      <div className="flex-1 overflow-hidden relative mx-2">
        <div
          className={`flex items-center gap-12 whitespace-nowrap ${
            isPaused ? "" : "animate-ticker"
          }`}
          style={{ animationPlayState: isPaused ? "paused" : "running" }}
        >
          {/* Dupliquer pour boucle fluide */}
          {[...items, ...items].map((item, index) => (
            <span
              key={`${item.id}-${index}`}
              className="inline-flex items-center gap-2"
            >
              {item.urgent && (
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-500 rounded-full
                                 text-white text-2xs font-bold uppercase"
                >
                  <Zap className="w-2.5 h-2.5" />
                  Urgent
                </span>
              )}
              {item.category && !item.urgent && (
                <span className="text-secondary-400 text-xs font-semibold">
                  [{item.category}]
                </span>
              )}
              {item.href ? (
                <Link
                  href={item.href}
                  className="text-primary-200 text-xs hover:text-white transition-colors
                             inline-flex items-center gap-1 group"
                >
                  {item.text}
                  <ChevronRight
                    className="w-3 h-3 opacity-0 group-hover:opacity-100
                                          group-hover:translate-x-0.5 transition-all"
                  />
                </Link>
              ) : (
                <span className="text-primary-200 text-xs">{item.text}</span>
              )}
              <span className="text-primary-600 mx-4">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* Bouton fermer */}
      <button
        onClick={() => setVisible(false)}
        className="flex-shrink-0 w-8 h-8 flex items-center justify-center mr-2
                   text-primary-400 hover:text-white hover:bg-primary-800
                   rounded-lg transition-colors"
        aria-label="Fermer le bandeau d'informations"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
