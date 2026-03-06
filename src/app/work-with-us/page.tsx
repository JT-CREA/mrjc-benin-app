import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Briefcase,
  HandshakeIcon,
  Heart,
  GraduationCap,
} from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Travailler avec Nous | MRJC-BÉNIN",
  description:
    "Rejoignez MRJC-BÉNIN en tant qu'employé, bénévole, consultant ou partenaire. Découvrez nos opportunités de collaboration.",
};

const opportunities = [
  {
    href: "/work-with-us/jobs",
    icon: Briefcase,
    label: "Offres d'Emploi",
    description:
      "Consultez nos postes ouverts et rejoignez notre équipe de professionnels engagés dans le développement rural au Bénin.",
    color: "bg-primary-500",
    stat: "2 postes ouverts",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600",
    cta: "Voir les offres",
  },
  {
    href: "/work-with-us/collaboration",
    icon: HandshakeIcon,
    label: "Partenariat & Collaboration",
    description:
      "Vous êtes une ONG, une agence de développement, une entreprise ou une institution publique. Collaborons ensemble pour plus d'impact.",
    color: "bg-accent-500",
    stat: "35+ partenaires actifs",
    image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=600",
    cta: "Proposer un partenariat",
  },
  {
    href: "/work-with-us/volunteer",
    icon: Heart,
    label: "Bénévolat & Volontariat",
    description:
      "Vous souhaitez mettre vos compétences au service du développement rural béninois ? Nos missions de bénévolat vous attendent.",
    color: "bg-secondary-500",
    stat: "45+ bénévoles actifs",
    image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600",
    cta: "S'engager",
  },
  {
    href: "/work-with-us/internship",
    icon: GraduationCap,
    label: "Stages & Thèses",
    description:
      "MRJC-BÉNIN accueille des étudiants en stage de fin d'études et des chercheurs pour des travaux en développement rural.",
    color: "bg-purple-600",
    stat: "12 stagiaires/an",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600",
    cta: "Candidater",
  },
];

const values = [
  {
    icon: "🌱",
    title: "Mission porteuse de sens",
    description:
      "Travailler pour des communautés rurales béninoises avec un impact visible et mesurable.",
  },
  {
    icon: "📚",
    title: "Développement professionnel",
    description:
      "Formations régulières, conférences, échanges avec des partenaires internationaux.",
  },
  {
    icon: "🤝",
    title: "Équipe inclusive",
    description:
      "Culture organisationnelle basée sur le respect, la diversité et la solidarité.",
  },
  {
    icon: "⚖️",
    title: "Équilibre vie-travail",
    description:
      "Horaires flexibles, télétravail partiel, respect des congés et du temps personnel.",
  },
  {
    icon: "💰",
    title: "Rémunération équitable",
    description:
      "Salaires alignés sur les standards du secteur ONG au Bénin et en Afrique de l'Ouest.",
  },
  {
    icon: "🌍",
    title: "Réseau international",
    description:
      "Collaboration avec des partenaires dans 20+ pays d'Afrique, d'Europe et d'Amérique du Nord.",
  },
];

export default function WorkWithUsPage() {
  return (
    <>
      <PageHeader
        tag="Rejoindre MRJC-BÉNIN"
        title="Travailler avec Nous"
        subtitle="Que vous souhaitiez intégrer notre équipe, proposer un partenariat stratégique, ou contribuer bénévolement, MRJC-BÉNIN vous offre de multiples formes d'engagement."
        breadcrumbs={[{ label: "Travailler avec Nous" }]}
        image="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1920"
        align="left"
      />

      <section className="py-20 lg:py-28 bg-neutral-50">
        <div className="container-mrjc">
          {/* Intro */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="section-tag">Opportunités</div>
            <h2 className="section-title mt-2">
              Comment vous engager avec nous ?
            </h2>
            <p className="section-subtitle">
              Il existe plusieurs façons de contribuer à notre mission.
              Choisissez la forme d'engagement qui correspond à votre profil et
              à vos aspirations.
            </p>
          </div>

          {/* Cartes opportunités */}
          <div className="grid md:grid-cols-2 gap-6 mb-20">
            {opportunities.map((opp) => {
              const Icon = opp.icon;
              return (
                <Link
                  key={opp.href}
                  href={opp.href}
                  className="group card overflow-hidden flex flex-col sm:flex-row hover:-translate-y-1"
                >
                  <div className="relative sm:w-48 h-48 sm:h-auto flex-shrink-0 overflow-hidden bg-neutral-100">
                    <Image
                      src={opp.image}
                      alt={opp.label}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="192px"
                    />
                    <div className="absolute inset-0 bg-primary-900/30" />
                    <div
                      className={`absolute top-4 left-4 w-10 h-10 ${opp.color}
                                    rounded-xl flex items-center justify-center`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <span
                        className="text-xs font-semibold bg-white/90 text-neutral-700
                                       px-2.5 py-1 rounded-full"
                      >
                        {opp.stat}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col justify-between flex-1">
                    <div>
                      <h3
                        className="font-display font-bold text-xl text-neutral-900 mb-2
                                     group-hover:text-primary-700 transition-colors"
                      >
                        {opp.label}
                      </h3>
                      <p className="text-sm text-neutral-500 leading-relaxed">
                        {opp.description}
                      </p>
                    </div>
                    <div
                      className="flex items-center gap-2 mt-4 text-sm font-semibold
                                    text-primary-600 group-hover:gap-3 transition-all"
                    >
                      {opp.cta}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pourquoi MRJC */}
          <div className="bg-white rounded-3xl border border-neutral-200 p-10 lg:p-14">
            <div className="text-center mb-12">
              <div className="section-tag">Culture Organisationnelle</div>
              <h2 className="section-title mt-2">
                Pourquoi rejoindre MRJC-BÉNIN ?
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((val) => (
                <div key={val.title} className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center
                                   justify-center text-2xl flex-shrink-0"
                  >
                    {val.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-900 mb-1">
                      {val.title}
                    </h3>
                    <p className="text-sm text-neutral-500 leading-relaxed">
                      {val.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Témoignage employé */}
          <div
            className="mt-10 bg-primary-900 rounded-3xl p-10 lg:p-14 text-white flex flex-col
                           lg:flex-row items-center gap-10"
          >
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-primary-700">
              <Image
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200"
                alt="Dr. Firmin Ahouansou"
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
            <div className="flex-1">
              <blockquote className="text-lg text-white/90 italic leading-relaxed mb-4">
                "Travailler à MRJC-BÉNIN, c'est voir chaque jour l'impact
                concret de notre travail sur des familles rurales. C'est une
                responsabilité exigeante, mais profondément gratifiante."
              </blockquote>
              <div>
                <p className="font-bold text-white">Dr. Firmin Ahouansou</p>
                <p className="text-primary-300 text-sm">
                  Directeur Exécutif, depuis 2015
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
