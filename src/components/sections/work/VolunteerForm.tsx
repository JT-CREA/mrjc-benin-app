"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, Loader2, Shield, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface VolunteerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  opportunityType: string;
  availability: string;
  duration: string;
  languages: string[];
  skills: string[];
  motivation: string;
  portfolio: string;
  linkedIn: string;
  consent: boolean;
}

const skillsList = [
  "Agriculture / Agro-écologie",
  "Santé publique / Nutrition",
  "Alphabétisation",
  "Genre & Développement",
  "Gestion de projet",
  "Comptabilité / Finance",
  "Communication / Journalisme",
  "Design graphique",
  "Développement web / IT",
  "Photographie / Vidéo",
  "Traduction / Interprétariat",
  "Droit / Juridique",
  "Formation / Pédagogie",
  "Logistique",
  "Suivi-Évaluation",
];

const languagesList = [
  "Français",
  "Anglais",
  "Portugais",
  "Fon",
  "Bariba",
  "Yoruba",
  "Autre",
];

const availabilityOptions = [
  { value: "plein-temps", label: "Temps plein (8h/jour)" },
  { value: "mi-temps", label: "Mi-temps (4h/jour)" },
  { value: "week-end", label: "Week-ends uniquement" },
  { value: "quelques-heures", label: "Quelques heures / semaine" },
];

interface Props {
  opportunities: { id: string; title: string }[];
}

