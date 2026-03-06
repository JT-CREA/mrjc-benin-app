/**
 * Page — /work-with-us/[job-slug]
 * Détail d'une offre d'emploi MRJC-BÉNIN
 * - Rendu statique ISR (revalidate: 3600)
 * - Formulaire de candidature en ligne
 * - Partage social
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Calendar,
  Building2,
  Briefcase,
  DollarSign,
  Users,
  Share2,
  ExternalLink,
  CheckCircle2,
  FileText,
  AlertCircle,
} from "lucide-react";
import JobApplicationForm from "./JobApplicationForm";

/* ─── Données offres (normalement depuis /api/jobs ou DB) ────────────────── */
async function getJob(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/jobs`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      jobs: Array<{
        id: string;
        slug?: string;
        title: string;
        type: string;
        department: string;
        domain: string;
        location: string;
        salary?: string;
        deadline: string;
        publishedAt: string;
        status: string;
        featured: boolean;
        description: string;
        missions: string[];
        profile: string[];
        benefits: string[];
        contact: string;
      }>;
    };
    return data.jobs?.find((j) => (j.slug ?? j.id) === slug) ?? null;
  } catch {
    return null;
  }
}

/* ─── Metadata dynamique ─────────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ "job-slug": string }>;
}): Promise<Metadata> {
  const { "job-slug": slug } = await params;
  const job = await getJob(slug);
  if (!job) return { title: "Offre introuvable | MRJC-BÉNIN" };
  return {
    title: `${job.title} | Emploi MRJC-BÉNIN`,
    description: `${job.type} — ${job.location}. ${job.description.slice(0, 120)}`,
    openGraph: {
      title: job.title,
      description: job.description.slice(0, 160),
      type: "website",
    },
  };
}

/* ─── Labels ─────────────────────────────────────────────────────────────── */
const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  "full-time": {
    label: "CDI — Temps plein",
    color: "bg-green-100 text-green-800",
  },
  "part-time": {
    label: "CDI — Temps partiel",
    color: "bg-blue-100 text-blue-800",
  },
  contract: { label: "CDD", color: "bg-orange-100 text-orange-800" },
  internship: { label: "Stage", color: "bg-purple-100 text-purple-800" },
  volunteer: { label: "Volontariat", color: "bg-teal-100 text-teal-800" },
};

function isExpired(deadline: string): boolean {
  return new Date(deadline) < new Date();
}

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString("fr-BJ", { dateStyle: "long" });
}

function daysLeft(deadline: string): number {
  return Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ "job-slug": string }>;
}) {
  const { "job-slug": slug } = await params;
  const job = await getJob(slug);
  if (!job) notFound();

  const expired = isExpired(job.deadline);
  const typeConfig = TYPE_LABELS[job.type] ?? {
    label: job.type,
    color: "bg-gray-100 text-gray-700",
  };
  const remaining = daysLeft(job.deadline);

  return (
    <>
      {/* ── En-tête ── */}
      <section className="bg-primary-900 text-white pt-8 pb-12">
        <div className="container-mrjc">
          <Link
            href="/work-with-us/jobs"
            className="inline-flex items-center gap-2 text-primary-200 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Retour aux offres
          </Link>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${typeConfig.color}`}
                >
                  {typeConfig.label}
                </span>
                {job.featured && (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-secondary-500 text-white">
                    ⭐ Offre vedette
                  </span>
                )}
                {expired ? (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-500 text-white">
                    ❌ Clôturée
                  </span>
                ) : remaining <= 7 ? (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-500 text-white">
                    ⏳ {remaining} jour{remaining > 1 ? "s" : ""} restant
                    {remaining > 1 ? "s" : ""}
                  </span>
                ) : null}
              </div>

              <h1 className="text-2xl md:text-4xl font-bold font-display mb-4 leading-tight">
                {job.title}
              </h1>

              <div className="flex flex-wrap gap-4 text-sm text-primary-200">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" /> {job.department}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> {job.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> Publiée le{" "}
                  {formatDate(job.publishedAt)}
                </span>
                {job.salary && (
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4" /> {job.salary}
                  </span>
                )}
              </div>
            </div>

            {/* Deadline card */}
            <div
              className={`shrink-0 rounded-2xl p-4 min-w-[160px] text-center ${expired ? "bg-red-600/20 border border-red-500/30" : "bg-white/10 border border-white/20"}`}
            >
              <p className="text-xs text-primary-300 mb-1">Date limite</p>
              <p className="font-bold text-white text-sm">
                {formatDate(job.deadline)}
              </p>
              {!expired && (
                <p className="text-xs text-primary-300 mt-1">
                  {remaining} jour{remaining > 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Corps ── */}
      <div className="container-mrjc py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold font-display text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-600" /> Description du
                poste
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {/* Missions */}
            {job.missions?.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold font-display text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary-600" /> Missions
                  principales
                </h2>
                <ul className="space-y-2">
                  {job.missions.map((m, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-gray-700 text-sm"
                    >
                      <CheckCircle2 className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Profil requis */}
            {job.profile?.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold font-display text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary-600" /> Profil
                  recherché
                </h2>
                <ul className="space-y-2">
                  {job.profile.map((p, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-gray-700 text-sm"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary-500 mt-2 shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Avantages */}
            {job.benefits?.length > 0 && (
              <div className="bg-primary-50 rounded-2xl p-6 border border-primary-100">
                <h2 className="text-xl font-bold font-display text-gray-900 mb-4">
                  ✨ Ce que nous offrons
                </h2>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {job.benefits.map((b, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      <span className="text-primary-600 font-bold">+</span> {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Formulaire candidature */}
            {!expired ? (
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold font-display text-gray-900 mb-2">
                  📩 Postuler maintenant
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  Remplissez le formulaire ci-dessous. Tous les champs marqués *
                  sont obligatoires.
                </p>
                <JobApplicationForm jobId={job.id} jobTitle={job.title} />
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-800">Offre clôturée</p>
                  <p className="text-sm text-red-600 mt-1">
                    Cette offre n&apos;accepte plus de candidatures.
                  </p>
                  <Link
                    href="/work-with-us/jobs"
                    className="text-sm text-primary-600 hover:underline mt-2 inline-block"
                  >
                    Voir les autres offres →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Résumé offre */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">
                Résumé
              </h3>
              <div className="space-y-3 text-sm">
                <Row
                  icon={<Building2 className="w-4 h-4 text-primary-500" />}
                  label="Département"
                  value={job.department}
                />
                <Row
                  icon={<Briefcase className="w-4 h-4 text-primary-500" />}
                  label="Type de contrat"
                  value={typeConfig.label}
                />
                <Row
                  icon={<MapPin className="w-4 h-4 text-primary-500" />}
                  label="Lieu"
                  value={job.location}
                />
                {job.salary && (
                  <Row
                    icon={<DollarSign className="w-4 h-4 text-primary-500" />}
                    label="Rémunération"
                    value={job.salary}
                  />
                )}
                <Row
                  icon={<Calendar className="w-4 h-4 text-primary-500" />}
                  label="Date limite"
                  value={formatDate(job.deadline)}
                />
                <Row
                  icon={<Clock className="w-4 h-4 text-primary-500" />}
                  label="Publiée le"
                  value={formatDate(job.publishedAt)}
                />
              </div>
            </div>

            {/* Contact */}
            {job.contact && (
              <div className="bg-primary-50 rounded-2xl p-5 border border-primary-100">
                <h3 className="font-bold text-gray-900 mb-2 text-sm">
                  Contact RH
                </h3>
                <p className="text-sm text-gray-600">{job.contact}</p>
              </div>
            )}

            {/* Partage */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-1.5">
                <Share2 className="w-4 h-4" /> Partager cette offre
              </h3>
              <div className="flex flex-col gap-2">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL}/work-with-us/${slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Partager sur Facebook
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL}/work-with-us/${slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-700 hover:text-blue-900"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Partager sur LinkedIn
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Offre d'emploi MRJC-BÉNIN: ${job.title} — ${process.env.NEXT_PUBLIC_SITE_URL}/work-with-us/${slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-green-600 hover:text-green-800"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Partager sur WhatsApp
                </a>
              </div>
            </div>

            {/* Autres offres */}
            <Link
              href="/work-with-us/jobs"
              className="flex items-center justify-between w-full bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:border-primary-200 transition-colors group text-sm"
            >
              <span className="text-gray-700 font-medium">
                Voir toutes les offres
              </span>
              <ArrowLeft className="w-4 h-4 text-primary-500 rotate-180 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Composant Row ──────────────────────────────────────────────────────── */
function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div>
        <p className="text-gray-500 text-xs">{label}</p>
        <p className="text-gray-900 font-medium text-sm">{value}</p>
      </div>
    </div>
  );
}
