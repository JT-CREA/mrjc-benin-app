"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, AlertCircle, Shield, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organization: string;
  subject: string;
  type: string;
  message: string;
  consent: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const contactTypes = [
  { id: "general", label: "Information générale", icon: "💬" },
  { id: "partnership", label: "Partenariat / Collaboration", icon: "🤝" },
  { id: "media", label: "Presse & Médias", icon: "📰" },
  { id: "donation", label: "Don & Financement", icon: "💝" },
  { id: "employment", label: "Emploi / Stage", icon: "💼" },
  { id: "other", label: "Autre", icon: "📩" },
];

const initialData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  organization: "",
  subject: "",
  type: "general",
  message: "",
  consent: false,
};

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.firstName.trim()) errors.firstName = "Prénom requis.";
  if (!data.lastName.trim()) errors.lastName = "Nom requis.";
  if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = "Adresse email invalide.";
  if (!data.subject.trim()) errors.subject = "Sujet requis.";
  if (!data.message.trim() || data.message.length < 20)
    errors.message = "Le message doit faire au moins 20 caractères.";
  if (!data.consent)
    errors.consent = "Vous devez accepter la politique de confidentialité.";
  return errors;
}

export default function ContactForm() {
  const [form, setForm] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [serverMsg, setMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setForm((prev) => ({ ...prev, [name]: newValue }));
    // Clear error on change
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = Object.keys(form).reduce(
      (acc, k) => ({ ...acc, [k]: true }),
      {},
    );
    setTouched(allTouched);

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${form.firstName} ${form.lastName}`,
          email: form.email,
          phone: form.phone,
          organization: form.organization,
          subject: form.subject,
          message: form.message,
          type: form.type,
        }),
      });

      if (res.ok) {
        setStatus("success");
        setForm(initialData);
        setTouched({});
        setErrors({});
      } else {
        const data = await res.json().catch(() => ({}));
        if (data.errors) setErrors(data.errors);
        setStatus("error");
        setMsg(data.error || "Erreur lors de l'envoi. Veuillez réessayer.");
      }
    } catch {
      setStatus("error");
      setMsg("Impossible de contacter le serveur. Vérifiez votre connexion.");
    }
  };

  /* Champ helpers */
  const fieldError = (name: string) =>
    touched[name] && errors[name] ? errors[name] : undefined;

  const inputClass = (name: string) =>
    cn(
      "input-field",
      fieldError(name)
        ? "border-red-400 focus:ring-red-200 focus:border-red-400"
        : "",
    );

  /* ── Succès ── */
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
          Message envoyé !
        </h3>
        <p className="text-neutral-600 leading-relaxed mb-6">
          Merci pour votre message. Notre équipe vous répondra dans les 48
          heures ouvrées.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="btn-outline text-sm"
        >
          Envoyer un autre message
        </button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5"
      aria-label="Formulaire de contact"
    >
      {/* Erreur serveur */}
      <AnimatePresence>
        {status === "error" && serverMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4"
            role="alert"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700">{serverMsg}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Type de demande */}
      <div>
        <label className="label-field">Type de demande</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {contactTypes.map(({ id, label, icon }) => (
            <label
              key={id}
              className={cn(
                "flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer text-sm",
                "transition-all duration-200",
                form.type === id
                  ? "border-primary-500 bg-primary-50 text-primary-700 font-semibold"
                  : "border-neutral-200 bg-white text-neutral-600 hover:border-primary-200",
              )}
            >
              <input
                type="radio"
                name="type"
                value={id}
                checked={form.type === id}
                onChange={handleChange}
                className="sr-only"
              />
              <span>{icon}</span>
              <span className="truncate text-xs">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Prénom + Nom */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="cf-firstName" className="label-field">
            Prénom <span className="text-red-500">*</span>
          </label>
          <input
            id="cf-firstName"
            name="firstName"
            type="text"
            value={form.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Jean"
            autoComplete="given-name"
            className={inputClass("firstName")}
            aria-describedby={
              fieldError("firstName") ? "err-firstName" : undefined
            }
          />
          {fieldError("firstName") && (
            <p id="err-firstName" className="field-error">
              {fieldError("firstName")}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="cf-lastName" className="label-field">
            Nom <span className="text-red-500">*</span>
          </label>
          <input
            id="cf-lastName"
            name="lastName"
            type="text"
            value={form.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Dupont"
            autoComplete="family-name"
            className={inputClass("lastName")}
          />
          {fieldError("lastName") && (
            <p className="field-error">{fieldError("lastName")}</p>
          )}
        </div>
      </div>

      {/* Email + Téléphone */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="cf-email" className="label-field">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="cf-email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="votre@email.com"
            autoComplete="email"
            className={inputClass("email")}
          />
          {fieldError("email") && (
            <p className="field-error">{fieldError("email")}</p>
          )}
        </div>
        <div>
          <label htmlFor="cf-phone" className="label-field">
            Téléphone{" "}
            <span className="text-neutral-400 text-xs">(optionnel)</span>
          </label>
          <input
            id="cf-phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="+229 97 000 000"
            autoComplete="tel"
            className="input-field"
          />
        </div>
      </div>

      {/* Organisation */}
      <div>
        <label htmlFor="cf-org" className="label-field">
          Organisation / Structure{" "}
          <span className="text-neutral-400 text-xs">(optionnel)</span>
        </label>
        <input
          id="cf-org"
          name="organization"
          type="text"
          value={form.organization}
          onChange={handleChange}
          placeholder="Nom de votre ONG, entreprise ou institution"
          className="input-field"
          autoComplete="organization"
        />
      </div>

      {/* Sujet */}
      <div>
        <label htmlFor="cf-subject" className="label-field">
          Sujet <span className="text-red-500">*</span>
        </label>
        <input
          id="cf-subject"
          name="subject"
          type="text"
          value={form.subject}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Objet de votre message..."
          className={inputClass("subject")}
        />
        {fieldError("subject") && (
          <p className="field-error">{fieldError("subject")}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="cf-message" className="label-field">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="cf-message"
          name="message"
          value={form.message}
          onChange={handleChange}
          onBlur={handleBlur}
          rows={5}
          placeholder="Décrivez votre demande en détail... (minimum 20 caractères)"
          className={cn(inputClass("message"), "resize-y min-h-[120px]")}
        />
        <div className="flex items-center justify-between mt-1">
          {fieldError("message") ? (
            <p className="field-error">{fieldError("message")}</p>
          ) : (
            <span />
          )}
          <span
            className={cn(
              "text-xs",
              form.message.length < 20 ? "text-neutral-400" : "text-green-600",
            )}
          >
            {form.message.length} / 5000
          </span>
        </div>
      </div>

      {/* Consentement RGPD */}
      <div>
        <label
          className={cn(
            "flex items-start gap-3 cursor-pointer group",
            fieldError("consent") ? "text-red-600" : "text-neutral-600",
          )}
        >
          <input
            type="checkbox"
            name="consent"
            checked={form.consent}
            onChange={handleChange}
            onBlur={handleBlur}
            className="mt-0.5 w-4 h-4 rounded border-neutral-300 text-primary-500
                       focus:ring-primary-300 cursor-pointer"
          />
          <span className="text-sm leading-relaxed">
            J'accepte que MRJC-BÉNIN traite mes données personnelles pour
            répondre à ma demande, conformément à la{" "}
            <a
              href="/privacy-policy"
              target="_blank"
              className="text-primary-600 hover:underline font-medium"
            >
              politique de confidentialité
            </a>
            . <span className="text-red-500">*</span>
          </span>
        </label>
        {fieldError("consent") && (
          <p className="field-error mt-1">{fieldError("consent")}</p>
        )}
      </div>

      {/* Anti-spam honeypot */}
      <input
        type="text"
        name="_honeypot"
        style={{ display: "none" }}
        tabIndex={-1}
      />

      {/* RGPD info */}
      <div className="flex items-start gap-2.5 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
        <Shield className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-neutral-500 leading-relaxed">
          Vos données sont traitées uniquement pour traiter votre demande.
          Aucune donnée n'est transmise à des tiers à des fins commerciales.
          Conformément au RGPD, vous pouvez exercer vos droits en écrivant à{" "}
          <a
            href="mailto:dpo@mrjc-benin.org"
            className="text-primary-600 hover:underline"
          >
            dpo@mrjc-benin.org
          </a>
          .
        </p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full btn-primary py-4 text-base justify-center
                   disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Envoi en cours...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Envoyer le message
          </>
        )}
      </button>
    </form>
  );
}
