"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  MapPin,
  Calendar,
  Briefcase,
  Clock,
  ArrowRight,
  Send,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import { cn } from "@/lib/utils/cn";

/* ─────────────────────────────────────────────────────────────
   Données offres d'emploi
───────────────────────────────────────────────────────────── */
const jobOffers = [
  {
    id: "job-001",
    title: "Responsable Suivi-Évaluation",
    department: "Programmes",
    location: "Cotonou (avec déplacements terrain)",
    type: "CDI",
    level: "Cadre",
    deadline: "2024-08-30",
    salary: "Selon profil et grille salariale",
    status: "open",
    urgent: true,
    description:
      "Dans le cadre du renforcement de ses capacités, MRJC-BÉNIN recrute un(e) Responsable Suivi-Évaluation chargé(e) de concevoir et piloter le système de S&E des projets, de produire les rapports d'impact et d'assurer la capitalisation des expériences.",
    missions: [
      "Concevoir et mettre en œuvre le système de S&E des projets",
      "Développer les outils de collecte et d'analyse des données",
      "Former et superviser les équipes terrain sur les processus de S&E",
      "Produire les rapports d'impact périodiques pour les bailleurs",
      "Conduire les évaluations mi-parcours et finales des projets",
      "Piloter la capitalisation des expériences et leçons apprises",
    ],
    requirements: [
      "Bac+5 en développement rural, statistiques, sciences sociales ou domaine connexe",
      "Au moins 5 ans d'expérience dans le suivi-évaluation de projets de développement",
      "Maîtrise des logiciels de traitement de données (Excel, SPSS, Kobo, etc.)",
      "Connaissance des approches cadre logique et théorie du changement",
      "Excellentes capacités rédactionnelles en français",
      "Permis de conduire souhaité",
    ],
    coverImage:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600",
  },
  {
    id: "job-002",
    title: "Chargé(e) de Programme Genre & Femmes",
    department: "Programmes",
    location: "Cotonou / Parakou (bi-site)",
    type: "CDD 2 ans renouvelable",
    level: "Cadre intermédiaire",
    deadline: "2024-09-15",
    salary: "Compétitif selon grille ONG",
    status: "open",
    urgent: false,
    description:
      "MRJC-BÉNIN recherche un(e) Chargé(e) de Programme spécialisé(e) dans le genre et l'autonomisation des femmes pour coordonner ses interventions dans le département des Collines et du Borgou.",
    missions: [
      "Coordonner la mise en œuvre des activités du programme genre",
      "Animer et superviser les groupements de femmes bénéficiaires",
      "Assurer le renforcement des capacités des partenaires locaux",
      "Produire les rapports d'avancement et de résultats",
      "Contribuer à la mobilisation de ressources additionnelles",
    ],
    requirements: [
      "Bac+4/5 en genre, sciences sociales, développement ou domaine connexe",
      "Au moins 3 ans d'expérience dans des programmes genre/femmes en ONG",
      "Connaissance des approches d'autonomisation économique des femmes",
      "Capacité à travailler avec des communautés rurales",
      "Maîtrise du français ; connaissance du fon ou bariba serait un atout",
    ],
    coverImage:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600",
  },
];

