/**
 * API Route — GET /api/projects
 * Liste paginée, filtrée et triée des projets MRJC-BÉNIN.
 *
 * Query params :
 *   status     = 'ongoing' | 'completed' | 'planned' | 'all'
 *   domain     = 'agricultural-council' | 'community-health' | ...
 *   department = 'Borgou' | 'Atacora' | ...
 *   featured   = 'true' | 'false'
 *   search     = string
 *   page       = number (défaut: 1)
 *   limit      = number (défaut: 12)
 *   sort       = 'beneficiaries' | 'budget' | 'date' | 'title'
 */

import { NextRequest, NextResponse } from "next/server";
import allProjects from "@/data/projects.json";
import type { Project } from "@/types/project.types";

const projects = allProjects as Project[];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const status = searchParams.get("status");
  const domain = searchParams.get("domain");
  const department = searchParams.get("department");
  const featured = searchParams.get("featured");
  const search = searchParams.get("search")?.toLowerCase();
  const sort = searchParams.get("sort") ?? "date";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(
    50,
    Math.max(1, parseInt(searchParams.get("limit") ?? "12", 10)),
  );

  // ── Filtres ──────────────────────────────────────────────────────────
  let filtered = [...projects];

  if (status && status !== "all") {
    filtered = filtered.filter((p) => p.status === status);
  }

  if (domain && domain !== "all") {
    filtered = filtered.filter(
      (p) =>
        p.domain === domain || p.domains?.includes(domain as Project["domain"]),
    );
  }

  if (department) {
    filtered = filtered.filter((p) => p.departments?.includes(department));
  }

  if (featured === "true") {
    filtered = filtered.filter((p) => p.featured);
  }

  if (search) {
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(search) ||
        p.excerpt.toLowerCase().includes(search) ||
        p.tags.some((t) => t.toLowerCase().includes(search)) ||
        p.departments?.some((d) => d.toLowerCase().includes(search)) ||
        p.communes?.some((c) => c.toLowerCase().includes(search)),
    );
  }

  // ── Tri ──────────────────────────────────────────────────────────────
  filtered.sort((a, b) => {
    switch (sort) {
      case "beneficiaries": {
        const sumA = a.beneficiaries.reduce((s, x) => s + x.count, 0);
        const sumB = b.beneficiaries.reduce((s, x) => s + x.count, 0);
        return sumB - sumA;
      }
      case "budget":
        return (b.budget ?? 0) - (a.budget ?? 0);
      case "title":
        return a.title.localeCompare(b.title, "fr");
      case "date":
      default:
        return (
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
    }
  });

  // ── Pagination ───────────────────────────────────────────────────────
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const paginated = filtered.slice(offset, offset + limit);

  // ── Méta-données de filtre disponibles ───────────────────────────────
  const allDomains = [...new Set(projects.map((p) => p.domain))];
  const allDepartments = [
    ...new Set(projects.flatMap((p) => p.departments ?? [])),
  ].sort();
  const statusCounts = {
    ongoing: projects.filter((p) => p.status === "ongoing").length,
    completed: projects.filter((p) => p.status === "completed").length,
    planned: projects.filter((p) => p.status === "planned").length,
    all: projects.length,
  };

  return NextResponse.json(
    {
      projects: paginated,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      filters: {
        domains: allDomains,
        departments: allDepartments,
        statusCounts,
      },
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    },
  );
}
