"use client";

/**
 * global-error.tsx — MRJC-BÉNIN
 *
 * ⚠️  RÈGLE CRITIQUE : Ce composant est rendu côté SERVEUR par Next.js
 * même avec 'use client', car il remplace le root layout en cas d'erreur.
 * → Zéro framer-motion, zéro useLayoutEffect, zéro hooks SSR-incompatibles.
 * → CSS animations uniquement.
 */

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Erreur — MRJC-BÉNIN</title>
        <style>{`
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
          body{
            font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
            min-height:100vh;
            display:flex;align-items:center;justify-content:center;
            background:linear-gradient(135deg,#1a2e1e 0%,#0f1f12 50%,#1a1a2e 100%);
            padding:1rem;
          }
          .card{
            max-width:480px;width:100%;text-align:center;
            animation:fadeUp .5s ease both;
          }
          @keyframes fadeUp{
            from{opacity:0;transform:translateY(24px)}
            to{opacity:1;transform:translateY(0)}
          }
          .logo{
            display:inline-flex;align-items:center;gap:.75rem;
            margin-bottom:2.5rem;
          }
          .logo-icon{
            width:40px;height:40px;border-radius:10px;
            background:rgba(255,255,255,.1);
            display:flex;align-items:center;justify-content:center;
            font-size:20px;
          }
          .logo-text{color:#fff;font-weight:700;font-size:1.1rem}
          .icon-wrap{
            width:80px;height:80px;border-radius:50%;
            background:rgba(239,68,68,.15);border:1px solid rgba(239,68,68,.3);
            display:flex;align-items:center;justify-content:center;
            margin:0 auto 1.5rem;
            animation:pulse 2s ease infinite;
          }
          @keyframes pulse{
            0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,.3)}
            50%{box-shadow:0 0 0 12px rgba(239,68,68,0)}
          }
          .icon-wrap svg{width:36px;height:36px;color:#f87171;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
          h1{color:#fff;font-size:1.75rem;font-weight:700;margin-bottom:.75rem}
          p{color:rgba(255,255,255,.6);margin-bottom:.5rem;font-size:.95rem;line-height:1.6}
          .digest{
            font-family:monospace;font-size:.7rem;color:rgba(239,68,68,.5);
            margin-top:.75rem;
          }
          .actions{
            display:flex;flex-wrap:wrap;gap:.75rem;justify-content:center;margin-top:2rem;
          }
          .btn{
            display:inline-flex;align-items:center;gap:.5rem;
            padding:.75rem 1.5rem;border-radius:.75rem;
            font-weight:600;font-size:.9rem;cursor:pointer;
            text-decoration:none;border:none;
            transition:opacity .2s,transform .15s;
          }
          .btn:hover{opacity:.85;transform:translateY(-1px)}
          .btn-primary{background:#ef4444;color:#fff}
          .btn-outline{background:rgba(255,255,255,.08);color:#fff;border:1px solid rgba(255,255,255,.15)}
          .footer-note{margin-top:2.5rem;color:rgba(255,255,255,.25);font-size:.75rem}
        `}</style>
      </head>
      <body>
        <div className="card" style={{ animation: "fadeUp .5s ease both" }}>
          {/* Logo */}
          <div className="logo">
            <div className="logo-icon">🌿</div>
            <span className="logo-text">MRJC-BÉNIN</span>
          </div>

          {/* Icône */}
          <div className="icon-wrap">
            <svg viewBox="0 0 24 24">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>

          {/* Texte */}
          <h1>Erreur critique</h1>
          <p>
            Une erreur inattendue s&apos;est produite dans l&apos;application.
          </p>
          <p>
            Cliquez sur &laquo;&nbsp;Réessayer&nbsp;&raquo; ou revenez à
            l&apos;accueil.
          </p>

          {error.digest && <p className="digest">Code : {error.digest}</p>}

          {/* Actions */}
          <div className="actions">
            <button onClick={reset} className="btn btn-primary">
              ↺ Réessayer
            </button>
            <a href="/" className="btn btn-outline">
              ⌂ Retour à l&apos;accueil
            </a>
          </div>

          <p className="footer-note">
            Si le problème persiste : contact@mrjc-benin.org
          </p>
        </div>
      </body>
    </html>
  );
}
