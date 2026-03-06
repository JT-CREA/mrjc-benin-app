import Link from "next/link";
import { Leaf, ArrowLeft, Home, Search, Phone } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page introuvable — MRJC-BÉNIN",
  description: "La page que vous cherchez est introuvable.",
  robots: { index: false, follow: false },
};

const quickLinks = [
  { label: "Accueil", href: "/", icon: Home },
  { label: "Nos Projets", href: "/projects", icon: Leaf },
  { label: "Actualités", href: "/news", icon: Search },
  { label: "Nous contacter", href: "/contact", icon: Phone },
];

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <div className="text-center max-w-xl mx-auto">
        {/* Illustration */}
        <div className="relative mb-8 mx-auto w-40 h-40">
          <div className="w-40 h-40 bg-primary-50 rounded-full flex items-center justify-center mx-auto">
            <div className="text-7xl font-display font-black text-primary-100 select-none leading-none">
              404
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Leaf className="w-16 h-16 text-primary-300" />
          </div>
        </div>

        {/* Texte */}
        <h1 className="font-display text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
          Page introuvable
        </h1>
        <p className="text-neutral-500 text-lg mb-2">
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <p className="text-neutral-400 text-sm mb-10">
          Vérifiez l'URL ou explorez notre site via les liens ci-dessous.
        </p>

        {/* Liens rapides */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {quickLinks.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-neutral-200
                         hover:border-primary-300 hover:bg-primary-50 transition-all group text-left"
            >
              <div
                className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center
                              group-hover:bg-primary-100 transition-colors flex-shrink-0"
              >
                <Icon className="w-4 h-4 text-primary-600" />
              </div>
              <span className="text-sm font-semibold text-neutral-700 group-hover:text-primary-700">
                {label}
              </span>
            </Link>
          ))}
        </div>

        {/* Retour */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary-600 font-semibold
                     hover:text-primary-700 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
