import type { Metadata } from "next";
import { notFound } from "next/navigation";
import allProjects from "@/data/projects.json";
import type { Project } from "@/types/project.types";
import ProjectDetailClient from "@/components/sections/projects/ProjectDetailClient";
import { siteConfig } from "@/config/site.config";

/* ─────────────────────────────────────────────────────────────
   ISR — Pré-génération des slugs
───────────────────────────────────────────────────────────── */
export async function generateStaticParams() {
  return (allProjects as Project[]).map((p) => ({ slug: p.slug }));
}

/* ─────────────────────────────────────────────────────────────
   Métadonnées dynamiques
───────────────────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  // Correction : Extraction du slug après l'ouverture de la fonction
  const { slug } = await params;

  const project = (allProjects as Project[]).find((p) => p.slug === slug);
  if (!project) return { title: "Projet introuvable" };

  const totalBenef = project.beneficiaries.reduce((s, b) => s + b.count, 0);

  return {
    title: project.metaTitle || `${project.title} — Projets MRJC-BÉNIN`,
    description:
      project.metaDescription ||
      `${project.excerpt} ${totalBenef.toLocaleString("fr-FR")} bénéficiaires.`,
    keywords: project.tags,
    openGraph: {
      type: "article",
      url: `${siteConfig.url}/projects/${project.slug}`,
      title: project.title,
      description: project.excerpt,
      images: [
        {
          url: project.coverImage,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
      publishedTime: project.publishedAt,
      modifiedTime: project.updatedAt,
    },
    alternates: {
      canonical: `${siteConfig.url}/projects/${project.slug}`,
    },
  };
}

/* ─────────────────────────────────────────────────────────────
   Page (Server Component)
───────────────────────────────────────────────────────────── */
export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Correction : On doit attendre les paramètres pour extraire le slug
  const { slug } = await params;

  const project = (allProjects as Project[]).find((p) => p.slug === slug);
  if (!project) notFound();

  /* Projets connexes (même domaine, différent) */
  const related = (allProjects as Project[])
    .filter((p) => p.domain === project.domain && p.slug !== project.slug)
    .slice(0, 3);

  /* Schema.org Article */
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: project.title,
    description: project.excerpt,
    image: project.coverImage,
    datePublished: project.publishedAt,
    dateModified: project.updatedAt,
    author: { "@type": "Organization", name: siteConfig.fullName },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    about: {
      "@type": "Project",
      name: project.title,
      description: project.excerpt,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ProjectDetailClient project={project} relatedProjects={related} />
    </>
  );
}
