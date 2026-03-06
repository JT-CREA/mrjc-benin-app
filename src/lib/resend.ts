/**
 * lib/resend.ts
 * Client Resend — Envoi d'emails transactionnels
 * Intègre les templates React Email du dossier /src/emails/
 */

import { Resend } from "resend";
import { render } from "@react-email/render";
import {
  ContactConfirmationEmail,
  ContactAdminNotificationEmail,
} from "@/emails/ContactEmail";
import NewsletterWelcomeEmail from "@/emails/NewsletterWelcomeEmail";
import { createElement } from "react";

/* ─── Client singleton ───────────────────────────────────────────────────── */
let _resend: Resend | null = null;

function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[Resend] RESEND_API_KEY absente → emails simulés (mode dev)");
    return null;
  }
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

/* ─── Configuration ──────────────────────────────────────────────────────── */
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "contact@mrjc-benin.org";
const FROM_NAME = process.env.RESEND_FROM_NAME ?? "MRJC-BÉNIN";
const ADMIN_EMAIL = process.env.CONTACT_EMAIL_TO ?? "contact@mrjc-benin.org";

const FROM = `${FROM_NAME} <${FROM_EMAIL}>`;

/* ─── Types ──────────────────────────────────────────────────────────────── */
export interface ContactEmailData {
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
}

export interface NewsletterWelcomeData {
  subscriberEmail: string;
  subscriberName?: string;
  unsubscribeToken: string;
}

export interface EmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

/* ─── Envoi email confirmation contact (expéditeur) ─────────────────────── */
export async function sendContactConfirmation(
  data: ContactEmailData,
): Promise<EmailResult> {
  try {
    const resend = getResendClient();
    if (!resend) return { success: true, id: "dev-simulated" };
    const html = render(
      createElement(ContactConfirmationEmail, {
        senderName: data.senderName,
        senderEmail: data.senderEmail,
        subject: data.subject,
        message: data.message,
      }),
    );

    const result = await resend.emails.send({
      from: FROM,
      to: [data.senderEmail],
      subject: `✅ Message reçu — ${data.subject}`,
      html: await html,
      tags: [
        { name: "category", value: "contact_confirmation" },
        { name: "environment", value: process.env.NODE_ENV ?? "production" },
      ],
    });

    if (result.error) {
      return { success: false, error: result.error.message };
    }
    return { success: true, id: result.data?.id };
  } catch (err) {
    console.error("[Resend] sendContactConfirmation:", err);
    return { success: false, error: String(err) };
  }
}

/* ─── Envoi notification admin ───────────────────────────────────────────── */
export async function sendContactAdminNotification(
  data: ContactEmailData,
): Promise<EmailResult> {
  try {
    const resend = getResendClient();
    if (!resend) return { success: true, id: "dev-simulated" };
    const html = render(
      createElement(ContactAdminNotificationEmail, {
        senderName: data.senderName,
        senderEmail: data.senderEmail,
        subject: data.subject,
        message: data.message,
      }),
    );

    const result = await resend.emails.send({
      from: FROM,
      to: [ADMIN_EMAIL],
      reply_to: data.senderEmail,
      subject: `📬 Nouveau contact: ${data.subject} — ${data.senderName}`,
      html: await html,
      tags: [{ name: "category", value: "admin_notification" }],
    });

    if (result.error) {
      return { success: false, error: result.error.message };
    }
    return { success: true, id: result.data?.id };
  } catch (err) {
    console.error("[Resend] sendContactAdminNotification:", err);
    return { success: false, error: String(err) };
  }
}

/* ─── Envoi email bienvenue newsletter ───────────────────────────────────── */
export async function sendNewsletterWelcome(
  data: NewsletterWelcomeData,
): Promise<EmailResult> {
  try {
    const resend = getResendClient();
    if (!resend) return { success: true, id: "dev-simulated" };
    const html = render(
      createElement(NewsletterWelcomeEmail, {
        subscriberEmail: data.subscriberEmail,
        subscriberName: data.subscriberName,
        unsubscribeToken: data.unsubscribeToken,
      }),
    );

    const result = await resend.emails.send({
      from: FROM,
      to: [data.subscriberEmail],
      subject: "🌿 Bienvenue dans la communauté MRJC-BÉNIN !",
      html: await html,
      tags: [{ name: "category", value: "newsletter_welcome" }],
    });

    if (result.error) {
      return { success: false, error: result.error.message };
    }
    return { success: true, id: result.data?.id };
  } catch (err) {
    console.error("[Resend] sendNewsletterWelcome:", err);
    return { success: false, error: String(err) };
  }
}
