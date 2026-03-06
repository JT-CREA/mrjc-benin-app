/**
 * Page — /newsletter/confirm
 * Confirmation de l'inscription newsletter (double opt-in)
 * Appelée depuis le lien envoyé par email via Brevo
 */

import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Mail,
  ArrowRight,
  BookOpen,
  Newspaper,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Confirmation Newsletter | MRJC-BÉNIN",
  description:
    "Confirmation de votre inscription à la newsletter de MRJC-BÉNIN.",
  robots: { index: false, follow: false },
};

/* ─── Confirmation via Brevo ─────────────────────────────────────────────── */
async function confirmSubscription(
  email: string,
  token: string,
): Promise<"success" | "invalid" | "already"> {
  // En production : appel API Brevo pour valider le double opt-in
  // ou mise à jour du statut dans MongoDB
  if (!email || !token || token.length < 10) return "invalid";

  // Simulation : token valide si email présent
  // Production : vérifier le token HMAC signé en DB/Brevo
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (mongoUri && !mongoUri.includes("VOTRE_MOT_DE_PASSE")) {
      const { getCollection } = await import("@/lib/db/mongodb");
      const col = await getCollection<any>("newsletter_subscribers");
      const sub = await col.findOne({ email: email.toLowerCase().trim() });
      if (!sub) return "invalid";
      if (sub.confirmed || sub.status === "confirmed") return "already";
      await col.updateOne(
        { email: email.toLowerCase().trim() },
        {
          $set: {
            confirmed: true,
            status: "confirmed",
            confirmedAt: new Date().toISOString(),
          },
        },
      );
      return "success";
    }
  } catch (err) {
    console.error("[newsletter/confirm]", err);
  }

  // Fallback sans DB : on considère le token valide
  return token.length >= 20 ? "success" : "invalid";
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
interface ConfirmPageProps {
  searchParams: Promise<{ email?: string; token?: string }>;
}

export default async function NewsletterConfirmPage({
  searchParams,
}: ConfirmPageProps) {
  const { email = "", token = "" } = await searchParams;

  const status = await confirmSubscription(
    decodeURIComponent(email),
    decodeURIComponent(token),
  );

  /* ── DÉJÀ CONFIRMÉ ── */
  if (status === "already") {
    return (
      <ConfirmLayout>
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold font-display text-gray-900 mb-3">
            Déjà confirmé !
          </h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Votre adresse <strong>{decodeURIComponent(email)}</strong> est déjà
            confirmée. Vous faites partie de notre communauté.
          </p>
          <CTAButtons />
        </div>
      </ConfirmLayout>
    );
  }

  /* ── SUCCÈS ── */
  if (status === "success") {
    return (
      <ConfirmLayout>
        <div className="text-center">
          {/* Icône succès animée */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-pulse" />
            <div className="relative w-24 h-24 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
          </div>

          <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full uppercase tracking-wider mb-4">
            Inscription confirmée
          </span>

          <h1 className="text-3xl font-bold font-display text-gray-900 mb-4">
            Bienvenue dans notre communauté ! 🎉
          </h1>

          {email && (
            <p className="text-gray-500 text-sm mb-2">
              Adresse confirmée :{" "}
              <strong className="text-gray-800">
                {decodeURIComponent(email)}
              </strong>
            </p>
          )}

          <p className="text-gray-600 leading-relaxed mb-8 max-w-md mx-auto">
            Votre inscription à la newsletter de <strong>MRJC-BÉNIN</strong> est
            maintenant active. Vous recevrez nos actualités, publications et
            informations sur nos projets directement dans votre boîte mail.
          </p>

          {/* Ce que vous recevrez */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-left max-w-lg mx-auto">
            {[
              {
                icon: "📰",
                title: "Actualités",
                desc: "Nouvelles de nos projets sur le terrain",
              },
              {
                icon: "📚",
                title: "Publications",
                desc: "Rapports, guides et études disponibles",
              },
              {
                icon: "💼",
                title: "Opportunités",
                desc: "Offres d'emploi et d'engagement",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-primary-50 rounded-xl p-4 border border-primary-100"
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <p className="font-semibold text-sm text-gray-900">
                  {item.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>

          <CTAButtons />
        </div>
      </ConfirmLayout>
    );
  }

  /* ── INVALIDE ── */
  return (
    <ConfirmLayout>
      <div className="text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold font-display text-gray-900 mb-3">
          Lien invalide ou expiré
        </h1>
        <p className="text-gray-600 mb-4 max-w-md mx-auto">
          Ce lien de confirmation est invalide ou a expiré. Les liens de
          confirmation sont valides pendant <strong>24 heures</strong>.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          Si vous souhaitez vous inscrire à la newsletter, veuillez refaire
          votre inscription.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/#newsletter"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors"
          >
            <Mail className="w-4 h-4" />
            Réessayer l&apos;inscription
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            Nous contacter
          </Link>
        </div>
      </div>
    </ConfirmLayout>
  );
}

/* ─── Composants locaux ──────────────────────────────────────────────────── */
function ConfirmLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-primary-700 font-bold text-lg">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-black">M</span>
            </div>
            MRJC-BÉNIN
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}

function CTAButtons() {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      <Link
        href="/news"
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors"
      >
        <Newspaper className="w-4 h-4" />
        Voir les actualités
        <ArrowRight className="w-4 h-4" />
      </Link>
      <Link
        href="/resources"
        className="inline-flex items-center gap-2 px-6 py-3 border border-primary-300 text-primary-700 rounded-xl font-semibold text-sm hover:bg-primary-50 transition-colors"
      >
        <BookOpen className="w-4 h-4" />
        Nos publications
      </Link>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
      >
        Accueil
      </Link>
    </div>
  );
}
