/**
 * server.js — Fichier de démarrage Next.js pour Plesk / 001.Africa
 * ─────────────────────────────────────────────────────────────────
 * Ce fichier est requis par Plesk pour lancer l'application Next.js.
 * Il démarre le serveur Next.js en mode production sur le port défini
 * par la variable d'environnement PORT (fournie automatiquement par Plesk).
 *
 * Usage :
 *   - Plesk le détecte comme "Startup file"
 *   - PM2 : pm2 start server.js --name mrjc-benin
 */

const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const port = parseInt(process.env.PORT || "3000", 10);
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, "0.0.0.0", () => {
    console.log(`✅ MRJC-BÉNIN — Next.js prêt sur le port ${port}`);
    console.log(`   Environnement : ${dev ? "développement" : "production"}`);
    console.log(`   URL locale    : http://localhost:${port}`);
  });
});
