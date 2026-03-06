"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, Settings, CheckCircle, Shield } from "lucide-react";

type ConsentState = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
};

const COOKIE_KEY = "mrjc_cookie_consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState<ConsentState>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_KEY);
    if (!stored) {
      setTimeout(() => setVisible(true), 1500);
    }
  }, []);

  const saveConsent = (consentData: ConsentState) => {
    localStorage.setItem(
      COOKIE_KEY,
      JSON.stringify({
        ...consentData,
        timestamp: new Date().toISOString(),
      }),
    );
    setVisible(false);
  };

  const acceptAll = () => {
    const all = { necessary: true, analytics: true, marketing: true };
    setConsent(all);
    saveConsent(all);
  };

  const acceptNecessary = () => {
    const necessary = { necessary: true, analytics: false, marketing: false };
    setConsent(necessary);
    saveConsent(necessary);
  };

  const saveCustom = () => saveConsent(consent);

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Overlay léger */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[90]"
            aria-hidden="true"
          />

          {/* Banner */}
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6
                       md:max-w-lg bg-white rounded-2xl shadow-2xl border border-neutral-100 z-[100]
                       overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Consentement aux cookies"
          >
            {/* En-tête */}
            <div className="flex items-start justify-between p-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                  <Cookie className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-base text-neutral-900">
                    Cookies & Confidentialité
                  </h2>
                  <p className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                    <Shield className="w-3 h-3 text-primary-500" />
                    MRJC-BÉNIN respecte votre vie privée
                  </p>
                </div>
              </div>
              <button
                onClick={acceptNecessary}
                className="text-neutral-400 hover:text-neutral-600 transition-colors p-1"
                aria-label="Refuser et fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Contenu */}
            <div className="px-5 pb-4">
              <p className="text-sm text-neutral-600 leading-relaxed">
                Nous utilisons des cookies pour améliorer votre expérience de
                navigation, analyser notre audience et personnaliser les
                contenus. Vous pouvez accepter tous les cookies ou gérer vos
                préférences.{" "}
                <Link
                  href="/cookie-policy"
                  className="text-primary-600 hover:underline font-medium"
                >
                  En savoir plus
                </Link>
              </p>

              {/* Détails cookies */}
              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 space-y-3 overflow-hidden"
                  >
                    {[
                      {
                        key: "necessary" as const,
                        label: "Cookies nécessaires",
                        description:
                          "Indispensables au fonctionnement du site.",
                        locked: true,
                      },
                      {
                        key: "analytics" as const,
                        label: "Cookies analytiques",
                        description:
                          "Nous aident à comprendre comment vous utilisez le site.",
                        locked: false,
                      },
                      {
                        key: "marketing" as const,
                        label: "Cookies marketing",
                        description:
                          "Utilisés pour personnaliser les contenus.",
                        locked: false,
                      },
                    ].map((cookie) => (
                      <div
                        key={cookie.key}
                        className="flex items-start justify-between gap-3 p-3 bg-neutral-50
                                      rounded-xl"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-neutral-800">
                            {cookie.label}
                          </div>
                          <div className="text-xs text-neutral-500 mt-0.5">
                            {cookie.description}
                          </div>
                        </div>
                        {cookie.locked ? (
                          <div className="flex items-center gap-1 text-xs text-primary-600 flex-shrink-0">
                            <CheckCircle className="w-4 h-4" />
                            <span>Requis</span>
                          </div>
                        ) : (
                          <button
                            role="switch"
                            aria-checked={consent[cookie.key]}
                            onClick={() =>
                              setConsent((prev) => ({
                                ...prev,
                                [cookie.key]: !prev[cookie.key],
                              }))
                            }
                            className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0
                                        focus-visible:outline-none focus-visible:ring-2
                                        focus-visible:ring-primary-500
                                        ${consent[cookie.key] ? "bg-primary-500" : "bg-neutral-300"}`}
                          >
                            <span
                              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full
                                          shadow-sm transition-transform
                                          ${consent[cookie.key] ? "translate-x-5" : "translate-x-0"}`}
                            />
                          </button>
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="px-5 pb-5 space-y-2">
              <div className="flex gap-2">
                <button
                  onClick={acceptAll}
                  className="flex-1 bg-primary-500 text-white py-2.5 rounded-xl text-sm
                             font-semibold hover:bg-primary-600 transition-colors"
                >
                  Tout accepter
                </button>
                <button
                  onClick={acceptNecessary}
                  className="flex-1 border border-neutral-300 text-neutral-700 py-2.5 rounded-xl
                             text-sm font-semibold hover:border-neutral-400 transition-colors"
                >
                  Refuser
                </button>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="inline-flex items-center gap-1.5 text-xs text-neutral-500
                             hover:text-primary-600 transition-colors font-medium"
                >
                  <Settings className="w-3.5 h-3.5" />
                  {showDetails ? "Masquer les détails" : "Personnaliser"}
                </button>

                {showDetails && (
                  <button
                    onClick={saveCustom}
                    className="text-xs text-primary-600 font-semibold hover:underline"
                  >
                    Sauvegarder mes choix
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
