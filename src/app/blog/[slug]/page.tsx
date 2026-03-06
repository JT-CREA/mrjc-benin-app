import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, User, ArrowLeft, Tag } from "lucide-react";
import allPosts from "@/data/blog-posts.json";
import type { BlogPost } from "@/types/blog.types";
import { cn } from "@/lib/utils/cn";
import ArticleShareButtons from "@/components/sections/blog/ArticleShareButtons";
import RelatedPosts from "@/components/sections/blog/RelatedPosts";
import ArticleTOC from "@/components/sections/blog/ArticleTOC";
import Breadcrumb from "@/components/layout/Breadcrumb";

/* ──────────────────────────────────────────────────────────
   Metadata dynamique
────────────────────────────────────────────────────────── */
export async function generateStaticParams() {
  return (allPosts as BlogPost[])
    .filter((p) => p.type === "blog")
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  // Correction : On attend params à l'intérieur de la fonction
  const { slug } = await params;

  const post = (allPosts as BlogPost[]).find((p) => p.slug === slug);
  if (!post) return { title: "Article non trouvé" };

  return {
    title: post.metaTitle || `${post.title} | Blog MRJC-BÉNIN`,
    description: post.metaDescription || post.excerpt,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      images: [
        { url: post.coverImage, width: 1200, height: 630, alt: post.title },
      ],
      publishedTime: post.publishedAt,
      authors: [post.author.name],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}

/* ──────────────────────────────────────────────────────────
   Styles catégories
────────────────────────────────────────────────────────── */
const categoryStyles: Record<string, string> = {
  agriculture: "bg-primary-100 text-primary-700",
  sante: "bg-accent-100 text-accent-700",
  education: "bg-secondary-100 text-secondary-700",
  femmes: "bg-purple-100 text-purple-700",
  gouvernance: "bg-neutral-100 text-neutral-600",
  partenariat: "bg-blue-100 text-blue-700",
  evenement: "bg-orange-100 text-orange-700",
  "success-story": "bg-green-100 text-green-700",
  analyse: "bg-indigo-100 text-indigo-700",
};

const categoryLabels: Record<string, string> = {
  agriculture: "Agriculture",
  sante: "Santé",
  education: "Éducation",
  femmes: "Femmes",
  gouvernance: "Gouvernance",
  partenariat: "Partenariat",
  evenement: "Événement",
  "success-story": "Success Story",
  analyse: "Analyse",
};

/* ──────────────────────────────────────────────────────────
   JSON-LD Article
────────────────────────────────────────────────────────── */
function ArticleSchema({ post }: { post: BlogPost }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      "@type": "Person",
      name: post.author.name,
      jobTitle: post.author.role,
    },
    publisher: {
      "@type": "Organization",
      name: "MRJC-BÉNIN",
      url: "https://mrjc-benin.org",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://mrjc-benin.org/blog/${post.slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/* ──────────────────────────────────────────────────────────
   Page composant
────────────────────────────────────────────────────────── */
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Correction : On extrait le slug avant de l'utiliser
  const { slug } = await params;

  const post = (allPosts as BlogPost[]).find(
    (p) => p.slug === slug && p.type === "blog",
  );

  if (!post) notFound();

  const related = (allPosts as BlogPost[])
    .filter(
      (p) =>
        p.id !== post.id &&
        p.category === post.category &&
        p.status === "published",
    )
    .slice(0, 3);

  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(post.publishedAt));

  return (
    <>
      <ArticleSchema post={post} />

      {/* Hero image */}
      <div className="relative h-72 lg:h-96 bg-neutral-900 overflow-hidden">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          priority
          className="object-cover opacity-70"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-transparent to-transparent" />

        {/* Breadcrumb */}
        <div className="absolute top-6 left-0 right-0 z-10">
          <div className="container-mrjc">
            <Breadcrumb
              items={[{ label: "Blog", href: "/blog" }, { label: post.title }]}
            />
          </div>
        </div>

        {/* Titre hero */}
        <div className="absolute bottom-0 left-0 right-0 pb-8">
          <div className="container-narrow">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span
                className={cn(
                  "text-xs font-semibold px-2.5 py-1 rounded-full",
                  categoryStyles[post.category] ||
                    "bg-neutral-100 text-neutral-700",
                )}
              >
                {categoryLabels[post.category] || post.category}
              </span>
              {post.featured && (
                <span className="text-xs font-bold bg-secondary-500 text-white px-2.5 py-1 rounded-full">
                  ⭐ À la une
                </span>
              )}
            </div>
            <h1 className="font-display text-2xl lg:text-4xl font-bold text-white leading-tight">
              {post.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="bg-white">
        <div className="container-mrjc py-12 lg:py-16">
          <div className="grid lg:grid-cols-[1fr_280px] gap-12">
            {/* Article principal */}
            <article>
              {/* Méta auteur */}
              <div
                className="flex flex-wrap items-center gap-6 pb-8 mb-8
                              border-b border-neutral-100"
              >
                <div className="flex items-center gap-3">
                  {post.author.photo ? (
                    <Image
                      src={post.author.photo}
                      alt={post.author.name}
                      width={48}
                      height={48}
                      className="rounded-full object-cover border-2 border-primary-100"
                    />
                  ) : (
                    <div
                      className="w-12 h-12 rounded-full bg-primary-100 flex items-center
                                    justify-center text-primary-600 font-bold text-lg"
                    >
                      {post.author.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-neutral-900 text-sm">
                      {post.author.name}
                    </p>
                    {post.author.role && (
                      <p className="text-xs text-neutral-500">
                        {post.author.role}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-neutral-500 flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-primary-400" />
                    {formattedDate}
                  </span>
                  {post.readingTime && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-primary-400" />
                      {post.readingTime} min de lecture
                    </span>
                  )}
                </div>

                {/* Share mobile */}
                <div className="ml-auto">
                  <ArticleShareButtons
                    title={post.title}
                    slug={`/blog/${post.slug}`}
                  />
                </div>
              </div>

              {/* Sous-titre */}
              {post.subtitle && (
                <p
                  className="text-xl text-neutral-600 italic leading-relaxed mb-8 font-medium
                               border-l-4 border-primary-200 pl-5"
                >
                  {post.subtitle}
                </p>
              )}

              {/* Contenu article */}
              <div
                className="prose-mrjc"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-10 pt-8 border-t border-neutral-100">
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag className="w-4 h-4 text-neutral-400" />
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-sm px-3 py-1 bg-neutral-50 border border-neutral-200
                                       text-neutral-600 rounded-full hover:bg-primary-50
                                       hover:border-primary-200 hover:text-primary-700
                                       transition-all duration-200 cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation retour */}
              <div className="mt-10 flex items-center justify-between pt-8 border-t border-neutral-100">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-sm font-semibold
                                 text-neutral-600 hover:text-primary-700 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Retour au blog
                </Link>
                <ArticleShareButtons
                  title={post.title}
                  slug={`/blog/${post.slug}`}
                  showLabel
                />
              </div>

              {/* Articles liés */}
              {related.length > 0 && <RelatedPosts posts={related} />}
            </article>

            {/* Sidebar sticky */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                {/* Table des matières */}
                <ArticleTOC content={post.content} />

                {/* Auteur bio */}
                {post.author.bio && (
                  <div className="bg-primary-50 rounded-2xl border border-primary-100 p-5">
                    <h3 className="font-bold text-sm text-primary-800 mb-3 flex items-center gap-2">
                      <User className="w-4 h-4" />À propos de l'auteur
                    </h3>
                    {post.author.photo && (
                      <Image
                        src={post.author.photo}
                        alt={post.author.name}
                        width={56}
                        height={56}
                        className="rounded-full object-cover mb-3 border-2 border-primary-200"
                      />
                    )}
                    <p className="font-semibold text-neutral-900 text-sm">
                      {post.author.name}
                    </p>
                    <p className="text-xs text-primary-600 mb-2">
                      {post.author.role}
                    </p>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {post.author.bio}
                    </p>
                  </div>
                )}

                {/* Projet lié */}
                {post.relatedProjectId && (
                  <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-5">
                    <h3 className="font-bold text-sm text-neutral-800 mb-3">
                      Projet associé
                    </h3>
                    <Link
                      href={`/projects/${post.relatedProjectId}`}
                      className="text-sm font-semibold text-primary-600 hover:text-primary-700
                                     transition-colors flex items-center gap-1.5"
                    >
                      Voir le projet
                      <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                    </Link>
                  </div>
                )}

                {/* CTA newsletter */}
                <div className="bg-primary-500 rounded-2xl p-5 text-white text-center">
                  <p className="font-bold text-sm mb-1">💌 Newsletter MRJC</p>
                  <p className="text-primary-200 text-xs leading-relaxed mb-3">
                    Recevez nos articles par email chaque mois.
                  </p>
                  <Link
                    href="/#newsletter"
                    className="block bg-secondary-500 text-white text-sm font-semibold
                                   py-2 rounded-xl hover:bg-secondary-400 transition-colors"
                  >
                    S'abonner
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
