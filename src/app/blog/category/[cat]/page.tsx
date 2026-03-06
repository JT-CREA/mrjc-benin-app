import type { Metadata } from "next";
import { notFound } from "next/navigation";
import blogPostsData from "@/data/blog-posts.json";
import type { BlogPost } from "@/types/blog.types";
import PageHeader from "@/components/layout/PageHeader";
import BlogClient from "@/components/sections/blog/BlogClient";
import { generatePageMetadata } from "@/lib/seo/generateMetadata";

const posts = blogPostsData as BlogPost[];

const CATEGORIES: Record<string, { label: string; description: string }> = {
  agriculture: {
    label: "Agriculture & Filières",
    description:
      "Articles sur le développement agricole et les filières au Bénin.",
  },
  sante: {
    label: "Santé Communautaire",
    description:
      "Ressources sur la nutrition et la santé des communautés rurales.",
  },
  education: {
    label: "Éducation & Alphabétisation",
    description: "Initiatives d'alphabétisation et d'éducation non formelle.",
  },
  femmes: {
    label: "Autonomisation des Femmes",
    description: "Leadership féminin, entrepreneuriat et droits des femmes.",
  },
  intermediation: {
    label: "Intermédiation Sociale",
    description: "Cohésion communautaire, médiation et gouvernance locale.",
  },
  actualites: {
    label: "Actualités",
    description: "Dernières nouvelles et événements de MRJC-BÉNIN.",
  },
  publications: {
    label: "Publications",
    description: "Articles de fond, analyses et tribunes.",
  },
};

export async function generateStaticParams() {
  return Object.keys(CATEGORIES).map((cat) => ({ cat }));
}

// 1. CORRECTION DES METADATAS (Extraction du slug cat)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ cat: string }>;
}): Promise<Metadata> {
  const { cat: catSlug } = await params;
  const catConfig = CATEGORIES[catSlug];

  if (!catConfig)
    return { title: "Catégorie introuvable", robots: { index: false } };

  return generatePageMetadata({
    title: `Blog — ${catConfig.label}`,
    description: catConfig.description,
    slug: `blog/category/${catSlug}`,
    keywords: [catConfig.label, "blog MRJC", "articles ONG Bénin"],
  });
}

// 2. CORRECTION DE LA PAGE (Structure des accolades)
export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ cat: string }>;
}) {
  const { cat } = await params;
  const catConfig = CATEGORIES[cat];

  if (!catConfig) notFound();

  const filtered = posts.filter(
    (p) =>
      p.type === "blog" &&
      (p.category?.toLowerCase() === cat.toLowerCase() ||
        p.tags?.some((t) => t.toLowerCase().includes(cat.toLowerCase()))),
  );

  return (
    <>
      <PageHeader
        tag="Blog"
        title={catConfig.label}
        breadcrumbs={[
          { label: "Blog", href: "/blog" },
          { label: catConfig.label },
        ]}
      />
      <section className="section-mrjc bg-gray-50">
        <div className="container-mrjc">
          {filtered.length > 0 ? (
            <BlogClient initialPosts={filtered} type="blog" />
          ) : (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">📝</p>
              <p className="text-xl font-semibold text-gray-700 mb-2">
                Aucun article dans cette catégorie
              </p>
              <p className="text-gray-500 mb-6">
                Les prochains articles seront publiés bientôt.
              </p>
              <a href="/blog" className="btn-primary">
                Voir tous les articles
              </a>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
