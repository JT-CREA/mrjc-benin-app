import type { Metadata } from "next";
import { Target, Eye, Compass, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Vision & Mission",
  description:
    "La vision à long terme et la mission quotidienne de MRJC-BÉNIN pour le développement rural durable au Bénin.",
};

const strategicAxes = [
  {
    num: "01",
    title: "Renforcement des capacités",
    description:
      "Former, outiller et accompagner les acteurs ruraux pour qu'ils deviennent les premiers agents de leur propre développement.",
    icon: "🎓",
  },
  {
    num: "02",
    title: "Autonomisation économique",
    description:
      "Créer les conditions d'un accès durable aux opportunités économiques, à la microfinance et aux marchés pour les populations vulnérables.",
    icon: "💼",
  },
  {
    num: "03",
    title: "Égalité de genre",
    description:
      "Promouvoir activement l'égalité entre femmes et hommes dans tous nos programmes et notre fonctionnement interne.",
    icon: "⚖️",
  },
  {
    num: "04",
    title: "Développement durable",
    description:
      "Intégrer les dimensions environnementales et climatiques dans toutes nos interventions pour garantir leur pérennité.",
    icon: "🌱",
  },
  {
    num: "05",
    title: "Gouvernance participative",
    description:
      "Placer les communautés bénéficiaires au cœur des décisions qui les concernent, en favorisant leur participation active.",
    icon: "🤝",
  },
  {
    num: "06",
    title: "Plaidoyer & influence",
    description:
      "Faire entendre la voix des communautés rurales auprès des décideurs pour améliorer les politiques publiques de développement.",
    icon: "📢",
  },
];

const vision2030Goals = [
  "250 000 bénéficiaires cumulés d'ici 2030",
  "Présence renforcée dans les 12 départements",
  "30% de projets financés sur fonds propres et mobilisation locale",
  "Certification qualité ISO pour nos processus de gestion",
  "Réseau de 500 jeunes leaders ruraux formés",
  "Résilience climatique intégrée dans 100% des projets agricoles",
];

