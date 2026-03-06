/**
 * Page — Notre Équipe
 * Route: /about/team
 * Présente l'organigramme complet :
 * - Direction & leadership
 * - Conseil d'Administration
 * - Équipes programmes
 * - Valeurs d'équipe
 * - Rejoindre l'équipe (CTA)
 */

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Linkedin,
  Award,
  Users,
  Building2,
  Briefcase,
  GraduationCap,
  ArrowRight,
  Heart,
  Star,
  ChevronRight,
  Target,
} from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import teamRaw from "@/data/team.json";
import { siteConfig } from "@/config/site.config";

export const metadata: Metadata = {
  title: `Notre Équipe | ${siteConfig.seo.defaultTitle}`,
  description:
    "Découvrez les femmes et hommes qui font vivre la mission de MRJC-BÉNIN au quotidien : leadership, conseil d'administration et équipes programmes.",
  keywords: [
    "équipe MRJC Bénin",
    "staff ONG Bénin",
    "direction MRJC",
    "gouvernance ONG",
  ],
  openGraph: {
    title: "Notre Équipe — MRJC-BÉNIN",
    description:
      "L'équipe pluridisciplinaire qui œuvre pour le développement rural du Bénin.",
    url: `${siteConfig.url}/about/team`,
  },
};

/* ── Types ──────────────────────────────────────────────────────────── */
interface TeamMember {
  id: string;
  name: string;
  role: string;
  department?: string;
  institution?: string;
  bio?: string;
  photo: string;
  email?: string;
  linkedin?: string;
  since?: number;
  expertise?: string[];
  education?: string;
}

interface TeamData {
  leadership: TeamMember[];
  board: TeamMember[];
  departments: TeamMember[];
}

const team = teamRaw as unknown as TeamData;

