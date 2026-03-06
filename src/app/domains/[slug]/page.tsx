import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CheckCircle,
  Users,
  Target,
  Activity,
  ChevronRight,
  FolderKanban,
  TrendingUp,
  MapPin,
} from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import allDomains from "@/data/domains.json";
import allProjects from "@/data/projects.json";
import type { Domain } from "@/types/domain.types";
import type { Project } from "@/types/project.types";
import { siteConfig } from "@/config/site.config";

/* ─────────────────────────────────────────────────────────────────────────────
   generateStaticParams — génère les routes au build
──────────────────────────────────────────────────────────────────────────────*/
export async function generateStaticParams() {
  return (allDomains as Domain[]).map((d) => ({ slug: d.slug }));
}

/* ─────────────────────────────────────────────────────────────────────────────
   generateMetadata
──────────────────────────────────────────────────────────────────────────────*/
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const domain = (allDomains as Domain[]).find((d) => d.slug === slug);
  if (!domain) return { title: "Domaine introuvable" };

  return {
    title: `${domain.label} — Domaines MRJC-BÉNIN`,
    description: domain.description,
    keywords: [domain.label, "MRJC-BÉNIN", "ONG Bénin", "développement rural"],
    openGraph: {
      type: "article",
      url: `${siteConfig.url}/domains/${domain.slug}`,
      title: `${domain.label} | MRJC-BÉNIN`,
      description: domain.description,
      images: [
        { url: domain.image, width: 1920, height: 1080, alt: domain.label },
      ],
    },
    alternates: { canonical: `${siteConfig.url}/domains/${domain.slug}` },
  };
}

