"use client";

/**
 * components/shared/Toast.tsx
 * Système de notifications toast complet
 * Usage :
 *   const { toast } = useToast();
 *   toast.success('Opération réussie !');
 *   toast.error('Une erreur est survenue.');
 *   toast.info('Information importante.');
 *   toast.warning('Attention !');
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/* ── Types ────────────────────────────────────────────────────────────────── */
type ToastType = "success" | "error" | "info" | "warning";

interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration: number;
  exiting: boolean;
}

interface ToastContextValue {
  toast: {
    success: (message: string, title?: string, duration?: number) => void;
    error: (message: string, title?: string, duration?: number) => void;
    info: (message: string, title?: string, duration?: number) => void;
    warning: (message: string, title?: string, duration?: number) => void;
  };
}

/* ── Context ──────────────────────────────────────────────────────────────── */
const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast doit être utilisé dans ToastProvider");
  return ctx;
}

/* ── Config par type ──────────────────────────────────────────────────────── */
const TOAST_CONFIG: Record<
  ToastType,
  {
    icon: typeof CheckCircle2;
    classes: string;
    iconClass: string;
    titleDefault: string;
  }
> = {
  success: {
    icon: CheckCircle2,
    classes: "bg-white border-green-200 shadow-green-50",
    iconClass: "text-green-600",
    titleDefault: "Succès",
  },
  error: {
    icon: XCircle,
    classes: "bg-white border-red-200 shadow-red-50",
    iconClass: "text-red-500",
    titleDefault: "Erreur",
  },
  info: {
    icon: Info,
    classes: "bg-white border-blue-200 shadow-blue-50",
    iconClass: "text-blue-500",
    titleDefault: "Information",
  },
  warning: {
    icon: AlertTriangle,
    classes: "bg-white border-amber-200 shadow-amber-50",
    iconClass: "text-amber-500",
    titleDefault: "Attention",
  },
};

/* ── Item individuel ──────────────────────────────────────────────────────── */
function ToastItemComponent({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: (id: string) => void;
}) {
  const {
    icon: Icon,
    classes,
    iconClass,
    titleDefault,
  } = TOAST_CONFIG[item.type];
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = progressRef.current;
    if (!el) return;
    el.style.transition = `width ${item.duration}ms linear`;
    requestAnimationFrame(() => {
      el.style.width = "0%";
    });
  }, [item.duration]);

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        "relative flex items-start gap-3 w-full max-w-sm rounded-xl border p-4 shadow-lg overflow-hidden",
        "transition-all duration-300",
        item.exiting
          ? "opacity-0 translate-x-full"
          : "opacity-100 translate-x-0",
        classes,
      )}
    >
      {/* Icône */}
      <Icon size={20} className={cn("flex-shrink-0 mt-0.5", iconClass)} />

      {/* Contenu */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 leading-tight">
          {item.title ?? titleDefault}
        </p>
        <p className="text-sm text-gray-600 mt-0.5 leading-snug">
          {item.message}
        </p>
      </div>

      {/* Bouton fermeture */}
      <button
        onClick={() => onDismiss(item.id)}
        aria-label="Fermer la notification"
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors rounded p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
      >
        <X size={16} />
      </button>

      {/* Barre de progression */}
      <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gray-100">
        <div
          ref={progressRef}
          className={cn(
            "h-full w-full",
            item.type === "success"
              ? "bg-green-500"
              : item.type === "error"
                ? "bg-red-500"
                : item.type === "info"
                  ? "bg-blue-500"
                  : "bg-amber-500",
          )}
        />
      </div>
    </div>
  );
}

/* ── Provider ─────────────────────────────────────────────────────────────── */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)),
    );
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 350);
  }, []);

  const addToast = useCallback(
    (type: ToastType, message: string, title?: string, duration = 5000) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setToasts((prev) => [
        ...prev.slice(-4),
        { id, type, message, title, duration, exiting: false },
      ]);
      setTimeout(() => dismiss(id), duration);
    },
    [dismiss],
  );

  const toast = {
    success: (msg: string, title?: string, dur?: number) =>
      addToast("success", msg, title, dur),
    error: (msg: string, title?: string, dur?: number) =>
      addToast("error", msg, title, dur),
    info: (msg: string, title?: string, dur?: number) =>
      addToast("info", msg, title, dur),
    warning: (msg: string, title?: string, dur?: number) =>
      addToast("warning", msg, title, dur),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Conteneur de toasts (portail bottom-right) */}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 items-end pointer-events-none"
      >
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto w-full max-w-sm">
            <ToastItemComponent item={t} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;