export default function VisionMissionPage() {
  return (
    <>
      <PageHeader
        tag="Notre Boussole"
        title="Vision & Mission"
        subtitle="Ce qui nous anime chaque jour et ce vers quoi nous tendons collectivement. Deux concepts indissociables qui guident chacune de nos actions sur le terrain."
        breadcrumbs={[
          { label: "Nous Connaître", href: "/about" },
          { label: "Vision & Mission" },
        ]}
        image="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920"
      />

      <div className="py-20 lg:py-28 bg-white">
        <div className="container-mrjc space-y-24">
          {/* Vision */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div
                className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center
                              justify-center mb-6"
              >
                <Eye className="w-8 h-8 text-primary-600" />
              </div>
              <div className="section-tag justify-start">Notre Vision</div>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-neutral-900 mt-3 mb-6">
                Un Bénin rural autonome, digne et prospère
              </h2>
              <div
                className="text-lg text-neutral-600 leading-relaxed border-l-4
                              border-secondary-500 pl-6 italic mb-6"
              >
                "Nous rêvons d'un Bénin rural où chaque communauté dispose des
                capacités, des ressources et des opportunités nécessaires pour
                construire son propre avenir, dans la dignité, l'équité et la
                durabilité."
              </div>
              <p className="text-neutral-600 leading-relaxed">
                Cette vision guide notre horizon 2030 : un Bénin où les
                communautés rurales ne sont plus des objets de développement,
                mais des sujets actifs capables de se prendre en main
                collectivement. Un Bénin où la jeunesse rurale trouve des
                opportunités à la mesure de ses ambitions, sans devoir fuir vers
                les villes.
              </p>
            </div>

            <div className="bg-primary-50 rounded-3xl p-8 border border-primary-100">
              <h3 className="font-display font-bold text-xl text-neutral-900 mb-6">
                Objectifs Vision 2030
              </h3>
              <ul className="space-y-3">
                {vision2030Goals.map((goal, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-neutral-700 leading-relaxed">
                      {goal}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/impact"
                className="btn-outline w-full justify-center mt-6 text-sm"
              >
                Voir notre tableau de bord
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Mission */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    label: "Accompagner",
                    desc: "Être aux côtés des communautés à chaque étape",
                    color: "bg-primary-500",
                  },
                  {
                    label: "Former",
                    desc: "Transmettre les savoirs et les savoir-faire",
                    color: "bg-secondary-500",
                  },
                  {
                    label: "Outiller",
                    desc: "Donner les moyens de l'autonomie",
                    color: "bg-accent-500",
                  },
                  {
                    label: "Connecter",
                    desc: "Créer des ponts entre acteurs et marchés",
                    color: "bg-purple-600",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-white rounded-2xl border border-neutral-100 p-5
                                  hover:shadow-md transition-all hover:-translate-y-0.5"
                  >
                    <div
                      className={`w-10 h-10 ${item.color} rounded-xl flex items-center
                                     justify-center text-white font-bold text-sm mb-3`}
                    >
                      {item.label[0]}
                    </div>
                    <div className="font-bold text-neutral-900 text-base mb-1">
                      {item.label}
                    </div>
                    <div className="text-xs text-neutral-500 leading-relaxed">
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div
                className="w-16 h-16 bg-secondary-100 rounded-2xl flex items-center
                              justify-center mb-6"
              >
                <Target className="w-8 h-8 text-secondary-600" />
              </div>
              <div className="section-tag justify-start">Notre Mission</div>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-neutral-900 mt-3 mb-6">
                Accompagner les porteurs de changement rural
              </h2>
              <p className="text-neutral-600 leading-relaxed mb-4">
                MRJC-BÉNIN a pour mission d'accompagner les communautés rurales
                du Bénin — femmes, jeunes, agriculteurs, organisations paysannes
                — dans leur processus d'autonomisation et de développement
                durable.
              </p>
              <p className="text-neutral-600 leading-relaxed mb-4">
                Nous le faisons à travers cinq domaines d'expertise
                complémentaires : le conseil agricole et l'entrepreneuriat
                rural, la santé communautaire et la nutrition, l'alphabétisation
                et l'éducation, l'autonomisation des femmes, et l'intermédiation
                sociale.
              </p>
              <p className="text-neutral-600 leading-relaxed">
                Notre approche est holistique, participative et ancrée dans les
                réalités locales. Nous croyons que le développement durable ne
                peut venir que de l'intérieur des communautés elles-mêmes.
              </p>
            </div>
          </div>

          {/* Axes stratégiques */}
          <div>
            <div className="text-center mb-12">
              <div className="section-tag">Plan Stratégique 2021–2030</div>
              <h2 className="section-title mt-2">Nos axes stratégiques</h2>
              <p className="section-subtitle">
                Six orientations majeures qui structurent notre action et
                guident nos choix programmatiques.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {strategicAxes.map((ax) => (
                <div
                  key={ax.num}
                  className="bg-white rounded-2xl border border-neutral-100 p-6
                                hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <span className="text-3xl">{ax.icon}</span>
                    <span className="font-display font-black text-4xl text-neutral-100 leading-none">
                      {ax.num}
                    </span>
                  </div>
                  <h3
                    className="font-display font-bold text-lg text-neutral-900 mb-2
                                 group-hover:text-primary-700 transition-colors"
                  >
                    {ax.title}
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">
                    {ax.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-primary-900 rounded-3xl p-10 lg:p-14 text-center">
            <Compass className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
            <h2 className="font-display text-3xl font-bold text-white mb-4">
              Partagez notre vision ?
            </h2>
            <p className="text-primary-200 max-w-xl mx-auto mb-8 leading-relaxed">
              Rejoignez-nous en tant que bénévole, partenaire ou volontaire et
              contribuez à construire le Bénin rural de demain.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/work-with-us" className="btn-secondary">
                Nous rejoindre <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="btn-outline-white">
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
