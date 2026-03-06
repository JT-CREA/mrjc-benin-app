/**
 * Page — Bénévolat & Volontariat — MRJC-BÉNIN
 * Route : /work-with-us/volunteer
 *
 * Structure :
 *  1. PageHeader héroïque avec statistiques
 *  2. Pourquoi s'engager — bénéfices + chiffres
 *  3. 4 types d'engagement (cartes avec niveaux)
 *  4. Processus de sélection (timeline)
 *  5. Témoignages de bénévoles actuels
 *  6. Formulaire de candidature (VolunteerForm)
 *  7. CTA contact + liens rapides
 */

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PageHeader from "@/components/layout/PageHeader";
import VolunteerForm from "@/components/sections/work/VolunteerForm";
import {
  Heart,
  Clock,
  Globe,
  Star,
  ArrowRight,
  CheckCircle,
  MapPin,
  Briefcase,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Devenir Bénévole | MRJC-BÉNIN",
  description:
    "Rejoignez les 120 bénévoles actifs de MRJC-BÉNIN. Apportez vos compétences au service des communautés rurales du Bénin. Toutes les nationalités bienvenues.",
  keywords: [
    "bénévole Bénin",
    "volontariat ONG Bénin",
    "MRJC bénévolat",
    "développement rural bénévole",
    "volontariat Afrique",
  ],
  openGraph: {
    title: "Devenir Bénévole — MRJC-BÉNIN",
    description:
      "Rejoignez 120 bénévoles engagés pour le développement rural du Bénin.",
    url: "https://mrjc-benin.org/work-with-us/volunteer",
  },
};

/* ══════════════════════════════════════════════════════════════════════════════
   DONNÉES
══════════════════════════════════════════════════════════════════════════════ */
const volunteerOpportunities = [
  {
    id: "terrain",
    title: "Volontaire Terrain",
    emoji: "🌾",
    duration: "3 à 12 mois",
    location: "Zones rurales, Bénin",
    level: "Engagement fort",
    levelColor: "bg-primary-100 text-primary-700",
    description:
      "Accompagner directement nos équipes dans la mise en œuvre des projets : formation agricole, animation communautaire, santé de base.",
    skills: [
      "Animation communautaire",
      "Agriculture / Agro-écologie",
      "Santé publique",
      "Alphabétisation",
    ],
    borderColor: "border-primary-300",
    bgColor: "bg-primary-50",
    textColor: "text-primary-700",
    iconBg: "bg-primary-100",
  },
  {
    id: "expert",
    title: "Expert Technique Bénévole",
    emoji: "🎯",
    duration: "1 à 6 mois",
    location: "À distance ou sur site",
    level: "Expertise requise",
    levelColor: "bg-accent-100 text-accent-700",
    description:
      "Apporter votre expertise spécialisée (agronome, médecin, juriste, informaticien, communicant) en appui aux programmes.",
    skills: [
      "Agronomie / Élevage",
      "Santé publique",
      "Communication",
      "Droit / Finance",
      "IT / Digital",
    ],
    borderColor: "border-accent-300",
    bgColor: "bg-accent-50",
    textColor: "text-accent-700",
    iconBg: "bg-accent-100",
  },
  {
    id: "digital",
    title: "Volontaire Digital",
    emoji: "💻",
    duration: "Flexible (min. 4h/sem)",
    location: "100% à distance",
    level: "Flexible",
    levelColor: "bg-secondary-100 text-secondary-900",
    description:
      "Soutien à distance : gestion des réseaux sociaux, création de contenu, traduction, développement web ou graphisme.",
    skills: [
      "Gestion réseaux sociaux",
      "Rédaction / Traduction",
      "Design graphique",
      "Développement web",
      "Vidéo / Photo",
    ],
    borderColor: "border-secondary-300",
    bgColor: "bg-secondary-50",
    textColor: "text-secondary-700",
    iconBg: "bg-secondary-100",
  },
  {
    id: "mission",
    title: "Mission Ponctuelle",
    emoji: "⚡",
    duration: "1 à 30 jours",
    location: "Bénin ou à distance",
    level: "Court terme",
    levelColor: "bg-purple-100 text-purple-700",
    description:
      "Contribution sur un événement précis : atelier, formation, collecte de fonds, reportage, audit ou mission d'évaluation.",
    skills: [
      "Formation / Animation",
      "Collecte de fonds",
      "Évaluation de projets",
      "Journalisme",
      "Logistique",
    ],
    borderColor: "border-purple-300",
    bgColor: "bg-purple-50",
    textColor: "text-purple-700",
    iconBg: "bg-purple-100",
  },
];

