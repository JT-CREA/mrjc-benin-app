"use client";

/**
 * components/shared/Modal.tsx
 * Modal accessible (WAI-ARIA Dialog) — Design system MRJC-BÉNIN
 * - Focus trap
 * - Fermeture Escape / overlay
 * - Sizes : sm | md | lg | xl | full
 * - Animation Framer Motion
 */

import {
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/* ─── Types ──────────────────────────────────────────────────────────────── */
type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: ModalSize;
  showClose?: boolean;
  closeOnOverlay?: boolean;
  footer?: ReactNode;
  className?: string;
  titleClassName?: string;
}

const SIZE_CLASSES: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-[95vw]",
};

/* ─── Hook focus trap ────────────────────────────────────────────────────── */
function useFocusTrap(isOpen: boolean) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !ref.current) return;

    const focusable = ref.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    first?.focus();

    const onTab = (e: Event) => {
      const ke = e as unknown as KeyboardEvent;
      if (ke.key !== "Tab") return;
      if (ke.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener("keydown", onTab);
    return () => document.removeEventListener("keydown", onTab);
  }, [isOpen]);

  return ref;
}

/* ─── Composant ──────────────────────────────────────────────────────────── */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showClose = true,
  closeOnOverlay = true,
  footer,
  className,
  titleClassName,
}: ModalProps) {
  const dialogRef = useFocusTrap(isOpen);

  /* Escape pour fermer */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  /* Scroll lock */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleOverlayClick = useCallback(() => {
    if (closeOnOverlay) onClose();
  }, [closeOnOverlay, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
        onClick={handleOverlayClick}
        style={{ animation: "fadeIn 0.15s ease-out" }}
      />

      {/* Boîte de dialogue */}
      <div
        ref={dialogRef}
        className={cn(
          "relative bg-white rounded-2xl shadow-2xl w-full flex flex-col max-h-[90vh]",
          SIZE_CLASSES[size],
          className,
        )}
        style={{ animation: "slideUp 0.2s ease-out" }}
      >
        {/* En-tête */}
        {(title || showClose) && (
          <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
            {title && (
              <h2
                id="modal-title"
                className={cn(
                  "text-lg font-bold font-display text-gray-900",
                  titleClassName,
                )}
              >
                {title}
              </h2>
            )}
            {showClose && (
              <button
                onClick={onClose}
                aria-label="Fermer"
                className="ml-auto p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" aria-hidden />
              </button>
            )}
          </div>
        )}

        {/* Corps scrollable */}
        <div className="overflow-y-auto flex-1 p-5">{children}</div>

        {/* Pied */}
        {footer && (
          <div className="p-5 border-t border-gray-100 shrink-0 bg-gray-50/50 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>

      {/* Animations CSS inline */}
      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px) scale(0.98) } to { opacity: 1; transform: none } }
      `}</style>
    </div>,
    document.body,
  );
}
