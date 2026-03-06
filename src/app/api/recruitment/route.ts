/**
 * API Route — POST /api/recruitment
 * Traitement des candidatures spontanées et réponses aux offres d'emploi.
 *
 * - Validation Zod (champs obligatoires + optionnels)
 * - Rate limiting (3 candidatures/h/IP)
 * - Honeypot anti-spam
 * - Notification email RH via Resend
 * - Email de confirmation au candidat
 * - Sauvegarde MongoDB (optionnel)
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit, getClientIp, addRateLimitHeaders } from "@/lib/rate-limit";

export const runtime = "nodejs";

/* ─── Schéma Zod ─────────────────────────────────────────────────────────── */
const recruitmentSchema = z.object({
  /* Informations personnelles */
  firstName: z
    .string()
    .min(2, "Prénom requis (min 2 caractères)")
    .max(100)
    .trim(),
  lastName: z.string().min(2, "Nom requis (min 2 caractères)").max(100).trim(),
  email: z.string().email("Email invalide").max(254).toLowerCase().trim(),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-().]{8,20}$/, "Numéro de téléphone invalide")
    .optional(),
  linkedin: z
    .string()
    .url("URL LinkedIn invalide")
    .optional()
    .or(z.literal("")),

  /* Candidature */
  jobId: z.string().max(50).optional(),
  jobTitle: z.string().max(200).optional(),
  type: z.enum(["emploi", "stage", "volontariat", "spontanee"]),
  domain: z
    .enum([
      "agricultural-council",
      "community-health",
      "literacy-education",
      "women-empowerment",
      "social-intermediation",
      "finance",
      "communication",
      "autre",
    ])
    .optional(),

  /* Lettre et CV */
  coverLetter: z
    .string()
    .min(100, "Lettre de motivation trop courte (min 100 caractères)")
    .max(5000)
    .trim(),
  cvUrl: z.string().url("URL CV invalide").optional().or(z.literal("")),

  /* Disponibilité */
  availability: z.string().max(200).optional(),
  startDate: z.string().optional(),

  /* RGPD */
  gdprConsent: z.literal(true, {
    errorMap: () => ({ message: "Le consentement RGPD est requis." }),
  }),

  /* Honeypot anti-spam */
  website: z.string().max(0, "Spam détecté.").optional(),
});

type RecruitmentData = z.infer<typeof recruitmentSchema>;

/* ─── Constantes ─────────────────────────────────────────────────────────── */
const RECRUITMENT_EMAIL =
  process.env.RECRUITMENT_EMAIL_TO ?? "rh@mrjc-benin.org";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "contact@mrjc-benin.org";
const FROM_NAME = process.env.RESEND_FROM_NAME ?? "MRJC-BÉNIN";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mrjc-benin.org";

const TYPE_LABELS: Record<string, string> = {
  emploi: "Offre d'emploi",
  stage: "Stage",
  volontariat: "Volontariat",
  spontanee: "Candidature spontanée",
};

const DOMAIN_LABELS: Record<string, string> = {
  "agricultural-council": "Conseil Agricole & Entrepreneuriat",
  "community-health": "Santé Communautaire & Nutrition",
  "literacy-education": "Alphabétisation & Éducation",
  "women-empowerment": "Autonomisation des Femmes",
  "social-intermediation": "Intermédiation Sociale",
  finance: "Finance & Comptabilité",
  communication: "Communication & Médias",
  autre: "Autre",
};

/* ─── Envoyer email via Resend ───────────────────────────────────────────── */
async function sendRecruitmentEmails(data: RecruitmentData): Promise<void> {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey || resendKey.startsWith("re_VOTRE")) {
    console.warn(
      "[recruitment] RESEND_API_KEY non configurée — emails simulés",
    );
    return;
  }

  const { Resend } = await import("resend");
  const resend = new Resend(resendKey);
  const FROM = `${FROM_NAME} <${FROM_EMAIL}>`;
  const typeLabel = TYPE_LABELS[data.type] ?? data.type;
  const domainLabel = data.domain
    ? (DOMAIN_LABELS[data.domain] ?? data.domain)
    : "Non précisé";
  const candidateName = `${data.firstName} ${data.lastName}`;
  const now = new Date().toLocaleDateString("fr-BJ", { dateStyle: "long" });

  /* Email vers RH */
  const hrHtml = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Nouvelle candidature</title></head>
