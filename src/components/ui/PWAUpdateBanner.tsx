"use client";

/**
 * Composant — PWAUpdateBanner
 * Bannière de mise à jour PWA affichée quand une nouvelle version est disponible.
 */

import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Download } from "lucide-react";
import { useServiceWorker } from "@/hooks/useServiceWorker";

export default function PWAUpdateBanner() {
  const { updateAvailable, applyUpdate } = useServiceWorker();

  return (
    <AnimatePresence>
      {updateAvailable && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] w-full max-w-sm mx-4"
        >
          <div className="bg-primary-700 text-white rounded-2xl shadow-2xl px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <Download className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">Mise à jour disponible</p>
              <p className="text-xs text-primary-200 mt-0.5">
                Une nouvelle version du site est prête
              </p>
            </div>
            <button
              onClick={applyUpdate}
              className="flex items-center gap-1.5 bg-white text-primary-700 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-primary-50 transition-colors shrink-0"
            >
              <RefreshCw className="w-3 h-3" />
              Mettre à jour
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