const benefits = [
  {
    icon: Heart,
    text: "Contribuer concrètement au développement du Bénin",
    color: "text-red-500",
  },
  {
    icon: Star,
    text: "Acquérir une expérience terrain reconnue internationalement",
    color: "text-amber-500",
  },
  {
    icon: Globe,
    text: "Intégrer un réseau professionnel de 18+ nationalités",
    color: "text-blue-500",
  },
  {
    icon: CheckCircle,
    text: "Recevoir une attestation officielle de mission",
    color: "text-green-500",
  },
  {
    icon: Clock,
    text: "Flexibilité dans l'organisation de votre temps",
    color: "text-purple-500",
  },
  {
    icon: ArrowRight,
    text: "Opportunité d'évolution vers un poste rémunéré",
    color: "text-primary-500",
  },
];

const processSteps = [
  {
    step: "01",
    icon: "📝",
    title: "Candidature en ligne",
    desc: "Remplissez le formulaire ci-dessous. Délai : 10 min.",
  },
  {
    step: "02",
    icon: "📞",
    title: "Entretien de motivation",
    desc: "Appel vidéo avec notre responsable RH sous 7 jours ouvrés.",
  },
  {
    step: "03",
    icon: "📄",
    title: "Accord de mission",
    desc: "Signature de la convention de bénévolat MRJC-BÉNIN.",
  },
  {
    step: "04",
    icon: "🎓",
    title: "Intégration & briefing",
    desc: "Formation d'accueil avant le démarrage de la mission.",
  },
];

const testimonials = [
  {
    name: "Lucas Beaumont",
    country: "France",
    flag: "🇫🇷",
    role: "Volontaire Terrain, 2023",
    quote:
      "Six mois à parcourir l'Atacora avec les équipes MRJC. J'ai appris plus en terrain que pendant mes 3 années d'agro. Une expérience humaine que je n'oublierai jamais.",
    domain: "Agriculture",
    photo: "/assets/images/placeholder.svg",
  },
  {
    name: "Priya Nair",
    country: "Inde",
    flag: "🇮🇳",
    role: "Experte Santé Bénévole, 2024",
    quote:
      "MRJC m'a permis de mettre mes connaissances en nutrition au service de vraies communautés. Le professionnalisme de l'équipe et l'impact mesurable de notre travail m'ont profondément impressionnée.",
    domain: "Santé",
    photo: "/assets/images/placeholder.svg",
  },
  {
    name: "Kofi Mensah",
    country: "Ghana",
    flag: "🇬🇭",
    role: "Volontaire Digital, 2024",
    quote:
      "En 4h par semaine depuis Accra, j'ai géré les réseaux MRJC et vu leur communauté en ligne tripler. La flexibilité du bénévolat digital est parfaite quand on a un emploi.",
    domain: "Communication",
    photo: "/assets/images/placeholder.svg",
  },
];

