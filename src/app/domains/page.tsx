import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import allDomains from "@/data/domains.json";
import type { Domain } from "@/types/domain.types";

export const metadata: Metadata = {
  title: "Nos Domaines d'Intervention | MRJC-BÉNIN",
  description:
    "Conseil agricole, santé communautaire, alphabétisation, autonomisation des femmes et intermédiation sociale — les 5 domaines d'expertise de MRJC-BÉNIN depuis 1985.",
  keywords: [
    "domaines intervention ONG",
    "agriculture Bénin",
    "santé communautaire",
    "alphabétisation",
    "femmes",
  ],
};

export default function DomainsPage() {
  const domains = allDomains as Domain[];

  return (
    <>
      <PageHeader
        tag="Nos Expertises"
        title="Domaines d'Intervention"
        subtitle="Depuis 40 ans, MRJC-BÉNIN développe une expertise multisectorielle au service des communautés rurales béninoises. Cinq domaines d'action complémentaires pour un développement holistique."
        breadcrumbs={[{ label: "Domaines d'Intervention" }]}
        image="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1920"
        align="left"
      />

      <section className="py-20 lg:py-28 bg-neutral-50">
        <div className="container-mrjc">
          {/* Intro */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="section-tag">Approche Intégrée</div>
            <h2 className="section-title mt-2">
              Une expertise transversale pour un impact durable
            </h2>
            <p className="section-subtitle">
              Nos cinq domaines d'intervention sont interdépendants et se
              renforcent mutuellement. Cette approche holistique garantit des
              changements durables dans les communautés que nous accompagnons.
            </p>
          </div>

          {/* Domaines — layout alterné */}
          <div className="space-y-16">
            {domains.map((domain, index) => (
              <article
                key={domain.id}
                className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Image */}
                <div
                  className={`relative h-80 lg:h-[400px] rounded-3xl overflow-hidden bg-neutral-100
                                 ${index % 2 === 1 ? "lg:order-2" : ""}`}
                >
                  <Image
                    src={domain.coverImage}
                    alt={domain.label}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                  {/* Badge numéro */}
                  <div
                    className={`absolute top-6 ${index % 2 === 1 ? "right-6" : "left-6"}
                                   w-14 h-14 ${domain.color.bg} rounded-2xl flex items-center
                                   justify-center text-2xl shadow-lg`}
                  >
                    {domain.icon}
                  </div>

                  {/* Stats overlay */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="grid grid-cols-2 gap-2">
                      {domain.results.slice(0, 2).map((result) => (
                        <div
                          key={result.label}
                          className="bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2.5"
                        >
                          <div className="font-display font-black text-lg text-neutral-900 leading-none">
                            {result.value}
                          </div>
                          <div className="text-xs text-neutral-600 mt-0.5 leading-tight">
                            {result.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Contenu */}
                <div
                  className={`space-y-5 ${index % 2 === 1 ? "lg:order-1" : ""}`}
                >
                  <div>
                    <div
                      className={`inline-flex items-center gap-2 text-xs font-bold uppercase
                                     tracking-widest mb-3 ${domain.color.text}`}
                    >
                      <span className={`w-6 h-0.5 ${domain.color.bg}`} />
                      Domaine {domain.order.toString().padStart(2, "0")}
                    </div>
                    <h2 className="font-display font-bold text-3xl lg:text-4xl text-neutral-900 leading-tight">
                      {domain.label}
                    </h2>
                    <p
                      className={`text-base font-semibold mt-1 ${domain.color.text}`}
                    >
                      {domain.tagline}
                    </p>
                  </div>

                  <p className="text-neutral-600 leading-relaxed">
                    {domain.description}
                  </p>

                  {/* Activités clés */}
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-neutral-900 uppercase tracking-wide">
                      Activités principales :
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {domain.keyActivities.slice(0, 4).map((activity) => (
                        <li
                          key={activity}
                          className="flex items-start gap-2 text-sm text-neutral-600"
                        >
                          <CheckCircle
                            className={`w-4 h-4 flex-shrink-0 mt-0.5 ${domain.color.text}`}
                          />
                          <span>{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Groupes cibles */}
                  <div className="flex flex-wrap gap-2">
                    {domain.targetGroups.map((group) => (
                      <span
                        key={group}
                        className={`text-xs font-medium px-3 py-1.5 rounded-full
                                        ${domain.color.light} ${domain.color.text}`}
                      >
                        {group}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/domains/${domain.slug}`}
                    className="inline-flex items-center gap-2.5 btn-primary mt-2"
                  >
                    Explorer ce domaine
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* CTA bas */}
          <div className="mt-20 bg-primary-500 rounded-3xl p-10 lg:p-14 text-center">
            <h2 className="font-display text-3xl font-bold text-white mb-4">
              Travailler ensemble sur ces thématiques ?
            </h2>
            <p className="text-primary-200 max-w-2xl mx-auto mb-8">
              MRJC-BÉNIN est ouvert aux partenariats techniques et financiers
              pour étendre l'impact de ses interventions dans ses cinq domaines
              d'expertise.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/work-with-us/collaboration"
                className="btn-secondary"
              >
                Proposer un partenariat <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/projects" className="btn-outline-white text-sm">
                Voir nos projets
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
