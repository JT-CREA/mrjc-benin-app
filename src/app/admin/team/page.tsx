"use client";

/**
 * Page — Admin Équipe
 * Route: /admin/team
 * Gestion des membres :
 * - CRUD complet (nom, rôle, photo, bio, réseaux)
 * - Réorganisation par ordre d'affichage
 * - Activation / désactivation
 * - Filtres par département
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Users,
  Mail,
  Phone,
  Linkedin,
  CheckCircle2,
  XCircle,
  EyeOff,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  linkedin?: string;
  bio: string;
  active: boolean;
  order: number;
  initials: string;
  color: string;
}

// ─── Données démo ─────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  "bg-primary-500",
  "bg-secondary-500",
  "bg-accent-500",
  "bg-violet-500",
  "bg-emerald-500",
];

const INITIAL_TEAM: TeamMember[] = [
  {
    id: "t1",
    name: "Jean Biokou",
    role: "Directeur Exécutif",
    department: "Direction",
    email: "j.biokou@mrjc-benin.org",
    phone: "+229 97 00 00 01",
    linkedin: "linkedin.com/in/jeanbiokou",
    bio: "Sociologue de formation, 20 ans d'expérience dans le développement rural au Bénin.",
    active: true,
    order: 1,
    initials: "JB",
    color: "bg-primary-500",
  },
  {
    id: "t2",
    name: "Marie Atchadé",
    role: "Coordinatrice Programmes",
    department: "Programmes",
    email: "m.atchade@mrjc-benin.org",
    phone: "+229 97 00 00 02",
    bio: "Spécialiste en genre et développement, coordinatrice de 5 projets actifs.",
    active: true,
    order: 2,
    initials: "MA",
    color: "bg-secondary-500",
  },
  {
    id: "t3",
    name: "Dr. Firmin Ahouansou",
    role: "Responsable Santé & Nutrition",
    department: "Santé",
    email: "f.ahouansou@mrjc-benin.org",
    phone: "+229 97 00 00 03",
    bio: "Médecin de santé publique, expert en nutrition communautaire.",
    active: true,
    order: 3,
    initials: "FA",
    color: "bg-accent-500",
  },
  {
    id: "t4",
    name: "Aminata Sow",
    role: "Chargée de Communication",
    department: "Communication",
    email: "a.sow@mrjc-benin.org",
    phone: "+229 97 00 00 04",
    bio: "Journaliste et communicante, 8 ans dans les médias locaux.",
    active: true,
    order: 4,
    initials: "AS",
    color: "bg-violet-500",
  },
  {
    id: "t5",
    name: "Emmanuel Dossou",
    role: "Comptable Principal",
    department: "Finance",
    email: "e.dossou@mrjc-benin.org",
    phone: "+229 97 00 00 05",
    bio: "Expert-comptable certifié, gestionnaire financier depuis 12 ans.",
    active: true,
    order: 5,
    initials: "ED",
    color: "bg-emerald-500",
  },
  {
    id: "t6",
    name: "Rose Gbedo",
    role: "Assistante Administrative",
    department: "Administration",
    email: "r.gbedo@mrjc-benin.org",
    phone: "+229 97 00 00 06",
    bio: "Administratrice polyvalente, support logistique de toute l'équipe.",
    active: false,
    order: 6,
    initials: "RG",
    color: "bg-rose-500",
  },
];

const DEPARTMENTS = [
  "Tous",
  "Direction",
  "Programmes",
  "Santé",
  "Communication",
  "Finance",
  "Administration",
];

// ─── Modale Team ──────────────────────────────────────────────────────────────
function TeamFormModal({
  member,
  onClose,
  onSave,
}: {
  member: Partial<TeamMember> | null;
  onClose: () => void;
  onSave: (m: TeamMember) => void;
}) {
  const [form, setForm] = useState<Partial<TeamMember>>(
    member || {
      name: "",
      role: "",
      department: "Programmes",
      email: "",
      phone: "",
      bio: "",
      active: true,
    },
  );

  const initials = form.name
    ? form.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "??";

  const handleSave = () => {
    if (!form.name?.trim() || !form.role?.trim()) return;
    const colorIndex = INITIAL_TEAM.length % AVATAR_COLORS.length;
    onSave({
      id: form.id || `t${Date.now()}`,
      name: form.name || "",
      role: form.role || "",
      department: form.department || "Programmes",
      email: form.email || "",
      phone: form.phone || "",
      linkedin: form.linkedin,
      bio: form.bio || "",
      active: form.active ?? true,
      order: form.order || 99,
      initials,
      color: form.color || AVATAR_COLORS[colorIndex],
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-xl p-8 my-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl ${form.color || "bg-primary-500"} flex items-center justify-center text-white font-bold text-lg`}
            >
              {initials}
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {form.id ? "Modifier le membre" : "Nouveau membre"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100"
          >
            <XCircle size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Nom complet *
              </label>
              <input
                type="text"
                value={form.name || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Rôle / Poste *
              </label>
              <input
                type="text"
                value={form.role || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, role: e.target.value }))
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Département
              </label>
              <select
                value={form.department}
                onChange={(e) =>
                  setForm((f) => ({ ...f, department: e.target.value }))
                }
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
              >
                {DEPARTMENTS.filter((d) => d !== "Tous").map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Couleur avatar
              </label>
              <div className="flex gap-2 mt-1">
                {AVATAR_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setForm((f) => ({ ...f, color: c }))}
                    className={`w-8 h-8 rounded-full ${c} transition-transform ${form.color === c ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : ""}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={form.email || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Téléphone
              </label>
              <input
                type="tel"
                value={form.phone || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              LinkedIn (optionnel)
            </label>
            <input
              type="text"
              value={form.linkedin || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, linkedin: e.target.value }))
              }
              placeholder="linkedin.com/in/..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Bio courte
            </label>
            <textarea
              rows={3}
              value={form.bio || ""}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setForm((f) => ({ ...f, active: !f.active }))}
              className={`w-10 h-5 rounded-full transition-colors relative ${form.active ? "bg-emerald-500" : "bg-gray-200"}`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.active ? "translate-x-5" : "translate-x-0.5"}`}
              />
            </div>
            <span className="text-sm font-medium text-gray-700">
              Membre actif (visible sur le site)
            </span>
          </label>
        </div>

        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-xl hover:bg-primary-700"
          >
            {form.id ? "Enregistrer" : "Ajouter"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function AdminTeamPage() {
  const [team, setTeam] = useState<TeamMember[]>(INITIAL_TEAM);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("Tous");
  const [modalItem, setModalItem] = useState<
    Partial<TeamMember> | null | false
  >(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = team
    .filter((m) => {
      const matchSearch =
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.role.toLowerCase().includes(search.toLowerCase());
      const matchDept = deptFilter === "Tous" || m.department === deptFilter;
      return matchSearch && matchDept;
    })
    .sort((a, b) => a.order - b.order);

  const handleSave = (m: TeamMember) => {
    setTeam((prev) => {
      const exists = prev.find((x) => x.id === m.id);
      return exists ? prev.map((x) => (x.id === m.id ? m : x)) : [...prev, m];
    });
    setModalItem(false);
  };

  const toggleActive = (id: string) => {
    setTeam((prev) =>
      prev.map((m) => (m.id === id ? { ...m, active: !m.active } : m)),
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Équipe
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {team.filter((m) => m.active).length} membres actifs · {team.length}{" "}
            au total
          </p>
        </div>
        <button
          onClick={() => setModalItem({})}
          className="inline-flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors"
        >
          <Plus size={16} /> Ajouter un membre
        </button>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un membre..."
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
        </div>
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary-200"
        >
          {DEPARTMENTS.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* Grille membres */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        <AnimatePresence>
          {filtered.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-white rounded-2xl border shadow-sm p-5 transition-all ${
                member.active ? "border-gray-100" : "border-gray-100 opacity-60"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl ${member.color} flex items-center justify-center text-white font-bold text-lg shrink-0`}
                >
                  {member.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">
                      {member.name}
                    </h3>
                    {!member.active && (
                      <EyeOff size={12} className="text-gray-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-primary-600 font-medium">
                    {member.role}
                  </p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-[10px]">
                    {member.department}
                  </span>
                </div>
              </div>

              <p className="mt-3 text-xs text-gray-500 line-clamp-2">
                {member.bio}
              </p>

              <div className="mt-3 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Mail size={11} />{" "}
                  <span className="truncate">{member.email}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Phone size={11} /> {member.phone}
                </div>
                {member.linkedin && (
                  <div className="flex items-center gap-1.5 text-xs text-blue-400">
                    <Linkedin size={11} />{" "}
                    <span className="truncate">{member.linkedin}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-50">
                <button
                  onClick={() => toggleActive(member.id)}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-xl transition-colors flex items-center justify-center gap-1 ${
                    member.active
                      ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                  }`}
                >
                  <CheckCircle2 size={11} />{" "}
                  {member.active ? "Désactiver" : "Activer"}
                </button>
                <button
                  onClick={() => setModalItem(member)}
                  className="py-1.5 px-3 text-xs font-medium bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  <Edit3 size={12} />
                </button>
                <button
                  onClick={() => setDeleteId(member.id)}
                  className="py-1.5 px-3 text-xs font-medium bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {modalItem !== false && (
          <TeamFormModal
            member={modalItem}
            onClose={() => setModalItem(false)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center"
            >
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={22} className="text-red-500" />
              </div>
              <h3 className="text-lg font-bold mb-2">Supprimer ce membre ?</h3>
              <p className="text-sm text-gray-500 mb-6">
                Il sera retiré de l'équipe et du site.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-2.5 text-sm bg-gray-100 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    setTeam((p) => p.filter((m) => m.id !== deleteId));
                    setDeleteId(null);
                  }}
                  className="flex-1 py-2.5 text-sm bg-red-600 text-white rounded-xl"
                >
                  Supprimer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
