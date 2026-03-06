#!/usr/bin/env node
/**
 * scripts/setup-mongodb-indexes.js
 * Création des index MongoDB Atlas pour MRJC-BÉNIN
 *
 * Exécuter UNE FOIS en production :
 *   node scripts/setup-mongodb-indexes.js
 *
 * Prérequis : MONGODB_URI et MONGODB_DB_NAME dans .env.local
 */

require("dotenv").config({ path: ".env.local" });
const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME ?? "mrjc-benin";

if (!uri) {
  console.error("❌ MONGODB_URI manquant dans .env.local");
  process.exit(1);
}

async function createIndexes() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  console.log(`✅ Connecté à MongoDB — base: ${dbName}\n`);

  const tasks = [
    // ── Visiteurs ──
    {
      col: "visitors",
      indexes: [
        { key: { createdAt: -1 } },
        { key: { ip: 1 } },
        { key: { page: 1 } },
      ],
    },

    // ── Messages de contact ──
    {
      col: "contact_messages",
      indexes: [
        { key: { createdAt: -1 } },
        { key: { status: 1 } },
        { key: { email: 1 } },
      ],
    },

    // ── Newsletter ──
    {
      col: "newsletter_subscribers",
      indexes: [
        { key: { email: 1 }, unique: true },
        { key: { status: 1 } },
        { key: { subscribedAt: -1 } },
      ],
    },

    // ── Sessions admin ──
    {
      col: "admin_sessions",
      indexes: [
        { key: { token: 1 }, unique: true },
        { key: { expiresAt: 1 }, expireAfterSeconds: 0 }, // TTL index
      ],
    },

    // ── Téléchargements ──
    {
      col: "downloads",
      indexes: [
        { key: { downloadedAt: -1 } },
        { key: { resourceId: 1 } },
        { key: { ip: 1 } },
      ],
    },

    // ── Blog ──
    {
      col: "blog_posts",
      indexes: [
        { key: { slug: 1 }, unique: true },
        { key: { status: 1, publishedAt: -1 } },
        { key: { category: 1 } },
        { key: { featured: 1 } },
        { key: { title: "text", excerpt: "text", content: "text" } }, // recherche full-text
      ],
    },

    // ── Actualités ──
    {
      col: "news",
      indexes: [
        { key: { slug: 1 }, unique: true },
        { key: { status: 1, publishedAt: -1 } },
        { key: { category: 1 } },
        { key: { featured: 1 } },
        { key: { title: "text", excerpt: "text" } },
      ],
    },

    // ── Médias ──
    {
      col: "media",
      indexes: [
        { key: { publicId: 1 }, unique: true },
        { key: { uploadedAt: -1 } },
        { key: { mimeType: 1 } },
      ],
    },

    // ── Feedback ──
    {
      col: "feedback",
      indexes: [
        { key: { createdAt: -1 } },
        { key: { type: 1 } },
        { key: { rating: 1 } },
      ],
    },
  ];

  for (const { col, indexes } of tasks) {
    const collection = db.collection(col);
    for (const { key, ...options } of indexes) {
      try {
        await collection.createIndex(key, options);
        console.log(`  ✅ Index créé — ${col}: ${JSON.stringify(key)}`);
      } catch (err) {
        if (err.code === 85 || err.code === 86) {
          console.log(
            `  ⚠️  Index existant ignoré — ${col}: ${JSON.stringify(key)}`,
          );
        } else {
          console.error(`  ❌ Erreur — ${col}: ${err.message}`);
        }
      }
    }
  }

  await client.close();
  console.log("\n✅ Indexation terminée.");
}

createIndexes().catch((err) => {
  console.error("❌ Erreur fatale:", err);
  process.exit(1);
});
