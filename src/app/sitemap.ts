/**
 * Sitemap.xml — Auto-généré par Next.js 14
 * Route: /sitemap.xml
 * Inclut toutes les pages publiques du site MRJC-BÉNIN
 */

import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site.config";
import projectsData from "@/data/projects.json";
import blogPostsData from "@/data/blog-posts.json";
import domainsData from "@/data/domains.json";

const BASE = siteConfig.url;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // ── Pages statiques ───────────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    {
      url: `${BASE}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE}/about/history`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${BASE}/about/values`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${BASE}/about/vision-mission`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${BASE}/about/organization`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE}/domains`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE}/projects`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE}/impact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE}/partners`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE}/news`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE}/resources`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE}/resources/publications`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE}/resources/photo-albums`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE}/work-with-us`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE}/work-with-us/jobs`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE}/work-with-us/collaboration`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE}/work-with-us/internship`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE}/work-with-us/volunteer`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE}/contact`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${BASE}/search`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    // Légal (faible priorité SEO)
    {
      url: `${BASE}/legal-mentions`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE}/privacy-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE}/cookie-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE}/terms-of-use`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // ── Domaines dynamiques ───────────────────────────────────────────────────
  const domainPages: MetadataRoute.Sitemap = (
    domainsData as { slug: string }[]
  ).map((domain) => ({
    url: `${BASE}/domains/${domain.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // ── Projets dynamiques ────────────────────────────────────────────────────
  const projectPages: MetadataRoute.Sitemap = (
    projectsData as { slug: string; updatedAt?: string }[]
  ).map((project) => ({
    url: `${BASE}/projects/${project.slug}`,
    lastModified: project.updatedAt ? new Date(project.updatedAt) : now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // ── Articles blog & actualités ─────────────────────────────────────────────
  const blogPages: MetadataRoute.Sitemap = (
    blogPostsData as { slug: string; type: string; publishedAt?: string }[]
  ).map((post) => ({
    url: `${BASE}/${post.type === "news" ? "news" : "blog"}/${post.slug}`,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : now,
    changeFrequency:
      post.type === "news" ? ("daily" as const) : ("weekly" as const),
    priority: post.type === "news" ? 0.8 : 0.6,
  }));

  return [...staticPages, ...domainPages, ...projectPages, ...blogPages];
}
