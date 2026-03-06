import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import BlogClient from "@/components/sections/blog/BlogClient";
import allPosts from "@/data/blog-posts.json";
import type { BlogPost } from "@/types/blog.types";

export const metadata: Metadata = {
  title: "Blog & Analyses | MRJC-BÉNIN",
  description:
    "Articles de fond, analyses thématiques et success stories sur le développement rural au Bénin. Agriculture, santé, femmes, gouvernance.",
  openGraph: {
    title: "Blog MRJC-BÉNIN — Réflexions sur le développement rural",
    description:
      "Analyses, retours d'expérience et success stories de nos terrains d'intervention.",
    type: "website",
  },
};

export default function BlogPage() {
  const posts = (allPosts as BlogPost[]).filter(
    (p) => p.type === "blog" && p.status === "published",
  );

  return (
    <>
      <PageHeader
        tag="Réflexions & Analyses"
        title="Notre Blog"
        subtitle="Articles de fond, analyses thématiques, retours d'expérience du terrain et success stories rédigés par nos équipes."
        breadcrumbs={[{ label: "Blog" }]}
        image="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1920"
        size="sm"
      />
      <BlogClient initialPosts={posts} type="blog" />
    </>
  );
}
