import type { Metadata } from "next";
import Link from "next/link";
import {
  Download,
  Image as ImageIcon,
  FileText,
  Palette,
  Globe,
  ArrowLeft,
} from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { generatePageMetadata } from "@/lib/seo/generateMetadata";

export const metadata: Metadata = generatePageMetadata({
  title: "Kit Presse & Médias",
  description:
    "Téléchargez les ressources officielles MRJC-BÉNIN : logos, chartes graphiques, photos et textes institutionnels pour vos publications.",
  slug: "resources/media-kit",
  keywords: ["kit presse", "logo MRJC", "charte graphique", "médias", "presse"],
});

const MEDIA_ITEMS = [
  {
    category: "Logos & Identité",
    icon: Palette,
    color: "bg-purple-50 text-purple-600",
    items: [
      {
        name: "Logo MRJC-BÉNIN (PNG, fond transparent)",
        size: "2.4 MB",
        format: "PNG",
        file: "/assets/media-kit/logo-mrjc-benin-transparent.png",
      },
      {
        name: "Logo MRJC-BÉNIN (SVG vectoriel)",
        size: "124 KB",
        format: "SVG",
        file: "/assets/media-kit/logo-mrjc-benin.svg",
      },
      {
        name: "Logo horizontal (banner)",
        size: "1.1 MB",
        format: "PNG",
        file: "/assets/media-kit/logo-mrjc-benin-banner.png",
      },
      {
        name: "Charte graphique complète",
        size: "4.2 MB",
        format: "PDF",
        file: "/assets/media-kit/charte-graphique-mrjc-benin.pdf",
      },
    ],
  },
  {
    category: "Photos institutionnelles",
    icon: ImageIcon,
    color: "bg-blue-50 text-blue-600",
    items: [
      {
        name: "Pack photos terrain — Agriculture",
        size: "18 MB",
        format: "ZIP",
        file: "/assets/media-kit/photos-agriculture.zip",
      },
      {
        name: "Pack photos terrain — Éducation",
        size: "14 MB",
        format: "ZIP",
        file: "/assets/media-kit/photos-education.zip",
      },
      {
        name: "Pack photos terrain — Femmes",
        size: "16 MB",
        format: "ZIP",
        file: "/assets/media-kit/photos-femmes.zip",
      },
      {
        name: "Photos équipe & bureau (HD)",
        size: "8 MB",
        format: "ZIP",
        file: "/assets/media-kit/photos-equipe.zip",
      },
    ],
  },
  {
    category: "Documents presse",
    icon: FileText,
    color: "bg-orange-50 text-orange-600",
    items: [
      {
        name: "Dossier de presse 2024",
        size: "3.8 MB",
        format: "PDF",
        file: "/assets/media-kit/dossier-presse-2024.pdf",
      },
      {
        name: "Communiqué annuel 2023",
        size: "580 KB",
        format: "PDF",
        file: "/assets/media-kit/communique-2023.pdf",
      },
      {
        name: "Fiche de présentation institutionnelle",
        size: "1.2 MB",
        format: "PDF",
        file: "/assets/media-kit/fiche-presentation.pdf",
      },
      {
        name: "Biographies des dirigeants",
        size: "240 KB",
        format: "PDF",
        file: "/assets/media-kit/biographies.pdf",
      },
    ],
  },
  {
    category: "Contenu web",
    icon: Globe,
    color: "bg-green-50 text-green-600",
    items: [
      {
        name: "Images OG / réseaux sociaux",
        size: "2.1 MB",
        format: "ZIP",
        file: "/assets/media-kit/og-images.zip",
      },
      {
        name: "Bannières web (formats standards)",
        size: "1.4 MB",
        format: "ZIP",
        file: "/assets/media-kit/bannieres-web.zip",
      },
      {
        name: "Avatars profil réseaux sociaux",
        size: "840 KB",
        format: "ZIP",
        file: "/assets/media-kit/avatars-sociaux.zip",
      },
    ],
  },
];

const USAGE_RULES = [
  "Le logo MRJC-BÉNIN ne doit pas être altéré, déformé ou recolorisé.",
  'Toute publication utilisant nos ressources doit mentionner "© MRJC-BÉNIN".',
  "Les photos de terrain montrant des bénéficiaires nécessitent une autorisation préalable.",
  "L'utilisation commerciale des ressources est strictement interdite sans accord écrit.",
  "Le kit presse est réservé aux journalistes, partenaires et organisations enregistrées.",
];

export default function MediaKitPage() {
  return (
    <>
      <PageHeader
        tag="Ressources Médias"
        title="Kit Presse & Médias"
        subtitle="Ressources officielles MRJC-BÉNIN pour les journalistes, partenaires et médias souhaitant couvrir nos activités."
        breadcrumbs={[
          { label: "Ressources", href: "/resources" },
          { label: "Kit Presse" },
        ]}
      />

      <section className="section-mrjc bg-white">
        <div className="container-mrjc">
          {/* Avertissement usage */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-10 flex gap-4">
            <div className="text-2xl shrink-0">⚠️</div>
            <div>
              <p className="font-semibold text-amber-900 mb-2">
                Conditions d'utilisation du kit presse
              </p>
              <ul className="space-y-1">
                {USAGE_RULES.map((r, i) => (
                  <li key={i} className="text-sm text-amber-800 flex gap-2">
                    <span className="text-amber-500 mt-0.5">•</span> {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Grille de ressources */}
          <div className="space-y-10">
            {MEDIA_ITEMS.map(({ category, icon: Icon, color, items }) => (
              <div key={category}>
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}
                  >
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {category}
                  </h2>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {items.map((item) => (
                    <div
                      key={item.name}
                      className="bg-gray-50 border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-all group"
                    >
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <p className="text-sm font-medium text-gray-800 leading-snug">
                          {item.name}
                        </p>
                        <span className="shrink-0 text-xs bg-white border border-gray-200 px-2 py-0.5 rounded-full text-gray-500 font-mono">
                          {item.format}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">
                          {item.size}
                        </span>
                        <a
                          href={item.file}
                          download
                          className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-800 font-medium transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Télécharger
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Contact presse */}
          <div className="mt-12 bg-primary-900 rounded-3xl p-8 text-white text-center">
            <h3 className="font-display text-2xl font-bold mb-3">
              Contact presse
            </h3>
            <p className="text-primary-200 mb-6 max-w-lg mx-auto">
              Vous préparez un article, un reportage ou une émission sur
              MRJC-BÉNIN ? Notre équipe communication est à votre disposition.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:presse@mrjc-benin.org" className="btn-secondary">
                presse@mrjc-benin.org
              </a>
              <Link
                href="/contact"
                className="btn-outline-white inline-flex items-center gap-2"
              >
                Formulaire de contact
              </Link>
            </div>
          </div>

          <div className="mt-6 flex justify-start">
            <Link
              href="/resources"
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Retour aux ressources
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
