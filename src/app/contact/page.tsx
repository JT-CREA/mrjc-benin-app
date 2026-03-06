"use client";

/**
 * Page — Contact (v2 — React Hook Form + Zod + Leaflet)
 * Route: /contact
 */

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  Building2,
  Shield,
  CheckCircle2,
  AlertCircle,
  Globe2,
  ArrowRight,
} from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { siteConfig } from "@/config/site.config";
import { cn } from "@/lib/utils/cn";

const MapComponent = dynamic(() => import("@/components/ui/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-2xl">
      <Globe2 className="w-8 h-8 text-gray-400 animate-pulse" />
    </div>
  ),
});

// ─── Schéma Zod ───────────────────────────────────────────────────────────────
const contactSchema = z.object({
  name: z.string().min(2, "Minimum 2 caractères").max(100),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  organization: z.string().optional(),
  type: z.enum(["general", "partnership", "media", "recruitment", "other"]),
  subject: z.string().min(5, "Minimum 5 caractères"),
  message: z.string().min(20, "Minimum 20 caractères").max(2000),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Consentement requis" }),
  }),
});

type FormData = z.infer<typeof contactSchema>;

const CONTACT_TYPES = [
  { id: "general" as const, label: "Information générale", icon: "💬" },
  { id: "partnership" as const, label: "Partenariat", icon: "🤝" },
  { id: "media" as const, label: "Presse / Médias", icon: "📰" },
  { id: "recruitment" as const, label: "Recrutement / Stage", icon: "💼" },
  { id: "other" as const, label: "Autre demande", icon: "📋" },
];

const CONTACT_INFO = [
  {
    icon: MapPin,
    title: "Adresse",
    lines: ["BP XXXX, Cotonou", "République du Bénin"],
    color: "text-primary-600 bg-primary-50",
  },
  {
    icon: Phone,
    title: "Téléphone",
    lines: [siteConfig.contact.phoneBureau, siteConfig.contact.phone],
    color: "text-blue-600 bg-blue-50",
  },
  {
    icon: Mail,
    title: "Email",
    lines: [siteConfig.contact.email, siteConfig.contact.emailInfo],
    color: "text-green-600 bg-green-50",
  },
  {
    icon: Clock,
    title: "Horaires",
    lines: ["Lun — Ven : 8h00 — 17h00", "Sam : 8h00 — 12h00"],
    color: "text-orange-600 bg-orange-50",
  },
];

function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { type: "general" },
  });
  const selectedType = watch("type");

  async function onSubmit(data: FormData) {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      toast.success("Message envoyé ! Nous vous répondrons sous 48h.");
      reset();
    } catch {
      toast.error("Erreur d'envoi. Contactez-nous par téléphone.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label-field">Nom complet *</label>
          <input
            type="text"
            {...register("name")}
            placeholder="Votre nom"
            className={cn("input-field", errors.name && "border-red-400")}
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.name.message}
            </p>
          )}
        </div>
        <div>
          <label className="label-field">Email *</label>
          <input
            type="email"
            {...register("email")}
            placeholder="votre@email.com"
            className={cn("input-field", errors.email && "border-red-400")}
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.email.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label-field">Téléphone</label>
          <input
            type="tel"
            {...register("phone")}
            placeholder="+229 97 XX XX XX"
            className="input-field"
          />
        </div>
        <div>
          <label className="label-field">Organisation</label>
          <input
            type="text"
            {...register("organization")}
            placeholder="Votre organisation"
            className="input-field"
          />
        </div>
      </div>
      <div>
        <label className="label-field">Type de demande *</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
          {CONTACT_TYPES.map((t) => (
            <label
              key={t.id}
              className={cn(
                "flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all text-sm",
                selectedType === t.id
                  ? "border-primary-500 bg-primary-50 text-primary-700 font-medium"
                  : "border-gray-200 text-gray-600 hover:border-gray-300",
              )}
            >
              <input
                type="radio"
                value={t.id}
                {...register("type")}
                className="sr-only"
              />
              <span>{t.icon}</span>
              <span className="leading-tight">{t.label}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <label className="label-field">Sujet *</label>
        <input
          type="text"
          {...register("subject")}
          placeholder="Objet de votre message"
          className={cn("input-field", errors.subject && "border-red-400")}
        />
        {errors.subject && (
          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.subject.message}
          </p>
        )}
      </div>
      <div>
        <label className="label-field">Message *</label>
        <textarea
          {...register("message")}
          rows={5}
          placeholder="Décrivez votre demande..."
          className={cn(
            "input-field resize-none",
            errors.message && "border-red-400",
          )}
        />
        {errors.message && (
          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.message.message}
          </p>
        )}
      </div>
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          {...register("consent")}
          className="mt-0.5 rounded border-gray-300 text-primary-600"
        />
        <span className="text-sm text-gray-600">
          J'accepte la{" "}
          <Link
            href="/privacy-policy"
            className="text-primary-600 hover:underline"
          >
            Politique de Confidentialité
          </Link>{" "}
          de MRJC-BÉNIN. *
        </span>
      </label>
      {errors.consent && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {errors.consent.message}
        </p>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          "w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl font-semibold text-sm transition-all shadow-md",
          isSubmitting
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-primary-600 hover:bg-primary-700 text-white hover:shadow-lg",
        )}
      >
        {isSubmitting ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Envoi...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Envoyer le message
          </>
        )}
      </button>
      <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1">
        <Shield className="w-3 h-3" /> Données protégées — jamais cédées à des
        tiers
      </p>
    </form>
  );
}

