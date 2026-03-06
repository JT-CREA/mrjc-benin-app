"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Handshake,
  ArrowRight,
  Send,
  CheckCircle,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { cn } from "@/lib/utils/cn";

const partnerTypes = [
  {
    type: "Bailleur de fonds",
    icon: "💰",
    description:
      "Co-financez nos projets et contribuez à l'impact sur les communautés rurales béninoises.",
    examples: [
      "Agences bilatérales",
      "Fonds multilatéraux",
      "Fondations privées",
      "Entreprises mécènes",
    ],
    color: "border-primary-200 hover:border-primary-400",
    iconBg: "bg-primary-50",
  },
  {
    type: "Partenaire technique",
    icon: "🔧",
    description:
      "Apportez votre expertise thématique (agriculture, santé, genre, éducation) à nos équipes terrain.",
    examples: [
      "ONG spécialisées",
      "Centres de recherche",
      "Universités",
      "Bureaux d'études",
    ],
    color: "border-accent-200 hover:border-accent-400",
    iconBg: "bg-accent-50",
  },
  {
    type: "Institution publique",
    icon: "🏛️",
    description:
      "Collaborez avec nous pour aligner nos interventions aux politiques de développement nationales.",
    examples: [
      "Ministères sectoriels",
      "Mairies et communes",
      "Agences nationales",
      "Collectivités locales",
    ],
    color: "border-secondary-200 hover:border-secondary-400",
    iconBg: "bg-secondary-50",
  },
  {
    type: "ONG & Société civile",
    icon: "🤝",
    description:
      "Construisons ensemble des consortiums plus forts pour répondre aux appels à projets.",
    examples: [
      "ONG nationales",
      "ONG internationales",
      "Associations locales",
      "Réseaux thématiques",
    ],
    color: "border-purple-200 hover:border-purple-400",
    iconBg: "bg-purple-50",
  },
];

const partnershipModalities = [
  { label: "Co-financement de projet", icon: "💼" },
  { label: "Exécution de sous-contrat", icon: "📋" },
  { label: "Consortium sur appel à projets", icon: "🎯" },
  { label: "Partage d'expertise technique", icon: "🔬" },
  { label: "Échange de données et résultats", icon: "📊" },
  { label: "Formation / Renforcement de capacités", icon: "📚" },
];

