import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  ArrowLeft,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react";
import { siteConfig } from "@/config/site.config";

export const metadata: Metadata = {
  title: `Message envoyé | ${siteConfig.name}`,
  robots: { index: false, follow: false },
};

export default function ContactSuccessPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Icône succès */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-green-400 opacity-25" />
            <div className="relative w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
          </div>
        </div>

        <h1 className="font-display text-3xl font-bold text-gray-900 mb-3">
          Message bien reçu !
        </h1>
        <p className="text-gray-600 leading-relaxed mb-8">
          Merci de nous avoir contacté. Notre équipe vous répondra dans un délai
          de{" "}
          <strong className="text-primary-700">24 à 48 heures ouvrables</strong>
          .
        </p>

        {/* Référence */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-8">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
            Réponse attendue
          </p>
          <p className="text-lg font-semibold text-primary-700">
            1–2 jours ouvrables
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Vérifiez également vos spams si vous ne recevez pas de réponse.
          </p>
        </div>

        {/* Contacts alternatifs */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            {
              icon: Phone,
              label: "Téléphone",
              value: siteConfig.contact.phone,
              href: `tel:${siteConfig.contact.phone}`,
              color: "bg-blue-50 text-blue-600",
            },
            {
              icon: MessageCircle,
              label: "WhatsApp",
              value: "Chat direct",
              href: `https://wa.me/${siteConfig.contact.whatsapp?.replace(/\D/g, "")}`,
              color: "bg-green-50 text-green-600",
            },
            {
              icon: Mail,
              label: "Email",
              value: siteConfig.contact.email,
              href: `mailto:${siteConfig.contact.email}`,
              color: "bg-orange-50 text-orange-600",
            },
          ].map(({ icon: Icon, label, value, href, color }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border border-gray-100 hover:shadow-sm transition-all ${color} bg-opacity-10`}
            >
              <div
                className={`w-8 h-8 rounded-full ${color} flex items-center justify-center`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-gray-700">{label}</span>
              <span className="text-2xs text-gray-400 truncate max-w-full">
                {value}
              </span>
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary">
            Retour à l'accueil
          </Link>
          <Link
            href="/contact"
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-primary-600 transition-colors py-2 px-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Envoyer un autre message
          </Link>
        </div>

        {/* Explorer */}
        <p className="text-xs text-gray-400 mt-8">
          En attendant, explorez nos{" "}
          <Link href="/projects" className="text-primary-600 hover:underline">
            projets
          </Link>{" "}
          ou téléchargez nos{" "}
          <Link href="/resources" className="text-primary-600 hover:underline">
            publications
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