/* ─────────────────────────────────────────────────────────────────────────────
   Helpers
──────────────────────────────────────────────────────────────────────────────*/
function formatBudget(amount?: number): string {
  if (!amount) return "";
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M FCFA`;
  return `${Math.round(amount / 1000)}k FCFA`;
}

const statusLabel: Record<string, string> = {
  ongoing: "En cours",
  completed: "Clôturé",
  planned: "Planifié",
};
const statusColor: Record<string, string> = {
  ongoing: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  completed: "bg-neutral-100 text-neutral-600 border border-neutral-200",
  planned: "bg-sky-50 text-sky-700 border border-sky-200",
};

/** Convertit un hex #RRGGBB en "R, G, B" pour rgba() */
function hexToRgb(hex: string): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Page (Server Component)
──────────────────────────────────────────────────────────────────────────────*/
export default async function DomainDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  /* 1. Résolution du slug */
  const { slug } = await params;
  const domain = (allDomains as Domain[]).find((d) => d.slug === slug);
  if (!domain) notFound();

  /* 2. Couleur principale (fallback #1B6B3A si absent) */
  const primaryHex = domain.color?.primary ?? "#1B6B3A";
  const rgb = hexToRgb(primaryHex);

  /* Styles inline dérivés — AUCUNE classe Tailwind dynamique depuis JSON */
  const styles = {
    iconBg: { backgroundColor: primaryHex },
    iconBgLight: { backgroundColor: `rgba(${rgb}, 0.10)` },
    textColor: { color: primaryHex },
    stepNumber: { backgroundColor: `rgba(${rgb}, 0.12)`, color: primaryHex },
    dot: { backgroundColor: primaryHex },
    ctaBanner: { backgroundColor: primaryHex },
    resultCard: { backgroundColor: `rgba(${rgb}, 0.08)` },
    resultValue: { color: primaryHex },
    checkIcon: { color: primaryHex },
  } as const;

  /* 3. Projets liés */
  const relatedProjects = (allProjects as Project[]).filter(
    (p) => p.domain === domain.id,
  );

  /* 4. Autres domaines */
  const otherDomains = (allDomains as Domain[])
    .filter((d) => d.id !== domain.id)
    .slice(0, 4);

  /* 5. JSON-LD */
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: domain.label,
    description: domain.description,
    image: domain.image,
    author: {
      "@type": "Organization",
      name: siteConfig.fullName,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    about: {
      "@type": "Thing",
      name: domain.label,
      description: domain.tagline,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <PageHeader
        tag="Domaine d'Intervention"
        title={domain.label}
        subtitle={domain.tagline}
        breadcrumbs={[
          { label: "Domaines d'Intervention", href: "/domains" },
          { label: domain.label },
        ]}
        image={domain.image}
        size="md"
      />

      {/* ── Corps ──────────────────────────────────────────────────────────── */}
      <div className="bg-neutral-50 py-16 lg:py-24">
        <div className="container-mrjc">
          <div className="grid lg:grid-cols-3 gap-10 lg:gap-14">
            {/* ── Colonne principale (2/3) ─────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-12">
              {/* Description */}
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={styles.iconBg}
                  >
                    <span>{domain.icon}</span>
                  </div>
                  <h2 className="font-display text-2xl font-bold text-neutral-900">
                    À propos de ce domaine
                  </h2>
                </div>
                <div className="prose prose-neutral max-w-none">
                  {domain.fullDescription.split("\n\n").map((para, i) => (
                    <p
                      key={i}
                      className="text-neutral-600 leading-relaxed mb-4 last:mb-0"
                    >
                      {para}
                    </p>
                  ))}
                </div>
              </section>

              {/* Notre approche — 4 étapes */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <Target className="w-6 h-6" style={styles.textColor} />
                  <h2 className="font-display text-2xl font-bold text-neutral-900">
                    Notre approche
                  </h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {domain.approach.map((step, index) => (
                    <div
                      key={step.title}
                      className="bg-white rounded-2xl border border-neutral-200 p-6 hover:shadow-md transition-shadow duration-200"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-black text-lg mb-4"
                        style={styles.stepNumber}
                      >
                        {(index + 1).toString().padStart(2, "0")}
                      </div>
                      <h3 className="font-bold text-neutral-900 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-sm text-neutral-500 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Activités clés */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <Activity className="w-6 h-6" style={styles.textColor} />
                  <h2 className="font-display text-2xl font-bold text-neutral-900">
                    Activités principales
                  </h2>
                </div>
                <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {domain.keyActivities.map((activity) => (
                      <li key={activity} className="flex items-start gap-3">
                        <CheckCircle
                          className="w-5 h-5 flex-shrink-0 mt-0.5"
                          style={styles.checkIcon}
                        />
                        <span className="text-sm text-neutral-700">
                          {activity}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Projets liés */}
              {relatedProjects.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <FolderKanban
                        className="w-6 h-6"
                        style={styles.textColor}
                      />
                      <h2 className="font-display text-2xl font-bold text-neutral-900">
                        Projets dans ce domaine
                      </h2>
                    </div>
                    <Link
                      href={`/projects?domain=${domain.id}`}
                      className="text-sm font-semibold flex items-center gap-1.5 transition-colors hover:opacity-80"
                      style={styles.textColor}
                    >
                      Voir tous <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className="space-y-4">
                    {relatedProjects.map((project) => {
                      const totalBenef = project.beneficiaries.reduce(
                        (s, b) => s + b.count,
                        0,
                      );
                      return (
                        <Link
                          key={project.id}
                          href={`/projects/${project.slug}`}
                          className="group flex items-start gap-5 bg-white rounded-2xl border border-neutral-200 p-5 hover:border-neutral-300 hover:shadow-md transition-all duration-200"
                        >
                          <div className="relative w-24 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-neutral-100">
                            <Image
                              src={project.coverImage}
                              alt={project.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="96px"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span
                                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor[project.status]}`}
                              >
                                {statusLabel[project.status]}
                              </span>
                              {project.budget && (
                                <span className="text-xs text-neutral-400">
                                  {formatBudget(project.budget)}
                                </span>
                              )}
                            </div>
                            <h3 className="font-bold text-neutral-900 text-base leading-snug group-hover:text-primary-700 transition-colors line-clamp-2">
                              {project.title}
                            </h3>
                            <div className="flex items-center gap-3 mt-1.5 text-xs text-neutral-500">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {project.zone}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />{" "}
                                {totalBenef.toLocaleString("fr-FR")}{" "}
                                bénéficiaires
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-neutral-400 flex-shrink-0 group-hover:translate-x-0.5 transition-transform mt-1" />
                        </Link>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>

            {/* ── Sidebar (1/3) ────────────────────────────────────────────── */}
            <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
              {/* Résultats clés */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                <h3 className="font-bold text-neutral-900 mb-5 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" style={styles.textColor} />
                  Résultats Clés
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {domain.results.map((result) => (
                    <div
                      key={result.label}
                      className="rounded-xl p-4 text-center"
                      style={styles.resultCard}
                    >
                      <div className="text-2xl mb-1">{result.icon}</div>
                      <div
                        className="font-display font-black text-xl leading-none"
                        style={styles.resultValue}
                      >
                        {result.value}
                      </div>
                      <div className="text-xs text-neutral-500 mt-1 leading-snug">
                        {result.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Groupes cibles */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                <h3 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" style={styles.textColor} />
                  Groupes Cibles
                </h3>
                <ul className="space-y-2.5">
                  {domain.targetGroups.map((group) => (
                    <li key={group} className="flex items-center gap-2.5">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={styles.dot}
                      />
                      <span className="text-sm text-neutral-700">{group}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Partenariat */}
              <div
                className="rounded-2xl p-6 text-white"
                style={styles.ctaBanner}
              >
                <h3 className="font-bold text-lg mb-3">Travailler avec nous</h3>
                <p className="text-white/80 text-sm mb-4 leading-relaxed">
                  Vous êtes bailleur, ONG, ou institution publique et souhaitez
                  collaborer avec MRJC-BÉNIN sur ce domaine ?
                </p>
                <Link
                  href="/work-with-us/collaboration"
                  className="w-full flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors"
                >
                  Nous contacter <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Autres domaines */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                <h3 className="font-bold text-neutral-900 mb-4 text-sm uppercase tracking-wide text-neutral-500">
                  Autres Domaines
                </h3>
                <ul className="space-y-1">
                  {otherDomains.map((other) => (
                    <li key={other.id}>
                      <Link
                        href={`/domains/${other.slug}`}
                        className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-neutral-50 transition-colors group"
                      >
                        <span className="text-base">{other.icon}</span>
                        <span className="text-sm text-neutral-700 group-hover:text-neutral-900 transition-colors flex-1">
                          {other.label}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-neutral-500 transition-colors" />
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/domains"
                  className="block mt-2 text-center text-xs font-semibold transition-colors hover:opacity-80 pt-3 border-t border-neutral-100"
                  style={styles.textColor}
                >
                  Voir tous les domaines →
                </Link>
              </div>

              {/* Bouton retour */}
              <Link
                href="/domains"
                className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                Retour aux domaines
              </Link>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
