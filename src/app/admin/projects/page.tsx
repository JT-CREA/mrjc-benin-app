"use client";

/**
 * Page Admin — Gestion des Projets
 * Route: /admin/projects
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit2,
  Trash2,
  Eye,
  Plus,
  FolderOpen,
  X,
  Save,
  Loader2,
} from "lucide-react";
import AdminDataTable, { Column, Action } from "@/components/admin/DataTable";
import StatsCard from "@/components/admin/StatsCard";
import projectsData from "@/data/projects.json";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Project {
  id: string;
  slug: string;
  title: string;
  status: string;
  domain: string;
  location: string;
  startDate: string;
  endDate?: string;
  budget?: string;
  beneficiaries?: number;
  department?: string;
  [key: string]: unknown;
}

// ─── Badge statut ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    active: { bg: "bg-green-100", text: "text-green-700", label: "Actif" },
    completed: { bg: "bg-blue-100", text: "text-blue-700", label: "Terminé" },
    planned: { bg: "bg-amber-100", text: "text-amber-700", label: "Planifié" },
    paused: { bg: "bg-red-100", text: "text-red-700", label: "Suspendu" },
  };
  const c = config[status] ?? {
    bg: "bg-gray-100",
    text: "text-gray-600",
    label: status,
  };
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${c.bg} ${c.text}`}
    >
      {c.label}
    </span>
  );
}

// ─── Modal projet ─────────────────────────────────────────────────────────────
function ProjectModal({
  project,
  onClose,
  onSave,
}: {
  project: Partial<Project> | null;
  onClose: () => void;
  onSave: (p: Partial<Project>) => void;
}) {
  const [form, setForm] = useState<Partial<Project>>(project ?? {});
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    onSave(form);
    setSaving(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ scale: 0.95, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 16 }}
        className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {project?.id ? "Modifier le projet" : "Nouveau projet"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-2 max-h-[60vh] overflow-y-auto">
          {[
            { key: "title", label: "Titre du projet", type: "text", span: 2 },
            {
              key: "domain",
              label: "Domaine",
              type: "select",
              options: [
                "Conseil Agricole",
                "Santé Communautaire",
                "Alphabétisation",
                "Autonomisation Femmes",
                "Intermédiation Sociale",
              ],
            },
            {
              key: "status",
              label: "Statut",
              type: "select",
              options: ["active", "planned", "completed", "paused"],
            },
            { key: "location", label: "Localisation", type: "text" },
            { key: "department", label: "Département", type: "text" },
            { key: "startDate", label: "Date début", type: "date" },
            { key: "endDate", label: "Date fin", type: "date" },
            { key: "budget", label: "Budget (FCFA)", type: "text" },
            { key: "beneficiaries", label: "Bénéficiaires", type: "number" },
          ].map((field) => (
            <div
              key={field.key}
              className={field.span === 2 ? "col-span-2" : ""}
            >
              <label className="mb-1 block text-xs font-medium text-gray-600">
                {field.label}
              </label>
              {field.type === "select" ? (
                <select
                  value={String(form[field.key] ?? "")}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [field.key]: e.target.value }))
                  }
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-primary-300 focus:outline-none"
                >
                  <option value="">Sélectionner</option>
                  {field.options?.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  value={String(form[field.key] ?? "")}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [field.key]: e.target.value }))
                  }
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-primary-300 focus:outline-none"
                />
              )}
            </div>
          ))}

          <div className="col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Description courte
            </label>
            <textarea
              rows={3}
              value={String(form.shortDescription ?? "")}
              onChange={(e) =>
                setForm((f) => ({ ...f, shortDescription: e.target.value }))
              }
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-primary-300 focus:outline-none resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-gray-100 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-60"
          >
            {saving ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Save size={14} />
            )}
            Enregistrer
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(projectsData as any[]);
  const [modalProject, setModalProject] = useState<
    Partial<Project> | null | false
  >(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const stats = {
    total: projects.length,
    active: projects.filter((p) => p.status === "active").length,
    completed: projects.filter((p) => p.status === "completed").length,
    planned: projects.filter((p) => p.status === "planned").length,
  };

  const columns: Column<Project>[] = [
    {
      key: "title",
      label: "Projet",
      sortable: true,
      render: (v, row) => (
        <div>
          <p className="font-medium text-gray-800 leading-tight">{String(v)}</p>
          <p className="text-xs text-gray-400 mt-0.5">{row.location}</p>
        </div>
      ),
    },
    {
      key: "domain",
      label: "Domaine",
      sortable: true,
      render: (v) => (
        <span className="text-xs text-gray-600">
          {String(v).substring(0, 24)}...
        </span>
      ),
    },
    {
      key: "status",
      label: "Statut",
      sortable: true,
      render: (v) => <StatusBadge status={String(v)} />,
    },
    {
      key: "startDate",
      label: "Début",
      sortable: true,
      render: (v) => (
        <span className="text-xs text-gray-500">
          {new Date(String(v)).toLocaleDateString("fr-FR")}
        </span>
      ),
    },
    {
      key: "beneficiaries",
      label: "Bénéficiaires",
      sortable: true,
      render: (v) => (
        <span className="font-medium text-gray-700">
          {v ? Number(v).toLocaleString("fr-FR") : "—"}
        </span>
      ),
    },
  ];

  const actions: Action<Project>[] = [
    {
      label: "Voir",
      icon: Eye,
      onClick: (row) => window.open(`/projects/${row.slug}`, "_blank"),
    },
    {
      label: "Modifier",
      icon: Edit2,
      onClick: (row) => setModalProject(row),
      color: "hover:text-blue-600",
    },
    {
      label: "Supprimer",
      icon: Trash2,
      onClick: (row) => setDeleteConfirm(row.id),
      color: "hover:text-red-600",
    },
  ];

  const handleSave = (updated: Partial<Project>) => {
    if (updated.id) {
      setProjects((prev) =>
        prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p)),
      );
    } else {
      setProjects((prev) => [
        ...prev,
        { ...updated, id: Date.now().toString() } as Project,
      ]);
    }
    setModalProject(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestion des Projets
          </h1>
          <p className="text-sm text-gray-400">
            {stats.total} projets au total
          </p>
        </div>
        <button
          onClick={() => setModalProject({})}
          className="flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700 shadow-sm transition-colors"
        >
          <Plus size={16} /> Nouveau projet
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          {
            title: "Total",
            value: stats.total,
            icon: FolderOpen,
            iconColor: "text-gray-600",
            iconBg: "bg-gray-100",
          },
          {
            title: "Actifs",
            value: stats.active,
            icon: FolderOpen,
            iconColor: "text-green-600",
            iconBg: "bg-green-50",
            trend: 5,
          },
          {
            title: "Terminés",
            value: stats.completed,
            icon: FolderOpen,
            iconColor: "text-blue-600",
            iconBg: "bg-blue-50",
          },
          {
            title: "Planifiés",
            value: stats.planned,
            icon: FolderOpen,
            iconColor: "text-amber-600",
            iconBg: "bg-amber-50",
          },
        ].map((s) => (
          <StatsCard key={s.title} {...s} />
        ))}
      </div>

      <AdminDataTable
        title="Liste des projets"
        data={projects}
        columns={columns}
        actions={actions}
        onAdd={() => setModalProject({})}
        addLabel="Nouveau projet"
        searchPlaceholder="Rechercher un projet..."
        onRefresh={() => {}}
      />

      {/* Modal */}
      <AnimatePresence>
        {modalProject !== false && (
          <ProjectModal
            project={modalProject}
            onClose={() => setModalProject(false)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <Trash2 size={22} className="text-red-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-800">
                Confirmer la suppression
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Cette action est irréversible. Le projet sera définitivement
                supprimé.
              </p>
              <div className="mt-5 flex justify-end gap-2">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    setProjects((prev) =>
                      prev.filter((p) => p.id !== deleteConfirm),
                    );
                    setDeleteConfirm(null);
                  }}
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
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
