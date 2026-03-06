/**
 * Page — Désabonnement Newsletter
 * Route: /newsletter/unsubscribe?token=xxx
 * Permet aux abonnés de se désinscrire de la newsletter MRJC-BÉNIN.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, XCircle, Mail, ArrowLeft } from "lucide-react";
import { siteConfig } from "@/config/site.config";

export const metadata: Metadata = {
  title: `Se désabonner | ${siteConfig.seo.defaultTitle}`,
  description: "Désabonnement de la newsletter MRJC-BÉNIN.",
  robots: { index: false, follow: false },
};

// Correction : searchParams est désormais une Promise en Next.js 15
interface UnsubscribePageProps {
  searchParams: Promise<{ token?: string; status?: string }>;
}

async function processUnsubscribe(
  token: string,
): Promise<{ success: boolean; message: string }> {
  // En production : valider le token JWT, retirer l'abonné de la BDD
  if (!token || token.length < 10) {
    return {
      success: false,
      message: "Lien de désabonnement invalide ou expiré.",
    };
  }
  // Simulation : succès
  return {
    success: true,
    message: "Vous avez bien été désabonné(e) de la newsletter MRJC-BÉNIN.",
  };
}

export default async function UnsubscribePage({
  searchParams,
}: UnsubscribePageProps) {
  // Correction : On attend la résolution de la Promise searchParams
  const { token, status } = await searchParams;

  let result: { success: boolean; message: string } | null = null;

  if (token) {
    result = await processUnsubscribe(token);
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-lg border border-gray-100 p-8 text-center">
        {/* Logo */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary-700 font-bold text-sm mb-8"
        >
          <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
            <span className="text-primary-700 text-base">🌿</span>
          </div>
          MRJC-BÉNIN
        </Link>

        {!token && !status ? (
          /* ── Pas de token — demande confirmation ── */
          <>
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Mail className="w-8 h-8 text-orange-500" />
            </div>
            <h1 className="font-display font-bold text-2xl text-gray-900 mb-3">
              Se désabonner
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Vous souhaitez vous désabonner de la newsletter MRJC-BÉNIN ?
              Utilisez le lien de désabonnement contenu dans l'un de nos emails,
              ou contactez-nous directement.
            </p>
            <a
              href="mailto:contact@mrjc-benin.org?subject=Désabonnement newsletter"
              className="btn-primary inline-flex items-center gap-2 mb-4"
            >
              <Mail className="w-4 h-4" />
              Nous contacter
            </a>
            <p className="text-xs text-gray-400">
              Votre demande sera traitée sous 48 heures.
            </p>
          </>
        ) : result?.success ? (
          /* ── Succès ── */
          <>
            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="font-display font-bold text-2xl text-gray-900 mb-3">
              Désabonnement confirmé
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              {result.message}
            </p>
            <p className="text-gray-400 text-xs mb-8">
              Vous ne recevrez plus nos emails. Si vous changez d'avis, vous
              pourrez vous réabonner depuis notre site à tout moment.
            </p>

            <div className="flex flex-col gap-3">
              <Link
                href="/resources"
                className="btn-secondary inline-flex items-center justify-center gap-2"
              >
                Accéder à nos ressources gratuites
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 text-gray-400 hover:text-primary-600 text-sm transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Retour à l'accueil
              </Link>
            </div>
          </>
        ) : (
          /* ── Erreur ── */
          <>
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="font-display font-bold text-2xl text-gray-900 mb-3">
              Lien invalide
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              {result?.message ??
                "Ce lien de désabonnement est invalide ou a expiré."}
            </p>
            <p className="text-gray-400 text-xs mb-8">
              Si vous souhaitez toujours vous désabonner, contactez-nous
              directement.
            </p>

            <div className="flex flex-col gap-3">
              <a
                href="mailto:contact@mrjc-benin.org?subject=Désabonnement newsletter"
                className="btn-primary inline-flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Nous contacter
              </a>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 text-gray-400 hover:text-primary-600 text-sm transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Retour à l'accueil
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
