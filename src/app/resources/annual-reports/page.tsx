import type { Metadata } from "next";
import Link from "next/link";
import {
  BarChart3,
  Download,
  Calendar,
  FileText,
  ArrowRight,
  TrendingUp,
  Users,
  Target,
  Award,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { siteConfig } from "@/config/site.config";
import DownloadButton from "@/components/ui/DownloadButton";

/* ── Métadonnées ── */
export const metadata: Metadata = {
  title: `Rapports Annuels | ${siteConfig.seo.defaultTitle}`,
  description:
    "Téléchargez les rapports annuels de MRJC-BÉNIN : bilans d'activités, résultats, états financiers et perspectives — depuis 2018.",
  keywords: [
    "rapport annuel MRJC Bénin",
    "bilan activités ONG Bénin",
    "résultats développement rural",
    "rapport financier ONG",
  ],
  openGraph: {
    title: "Rapports Annuels — MRJC-BÉNIN",
    description:
      "Bilans annuels complets de MRJC-BÉNIN téléchargeables gratuitement.",
    url: `${siteConfig.url}/resources/annual-reports`,
  },
};

/* ── Données ── */
const ANNUAL_REPORTS = [
  {
    id: "ar2023",
    year: 2023,
    title: "Rapport Annuel 2023",
    subtitle:
      "Vers une résilience durable — Bilan des actions et impact mesuré",
    cover: "/assets/images/rapport-2023.jpg",
    url: "/assets/docs/rapport-2023.pdf",
    fileSize: "3.2 Mo",
    pages: 84,
    downloads: 847,
    featured: true,
    highlights: [
      { icon: Users, label: "Bénéficiaires directs", value: "18 420" },
      { icon: Target, label: "Projets actifs", value: "12" },
      { icon: TrendingUp, label: "Budget exécuté", value: "98.4%" },
      { icon: Award, label: "Satisfaction bénéf.", value: "94%" },
    ],
    summary:
      "Une année marquée par le renforcement des chaînes de valeur agricoles, l'expansion du programme de santé maternelle dans le Borgou, et la certification de 48 nouveaux centres d'alphabétisation.",
    themes: ["Agriculture", "Santé", "Alphabétisation", "Genre", "Gouvernance"],
  },
  {
    id: "ar2022",
    year: 2022,
    title: "Rapport Annuel 2022",
    subtitle: "Consolidation et croissance — Résultats et leçons apprises",
    cover: "/assets/images/rapport-2022.jpg",
    url: "/assets/docs/rapport-2022.pdf",
    fileSize: "2.9 Mo",
    pages: 76,
    downloads: 612,
    featured: true,
    highlights: [
      { icon: Users, label: "Bénéficiaires directs", value: "15 800" },
      { icon: Target, label: "Projets actifs", value: "10" },
      { icon: TrendingUp, label: "Budget exécuté", value: "96.1%" },
      { icon: Award, label: "Satisfaction bénéf.", value: "91%" },
    ],
    summary:
      "Expansion géographique vers l'Atacora et la Donga, lancement du programme PROCASE II avec l'appui de l'Union Européenne, et formation de 2 400 agriculteurs aux bonnes pratiques agricoles.",
    themes: ["Agriculture", "Santé", "Alphabétisation", "Femmes"],
  },
  {
    id: "ar2021",
    year: 2021,
    title: "Rapport Annuel 2021",
    subtitle:
      "Résilience en temps de crise — Maintien des activités post-COVID",
    cover: "/assets/images/rapport-2021.jpg",
    url: "/assets/docs/rapport-2021.pdf",
    fileSize: "2.6 Mo",
    pages: 72,
    downloads: 489,
    featured: false,
    highlights: [
      { icon: Users, label: "Bénéficiaires directs", value: "12 340" },
      { icon: Target, label: "Projets actifs", value: "9" },
      { icon: TrendingUp, label: "Budget exécuté", value: "87.3%" },
      { icon: Award, label: "Partenaires mobilisés", value: "28" },
    ],
    summary:
      "Adaptation des activités face aux contraintes COVID-19, maintien des programmes de nutrition, développement de nouvelles modalités de formation à distance pour les alphabétiseurs.",
    themes: ["COVID", "Agriculture", "Nutrition", "Formation"],
  },
  {
    id: "ar2020",
    year: 2020,
    title: "Rapport Annuel 2020",
    subtitle: "Défis et adaptations — Une année exceptionnelle",
    cover: "/assets/images/rapport-2020.jpg",
    url: "/assets/docs/rapport-2020.pdf",
    fileSize: "2.4 Mo",
    pages: 68,
    downloads: 378,
    featured: false,
    highlights: [
      { icon: Users, label: "Bénéficiaires directs", value: "10 250" },
      { icon: Target, label: "Projets actifs", value: "8" },
      { icon: TrendingUp, label: "Taux réalisation", value: "79%" },
      { icon: Award, label: "Nouveaux projets", value: "3" },
    ],
    summary:
      "Malgré la pandémie, MRJC-BÉNIN a maintenu ses activités essentielles de nutrition et de santé, tout en adaptant ses méthodes d'intervention.",
    themes: ["Santé", "Nutrition", "Résilience"],
  },
  {
    id: "ar2019",
    year: 2019,
    title: "Rapport Annuel 2019",
    subtitle: "Extension et partenariats — Développement du réseau",
    cover: "/assets/images/rapport-2019.jpg",
    url: "/assets/docs/rapport-2019.pdf",
    fileSize: "2.7 Mo",
    pages: 74,
    downloads: 312,
    featured: false,
    highlights: [
      { icon: Users, label: "Bénéficiaires directs", value: "14 600" },
      { icon: Target, label: "Projets réalisés", value: "11" },
      { icon: TrendingUp, label: "Budget exécuté", value: "98.7%" },
      { icon: Award, label: "Nouveaux partenaires", value: "6" },
    ],
    summary:
      "Année record en termes de partenariats : signature de conventions avec l'UNICEF, l'AFD et le PNUD. Lancement du programme d'alphabétisation trilingue dans le Septentrion.",
    themes: ["Partenariats", "Alphabétisation", "Agriculture", "Genre"],
  },
  {
    id: "ar2018",
    year: 2018,
    title: "Rapport Annuel 2018",
    subtitle: "Assises solides — Consolidation des fondamentaux",
    cover: "/assets/images/rapport-2018.jpg",
    url: "/assets/docs/rapport-2018.pdf",
    fileSize: "2.2 Mo",
    pages: 64,
    downloads: 234,
    featured: false,
    highlights: [
      { icon: Users, label: "Bénéficiaires directs", value: "11 800" },
      { icon: Target, label: "Projets réalisés", value: "9" },
      { icon: TrendingUp, label: "Budget exécuté", value: "95.2%" },
      { icon: Award, label: "Villages couverts", value: "180+" },
    ],
    summary:
      "Révision stratégique quinquennale, renforcement du dispositif de S&E, et mise en place d'un système de gestion de l'information pour le suivi des bénéficiaires.",
    themes: ["Stratégie", "S&E", "Gestion", "Agriculture"],
  },
];

/* ── Rapport Featured ── */
function FeaturedReport({ report }: { report: (typeof ANNUAL_REPORTS)[0] }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Couverture */}
        <div className="relative bg-gradient-to-br from-primary-800 to-primary-950 p-10 flex flex-col justify-between min-h-[320px]">
          <div className="absolute inset-0 opacity-10 flex items-center justify-center">
            <BarChart3 className="w-64 h-64 text-white" />
          </div>
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-full mb-4">
              <Calendar className="w-3.5 h-3.5" />
              Dernier rapport disponible
            </span>
            <h2 className="text-3xl font-display font-bold text-white mb-2">
              {report.title}
            </h2>
            <p className="text-primary-200 text-base">{report.subtitle}</p>
          </div>
          <div className="relative z-10 flex items-center gap-4 mt-6">
            <div className="text-white/70 text-sm flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              {report.pages} pages • {report.fileSize}
            </div>
            <div className="text-white/70 text-sm flex items-center gap-1.5">
              <Download className="w-4 h-4" />
              {report.downloads.toLocaleString()} télécharg.
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-8">
          {/* KPIs */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {report.highlights.map((h, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-xl p-3 flex items-center gap-3"
              >
                <div className="w-9 h-9 bg-primary-100 rounded-lg flex items-center justify-center shrink-0">
                  <h.icon className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{h.value}</p>
                  <p className="text-xs text-gray-500 leading-tight">
                    {h.label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-sm text-gray-600 mb-5 leading-relaxed">
            {report.summary}
          </p>

          {/* Thèmes */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {report.themes.map((t) => (
              <span
                key={t}
                className="text-xs bg-primary-50 text-primary-700 border border-primary-100 px-2.5 py-1 rounded-full"
              >
                {t}
              </span>
            ))}
          </div>

          <DownloadButton
            {...({
              url: report.url,
              filename: `MRJC-BENIN-rapport-annuel-${report.year}.pdf`,
              resourceId: report.id,
              label: `Télécharger le rapport ${report.year}`,
              size: report.fileSize || "Unknown",
              className: "",
            } as any)}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Rapport Card ── */
function ReportCard({ report }: { report: (typeof ANNUAL_REPORTS)[0] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 relative overflow-hidden">
        <div className="absolute right-4 top-4 opacity-10">
          <BarChart3 className="w-20 h-20 text-white" />
        </div>
        <div className="relative z-10">
          <span className="text-gray-400 text-sm">{report.year}</span>
          <h3 className="text-white font-bold text-lg mt-1">{report.title}</h3>
          <p className="text-gray-400 text-xs mt-1 line-clamp-2">
            {report.subtitle}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="grid grid-cols-2 gap-2 mb-4">
          {report.highlights.slice(0, 2).map((h, i) => (
            <div key={i} className="text-center bg-gray-50 rounded-lg p-2.5">
              <p className="font-bold text-gray-900 text-sm">{h.value}</p>
              <p className="text-2xs text-gray-500 leading-tight mt-0.5">
                {h.label}
              </p>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-600 mb-4 line-clamp-2">
          {report.summary}
        </p>

        <div className="flex flex-wrap gap-1 mb-4">
          {report.themes.slice(0, 3).map((t) => (
            <span
              key={t}
              className="text-2xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Download className="w-3 h-3" />
            {report.downloads.toLocaleString()} télécharg.
          </span>
          <DownloadButton
            {...({
              url: report.url,
              filename: `MRJC-BENIN-rapport-${report.year}.pdf`,
              resourceId: report.id,
              label: "PDF",
              size: report.fileSize || "Unknown",
            } as any)}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Page ── */
export default function AnnualReportsPage() {
  const [featuredReport, ...otherReports] = ANNUAL_REPORTS;
  const totalDownloads = ANNUAL_REPORTS.reduce((s, r) => s + r.downloads, 0);
  const totalPages = ANNUAL_REPORTS.reduce((s, r) => s + r.pages, 0);

  return (
    <>
      <PageHeader
        title="Rapports Annuels"
        subtitle="Transparence totale — Retrouvez ici tous nos bilans annuels, résultats et états financiers depuis 2018"
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Ressources", href: "/resources" },
          { label: "Rapports Annuels" },
        ]}
        stats={[
          { label: "Rapports disponibles", value: `${ANNUAL_REPORTS.length}` },
          {
            label: "Téléchargements total",
            value: `${totalDownloads.toLocaleString()}+`,
          },
          { label: "Pages documentées", value: `${totalPages}+` },
          { label: "Accès libre", value: "100%" },
        ]}
      />

      <div className="container-mrjc py-16 space-y-12">
        {/* Rapport en vedette */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="section-tag">📊 Dernière édition</div>
          </div>
          <FeaturedReport report={featuredReport} />
        </section>

        {/* Rapports antérieurs */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="section-tag">📁 Archives</div>
              <h2 className="text-2xl font-display font-bold text-gray-900 mt-2">
                Rapports précédents
              </h2>
              <p className="text-gray-600 mt-1">
                Toute l'histoire de MRJC-BÉNIN en chiffres, depuis 2018
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {otherReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        </section>

        {/* Note transparence */}
        <section className="bg-blue-50 border border-blue-100 rounded-3xl p-8 md:p-10">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center shrink-0">
              <Award className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Notre engagement pour la transparence
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                MRJC-BÉNIN publie l'intégralité de ses rapports annuels en libre
                accès. Ces documents comprennent le bilan des activités, les
                résultats mesurés, les états financiers audités, les leçons
                apprises et les perspectives pour l'exercice suivant. Nous
                croyons que la transparence est un pilier fondamental de la
                confiance avec nos partenaires et bénéficiaires.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/about/organization"
                  className="inline-flex items-center gap-1.5 text-sm text-blue-700 font-medium hover:underline"
                >
                  Notre gouvernance <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 text-sm text-blue-700 font-medium hover:underline"
                >
                  Demander une information{" "}
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Partenariat */}
        <section className="bg-primary-900 rounded-3xl p-8 md:p-12 text-center text-white">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl font-display font-bold mb-3">
              Vous souhaitez en savoir plus ?
            </h2>
            <p className="text-primary-200 mb-6">
              Pour obtenir des informations supplémentaires sur nos activités,
              nos résultats ou pour discuter d'une éventuelle collaboration,
              notre équipe est disponible.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white text-primary-800 font-semibold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors"
              >
                Nous contacter <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/work-with-us/collaboration"
                className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors"
              >
                Devenir partenaire
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
