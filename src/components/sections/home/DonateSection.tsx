"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ArrowRight, HandCoins, Users, TreePine } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

const donationImpacts = [
  {
    amount: "5 000",
    currency: "FCFA",
    impact: "Finance un kit d'intrants agricoles pour un producteur",
    icon: TreePine,
    color: "bg-primary-50 border-primary-200 text-primary-600",
  },
  {
    amount: "25 000",
    currency: "FCFA",
    impact: "Permet la formation d'une femme en alphabétisation fonctionnelle",
    icon: Users,
    color: "bg-secondary-50 border-secondary-200 text-secondary-600",
  },
  {
    amount: "100 000",
    currency: "FCFA",
    impact:
      "Finance une session de formation de 20 agents de santé communautaires",
    icon: HandCoins,
    color: "bg-accent-50 border-accent-200 text-accent-600",
  },
];

export default function DonateSection() {
  const { ref, isVisible } = useIntersectionObserver<HTMLElement>({
    threshold: 0.1,
  });

  return (
    <section
      ref={ref}
      className="py-20 lg:py-28 bg-primary-50 border-y border-primary-100"
      aria-labelledby="donate-heading"
    >
      <div className="container-mrjc">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Texte */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="section-tag justify-start">
              Soutenir Notre Mission
            </div>
            <h2
              id="donate-heading"
              className="font-display text-3xl lg:text-4xl font-bold text-neutral-900
                           mt-2 mb-4 leading-tight"
            >
              Votre don change une vie au Bénin
            </h2>
            <p className="text-neutral-600 leading-relaxed mb-6">
              Chaque contribution, quelle que soit son montant, amplifie notre
              capacité à accompagner les communautés rurales béninoises vers
              plus d'autonomie, de dignité et de développement.
            </p>
            <p className="text-neutral-600 leading-relaxed mb-8">
              MRJC-BÉNIN utilise vos dons avec rigueur et transparence.
              <strong className="text-primary-700"> 90% des fonds</strong> vont
              directement aux projets et bénéficiaires.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/donate" className="btn-primary">
                <Heart className="w-4 h-4" />
                Faire un don
              </Link>
              <Link href="/about/organization" className="btn-outline">
                Notre transparence financière
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Cartes d'impact */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <p className="text-sm font-semibold text-neutral-600 uppercase tracking-wider mb-5">
              Ce que votre don finance concrètement :
            </p>

            {donationImpacts.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className={`flex items-start gap-4 p-5 bg-white rounded-2xl border-2
                              ${item.color.split(" ")[1]} ${item.color.split(" ")[2]}
                              hover:shadow-md transition-all duration-200`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center
                                   flex-shrink-0 ${item.color.split(" ")[0]}`}
                  >
                    <Icon className={`w-6 h-6 ${item.color.split(" ")[2]}`} />
                  </div>
                  <div>
                    <div className="font-display font-bold text-xl text-neutral-900 mb-1">
                      {item.amount}{" "}
                      <span className="text-sm font-semibold">
                        {item.currency}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      {item.impact}
                    </p>
                  </div>
                </motion.div>
              );
            })}

            {/* Note transparence */}
            <div
              className="flex items-center gap-3 p-4 bg-primary-100 rounded-xl
                            border border-primary-200"
            >
              <span className="text-xl flex-shrink-0">🔒</span>
              <p className="text-xs text-primary-700 leading-relaxed">
                <strong>Don sécurisé et transparent.</strong> MRJC-BÉNIN publie
                annuellement ses comptes financiers audités.{" "}
                <Link
                  href="/resources/annual-reports"
                  className="underline hover:no-underline"
                >
                  Voir nos rapports annuels
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