function ContactForm() {
  const [form, setForm] = useState({
    org: "",
    name: "",
    email: "",
    type: "",
    domain: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          subject: `Partenariat — ${form.org}`,
          type: "partnership",
        }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-10"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="font-display font-bold text-xl text-neutral-900 mb-2">
          Message reçu !
        </h3>
        <p className="text-neutral-500 text-sm max-w-sm mx-auto">
          Notre équipe partenariat vous contactera sous 5 jours ouvrables pour
          étudier ensemble les modalités de collaboration.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="label-field">Organisation *</label>
        <input
          type="text"
          required
          value={form.org}
          onChange={(e) => update("org", e.target.value)}
          className="input-field"
          placeholder="Nom de votre organisation"
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label-field">Votre nom *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="input-field"
            placeholder="Prénom Nom"
          />
        </div>
        <div>
          <label className="label-field">Email *</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="input-field"
            placeholder="nom@org.com"
          />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label-field">Type de partenariat *</label>
          <select
            required
            value={form.type}
            onChange={(e) => update("type", e.target.value)}
            className="input-field"
          >
            <option value="">Sélectionner</option>
            <option>Co-financement</option>
            <option>Partenariat technique</option>
            <option>Consortium</option>
            <option>Formation</option>
            <option>Autre</option>
          </select>
        </div>
        <div>
          <label className="label-field">Domaine thématique</label>
          <select
            value={form.domain}
            onChange={(e) => update("domain", e.target.value)}
            className="input-field"
          >
            <option value="">Sélectionner</option>
            <option>Conseil Agricole</option>
            <option>Santé / Nutrition</option>
            <option>Alphabétisation</option>
            <option>Genre / Femmes</option>
            <option>Gouvernance</option>
            <option>Transversal</option>
          </select>
        </div>
      </div>
      <div>
        <label className="label-field">
          Présentation de votre proposition *
        </label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          className="input-field resize-none"
          placeholder="Décrivez votre organisation, la nature du partenariat envisagé, les ressources disponibles et le calendrier souhaité..."
        />
      </div>
      {status === "error" && (
        <p className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="w-4 h-4" /> Erreur d'envoi. Réessayez.
        </p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full btn-primary justify-center disabled:opacity-60"
      >
        {status === "loading" ? (
          "Envoi..."
        ) : (
          <>
            <Send className="w-4 h-4" /> Soumettre ma proposition
          </>
        )}
      </button>
    </form>
  );
}

export default function CollaborationPage() {
  return (
    <>
      <PageHeader
        tag="Partenariats Stratégiques"
        title="Collaborer avec MRJC-BÉNIN"
        subtitle="Fort de 40 ans d'expérience terrain et de 35 partenaires actifs, MRJC-BÉNIN est un partenaire de référence pour le développement rural au Bénin."
        breadcrumbs={[
          { label: "Travailler avec Nous", href: "/work-with-us" },
          { label: "Partenariat" },
        ]}
        image="https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1920"
        size="sm"
      />

      <section className="py-16 lg:py-24 bg-neutral-50">
        <div className="container-mrjc">
          <div className="grid lg:grid-cols-5 gap-10">
            {/* Contenu principal */}
            <div className="lg:col-span-3 space-y-12">
              {/* Types de partenariat */}
              <div>
                <div className="section-tag justify-start mb-4">
                  Formes de Partenariat
                </div>
                <h2 className="font-display text-2xl font-bold text-neutral-900 mb-6">
                  Quatre modèles de collaboration
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {partnerTypes.map((pt) => (
                    <div
                      key={pt.type}
                      className={cn(
                        "bg-white rounded-2xl border-2 p-5 transition-all duration-200",
                        pt.color,
                      )}
                    >
                      <div
                        className={`w-10 h-10 ${pt.iconBg} rounded-xl flex items-center
                                       justify-center text-xl mb-3`}
                      >
                        {pt.icon}
                      </div>
                      <h3 className="font-bold text-neutral-900 mb-2">
                        {pt.type}
                      </h3>
                      <p className="text-sm text-neutral-500 mb-3 leading-relaxed">
                        {pt.description}
                      </p>
                      <ul className="space-y-1">
                        {pt.examples.map((ex) => (
                          <li
                            key={ex}
                            className="flex items-center gap-1.5 text-xs text-neutral-500"
                          >
                            <ChevronRight className="w-3 h-3 flex-shrink-0 text-neutral-300" />
                            {ex}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modalités */}
              <div>
                <h2 className="font-display text-2xl font-bold text-neutral-900 mb-4">
                  Modalités de collaboration
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {partnershipModalities.map((m) => (
                    <div
                      key={m.label}
                      className="flex items-center gap-3 bg-white rounded-xl border
                                    border-neutral-200 px-4 py-3"
                    >
                      <span className="text-xl">{m.icon}</span>
                      <span className="text-sm font-medium text-neutral-700">
                        {m.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Partenaires actuels */}
              <div className="bg-primary-900 rounded-2xl p-8 text-white">
                <h3 className="font-display text-xl font-bold mb-2">
                  35+ partenaires actifs
                </h3>
                <p className="text-primary-200 text-sm mb-6">
                  MRJC-BÉNIN collabore avec des organisations des Nations Unies,
                  des agences de coopération bilatérale, des fondations et des
                  ONG nationales et internationales.
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    "Union Européenne",
                    "UNICEF",
                    "AFD",
                    "ONU Femmes",
                    "DDC",
                    "MAEP",
                  ].map((p) => (
                    <div
                      key={p}
                      className="bg-white/10 rounded-xl px-3 py-2 text-center
                                             text-xs font-semibold text-white/80"
                    >
                      {p}
                    </div>
                  ))}
                </div>
                <Link
                  href="/partners"
                  className="inline-flex items-center gap-2 mt-5
                                                    text-sm font-semibold text-secondary-400
                                                    hover:text-secondary-300 transition-colors"
                >
                  Voir tous nos partenaires{" "}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Formulaire sidebar */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 bg-white rounded-2xl border border-neutral-200 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-10 h-10 bg-primary-50 rounded-xl flex items-center
                                   justify-center"
                  >
                    <Handshake className="w-5 h-5 text-primary-600" />
                  </div>
                  <h2 className="font-display font-bold text-xl text-neutral-900">
                    Proposer un partenariat
                  </h2>
                </div>
                <p className="text-sm text-neutral-500 mb-6 leading-relaxed">
                  Remplissez ce formulaire et notre équipe vous contactera dans
                  les 5 jours ouvrables.
                </p>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
