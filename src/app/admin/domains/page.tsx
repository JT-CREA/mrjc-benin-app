"use client";

/**
 * Page — Admin Domaines d'intervention
 * Route: /admin/domains
 * Gestion des 5 domaines d'intervention :
 * - Édition des descriptions, résultats, activités clés
 * - Mise à jour des métriques d'impact
 * - Gestion de l'ordre d'affichage
 * - Activation/désactivation des domaines
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit3,
  Save,
  X,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface DomainResult {
  value: string;
  label: string;
  icon: string;
}

interface DomainData {
  id: string;
  slug: string;
  label: string;
  tagline: string;
  description: string;
  icon: string;
  colorName: string;
  active: boolean;
  order: number;
  results: DomainResult[];
  keyActivities: string[];
}

// ─── Données démo ─────────────────────────────────────────────────────────────
const INITIAL_DOMAINS: DomainData[] = [
  {
    id: "d1",
    slug: "conseil-agricole-entrepreneuriat",
    label: "Conseil Agricole & Entrepreneuriat",
    tagline:
      "Transformer l'agriculture rurale par l'innovation et l'entrepreneuriat.",
    description:
      "Accompagnement des producteurs ruraux vers des pratiques agricoles durables, rentables et résilientes.",
    icon: "🌾",
    colorName: "primary",
    active: true,
    order: 1,
    results: [
      { value: "6,000+", label: "Producteurs formés", icon: "👨‍🌾" },
      { value: "15+", label: "Filières développées", icon: "🌱" },
      { value: "+45%", label: "Hausse revenus", icon: "📈" },
      { value: "12", label: "Coopératives créées", icon: "🤝" },
    ],
    keyActivities: [
      "Formation en techniques agro-écologiques",
      "Appui à la création de coopératives",
      "Accès aux marchés et à la finance",
      "Vulgarisation agricole de proximité",
    ],
  },
  {
    id: "d2",
    slug: "sante-communautaire-nutrition",
    label: "Santé Communautaire & Nutrition",
    tagline:
      "Améliorer la santé des communautés rurales à travers des soins préventifs.",
    description:
      "Programmes de nutrition, santé maternelle et infantile, lutte contre la malnutrition.",
    icon: "🏥",
    colorName: "accent",
    active: true,
    order: 2,
    results: [
      { value: "8,500", label: "Enfants suivis", icon: "👶" },
      { value: "240", label: "Agents formés", icon: "🏥" },
      { value: "-35%", label: "Réduction malnutrition", icon: "💪" },
      { value: "48", label: "Villages couverts", icon: "🏘️" },
    ],
    keyActivities: [
      "Dépistage et prise en charge malnutrition",
      "Formation des relais communautaires",
      "Sensibilisation nutrition mères",
      "Mise en place jardins maraîchers nutritifs",
    ],
  },
  {
    id: "d3",
    slug: "alphabetisation-education",
    label: "Alphabétisation & Éducation",
    tagline: "L'éducation, clé de l'émancipation des communautés rurales.",
    description:
      "Programmes d'alphabétisation fonctionnelle en langues nationales et formation continue des adultes.",
    icon: "📚",
    colorName: "secondary",
    active: true,
    order: 3,
    results: [
      { value: "3,604", label: "Personnes alphabétisées", icon: "📖" },
      { value: "85%", label: "Taux rétention", icon: "🎯" },
      { value: "48", label: "Centres actifs", icon: "🏫" },
      { value: "3", label: "Langues couvertes", icon: "🗣️" },
    ],
    keyActivities: [
      "Alphabétisation en fon, yoruba, bariba",
      "Formation des animateurs",
      "Éducation à la citoyenneté",
      "Bibliothèques communautaires",
    ],
  },
  {
    id: "d4",
    slug: "autonomisation-femmes",
    label: "Autonomisation des Femmes",
    tagline: "Des femmes leaders, des communautés transformées.",
    description:
      "Renforcement du leadership féminin, accès à la finance et participation à la gouvernance locale.",
    icon: "✊",
    colorName: "purple",
    active: true,
    order: 4,
    results: [
      { value: "800+", label: "Leaders formées", icon: "👩" },
      { value: "25%", label: "Élues locales", icon: "🗳️" },
      { value: "350", label: "Entreprises créées", icon: "💼" },
      { value: "1,500", label: "Microcrédits accordés", icon: "💰" },
    ],
    keyActivities: [
      "Leadership et plaidoyer politique",
      "Accès au microcrédit",
      "Formation en gestion d'entreprise",
      "Réseaux de solidarité féminins",
    ],
  },
  {
    id: "d5",
    slug: "intermediation-sociale",
    label: "Intermédiation Sociale",
    tagline:
      "Renforcer les organisations locales pour une gouvernance inclusive.",
    description:
      "Appui aux organisations communautaires de base, médiation et résolution de conflits, gouvernance locale.",
    icon: "🤝",
    colorName: "neutral",
    active: true,
    order: 5,
    results: [
      { value: "120+", label: "OCB renforcées", icon: "🏘️" },
      { value: "85", label: "Conflits médiés", icon: "🕊️" },
      { value: "45", label: "Plans de développement", icon: "📋" },
      { value: "18", label: "Communes couvertes", icon: "🗺️" },
    ],
    keyActivities: [
      "Renforcement des capacités des OCB",
      "Médiation et résolution de conflits",
      "Planification participative locale",
      "Appui à la gouvernance villageoise",
    ],
  },
];

const COLOR_CLASSES: Record<string, string> = {
  primary: "bg-primary-50 text-primary-700 border-primary-200",
  accent: "bg-accent-50 text-accent-700 border-accent-200",
  secondary: "bg-secondary-50 text-secondary-700 border-secondary-200",
  purple: "bg-violet-50 text-violet-700 border-violet-200",
  neutral: "bg-gray-50 text-gray-700 border-gray-200",
};

// ─── Éditeur d'un domaine ─────────────────────────────────────────────────────
function DomainEditor({
  domain,
  onSave,
  onClose,
}: {
  domain: DomainData;
  onSave: (d: DomainData) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<DomainData>({ ...domain });
  const [newActivity, setNewActivity] = useState("");

  const addActivity = () => {
    if (newActivity.trim()) {
      setForm((f) => ({
        ...f,
        keyActivities: [...f.keyActivities, newActivity.trim()],
      }));
      setNewActivity("");
    }
  };

  const removeActivity = (i: number) => {
    setForm((f) => ({
      ...f,
      keyActivities: f.keyActivities.filter((_, idx) => idx !== i),
    }));
  };

  const updateResult = (
    i: number,
    field: keyof DomainResult,
    value: string,
  ) => {
    setForm((f) => ({
      ...f,
      results: f.results.map((r, idx) =>
        idx === i ? { ...r, [field]: value } : r,
      ),
    }));
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
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 my-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{domain.icon}</span>
            <h2 className="text-xl font-bold text-gray-900">
              Modifier : {domain.label}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Titre du domaine
            </label>
            <input
              type="text"
              value={form.label}
              onChange={(e) =>
                setForm((f) => ({ ...f, label: e.target.value }))
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Slogan / Tagline
            </label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) =>
                setForm((f) => ({ ...f, tagline: e.target.value }))
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none"
            />
          </div>

          {/* Résultats */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chiffres clés d'impact
            </label>
            <div className="grid grid-cols-2 gap-3">
              {form.results.map((r, i) => (
                <div
                  key={i}
                  className="border border-gray-100 rounded-xl p-3 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={r.icon}
                      onChange={(e) => updateResult(i, "icon", e.target.value)}
                      className="w-12 border border-gray-200 rounded-lg px-2 py-1.5 text-center text-sm"
                    />
                    <input
                      type="text"
                      value={r.value}
                      onChange={(e) => updateResult(i, "value", e.target.value)}
                      placeholder="Valeur"
                      className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-sm font-bold focus:outline-none"
                    />
                  </div>
                  <input
                    type="text"
                    value={r.label}
                    onChange={(e) => updateResult(i, "label", e.target.value)}
                    placeholder="Label"
                    className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Activités */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Activités clés
            </label>
            <div className="space-y-2 mb-3">
              {form.keyActivities.map((a, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-2 border border-gray-100 rounded-xl px-3 py-2">
                    <span className="text-xs text-gray-400 font-mono w-5">
                      {i + 1}.
                    </span>
                    <input
                      type="text"
                      value={a}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          keyActivities: f.keyActivities.map((x, idx) =>
                            idx === i ? e.target.value : x,
                          ),
                        }))
                      }
                      className="flex-1 text-sm focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => removeActivity(i)}
                    className="p-1.5 text-red-400 hover:text-red-600"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addActivity()}
                placeholder="Ajouter une activité..."
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
              />
              <button
                onClick={addActivity}
                className="px-3 py-2 bg-primary-100 text-primary-700 rounded-xl text-sm hover:bg-primary-200"
              >
                <Plus size={15} />
              </button>
            </div>
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
            onClick={() => {
              onSave(form);
              onClose();
            }}
            className="px-5 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-xl hover:bg-primary-700 flex items-center gap-2"
          >
            <Save size={14} /> Enregistrer les modifications
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function AdminDomainsPage() {
  const [domains, setDomains] = useState<DomainData[]>(INITIAL_DOMAINS);
  const [editingDomain, setEditingDomain] = useState<DomainData | null>(null);

  const handleSave = (updated: DomainData) => {
    setDomains((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
  };

  const toggleActive = (id: string) => {
    setDomains((prev) =>
      prev.map((d) => (d.id === id ? { ...d, active: !d.active } : d)),
    );
  };

  const moveOrder = (id: string, direction: "up" | "down") => {
    setDomains((prev) => {
      const sorted = [...prev].sort((a, b) => a.order - b.order);
      const idx = sorted.findIndex((d) => d.id === id);
      if (direction === "up" && idx > 0) {
        [sorted[idx - 1].order, sorted[idx].order] = [
          sorted[idx].order,
          sorted[idx - 1].order,
        ];
      } else if (direction === "down" && idx < sorted.length - 1) {
        [sorted[idx + 1].order, sorted[idx].order] = [
          sorted[idx].order,
          sorted[idx + 1].order,
        ];
      }
      return sorted;
    });
  };

  const sortedDomains = [...domains].sort((a, b) => a.order - b.order);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Domaines d'intervention
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {domains.filter((d) => d.active).length} domaines actifs · Faites
            glisser pour réordonner
          </p>
        </div>
      </div>

      {/* Info */}
      <div className="bg-primary-50 border border-primary-100 rounded-2xl p-4 flex items-start gap-3">
        <div className="w-8 h-8 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
          <Eye size={15} className="text-primary-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-primary-800">
            Gestion des domaines
          </p>
          <p className="text-xs text-primary-600 mt-0.5">
            Les modifications de titre, description et résultats sont reflétées
            immédiatement sur le site. L'ordre d'affichage détermine la
            disposition sur la page Domaines.
          </p>
        </div>
      </div>

      {/* Liste des domaines */}
      <div className="space-y-4">
        {sortedDomains.map((domain, i) => {
          const colorClass =
            COLOR_CLASSES[domain.colorName] || COLOR_CLASSES.neutral;
          return (
            <motion.div
              key={domain.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${!domain.active ? "opacity-60" : "border-gray-100"}`}
            >
              <div className="p-5">
                <div className="flex items-start gap-4">
                  {/* Ordre */}
                  <div className="flex flex-col gap-1 items-center shrink-0">
                    <button
                      onClick={() => moveOrder(domain.id, "up")}
                      disabled={i === 0}
                      className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
                    >
                      <ArrowUp size={12} className="text-gray-400" />
                    </button>
                    <span className="text-xs font-bold text-gray-300 w-6 text-center">
                      {domain.order}
                    </span>
                    <button
                      onClick={() => moveOrder(domain.id, "down")}
                      disabled={i === sortedDomains.length - 1}
                      className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
                    >
                      <ArrowDown size={12} className="text-gray-400" />
                    </button>
                  </div>

                  {/* Icone */}
                  <div className="text-3xl shrink-0 mt-0.5">{domain.icon}</div>

                  {/* Contenu */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-gray-900">
                        {domain.label}
                      </h3>
                      {!domain.active && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-[10px] font-medium">
                          Désactivé
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-1">
                      {domain.tagline}
                    </p>

                    {/* Résultats */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {domain.results.map((r, ri) => (
                        <span
                          key={ri}
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-semibold ${colorClass}`}
                        >
                          <span>{r.icon}</span> {r.value} {r.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleActive(domain.id)}
                      className={`p-2 rounded-xl transition-colors ${domain.active ? "bg-gray-100 text-gray-500 hover:bg-gray-200" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"}`}
                      title={domain.active ? "Désactiver" : "Activer"}
                    >
                      {domain.active ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                    <button
                      onClick={() => setEditingDomain(domain)}
                      className="p-2 bg-primary-50 text-primary-600 rounded-xl hover:bg-primary-100 transition-colors"
                    >
                      <Edit3 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {editingDomain && (
          <DomainEditor
            domain={editingDomain}
            onSave={handleSave}
            onClose={() => setEditingDomain(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
