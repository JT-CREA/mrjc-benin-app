/**
 * Hook — useServiceWorker
 * Enregistre le Service Worker PWA et expose le statut d'installation.
 * À utiliser dans le layout racine (app/layout.tsx).
 */

"use client";

import { useEffect, useState } from "react";

type SWStatus = "idle" | "registering" | "registered" | "error" | "unsupported";

export function useServiceWorker() {
  const [status, setStatus] = useState<SWStatus>("idle");
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) {
      setStatus("unsupported");
      return;
    }

    setStatus("registering");

    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((reg) => {
        setStatus("registered");
        setRegistration(reg);

        // Écouter les mises à jour
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                setUpdateAvailable(true);
              }
            });
          }
        });
      })
      .catch(() => setStatus("error"));
  }, []);

  function applyUpdate() {
    registration?.waiting?.postMessage({ type: "SKIP_WAITING" });
    window.location.reload();
  }

  return { status, updateAvailable, applyUpdate };
}