/* ─────────────────────────────────────────────────────────────
   Carte emploi
───────────────────────────────────────────────────────────── */
function JobCard({ job }: { job: (typeof jobOffers)[0] }) {
  const [expanded, setExpanded] = useState(false);
  const daysLeft = Math.ceil(
    (new Date(job.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );

  return (
    <article
      className="bg-white rounded-2xl border border-neutral-200 overflow-hidden
                        hover:shadow-md transition-shadow duration-200"
    >
      {/* Header */}
      <div className="flex items-start gap-5 p-6">
        <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-neutral-100">
          <Image
            src={job.coverImage}
            alt={job.title}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 flex-wrap mb-2">
            <h2 className="font-display font-bold text-xl text-neutral-900 leading-tight">
              {job.title}
            </h2>
            {job.urgent && (
              <span className="badge badge-hot text-xs flex-shrink-0">
                Urgent
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-neutral-500">
            <span className="flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" />
              {job.department}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {job.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {job.type}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-3">
            <span
              className="text-xs bg-primary-50 text-primary-700 font-semibold
                             px-2.5 py-1 rounded-full"
            >
              {job.level}
            </span>
            <span
              className={cn(
                "text-xs font-semibold px-2.5 py-1 rounded-full",
                daysLeft > 7
                  ? "bg-neutral-50 text-neutral-600"
                  : "bg-orange-50 text-orange-600",
              )}
            >
              <Calendar className="w-3 h-3 inline mr-1" />
              Clôture :{" "}
              {new Date(job.deadline).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              {daysLeft > 0 && daysLeft <= 7 && ` (${daysLeft}j restants)`}
            </span>
          </div>
        </div>
      </div>

      {/* Description courte */}
      <div className="px-6 pb-4">
        <p className="text-sm text-neutral-600 leading-relaxed">
          {job.description}
        </p>
      </div>

      {/* Détails expandables */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          className="px-6 pb-5 space-y-5 border-t border-neutral-100 pt-5"
        >
          <div>
            <h3 className="font-bold text-neutral-900 mb-3">
              Principales missions
            </h3>
            <ul className="space-y-2">
              {job.missions.map((m) => (
                <li
                  key={m}
                  className="flex items-start gap-2 text-sm text-neutral-600"
                >
                  <CheckCircle className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                  {m}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-neutral-900 mb-3">
              Profil recherché
            </h3>
            <ul className="space-y-2">
              {job.requirements.map((r) => (
                <li
                  key={r}
                  className="flex items-start gap-2 text-sm text-neutral-600"
                >
                  <span className="w-4 h-4 text-secondary-500 font-bold flex-shrink-0 text-base leading-none">
                    •
                  </span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}

      {/* Footer */}
      <div
        className="flex items-center justify-between px-6 py-4 bg-neutral-50
                      border-t border-neutral-100"
      >
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-sm font-semibold text-neutral-600
                     hover:text-primary-600 transition-colors"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-4 h-4" /> Réduire
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" /> Voir le détail
            </>
          )}
        </button>
        <Link
          href={`/work-with-us/jobs/apply?job=${job.id}`}
          className="btn-primary text-sm"
        >
          Postuler <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
}

/* ─────────────────────────────────────────────────────────────
   Formulaire candidature spontanée
───────────────────────────────────────────────────────────── */
function SpontaneousForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    domain: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200)); // Mock API
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="font-display font-bold text-xl text-neutral-900 mb-2">
          Candidature reçue !
        </h3>
        <p className="text-neutral-500 text-sm">
          Nous reviendrons vers vous dans les meilleurs délais.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label-field">Nom complet *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
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
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input-field"
            placeholder="email@exemple.com"
          />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label-field">Téléphone</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="input-field"
            placeholder="+229 97 XX XX XX"
          />
        </div>
        <div>
          <label className="label-field">Domaine de compétence *</label>
          <select
            required
            value={form.domain}
            onChange={(e) => setForm({ ...form, domain: e.target.value })}
            className="input-field"
          >
            <option value="">Choisir un domaine</option>
            <option>Agronomie / Agriculture</option>
            <option>Santé publique / Nutrition</option>
            <option>Sciences sociales / Genre</option>
            <option>Suivi-Évaluation</option>
            <option>Finance / Comptabilité</option>
            <option>Communication</option>
            <option>Informatique / SI</option>
            <option>Autre</option>
          </select>
        </div>
      </div>
      <div>
        <label className="label-field">Message de motivation *</label>
        <textarea
          required
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="input-field resize-none"
          placeholder="Décrivez votre profil, votre motivation et vos disponibilités..."
        />
      </div>
      {status === "error" && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="w-4 h-4" /> Une erreur est survenue.
          Réessayez.
        </div>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full btn-primary justify-center disabled:opacity-60"
      >
        {status === "loading" ? (
          "Envoi en cours..."
        ) : (
          <>
            <Send className="w-4 h-4" /> Envoyer ma candidature spontanée
          </>
        )}
      </button>
    </form>
  );
}

/* ─────────────────────────────────────────────────────────────
   Page principale
───────────────────────────────────────────────────────────── */
export default function JobsPage() {
  return (
    <>
      <PageHeader
        tag="Rejoindre l'Équipe"
        title="Offres d'Emploi"
        subtitle="Nous recherchons des professionnels engagés pour renforcer notre équipe. Consultez nos postes ouverts ou envoyez une candidature spontanée."
        breadcrumbs={[
          { label: "Travailler avec Nous", href: "/work-with-us" },
          { label: "Offres d'Emploi" },
        ]}
        image="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1920"
        size="sm"
      />

      <section className="py-16 lg:py-24 bg-neutral-50">
        <div className="container-mrjc">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Offres */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-display text-2xl font-bold text-neutral-900">
                  Postes ouverts{" "}
                  <span className="text-primary-600">({jobOffers.length})</span>
                </h2>
              </div>

              {jobOffers.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}

              {/* Message si aucun poste */}
              {jobOffers.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl border border-neutral-200">
                  <Briefcase className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                  <p className="font-semibold text-neutral-500">
                    Aucun poste ouvert en ce moment
                  </p>
                  <p className="text-sm text-neutral-400 mt-1">
                    Envoyez une candidature spontanée ci-contre.
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Candidature spontanée */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                <h3 className="font-display font-bold text-xl text-neutral-900 mb-2">
                  Candidature Spontanée
                </h3>
                <p className="text-sm text-neutral-500 mb-5">
                  Votre profil ne correspond pas à une offre actuelle ?
                  Envoyez-nous votre dossier et nous vous contacterons lors de
                  prochaines ouvertures.
                </p>
                <SpontaneousForm />
              </div>

              {/* Processus recrutement */}
              <div className="bg-primary-50 rounded-2xl border border-primary-100 p-6">
                <h3 className="font-bold text-neutral-900 mb-4">
                  Notre processus
                </h3>
                <ol className="space-y-3">
                  {[
                    "Dépôt du dossier en ligne",
                    "Présélection des candidatures",
                    "Test technique écrit",
                    "Entretien RH + technique",
                    "Décision & offre de poste",
                  ].map((step, i) => (
                    <li key={step} className="flex items-center gap-3">
                      <span
                        className="w-6 h-6 bg-primary-500 text-white rounded-full flex
                                        items-center justify-center text-xs font-bold flex-shrink-0"
                      >
                        {i + 1}
                      </span>
                      <span className="text-sm text-neutral-700">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
