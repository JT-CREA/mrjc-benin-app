"use client";

/**
 * Layout — Admin
 * Conteneur principal du panel admin.
 * - Authentification guard
 * - Sidebar collapsible
 * - Topbar contextuelle
 * - Notifications en temps réel
 */

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Search,
  Menu,
  X,
  Sun,
  Moon,
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import type { AdminUser } from "@/lib/admin/auth";

// ─── Breadcrumb mapping ───────────────────────────────────────────────────────
const BREADCRUMB_MAP: Record<string, string> = {
  "/admin": "Vue d'ensemble",
  "/admin/analytics": "Analytiques",
  "/admin/projects": "Projets",
  "/admin/domains": "Domaines",
  "/admin/news": "Actualités",
  "/admin/blog": "Blog",
  "/admin/resources": "Ressources",
  "/admin/videos": "Vidéothèque",
  "/admin/team": "Équipe",
  "/admin/partners": "Partenaires",
  "/admin/newsletter": "Newsletter",
  "/admin/messages": "Messages",
  "/admin/media": "Médiathèque",
  "/admin/users": "Utilisateurs",
  "/admin/settings": "Paramètres",
};

// ─── Layout ───────────────────────────────────────────────────────────────────
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ─── Guard: redirection si non authentifié ────────────────────────────────
  useEffect(() => {
    if (pathname === "/admin/login") {
      setLoading(false);
      return;
    }

    if (!isAdminAuthenticated()) {
      router.replace("/admin/login");
      return;
    }

    const stored = sessionStorage.getItem("mrjc_admin_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        /* */
      }
    }

    setLoading(false);
  }, [pathname, router]);

  // Si page de login, rendre directement sans layout
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Loading guard
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
          <p className="text-sm text-gray-400">
            Vérification des droits d'accès...
          </p>
        </div>
      </div>
    );
  }

  // ─── Breadcrumbs ──────────────────────────────────────────────────────────
  const pageName = BREADCRUMB_MAP[pathname] ?? "Page";
  const crumbs = [
    { label: "Admin", href: "/admin" },
    ...(pathname !== "/admin" ? [{ label: pageName, href: pathname }] : []),
  ];

  // ─── Notifications démo ───────────────────────────────────────────────────
  const notifications = [
    {
      id: 1,
      type: "message",
      text: "3 nouveaux messages reçus",
      time: "Il y a 5 min",
      read: false,
    },
    {
      id: 2,
      type: "project",
      text: 'Projet "PROCASE II" mis à jour',
      time: "Il y a 1h",
      read: false,
    },
    {
      id: 3,
      type: "newsletter",
      text: "12 nouveaux abonnés newsletter",
      time: "Il y a 2h",
      read: true,
    },
    {
      id: 4,
      type: "user",
      text: "Nouveau compte éditeur créé",
      time: "Il y a 1 jour",
      read: true,
    },
  ];
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div
      className={`flex h-screen overflow-hidden ${darkMode ? "dark" : ""} bg-gray-50`}
    >
      {/* Sidebar Desktop */}
      <div className="hidden md:flex">
        <AdminSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((c) => !c)}
          user={user}
        />
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="fixed inset-y-0 left-0 z-50 md:hidden"
            >
              <AdminSidebar
                collapsed={false}
                onToggle={() => setMobileMenuOpen(false)}
                user={user}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6">
          {/* Left: Mobile menu + breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>

            {/* Breadcrumb */}
            <nav className="hidden items-center gap-1.5 text-sm sm:flex">
              {crumbs.map((crumb, i) => (
                <span key={crumb.href} className="flex items-center gap-1.5">
                  {i > 0 && (
                    <ChevronRight size={13} className="text-gray-300" />
                  )}
                  {i === crumbs.length - 1 ? (
                    <span className="font-semibold text-gray-800">
                      {crumb.label}
                    </span>
                  ) : (
                    <a
                      href={crumb.href}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {crumb.label}
                    </a>
                  )}
                </span>
              ))}
            </nav>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100">
              <Search size={18} />
            </button>

            {/* Refresh */}
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100"
              title="Actualiser"
            >
              <RefreshCw size={17} />
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode((d) => !d)}
              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100"
            >
              {darkMode ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications((s) => !s)}
                className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                    className="absolute right-0 top-full z-50 mt-2 w-80 rounded-2xl border border-gray-100 bg-white shadow-xl"
                  >
                    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                      <span className="text-sm font-semibold text-gray-800">
                        Notifications
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                          {unreadCount} non lues
                        </span>
                        <button onClick={() => setShowNotifications(false)}>
                          <X size={14} className="text-gray-400" />
                        </button>
                      </div>
                    </div>
                    <ul className="py-2">
                      {notifications.map((notif) => (
                        <li
                          key={notif.id}
                          className={`px-4 py-3 hover:bg-gray-50 ${!notif.read ? "border-l-2 border-primary-500 bg-primary-50/30" : ""}`}
                        >
                          <p
                            className={`text-sm ${!notif.read ? "font-medium text-gray-800" : "text-gray-600"}`}
                          >
                            {notif.text}
                          </p>
                          <p className="mt-0.5 text-xs text-gray-400">
                            {notif.time}
                          </p>
                        </li>
                      ))}
                    </ul>
                    <div className="border-t border-gray-100 px-4 py-2.5">
                      <button className="text-xs font-medium text-primary-600 hover:underline">
                        Tout marquer comme lu
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User avatar */}
            {user && (
              <div className="ml-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-sm font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
