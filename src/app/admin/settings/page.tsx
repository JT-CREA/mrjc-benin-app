"use client";

/**
 * Page — Admin / Paramètres du Site
 * Route: /admin/settings
 * Sections :
 * - Informations générales du site
 * - SEO & Métadonnées
 * - Réseaux sociaux
 * - Email & Notifications
 * - Sécurité & Accès
 * - Apparence & Thème
 * - Maintenance
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Globe,
  Mail,
  Shield,
  Palette,
  AlertTriangle,
  Save,
  Check,
  ChevronRight,
  Bell,
  Eye,
  EyeOff,
  Zap,
  Link2,
  Code,
  Cpu,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Section {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
  color: string;
}

// ─── Sections de paramètres ───────────────────────────────────────────────────
const SECTIONS: Section[] = [
  {
    id: "general",
    label: "Général",
    icon: Globe,
    description: "Informations de base du site",
    color: "text-blue-600 bg-blue-50",
  },
  {
    id: "seo",
    label: "SEO & Métadonnées",
    icon: Zap,
    description: "Optimisation pour les moteurs",
    color: "text-purple-600 bg-purple-50",
  },
  {
    id: "social",
    label: "Réseaux Sociaux",
    icon: Link2,
    description: "Liens et intégrations sociales",
    color: "text-pink-600 bg-pink-50",
  },
  {
    id: "email",
    label: "Email & Notif.",
    icon: Mail,
    description: "Configuration des emails",
    color: "text-green-600 bg-green-50",
  },
  {
    id: "appearance",
    label: "Apparence",
    icon: Palette,
    description: "Thème, couleurs et polices",
    color: "text-orange-600 bg-orange-50",
  },
  {
    id: "security",
    label: "Sécurité",
    icon: Shield,
    description: "Accès et protection",
    color: "text-red-600 bg-red-50",
  },
  {
    id: "advanced",
    label: "Avancé",
    icon: Cpu,
    description: "Cache, performances, maintenance",
    color: "text-gray-600 bg-gray-50",
  },
];

// ─── États initiaux ───────────────────────────────────────────────────────────
const DEFAULTS = {
  general: {
    siteName: "MRJC-BÉNIN",
    siteFullName: "Mouvement Rural de Jeunesse Chrétienne du Bénin",
    tagline: "Développer le monde rural du Bénin",
    url: "https://mrjc-benin.org",
    email: "contact@mrjc-benin.org",
    phone: "+229 21 31 00 00",
    address: "Cotonou, Bénin, Afrique de l'Ouest",
    founded: "1985",
    language: "fr",
    timezone: "Africa/Porto-Novo",
  },
  seo: {
    defaultTitle: "MRJC-BÉNIN — Développement Rural & Social du Bénin",
    titleSeparator: " — ",
    metaDescription:
      "Depuis 1985, MRJC-BÉNIN accompagne les communautés rurales du Bénin vers l'autonomie et le développement durable.",
    keywords:
      "MRJC-BÉNIN, ONG Bénin, développement rural, agriculture, santé communautaire",
    googleAnalyticsId: "G-XXXXXXXXXX",
    googleSearchConsole: "",
    robotsTxt: "index, follow",
    sitemapEnabled: true,
    canonicalEnabled: true,
    structuredDataEnabled: true,
  },
  social: {
    facebook: "https://facebook.com/mrjcbenin",
    twitter: "https://twitter.com/mrjcbenin",
    linkedin: "https://linkedin.com/company/mrjcbenin",
    instagram: "https://instagram.com/mrjcbenin",
    youtube: "",
    openGraphImage: "/assets/images/og-home.jpg",
    twitterCard: "summary_large_image",
    socialShareEnabled: true,
  },
  email: {
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUser: "noreply@mrjc-benin.org",
    smtpPassword: "••••••••••••",
    fromName: "MRJC-BÉNIN",
    fromEmail: "noreply@mrjc-benin.org",
    replyTo: "contact@mrjc-benin.org",
    notifyOnContact: true,
    notifyOnNewsletter: true,
    notifyOnApplication: true,
    adminEmails: "f.ahouansou@mrjc-benin.org",
  },
  appearance: {
    primaryColor: "#2d6a2d",
    secondaryColor: "#e8500a",
    accentColor: "#4a7c59",
    fontDisplay: "Playfair Display",
    fontBody: "Inter",
    logoLight: "/assets/images/logo.png",
    logoDark: "/assets/images/logo-white.png",
    favicon: "/favicon.ico",
    customCSS: "",
    animationsEnabled: true,
    darkModeEnabled: false,
  },
  security: {
    sessionTimeout: "480",
    maxLoginAttempts: "5",
    lockoutDuration: "30",
    require2FA: false,
    allowedIPs: "",
    reCaptchaEnabled: true,
    reCaptchaSiteKey: "6LeXXXXXXXXXXXXXXXXXXXXX",
    contentSecurityPolicy: true,
    httpsForce: true,
  },
  advanced: {
    maintenanceMode: false,
    maintenanceMessage: "Site en maintenance. Revenez bientôt.",
    cacheEnabled: true,
    cacheDuration: "3600",
    compressionEnabled: true,
    lazyLoadImages: true,
    minifyCSS: true,
    minifyJS: true,
    headScripts: "",
    bodyScripts: "",
  },
};

// ─── Field Components ─────────────────────────────────────────────────────────
function FieldText({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
      />
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}

function FieldTextarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  hint?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
      />
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}

function FieldToggle({
  label,
  value,
  onChange,
  description,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        {description && (
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors ${value ? "bg-green-500" : "bg-gray-300"}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${value ? "translate-x-5" : ""}`}
        />
      </button>
    </div>
  );
}

function FieldColor({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-1"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none font-mono"
        />
      </div>
    </div>
  );
}

// ─── Page Principale ──────────────────────────────────────────────────────────
export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState("general");
  const [settings, setSettings] = useState(DEFAULTS);
  const [savedSection, setSavedSection] = useState<string | null>(null);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [maintenanceConfirm, setMaintenanceConfirm] = useState(false);

  function save(section: string) {
    setSavedSection(section);
    setTimeout(() => setSavedSection(null), 2500);
  }

  function update<K extends keyof typeof DEFAULTS>(
    section: K,
    field: string,
    value: string | boolean,
  ) {
    setSettings((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  }

  const s = settings;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary-600" />
          Paramètres du Site
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Configuration globale et personnalisation du site MRJC-BÉNIN
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar navigation */}
        <div className="lg:w-64 shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-2 space-y-1 sticky top-6">
            {SECTIONS.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                    isActive
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? sec.color : "bg-gray-100 text-gray-500"}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {sec.label}
                    </div>
                    <div className="text-xs text-gray-400 truncate hidden lg:block">
                      {sec.description}
                    </div>
                  </div>
                  {isActive && (
                    <ChevronRight className="w-4 h-4 text-primary-600" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Contenu */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* ── GÉNÉRAL ── */}
              {activeSection === "general" && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="p-6 border-b flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                      <Globe className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="font-bold text-gray-900">
                        Informations Générales
                      </h2>
                      <p className="text-sm text-gray-500">
                        Données de base de votre organisation
                      </p>
                    </div>
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FieldText
                      label="Nom court du site"
                      value={s.general.siteName}
                      onChange={(v) => update("general", "siteName", v)}
                    />
                    <div className="md:col-span-2">
                      <FieldText
                        label="Nom complet de l'organisation"
                        value={s.general.siteFullName}
                        onChange={(v) => update("general", "siteFullName", v)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <FieldText
                        label="Slogan / Tagline"
                        value={s.general.tagline}
                        onChange={(v) => update("general", "tagline", v)}
                      />
                    </div>
                    <FieldText
                      label="URL du site"
                      value={s.general.url}
                      onChange={(v) => update("general", "url", v)}
                      type="url"
                      hint="Inclure https://"
                    />
                    <FieldText
                      label="Email principal"
                      value={s.general.email}
                      onChange={(v) => update("general", "email", v)}
                      type="email"
                    />
                    <FieldText
                      label="Téléphone"
                      value={s.general.phone}
                      onChange={(v) => update("general", "phone", v)}
                      placeholder="+229 00 00 00 00"
                    />
                    <FieldText
                      label="Année de fondation"
                      value={s.general.founded}
                      onChange={(v) => update("general", "founded", v)}
                    />
                    <div className="md:col-span-2">
                      <FieldText
                        label="Adresse"
                        value={s.general.address}
                        onChange={(v) => update("general", "address", v)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Langue par défaut
                      </label>
                      <select
                        value={s.general.language}
                        onChange={(e) =>
                          update("general", "language", e.target.value)
                        }
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                      >
                        <option value="fr">Français</option>
                        <option value="en">English</option>
                        <option value="es">Español</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Fuseau horaire
                      </label>
                      <select
                        value={s.general.timezone}
                        onChange={(e) =>
                          update("general", "timezone", e.target.value)
                        }
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                      >
                        <option value="Africa/Porto-Novo">
                          Africa/Porto-Novo (UTC+1)
                        </option>
                        <option value="Africa/Abidjan">
                          Africa/Abidjan (UTC+0)
                        </option>
                        <option value="Europe/Paris">
                          Europe/Paris (UTC+1/+2)
                        </option>
                      </select>
                    </div>
                  </div>
                  <SaveBar
                    section="general"
                    saved={savedSection}
                    onSave={save}
                  />
                </div>
              )}

              {/* ── SEO ── */}
              {activeSection === "seo" && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="p-6 border-b flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                      <Zap className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="font-bold text-gray-900">
                        SEO & Métadonnées
                      </h2>
                      <p className="text-sm text-gray-500">
                        Optimisation pour les moteurs de recherche
                      </p>
                    </div>
                  </div>
                  <div className="p-6 grid grid-cols-1 gap-5">
                    <FieldText
                      label="Titre par défaut"
                      value={s.seo.defaultTitle}
                      onChange={(v) => update("seo", "defaultTitle", v)}
                      hint="Max 60 caractères recommandés"
                    />
                    <FieldTextarea
                      label="Description meta par défaut"
                      value={s.seo.metaDescription}
                      onChange={(v) => update("seo", "metaDescription", v)}
                      rows={3}
                      hint="Max 160 caractères recommandés"
                    />
                    <FieldTextarea
                      label="Mots-clés"
                      value={s.seo.keywords}
                      onChange={(v) => update("seo", "keywords", v)}
                      rows={2}
                      hint="Séparés par des virgules"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FieldText
                        label="Google Analytics ID"
                        value={s.seo.googleAnalyticsId}
                        onChange={(v) => update("seo", "googleAnalyticsId", v)}
                        placeholder="G-XXXXXXXXXX"
                      />
                      <FieldText
                        label="Google Search Console"
                        value={s.seo.googleSearchConsole}
                        onChange={(v) =>
                          update("seo", "googleSearchConsole", v)
                        }
                        placeholder="Code de vérification"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FieldToggle
                        label="Sitemap XML"
                        value={s.seo.sitemapEnabled}
                        onChange={(v) => update("seo", "sitemapEnabled", v)}
                        description="Générer /sitemap.xml"
                      />
                      <FieldToggle
                        label="URLs canoniques"
                        value={s.seo.canonicalEnabled}
                        onChange={(v) => update("seo", "canonicalEnabled", v)}
                        description="Balises canonical"
                      />
                    </div>
                    <FieldToggle
                      label="Données structurées (JSON-LD)"
                      value={s.seo.structuredDataEnabled}
                      onChange={(v) =>
                        update("seo", "structuredDataEnabled", v)
                      }
                      description="Schema.org markup sur chaque page"
                    />
                  </div>
                  <SaveBar section="seo" saved={savedSection} onSave={save} />
                </div>
              )}

              {/* ── RÉSEAUX SOCIAUX ── */}
              {activeSection === "social" && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="p-6 border-b flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center">
                      <Link2 className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                      <h2 className="font-bold text-gray-900">
                        Réseaux Sociaux
                      </h2>
                      <p className="text-sm text-gray-500">
                        Liens vers vos profils et Open Graph
                      </p>
                    </div>
                  </div>
                  <div className="p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {[
                        {
                          key: "facebook",
                          icon: "📘",
                          label: "Facebook",
                          placeholder: "https://facebook.com/...",
                        },
                        {
                          key: "twitter",
                          icon: "𝕏",
                          label: "Twitter / X",
                          placeholder: "https://twitter.com/...",
                        },
                        {
                          key: "linkedin",
                          icon: "💼",
                          label: "LinkedIn",
                          placeholder: "https://linkedin.com/...",
                        },
                        {
                          key: "instagram",
                          icon: "📸",
                          label: "Instagram",
                          placeholder: "https://instagram.com/...",
                        },
                        {
                          key: "youtube",
                          icon: "▶️",
                          label: "YouTube",
                          placeholder: "https://youtube.com/...",
                        },
                      ].map(({ key, icon, label, placeholder }) => (
                        <div key={key}>
                          <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5 block">
                            <span>{icon}</span> {label}
                          </label>
                          <input
                            type="url"
                            value={
                              (s.social as unknown as Record<string, any>)[
                                key
                              ] || ""
                            }
                            onChange={(e) =>
                              update("social", key, e.target.value)
                            }
                            placeholder={placeholder}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                          />
                        </div>
                      ))}
                    </div>
                    <FieldText
                      label="Image Open Graph par défaut"
                      value={s.social.openGraphImage}
                      onChange={(v) => update("social", "openGraphImage", v)}
                      hint="Chemin ou URL de l'image (1200×630px recommandé)"
                    />
                    <FieldToggle
                      label="Boutons de partage social"
                      value={s.social.socialShareEnabled}
                      onChange={(v) =>
                        update("social", "socialShareEnabled", v)
                      }
                      description="Afficher les boutons de partage sur les articles"
                    />
                  </div>
                  <SaveBar
                    section="social"
                    saved={savedSection}
                    onSave={save}
                  />
                </div>
              )}

              {/* ── EMAIL ── */}
              {activeSection === "email" && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="p-6 border-b flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                      <Mail className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h2 className="font-bold text-gray-900">
                        Email & Notifications
                      </h2>
                      <p className="text-sm text-gray-500">
                        Configuration SMTP et alertes administrateur
                      </p>
                    </div>
                  </div>
                  <div className="p-6 space-y-5">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-700 flex items-start gap-2">
                      <Bell className="w-4 h-4 mt-0.5 shrink-0" />
                      <p>
                        Assurez-vous que les informations SMTP sont correctes
                        avant de sauvegarder pour éviter tout problème d'envoi
                        d'emails.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FieldText
                        label="Serveur SMTP"
                        value={s.email.smtpHost}
                        onChange={(v) => update("email", "smtpHost", v)}
                      />
                      <FieldText
                        label="Port SMTP"
                        value={s.email.smtpPort}
                        onChange={(v) => update("email", "smtpPort", v)}
                      />
                      <FieldText
                        label="Utilisateur SMTP"
                        value={s.email.smtpUser}
                        onChange={(v) => update("email", "smtpUser", v)}
                        type="email"
                      />
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                          Mot de passe SMTP
                        </label>
                        <div className="relative">
                          <input
                            type={showPasswordField ? "text" : "password"}
                            value={s.email.smtpPassword}
                            onChange={(e) =>
                              update("email", "smtpPassword", e.target.value)
                            }
                            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none pr-10"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowPasswordField(!showPasswordField)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPasswordField ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FieldText
                        label="Nom d'expéditeur"
                        value={s.email.fromName}
                        onChange={(v) => update("email", "fromName", v)}
                      />
                      <FieldText
                        label="Email d'expéditeur"
                        value={s.email.fromEmail}
                        onChange={(v) => update("email", "fromEmail", v)}
                        type="email"
                      />
                    </div>
                    <FieldText
                      label="Emails admin (notifications)"
                      value={s.email.adminEmails}
                      onChange={(v) => update("email", "adminEmails", v)}
                      hint="Séparés par des virgules pour plusieurs destinataires"
                    />
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-gray-800">
                        Notifications automatiques
                      </h4>
                      <FieldToggle
                        label="Nouveau message de contact"
                        value={s.email.notifyOnContact}
                        onChange={(v) => update("email", "notifyOnContact", v)}
                      />
                      <FieldToggle
                        label="Nouvel abonné newsletter"
                        value={s.email.notifyOnNewsletter}
                        onChange={(v) =>
                          update("email", "notifyOnNewsletter", v)
                        }
                      />
                      <FieldToggle
                        label="Nouvelle candidature / stage"
                        value={s.email.notifyOnApplication}
                        onChange={(v) =>
                          update("email", "notifyOnApplication", v)
                        }
                      />
                    </div>
                  </div>
                  <SaveBar section="email" saved={savedSection} onSave={save} />
                </div>
              )}

              {/* ── APPARENCE ── */}
              {activeSection === "appearance" && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="p-6 border-b flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                      <Palette className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h2 className="font-bold text-gray-900">
                        Apparence & Thème
                      </h2>
                      <p className="text-sm text-gray-500">
                        Couleurs, polices et éléments visuels
                      </p>
                    </div>
                  </div>
                  <div className="p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FieldColor
                        label="Couleur principale"
                        value={s.appearance.primaryColor}
                        onChange={(v) =>
                          update("appearance", "primaryColor", v)
                        }
                      />
                      <FieldColor
                        label="Couleur secondaire"
                        value={s.appearance.secondaryColor}
                        onChange={(v) =>
                          update("appearance", "secondaryColor", v)
                        }
                      />
                      <FieldColor
                        label="Couleur d'accent"
                        value={s.appearance.accentColor}
                        onChange={(v) => update("appearance", "accentColor", v)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FieldText
                        label="Police titres (Google Fonts)"
                        value={s.appearance.fontDisplay}
                        onChange={(v) => update("appearance", "fontDisplay", v)}
                      />
                      <FieldText
                        label="Police corps de texte"
                        value={s.appearance.fontBody}
                        onChange={(v) => update("appearance", "fontBody", v)}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FieldText
                        label="Logo (fond clair)"
                        value={s.appearance.logoLight}
                        onChange={(v) => update("appearance", "logoLight", v)}
                      />
                      <FieldText
                        label="Logo (fond sombre)"
                        value={s.appearance.logoDark}
                        onChange={(v) => update("appearance", "logoDark", v)}
                      />
                      <FieldText
                        label="Favicon"
                        value={s.appearance.favicon}
                        onChange={(v) => update("appearance", "favicon", v)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <FieldToggle
                        label="Animations Framer Motion"
                        value={s.appearance.animationsEnabled}
                        onChange={(v) =>
                          update("appearance", "animationsEnabled", v)
                        }
                        description="Transitions et effets visuels"
                      />
                      <FieldToggle
                        label="Mode sombre"
                        value={s.appearance.darkModeEnabled}
                        onChange={(v) =>
                          update("appearance", "darkModeEnabled", v)
                        }
                        description="Bascule auto selon préférence OS"
                      />
                    </div>
                    <FieldTextarea
                      label="CSS personnalisé"
                      value={s.appearance.customCSS}
                      onChange={(v) => update("appearance", "customCSS", v)}
                      rows={5}
                      placeholder="/* Vos styles personnalisés */"
                      hint="Injecté dans la balise <head> de chaque page"
                    />
                  </div>
                  <SaveBar
                    section="appearance"
                    saved={savedSection}
                    onSave={save}
                  />
                </div>
              )}

              {/* ── SÉCURITÉ ── */}
              {activeSection === "security" && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="p-6 border-b flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                      <Shield className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h2 className="font-bold text-gray-900">
                        Sécurité & Accès
                      </h2>
                      <p className="text-sm text-gray-500">
                        Protection et configuration des sessions
                      </p>
                    </div>
                  </div>
                  <div className="p-6 space-y-5">
                    <div className="grid grid-cols-3 gap-4">
                      <FieldText
                        label="Timeout session (min)"
                        value={s.security.sessionTimeout}
                        onChange={(v) =>
                          update("security", "sessionTimeout", v)
                        }
                        hint="Déconnexion auto après inactivité"
                      />
                      <FieldText
                        label="Tentatives max connexion"
                        value={s.security.maxLoginAttempts}
                        onChange={(v) =>
                          update("security", "maxLoginAttempts", v)
                        }
                      />
                      <FieldText
                        label="Verrouillage (min)"
                        value={s.security.lockoutDuration}
                        onChange={(v) =>
                          update("security", "lockoutDuration", v)
                        }
                      />
                    </div>
                    <FieldTextarea
                      label="IPs autorisées (admin)"
                      value={s.security.allowedIPs}
                      onChange={(v) => update("security", "allowedIPs", v)}
                      rows={2}
                      placeholder="192.168.1.0/24, 10.0.0.1"
                      hint="Laisser vide pour tout autoriser. Séparées par virgule."
                    />
                    <div className="space-y-2">
                      <FieldToggle
                        label="2FA obligatoire pour les admins"
                        value={s.security.require2FA}
                        onChange={(v) => update("security", "require2FA", v)}
                        description="Force l'authentification à 2 facteurs"
                      />
                      <FieldToggle
                        label="reCAPTCHA sur les formulaires"
                        value={s.security.reCaptchaEnabled}
                        onChange={(v) =>
                          update("security", "reCaptchaEnabled", v)
                        }
                        description="Google reCAPTCHA v3"
                      />
                      <FieldToggle
                        label="Content Security Policy"
                        value={s.security.contentSecurityPolicy}
                        onChange={(v) =>
                          update("security", "contentSecurityPolicy", v)
                        }
                        description="En-têtes CSP de sécurité"
                      />
                      <FieldToggle
                        label="Forcer HTTPS"
                        value={s.security.httpsForce}
                        onChange={(v) => update("security", "httpsForce", v)}
                        description="Rediriger HTTP vers HTTPS automatiquement"
                      />
                    </div>
                    {s.security.reCaptchaEnabled && (
                      <FieldText
                        label="Clé site reCAPTCHA"
                        value={s.security.reCaptchaSiteKey}
                        onChange={(v) =>
                          update("security", "reCaptchaSiteKey", v)
                        }
                      />
                    )}
                  </div>
                  <SaveBar
                    section="security"
                    saved={savedSection}
                    onSave={save}
                  />
                </div>
              )}

              {/* ── AVANCÉ ── */}
              {activeSection === "advanced" && (
                <div className="space-y-4">
                  {/* Maintenance */}
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <h2 className="font-bold text-gray-900">
                          Mode Maintenance
                        </h2>
                        <p className="text-sm text-gray-500">
                          Rendre le site temporairement inaccessible aux
                          visiteurs
                        </p>
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      <div
                        className={`p-4 rounded-xl border ${s.advanced.maintenanceMode ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-100"}`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p
                              className={`font-semibold ${s.advanced.maintenanceMode ? "text-red-700" : "text-gray-700"}`}
                            >
                              {s.advanced.maintenanceMode
                                ? "⚠️ Maintenance ACTIVÉE"
                                : "Maintenance désactivée"}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {s.advanced.maintenanceMode
                                ? "Le site est inaccessible aux visiteurs"
                                : "Le site est accessible normalement"}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              if (
                                !s.advanced.maintenanceMode ||
                                maintenanceConfirm
                              ) {
                                update(
                                  "advanced",
                                  "maintenanceMode",
                                  !s.advanced.maintenanceMode,
                                );
                                setMaintenanceConfirm(false);
                              } else {
                                setMaintenanceConfirm(true);
                              }
                            }}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              s.advanced.maintenanceMode
                                ? "bg-green-500 hover:bg-green-600 text-white"
                                : "bg-red-500 hover:bg-red-600 text-white"
                            }`}
                          >
                            {s.advanced.maintenanceMode
                              ? "Désactiver"
                              : maintenanceConfirm
                                ? "Confirmer ?"
                                : "Activer"}
                          </button>
                        </div>
                      </div>
                      <FieldTextarea
                        label="Message de maintenance"
                        value={s.advanced.maintenanceMessage}
                        onChange={(v) =>
                          update("advanced", "maintenanceMessage", v)
                        }
                        rows={2}
                      />
                    </div>
                  </div>

                  {/* Performance */}
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                    <div className="p-6 border-b">
                      <h2 className="font-bold text-gray-900 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-orange-500" /> Performance
                      </h2>
                    </div>
                    <div className="p-6 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <FieldToggle
                          label="Cache activé"
                          value={s.advanced.cacheEnabled}
                          onChange={(v) =>
                            update("advanced", "cacheEnabled", v)
                          }
                        />
                        <FieldToggle
                          label="Compression Gzip/Brotli"
                          value={s.advanced.compressionEnabled}
                          onChange={(v) =>
                            update("advanced", "compressionEnabled", v)
                          }
                        />
                        <FieldToggle
                          label="Lazy loading images"
                          value={s.advanced.lazyLoadImages}
                          onChange={(v) =>
                            update("advanced", "lazyLoadImages", v)
                          }
                        />
                        <FieldToggle
                          label="Minification CSS"
                          value={s.advanced.minifyCSS}
                          onChange={(v) => update("advanced", "minifyCSS", v)}
                        />
                      </div>
                      {s.advanced.cacheEnabled && (
                        <FieldText
                          label="Durée du cache (secondes)"
                          value={s.advanced.cacheDuration}
                          onChange={(v) =>
                            update("advanced", "cacheDuration", v)
                          }
                          hint="3600 = 1 heure"
                        />
                      )}
                    </div>
                  </div>

                  {/* Scripts personnalisés */}
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                    <div className="p-6 border-b">
                      <h2 className="font-bold text-gray-900 flex items-center gap-2">
                        <Code className="w-4 h-4 text-gray-600" /> Scripts
                        Personnalisés
                      </h2>
                    </div>
                    <div className="p-6 space-y-4">
                      <FieldTextarea
                        label="Scripts dans <head>"
                        value={s.advanced.headScripts}
                        onChange={(v) => update("advanced", "headScripts", v)}
                        rows={3}
                        placeholder="<!-- Analytiques, pixels de suivi... -->"
                      />
                      <FieldTextarea
                        label="Scripts avant </body>"
                        value={s.advanced.bodyScripts}
                        onChange={(v) => update("advanced", "bodyScripts", v)}
                        rows={3}
                        placeholder="<!-- Chatbot, widgets externes... -->"
                      />
                    </div>
                  </div>

                  <SaveBar
                    section="advanced"
                    saved={savedSection}
                    onSave={save}
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ─── Barre de sauvegarde ──────────────────────────────────────────────────────
function SaveBar({
  section,
  saved,
  onSave,
}: {
  section: string;
  saved: string | null;
  onSave: (s: string) => void;
}) {
  const isSaved = saved === section;
  return (
    <div className="p-4 border-t bg-gray-50/80 flex items-center justify-end gap-3">
      <AnimatePresence>
        {isSaved && (
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1.5 text-sm text-green-600 font-medium"
          >
            <Check className="w-4 h-4" /> Sauvegardé !
          </motion.span>
        )}
      </AnimatePresence>
      <button
        onClick={() => onSave(section)}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
          isSaved
            ? "bg-green-500 text-white"
            : "bg-primary-600 hover:bg-primary-700 text-white shadow-sm"
        }`}
      >
        {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
        {isSaved ? "Sauvegardé" : "Sauvegarder"}
      </button>
    </div>
  );
}
