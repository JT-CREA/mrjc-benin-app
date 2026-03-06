"use client";

/**
 * Composant — WhatsAppButton
 * Bouton flottant WhatsApp persistant sur toutes les pages.
 * - Apparaît après 3 secondes de navigation
 * - Animation pulse + tooltip au survol
 * - Disparaît si scroll vers le haut (non intrusif)
 * - Lien direct avec message pré-rempli
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";

const WHATSAPP_MESSAGE = encodeURIComponent(
  `Bonjour MRJC-BÉNIN ! Je vous contacte depuis votre site web. Je souhaite obtenir des informations sur vos activités.`,
);

export default function WhatsAppButton() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Apparaît après 3 secondes
    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Expand bref tooltip au départ
    if (visible && !dismissed) {
      const t = setTimeout(() => setExpanded(true), 500);
      const t2 = setTimeout(() => setExpanded(false), 5000);
      return () => {
        clearTimeout(t);
        clearTimeout(t2);
      };
    }
  }, [visible, dismissed]);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2"
        >
          {/* Tooltip message */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.9 }}
                className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 max-w-[220px] relative"
              >
                {/* Flèche */}
                <div className="absolute bottom-4 -right-2 w-4 h-4 bg-white border-r border-b border-gray-100 rotate-45 transform" />

                <div className="flex items-start gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">
                      MRJC-BÉNIN
                    </p>
                    <p className="text-2xs text-green-600">● En ligne</p>
                  </div>
                  <button
                    onClick={() => setExpanded(false)}
                    className="ml-auto text-gray-300 hover:text-gray-500 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-gray-600 mb-3">
                  Bonjour ! 👋 Comment pouvons-nous vous aider aujourd'hui ?
                </p>
                <a
                  href={`https://wa.me/${+22997120627}?text=${WHATSAPP_MESSAGE}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center py-2 bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs font-semibold rounded-xl transition-colors"
                >
                  Démarrer la conversation
                </a>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bouton principal */}
          <div className="relative flex items-center">
            {/* Ping animé */}
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-30 animate-ping" />

            <a
              href={`https://wa.me/${+22997120627}?text=${WHATSAPP_MESSAGE}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contacter MRJC-BÉNIN sur WhatsApp"
              onClick={() => setExpanded(false)}
              className="relative w-14 h-14 bg-[#25D366] hover:bg-[#20BA5A] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
            >
              {/* SVG WhatsApp */}
              <svg
                viewBox="0 0 24 24"
                className="w-7 h-7 fill-white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>

            {/* Bouton fermer (discret) */}
            <button
              onClick={() => setDismissed(true)}
              aria-label="Masquer le bouton WhatsApp"
              className="absolute -top-1 -left-1 w-5 h-5 bg-gray-500 hover:bg-gray-700 rounded-full flex items-center justify-center text-white opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity shadow"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
