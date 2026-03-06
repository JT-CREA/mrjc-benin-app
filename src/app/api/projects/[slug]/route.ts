/**
 * API Route — GET /api/projects/[slug]
 * Récupère un projet individuel par son slug
 * - Données complètes (description longue, galerie, équipe, partenaires, indicateurs)
 * - Projets connexes dans le même domaine
 */

import path from "path";
import { promises as fs } from "fs";
import { ok, notFound, serverError } from "@/lib/utils/response";

export const runtime = "nodejs";
export const revalidate = 1800; // 30 min

interface Project {
  id: string;
  slug: string;
  title: string;
  status: "ongoing" | "completed" | "planned" | "suspended";
  domain: string;
  location?: string;
  summary?: string;
  description?: string;
  objectives?: string[];
  beneficiaries?: string[] | { count: number; description: string };
  outcomes?: string[];
  budget?: { total?: string; secured?: string; currency?: string };
  timeline?: { start?: string; end?: string };
  partners?: string[];
  funders?: string[];
  team?: { name: string; role: string; photo?: string }[];
  gallery?: string[];
  coverImage?: string;
  indicators?: { label: string; value: string | number; unit?: string }[];
  featured?: boolean;
  publishedAt?: string;
}

async function loadProjectsFromFile(): Promise<Project[]> {
  try {
    const filePath = path.join(process.cwd(), "src", "data", "projects.json");
    const raw = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : (parsed.projects ?? []);
  } catch {
    return [];
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }, // 1. Définir params comme une Promise
) {
  // 2. Attendre la résolution de la Promise pour obtenir le slug
  const { slug } = await params;

  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return notFound("Projet");
  }

  try {
    let project: Project | undefined;
    let related: Partial<Project>[] = [];

    /* MongoDB */
    if (process.env.MONGODB_URI) {
      try {
        const { connectToDatabase, COLLECTIONS } =
          await import("@/lib/db/mongodb");
        const { db } = await connectToDatabase();
        const coll = db.collection<Project>(COLLECTIONS.PROJECTS);

        project = (await coll.findOne({ slug })) ?? undefined;
        if (project) {
          related = (await coll
            .find({
              slug: { $ne: slug },
              domain: project.domain,
              status: { $ne: "planned" },
            })
            .sort({ publishedAt: -1 })
            .limit(3)
            .project({ description: 0, objectives: 0, outcomes: 0 })
            .toArray()) as Partial<Project>[];
        }
      } catch {
        /* Fallback JSON */
      }
    }

    /* Fallback JSON */
    if (!project) {
      const all = await loadProjectsFromFile();
      project = all.find((p) => p.slug === slug);
      if (project) {
        related = all
          .filter((p) => p.slug !== slug && p.domain === project!.domain)
          .slice(0, 3)
          .map(
            ({ description: _d, objectives: _o, outcomes: _oc, ...rest }) =>
              rest,
          );
      }
    }

    if (!project) return notFound("Projet");

    return ok({ project, related });
  } catch (error) {
    console.error(`[API /projects/${slug}] Erreur:`, error);
    return serverError(error);
  }
}
