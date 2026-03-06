"use client";

/**
 * Composant — JobApplicationForm
 * Formulaire de candidature en ligne pour une offre d'emploi.
 * Appelle POST /api/recruitment
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, Loader2, CheckCircle2, AlertCircle, Upload } from "lucide-react";

/* ─── Schéma ─────────────────────────────────────────────────────────────── */
const schema = z.object({
  firstName: z.string().min(2, "Prénom requis (min 2 caractères)").max(100),
  lastName: z.string().min(2, "Nom requis").max(100),
  email: z.string().email("Email invalide"),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-().]{8,20}$/, "Numéro invalide")
    .optional()
    .or(z.literal("")),
  linkedin: z.string().url("URL invalide").optional().or(z.literal("")),
  cvUrl: z.string().url("URL CV invalide").optional().or(z.literal("")),
  coverLetter: z
    .string()
    .min(100, "Lettre trop courte (min 100 caractères)")
    .max(5000),
  availability: z.string().max(200).optional(),
  gdprConsent: z.literal<boolean>(true, {
    errorMap: () => ({ message: "Consentement requis." }),
  }),
  website: z.string().max(0).optional(), // honeypot
});

type FormData = z.infer<typeof schema>;

interface JobApplicationFormProps {
  jobId: string;
  jobTitle: string;
}

export default function JobApplicationForm({
  jobId,
  jobTitle,
}: JobApplicationFormProps) {
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { gdprConsent: false as unknown as true },
  });

  const coverLetter = watch("coverLetter") ?? "";

  async function onSubmit(data: FormData) {
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/recruitment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          jobId,
          jobTitle,
          type: "emploi",
        }),
      });
      const json = (await res.json()) as { message?: string; error?: string };
      if (!res.ok) {
        setErrorMsg(json.error ?? "Une erreur est survenue.");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setErrorMsg("Erreur réseau. Veuillez réessayer.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Candidature envoyée !
        </h3>
        <p className="text-gray-600 text-sm max-w-md mx-auto">
          Notre équipe RH examinera votre dossier dans les 5 à 10 jours ouvrés.
          Vous recevrez un email de confirmation.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* Honeypot */}
      <input
        type="text"
        {...register("website")}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      {/* Nom */}
      <div className="grid sm:grid-cols-2 gap-4">
        <FieldWrapper label="Prénom *" error={errors.firstName?.message}>
          <input
            {...register("firstName")}
            placeholder="Votre prénom"
            className={inputClass(!!errors.firstName)}
          />
        </FieldWrapper>
        <FieldWrapper label="Nom *" error={errors.lastName?.message}>
          <input
            {...register("lastName")}
            placeholder="Votre nom"
            className={inputClass(!!errors.lastName)}
          />
        </FieldWrapper>
      </div>

      {/* Contact */}
      <div className="grid sm:grid-cols-2 gap-4">
        <FieldWrapper label="Email *" error={errors.email?.message}>
          <input
            {...register("email")}
            type="email"
            placeholder="vous@exemple.com"
            className={inputClass(!!errors.email)}
          />
        </FieldWrapper>
        <FieldWrapper label="Téléphone" error={errors.phone?.message}>
          <input
            {...register("phone")}
            type="tel"
            placeholder="+229 97 XX XX XX"
            className={inputClass(!!errors.phone)}
          />
        </FieldWrapper>
      </div>

      {/* LinkedIn + CV */}
      <div className="grid sm:grid-cols-2 gap-4">
        <FieldWrapper label="Profil LinkedIn" error={errors.linkedin?.message}>
          <input
            {...register("linkedin")}
            type="url"
            placeholder="https://linkedin.com/in/..."
            className={inputClass(!!errors.linkedin)}
          />
        </FieldWrapper>
        <FieldWrapper
          label="URL de votre CV (Google Drive, Dropbox...)"
          error={errors.cvUrl?.message}
        >
          <div className="relative">
            <Upload className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              {...register("cvUrl")}
              type="url"
              placeholder="https://..."
              className={`${inputClass(!!errors.cvUrl)} pl-9`}
            />
          </div>
        </FieldWrapper>
      </div>

      {/* Lettre de motivation */}
      <FieldWrapper
        label={`Lettre de motivation * (${coverLetter.length}/5000)`}
        error={errors.coverLetter?.message}
      >
        <textarea
          {...register("coverLetter")}
          rows={8}
          placeholder="Présentez-vous, vos motivations pour rejoindre MRJC-BÉNIN et vos expériences pertinentes..."
          className={`${inputClass(!!errors.coverLetter)} resize-none`}
        />
        {coverLetter.length < 100 && coverLetter.length > 0 && (
          <p className="text-xs text-orange-500 mt-1">
            Encore {100 - coverLetter.length} caractères minimum
          </p>
        )}
      </FieldWrapper>

      {/* Disponibilité */}
      <FieldWrapper label="Disponibilité" error={errors.availability?.message}>
        <input
          {...register("availability")}
          placeholder="Ex: Immédiate / À partir du 1er juin 2025"
          className={inputClass(!!errors.availability)}
        />
      </FieldWrapper>

      {/* RGPD */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register("gdprConsent")}
            className="mt-1 w-4 h-4 rounded accent-primary-600 shrink-0"
          />
          <span className="text-xs text-gray-600 leading-relaxed">
            * J&apos;accepte que mes données personnelles soient traitées par
            MRJC-BÉNIN dans le cadre de cette candidature, conformément à notre{" "}
            <a
              href="/privacy-policy"
              className="text-primary-600 underline"
              target="_blank"
            >
              politique de confidentialité
            </a>
            . Ces données seront conservées pendant 12 mois maximum.
          </span>
        </label>
        {errors.gdprConsent && (
          <p className="text-red-500 text-xs mt-2">
            {errors.gdprConsent.message}
          </p>
        )}
      </div>

      {/* Erreur globale */}
      {status === "error" && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* Bouton */}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-6 rounded-xl transition-colors text-sm"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Envoi en cours...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" /> Envoyer ma candidature
          </>
        )}
      </button>
    </form>
  );
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function inputClass(hasError: boolean) {
  return `w-full px-3.5 py-2.5 border rounded-xl text-sm outline-none transition-colors ${
    hasError
      ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-1 focus:ring-red-300"
      : "border-gray-200 bg-white focus:border-primary-400 focus:ring-1 focus:ring-primary-200"
  }`;
}

function FieldWrapper({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
