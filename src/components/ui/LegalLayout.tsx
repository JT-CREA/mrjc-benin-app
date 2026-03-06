/**
 * Composant — LegalLayout
 * Mise en page commune pour toutes les pages légales :
 * Mentions légales, Politique confidentialité, Cookies, CGU
 */

import { Clock, Calendar, ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";

interface LegalLayoutProps {
  children: React.ReactNode;
  lastUpdated: string;
  readTime?: string;
}

const LEGAL_LINKS = [
  { href: "/legal-mentions", label: "Mentions Légales" },
  { href: "/privacy-policy", label: "Politique de Confidentialité" },
  { href: "/cookie-policy", label: "Politique des Cookies" },
  { href: "/terms-of-use", label: "Conditions d'Utilisation" },
];

export default function LegalLayout({
  children,
  lastUpdated,
  readTime = "5 min",
}: LegalLayoutProps) {
  return (
    <section className="section-mrjc bg-gray-50">
      <div className="container-mrjc">
        <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto">
          {/* Sidebar navigation légale */}
          <aside className="lg:w-56 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 lg:sticky lg:top-24">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Pages légales
              </h3>
              <nav className="space-y-1">
                {LEGAL_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link
                  href="/contact"
                  className="flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-800 transition-colors font-medium"
                >
                  Questions ? Contactez-nous →
                </Link>
              </div>
            </div>
          </aside>

          {/* Contenu principal */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Méta */}
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex flex-wrap items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Dernière mise à jour :{" "}
                  <strong className="text-gray-700">{lastUpdated}</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Temps de lecture :{" "}
                  <strong className="text-gray-700">{readTime}</strong>
                </span>
              </div>

              {/* Contenu */}
              <article
                className="p-6 md:p-8 prose prose-sm max-w-none
                prose-headings:font-display prose-headings:text-gray-900
                prose-h2:text-lg prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-3 prose-h2:text-primary-800
                prose-h3:text-base prose-h3:font-semibold prose-h3:mt-5 prose-h3:mb-2
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-3
                prose-ul:list-disc prose-ul:pl-5 prose-ul:text-gray-700 prose-ul:space-y-1
                prose-li:text-gray-700
                prose-a:text-primary-600 prose-a:underline hover:prose-a:text-primary-800
                prose-strong:text-gray-900 prose-strong:font-semibold
                [&_section]:border-b [&_section]:border-gray-50 [&_section]:pb-6 [&_section]:mb-6
                [&_section:last-child]:border-0 [&_section:last-child]:pb-0 [&_section:last-child]:mb-0
              "
              >
                {children}
              </article>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Retour à l'accueil
              </Link>
              <p className="text-xs text-gray-400">
                © {new Date().getFullYear()} MRJC-BÉNIN
              </p>
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}
