"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

const values = [
  {
    id: "dignity",
    icon: "🕊️",
    label: "Dignité Humaine",
    color: "bg-primary-500",
    lightColor: "bg-primary-50",
    borderColor: "border-primary-200",
    textColor: "text-primary-700",
    short: "Chaque personne mérite respect et considération, sans exception.",
    description:
      "Nous affirmons la dignité intrinsèque de chaque être humain, quelle que soit sa situation socioéconomique, son genre, son appartenance ethnique ou religieuse. Toutes nos interventions partent du principe que les bénéficiaires sont des acteurs capables et dignes, non des assistés passifs.",
    applications: [
      "Approche participative dans tous les programmes",
      "Respect des savoirs locaux et traditions positives",
      "Refus de toute discrimination dans nos activités",
      "Communication respectueuse et non condescendante",
    ],
  },
  {
    id: "solidarity",
    icon: "🤝",
    label: "Solidarité",
    color: "bg-secondary-500",
    lightColor: "bg-secondary-50",
    borderColor: "border-secondary-200",
    textColor: "text-secondary-700",
    short: "Ensemble, nous sommes plus forts. La solidarité est notre moteur.",
    description:
      "La solidarité est au cœur de notre identité. Nous croyons que les changements les plus durables émergent de l'action collective et de la mutualisation des forces. Nous favorisons les dynamiques de groupe, les coopératives et les organisations communautaires.",
    applications: [
      "Promotion des groupements et coopératives",
      "Entraide entre communautés partenaires",
      "Partage de ressources et d'expériences",
      "Soutien aux plus vulnérables en priorité",
    ],
  },
  {
    id: "integrity",
    icon: "💎",
    label: "Intégrité & Transparence",
    color: "bg-accent-500",
    lightColor: "bg-accent-50",
    borderColor: "border-accent-200",
    textColor: "text-accent-700",
    short:
      "Nous faisons ce que nous disons, et nous disons ce que nous faisons.",
    description:
      "L'intégrité est notre engagement fondamental envers nos bénéficiaires, nos partenaires et le public. Nous gérons les ressources avec rigueur et publions annuellement des comptes audités. La confiance que nous accordent nos partenaires est notre bien le plus précieux.",
    applications: [
      "Publication annuelle des rapports financiers audités",
      "Procédures claires de passation de marchés",
      "Politique de tolérance zéro envers la corruption",
      "Reporting transparent envers tous les bailleurs",
    ],
  },
  {
    id: "equity",
    icon: "⚖️",
    label: "Équité & Genre",
    color: "bg-purple-600",
    lightColor: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-700",
    short: "L'égalité des chances comme condition du développement.",
    description:
      "Nous œuvrons activement pour l'équité entre femmes et hommes, entre générations et entre groupes sociaux. Chaque programme intègre une analyse genre et des mesures correctrices pour garantir un accès équitable aux opportunités et aux bénéfices.",
    applications: [
      "Analyse genre obligatoire dans chaque projet",
      "Quota minimum de 40% de femmes dans les formations",
      "Leadership féminin promu en interne et sur le terrain",
      "Approche intergénérationnelle dans nos programmes",
    ],
  },
  {
    id: "sustainability",
    icon: "🌱",
    label: "Durabilité",
    color: "bg-emerald-600",
    lightColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    textColor: "text-emerald-700",
    short: "Des résultats qui perdurent bien au-delà de nos interventions.",
    description:
      "Nous concevons nos programmes pour qu'ils génèrent des changements durables, capables de se perpétuer sans notre présence. Cela implique un fort accent sur le renforcement des capacités locales, la gouvernance communautaire et la prise en compte des enjeux climatiques.",
    applications: [
      "Plan de pérennisation dans chaque projet",
      "Formation de leaders et formateurs locaux",
      "Intégration de l'agro-écologie dans les pratiques agricoles",
      "Documentation et diffusion des bonnes pratiques",
    ],
  },
  {
    id: "innovation",
    icon: "💡",
    label: "Innovation",
    color: "bg-orange-500",
    lightColor: "bg-orange-50",
    borderColor: "border-orange-200",
    textColor: "text-orange-700",
    short:
      "Toujours chercher de meilleures façons de servir nos bénéficiaires.",
    description:
      "Nous valorisons l'expérimentation, l'apprentissage continu et l'adaptation. Nous ne sommes pas prisonniers de nos habitudes. Nous testons de nouvelles approches, tirons les leçons de nos échecs et partageons nos expériences avec l'ensemble de l'écosystème du développement.",
    applications: [
      "Revues régulières et adaptation des programmes",
      "Systèmes de collecte de données numériques",
      "Partenariats avec universités et centres de recherche",
      "Culture institutionnelle de l'apprentissage",
    ],
  },
];

