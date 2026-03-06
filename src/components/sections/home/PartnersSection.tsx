"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import partners from "@/data/partners.json";

/* ─────────────────────────────────────────────────────────────
   Logo partenaire individuel — avec fallback texte si pas de logo
───────────────────────────────────────────────────────────── */
function PartnerLogo({ partner }: { partner: (typeof partners)[0] }) {
  const hasLogo = partner.logo && partner.logo.trim() !== "";

  /* Générer les initiales pour le fallback */
  const initials = partner.name
    .split(" ")
    .filter((w) => w.length > 2)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  return (
    <div
      className="flex-shrink-0 w-40 h-16 mx-5 flex items-center justify-center
                 bg-white rounded-xl border border-neutral-200 px-4
                 grayscale hover:grayscale-0 opacity-70 hover:opacity-100
                 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
      title={partner.name}
    >
      {hasLogo ? (
        <Image
          src={partner.logo}
          alt={partner.name}
          width={120}
          height={40}
          className="object-contain max-h-10"
          unoptimized
          onError={(e) => {
            /* Si l'image échoue à charger, masquer et afficher le fallback */
            const target = e.currentTarget as HTMLImageElement;
            target.style.display = "none";
            const fallback = target.nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = "flex";
          }}
        />
      ) : null}
      {/* Fallback toujours présent, masqué si logo existe */}
      <div
        className="items-center justify-center text-center"
        style={{ display: hasLogo ? "none" : "flex", flexDirection: "column" }}
      >
        <span className="text-sm font-bold text-primary-700 leading-tight text-center px-1">
          {partner.name.length > 20
            ? initials || partner.name.slice(0, 6).toUpperCase()
            : partner.name}
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Section principale
───────────────────────────────────────────────────────────── */
export default function PartnersSection() {
  const { ref, isVisible } = useIntersectionObserver<HTMLElement>({
    threshold: 0.1,
  });
  const featuredPartners = partners.filter((p) => p.featured);
  /* Dupliquer pour boucle infinie fluide */
  const allPartners = [
    ...featuredPartners,
    ...featuredPartners,
    ...featuredPartners,
  ];

  /* Groupes par catégorie pour la section stats */
  const byCategory = partners.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <section
      ref={ref}
      className="py-20 lg:py-24 bg-white border-t border-neutral-100"
      aria-labelledby="partners-heading"
    >
      <div className="container-mrjc">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="section-tag">Nos Partenaires</div>
          <h2 id="partners-heading" className="section-title">
            Ils nous font confiance
          </h2>
          <p className="section-subtitle">
            MRJC-BÉNIN bénéficie du soutien de partenaires techniques et
            financiers engagés pour le développement durable du Bénin.
          </p>
        </motion.div>

        {/* Stats partenaires */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {[
            {
              label: "Bailleurs de fonds",
              value: byCategory["bailleur"] || 0,
              icon: "💰",
            },
            {
              label: "Agences Nations Unies",
              value: byCategory["agence-onu"] || 0,
              icon: "🌍",
            },
            {
              label: "Partenaires Gouvernement",
              value: byCategory["gouvernement"] || 0,
              icon: "🏛️",
            },
            { label: "Total Partenaires", value: partners.length, icon: "🤝" },
          ].map((item) => (
            <div
              key={item.label}
              className="text-center bg-neutral-50 rounded-2xl p-5 border border-neutral-100"
            >
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="font-display font-bold text-3xl text-primary-600 mb-1">
                {item.value}+
              </div>
              <div className="text-xs text-neutral-500 leading-snug">
                {item.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Défilement partenaires — pleine largeur ── */}
      {featuredPartners.length > 0 && (
        <div
          className="relative overflow-hidden py-4"
          aria-label="Logos des partenaires"
          onMouseEnter={(e) => {
            const inner = e.currentTarget.querySelector(
              ".partner-track",
            ) as HTMLElement;
            if (inner) inner.style.animationPlayState = "paused";
          }}
          onMouseLeave={(e) => {
            const inner = e.currentTarget.querySelector(
              ".partner-track",
            ) as HTMLElement;
            if (inner) inner.style.animationPlayState = "running";
          }}
        >
          {/* Masques bords */}
          <div
            className="absolute left-0 top-0 bottom-0 w-24 bg-white z-10 pointer-events-none"
            style={{
              maskImage: "linear-gradient(to right, white, transparent)",
            }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-24 bg-white z-10 pointer-events-none"
            style={{
              maskImage: "linear-gradient(to left, white, transparent)",
            }}
          />

          <div
            className="partner-track flex items-center"
            style={{ animation: "ticker 30s linear infinite" }}
          >
            {allPartners.map((partner, index) => (
              <PartnerLogo key={`${partner.id}-${index}`} partner={partner} />
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="container-mrjc mt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link href="/partners" className="btn-outline">
            Tous nos partenaires
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/work-with-us/collaboration" className="btn-primary">
            Devenir partenaire
            <ExternalLink className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
