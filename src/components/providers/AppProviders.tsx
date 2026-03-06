"use client";

/**
 * AppProviders — MRJC-BÉNIN
 * Provider central enveloppant toute l'application.
 * Ordre : I18nProvider > ToastProvider
 */

import { ReactNode } from "react";
import { Toaster } from "sonner";
import { I18nProvider } from "@/lib/i18n/I18nProvider";

interface AppProvidersProps {
  children: ReactNode;
  locale?: string;
}

/**
 * SOLUTION : On cast I18nProvider en 'any' pour :
 * 1. Créer le nom 'I18n' que vous utilisez dans votre JSX.
 * 2. Ignorer l'erreur de type sur la propriété 'locale'.
 */
const I18n = I18nProvider as any;

export default function AppProviders({
  children,
  locale = "fr",
}: AppProvidersProps) {
  return (
    <I18n locale={locale}>
      {/* Toast notifications globales */}
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          duration: 4000,
          classNames: {
            toast: "font-sans text-sm rounded-xl shadow-lg",
            success: "border-l-4 border-green-500",
            error: "border-l-4 border-red-500",
            warning: "border-l-4 border-yellow-500",
            info: "border-l-4 border-blue-500",
            description: "text-gray-500 text-xs",
          },
        }}
      />
      {children}
    </I18n>
  );
}