function ValueCard({
  value,
  index,
  isVisible,
}: {
  value: (typeof values)[0];
  index: number;
  isVisible: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.09 }}
    >
      <button
        onClick={() => setOpen(!open)}
        className={`w-full text-left bg-white rounded-2xl border-2 p-6 transition-all duration-300
                    hover:shadow-lg hover:-translate-y-0.5
                    ${open ? `${value.borderColor} shadow-lg` : "border-neutral-100"}`}
        aria-expanded={open}
      >
        <div className="flex items-start gap-4">
          <div
            className={`w-14 h-14 ${value.color} rounded-2xl flex items-center justify-center
                           text-2xl flex-shrink-0 transition-transform duration-300
                           ${open ? "scale-110" : ""}`}
          >
            {value.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className={`font-display font-bold text-lg leading-snug mb-1 transition-colors
                            ${open ? value.textColor : "text-neutral-900"}`}
            >
              {value.label}
            </h3>
            <p className="text-sm text-neutral-500 leading-relaxed">
              {value.short}
            </p>
          </div>
          <motion.span
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.2 }}
            className={`text-2xl flex-shrink-0 ${open ? value.textColor : "text-neutral-300"}`}
          >
            +
          </motion.span>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className={`mt-5 pt-5 border-t ${value.borderColor}`}>
                <p className="text-sm text-neutral-600 leading-relaxed mb-4">
                  {value.description}
                </p>
                <div className={`${value.lightColor} rounded-xl p-4`}>
                  <p
                    className={`text-xs font-bold ${value.textColor} uppercase tracking-wider mb-3`}
                  >
                    Comment cela se traduit concrètement :
                  </p>
                  <ul className="space-y-2">
                    {value.applications.map((app, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-neutral-700"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${value.color} mt-1.5 flex-shrink-0`}
                        />
                        {app}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  );
}

export default function ValuesPage() {
  const { ref, isVisible } = useIntersectionObserver<HTMLElement>({
    threshold: 0.05,
  });
  return (
    <>
      <PageHeader
        tag="Ce Qui Nous Définit"
        title="Valeurs & Principes"
        subtitle="Six valeurs fondamentales qui ne sont pas de simples mots sur papier, mais des engagements vécus au quotidien par chaque membre de l'équipe MRJC-BÉNIN."
        breadcrumbs={[
          { label: "Nous Connaître", href: "/about" },
          { label: "Valeurs & Principes" },
        ]}
        image="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920"
      />
      <section ref={ref} className="py-20 lg:py-28 bg-neutral-50">
        <div className="container-mrjc">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            className="section-header"
          >
            <div className="section-tag">Nos Engagements</div>
            <h2 className="section-title">
              Des valeurs incarnées, pas déclarées
            </h2>
            <p className="section-subtitle">
              Cliquez sur chaque valeur pour découvrir comment elle se traduit
              concrètement dans notre action.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <ValueCard
                key={value.id}
                value={value}
                index={index}
                isVisible={isVisible}
              />
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6 }}
            className="mt-16 text-center bg-white rounded-3xl border border-neutral-100 p-10 max-w-3xl mx-auto"
          >
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="font-display font-bold text-2xl text-neutral-900 mb-3">
              Ces valeurs vous parlent ?
            </h3>
            <p className="text-neutral-500 mb-6 leading-relaxed">
              Si vous partagez ces convictions et souhaitez contribuer à notre
              mission, de nombreuses façons de s'engager existent — bénévolat,
              partenariat, don ou emploi.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/work-with-us" className="btn-primary">
                Nous rejoindre <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="btn-outline">
                Nous contacter
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
