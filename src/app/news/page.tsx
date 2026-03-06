import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, User, ArrowRight, Zap } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import allPosts from '@/data/blog-posts.json';
import type { BlogPost } from '@/types/blog.types';

export const metadata: Metadata = {
  title: 'Actualités & Publications',
  description: 'Toute l\'actualité de MRJC-BÉNIN : nouvelles des projets, événements, offres d\'emploi et publications de l\'ONG.',
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso));
}

const categoryStyles: Record<string, string> = {
  agriculture: 'bg-primary-50 text-primary-700',
  sante:       'bg-accent-50 text-accent-700',
  education:   'bg-secondary-50 text-secondary-700',
  femmes:      'bg-purple-50 text-purple-700',
  evenement:   'bg-orange-50 text-orange-700',
  partenariat: 'bg-blue-50 text-blue-700',
};

const categoryLabels: Record<string, string> = {
  agriculture: 'Agriculture', sante: 'Santé', education: 'Éducation',
  femmes: 'Femmes', evenement: 'Événement', partenariat: 'Partenariat',
  'success-story': 'Success Story', analyse: 'Analyse', gouvernance: 'Gouvernance',
};

function PostCard({ post }: { post: BlogPost }) {
  const href = `/${post.type === 'news' ? 'news' : 'blog'}/${post.slug}`;
  return (
    <article className="group bg-white rounded-2xl border border-neutral-100 overflow-hidden
                        hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* Image */}
      <div className="relative h-48 overflow-hidden flex-shrink-0 bg-neutral-100">
        <Image src={post.coverImage} alt={post.title} fill
               className="object-cover transition-transform duration-500 group-hover:scale-105"
               sizes="(max-width: 768px) 100vw, 33vw" />
        <div className="absolute top-3 left-3 flex gap-2">
          {post.urgent && (
            <span className="inline-flex items-center gap-1 text-xs font-bold bg-red-500
                             text-white px-2.5 py-1 rounded-full">
              <Zap className="w-3 h-3" /> Urgent
            </span>
          )}
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/90
                           text-neutral-700 backdrop-blur-sm">
            {post.type === 'news' ? '📰 Actualité' : '✍️ Blog'}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        {/* Catégorie */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full
                           ${categoryStyles[post.category] || 'bg-neutral-100 text-neutral-600'}`}>
            {categoryLabels[post.category] || post.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-neutral-400">
            <Calendar className="w-3 h-3" />
            {formatDate(post.publishedAt)}
          </span>
        </div>

        <h2 className="font-display font-bold text-lg text-neutral-900 leading-snug mb-2
                       group-hover:text-primary-700 transition-colors line-clamp-2">
          {post.title}
        </h2>
        <p className="text-sm text-neutral-500 leading-relaxed line-clamp-3 mb-4 flex-1">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <User className="w-3 h-3" />
            <span className="truncate max-w-[100px]">{post.author.name}</span>
            {post.readingTime && (
              <><span className="text-neutral-300">•</span>
              <Clock className="w-3 h-3" />
              <span>{post.readingTime} min</span></>
            )}
          </div>
          <Link href={href}
                className="inline-flex items-center gap-1 text-xs font-bold text-primary-600
                           hover:text-primary-700 group/link">
            Lire <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function NewsPage() {
  const posts = allPosts as BlogPost[];
  const featured = posts.find(p => p.featured) || posts[0];
  const rest = posts.filter(p => p.id !== featured.id);

  return (
    <>
      <PageHeader
        tag="Publications & Actualités"
        title="Nos Actualités"
        subtitle="Nouvelles des projets, événements, offres de collaboration et publications de MRJC-BÉNIN."
        breadcrumbs={[{ label: 'Actualités' }]}
        image="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1920"
        size="sm"
      />

      <div className="py-16 lg:py-24 bg-neutral-50">
        <div className="container-mrjc">

          {/* Post en vedette */}
          {featured && (
            <Link
              href={`/${featured.type === 'news' ? 'news' : 'blog'}/${featured.slug}`}
              className="group flex flex-col md:flex-row bg-white rounded-3xl border
                         border-neutral-100 overflow-hidden mb-12 shadow-sm hover:shadow-xl
                         transition-all duration-300"
            >
              <div className="relative md:w-1/2 h-56 md:h-auto bg-neutral-100 flex-shrink-0">
                <Image src={featured.coverImage} alt={featured.title} fill
                       className="object-cover group-hover:scale-105 transition-transform duration-500"
                       sizes="50vw" />
                <div className="absolute top-3 left-3">
                  <span className="text-xs font-bold bg-secondary-500 text-white
                                   px-2.5 py-1 rounded-full">⭐ À la une</span>
                </div>
              </div>
              <div className="flex flex-col justify-center p-8 md:p-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full
                                   ${categoryStyles[featured.category] || 'bg-neutral-100 text-neutral-600'}`}>
                    {categoryLabels[featured.category] || featured.category}
                  </span>
                  <span className="text-xs text-neutral-400">{formatDate(featured.publishedAt)}</span>
                </div>
                <h2 className="font-display font-bold text-2xl lg:text-3xl text-neutral-900
                               group-hover:text-primary-700 transition-colors leading-tight mb-3">
                  {featured.title}
                </h2>
                <p className="text-neutral-500 leading-relaxed mb-5 line-clamp-3">{featured.excerpt}</p>
                <div className="inline-flex items-center gap-2 text-sm font-bold text-primary-600">
                  Lire l'article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          )}

          {/* Grille posts */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post) => (
              <PostCard key={post.id} post={post as BlogPost} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