export default function VolunteerForm({ opportunities }: Props) {
  const [form, setForm] = useState<VolunteerFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "Bénin",
    city: "",
    opportunityType: "terrain",
    availability: "plein-temps",
    duration: "",
    languages: ["Français"],
    skills: [],
    motivation: "",
    portfolio: "",
    linkedIn: "",
    consent: false,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof VolunteerFormData, string>>
  >({});
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [customSkill, setCsk] = useState("");

  const set = (key: keyof VolunteerFormData, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleSkill = (s: string) =>
    set(
      "skills",
      form.skills.includes(s)
        ? form.skills.filter((x) => x !== s)
        : [...form.skills, s],
    );

  const toggleLang = (l: string) =>
    set(
      "languages",
      form.languages.includes(l)
        ? form.languages.filter((x) => x !== l)
        : [...form.languages, l],
    );

  const addCustomSkill = () => {
    if (customSkill.trim() && !form.skills.includes(customSkill.trim())) {
      set("skills", [...form.skills, customSkill.trim()]);
      setCsk("");
    }
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!form.firstName.trim()) e.firstName = "Requis";
    if (!form.lastName.trim()) e.lastName = "Requis";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Email invalide";
    if (!form.city.trim()) e.city = "Requis";
    if (!form.duration.trim()) e.duration = "Requis";
    if (form.skills.length < 1)
      e.skills = "Sélectionnez au moins une compétence";
    if (form.motivation.trim().length < 30)
      e.motivation = "Minimum 30 caractères";
    if (!form.consent) e.consent = "Consentement requis";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus("loading");
    try {
      await new Promise((r) => setTimeout(r, 1500)); // Simuler API
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center"
      >
        <div
          className="w-20 h-20 bg-green-100 rounded-full flex items-center
                        justify-center mx-auto mb-5"
        >
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="font-display font-bold text-2xl text-neutral-900 mb-2">
          Candidature envoyée !
        </h3>
        <p className="text-neutral-600 leading-relaxed mb-2">
          Merci pour votre intérêt. Notre équipe RH examinera votre candidature
          et vous contactera sous 7 jours ouvrés.
        </p>
        <p className="text-sm text-neutral-500">
          Vérifiez vos spams si vous ne recevez pas notre réponse.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Type de mission */}
      <div>
        <label className="label-field">Type de mission souhaité</label>
        <div className="grid sm:grid-cols-2 gap-2">
          {opportunities.map(({ id, title }) => (
            <label
              key={id}
              className={cn(
                "flex items-center gap-2.5 p-3 rounded-xl border-2 cursor-pointer text-sm",
                "transition-all duration-200",
                form.opportunityType === id
                  ? "border-primary-500 bg-primary-50 text-primary-700 font-semibold"
                  : "border-neutral-200 bg-white text-neutral-600 hover:border-primary-300",
              )}
            >
              <input
                type="radio"
                name="opportunityType"
                value={id}
                checked={form.opportunityType === id}
                onChange={(e) => set("opportunityType", e.target.value)}
                className="sr-only"
              />
              {title}
            </label>
          ))}
        </div>
      </div>

      {/* Identité */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label-field">
            Prénom <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.firstName}
            onChange={(e) => set("firstName", e.target.value)}
            className={cn(
              "input-field",
              errors.firstName ? "border-red-400" : "",
            )}
            placeholder="Prénom"
          />
          {errors.firstName && (
            <p className="field-error">{errors.firstName}</p>
          )}
        </div>
        <div>
          <label className="label-field">
            Nom <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.lastName}
            onChange={(e) => set("lastName", e.target.value)}
            className={cn(
              "input-field",
              errors.lastName ? "border-red-400" : "",
            )}
            placeholder="Nom de famille"
          />
          {errors.lastName && <p className="field-error">{errors.lastName}</p>}
        </div>
      </div>

      {/* Contact */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label-field">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className={cn("input-field", errors.email ? "border-red-400" : "")}
            placeholder="votre@email.com"
          />
          {errors.email && <p className="field-error">{errors.email}</p>}
        </div>
        <div>
          <label className="label-field">Téléphone</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            className="input-field"
            placeholder="+229 97 000 000"
          />
        </div>
      </div>

      {/* Localisation */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label-field">Pays de résidence</label>
          <input
            type="text"
            value={form.country}
            onChange={(e) => set("country", e.target.value)}
            className="input-field"
            placeholder="Bénin"
          />
        </div>
        <div>
          <label className="label-field">
            Ville <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.city}
            onChange={(e) => set("city", e.target.value)}
            className={cn("input-field", errors.city ? "border-red-400" : "")}
            placeholder="Cotonou, Porto-Novo..."
          />
          {errors.city && <p className="field-error">{errors.city}</p>}
        </div>
      </div>

      {/* Disponibilité */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label-field">Disponibilité</label>
          <select
            value={form.availability}
            onChange={(e) => set("availability", e.target.value)}
            className="input-field"
          >
            {availabilityOptions.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-field">
            Durée envisagée <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.duration}
            onChange={(e) => set("duration", e.target.value)}
            className={cn(
              "input-field",
              errors.duration ? "border-red-400" : "",
            )}
            placeholder="Ex: 3 mois, 1 an..."
          />
          {errors.duration && <p className="field-error">{errors.duration}</p>}
        </div>
      </div>

      {/* Langues */}
      <div>
        <label className="label-field">Langues maîtrisées</label>
        <div className="flex flex-wrap gap-2">
          {languagesList.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => toggleLang(lang)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-semibold border-2 transition-all",
                form.languages.includes(lang)
                  ? "bg-primary-500 text-white border-primary-500"
                  : "bg-white text-neutral-600 border-neutral-200 hover:border-primary-300",
              )}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Compétences */}
      <div>
        <label className="label-field">
          Compétences <span className="text-red-500">*</span>
          <span className="ml-1 text-xs text-neutral-400 normal-case font-normal">
            (sélectionnez au moins 1)
          </span>
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {skillsList.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => toggleSkill(skill)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-medium border transition-all",
                form.skills.includes(skill)
                  ? "bg-secondary-500 text-white border-secondary-500"
                  : "bg-white text-neutral-600 border-neutral-200 hover:border-secondary-300",
              )}
            >
              {form.skills.includes(skill) ? "✓ " : ""}
              {skill}
            </button>
          ))}
        </div>
        {/* Ajouter compétence personnalisée */}
        <div className="flex gap-2">
          <input
            type="text"
            value={customSkill}
            onChange={(e) => setCsk(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustomSkill();
              }
            }}
            placeholder="Autre compétence..."
            className="input-field flex-1 text-sm py-2"
          />
          <button
            type="button"
            onClick={addCustomSkill}
            className="w-9 h-9 bg-primary-500 text-white rounded-xl flex items-center
                             justify-center hover:bg-primary-600 transition-colors flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {form.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {form.skills.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1.5 text-xs
                                       bg-secondary-50 text-secondary-700 border border-secondary-200
                                       px-2.5 py-1 rounded-full"
              >
                {s}
                <button
                  type="button"
                  onClick={() => toggleSkill(s)}
                  className="hover:text-red-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        {errors.skills && <p className="field-error mt-1">{errors.skills}</p>}
      </div>

      {/* Motivation */}
      <div>
        <label className="label-field">
          Lettre de motivation <span className="text-red-500">*</span>
        </label>
        <textarea
          value={form.motivation}
          rows={5}
          onChange={(e) => set("motivation", e.target.value)}
          placeholder="Expliquez votre motivation, votre expérience pertinente et ce que vous pouvez apporter à MRJC-BÉNIN... (min. 30 caractères)"
          className={cn(
            "input-field resize-y min-h-[120px]",
            errors.motivation ? "border-red-400" : "",
          )}
        />
        <div className="flex justify-between mt-1">
          {errors.motivation ? (
            <p className="field-error">{errors.motivation}</p>
          ) : (
            <span />
          )}
          <span
            className={cn(
              "text-xs",
              form.motivation.length < 30
                ? "text-neutral-400"
                : "text-green-600",
            )}
          >
            {form.motivation.length} car.
          </span>
        </div>
      </div>

      {/* Liens */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label-field">LinkedIn ou CV en ligne</label>
          <input
            type="url"
            value={form.linkedIn}
            onChange={(e) => set("linkedIn", e.target.value)}
            className="input-field"
            placeholder="https://linkedin.com/in/..."
          />
        </div>
        <div>
          <label className="label-field">Portfolio / Site web</label>
          <input
            type="url"
            value={form.portfolio}
            onChange={(e) => set("portfolio", e.target.value)}
            className="input-field"
            placeholder="https://..."
          />
        </div>
      </div>

      {/* Consentement */}
      <label
        className={cn(
          "flex items-start gap-3 cursor-pointer",
          errors.consent ? "text-red-600" : "text-neutral-600",
        )}
      >
        <input
          type="checkbox"
          checked={form.consent}
          onChange={(e) => set("consent", e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded border-neutral-300 text-primary-500 cursor-pointer"
        />
        <span className="text-sm leading-relaxed">
          J'accepte que MRJC-BÉNIN traite mes données pour examiner ma
          candidature.{" "}
          <a
            href="/privacy-policy"
            className="text-primary-600 hover:underline font-medium"
          >
            Politique de confidentialité
          </a>
          . <span className="text-red-500">*</span>
        </span>
      </label>
      {errors.consent && <p className="field-error -mt-4">{errors.consent}</p>}

      {/* RGPD note */}
      <div className="flex items-start gap-2 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
        <Shield className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-neutral-500 leading-relaxed">
          Vos données seront conservées 12 mois maximum puis supprimées si
          aucune suite n'est donnée.
        </p>
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full btn-primary py-4 text-base justify-center
                         disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" /> Envoi en cours...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" /> Soumettre ma candidature
          </>
        )}
      </button>
    </form>
  );
}
