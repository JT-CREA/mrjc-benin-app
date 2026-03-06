"use client";

/**
 * Page — Admin Newsletter
 * Route: /admin/newsletter
 * Gestion des abonnés et envoi de campagnes :
 * - Liste des abonnés avec filtres
 * - Statistiques (taux ouverture, CTR)
 * - Création et envoi de campagne
 * - Export CSV des abonnés
 * - Désabonnement manuel
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Search,
  Trash2,
  Send,
  Users,
  Eye,
  MousePointerClick,
  XCircle,
  CheckCircle2,
  Clock,
  FileDown,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Subscriber {
  id: string;
  email: string;
  name?: string;
  subscribedAt: string;
  source: "site" | "import" | "event";
  status: "active" | "unsubscribed";
  openRate?: number;
}

interface Campaign {
  id: string;
  subject: string;
  sentAt: string;
  recipients: number;
  openRate: number;
  clickRate: number;
  status: "sent" | "draft" | "scheduled";
}

// ─── Données démo ─────────────────────────────────────────────────────────────
const INITIAL_SUBSCRIBERS: Subscriber[] = Array.from(
  { length: 18 },
  (_, i) => ({
    id: `s${i + 1}`,
    email: `contact${i + 1}@example.com`,
    name: i % 3 === 0 ? `Abonné ${i + 1}` : undefined,
    subscribedAt: `2024-0${(i % 3) + 1}-${String((i % 28) + 1).padStart(2, "0")}`,
    source: (["site", "import", "event"] as const)[i % 3],
    status: i < 16 ? "active" : "unsubscribed",
    openRate: i < 16 ? Math.floor(30 + Math.random() * 50) : undefined,
  }),
);

const CAMPAIGNS: Campaign[] = [
  {
    id: "c1",
    subject: "Bilan 2023 : MRJC en action pour les communautés rurales",
    sentAt: "2024-02-15",
    recipients: 312,
    openRate: 58.4,
    clickRate: 12.3,
    status: "sent",
  },
  {
    id: "c2",
    subject: "Résultats PROCASE II : une transformation en marche",
    sentAt: "2024-01-22",
    recipients: 287,
    openRate: 62.1,
    clickRate: 15.7,
    status: "sent",
  },
  {
    id: "c3",
    subject: "Nouvelles ressources disponibles — Mars 2024",
    sentAt: "2024-03-20",
    recipients: 298,
    openRate: 0,
    clickRate: 0,
    status: "scheduled",
  },
  {
    id: "c4",
    subject: "Brouillon — Appel à bénévoles Été 2024",
    sentAt: "",
    recipients: 0,
    openRate: 0,
    clickRate: 0,
    status: "draft",
  },
];

// ─── Modale nouvelle campagne ─────────────────────────────────────────────────
function CampaignModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    subject: "",
    preheader: "",
    body: "",
    scheduleDate: "",
    scheduleTime: "",
    sendNow: true,
  });
  const [step, setStep] = useState(1);

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
        {/* Stepper */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-gray-900">Nouvelle campagne</h2>
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step >= s
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {step > s ? <CheckCircle2 size={14} /> : s}
              </div>
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">
              1. En-tête du message
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Objet de l'email *
              </label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) =>
                  setForm((f) => ({ ...f, subject: e.target.value }))
                }
                placeholder="Ex: Bilan 2024 : MRJC en action..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
              <p className="mt-1 text-xs text-gray-400">
                60 caractères recommandés. ({form.subject.length} / 80)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Pré-en-tête
              </label>
              <input
                type="text"
                value={form.preheader}
                onChange={(e) =>
                  setForm((f) => ({ ...f, preheader: e.target.value }))
                }
                placeholder="Texte visible dans l'aperçu de la boîte mail..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">2. Contenu</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Corps du message
              </label>
              <textarea
                rows={10}
                value={form.body}
                onChange={(e) =>
                  setForm((f) => ({ ...f, body: e.target.value }))
                }
                placeholder="Rédigez le contenu de votre newsletter..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none font-mono"
              />
            </div>
            <p className="text-xs text-gray-400 bg-gray-50 rounded-xl p-3">
              💡 Astuce : Utilisez [PRENOM] pour personnaliser le prénom de
              l'abonné. Les liens https:// seront automatiquement trackés.
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <h3 className="font-semibold text-gray-800">3. Envoi</h3>
            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Objet :</span>{" "}
                  <span className="font-medium">{form.subject || "—"}</span>
                </div>
                <div>
                  <span className="text-gray-500">Destinataires :</span>{" "}
                  <span className="font-medium text-primary-600">
                    298 abonnés actifs
                  </span>
                </div>
              </div>
            </div>
            <div>
              <label className="flex items-center gap-3 cursor-pointer mb-4">
                <div
                  onClick={() =>
                    setForm((f) => ({ ...f, sendNow: !f.sendNow }))
                  }
                  className={`w-10 h-5 rounded-full transition-colors relative ${form.sendNow ? "bg-primary-600" : "bg-gray-200"}`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.sendNow ? "translate-x-5" : "translate-x-0.5"}`}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Envoyer immédiatement
                </span>
              </label>
              {!form.sendNow && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Date
                    </label>
                    <input
                      type="date"
                      value={form.scheduleDate}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, scheduleDate: e.target.value }))
                      }
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Heure
                    </label>
                    <input
                      type="time"
                      value={form.scheduleTime}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, scheduleTime: e.target.value }))
                      }
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200"
            >
              ← Retour
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200"
            >
              Annuler
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={step === 1 && !form.subject.trim()}
              className="px-5 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-xl hover:bg-primary-700 disabled:opacity-40"
            >
              Suivant →
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 flex items-center gap-2"
            >
              <Send size={14} />{" "}
              {form.sendNow ? "Envoyer maintenant" : "Planifier l'envoi"}
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] =
    useState<Subscriber[]>(INITIAL_SUBSCRIBERS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"subscribers" | "campaigns">(
    "subscribers",
  );

  const filtered = subscribers.filter((s) => {
    const matchSearch = s.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: subscribers.filter((s) => s.status === "active").length,
    unsubscribed: subscribers.filter((s) => s.status === "unsubscribed").length,
    avgOpenRate: Math.round(
      subscribers
        .filter((s) => s.openRate)
        .reduce((acc, s) => acc + (s.openRate || 0), 0) /
        subscribers.filter((s) => s.openRate).length,
    ),
    campaigns: CAMPAIGNS.filter((c) => c.status === "sent").length,
  };

  const handleExport = () => {
    const csv = ["Email,Nom,Date inscription,Source,Statut"]
      .concat(
        subscribers.map((s) =>
          [s.email, s.name || "", s.subscribedAt, s.source, s.status].join(","),
        ),
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const SOURCE_LABELS: Record<
    Subscriber["source"],
    { label: string; color: string }
  > = {
    site: { label: "Site web", color: "bg-primary-100 text-primary-700" },
    import: { label: "Import", color: "bg-blue-100 text-blue-700" },
    event: { label: "Événement", color: "bg-violet-100 text-violet-700" },
  };

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Newsletter
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {stats.total} abonnés actifs
          </p>
        </div>
        <button
          onClick={() => setShowCampaignModal(true)}
          className="inline-flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors"
        >
          <Send size={15} /> Nouvelle campagne
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Abonnés actifs",
            value: stats.total,
            icon: <Users size={16} />,
            color: "emerald",
          },
          {
            label: "Désabonnés",
            value: stats.unsubscribed,
            icon: <XCircle size={16} />,
            color: "gray",
          },
          {
            label: "Taux ouverture moy.",
            value: `${stats.avgOpenRate}%`,
            icon: <Eye size={16} />,
            color: "blue",
          },
          {
            label: "Campagnes envoyées",
            value: stats.campaigns,
            icon: <Send size={16} />,
            color: "violet",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${s.color}-50 text-${s.color}-600`}
            >
              {s.icon}
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Onglets */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100">
          {(["subscribers", "campaigns"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3.5 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "text-primary-700 border-b-2 border-primary-600 bg-primary-50/30"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "subscribers" ? "👥 Abonnés" : "📬 Campagnes"}
            </button>
          ))}
        </div>

        {activeTab === "subscribers" && (
          <div>
            {/* Filtres */}
            <div className="flex gap-4 p-4 border-b border-gray-50">
              <div className="flex-1 relative">
                <Search
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none"
              >
                <option value="all">Tous</option>
                <option value="active">Actifs</option>
                <option value="unsubscribed">Désabonnés</option>
              </select>
              <button
                onClick={handleExport}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 bg-gray-100 px-3 py-2 rounded-xl hover:bg-gray-200"
              >
                <FileDown size={14} /> Export CSV
              </button>
            </div>

            {/* Table abonnés */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">
                      EMAIL
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">
                      SOURCE
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">
                      DATE
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">
                      TAUX OUVERTURE
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">
                      STATUT
                    </th>
                    <th className="text-right text-xs font-semibold text-gray-500 px-5 py-3">
                      ACTION
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.slice(0, 15).map((s) => {
                    const srcInfo = SOURCE_LABELS[s.source];
                    return (
                      <tr
                        key={s.id}
                        className="border-b border-gray-50 hover:bg-gray-50/50"
                      >
                        <td className="px-5 py-3.5">
                          <div className="text-sm font-medium text-gray-800">
                            {s.email}
                          </div>
                          {s.name && (
                            <div className="text-xs text-gray-400">
                              {s.name}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`px-2 py-1 rounded-lg text-xs font-medium ${srcInfo.color}`}
                          >
                            {srcInfo.label}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-gray-400">
                          {s.subscribedAt}
                        </td>
                        <td className="px-4 py-3.5">
                          {s.openRate ? (
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary-400 rounded-full"
                                  style={{ width: `${s.openRate}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-600">
                                {s.openRate}%
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-300">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
                              s.status === "active"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {s.status === "active" ? (
                              <CheckCircle2 size={10} />
                            ) : (
                              <XCircle size={10} />
                            )}
                            {s.status === "active" ? "Actif" : "Désabonné"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            onClick={() =>
                              setSubscribers((prev) =>
                                prev.filter((x) => x.id !== s.id),
                              )
                            }
                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="py-12 text-center text-gray-400 text-sm">
                  Aucun abonné trouvé
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "campaigns" && (
          <div className="p-5 space-y-3">
            {CAMPAIGNS.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl hover:bg-gray-50/50 transition-colors"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    c.status === "sent"
                      ? "bg-emerald-100 text-emerald-600"
                      : c.status === "scheduled"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {c.status === "sent" ? (
                    <CheckCircle2 size={16} />
                  ) : c.status === "scheduled" ? (
                    <Clock size={16} />
                  ) : (
                    <Mail size={16} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-gray-900 truncate">
                    {c.subject}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {c.status === "sent"
                      ? `Envoyé le ${c.sentAt} · ${c.recipients} destinataires`
                      : c.status === "scheduled"
                        ? `Programmé le ${c.sentAt}`
                        : "Brouillon"}
                  </div>
                </div>
                {c.status === "sent" && (
                  <div className="flex items-center gap-4 text-xs text-gray-500 shrink-0">
                    <div className="flex items-center gap-1">
                      <Eye size={12} />
                      {c.openRate}%
                    </div>
                    <div className="flex items-center gap-1">
                      <MousePointerClick size={12} />
                      {c.clickRate}%
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showCampaignModal && (
          <CampaignModal onClose={() => setShowCampaignModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
