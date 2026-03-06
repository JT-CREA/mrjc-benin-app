"use client";

/**
 * Composant — AdminSidebar
 * Navigation latérale du panel admin avec :
 * - Modules groupés par catégorie
 * - Indicateurs de statut / badges
 * - Mode compressé / étendu
 * - Déconnexion
 */

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FolderOpen,
  Newspaper,
  BookOpen,
  FileText,
  Users,
  Handshake,
  Globe2,
  MessageSquare,
  Mail,
  BarChart2,
  Settings,
  Image,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ShieldCheck,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { clearAdminToken } from "@/lib/admin/auth";

// ─── Types ────────────────────────────────────────────────────────────────────
interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number | string;
  badgeColor?: string;
  isNew?: boolean;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

// ─── Structure de navigation ──────────────────────────────────────────────────
const NAV_GROUPS: NavGroup[] = [
  {
    title: "Tableau de bord",
    items: [
      { label: "Vue d'ensemble", href: "/admin", icon: LayoutDashboard },
      { label: "Analytiques", href: "/admin/analytics", icon: BarChart2 },
    ],
  },
  {
    title: "Contenu",
    items: [
      {
        label: "Projets",
        href: "/admin/projects",
        icon: FolderOpen,
        badge: 12,
      },
      { label: "Domaines", href: "/admin/domains", icon: Globe2, badge: 5 },
      {
        label: "Actualités",
        href: "/admin/news",
        icon: Newspaper,
        badge: 3,
        badgeColor: "bg-red-500",
      },
      { label: "Blog", href: "/admin/blog", icon: BookOpen, badge: 8 },
      {
        label: "Ressources",
        href: "/admin/resources",
        icon: FileText,
        badge: 24,
      },
    ],
  },
  {
    title: "Communauté",
    items: [
      { label: "Équipe", href: "/admin/team", icon: Users, badge: 15 },
      {
        label: "Partenaires",
        href: "/admin/partners",
        icon: Handshake,
        badge: 35,
      },
      {
        label: "Newsletter",
        href: "/admin/newsletter",
        icon: Mail,
        badge: 847,
      },
    ],
  },
  {
    title: "Communications",
    items: [
      {
        label: "Messages",
        href: "/admin/messages",
        icon: MessageSquare,
        badge: 7,
        badgeColor: "bg-orange-500",
      },
      { label: "Médiathèque", href: "/admin/media", icon: Image, badge: 156 },
    ],
  },
  {
    title: "Administration",
    items: [
      {
        label: "Utilisateurs",
        href: "/admin/users",
        icon: ShieldCheck,
        badge: 4,
      },
      { label: "Paramètres", href: "/admin/settings", icon: Settings },
    ],
  },
];

// ─── Composant ────────────────────────────────────────────────────────────────
interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  user: { name: string; email: string; role: string; avatar?: string } | null;
}

