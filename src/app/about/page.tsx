import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Target, Diamond, Building2 } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Nous Connaître",
  description:
    "Découvrez l'histoire, la vision, les valeurs et l'organisation de MRJC-BÉNIN, ONG béninoise engagée dans le développement rural depuis 1985.",
};

const subPages = [
  {
    href: "/about/history",
    icon: BookOpen,
    label: "Histoire & Genèse",
    description:
      "L'aventure MRJC-BÉNIN depuis sa fondation en 1985 jusqu'à aujourd'hui. Une frise chronologique interactive de 4 décennies d'engagement.",
    color: "bg-primary-500",
    image: "https://images.unsplash.com/photo-1461360228754-6e81c478b882?w=600",
  },
  {
    href: "/about/vision-mission",
    icon: Target,
    label: "Vision & Mission",
    description:
      "Notre raison d'être, nos ambitions à long terme et la mission qui guide chacune de nos interventions au quotidien.",
    color: "bg-secondary-500",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600",
  },
  {
    href: "/about/values",
    icon: Diamond,
    label: "Valeurs & Principes",
    description:
      "Les fondements éthiques et les principes directeurs qui orientent nos actions et définissent notre identité institutionnelle.",
    color: "bg-accent-500",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600",
  },
  {
    href: "/about/organization",
    icon: Building2,
    label: "Notre Organisation",
    description:
      "Gouvernance, structure organisationnelle, équipe dirigeante et conseil d'administration de MRJC-BÉNIN.",
    color: "bg-purple-600",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        tag="Qui Sommes-Nous"
        title="Nous Connaître"
        subtitle="Depuis 1985, MRJC-BÉNIN accompagne les communautés rurales du Bénin vers l'autonomie et la dignité. Découvrez notre histoire, notre vision et notre équipe."
        breadcrumbs={[{ label: "Nous Connaître" }]}
        image="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1920"
        align="left"
      />

      <section className="py-20 lg:py-28 bg-neutral-50">
        <div className="container-mrjc">
          {/* Intro */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="section-tag">Notre Identité</div>
            <h2 className="section-title mt-2">
              Une ONG enracinée, une mission claire
            </h2>
            <p className="section-subtitle">
              Mouvement Rural de Jeunesse Chrétienne du Bénin — fondé sur des
              valeurs humanistes et animé par une volonté de transformation
              sociale durable.
            </p>
          </div>

          {/* Cartes sous-pages */}
          <div className="grid md:grid-cols-2 gap-6">
            {subPages.map((page) => {
              const Icon = page.icon;
              return (
                <Link
                  key={page.href}
                  href={page.href}
                  className="group card overflow-hidden flex flex-col sm:flex-row"
                >
                  {/* Image */}
                  <div className="relative sm:w-48 h-48 sm:h-auto flex-shrink-0 overflow-hidden bg-neutral-100">
                    <Image
                      src={page.image}
                      alt={page.label}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="192px"
                    />
                    <div className="absolute inset-0 bg-primary-900/30" />
                    <div
                      className={`absolute top-4 left-4 w-10 h-10 ${page.color}
                                    rounded-xl flex items-center justify-center`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className="p-6 flex flex-col justify-between flex-1">
                    <div>
                      <h3
                        className="font-display font-bold text-xl text-neutral-900 mb-2
                                     group-hover:text-primary-700 transition-colors"
                      >
                        {page.label}
                      </h3>
                      <p className="text-sm text-neutral-500 leading-relaxed">
                        {page.description}
                      </p>
                    </div>
                    <div
                      className="flex items-center gap-2 mt-4 text-sm font-semibold
                                    text-primary-600 group-hover:gap-3 transition-all"
                    >
                      Découvrir
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Chiffres rapides */}
          <div className="mt-16 bg-primary-500 rounded-3xl p-8 lg:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: "1985", label: "Année de fondation" },
                { value: "33", label: "Membres fondateurs" },
                { value: "12", label: "Départements touchés" },
                { value: "85 000+", label: "Bénéficiaires cumulés" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="font-display text-4xl font-black text-white mb-1">
                    {s.value}
                  </div>
                  <div className="text-primary-200 text-sm">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
