"use client";

import React, { useState } from "react";
import {
  GraduationCap,
  BookOpen,
  Clock,
  CheckCircle,
  Send,
  AlertCircle,
} from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";

const internshipTypes = [
  {
    type: "Stage de fin d'études",
    duration: "3 à 6 mois",
    level: "Bac+4 / Bac+5",
    icon: GraduationCap,
    description:
      "Pour les étudiants en Master ou équivalent souhaitant réaliser leur stage de fin d'études dans un contexte ONG de développement rural.",
    domains: [
      "Développement rural",
      "Agronomie",
      "Sciences sociales",
      "Santé publique",
      "Genre",
      "Suivi-Évaluation",
    ],
  },
  {
    type: "Stage de recherche / Thèse",
    duration: "3 à 12 mois",
    level: "Master 2 / Doctorat",
    icon: BookOpen,
    description:
      "Pour les chercheurs et doctorants souhaitant réaliser des travaux de terrain sur les thématiques du développement rural béninois.",
    domains: [
      "Agriculture durable",
      "Nutrition et santé",
      "Genre et développement",
      "Gouvernance locale",
      "Entrepreneuriat rural",
    ],
  },
];

function InternshipForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    school: "",
    type: "",
    startDate: "",
    duration: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success")
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="font-display font-bold text-xl text-neutral-900 mb-2">
          Candidature reçue !
        </h3>
        <p className="text-neutral-500 text-sm">
          Nous vous répondrons sous 10 jours ouvrables.
        </p>
      </div>
    );

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label-field">Nom complet *</label>
          <input
            type="text"
            required
            className="input-field"
            placeholder="Prénom Nom"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label className="label-field">Email *</label>
          <input
            type="email"
            required
            className="input-field"
            placeholder="email@etudiant.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
      </div>
      <div>
        <label className="label-field">Établissement *</label>
        <input
          type="text"
          required
          className="input-field"
          placeholder="Nom de votre université / grande école"
          value={form.school}
          onChange={(e) => setForm({ ...form, school: e.target.value })}
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label-field">Type de stage *</label>
          <select
            required
            className="input-field"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="">Choisir</option>
            <option>Stage de fin d'études</option>
            <option>Stage de recherche</option>
            <option>Thèse de doctorat</option>
          </select>
        </div>
        <div>
          <label className="label-field">Date de début souhaitée</label>
          <input
            type="date"
            className="input-field"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          />
        </div>
      </div>
      <div>
        <label className="label-field">Présentation et sujet *</label>
        <textarea
          rows={5}
          required
          className="input-field resize-none"
          placeholder="Décrivez votre profil académique, le sujet de votre stage/thèse et vos attentes..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
      </div>
      {status === "error" && (
        <p className="text-sm text-red-600 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> Erreur d'envoi.
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
            <Send className="w-4 h-4" /> Envoyer ma candidature
          </>
        )}
      </button>
    </form>
  );
}

export default function InternshipPage() {
  return (
    <>
      <PageHeader
        tag="Stages & Recherche"
        title="Stages & Thèses"
        subtitle="MRJC-BÉNIN accueille chaque année une douzaine de stagiaires et chercheurs pour enrichir nos équipes tout en offrant une expérience terrain de qualité."
        breadcrumbs={[
          { label: "Travailler avec Nous", href: "/work-with-us" },
          { label: "Stages & Thèses" },
        ]}
        image="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1920"
        size="sm"
      />

      <section className="py-16 lg:py-24 bg-neutral-50">
        <div className="container-mrjc">
          <div className="grid lg:grid-cols-5 gap-10">
            <div className="lg:col-span-3 space-y-10">
              {/* Types de stages */}
              <div>
                <h2 className="font-display text-2xl font-bold text-neutral-900 mb-6">
                  Opportunités disponibles
                </h2>
                <div className="space-y-5">
                  {internshipTypes.map((it) => {
                    const Icon = it.icon;
                    return (
                      <div
                        key={it.type}
                        className="bg-white rounded-2xl border border-neutral-200 p-6"
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className="w-12 h-12 bg-primary-50 rounded-xl flex items-center
                                           justify-center flex-shrink-0"
                          >
                            <Icon className="w-6 h-6 text-primary-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center flex-wrap gap-2 mb-2">
                              <h3 className="font-bold text-neutral-900">
                                {it.type}
                              </h3>
                              <span
                                className="text-xs bg-neutral-100 text-neutral-600
                                               px-2 py-0.5 rounded-full"
                              >
                                {it.level}
                              </span>
                              <span className="flex items-center gap-1 text-xs text-neutral-500">
                                <Clock className="w-3 h-3" /> {it.duration}
                              </span>
                            </div>
                            <p className="text-sm text-neutral-600 leading-relaxed mb-3">
                              {it.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {it.domains.map((d) => (
                                <span
                                  key={d}
                                  className="text-xs bg-primary-50 text-primary-700
                                                          px-2 py-1 rounded-full font-medium"
                                >
                                  {d}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ce que nous offrons */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                <h3 className="font-bold text-neutral-900 mb-4">
                  Ce que MRJC-BÉNIN vous offre
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    {
                      icon: "🏡",
                      text: "Accueil et intégration dans l'équipe",
                    },
                    {
                      icon: "👨‍💼",
                      text: "Encadrement par un professionnel senior",
                    },
                    {
                      icon: "🌍",
                      text: "Missions terrain dans les zones d'intervention",
                    },
                    {
                      icon: "📊",
                      text: "Accès à nos données et bases de suivi",
                    },
                    {
                      icon: "📄",
                      text: "Lettre de recommandation en fin de stage",
                    },
                    {
                      icon: "🤝",
                      text: "Intégration dans notre réseau professionnel",
                    },
                  ].map((item) => (
                    <div key={item.text} className="flex items-start gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <span className="text-sm text-neutral-700">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <p className="text-sm text-amber-800">
                    <strong>Note :</strong> Les stages ne sont pas rémunérés
                    mais une indemnité transport mensuelle est versée selon
                    disponibilité budgétaire.
                  </p>
                </div>
              </div>
            </div>

            {/* Formulaire */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 bg-white rounded-2xl border border-neutral-200 p-6">
                <h2 className="font-display font-bold text-xl text-neutral-900 mb-2">
                  Candidater
                </h2>
                <p className="text-sm text-neutral-500 mb-6">
                  Envoyez votre dossier et nous étudierons votre candidature
                  avec attention.
                </p>
                <InternshipForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