export default function AdminSidebar({
  collapsed,
  onToggle,
  user,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [openGroups, setOpenGroups] = useState<Set<string>>(
    new Set(NAV_GROUPS.map((g) => g.title)),
  );

  const handleLogout = () => {
    clearAdminToken();
    sessionStorage.removeItem("mrjc_admin_user");
    router.push("/admin/login");
  };

  const toggleGroup = (title: string) => {
    if (collapsed) return;
    setOpenGroups((prev) => {
      const next = new Set(prev);
      next.has(title) ? next.delete(title) : next.add(title);
      return next;
    });
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex h-screen flex-col border-r border-gray-100 bg-white shadow-sm"
    >
      {/* Logo + Toggle */}
      <div className="flex h-16 items-center justify-between border-b border-gray-100 px-4">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              key="logo-full"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-2.5"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
                <span className="text-xs font-bold text-white">MR</span>
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">
                  MRJC-BÉNIN
                </div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wide">
                  Administration
                </div>
              </div>
            </motion.div>
          )}
          {collapsed && (
            <motion.div
              key="logo-mini"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600"
            >
              <span className="text-xs font-bold text-white">MR</span>
            </motion.div>
          )}
        </AnimatePresence>

        {!collapsed && (
          <button
            onClick={onToggle}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            title="Réduire"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Toggle button for collapsed state */}
      {collapsed && (
        <button
          onClick={onToggle}
          className="mx-auto mt-2 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100"
          title="Étendre"
        >
          <ChevronRight size={16} />
        </button>
      )}

      {/* User info */}
      {user && (
        <div
          className={`border-b border-gray-100 p-3 ${collapsed ? "flex justify-center" : ""}`}
        >
          <div
            className={`flex items-center gap-3 ${collapsed ? "flex-col" : ""}`}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-sm font-bold text-white">
              {user.name.charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-gray-800">
                  {user.name}
                </div>
                <div className="truncate text-xs text-gray-400">
                  {user.role}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200">
        {NAV_GROUPS.map((group) => {
          const isGroupOpen = openGroups.has(group.title);

          return (
            <div key={group.title} className="mb-1">
              {/* Group header */}
              {!collapsed && (
                <button
                  onClick={() => toggleGroup(group.title)}
                  className="flex w-full items-center justify-between px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400 hover:text-gray-600"
                >
                  <span>{group.title}</span>
                  <motion.div
                    animate={{ rotate: isGroupOpen ? 0 : -90 }}
                    transition={{ duration: 0.15 }}
                  >
                    <ChevronDown size={12} />
                  </motion.div>
                </button>
              )}

              {/* Items */}
              <AnimatePresence initial={false}>
                {(!collapsed || true) && (isGroupOpen || collapsed) && (
                  <motion.ul
                    initial={!collapsed ? { opacity: 0, height: 0 } : false}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    {group.items.map((item) => {
                      const active = isActive(item.href);
                      const Icon = item.icon;

                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            title={collapsed ? item.label : undefined}
                            className={`
                              group relative flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-150
                              ${
                                active
                                  ? "bg-primary-50 font-semibold text-primary-700"
                                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                              }
                              ${collapsed ? "justify-center px-0" : ""}
                            `}
                          >
                            {/* Active indicator */}
                            {active && (
                              <motion.span
                                layoutId={`nav-indicator-${item.href}`}
                                className="absolute inset-y-0 left-0 w-0.5 rounded-r-full bg-primary-600"
                              />
                            )}

                            <Icon
                              size={17}
                              className={
                                active
                                  ? "text-primary-600"
                                  : "text-gray-400 group-hover:text-gray-600"
                              }
                            />

                            {!collapsed && (
                              <>
                                <span className="flex-1">{item.label}</span>

                                {item.isNew && (
                                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                                    NEW
                                  </span>
                                )}

                                {item.badge !== undefined && (
                                  <span
                                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium text-white ${item.badgeColor ?? "bg-gray-400"}`}
                                  >
                                    {typeof item.badge === "number" &&
                                    item.badge > 99
                                      ? "99+"
                                      : item.badge}
                                  </span>
                                )}
                              </>
                            )}

                            {/* Badge in collapsed mode */}
                            {collapsed && item.badge !== undefined && (
                              <span
                                className={`absolute right-1 top-1 h-4 w-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center ${item.badgeColor ?? "bg-gray-400"}`}
                              >
                                {typeof item.badge === "number" &&
                                item.badge > 9
                                  ? "9+"
                                  : item.badge}
                              </span>
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* Footer actions */}
      <div
        className={`border-t border-gray-100 p-3 space-y-1 ${collapsed ? "flex flex-col items-center" : ""}`}
      >
        <Link
          href="/"
          target="_blank"
          title={collapsed ? "Voir le site" : undefined}
          className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 ${collapsed ? "justify-center" : ""}`}
        >
          <ExternalLink size={16} />
          {!collapsed && <span>Voir le site</span>}
        </Link>

        <button
          onClick={handleLogout}
          title={collapsed ? "Déconnexion" : undefined}
          className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-50 hover:text-red-700 ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut size={16} />
          {!collapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </motion.aside>
  );
}