<body style="font-family:Inter,Arial,sans-serif;background:#f8f6f0;margin:0;padding:32px 16px;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:#0F3D22;padding:24px 32px;">
      <h1 style="color:#fff;margin:0;font-size:20px;font-weight:700;">📋 Nouvelle Candidature</h1>
      <p style="color:#c5e6d3;margin:8px 0 0;font-size:14px;">${typeLabel}${data.jobTitle ? ` — ${data.jobTitle}` : ""}</p>
    </div>
    <div style="padding:32px;">
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <tr><td style="padding:8px 12px;background:#f8f6f0;font-weight:600;width:35%;font-size:13px;">Candidat</td><td style="padding:8px 12px;font-size:13px;">${candidateName}</td></tr>
        <tr><td style="padding:8px 12px;background:#f8f6f0;font-weight:600;font-size:13px;">Email</td><td style="padding:8px 12px;font-size:13px;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
        ${data.phone ? `<tr><td style="padding:8px 12px;background:#f8f6f0;font-weight:600;font-size:13px;">Téléphone</td><td style="padding:8px 12px;font-size:13px;">${data.phone}</td></tr>` : ""}
        <tr><td style="padding:8px 12px;background:#f8f6f0;font-weight:600;font-size:13px;">Type</td><td style="padding:8px 12px;font-size:13px;">${typeLabel}</td></tr>
        <tr><td style="padding:8px 12px;background:#f8f6f0;font-weight:600;font-size:13px;">Domaine</td><td style="padding:8px 12px;font-size:13px;">${domainLabel}</td></tr>
        ${data.availability ? `<tr><td style="padding:8px 12px;background:#f8f6f0;font-weight:600;font-size:13px;">Disponibilité</td><td style="padding:8px 12px;font-size:13px;">${data.availability}</td></tr>` : ""}
        ${data.startDate ? `<tr><td style="padding:8px 12px;background:#f8f6f0;font-weight:600;font-size:13px;">Date de début</td><td style="padding:8px 12px;font-size:13px;">${data.startDate}</td></tr>` : ""}
        ${data.linkedin ? `<tr><td style="padding:8px 12px;background:#f8f6f0;font-weight:600;font-size:13px;">LinkedIn</td><td style="padding:8px 12px;font-size:13px;"><a href="${data.linkedin}">Voir profil</a></td></tr>` : ""}
        ${data.cvUrl ? `<tr><td style="padding:8px 12px;background:#f8f6f0;font-weight:600;font-size:13px;">CV</td><td style="padding:8px 12px;font-size:13px;"><a href="${data.cvUrl}">Télécharger CV</a></td></tr>` : ""}
      </table>
      <div style="background:#f0f9f4;border-left:4px solid #1B6B3A;border-radius:4px;padding:16px;margin-bottom:24px;">
        <h3 style="margin:0 0 8px;font-size:14px;font-weight:700;color:#0F3D22;">Lettre de motivation</h3>
        <p style="margin:0;font-size:13px;color:#374151;white-space:pre-line;line-height:1.6;">${data.coverLetter}</p>
      </div>
      <p style="font-size:12px;color:#9ca3af;text-align:center;margin-top:24px;">Reçue le ${now} — ${SITE_URL}</p>
    </div>
  </div>
