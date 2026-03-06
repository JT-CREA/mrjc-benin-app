"use client";

/**
 * Composant — AdminDataTable
 * Table CRUD réutilisable pour tous les modules admin.
 * Fonctionnalités: recherche, tri, pagination, sélection, actions.
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Filter,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
  CheckSquare,
  Square,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface Column<T = Record<string, unknown>> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: unknown, row: T) => React.ReactNode;
}

export interface Action<T = Record<string, unknown>> {
  label: string;
  icon: React.ElementType;
  onClick: (row: T) => void;
  color?: string;
  condition?: (row: T) => boolean;
}

interface DataTableProps<T extends Record<string, unknown>> {
  title: string;
  data: T[];
  columns: Column<T>[];
  actions?: Action<T>[];
  onAdd?: () => void;
  addLabel?: string;
  searchPlaceholder?: string;
  itemsPerPage?: number;
  loading?: boolean;
  onRefresh?: () => void;
  filterComponent?: React.ReactNode;
}

// ─── Composant ────────────────────────────────────────────────────────────────
export default function AdminDataTable<T extends Record<string, unknown>>({
  title,
  data,
  columns,
  actions = [],
  onAdd,
  addLabel = "Ajouter",
  searchPlaceholder = "Rechercher...",
  itemsPerPage = 10,
  loading = false,
  onRefresh,
  filterComponent,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  // ─── Filtrage ──────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((row) =>
      Object.values(row).some(
        (v) => typeof v === "string" && v.toLowerCase().includes(q),
      ),
    );
  }, [data, search]);

  // ─── Tri ──────────────────────────────────────────────────────────────────
  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey] ?? "";
      const bv = b[sortKey] ?? "";
      const cmp = String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  // ─── Pagination ──────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(sorted.length / itemsPerPage));
  const pageData = sorted.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  };

  const toggleSelect = (i: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === pageData.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(pageData.map((_, i) => i)));
    }
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-800">{title}</h2>
          <p className="text-xs text-gray-400">
            {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
            {search && ` pour "${search}"`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={searchPlaceholder}
              className="rounded-lg border border-gray-200 bg-gray-50 py-2 pl-8 pr-3 text-xs focus:border-primary-300 focus:outline-none focus:ring-1 focus:ring-primary-100 w-44"
            />
          </div>

          {/* Filter toggle */}
          {filterComponent && (
            <button
              onClick={() => setShowFilters((s) => !s)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                showFilters
                  ? "border-primary-300 bg-primary-50 text-primary-700"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Filter size={13} />
              Filtres
            </button>
          )}

          {/* Refresh */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <RefreshCw size={14} />
            </button>
          )}

          {/* Export */}
          <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <Download size={13} />
            Export
          </button>

          {/* Add */}
          {onAdd && (
            <button
              onClick={onAdd}
              className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-2 text-xs font-medium text-white hover:bg-primary-700 transition-colors shadow-sm"
            >
              <Plus size={14} />
              {addLabel}
            </button>
          )}
        </div>
      </div>

      {/* Filters panel */}
      <AnimatePresence>
        {showFilters && filterComponent && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-gray-100 bg-gray-50 px-5 py-4"
          >
            {filterComponent}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk actions */}
      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex items-center gap-3 border-b border-blue-100 bg-blue-50 px-5 py-2.5"
          >
            <span className="text-sm font-medium text-blue-700">
              {selected.size} élément{selected.size > 1 ? "s" : ""} sélectionné
              {selected.size > 1 ? "s" : ""}
            </span>
            <button className="rounded-lg bg-red-100 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-200">
              Supprimer la sélection
            </button>
            <button className="rounded-lg bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-200">
              Exporter la sélection
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="w-10 px-4 py-3 text-left">
                <button
                  onClick={toggleAll}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {selected.size === pageData.length && pageData.length > 0 ? (
                    <CheckSquare size={15} className="text-primary-600" />
                  ) : (
                    <Square size={15} />
                  )}
                </button>
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={col.width ? { width: col.width } : undefined}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                >
                  {col.sortable ? (
                    <button
                      onClick={() => handleSort(col.key)}
                      className="flex items-center gap-1 hover:text-gray-800 transition-colors"
                    >
                      {col.label}
                      <span className="flex flex-col">
                        <ChevronUp
                          size={9}
                          className={
                            sortKey === col.key && sortDir === "asc"
                              ? "text-primary-600"
                              : "text-gray-300"
                          }
                        />
                        <ChevronDown
                          size={9}
                          className={
                            sortKey === col.key && sortDir === "desc"
                              ? "text-primary-600"
                              : "text-gray-300"
                          }
                        />
                      </span>
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
              {actions.length > 0 && (
                <th className="w-24 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-gray-50">
                  <td className="px-4 py-3">
                    <div className="h-4 w-4 rounded bg-gray-200 animate-pulse" />
                  </td>
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      <div
                        className="h-4 rounded bg-gray-200 animate-pulse"
                        style={{ width: `${60 + Math.random() * 40}%` }}
                      />
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="px-4 py-3">
                      <div className="h-4 w-16 rounded bg-gray-200 animate-pulse ml-auto" />
                    </td>
                  )}
                </tr>
              ))
            ) : pageData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 2}
                  className="py-12 text-center text-sm text-gray-400"
                >
                  Aucun résultat trouvé
                </td>
              </tr>
            ) : (
              pageData.map((row, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className={`border-b border-gray-50 transition-colors hover:bg-gray-50/60 ${
                    selected.has(i) ? "bg-primary-50/40" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleSelect(i)}
                      className="text-gray-400 hover:text-primary-600"
                    >
                      {selected.has(i) ? (
                        <CheckSquare size={15} className="text-primary-600" />
                      ) : (
                        <Square size={15} />
                      )}
                    </button>
                  </td>
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-gray-700">
                      {col.render
                        ? col.render(row[col.key], row)
                        : String(row[col.key] ?? "—")}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {actions.slice(0, 2).map((action, ai) => {
                          const Icon = action.icon;
                          if (action.condition && !action.condition(row))
                            return null;
                          return (
                            <button
                              key={ai}
                              onClick={() => action.onClick(row)}
                              title={action.label}
                              className={`rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 ${action.color ?? "hover:text-gray-700"}`}
                            >
                              <Icon size={15} />
                            </button>
                          );
                        })}
                        {actions.length > 2 && (
                          <div className="relative">
                            <button
                              onClick={() =>
                                setOpenMenu(openMenu === i ? null : i)
                              }
                              className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                            >
                              <MoreHorizontal size={15} />
                            </button>
                            <AnimatePresence>
                              {openMenu === i && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  className="absolute right-0 top-full z-10 mt-1 w-40 rounded-xl border border-gray-100 bg-white shadow-lg py-1"
                                >
                                  {actions.slice(2).map((action, ai) => {
                                    const Icon = action.icon;
                                    if (
                                      action.condition &&
                                      !action.condition(row)
                                    )
                                      return null;
                                    return (
                                      <button
                                        key={ai}
                                        onClick={() => {
                                          action.onClick(row);
                                          setOpenMenu(null);
                                        }}
                                        className={`flex w-full items-center gap-2 px-3 py-2 text-xs text-gray-600 hover:bg-gray-50 ${action.color ?? ""}`}
                                      >
                                        <Icon size={13} />
                                        {action.label}
                                      </button>
                                    );
                                  })}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
          <p className="text-xs text-gray-400">
            {(page - 1) * itemsPerPage + 1}–
            {Math.min(page * itemsPerPage, sorted.length)} sur {sorted.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-7 w-7 rounded-lg text-xs font-medium transition-colors ${
                    p === page
                      ? "bg-primary-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
