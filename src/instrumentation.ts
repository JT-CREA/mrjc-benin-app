/**
 * instrumentation.ts — MRJC-BÉNIN
 *
 * EMPLACEMENT : src/instrumentation.ts
 * Exécuté côté serveur Node.js uniquement, 1 seule fois au démarrage.
 *
 * ⚠️  RÈGLES CRITIQUES :
 *  1. Zéro import statique en dehors de la fonction register()
 *  2. Tous les imports dynamiques DOIVENT avoir /* webpackIgnore: true *\/
 *     → empêche webpack de tracer/bundler ces modules dans le bundle client
 *  3. Le chemin mongodb doit être './lib/db/mongodb' (pas './src/lib/db/...')
 *     → instrumentation.ts est dans src/, donc lib/ est le bon chemin relatif
 */

export async function register() {
  /* ── Guard : exécution Node.js uniquement ──────────────────────────────
     NEXT_RUNTIME === 'edge' → Middleware Edge → retour immédiat
     NEXT_RUNTIME === 'nodejs' → Serveur Next.js → on continue
  ─────────────────────────────────────────────────────────────────────── */
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  /* ── Logs de démarrage ─────────────────────────────────────────────── */
  console.log("\n━━━ MRJC-BÉNIN — Démarrage serveur ━━━");

  /* ── Vérification variables d'environnement ────────────────────────── */
  const VARS: Array<{ key: string; fatal: boolean }> = [
    { key: "MONGODB_URI", fatal: false }, // false en dev (mode JSON)
    { key: "JWT_SECRET", fatal: true },
    { key: "RESEND_API_KEY", fatal: false },
    { key: "BREVO_API_KEY", fatal: false },
    { key: "NEXT_PUBLIC_RECAPTCHA_SITE_KEY", fatal: false },
  ];

  let hasFatal = false;

  for (const { key, fatal } of VARS) {
    const val = process.env[key];
    const missing =
      !val || val.startsWith("VOTRE_") || val.startsWith("REMPLACER_");

    if (missing) {
      const label = fatal ? "(CRITIQUE)" : "(optionnelle)";
      if (fatal) {
        console.error(`❌ ${key} non définie ${label}`);
        hasFatal = true;
      } else {
        console.warn(`⚠️  ${key} non définie ${label}`);
      }
    } else {
      console.log(`✅ ${key.padEnd(35)} ${val!.substring(0, 4)}****`);
    }
  }

  /* En production, les variables critiques sont obligatoires */
  if (hasFatal && process.env.NODE_ENV === "production") {
    throw new Error(
      "⛔ Variables critiques manquantes — configurez-les sur Render.com.",
    );
  }

  /* ── Warm-up MongoDB (uniquement si URI configurée) ────────────────────
     IMPORTANT : /* webpackIgnore: true *\/ est OBLIGATOIRE ici.
     Sans ce commentaire, webpack trace cet import dynamique et tente de
     bundler mongodb → "Can't resolve 'net'" dans le bundle client.
  ─────────────────────────────────────────────────────────────────────── */
  const mongoUri = process.env.MONGODB_URI;

  if (
    mongoUri &&
    !mongoUri.startsWith("VOTRE_") &&
    !mongoUri.startsWith("REMPLACER_")
  ) {
    try {
      /* webpackIgnore: true */
      const { pingDatabase } = await import(
        /* webpackIgnore: true */ "./lib/db/mongodb"
      );
      const ok = await pingDatabase();
      if (ok) {
        console.log("✅ MongoDB Atlas                     Connecté");
      } else {
        console.warn("⚠️  MongoDB Atlas                     Ping échoué");
      }
    } catch (err) {
      /* Ne pas crasher si MongoDB est indisponible en développement */
      console.error(
        "❌ MongoDB connexion échouée :",
        err instanceof Error ? err.message : err,
      );
    }
  } else {
    console.warn("⚠️  MONGODB_URI absente → mode JSON statique actif");
  }

  /* ── Résumé runtime ────────────────────────────────────────────────── */
  console.log(`ℹ️  Environnement : ${process.env.NODE_ENV}`);
  console.log(
    `ℹ️  URL            : ${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}`,
  );
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}
