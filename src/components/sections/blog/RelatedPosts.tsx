import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import type { BlogPost } from "@/types/blog.types";

export default function RelatedPosts({ posts }: { posts: BlogPost[] }) {
  if (!posts.length) return null;

  return (
    <section
      className="mt-14 pt-10 border-t border-neutral-100"
      aria-labelledby="related-heading"
    >
      <h2
        id="related-heading"
        className="font-display font-bold text-2xl text-neutral-900 mb-8"
      >
        Articles connexes
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts.map((post) => {
          const href = `/${post.type === "news" ? "news" : "blog"}/${post.slug}`;
          return (
            <Link
              key={post.id}
              href={href}
              className="group bg-neutral-50 rounded-2xl overflow-hidden border border-neutral-100
                         hover:border-primary-200 hover:shadow-md transition-all duration-300"
            >
              <div className="relative h-40 bg-neutral-200 overflow-hidden">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-4">
                <p className="text-xs text-neutral-400 flex items-center gap-1 mb-2">
                  <Calendar className="w-3 h-3" />
                  {new Intl.DateTimeFormat("fr-FR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }).format(new Date(post.publishedAt))}
                </p>
                <h3
                  className="font-semibold text-sm text-neutral-800 leading-snug
                               group-hover:text-primary-700 transition-colors line-clamp-2 mb-2"
                >
                  {post.title}
                </h3>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-primary-600">
                  Lire{" "}
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
