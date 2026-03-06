/**
 * lib/utils/slugify.ts
 * Conversion de chaînes en slugs URL-safe
 * Support des caractères français, africains et latins étendus
 */

const CHAR_MAP: Record<string, string> = {
  // Lettres accentuées françaises
  à: "a",
  â: "a",
  ä: "a",
  á: "a",
  ã: "a",
  å: "a",
  è: "e",
  é: "e",
  ê: "e",
  ë: "e",
  î: "i",
  ï: "i",
  ì: "i",
  í: "i",
  ô: "o",
  ö: "o",
  ò: "o",
  ó: "o",
  õ: "o",
  ø: "o",
  ù: "u",
  ú: "u",
  û: "u",
  ü: "u",
  ÿ: "y",
  ý: "y",
  ç: "c",
  ñ: "n",
  æ: "ae",
  œ: "oe",
  ß: "ss",
  // Majuscules
  À: "a",
  Â: "a",
  Ä: "a",
  Á: "a",
  Ã: "a",
  Å: "a",
  È: "e",
  É: "e",
  Ê: "e",
  Ë: "e",
  Î: "i",
  Ï: "i",
  Ì: "i",
  Í: "i",
  Ô: "o",
  Ö: "o",
  Ò: "o",
  Ó: "o",
  Õ: "o",
  Ø: "o",
  Ù: "u",
  Ú: "u",
  Û: "u",
  Ü: "u",
  Ç: "c",
  Ñ: "n",
  Æ: "ae",
  Œ: "oe",
};

/**
 * Convertit une chaîne en slug URL-safe
 * @param str    - Chaîne source
 * @param sep    - Séparateur (défaut: '-')
 * @param maxLen - Longueur maximale (défaut: 100)
 */
export function slugify(str: string, sep = "-", maxLen = 100): string {
  return str
    .split("")
    .map((c) => CHAR_MAP[c] ?? c)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9\s-_]/g, "") // Garder lettres, chiffres, espaces, tirets
    .trim()
    .replace(/[\s_-]+/g, sep) // Remplacer espaces/tirets multiples
    .replace(new RegExp(`^${sep}|${sep}$`, "g"), "") // Trim séparateurs en début/fin
    .slice(0, maxLen);
}

/**
 * Convertit un slug en titre lisible
 * @param slug - Slug URL
 */
export function deslugify(slug: string): string {
  return slug.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Génère un slug unique en ajoutant un suffixe numérique si nécessaire
 * @param base     - Slug de base
 * @param existing - Liste des slugs déjà existants
 */
export function uniqueSlug(base: string, existing: string[]): string {
  let candidate = slugify(base);
  let counter = 1;
  while (existing.includes(candidate)) {
    candidate = `${slugify(base)}-${counter}`;
    counter++;
  }
  return candidate;
}

/**
 * Vérifie si une chaîne est un slug valide
 */
export function isValidSlug(str: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(str);
}
