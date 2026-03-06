"use client";

/**
 * Page — Hors Ligne (PWA Offline)
 * Route: /offline
 * Affichée automatiquement par le Service Worker quand l'utilisateur
 * est hors connexion et tente d'accéder à une page non mise en cache.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  WifiOff,
  RefreshCw,
  Home,
  BookOpen,
  FolderOpen,
  Phone,
  Leaf,
} from "lucide-react";

const CACHED_PAGES = [
  {
    label: "Accueil",
    href: "/",
    icon: Home,
    desc: "Page principale MRJC-BÉNIN",
  },
  {
    label: "Nos Projets",
    href: "/projects",
    icon: FolderOpen,
    desc: "Portefeuille de projets",
  },
  {
    label: "Ressources",
    href: "/resources",
    icon: BookOpen,
    desc: "Publications et guides",
  },
  { label: "Contact", href: "/contact", icon: Phone, desc: "Nous joindre" },
];

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  function handleRetry() {
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      if (navigator.onLine) {
        window.location.href = "/";
      }
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-gray-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 mb-10"
        >
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-display font-bold text-lg">
            MRJC-BÉNIN
          </span>
        </motion.div>

        {/* Icône principale */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <WifiOff className="w-12 h-12 text-white/70" />
        </motion.div>

        {/* Texte */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl font-display font-bold text-white mb-3">
            Vous êtes hors ligne
          </h1>
          <p className="text-primary-300 text-base mb-2">
            Impossible de charger cette page sans connexion Internet.
          </p>
          <p className="text-primary-400 text-sm mb-8">
            Certaines pages consultées récemment sont disponibles hors connexion
            ci-dessous.
          </p>
        </motion.div>

        {/* Statut connexion */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              isOnline
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-red-500/20 text-red-400 border border-red-500/30"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full animate-pulse ${isOnline ? "bg-green-400" : "bg-red-400"}`}
            />
            {isOnline ? "Connexion rétablie !" : "Aucune connexion détectée"}
          </div>
        </motion.div>

        {/* Bouton retry */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-10"
        >
          <button
            onClick={handleRetry}
            disabled={checking}
            className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors disabled:opacity-60"
          >
            <RefreshCw
              className={`w-4 h-4 ${checking ? "animate-spin" : ""}`}
            />
            {checking ? "Vérification…" : "Réessayer"}
          </button>
        </motion.div>

        {/* Pages en cache */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-primary-400 text-xs uppercase tracking-wider font-medium mb-4">
            Pages disponibles hors ligne
          </p>
          <div className="grid grid-cols-2 gap-3">
            {CACHED_PAGES.map((page, i) => (
              <motion.div
                key={page.href}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.45 + i * 0.05 }}
              >
                <Link
                  href={page.href}
                  className="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all group"
                >
                  <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                    <page.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">{page.label}</span>
                  <span className="text-2xs text-primary-400 text-center">
                    {page.desc}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-primary-600 text-xs mt-10"
        >
          Mouvement Rural de Jeunesse Chrétienne du Bénin — Depuis 1985
        </motion.p>
      </div>
    </div>
  );
}
