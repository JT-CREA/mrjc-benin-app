/**
 * API Route — GET /api/blog/[slug]
 * Récupère un article de blog par son slug
 * - Lecture depuis JSON statique (fallback) ou MongoDB
 * - Incrémente le compteur de vues (optionnel, async)
 * - Retourne les articles connexes
 */

import path from "path";
import { promises as fs } from "fs";
import { ok, notFound, serverError } from "@/lib/utils/response";

export const runtime = "nodejs";
export const revalidate = 900; // 15 min ISR

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  category: string;
  tags?: string[];
  author?: string;
  publishedAt: string;
  updatedAt?: string;
  coverImage?: string;
  featured?: boolean;
  viewCount?: number;
  readingTime?: number;
}

async function loadPostsFromFile(): Promise<BlogPost[]> {
  try {
    const filePath = path.join(process.cwd(), "src", "data", "blog-posts.json");
    const raw = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : (parsed.posts ?? []);
  } catch {
    return [];
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  // 1. On attend la résolution des paramètres
  const { slug } = await params;

  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return notFound("Article");
  }

  try {
    let post: BlogPost | undefined;
    let allPosts: BlogPost[] = [];

    /* Tenter MongoDB en premier */
    if (process.env.MONGODB_URI) {
      try {
        const { connectToDatabase, COLLECTIONS } =
          await import("@/lib/db/mongodb");
        const { db } = await connectToDatabase();
        const coll = db.collection<BlogPost>(COLLECTIONS.BLOG);

        post = (await coll.findOne({ slug })) ?? undefined;
        if (post) {
          /* Incrémenter les vues en arrière-plan (fire & forget) */
          coll
            .updateOne({ slug }, { $inc: { viewCount: 1 } })
            .catch(() => null);
          /* Charger articles connexes */
          allPosts = await coll
            .find({ slug: { $ne: slug }, category: post.category })
            .sort({ publishedAt: -1 })
            .limit(3)
            .toArray();
        }
      } catch {
        /* DB indisponible → fallback JSON */
      }
    }

    /* Fallback JSON */
    if (!post) {
      allPosts = await loadPostsFromFile();
      post = allPosts.find((p) => p.slug === slug);
    }

    if (!post) return notFound("Article");

    /* Articles connexes depuis JSON */
    const related = allPosts
      .filter((p) => p.slug !== slug && p.category === post!.category)
      .slice(0, 3)
      .map(({ content: _c, ...rest }) => rest);

    return ok({ post, related });
  } catch (error) {
    console.error(`[API /blog/${slug}] Erreur:`, error);
    return serverError(error);
  }
}
