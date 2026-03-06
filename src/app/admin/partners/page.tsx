"use client";

/**
 * Page — Admin Partenaires
 * Route: /admin/partners
 * Gestion des partenaires institutionnels :
 * - CRUD logo + description + liens
 * - Type de partenariat
 * - Ordre d'affichage dans le ticker
 * - Activation dans le carrousel homepage
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Globe,
  XCircle,
  Star,
  CheckCircle2,
  EyeOff,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Partner {
  id: string;
  name: string;
  acronym: string;
  type: "bailleur" | "technique" | "gouvernement" | "ong" | "international";
  country: string;
  website?: string;
  description: string;
  active: boolean;
  featured: boolean;
  since: string;
  logo: string; // URL ou initial
  color: string;
}

const PARTNER_COLORS = [
  "#002395",
  "#003189",
  "#0072CE",
  "#009FDA",
  "#00843D",
  "#FF6B00",
  "#C8102E",
  "#7B2D8B",
  "#00A9CE",
  "#1A1A1A",
];

const INITIAL_PARTNERS: Partner[] = [
  {
    id: "p1",
    name: "Union Européenne",
    acronym: "UE",
    type: "bailleur",
    country: "Europe",
    website: "https://ec.europa.eu",
    description: "Principal bailleur de fonds pour le programme PROCASE.",
    active: true,
    featured: true,
    since: "2018",
    logo: "UE",
    color: "#003189",
  },
  {
    id: "p2",
    name: "UNICEF Bénin",
    acronym: "UNICEF",
    type: "international",
    country: "International",
    website: "https://www.unicef.org/benin",
    description: "Partenaire pour les programmes nutrition et santé infantile.",
    active: true,
    featured: true,
    since: "2016",
    logo: "UN",
    color: "#009FDA",
  },
  {
    id: "p3",
    name: "Agence Française de Développement",
    acronym: "AFD",
    type: "bailleur",
    country: "France",
    website: "https://www.afd.fr",
    description: "Financement des programmes d'alphabétisation et éducation.",
    active: true,
    featured: true,
    since: "2019",
    logo: "AFD",
    color: "#00843D",
  },
  {
    id: "p4",
    name: "ONU Femmes Bénin",
    acronym: "ONU",
    type: "international",
    country: "International",
    website: "https://www.unwomen.org",
    description: "Partenaire pour l'autonomisation des femmes rurales.",
    active: true,
    featured: true,
    since: "2017",
    logo: "ONF",
    color: "#7B2D8B",
  },
  {
    id: "p5",
    name: "Direction du Développement et de la Coopération",
    acronym: "DDC",
    type: "bailleur",
    country: "Suisse",
    website: "https://www.eda.admin.ch/deza",
    description: "Coopération suisse, financement des activités santé.",
    active: true,
    featured: false,
    since: "2020",
    logo: "DDC",
    color: "#C8102E",
  },
  {
    id: "p6",
    name: "Ministère Agriculture Bénin",
    acronym: "MAEP",
    type: "gouvernement",
    country: "Bénin",
    description: "Partenariat institutionnel pour le conseil agricole.",
    active: true,
    featured: true,
    since: "2015",
    logo: "MAP",
    color: "#00A9CE",
  },
  {
    id: "p7",
    name: "CARE International Bénin",
    acronym: "CARE",
    type: "ong",
    country: "International",
    website: "https://www.care.org",
    description: "Consortium sur les projets de sécurité alimentaire.",
    active: false,
    featured: false,
    since: "2018",
    logo: "CR",
    color: "#FF6B00",
  },
];

const PARTNER_TYPE_LABELS: Record<
  Partner["type"],
  { label: string; color: string }
> = {
  bailleur: { label: "Bailleur", color: "bg-emerald-100 text-emerald-700" },
  technique: {
    label: "Partenaire technique",
    color: "bg-blue-100 text-blue-700",
  },
  gouvernement: {
    label: "Institution publique",
    color: "bg-violet-100 text-violet-700",
  },
  ong: { label: "ONG", color: "bg-amber-100 text-amber-700" },
  international: {
    label: "Organisation internationale",
    color: "bg-cyan-100 text-cyan-700",
  },
};

// ─── Modale Partner ───────────────────────────────────────────────────────────
function PartnerFormModal({
  partner,
  onClose,
  onSave,
}: {
  partner: Partial<Partner> | null;
  onClose: () => void;
  onSave: (p: Partner) => void;
}) {
  const [form, setForm] = useState<Partial<Partner>>(
    partner || {
      name: "",
      acronym: "",
      type: "bailleur",
      country: "International",
      description: "",
      active: true,
      featured: false,
      since: "2024",
      color: PARTNER_COLORS[0],
    },
  );

  const handleSave = () => {
    if (!form.name?.trim()) return;
    onSave({
      id: form.id || `p${Date.now()}`,
      name: form.name || "",
      acronym:
        form.acronym || form.name?.substring(0, 3).toUpperCase() || "???",
      type: form.type || "bailleur",
      country: form.country || "International",
      website: form.website,
      description: form.description || "",
      active: form.active ?? true,
      featured: form.featured || false,
      since: form.since || "2024",
      logo: form.acronym?.substring(0, 3).toUpperCase() || "???",
      color: form.color || PARTNER_COLORS[0],
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-xl p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: form.color || PARTNER_COLORS[0] }}
            >
              {(form.acronym || form.name || "??")
                .substring(0, 3)
                .toUpperCase()}
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {form.id ? "Modifier" : "Nouveau partenaire"}
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
                Sigle / Acronyme
              </label>
              <input
                type="text"
                value={form.acronym || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, acronym: e.target.value }))
                }
                maxLength={8}
                placeholder="Ex: UNICEF"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Type
              </label>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    type: e.target.value as Partner["type"],
                  }))
                }
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
              >
                <option value="bailleur">Bailleur</option>
                <option value="technique">Partenaire technique</option>
                <option value="gouvernement">Institution publique</option>
                <option value="ong">ONG</option>
                <option value="international">
                  Organisation internationale
                </option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Pays
              </label>
              <input
                type="text"
                value={form.country || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, country: e.target.value }))
                }
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Depuis
              </label>
              <input
                type="text"
                value={form.since || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, since: e.target.value }))
                }
                placeholder="2020"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Site web
            </label>
            <input
              type="url"
              value={form.website || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, website: e.target.value }))
              }
              placeholder="https://..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              rows={2}
              value={form.description || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none"
            />
          </div>

          {/* Couleur */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Couleur du logo
            </label>
            <div className="flex gap-2 flex-wrap">
              {PARTNER_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setForm((f) => ({ ...f, color: c }))}
                  className={`w-8 h-8 rounded-full transition-transform ${form.color === c ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : ""}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setForm((f) => ({ ...f, active: !f.active }))}
                className={`w-10 h-5 rounded-full transition-colors relative ${form.active ? "bg-emerald-500" : "bg-gray-200"}`}
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.active ? "translate-x-5" : "translate-x-0.5"}`}
                />
              </div>
              <span className="text-sm font-medium text-gray-700">Actif</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() =>
                  setForm((f) => ({ ...f, featured: !f.featured }))
                }
                className={`w-10 h-5 rounded-full transition-colors relative ${form.featured ? "bg-amber-400" : "bg-gray-200"}`}
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.featured ? "translate-x-5" : "translate-x-0.5"}`}
                />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Featured (homepage)
              </span>
            </label>
          </div>
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
export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>(INITIAL_PARTNERS);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [modalItem, setModalItem] = useState<Partial<Partner> | null | false>(
    false,
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = partners.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.acronym.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || p.type === typeFilter;
    return matchSearch && matchType;
  });

  const handleSave = (p: Partner) => {
    setPartners((prev) => {
      const exists = prev.find((x) => x.id === p.id);
      return exists ? prev.map((x) => (x.id === p.id ? p : x)) : [...prev, p];
    });
    setModalItem(false);
  };

  const stats = {
    total: partners.length,
    active: partners.filter((p) => p.active).length,
    featured: partners.filter((p) => p.featured).length,
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Partenaires
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {stats.active} actifs · {stats.featured} en vitrine
          </p>
        </div>
        <button
          onClick={() => setModalItem({})}
          className="inline-flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors"
        >
          <Plus size={16} /> Ajouter un partenaire
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
            placeholder="Rechercher un partenaire..."
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary-200"
        >
          <option value="all">Tous types</option>
          <option value="bailleur">Bailleurs</option>
          <option value="technique">Partenaires techniques</option>
          <option value="gouvernement">Institutions publiques</option>
          <option value="ong">ONG</option>
          <option value="international">Organisations internationales</option>
        </select>
      </div>

      {/* Grille */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        <AnimatePresence>
          {filtered.map((p, i) => {
            const typeInfo = PARTNER_TYPE_LABELS[p.type];
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`bg-white rounded-2xl border shadow-sm p-5 ${!p.active ? "opacity-60" : "border-gray-100"}`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-sm font-bold shrink-0"
                    style={{ backgroundColor: p.color }}
                  >
                    {p.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">
                        {p.name}
                      </h3>
                      {p.featured && (
                        <Star size={11} className="text-amber-500 shrink-0" />
                      )}
                      {!p.active && (
                        <EyeOff size={11} className="text-gray-400 shrink-0" />
                      )}
                    </div>
                    <span
                      className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${typeInfo.color}`}
                    >
                      {typeInfo.label}
                    </span>
                  </div>
                </div>

                <p className="mt-3 text-xs text-gray-500 line-clamp-2">
                  {p.description}
                </p>

                <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
                  <span>🌍 {p.country}</span>
                  <span>📅 Depuis {p.since}</span>
                  {p.website && (
                    <a
                      href={p.website}
                      target="_blank"
                      rel="noopener"
                      className="flex items-center gap-1 text-primary-500 hover:underline"
                    >
                      <Globe size={10} /> Site
                    </a>
                  )}
                </div>

                <div className="flex gap-2 mt-4 pt-3 border-t border-gray-50">
                  <button
                    onClick={() => setModalItem(p)}
                    className="flex-1 py-1.5 text-xs font-medium bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 flex items-center justify-center gap-1"
                  >
                    <Edit3 size={11} /> Modifier
                  </button>
                  <button
                    onClick={() =>
                      setPartners((prev) =>
                        prev.map((x) =>
                          x.id === p.id ? { ...x, active: !x.active } : x,
                        ),
                      )
                    }
                    className={`py-1.5 px-3 text-xs font-medium rounded-xl ${p.active ? "bg-gray-50 text-gray-500 hover:bg-gray-100" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"}`}
                  >
                    {p.active ? (
                      <EyeOff size={12} />
                    ) : (
                      <CheckCircle2 size={12} />
                    )}
                  </button>
                  <button
                    onClick={() => setDeleteId(p.id)}
                    className="py-1.5 px-3 text-xs font-medium bg-red-50 text-red-500 rounded-xl hover:bg-red-100"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {modalItem !== false && (
          <PartnerFormModal
            partner={modalItem}
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
              <h3 className="text-lg font-bold mb-4">
                Supprimer ce partenaire ?
              </h3>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-2.5 text-sm bg-gray-100 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    setPartners((p) => p.filter((x) => x.id !== deleteId));
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
