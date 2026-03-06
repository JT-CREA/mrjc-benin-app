"use client";

/**
 * error.tsx — MRJC-BÉNIN
 * Error Boundary niveau route (App Router).
 *
 * ⚠️  Ce fichier est pré-rendu côté serveur pour l'hydratation initiale.
 * → Zéro framer-motion / useLayoutEffect / localStorage.
 * → Animations CSS uniquement.
 */

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[AppError]", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div
        className="max-w-md w-full text-center"
        style={{ animation: "errorFadeIn 0.4s ease both" }}
      >
        {/* Animation CSS — pas de framer-motion */}
        <style>{`
          @keyframes errorFadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0);    }
          }
          @keyframes errorBounceIn {
            0%   { opacity: 0; transform: scale(0.5); }
            60%  { transform: scale(1.1); }
            100% { opacity: 1; transform: scale(1); }
          }
          .error-icon { animation: errorBounceIn 0.45s cubic-bezier(.34,1.56,.64,1) both; }
          .error-body { animation: errorFadeIn 0.4s ease 0.1s both; }
          .error-actions { animation: errorFadeIn 0.4s ease 0.2s both; }
        `}</style>

        {/* Icône */}
        <div className="error-icon w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        {/* Corps */}
        <div className="error-body">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Une erreur s&apos;est produite
          </h1>
          <p className="text-gray-500 mb-1">
            Cette page a rencontré un problème inattendu.
          </p>

          {/* Message d'erreur en dev uniquement */}
          {process.env.NODE_ENV === "development" && error?.message && (
            <pre className="text-red-400 text-xs font-mono bg-red-50 rounded-lg p-3 mt-3 text-left overflow-auto max-h-28 whitespace-pre-wrap break-all">
              {error.message}
            </pre>
          )}

          {error.digest && (
            <p className="text-gray-400 text-xs mt-2">
              Réf. : <code className="font-mono">{error.digest}</code>
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="error-actions flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2
                       bg-primary-600 hover:bg-primary-700 text-white
                       font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <polyline points="1 4 1 10 7 10" />
              <polyline points="23 20 23 14 17 14" />
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
            </svg>
            Réessayer
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2
                       border border-gray-200 text-gray-700 font-semibold
                       px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Accueil
          </Link>
        </div>

        {/* Lien contact */}
        <div className="mt-6">
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400
                       hover:text-primary-600 transition-colors"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            Signaler le problème
          </Link>
        </div>
      </div>
    </div>
  );
}
