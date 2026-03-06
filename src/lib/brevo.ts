/**
 * lib/brevo.ts
 * Client Brevo (ex-Sendinblue) — Gestion des abonnés newsletter
 * Documentation API : https://developers.brevo.com/reference
 */

/* ─── Types ──────────────────────────────────────────────────────────────── */
export interface BrevoContact {
  email: string;
  firstName?: string;
  lastName?: string;
  listIds?: number[];
  attributes?: Record<string, string | number | boolean>;
}

export interface BrevoResult {
  success: boolean;
  message?: string;
  error?: string;
  statusCode?: number;
  simulated?: boolean;
}

interface BrevoApiError {
  code: string;
  message: string;
}

/* ─── Config ─────────────────────────────────────────────────────────────── */
const BREVO_API_BASE = "https://api.brevo.com/v3";
const BREVO_LIST_ID = Number(process.env.BREVO_LIST_ID ?? 1);
const BREVO_API_KEY = process.env.BREVO_API_KEY;

/**
 * Génère les headers strictement typés pour Fetch.
 * Ne renvoie JAMAIS d'objets de simulation ici pour éviter les erreurs de type.
 */
function getBrevoHeaders(): Record<string, string> {
  return {
    accept: "application/json",
    "content-type": "application/json",
    "api-key": BREVO_API_KEY || "",
  };
}

/* ─── Créer / mettre à jour un contact ──────────────────────────────────── */
export async function upsertBrevoContact(
  contact: BrevoContact,
): Promise<BrevoResult> {
  // Mode Simulation si la clé est absente
  if (!BREVO_API_KEY) {
    console.warn("[Brevo] Mode simulation : upsertBrevoContact");
    return {
      success: true,
      message: "Simulation : Contact traité.",
      simulated: true,
    };
  }

  try {
    const payload = {
      email: contact.email.toLowerCase().trim(),
      attributes: {
        FIRSTNAME: contact.firstName ?? "",
        LASTNAME: contact.lastName ?? "",
        ...contact.attributes,
      },
      listIds: contact.listIds ?? [BREVO_LIST_ID],
      updateEnabled: true,
    };

    const res = await fetch(`${BREVO_API_BASE}/contacts`, {
      method: "POST",
      headers: getBrevoHeaders(),
      body: JSON.stringify(payload),
    });

    if (res.status === 201 || res.status === 204) {
      return { success: true, message: "Contact créé ou mis à jour." };
    }

    if (res.status === 400) {
      const body = (await res.json()) as BrevoApiError;
      if (body.code === "duplicate_parameter") {
        return { success: true, message: "Contact déjà inscrit." };
      }
      return { success: false, error: body.message, statusCode: 400 };
    }

    const body = (await res.json()) as BrevoApiError;
    return { success: false, error: body.message, statusCode: res.status };
  } catch (err) {
    console.error("[Brevo] upsertContact:", err);
    return { success: false, error: String(err) };
  }
}

/* ─── Désabonner un contact ─────────────────────────────────────────────── */
export async function unsubscribeBrevoContact(
  email: string,
): Promise<BrevoResult> {
  if (!BREVO_API_KEY) {
    return {
      success: true,
      message: "Simulation : Désabonnement réussi.",
      simulated: true,
    };
  }

  try {
    const emailClean = email.toLowerCase().trim();
    const encodedEmail = encodeURIComponent(emailClean);

    const res = await fetch(
      `${BREVO_API_BASE}/contacts/lists/${BREVO_LIST_ID}/contacts/remove`,
      {
        method: "POST",
        headers: getBrevoHeaders(),
        body: JSON.stringify({ emails: [emailClean] }),
      },
    );

    if (res.ok) {
      await fetch(`${BREVO_API_BASE}/contacts/${encodedEmail}`, {
        method: "PUT",
        headers: getBrevoHeaders(),
        body: JSON.stringify({ emailBlacklisted: false }),
      });
      return { success: true, message: "Contact désabonné." };
    }

    const body = (await res.json()) as BrevoApiError;
    return { success: false, error: body.message, statusCode: res.status };
  } catch (err) {
    console.error("[Brevo] unsubscribe:", err);
    return { success: false, error: String(err) };
  }
}

/* ─── Vérifier si un email est déjà inscrit ─────────────────────────────── */
export async function isBrevoSubscribed(email: string): Promise<boolean> {
  if (!BREVO_API_KEY) return false;

  try {
    const encodedEmail = encodeURIComponent(email.toLowerCase().trim());
    const res = await fetch(`${BREVO_API_BASE}/contacts/${encodedEmail}`, {
      method: "GET",
      headers: getBrevoHeaders(),
    });

    if (!res.ok) return false;

    const contact = (await res.json()) as {
      listIds?: number[];
      emailBlacklisted?: boolean;
    };

    return (
      Array.isArray(contact.listIds) &&
      contact.listIds.includes(BREVO_LIST_ID) &&
      !contact.emailBlacklisted
    );
  } catch {
    return false;
  }
}

/* ─── Tokens de désabonnement ───────────────────────────────────────────── */
export function generateUnsubscribeToken(email: string): string {
  const secret = process.env.REVALIDATE_SECRET ?? "mrjc-secret";
  const data = `${email}:${secret}:unsubscribe`;
  return Buffer.from(data).toString("base64url");
}

export function verifyUnsubscribeToken(token: string, email: string): boolean {
  try {
    const expected = generateUnsubscribeToken(email);
    return token === expected;
  } catch {
    return false;
  }
}
