"use client";

/**
 * Composant — YouTubeEmbed
 * Intégration vidéo YouTube optimisée :
 * - Thumbnail personnalisée avec play button animé
 * - Lazy loading (iframe chargé au clic uniquement)
 * - Aspect ratio 16:9 responsive
 * - Caption optionnelle
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, ExternalLink, Youtube } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
  caption?: string;
  thumbnailQuality?: "default" | "hqdefault" | "mqdefault" | "maxresdefault";
  className?: string;
  showChannelBadge?: boolean;
  autoplay?: boolean;
}

export default function YouTubeEmbed({
  videoId,
  title = "Vidéo MRJC-BÉNIN",
  caption,
  thumbnailQuality = "maxresdefault",
  className,
  showChannelBadge = true,
  autoplay = true,
}: YouTubeEmbedProps) {
  const [playing, setPlaying] = useState(false);

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/${thumbnailQuality}.jpg`;
  const embedUrl = `https://www.youtube.com/embed/${videoId}?${autoplay ? "autoplay=1&" : ""}rel=0&modestbranding=1&color=white`;
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;

  return (
    <figure
      className={cn(
        "relative overflow-hidden rounded-2xl shadow-lg group",
        className,
      )}
    >
      {/* Aspect ratio 16:9 */}
      <div className="relative" style={{ paddingBottom: "56.25%" }}>
        {!playing ? (
          /* Thumbnail avec bouton play */
          <motion.div
            className="absolute inset-0 cursor-pointer"
            onClick={() => setPlaying(true)}
          >
            {/* Thumbnail image */}
            <img
              src={thumbnailUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                // Fallback vers qualité inférieure si maxresdefault indisponible
                (e.target as HTMLImageElement).src =
                  `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
              }}
            />

            {/* Overlay dégradé */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

            {/* Bouton Play */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                {/* Cercle pulsant */}
                <div className="absolute inset-0 rounded-full bg-white opacity-20 scale-110 animate-pulse" />
                {/* Bouton principal */}
                <div className="w-16 h-16 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center shadow-2xl transition-colors">
                  <Play className="w-7 h-7 text-white fill-white ml-1" />
                </div>
              </motion.div>
            </div>

            {/* Badge YouTube */}
            {showChannelBadge && (
              <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
                <Youtube className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                YouTube
              </div>
            )}

            {/* Titre */}
            {title && (
              <div className="absolute bottom-3 left-3 right-12">
                <p className="text-white text-sm font-medium line-clamp-2 drop-shadow">
                  {title}
                </p>
              </div>
            )}

            {/* Lien externe */}
            <a
              href={watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label="Ouvrir sur YouTube"
              className="absolute bottom-3 right-3 w-8 h-8 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-white" />
            </a>
          </motion.div>
        ) : (
          /* Iframe YouTube */
          <iframe
            className="absolute inset-0 w-full h-full"
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        )}
      </div>

      {/* Légende */}
      {caption && (
        <figcaption className="px-4 py-2 bg-gray-50 text-xs text-gray-500 italic border-t border-gray-100">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

// ─── Grille YouTube ───────────────────────────────────────────────────────────
interface VideoItem {
  videoId: string;
  title: string;
  caption?: string;
}

interface YouTubeGridProps {
  videos: VideoItem[];
  columns?: 1 | 2 | 3;
  className?: string;
}

export function YouTubeGrid({
  videos,
  columns = 2,
  className,
}: YouTubeGridProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  };
  return (
    <div className={cn(`grid ${gridCols[columns]} gap-4`, className)}>
      {videos.map((v) => (
        <YouTubeEmbed key={v.videoId} {...v} />
      ))}
    </div>
  );
}
