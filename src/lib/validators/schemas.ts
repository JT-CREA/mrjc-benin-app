/**
 * lib/validators/schemas.ts
 * Schémas de validation Zod pour toutes les routes API
 */

import { z } from "zod";

/* ─── Contact ─────────────────────────────────────────────────────────────── */
export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères.")
    .max(100, "Le nom est trop long.")
    .trim(),

  email: z
    .string()
    .email("Adresse email invalide.")
    .max(254, "Email trop long.")
    .toLowerCase()
    .trim(),

  subject: z
    .string()
    .min(5, "Le sujet doit contenir au moins 5 caractères.")
    .max(200, "Le sujet est trop long.")
    .trim(),

  message: z
    .string()
    .min(20, "Le message doit contenir au moins 20 caractères.")
    .max(5000, "Le message ne peut pas dépasser 5 000 caractères.")
    .trim(),

  phone: z
    .string()
    .max(20)
    .regex(/^[+\d\s\-().]*$/, "Numéro de téléphone invalide.")
    .optional()
    .or(z.literal("")),

  organization: z
    .string()
    .max(100, "Nom d'organisation trop long.")
    .optional()
    .or(z.literal("")),

  type: z
    .enum(["general", "partnership", "media", "volunteer", "other"])
    .default("general"),

  // Honeypot anti-spam (doit rester vide)
  website: z.string().max(0, "Champ invalide.").optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

/* ─── Newsletter ─────────────────────────────────────────────────────────── */
export const newsletterSubscribeSchema = z.object({
  email: z
    .string()
    .email("Adresse email invalide.")
    .max(254)
    .toLowerCase()
    .trim(),

  name: z.string().max(100).trim().optional().or(z.literal("")),

  // Consentement RGPD (obligatoire)
  consent: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter de recevoir notre newsletter.",
  }),
});

export type NewsletterSubscribeInput = z.infer<
  typeof newsletterSubscribeSchema
>;

export const newsletterUnsubscribeSchema = z
  .object({
    email: z
      .string()
      .email("Adresse email invalide.")
      .toLowerCase()
      .trim()
      .optional(),

    token: z.string().min(10, "Token invalide.").optional(),
  })
  .refine((data) => data.email || data.token, {
    message: "Email ou token requis.",
  });

export type NewsletterUnsubscribeInput = z.infer<
  typeof newsletterUnsubscribeSchema
>;

/* ─── Visiteurs / Analytics ──────────────────────────────────────────────── */
export const visitorEventSchema = z.object({
  path: z.string().max(500).startsWith("/", "Le chemin doit commencer par /"),

  referrer: z.string().url().max(1000).optional().or(z.literal("")),

  sessionId: z.string().uuid("Session ID invalide.").optional(),
});

export type VisitorEventInput = z.infer<typeof visitorEventSchema>;

/* ─── Téléchargements ────────────────────────────────────────────────────── */
export const downloadEventSchema = z.object({
  resourceId: z.string().min(1, "ID de ressource requis.").max(100),

  resourceTitle: z.string().max(500).optional(),

  fileType: z.enum(["pdf", "doc", "xls", "ppt", "zip", "other"]).default("pdf"),
});

export type DownloadEventInput = z.infer<typeof downloadEventSchema>;

/* ─── Revalidation ───────────────────────────────────────────────────────── */
export const revalidateSchema = z
  .object({
    secret: z.string().min(1, "Secret requis."),

    path: z
      .string()
      .startsWith("/", "Le chemin doit commencer par /")
      .optional(),

    tag: z.string().max(100).optional(),
  })
  .refine((data) => data.path || data.tag, { message: "path ou tag requis." });

export type RevalidateInput = z.infer<typeof revalidateSchema>;

/* ─── Helper de validation générique ────────────────────────────────────── */
export function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
):
  | { success: true; data: T }
  | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const field = issue.path.join(".") || "global";
    errors[field] = issue.message;
  }

  return { success: false, errors };
}
