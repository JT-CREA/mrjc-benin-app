"use client";

/**
 * Page — Admin / Gestion des Utilisateurs
 * Route: /admin/users
 * Fonctionnalités :
 * - Liste des comptes admin avec rôles
 * - Création, édition, suspension d'utilisateurs
 * - Gestion des permissions par rôle
 * - Journal d'activité par utilisateur
 * - Réinitialisation de mot de passe
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Plus,
  Search,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Edit3,
  Trash2,
  Eye,
  Mail,
  Clock,
  MoreVertical,
  X,
  Check,
  UserCheck,
  UserX,
  Key,
  Activity,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Role = "super_admin" | "admin" | "editor" | "moderator" | "viewer";
type Status = "active" | "suspended" | "pending";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  status: Status;
  avatar?: string;
  lastLogin: string;
  createdAt: string;
  permissions: string[];
  loginCount: number;
  twoFA: boolean;
}

// ─── Données démo ─────────────────────────────────────────────────────────────
const DEMO_USERS: AdminUser[] = [
  {
    id: "1",
    name: "Firmin Ahouansou",
    email: "f.ahouansou@mrjc-benin.org",
    phone: "+229 97 00 00 01",
    role: "super_admin",
    status: "active",
    lastLogin: "2024-06-15 09:32",
    createdAt: "2020-01-10",
    permissions: ["all"],
    loginCount: 847,
    twoFA: true,
  },
  {
    id: "2",
    name: "Marie-Claire Dossou",
    email: "m.dossou@mrjc-benin.org",
    phone: "+229 97 00 00 02",
    role: "admin",
    status: "active",
    lastLogin: "2024-06-14 16:45",
    createdAt: "2021-03-22",
    permissions: ["content", "team", "newsletter"],
    loginCount: 423,
    twoFA: true,
  },
  {
    id: "3",
    name: "Jean-Baptiste Koudjo",
    email: "j.koudjo@mrjc-benin.org",
    role: "editor",
    status: "active",
    lastLogin: "2024-06-13 11:20",
    createdAt: "2022-07-15",
    permissions: ["content.read", "content.write"],
    loginCount: 189,
    twoFA: false,
  },
  {
    id: "4",
    name: "Aïssatou Sow",
    email: "a.sow@mrjc-benin.org",
    role: "moderator",
    status: "active",
    lastLogin: "2024-06-12 14:00",
    createdAt: "2023-01-08",
    permissions: ["messages", "comments"],
    loginCount: 67,
    twoFA: false,
  },
  {
    id: "5",
    name: "Kofi Mensah",
    email: "k.mensah@mrjc-benin.org",
    role: "viewer",
    status: "suspended",
    lastLogin: "2024-05-20 10:15",
    createdAt: "2023-09-01",
    permissions: ["content.read"],
    loginCount: 23,
    twoFA: false,
  },
  {
    id: "6",
    name: "Prudence Adanvo",
    email: "p.adanvo@mrjc-benin.org",
    role: "editor",
    status: "pending",
    lastLogin: "—",
    createdAt: "2024-06-10",
    permissions: ["content.read", "content.write"],
    loginCount: 0,
    twoFA: false,
  },
];

const ROLE_CONFIG: Record<
  Role,
  {
    label: string;
    color: string;
    bg: string;
    icon: React.ElementType;
    desc: string;
  }
> = {
  super_admin: {
    label: "Super Admin",
    color: "text-red-700",
    bg: "bg-red-100",
    icon: ShieldAlert,
    desc: "Accès total sans restriction",
  },
  admin: {
    label: "Administrateur",
    color: "text-purple-700",
    bg: "bg-purple-100",
    icon: ShieldCheck,
    desc: "Gestion complète du contenu et équipe",
  },
  editor: {
    label: "Éditeur",
    color: "text-blue-700",
    bg: "bg-blue-100",
    icon: Edit3,
    desc: "Création et édition du contenu",
  },
  moderator: {
    label: "Modérateur",
    color: "text-orange-700",
    bg: "bg-orange-100",
    icon: Shield,
    desc: "Modération des messages et commentaires",
  },
  viewer: {
    label: "Lecteur",
    color: "text-gray-700",
    bg: "bg-gray-100",
    icon: Eye,
    desc: "Consultation uniquement",
  },
};

const STATUS_CONFIG: Record<
  Status,
  { label: string; color: string; dot: string }
> = {
  active: {
    label: "Actif",
    color: "text-green-700 bg-green-100",
    dot: "bg-green-500",
  },
  suspended: {
    label: "Suspendu",
    color: "text-red-700 bg-red-100",
    dot: "bg-red-500",
  },
  pending: {
    label: "En attente",
    color: "text-yellow-700 bg-yellow-100",
    dot: "bg-yellow-500",
  },
};

const PERMISSIONS_MAP: Record<string, { label: string; icon: string }> = {
  all: { label: "Toutes permissions", icon: "🔑" },
  content: { label: "Gestion contenu", icon: "📝" },
  "content.read": { label: "Lecture contenu", icon: "👁️" },
  "content.write": { label: "Écriture contenu", icon: "✏️" },
  team: { label: "Gestion équipe", icon: "👥" },
  newsletter: { label: "Newsletter", icon: "📧" },
  messages: { label: "Messages", icon: "💬" },
  comments: { label: "Commentaires", icon: "🗨️" },
};

// ─── Composant Badge Rôle ─────────────────────────────────────────────────────
function RoleBadge({ role }: { role: Role }) {
  const cfg = ROLE_CONFIG[role];
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color}`}
    >
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

// ─── Composant Badge Statut ───────────────────────────────────────────────────
function StatusBadge({ status }: { status: Status }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ─── Formulaire Utilisateur ───────────────────────────────────────────────────
function UserForm({
  user,
  onClose,
  onSave,
}: {
  user?: AdminUser | null;
  onClose: () => void;
  onSave: (data: Partial<AdminUser>) => void;
}) {
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    role: user?.role || ("editor" as Role),
    status: user?.status || ("active" as Status),
    twoFA: user?.twoFA || false,
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">
              {user ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {user
                ? `Modifiez les informations de ${user.name}`
                : "Créez un nouveau compte administrateur"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Nom complet *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="Prénom Nom"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Email *
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="user@mrjc-benin.org"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Téléphone
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="+229 97 00 00 00"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Rôle *
              </label>
              <select
                value={form.role}
                onChange={(e) =>
                  setForm((f) => ({ ...f, role: e.target.value as Role }))
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
              >
                {(
                  Object.entries(ROLE_CONFIG) as [
                    Role,
                    (typeof ROLE_CONFIG)[Role],
                  ][]
                ).map(([key, cfg]) => (
                  <option key={key} value={key}>
                    {cfg.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Statut
              </label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({ ...f, status: e.target.value as Status }))
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
              >
                <option value="active">Actif</option>
                <option value="suspended">Suspendu</option>
                <option value="pending">En attente</option>
              </select>
            </div>
          </div>

          {/* Description rôle */}
          <div
            className={`p-3 rounded-lg ${ROLE_CONFIG[form.role].bg} flex items-start gap-2`}
          >
            {(() => {
              const Icon = ROLE_CONFIG[form.role].icon;
              return (
                <Icon
                  className={`w-4 h-4 mt-0.5 ${ROLE_CONFIG[form.role].color}`}
                />
              );
            })()}
            <p className={`text-xs ${ROLE_CONFIG[form.role].color}`}>
              {ROLE_CONFIG[form.role].desc}
            </p>
          </div>

          {/* 2FA */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Authentification 2 facteurs
              </span>
            </div>
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, twoFA: !f.twoFA }))}
              className={`w-10 h-5 rounded-full transition-colors relative ${form.twoFA ? "bg-green-500" : "bg-gray-300"}`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.twoFA ? "translate-x-5" : "translate-x-0.5"}`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={() => {
              onSave(form);
              onClose();
            }}
            className="px-5 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            {user ? "Sauvegarder" : "Créer le compte"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Page Principale ──────────────────────────────────────────────────────────
export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(DEMO_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [showPasswordReset, setShowPasswordReset] = useState<string | null>(
    null,
  );

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    admins: users.filter((u) => u.role === "super_admin" || u.role === "admin")
      .length,
    twoFA: users.filter((u) => u.twoFA).length,
  };

  function toggleStatus(id: string) {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "active" ? "suspended" : "active" }
          : u,
      ),
    );
  }

  function deleteUser(id: string) {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-primary-600" />
            Gestion des Utilisateurs
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Gérez les comptes administrateurs et leurs permissions
          </p>
        </div>
        <button
          onClick={() => {
            setEditUser(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nouvel utilisateur
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total comptes",
            value: stats.total,
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Comptes actifs",
            value: stats.active,
            icon: UserCheck,
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            label: "Admins",
            value: stats.admins,
            icon: ShieldCheck,
            color: "text-purple-600",
            bg: "bg-purple-50",
          },
          {
            label: "Avec 2FA",
            value: stats.twoFA,
            icon: Key,
            color: "text-orange-600",
            bg: "bg-orange-50",
          },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3"
          >
            <div
              className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center`}
            >
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as Role | "all")}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white min-w-[150px]"
          >
            <option value="all">Tous les rôles</option>
            {Object.entries(ROLE_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>
                {cfg.label}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Status | "all")}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white min-w-[140px]"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="suspended">Suspendu</option>
            <option value="pending">En attente</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">
                  Utilisateur
                </th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3">
                  Rôle
                </th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3">
                  Statut
                </th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3">
                  Dernière connexion
                </th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3">
                  2FA
                </th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3">
                  Connexions
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence>
                {filtered.map((user, i) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    {/* User info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">
                            {user.name}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-700 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {user.lastLogin}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {user.twoFA ? (
                        <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                          <Check className="w-3.5 h-3.5" />
                          Activé
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <X className="w-3.5 h-3.5" />
                          Non
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-sm text-gray-700">
                          {user.loginCount.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-4">
                      <div className="relative">
                        <button
                          onClick={() =>
                            setOpenMenu(openMenu === user.id ? null : user.id)
                          }
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        <AnimatePresence>
                          {openMenu === user.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              className="absolute right-0 top-full mt-1 bg-white border border-gray-100 rounded-xl shadow-xl z-20 w-48 py-1 overflow-hidden"
                            >
                              <button
                                onClick={() => {
                                  setEditUser(user);
                                  setShowForm(true);
                                  setOpenMenu(null);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                <Edit3 className="w-3.5 h-3.5" /> Modifier
                              </button>
                              <button
                                onClick={() => {
                                  setShowPasswordReset(user.id);
                                  setOpenMenu(null);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                <Key className="w-3.5 h-3.5" /> Réinitialiser
                                MDP
                              </button>
                              <button
                                onClick={() => {
                                  toggleStatus(user.id);
                                  setOpenMenu(null);
                                }}
                                className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors ${user.status === "active" ? "text-orange-600 hover:bg-orange-50" : "text-green-600 hover:bg-green-50"}`}
                              >
                                {user.status === "active" ? (
                                  <>
                                    <UserX className="w-3.5 h-3.5" /> Suspendre
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="w-3.5 h-3.5" />{" "}
                                    Réactiver
                                  </>
                                )}
                              </button>
                              {user.role !== "super_admin" && (
                                <>
                                  <div className="border-t border-gray-100 my-1" />
                                  <button
                                    onClick={() => {
                                      deleteUser(user.id);
                                      setOpenMenu(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" /> Supprimer
                                  </button>
                                </>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">Aucun utilisateur trouvé</p>
            <p className="text-sm mt-1">Modifiez vos critères de recherche</p>
          </div>
        )}
      </div>

      {/* Section permissions par rôle */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary-600" />
          Matrice des Permissions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(
            Object.entries(ROLE_CONFIG) as [Role, (typeof ROLE_CONFIG)[Role]][]
          ).map(([role, cfg]) => {
            const Icon = cfg.icon;
            return (
              <div
                key={role}
                className={`p-4 rounded-xl border ${cfg.bg} border-opacity-50`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Icon className={`w-4 h-4 ${cfg.color}`} />
                  <span className={`font-semibold text-sm ${cfg.color}`}>
                    {cfg.label}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-3">{cfg.desc}</p>
                <div className="flex flex-wrap gap-1">
                  {users
                    .find((u) => u.role === role)
                    ?.permissions.map((p) => (
                      <span
                        key={p}
                        className="text-xs bg-white/70 px-2 py-0.5 rounded text-gray-600 border border-gray-200"
                      >
                        {PERMISSIONS_MAP[p]?.icon}{" "}
                        {PERMISSIONS_MAP[p]?.label || p}
                      </span>
                    ))}
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {users.filter((u) => u.role === role).length} utilisateur(s)
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Form */}
      <AnimatePresence>
        {showForm && (
          <UserForm
            user={editUser}
            onClose={() => {
              setShowForm(false);
              setEditUser(null);
            }}
            onSave={(data) => {
              if (editUser) {
                setUsers((prev) =>
                  prev.map((u) =>
                    u.id === editUser.id ? { ...u, ...data } : u,
                  ),
                );
              } else {
                setUsers((prev) => [
                  ...prev,
                  {
                    id: Date.now().toString(),
                    loginCount: 0,
                    createdAt: new Date().toISOString().split("T")[0],
                    lastLogin: "—",
                    permissions: [],
                    ...data,
                  } as AdminUser,
                ]);
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* Modal Réinitialisation MDP */}
      <AnimatePresence>
        {showPasswordReset && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowPasswordReset(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Key className="w-7 h-7 text-orange-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">
                  Réinitialiser le mot de passe
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Un email de réinitialisation sera envoyé à l'utilisateur. Il
                  devra créer un nouveau mot de passe.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowPasswordReset(null)}
                    className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => setShowPasswordReset(null)}
                    className="flex-1 py-2.5 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
                  >
                    Envoyer l'email
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