/* ── Composant carte membre ──────────────────────────────────────────── */
function MemberCard({
  member,
  variant = "default",
}: {
  member: TeamMember;
  variant?: "default" | "board" | "leader";
}) {
  const isLeader = variant === "leader";
  const isBoard = variant === "board";

  return (
    <div
      className={`
      group bg-white rounded-2xl border border-gray-100 overflow-hidden
      hover:shadow-xl hover:-translate-y-1 transition-all duration-300
      ${isLeader ? "shadow-md" : "shadow-sm"}
    `}
    >
      {/* Photo */}
      <div
        className={`relative overflow-hidden bg-gray-100 ${
          isLeader ? "h-56" : isBoard ? "h-40" : "h-48"
        }`}
      >
        <Image
          src={member.photo}
          alt={member.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Overlay gradient bas */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Since badge */}
        {member.since && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-bold text-primary-700 px-2 py-1 rounded-full">
            Depuis {member.since}
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="p-5">
        <h3 className="font-display font-bold text-gray-900 text-base leading-tight mb-0.5">
          {member.name}
        </h3>
        <p className="text-primary-600 text-sm font-medium mb-1">
          {member.role}
        </p>
        {(member.department || member.institution) && (
          <p className="text-gray-400 text-xs mb-3 flex items-center gap-1">
            {isBoard ? (
              <Building2 className="w-3 h-3" />
            ) : (
              <Briefcase className="w-3 h-3" />
            )}
            {member.department ?? member.institution}
          </p>
        )}

        {/* Bio (leaders uniquement) */}
        {member.bio && isLeader && (
          <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-3">
            {member.bio}
          </p>
        )}

        {/* Expertise tags */}
        {member.expertise && member.expertise.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {member.expertise.slice(0, isLeader ? 4 : 2).map((skill) => (
              <span
                key={skill}
                className="text-[10px] font-medium bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Formation */}
        {member.education && !isBoard && (
          <p className="text-gray-400 text-xs flex items-start gap-1.5 mb-3">
            <GraduationCap className="w-3 h-3 flex-shrink-0 mt-0.5" />
            {member.education}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              className="w-8 h-8 bg-gray-50 hover:bg-primary-50 hover:text-primary-600
                         text-gray-400 rounded-lg flex items-center justify-center transition-colors"
              title={`Écrire à ${member.name}`}
            >
              <Mail className="w-3.5 h-3.5" />
            </a>
          )}
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 bg-gray-50 hover:bg-blue-50 hover:text-blue-600
                         text-gray-400 rounded-lg flex items-center justify-center transition-colors"
              title={`LinkedIn de ${member.name}`}
            >
              <Linkedin className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Section bloc ─────────────────────────────────────────────────────── */
function SectionHeading({
  icon: Icon,
  title,
  subtitle,
  count,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  count?: number;
}) {
  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-100 text-primary-700 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full mb-4">
        <Icon className="w-3.5 h-3.5" />
        {title}
        {count !== undefined && (
          <span className="bg-primary-600 text-white rounded-full px-1.5 py-0 text-[10px] font-bold">
            {count}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="text-gray-500 text-sm max-w-xl mx-auto">{subtitle}</p>
      )}
    </div>
  );
}

/* ── Page principale ──────────────────────────────────────────────────── */
export default function TeamPage() {
  const totalStaff =
    team.leadership.length + team.departments.length + team.board.length;

  return (
    <>
      {/* Correction : On retire 'stats' car il n'est pas supporté par PageHeader */}
      <PageHeader
        title="Notre Équipe"
        subtitle="Des professionnels engagés, pluridisciplinaires et ancrés dans les réalités du terrain béninois"
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "À Propos", href: "/about" },
          { label: "Équipe" },
        ]}
      />

      {/* Nouvelle section pour les statistiques de l'en-tête */}
      <section className="bg-white py-10 border-b border-neutral-100">
        <div className="container-mrjc">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-extrabold text-primary-600">
                {totalStaff}+
              </p>
              <p className="text-sm text-neutral-500 font-semibold uppercase tracking-wider">
                Membres d'équipe
              </p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-primary-600">3</p>
              <p className="text-sm text-neutral-500 font-semibold uppercase tracking-wider">
                Nationalités
              </p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-primary-600">8+</p>
              <p className="text-sm text-neutral-500 font-semibold uppercase tracking-wider">
                Langues parlées
              </p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-primary-600">120+</p>
              <p className="text-sm text-neutral-500 font-semibold uppercase tracking-wider">
                Expérience cumulée
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── DIRECTION & LEADERSHIP ──────────────────────────────────────── */}
      <section className="section-mrjc bg-white">
        <div className="container-mrjc">
          <SectionHeading
            icon={Star}
            title="Direction & Leadership"
            subtitle="L'équipe de direction stratégique qui pilote la vision et la mission de MRJC-BÉNIN"
            count={team.leadership.length}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.leadership.map((member) => (
              <MemberCard key={member.id} member={member} variant="leader" />
            ))}
          </div>
        </div>
      </section>

      {/* ── CONSEIL D'ADMINISTRATION ────────────────────────────────────── */}
      <section className="section-mrjc bg-gray-50">
        <div className="container-mrjc">
          <SectionHeading
            icon={Award}
            title="Conseil d'Administration"
            subtitle="Les membres du CA assurent la gouvernance institutionnelle et le contrôle stratégique de l'organisation"
            count={team.board.length}
          />

          {/* Intro gouvernance */}
          <div className="max-w-3xl mx-auto mb-10">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
              <p className="text-gray-600 text-sm leading-relaxed">
                Le Conseil d'Administration de MRJC-BÉNIN se réunit
                triennalement et supervise la stratégie organisationnelle, la
                gestion financière et la conformité aux statuts de
                l'association. Il est composé de personnalités reconnues dans
                leurs domaines respectifs, engagées bénévolement au service de
                notre mission.
              </p>
              <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-primary-400 rounded-full" />
                  Mandat 3 ans renouvelable
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-blue-400 rounded-full" />
                  Bénévoles
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-orange-400 rounded-full" />
                  Indépendants
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {team.board.map((member) => (
              <MemberCard key={member.id} member={member} variant="board" />
            ))}
          </div>
        </div>
      </section>

      {/* ── ÉQUIPES PROGRAMMES ─────────────────────────────────────────── */}
      <section className="section-mrjc bg-white">
        <div className="container-mrjc">
          <SectionHeading
            icon={Users}
            title="Équipes Programmes"
            subtitle="Les coordinateurs et responsables qui mettent en œuvre les projets sur le terrain dans 12 départements"
            count={team.departments.length}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.departments.map((member) => (
              <MemberCard key={member.id} member={member} variant="default" />
            ))}
          </div>
        </div>
      </section>

      {/* ── VALEURS D'ÉQUIPE ───────────────────────────────────────────── */}
      <section className="section-mrjc bg-primary-950">
        <div className="container-mrjc">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-primary-400 text-xs font-bold uppercase tracking-wider mb-4">
              <Heart className="w-3.5 h-3.5" />
              Ce qui nous unit
            </span>
            <h2 className="font-display text-3xl font-bold text-white mb-4">
              Nos Valeurs d'Équipe
            </h2>
            <p className="text-primary-300 max-w-xl mx-auto text-sm leading-relaxed">
              Au-delà des compétences professionnelles, c'est un socle de
              valeurs communes qui fonde la cohésion et l'efficacité de l'équipe
              MRJC-BÉNIN.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: "🤝",
                title: "Respect & Dignité",
                desc: "Chaque personne — bénéficiaire, collègue, partenaire — est traitée avec respect et considération.",
              },
              {
                icon: "💡",
                title: "Innovation Ancrée",
                desc: "Nous cherchons des solutions nouvelles tout en restant proches des réalités du terrain.",
              },
              {
                icon: "🎯",
                title: "Redevabilité",
                desc: "Nous rendons compte de nos résultats à nos bénéficiaires, partenaires et bailleurs de façon transparente.",
              },
              {
                icon: "🌱",
                title: "Durabilité",
                desc: "Toutes nos interventions sont conçues pour perurer au-delà de notre présence directe.",
              },
              {
                icon: "⚖️",
                title: "Équité & Genre",
                desc: "L'égalité entre femmes et hommes est un principe transversal appliqué dans tous nos programmes.",
              },
              {
                icon: "🌍",
                title: "Ancrage Local",
                desc: "Nous croyons à l'expertise locale et aux communautés comme premières actrices de leur développement.",
              },
              {
                icon: "🔗",
                title: "Partenariat",
                desc: "Nous privilégions la coordination et la complémentarité avec toutes les parties prenantes.",
              },
              {
                icon: "📚",
                title: "Apprentissage",
                desc: "Nous capitalisons nos expériences et améliorons continuellement nos pratiques.",
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-primary-900/50 border border-primary-800/50 rounded-xl p-5 hover:bg-primary-900 transition-colors"
              >
                <div className="text-2xl mb-3">{icon}</div>
                <h3 className="text-white font-bold text-sm mb-2">{title}</h3>
                <p className="text-primary-300 text-xs leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CHIFFRES ÉQUIPE ────────────────────────────────────────────── */}
      <section className="section-mrjc bg-white">
        <div className="container-mrjc">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { value: "85%", label: "Staff national", sub: "Béninois(es)" },
              { value: "54%", label: "Femmes", sub: "Dans l'équipe" },
              { value: "8+", label: "Langues", sub: "Fon, Yoruba, Baatonum…" },
              {
                value: "12",
                label: "Départements",
                sub: "Couverture nationale",
              },
            ].map(({ value, label, sub }) => (
              <div
                key={label}
                className="text-center bg-gray-50 rounded-2xl p-6 border border-gray-100"
              >
                <p className="text-4xl font-display font-black text-primary-600 mb-1">
                  {value}
                </p>
                <p className="text-gray-700 font-semibold text-sm">{label}</p>
                <p className="text-gray-400 text-xs">{sub}</p>
              </div>
            ))}
          </div>

          {/* ── CTA Rejoindre ── */}
          <div className="bg-gradient-to-br from-primary-50 to-green-50 border border-primary-100 rounded-3xl p-8 md:p-12 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Rejoignez l'aventure MRJC-BÉNIN
            </h2>
            <p className="text-gray-500 mb-8 max-w-xl mx-auto leading-relaxed">
              Nous recrutons régulièrement des professionnels passionnés par le
              développement rural, et accueillons volontaires, stagiaires et
              partenaires techniques engagés.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/work-with-us/jobs"
                className="btn-primary inline-flex items-center gap-2"
              >
                Voir les offres d'emploi
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/work-with-us/volunteer"
                className="btn-secondary inline-flex items-center gap-2"
              >
                Devenir bénévole
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/work-with-us/internship"
                className="border border-gray-200 hover:border-primary-300 bg-white text-gray-700 hover:text-primary-700 font-semibold px-5 py-2.5 rounded-xl transition-colors inline-flex items-center gap-2 text-sm"
              >
                Stage
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