/* ══════════════════════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════════════════════ */
export default function VolunteerPage() {
  return (
    <>
      {/* ── PageHeader ─────────────────────────────────────────────────────── */}
      <PageHeader
        tag="Rejoindre la mission"
        title="Devenir Bénévole"
        subtitle="Mettez vos compétences au service des communautés rurales béninoises. Chaque talent, chaque heure donnée, change des vies."
        breadcrumbs={[
          { label: "Travailler avec nous", href: "/work-with-us" },
          { label: "Bénévolat" },
        ]}
        image="/assets/images/placeholder.svg"
        size="sm"
        align="left"
      >
        {/* Stats rapides dans le header */}
        <div className="flex flex-wrap gap-4 mt-6">
          {[
            { value: "120+", label: "bénévoles actifs" },
            { value: "18", label: "nationalités" },
            { value: "4 500", label: "heures / an" },
            { value: "95%", label: "de satisfaction" },
          ].map((s) => (
            <div
              key={s.label}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm
                            border border-white/20 rounded-xl px-4 py-2"
            >
              <span className="text-white font-black">{s.value}</span>
              <span className="text-primary-200 text-xs">{s.label}</span>
            </div>
          ))}
        </div>
      </PageHeader>

      <div className="bg-neutral-50">
        {/* ── 1. Pourquoi s'engager ──────────────────────────────────────────── */}
        <section className="section-padding bg-white">
          <div className="container-mrjc">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Texte */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-3">
                  Votre engagement
                </p>
                <h2 className="font-display font-black text-3xl lg:text-4xl text-neutral-900 mb-6 leading-tight">
                  Pourquoi vous engager
                  <br className="hidden lg:block" /> avec MRJC-BÉNIN ?
                </h2>
                <p className="text-neutral-600 leading-relaxed mb-8">
                  MRJC-BÉNIN accueille des bénévoles et volontaires du Bénin et
                  du monde entier. Quel que soit votre profil ou votre
                  disponibilité, il existe un rôle pour vous dans notre mission
                  de développement rural intégré.
                </p>
                <ul className="space-y-4">
                  {benefits.map(({ icon: Icon, text, color }) => (
                    <li
                      key={text}
                      className="flex items-start gap-3 text-sm text-neutral-700"
                    >
                      <div
                        className="w-8 h-8 bg-neutral-50 border border-neutral-100 rounded-xl flex items-center
                                      justify-center flex-shrink-0 mt-0.5"
                      >
                        <Icon className={`w-4 h-4 ${color}`} />
                      </div>
                      {text}
                    </li>
                  ))}
                </ul>
                <div className="mt-10 flex gap-4">
                  <a href="#formulaire" className="btn-primary">
                    <Heart className="w-4 h-4" /> Postuler maintenant
                  </a>
                  <Link href="/contact" className="btn-outline">
                    Poser une question
                  </Link>
                </div>
              </div>

              {/* Stats visuelles */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    value: "120+",
                    label: "Bénévoles actifs",
                    emoji: "👥",
                    color: "bg-primary-50 border-primary-200",
                  },
                  {
                    value: "18",
                    label: "Nationalités",
                    emoji: "🌍",
                    color: "bg-blue-50 border-blue-200",
                  },
                  {
                    value: "4 500",
                    label: "Heures de bénévolat/an",
                    emoji: "⏰",
                    color: "bg-amber-50 border-amber-200",
                  },
                  {
                    value: "95%",
                    label: "Taux de satisfaction",
                    emoji: "⭐",
                    color: "bg-green-50 border-green-200",
                  },
                ].map(({ value, label, emoji, color }) => (
                  <div
                    key={label}
                    className={`rounded-2xl p-6 border-2 ${color} text-center hover:shadow-md transition-all`}
                  >
                    <div className="text-3xl mb-3">{emoji}</div>
                    <div className="font-display font-black text-2xl text-primary-700 mb-1">
                      {value}
                    </div>
                    <div className="text-xs text-neutral-600 font-medium leading-snug">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. Types d'engagement ─────────────────────────────────────────── */}
        <section className="section-padding">
          <div className="container-mrjc">
            <div className="text-center mb-12">
              <p className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-3">
                4 modalités
              </p>
              <h2 className="font-display font-black text-3xl lg:text-4xl text-neutral-900">
                Choisissez votre forme d'engagement
              </h2>
              <p className="text-neutral-500 mt-3 max-w-xl mx-auto">
                Du volontariat terrain immersif au bénévolat digital flexible —
                il y a une place pour vous.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {volunteerOpportunities.map((opp) => (
                <div
                  key={opp.id}
                  className={`rounded-2xl border-2 ${opp.borderColor} ${opp.bgColor}
                                 p-7 flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
                >
                  {/* Emoji + badge niveau */}
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className={`w-14 h-14 ${opp.iconBg} rounded-2xl flex items-center justify-center text-3xl`}
                    >
                      {opp.emoji}
                    </div>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${opp.levelColor}`}
                    >
                      {opp.level}
                    </span>
                  </div>
                  {/* Titre + méta */}
                  <h3
                    className={`font-display font-bold text-lg mb-1 ${opp.textColor}`}
                  >
                    {opp.title}
                  </h3>
                  <div className="flex flex-col gap-1 text-xs text-neutral-500 mb-4">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> {opp.duration}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" /> {opp.location}
                    </span>
                  </div>
                  {/* Description */}
                  <p className="text-xs text-neutral-600 leading-relaxed flex-1 mb-5">
                    {opp.description}
                  </p>
                  {/* Compétences */}
                  <div className="space-y-2">
                    {opp.skills.slice(0, 3).map((skill) => (
                      <div
                        key={skill}
                        className="flex items-center gap-2 text-xs text-neutral-600"
                      >
                        <CheckCircle
                          className={`w-3.5 h-3.5 flex-shrink-0 ${opp.textColor}`}
                        />
                        {skill}
                      </div>
                    ))}
                    {opp.skills.length > 3 && (
                      <p className="text-xs text-neutral-400 pl-5">
                        +{opp.skills.length - 3} autres
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 3. Processus de sélection ─────────────────────────────────────── */}
        <section className="section-padding bg-white">
          <div className="container-mrjc">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-3">
                  Simple & rapide
                </p>
                <h2 className="font-display font-black text-3xl text-neutral-900 mb-6">
                  Processus de candidature en 4 étapes
                </h2>
                <p className="text-neutral-600 mb-10">
                  De votre candidature à votre première mission, comptez 2 à 3
                  semaines. Notre équipe vous accompagne à chaque étape.
                </p>
                <ol className="space-y-6">
                  {processSteps.map(({ step, icon, title, desc }) => (
                    <li key={step} className="flex items-start gap-4">
                      <div className="relative flex-shrink-0">
                        <div
                          className="w-12 h-12 bg-primary-600 text-white rounded-2xl flex items-center
                                        justify-center font-black text-sm shadow-md"
                        >
                          {step}
                        </div>
                        <div className="absolute -top-1 -right-1 text-lg">
                          {icon}
                        </div>
                      </div>
                      <div className="pt-1">
                        <p className="font-bold text-neutral-900 mb-0.5">
                          {title}
                        </p>
                        <p className="text-sm text-neutral-500">{desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Témoignages bénévoles */}
              <div className="space-y-5">
                <p className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">
                  Ils témoignent
                </p>
                {testimonials.map((t) => (
                  <div
                    key={t.name}
                    className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-neutral-200 flex-shrink-0">
                        <Image
                          src={t.photo}
                          alt={t.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-neutral-900">
                          {t.flag} {t.name}
                        </p>
                        <p className="text-xs text-neutral-500">{t.role}</p>
                      </div>
                      <span className="ml-auto text-xs font-semibold bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
                        {t.domain}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600 italic leading-relaxed">
                      "{t.quote}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. Formulaire ─────────────────────────────────────────────────── */}
        <section id="formulaire" className="section-padding">
          <div className="container-mrjc">
            <div className="grid lg:grid-cols-[1fr_380px] gap-12 items-start">
              {/* Formulaire principal */}
              <div>
                <div className="mb-10">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-3">
                    Candidature
                  </p>
                  <h2 className="font-display font-black text-3xl text-neutral-900 mb-2">
                    Rejoignez l'équipe MRJC-BÉNIN
                  </h2>
                  <p className="text-neutral-500 max-w-md">
                    Remplissez ce formulaire pour exprimer votre intérêt. Notre
                    responsable RH vous contactera dans les 7 jours ouvrés.
                  </p>
                </div>
                <VolunteerForm opportunities={volunteerOpportunities} />
              </div>

              {/* Sidebar informations */}
              <div className="space-y-5 lg:sticky lg:top-24">
                {/* Contacts clés */}
                <div className="bg-white rounded-2xl border border-neutral-100 p-6">
                  <h3 className="font-bold text-base text-neutral-900 mb-5">
                    Contacts de l'équipe RH
                  </h3>
                  <div className="space-y-4 text-sm text-neutral-600">
                    <div>
                      <p className="font-semibold text-neutral-900">
                        Marie-Louise Agossou
                      </p>
                      <p className="text-xs">
                        Responsable Bénévolat & Volontariat
                      </p>
                      <a
                        href="mailto:benevoles@mrjc-benin.org"
                        className="text-primary-600 text-xs hover:underline"
                      >
                        benevoles@mrjc-benin.org
                      </a>
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900">
                        Whatsapp RH
                      </p>
                      <a
                        href="tel:+22961000000"
                        className="text-primary-600 text-xs hover:underline"
                      >
                        +229 61 00 00 00
                      </a>
                      <p className="text-xs text-neutral-400">
                        Lun–Ven, 8h–17h WAT
                      </p>
                    </div>
                  </div>
                </div>

                {/* Infos pratiques */}
                <div className="bg-white rounded-2xl border border-neutral-100 p-6">
                  <h3 className="font-bold text-base text-neutral-900 mb-4">
                    Infos pratiques
                  </h3>
                  <div className="space-y-3 text-sm text-neutral-600">
                    {[
                      {
                        icon: "🌡️",
                        text: "Vaccins recommandés : fièvre jaune, hépatite A & B, typhoïde",
                      },
                      {
                        icon: "🛂",
                        text: "MRJC peut vous aider à obtenir un visa de volontariat",
                      },
                      {
                        icon: "🏠",
                        text: "Hébergement facilité en zone rurale (disponible selon zones)",
                      },
                      {
                        icon: "📋",
                        text: "Attestation officielle fournie en fin de mission",
                      },
                      {
                        icon: "✈️",
                        text: "Toutes nationalités bienvenues — 18 pays représentés",
                      },
                    ].map((item) => (
                      <div key={item.text} className="flex items-start gap-2.5">
                        <span className="text-base flex-shrink-0">
                          {item.icon}
                        </span>
                        <p className="text-xs leading-relaxed">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA autres opportunités */}
                <div className="bg-primary-600 rounded-2xl p-6 text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <Briefcase className="w-5 h-5 text-secondary-300" />
                    <h3 className="font-bold text-base">Postes rémunérés</h3>
                  </div>
                  <p className="text-primary-200 text-sm leading-relaxed mb-5">
                    Vous cherchez un emploi ou un stage ? Consultez nos offres
                    actuelles.
                  </p>
                  <div className="space-y-2">
                    <Link
                      href="/work-with-us/jobs"
                      className="flex items-center justify-between w-full bg-white/10 hover:bg-white/20
                                     text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
                    >
                      Offres d'emploi <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/work-with-us/internship"
                      className="flex items-center justify-between w-full bg-white/10 hover:bg-white/20
                                     text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
                    >
                      Stages & alternance <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
