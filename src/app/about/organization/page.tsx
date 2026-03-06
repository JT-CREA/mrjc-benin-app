import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Mail, Linkedin, Users, Building2, ArrowRight } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import teamData from "@/data/team.json";

export const metadata: Metadata = {
  title: "Notre Organisation",
  description:
    "Gouvernance, équipe dirigeante et structure organisationnelle de MRJC-BÉNIN.",
};

/* ─────────────────────────────────────────────────────────────
   Composant Carte Membre
───────────────────────────────────────────────────────────── */
function TeamMemberCard({
  member,
}: {
  member: (typeof teamData.leadership)[0];
}) {
  return (
    <div
      className="group bg-white rounded-2xl border border-neutral-100 overflow-hidden
                    hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Photo */}
      <div className="relative h-56 bg-primary-100 overflow-hidden">
        <Image
          src={member.photo}
          alt={member.name}
          fill
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/60 via-transparent to-transparent" />
        {/* Badge département */}
        <div className="absolute top-3 right-3">
          <span className="bg-secondary-500 text-white text-2xs font-bold px-2.5 py-1 rounded-full">
            {member.department}
          </span>
        </div>
        {/* Liens sociaux superposés */}
        <div
          className="absolute bottom-3 left-3 flex items-center gap-2
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              className="w-8 h-8 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg
                          flex items-center justify-center text-white hover:bg-white/40 transition-colors"
              title={`Email ${member.name}`}
            >
              <Mail className="w-3.5 h-3.5" />
            </a>
          )}
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg
                          flex items-center justify-center text-white hover:bg-white/40 transition-colors"
              title="LinkedIn"
            >
              <Linkedin className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Infos */}
      <div className="p-5">
        <h3 className="font-display font-bold text-base text-neutral-900 leading-snug mb-0.5">
          {member.name}
        </h3>
        <p className="text-sm font-semibold text-primary-600 mb-3">
          {member.role}
        </p>
        <p className="text-xs text-neutral-500 leading-relaxed line-clamp-3 mb-4">
          {member.bio}
        </p>

        {/* Expertise */}
        <div className="flex flex-wrap gap-1.5">
          {member.expertise.slice(0, 3).map((exp) => (
            <span
              key={exp}
              className="text-2xs bg-primary-50 text-primary-700 border border-primary-100
                             px-2 py-0.5 rounded-full font-medium"
            >
              {exp}
            </span>
          ))}
        </div>

        {/* Depuis */}
        <p className="text-2xs text-neutral-400 mt-3">
          Membre de l'équipe depuis <strong>{member.since}</strong>
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Carte membre CA (compacte)
───────────────────────────────────────────────────────────── */
function BoardMemberCard({ member }: { member: (typeof teamData.board)[0] }) {
  return (
    <div
      className="flex items-center gap-4 bg-white rounded-2xl border border-neutral-100 p-4
                    hover:shadow-md transition-all hover:border-primary-200"
    >
      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-primary-100 flex-shrink-0">
        <Image
          src={member.photo}
          alt={member.name}
          fill
          className="object-cover"
          sizes="56px"
        />
      </div>
      <div className="min-w-0">
        <h4 className="font-bold text-sm text-neutral-900 truncate">
          {member.name}
        </h4>
        <p className="text-xs font-semibold text-primary-600 truncate">
          {member.role}
        </p>
        <p className="text-xs text-neutral-400 truncate">
          {member.institution}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Organigramme simplifié SVG-less
───────────────────────────────────────────────────────────── */
function OrgChart() {
  return (
    <div className="bg-white rounded-3xl border border-neutral-100 p-8 overflow-x-auto">
      {/* Niveau 1 — CA */}
      <div className="flex justify-center mb-6">
        <div className="bg-primary-900 text-white rounded-xl px-6 py-3 text-sm font-bold text-center min-w-[220px]">
          Conseil d'Administration
          <br />
          <span className="text-primary-300 text-xs font-normal">
            3 membres
          </span>
        </div>
      </div>
      {/* Ligne verticale */}
      <div className="flex justify-center mb-6">
        <div className="w-0.5 h-8 bg-neutral-200" />
      </div>
      {/* Niveau 2 — DEx */}
      <div className="flex justify-center mb-6">
        <div className="bg-primary-500 text-white rounded-xl px-6 py-3 text-sm font-bold text-center min-w-[220px]">
          Direction Exécutive
          <br />
          <span className="text-primary-200 text-xs font-normal">
            Dr. Firmin Ahouansou
          </span>
        </div>
      </div>
      {/* Ligne horizontale */}
      <div className="flex justify-center mb-0">
        <div className="w-0.5 h-8 bg-neutral-200" />
      </div>
      <div className="relative flex justify-center">
        <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-neutral-200" />
      </div>
      {/* Niveau 3 — Départements */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-0">
        {teamData.departments.map((dept) => (
          <div key={dept.id} className="flex flex-col items-center">
            <div className="w-0.5 h-8 bg-neutral-200 mx-auto" />
            <div
              className="bg-neutral-50 border-2 border-neutral-200 rounded-xl px-3 py-3
                            text-center w-full hover:border-primary-300 hover:bg-primary-50
                            transition-colors cursor-default"
            >
              <div className="text-xs font-bold text-neutral-800 leading-snug mb-1">
                {dept.name}
              </div>
              <div className="text-2xs text-neutral-500">
                {dept.department} agents
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Page principale
───────────────────────────────────────────────────────────── */
export default function OrganizationPage() {
  return (
    <>
      <PageHeader
        tag="Notre Structure"
        title="Notre Organisation"
        subtitle="Une équipe pluridisciplinaire de 33 professionnels engagés, encadrée par un Conseil d'Administration indépendant, au service du développement rural béninois."
        breadcrumbs={[
          { label: "Nous Connaître", href: "/about" },
          { label: "Notre Organisation" },
        ]}
        image="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1920"
      />

      <div className="py-20 lg:py-28 bg-neutral-50 space-y-24">
        {/* ── Chiffres clés ── */}
        <div className="container-mrjc">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "33", label: "Agents permanents", icon: "👥" },
              { value: "230+", label: "Agents de terrain", icon: "🗺️" },
              { value: "5", label: "Départements internes", icon: "🏢" },
              { value: "1985", label: "Fondée en", icon: "📅" },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white rounded-2xl border border-neutral-100 p-6 text-center
                              hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="font-display font-black text-4xl text-primary-600 mb-1">
                  {s.value}
                </div>
                <div className="text-xs text-neutral-500 leading-snug">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Organigramme ── */}
        <div className="container-mrjc">
          <div className="section-header">
            <div className="section-tag">Gouvernance</div>
            <h2 className="section-title">Structure organisationnelle</h2>
            <p className="section-subtitle">
              Une gouvernance à deux niveaux : un Conseil d'Administration
              stratégique et une Direction Exécutive opérationnelle.
            </p>
          </div>
          <OrgChart />
        </div>

        {/* ── Équipe dirigeante ── */}
        <div className="container-mrjc">
          <div className="section-header">
            <div className="section-tag">Notre Équipe</div>
            <h2 className="section-title">L'équipe de direction</h2>
            <p className="section-subtitle">
              Des experts pluridisciplinaires unis par la même conviction : le
              développement rural durable est possible au Bénin.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamData.leadership.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        </div>

        {/* ── Conseil d'Administration ── */}
        <div className="container-mrjc">
          <div className="section-header">
            <div className="section-tag">Gouvernance</div>
            <h2 className="section-title">Conseil d'Administration</h2>
            <p className="section-subtitle">
              Le CA définit les orientations stratégiques et assure la
              surveillance de la gestion de l'organisation.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {teamData.board.map((member) => (
              <BoardMemberCard key={member.id} member={member} />
            ))}
          </div>

          {/* Rôle du CA */}
          <div className="mt-10 bg-primary-50 rounded-3xl p-8 border border-primary-100 max-w-3xl mx-auto">
            <Building2 className="w-8 h-8 text-primary-600 mb-4" />
            <h3 className="font-display font-bold text-xl text-neutral-900 mb-3">
              Rôle et fonctionnement du CA
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed mb-4">
              Le Conseil d'Administration de MRJC-BÉNIN se réunit 4 fois par an
              en session ordinaire. Il est composé de personnalités
              indépendantes issues du monde académique, de la société civile et
              du secteur privé, garantissant une gouvernance équilibrée et
              transparente.
            </p>
            <ul className="space-y-2">
              {[
                "Validation des orientations stratégiques et du budget annuel",
                "Supervision et évaluation de la Direction Exécutive",
                "Approbation des comptes et des rapports financiers",
                "Mobilisation du réseau pour les partenariats stratégiques",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-neutral-700"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Rejoindre l'équipe ── */}
        <div className="container-mrjc">
          <div className="bg-primary-900 rounded-3xl overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="p-10 lg:p-14">
                <Users className="w-10 h-10 text-secondary-400 mb-6" />
                <h2 className="font-display text-3xl font-bold text-white mb-4">
                  Rejoindre l'équipe
                </h2>
                <p className="text-primary-200 leading-relaxed mb-6">
                  MRJC-BÉNIN recrute régulièrement des profils qualifiés et
                  engagés. Consultez nos offres d'emploi actuelles ou envoyez
                  une candidature spontanée.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/work-with-us/jobs" className="btn-secondary">
                    Voir les offres <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/work-with-us/volunteer"
                    className="btn-outline-white text-sm"
                  >
                    Bénévolat
                  </Link>
                </div>
              </div>
              <div className="bg-primary-800 p-10 lg:p-14 flex flex-col justify-center gap-4">
                {[
                  {
                    label: "Postes ouverts actuellement",
                    value: "2",
                    color: "bg-secondary-500",
                  },
                  {
                    label: "Bénévoles actifs",
                    value: "45+",
                    color: "bg-accent-500",
                  },
                  {
                    label: "Stagiaires par an",
                    value: "12",
                    color: "bg-purple-500",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-4 bg-primary-700/50 rounded-xl p-4"
                  >
                    <div
                      className={`w-10 h-10 ${item.color} rounded-lg flex items-center
                                     justify-center font-bold text-white text-sm flex-shrink-0`}
                    >
                      {item.value}
                    </div>
                    <span className="text-primary-200 text-sm">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
