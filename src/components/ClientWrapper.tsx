"use client";

/**
 * ClientWrapper — MRJC-BÉNIN
 * Error Boundary générique pour isoler les erreurs des sections clientes.
 * Évite qu'une section défaillante plante toute la page.
 */

import { Component, type ReactNode, type ErrorInfo } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  sectionName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    /* En dev: log détaillé. En prod: envoyer à Sentry/monitoring si dispo */
    if (process.env.NODE_ENV === "development") {
      console.error(
        `[ErrorBoundary] ${this.props.sectionName ?? "Section"} :`,
        error,
        info,
      );
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      /* Fallback silencieux en prod — ne pas exposer les erreurs internes */
      return process.env.NODE_ENV === "development" ? (
        <div className="w-full py-8 px-4 bg-red-50 border border-red-200 rounded-xl mx-4 my-2">
          <p className="text-red-600 text-sm font-mono">
            ⚠ Erreur dans {this.props.sectionName ?? "une section"} :<br />
            {this.state.error?.message}
          </p>
        </div>
      ) : null;
    }
    return this.props.children;
  }
}

/* Composant wrapper simplifié */
export default function ClientWrapper({
  children,
  sectionName,
}: {
  children: ReactNode;
  sectionName?: string;
}) {
  return <ErrorBoundary sectionName={sectionName}>{children}</ErrorBoundary>;
}