</body>
</html>`;

  /* Email de confirmation au candidat */
  const candidateHtml = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Candidature reçue</title></head>
<body style="font-family:Inter,Arial,sans-serif;background:#f8f6f0;margin:0;padding:32px 16px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:#0F3D22;padding:24px 32px;text-align:center;">
      <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700;">MRJC-BÉNIN</h1>
      <p style="color:#c5e6d3;margin:4px 0 0;font-size:13px;">Mouvement Rural de Jeunesse Chrétienne du Bénin</p>
    </div>
    <div style="padding:32px;">
      <h2 style="color:#0F3D22;font-size:18px;margin:0 0 16px;">✅ Candidature reçue avec succès</h2>
      <p style="color:#374151;font-size:14px;line-height:1.7;">Bonjour <strong>${data.firstName}</strong>,</p>
      <p style="color:#374151;font-size:14px;line-height:1.7;">Nous avons bien reçu votre candidature ${data.jobTitle ? `pour le poste de <strong>${data.jobTitle}</strong>` : "spontanée"} et vous en remercions sincèrement.</p>
      <div style="background:#f0f9f4;border-radius:12px;padding:16px;margin:20px 0;">
        <p style="margin:0;font-size:13px;color:#1B6B3A;font-weight:600;">🕐 Prochaines étapes</p>
        <ul style="margin:8px 0 0;padding-left:20px;font-size:13px;color:#374151;line-height:2;">
          <li>Notre équipe RH examinera votre dossier dans les <strong>5 à 10 jours ouvrés</strong></li>
          <li>Si votre profil correspond, nous vous contacterons pour un entretien</li>
          <li>Gardez un œil sur votre boîte email (incluant les spams)</li>
        </ul>
      </div>
      <p style="color:#6b7280;font-size:13px;line-height:1.7;">En attendant, n'hésitez pas à explorer nos projets sur notre site web.</p>
      <div style="text-align:center;margin:24px 0;">
        <a href="${SITE_URL}/projects" style="background:#1B6B3A;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">Voir nos projets</a>
      </div>
      <p style="color:#9ca3af;font-size:12px;text-align:center;margin-top:24px;border-top:1px solid #f3f4f6;padding-top:16px;">
        MRJC-BÉNIN — ${SITE_URL}<br>
        contact@mrjc-benin.org | +229 97 XX XX XX
      </p>
    </div>
  </div>
</body>
</html>`;

  await Promise.allSettled([
    resend.emails.send({
      from: FROM,
      to: [RECRUITMENT_EMAIL],
      subject: `[Candidature] ${typeLabel} — ${candidateName}${data.jobTitle ? ` (${data.jobTitle})` : ""}`,
      html: hrHtml,
      reply_to: data.email,
    }),
    resend.emails.send({
      from: FROM,
      to: [data.email],
      subject: `MRJC-BÉNIN — Candidature reçue${data.jobTitle ? ` (${data.jobTitle})` : ""}`,
      html: candidateHtml,
    }),
  ]);
}

/* ─── Sauvegarder en base de données ────────────────────────────────────── */
async function saveToDB(data: RecruitmentData, ip: string): Promise<void> {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri || mongoUri.includes("VOTRE_MOT_DE_PASSE")) return;

  try {
    const { getCollection } = await import("@/lib/db/mongodb");
    const collection = await getCollection<any>("job_applications");
    await collection.insertOne({
      ...data,
      website: undefined, // Retirer honeypot
      submittedAt: new Date().toISOString(),
      ip,
      status: "pending", // pending | reviewed | shortlisted | rejected
    });
  } catch (err) {
    console.error("[recruitment] Erreur sauvegarde MongoDB:", err);
  }
}

/* ─── POST Handler ───────────────────────────────────────────────────────── */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  /* Rate limiting : 3 candidatures par heure par IP */
  const rl = rateLimit(`recruitment:${ip}`, 3, 3600);
  const headers = new Headers({ "Content-Type": "application/json" });
  addRateLimitHeaders(headers, rl, 3);

  if (!rl.success) {
    return NextResponse.json(
      {
        error:
          "Trop de candidatures soumises. Veuillez réessayer dans une heure.",
      },
      { status: 429, headers },
    );
  }

  /* Parse body */
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Corps de requête invalide (JSON attendu)." },
      { status: 400, headers },
    );
  }

  /* Validation Zod */
  const result = recruitmentSchema.safeParse(body);
  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    return NextResponse.json(
      { error: "Données invalides.", details: fieldErrors },
      { status: 422, headers },
    );
  }

  const data = result.data;

  /* Honeypot : champ "website" doit être vide */
  if (data.website) {
    // Simuler succès pour ne pas alerter les bots
    return NextResponse.json(
      { success: true, message: "Candidature reçue." },
      { status: 200, headers },
    );
  }

  /* Traitement en parallèle */
  const [emailResult, dbResult] = await Promise.allSettled([
    sendRecruitmentEmails(data),
    saveToDB(data, ip),
  ]);

  if (emailResult.status === "rejected") {
    console.error("[recruitment] Erreur email:", emailResult.reason);
  }
  if (dbResult.status === "rejected") {
    console.error("[recruitment] Erreur DB:", dbResult.reason);
  }

  return NextResponse.json(
    {
      success: true,
      message: `Votre candidature a bien été reçue${data.jobTitle ? ` pour le poste de ${data.jobTitle}` : ""}. Notre équipe RH vous contactera dans les 5 à 10 jours ouvrés.`,
    },
    { status: 200, headers },
  );
}
