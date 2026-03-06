import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  Clock,
  User,
  Tag,
  ArrowLeft,
  Share2,
  ArrowRight,
} from "lucide-react";
import allPosts from "@/data/blog-posts.json";
import type { BlogPost } from "@/types/blog.types";
import { siteConfig } from "@/config/site.config";

export async function generateStaticParams() {
  return (allPosts as BlogPost[]).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = (allPosts as BlogPost[]).find((p) => p.slug === slug);
  if (!post) return { title: "Article introuvable" };
  return {
    title: post.metaTitle || `${post.title} — MRJC-BÉNIN`,
    description: post.metaDescription || post.excerpt,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.coverImage }],
      publishedTime: post.publishedAt,
    },
  };
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

const categoryLabels: Record<string, string> = {
  agriculture: "Agriculture",
  sante: "Santé",
  education: "Éducation",
  femmes: "Femmes",
  evenement: "Événement",
  partenariat: "Partenariat",
  "success-story": "Success Story",
  analyse: "Analyse",
  gouvernance: "Gouvernance",
};

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = (allPosts as BlogPost[]).find((p) => p.slug === slug);
  if (!post) notFound();

  const related = (allPosts as BlogPost[])
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative bg-primary-950 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            quality={80}
            className="object-cover opacity-20"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-950/80 to-primary-950/95" />
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary-500" />
        </div>

        <div className="relative z-10 container-narrow py-16 lg:py-24">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-sm text-primary-300
                                        hover:text-white mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Retour aux actualités
          </Link>

          <div className="flex items-center gap-3 mb-5">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-secondary-500 text-white">
              {categoryLabels[post.category] || post.category}
            </span>
            {post.urgent && (
              <span className="text-xs font-bold text-red-400">🔴 Urgent</span>
            )}
          </div>

          <h1
            className="font-display text-3xl lg:text-4xl xl:text-5xl font-bold text-white
                         leading-tight mb-4"
          >
            {post.title}
          </h1>
          {post.subtitle && (
            <p className="text-lg text-primary-200 mb-6">{post.subtitle}</p>
          )}

          <div className="flex flex-wrap items-center gap-5 text-sm text-primary-300">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" /> {post.author.name}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> {formatDate(post.publishedAt)}
            </span>
            {post.readingTime && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> {post.readingTime} min de lecture
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Corps */}
      <div className="bg-white py-12 lg:py-16">
        <div className="container-narrow">
          <div className="grid lg:grid-cols-4 gap-10">
            {/* Article */}
            <article className="lg:col-span-3">
              {/* Excerpt */}
              <p
                className="text-lg text-neutral-600 leading-relaxed mb-8 font-medium
                             border-l-4 border-secondary-500 pl-5 italic"
              >
                {post.excerpt}
              </p>

              {/* Contenu HTML */}
              <div
                className="prose-mrjc"
                dangerouslySetInnerHTML={{
                  __html: post.content || "<p>Contenu à venir.</p>",
                }}
              />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-10 pt-6 border-t border-neutral-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag className="w-4 h-4 text-neutral-400" />
                    {post.tags.map((t) => (
                      <Link
                        key={t}
                        href={`/search?q=${encodeURIComponent(t)}`}
                        className="text-xs bg-neutral-100 text-neutral-700 px-2.5 py-1.5
                                       rounded-full font-medium hover:bg-primary-50
                                       hover:text-primary-700 transition-colors"
                      >
                        #{t}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Auteur */}
              <div
                className="mt-10 bg-neutral-50 rounded-2xl p-6 border border-neutral-100
                              flex items-start gap-5"
              >
                {post.author.photo && (
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0">
                    <Image
                      src={post.author.photo}
                      alt={post.author.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                )}
                <div>
                  <p className="font-bold text-neutral-900">
                    {post.author.name}
                  </p>
                  <p className="text-sm text-neutral-500 mb-2">
                    {post.author.role}
                  </p>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    Membre de l'équipe MRJC-BÉNIN, expert dans son domaine
                    d'intervention.
                  </p>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-5">
              {/* Partager */}
              <div className="bg-white border border-neutral-100 rounded-2xl p-5">
                <h3 className="font-bold text-sm text-neutral-800 mb-3 flex items-center gap-2">
                  <Share2 className="w-4 h-4" /> Partager
                </h3>
                <div className="space-y-2">
                  {[
                    {
                      label: "Facebook",
                      color: "bg-[#1877F2] hover:bg-[#166FE5]",
                      href: `https://facebook.com/sharer?u=${encodeURIComponent(siteConfig.url + "/news/" + post.slug)}`,
                    },
                    {
                      label: "Twitter",
                      color: "bg-[#1DA1F2] hover:bg-[#1a94da]",
                      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(siteConfig.url + "/news/" + post.slug)}`,
                    },
                    {
                      label: "WhatsApp",
                      color: "bg-[#25D366] hover:bg-[#20bd5a]",
                      href: `https://wa.me/?text=${encodeURIComponent(post.title + " " + siteConfig.url + "/news/" + post.slug)}`,
                    },
                  ].map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full block text-center text-xs font-semibold text-white
                                   py-2.5 rounded-xl transition-colors ${s.color}`}
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="bg-primary-500 rounded-2xl p-5 text-white">
                <h3 className="font-display font-bold text-base mb-2">
                  Ne rien rater
                </h3>
                <p className="text-sm text-primary-100 mb-4">
                  Abonnez-vous à notre newsletter mensuelle.
                </p>
                <Link
                  href="/#newsletter"
                  className="block w-full text-center bg-white text-primary-700 py-2.5
                                 rounded-xl font-bold text-sm hover:bg-primary-50 transition-colors"
                >
                  S'abonner
                </Link>
              </div>

              {/* Liens internes */}
              <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-5">
                <h3 className="font-bold text-sm text-neutral-800 mb-3">
                  Aller plus loin
                </h3>
                <div className="space-y-2">
                  {[
                    { label: "Nos projets", href: "/projects" },
                    { label: "Notre impact", href: "/domains" },
                    { label: "Nous rejoindre", href: "/work-with-us" },
                  ].map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="flex items-center justify-between text-sm text-neutral-700
                                     hover:text-primary-600 group"
                    >
                      {l.label}
                      <ArrowRight
                        className="w-3.5 h-3.5 text-neutral-300 group-hover:text-primary-500
                                             group-hover:translate-x-0.5 transition-all"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>

          {/* Articles connexes */}
          {related.length > 0 && (
            <div className="mt-16 pt-12 border-t border-neutral-100">
              <h2 className="font-display font-bold text-2xl text-neutral-900 mb-8">
                Articles connexes
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {related.map((p) => (
                  <Link
                    key={p.id}
                    href={`/${p.type === "news" ? "news" : "blog"}/${p.slug}`}
                    className="group bg-white rounded-2xl border border-neutral-100 overflow-hidden
                                   hover:border-primary-200 hover:shadow-md transition-all"
                  >
                    <div className="relative h-36 bg-neutral-100">
                      <Image
                        src={p.coverImage}
                        alt={p.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="33vw"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-neutral-400 mb-1">
                        {formatDate(p.publishedAt)}
                      </p>
                      <h3
                        className="font-bold text-sm text-neutral-900 line-clamp-2
                                     group-hover:text-primary-700 transition-colors"
                      >
                        {p.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