export default function ContactPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      <PageHeader
        title="Contactez-nous"
        subtitle="Notre équipe est à votre écoute pour toute demande d'information ou de partenariat"
        breadcrumbs={[{ label: "Accueil", href: "/" }, { label: "Contact" }]}
      />
      <section className="section-mrjc bg-white">
        <div className="container-mrjc">
          <div className="grid lg:grid-cols-5 gap-10">
            {/* Colonne gauche */}
            <div className="lg:col-span-2 space-y-5">
              <div className="h-64 rounded-2xl overflow-hidden shadow-md border border-gray-100">
                {mounted && (
                  <MapComponent
                    lat={siteConfig.contact.mapCoordinates.lat}
                    lng={siteConfig.contact.mapCoordinates.lng}
                    popupText="MRJC-BÉNIN — Cotonou"
                  />
                )}
              </div>
              <div className="bg-gray-50 rounded-2xl p-5 space-y-4 border border-gray-100">
                {CONTACT_INFO.map((info) => (
                  <div key={info.title} className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 ${info.color} rounded-xl flex items-center justify-center shrink-0`}
                    >
                      <info.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {info.title}
                      </p>
                      {info.lines.map((l) => (
                        <p key={l} className="text-sm text-gray-800">
                          {l}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <a
                href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/\D/g, "")}?text=Bonjour+MRJC-BÉNIN`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-3 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-xl font-semibold text-sm transition-all shadow-md"
              >
                <MessageSquare className="w-5 h-5" /> Contacter via WhatsApp
              </a>
              <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-100 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-green-800">
                    Délai de réponse
                  </p>
                  <p className="text-xs text-green-700 mt-0.5">
                    Réponse garantie sous 48h ouvrables.
                  </p>
                </div>
              </div>
            </div>
            {/* Colonne formulaire */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
                <h2 className="text-2xl font-bold font-display text-gray-900 mb-1">
                  Envoyez-nous un message
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  Champs marqués * sont obligatoires
                </p>
                <ContactForm />
              </div>
              <div className="mt-5 p-5 bg-primary-50 rounded-2xl border border-primary-100">
                <p className="font-semibold text-primary-900 mb-3 text-sm">
                  Vous souhaitez nous rejoindre ?
                </p>
                <div className="flex flex-wrap gap-4">
                  {[
                    {
                      href: "/work-with-us/jobs",
                      icon: Building2,
                      label: "Offres d'emploi",
                    },
                    {
                      href: "/work-with-us/volunteer",
                      icon: Shield,
                      label: "Bénévolat",
                    },
                    {
                      href: "/work-with-us/collaboration",
                      icon: Globe2,
                      label: "Partenariat",
                    },
                  ].map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="flex items-center gap-1.5 text-sm text-primary-700 hover:text-primary-900 font-medium transition-colors"
                    >
                      <l.icon className="w-4 h-4" />
                      {l.label} <ArrowRight className="w-3 h-3" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
