/**
 * lib/db/mongodb.ts — MRJC-BÉNIN
 * Connexion MongoDB Atlas — Singleton avec connection pooling
 * Compatible Next.js 15 — Server Only
 */

import "server-only"; // ← Empêche tout import depuis un composant client

import { MongoClient, Db, type MongoClientOptions } from "mongodb";

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface MongoConnection {
  client: MongoClient;
  db: Db;
}

interface GlobalMongo {
  conn: MongoConnection | null;
  promise: Promise<MongoConnection> | null;
}

/* ─── Validation env ─────────────────────────────────────────────────────── */
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME ?? "mrjc-benin";

if (!uri) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("[MRJC] MONGODB_URI manquant en production.");
  }
  console.warn("\n⚠️  [MRJC] MONGODB_URI absent → mode JSON fallback actif\n");
}

/* ─── Options de connexion ───────────────────────────────────────────────── */
const options: MongoClientOptions = {
  maxPoolSize: 10,
  minPoolSize: 2,
  maxIdleTimeMS: 30000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 30000,
  serverSelectionTimeoutMS: 10000,
  retryWrites: true,
  retryReads: true,
};

/* ─── Singleton global (hot-reload safe) ────────────────────────────────── */
declare global {
  // eslint-disable-next-line no-var
  var _mongoGlobal: GlobalMongo | undefined;
}

const globalMongo: GlobalMongo = global._mongoGlobal ?? {
  conn: null,
  promise: null,
};

if (process.env.NODE_ENV === "development") {
  global._mongoGlobal = globalMongo;
}

/* ─── Connexion principale ───────────────────────────────────────────────── */
export async function connectToDatabase(): Promise<MongoConnection> {
  if (!uri) {
    throw new Error("[MRJC] connectToDatabase() appelé sans MONGODB_URI.");
  }
  if (globalMongo.conn) return globalMongo.conn;
  if (!globalMongo.promise) {
    globalMongo.promise = MongoClient.connect(uri, options).then((client) => ({
      client,
      db: client.db(dbName),
    }));
  }
  try {
    globalMongo.conn = await globalMongo.promise;
    return globalMongo.conn;
  } catch (error) {
    globalMongo.promise = null;
    throw new Error(`Echec connexion MongoDB: ${String(error)}`);
  }
}

/* ─── Helpers collections ────────────────────────────────────────────────── */
export async function getCollection<T extends Document>(
  collectionName: string,
) {
  const { db } = await connectToDatabase();
  return db.collection<T>(collectionName);
}

/* ─── Noms de collections ────────────────────────────────────────────────── */
export const COLLECTIONS = {
  VISITORS: "visitors",
  DOWNLOADS: "downloads",
  NEWSLETTER: "newsletter_subscribers",
  MESSAGES: "contact_messages",
  SESSIONS: "admin_sessions",
  BLOG: "blog_posts",
  NEWS: "news",
  TEAM: "team_members",
  FEEDBACK: "feedback",
  MEDIA: "media",
  PARTNERS: "partners",
  PROJECTS: "projects",
  RESOURCES: "resources",
} as const;

/* ─── Ping / healthcheck ─────────────────────────────────────────────────── */
export async function pingDatabase(): Promise<boolean> {
  try {
    const { db } = await connectToDatabase();
    await db.command({ ping: 1 });
    return true;
  } catch {
    return false;
  }
}

export default connectToDatabase;
