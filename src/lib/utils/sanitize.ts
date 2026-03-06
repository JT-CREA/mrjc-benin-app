/**
 * lib/utils/sanitize.ts
 * Nettoyage de contenu HTML / texte
 * Utilise sanitize-html (déjà dans package.json)
 *
 * IMPORTANT : Ne jamais afficher du HTML non sanitisé côté client.
 */

import baseSanitize from "sanitize-html";

/* ─── Configurations de nettoyage ────────────────────────────────────────── */

/** * Texte brut : supprime absolument tout le HTML
 */
export function stripHtml(html: string): string {
  if (!html) return "";
  // CORRECTION : On utilise baseSanitize (la lib) et non l'alias local sanitizeHtml
  return baseSanitize(html, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();
}

/** * Contenu éditorial riche (articles, pages)
 * Autorise une structure HTML sécurisée pour le rendu
 */
export function sanitizeRichText(html: string): string {
  if (!html) return "";
  return baseSanitize(html, {
    allowedTags: [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "br",
      "hr",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "s",
      "del",
      "ins",
      "mark",
      "small",
      "ul",
      "ol",
      "li",
      "blockquote",
      "pre",
      "code",
      "a",
      "img",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "caption",
      "figure",
      "figcaption",
      "sup",
      "sub",
      "div",
      "span",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "loading"],
      "*": ["class", "id"],
      th: ["scope"],
      td: ["colspan", "rowspan"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          // Sécuriser les liens externes automatiquement
          ...(attribs.href?.startsWith("http") && {
            target: "_blank",
            rel: "noopener noreferrer",
          }),
        },
      }),
    },
  });
}

/** * Texte simple pour formulaires (pas de HTML du tout)
 */
export function sanitizeText(input: string, maxLength = 5000): string {
  if (!input) return "";
  return stripHtml(input).slice(0, maxLength).replace(/\s+/g, " ").trim();
}

/** * Sanitize un email
 */
export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim().slice(0, 254);
}

/** * Sanitize une URL (doit être valide et sécurisée)
 */
export function sanitizeUrl(url: string): string | null {
  const trimmed = url.trim();
  try {
    const parsed = new URL(trimmed);
    if (!["http:", "https:"].includes(parsed.protocol)) return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

/** * Escape les caractères spéciaux pour prévenir les injections de base
 */
export function escapeString(str: string): string {
  return str.replace(/[<>"'`=\/]/g, (c) => {
    const map: Record<string, string> = {
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#x27;",
      "`": "&#x60;",
      "=": "&#x3D;",
      "/": "&#x2F;",
    };
    return map[c] ?? c;
  });
}

/**
 * Nettoie récursivement un objet de données de formulaire
 */
export function sanitizeFormData<T extends Record<string, unknown>>(
  data: T,
): T {
  const result = { ...data };
  for (const [key, value] of Object.entries(result)) {
    if (typeof value === "string") {
      (result as Record<string, unknown>)[key] = sanitizeText(value);
    }
  }
  return result;
}

/**
 * Alias sanitizeHtml — utilisé par les routes admin.
 * Note : Dans cette architecture, sanitizeHtml effectue un nettoyage STRICT (pas de HTML).
 * Pour du HTML riche, utilisez sanitizeRichText.
 */
export function sanitizeHtml(input: string, maxLength = 5000): string {
  return sanitizeText(input, maxLength);
}
