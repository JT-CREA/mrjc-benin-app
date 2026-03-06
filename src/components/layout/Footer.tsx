"use client";

/**
 * Footer.tsx — MRJC-BÉNIN
 *
 * CORRECTIONS :
 *  ✅ Bas de page agrandi (text-base) et très lisible
 *  ✅ Mention développeur JT-Créa / Josué TAMADAHO bien visible
 *  ✅ Couleurs charte logo MRJC (vert forêt, jaune Bénin, marine)
 *  ✅ Inline styles pour garantir les couleurs sans Tailwind
 */

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import {
  MapPin,
  Phone,
  Mail,
  Send,
  ArrowRight,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Instagram,
  CheckCircle,
  AlertCircle,
  Code2,
  ChevronRight,
} from "lucide-react";
import { siteConfig } from "@/config/site.config";
import { footerNavigation } from "@/config/navigation.config";
import { cn } from "@/lib/utils/cn";

const VisitorCounter = dynamic(() => import("@/components/ui/VisitorCounter"), {
  ssr: false,
});

/* ─── Réseaux sociaux ────────────────────────────────────────────────────────*/
const socialLinks = [
  {
    label: "Facebook",
    href: siteConfig.social.facebook,
    icon: Facebook,
    hoverBg: "hover:bg-blue-600",
  },
  {
    label: "Twitter/X",
    href: `https://twitter.com/${siteConfig.social.twitter?.replace("@", "")}`,
    icon: Twitter,
    hoverBg: "hover:bg-sky-500",
  },
  {
    label: "LinkedIn",
    href: siteConfig.social.linkedin,
    icon: Linkedin,
    hoverBg: "hover:bg-blue-700",
  },
  {
    label: "YouTube",
    href: siteConfig.social.youtube,
    icon: Youtube,
    hoverBg: "hover:bg-red-600",
  },
  {
    label: "Instagram",
    href: siteConfig.social.instagram,
    icon: Instagram,
    hoverBg: "hover:bg-pink-600",
  },
];

/* ─── Newsletter ─────────────────────────────────────────────────────────────*/
function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setMessage("Adresse email invalide.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setMessage("Inscription réussie ! Vérifiez votre boîte mail.");
        setEmail("");
      } else throw new Error();
    } catch {
      setStatus("error");
      setMessage("Une erreur est survenue. Réessayez.");
    }
    setTimeout(() => setStatus("idle"), 6000);
  };

  return (
    <div>
      <h3 className="font-sans font-bold text-white text-xl mb-2">
        Restez Informé
      </h3>
      <p className="text-sm text-primary-50 mb-5 leading-relaxed">
        Recevez nos actualités, publications et appels à projets directement
        dans votre boîte mail.
      </p>
      {status === "success" ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2.5 bg-green-900/30 border border-green-700/50
                     text-green-300 rounded-xl px-4 py-3"
        >
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{message}</span>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse email"
              disabled={status === "loading"}
              className="flex-1 px-4 py-3 rounded-xl text-sm text-white placeholder:text-primary-50
                         focus:outline-none focus:ring-2 focus:ring-yellow-400
                         transition-all min-w-0 disabled:opacity-60 font-sans"
              style={{
                background: "rgba(15,61,34,0.8)",
                border: "1px solid rgba(27,107,58,0.5)",
              }}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="flex-shrink-0 px-5 py-3 rounded-xl text-sm font-bold transition-all
                         flex items-center gap-2 disabled:opacity-60 hover:-translate-y-0.5 active:translate-y-0"
              style={{ background: "#FFC600", color: "#1a1a2e" }}
            >
              {status === "loading" ? (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="block w-4 h-4 border-2 border-black/30 border-t-black rounded-full"
                />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span className="hidden sm:block">S'abonner</span>
            </button>
          </div>
          {status === "error" && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-1.5 text-red-300 text-xs font-medium"
            >
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              {message}
            </motion.p>
          )}
          <p className="text-xs text-primary-200">
            Pas de spam. Désabonnement facile.{" "}
            <Link
              href="/privacy-policy"
              className="underline hover:text-primary-100 transition-colors"
            >
              Confidentialité
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}

/* ─── Colonne de liens ───────────────────────────────────────────────────────*/
function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3
        className="font-sans font-extrabold text-white text-xs uppercase tracking-widest mb-5
                     border-b border-primary-700 pb-3"
      >
        {title}
      </h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group flex items-center gap-1.5 text-sm text-primary-300
                         hover:text-white transition-colors duration-150"
            >
              <ChevronRight
                className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100
                                       -translate-x-1 group-hover:translate-x-0
                                       transition-all duration-150 flex-shrink-0"
                style={{ color: "#FFC600" }}
              />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─── Footer Principal ───────────────────────────────────────────────────────*/
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{ background: "#05013a" }}
      className="text-white no-print"
      aria-label="Pied de page"
    >
      {/* ══ Bandeau CTA ══ */}
      <div
        style={{
          background:
            "linear-gradient(90deg, #0a3019 0%, #1B6B3A 50%, #0a3019 100%)",
          borderBottom: "1px solid rgba(27,107,58,0.5)",
        }}
      >
        <div className="container-mrjc py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h2 className="font-sans font-bold text-2xl md:text-3xl text-white mb-1 tracking-tight">
                Ensemble, changeons des vies
              </h2>
              <p className="text-primary-50 text-sm md:text-base font-medium">
                Votre soutien nous permet d'amplifier notre impact au Bénin.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm
                           hover:-translate-y-0.5 transition-all"
                style={{
                  background: "#FFC600",
                  color: "#1a1a2e",
                  boxShadow: "0 4px 14px rgba(255,198,0,0.3)",
                }}
              >
                <Mail className="w-4 h-4" /> Nous contacter
              </Link>
              <Link
                href="/work-with-us/volunteers"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm
                           hover:-translate-y-0.5 transition-all text-primary-200"
                style={{ border: "2px solid rgba(27,107,58,0.6)" }}
              >
                Devenir Bénévole <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ══ Corps ══ */}
      <div className="container-mrjc py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-10 xl:gap-8">
          {/* Identité */}
          <div className="xl:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src="/assets/images/logo.svg"
                  alt="Logo MRJC-BÉNIN"
                  fill
                  unoptimized
                  className="object-contain group-hover:scale-105 transition-transform"
                  sizes="48px"
                  onError={() => {}}
                />
              </div>
              <div>
                <div
                  className="font-sans font-black text-xl text-white
                                group-hover:text-primary-200 transition-colors tracking-tight"
                >
                  MRJC-BÉNIN
                </div>
                <div className="text-xs text-primary-200 leading-none mt-0.5 font-medium">
                  Dignité Humaine - Transparence - Equité & Genre
                </div>
              </div>
            </Link>

            <p className="text-sm text-primary-100 leading-relaxed max-w-sm">
              ONG béninoise œuvrant pour le développement rural durable depuis{" "}
              <span className="text-white font-semibold">
                {siteConfig.founded}
              </span>
              . Nous accompagnons les communautés rurales vers l'autonomie et la
              dignité.
            </p>

            <div className="space-y-2.5">
              <a
                href={`tel:${siteConfig.contact.phone}`}
                className="flex items-center gap-2.5 text-sm text-primary-50 hover:text-white transition-colors"
              >
                <Phone
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: "#FFC600" }}
                />
                <span className="font-medium">{siteConfig.contact.phone}</span>
              </a>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="flex items-center gap-2.5 text-sm text-primary-50 hover:text-white transition-colors"
              >
                <Mail
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: "#FFC600" }}
                />
                <span className="font-medium">{siteConfig.contact.email}</span>
              </a>
              <div className="flex items-start gap-2.5 text-sm text-primary-50">
                <MapPin
                  className="w-4 h-4 flex-shrink-0 mt-0.5"
                  style={{ color: "#FFC600" }}
                />
                <span className="font-medium">
                  {siteConfig.contact.addressFull}
                </span>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-primary-200 mb-3">
                Suivez-nous
              </p>
              <div className="flex items-center gap-2">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className={cn(
                      "w-9 h-9 rounded-xl flex items-center justify-center",
                      "text-primary-50 hover:text-white hover:-translate-y-0.5",
                      "transition-all duration-150",
                      s.hoverBg,
                    )}
                    style={{ background: "rgba(15,61,34,0.8)" }}
                  >
                    <s.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <FooterColumn
            title="Organisation"
            links={footerNavigation.organisation}
          />
          <FooterColumn title="Nos Actions" links={footerNavigation.actions} />
          <FooterColumn title="Ressources" links={footerNavigation.resources} />
        </div>

        {/* Newsletter + Stats */}
        <div
          className="mt-12 pt-12"
          style={{ borderTop: "1px solid rgba(27,107,58,0.4)" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <FooterNewsletter />
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-4">
              {[
                { label: "Bénéficiaires", value: "85 000+", emoji: "👥" },
                { label: "Projets", value: "47", emoji: "📋" },
                { label: "Villages", value: "230+", emoji: "🏘️" },
                { label: "Partenaires", value: "35+", emoji: "🤝" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl p-4 text-center transition-colors hover:-translate-y-0.5 duration-150"
                  style={{
                    background: "rgba(10,48,25,0.8)",
                    border: "1px solid rgba(27,107,58,0.4)",
                  }}
                >
                  <div className="text-2xl mb-1.5">{s.emoji}</div>
                  <div className="font-sans font-black text-xl text-white">
                    {s.value}
                  </div>
                  <div className="text-xs text-primary-100 mt-1 font-medium">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Visiteurs */}
        <div
          className="mt-10 pt-8 flex justify-center"
          style={{ borderTop: "1px solid rgba(27,107,58,0.4)" }}
        >
          <VisitorCounter variant="widget" />
        </div>
      </div>

      {/* ══ BARRE LÉGALE ══════════════════════════════════════════════════════
          Texte agrandi (text-base), bien contrasté sur fond très sombre
          ═══════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          borderTop: "1px solid rgba(27,107,58,0.6)",
          background: "#05013a",
        }}
      >
        <div className="container-mrjc py-8">
          {/* Copyright + Liens légaux */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <p className="text-base text-primary-300 text-center md:text-left font-medium">
              © {currentYear}{" "}
              <span className="text-white font-bold">
                {siteConfig.fullName}
              </span>{" "}
              — Tous droits réservés.
            </p>
            <nav
              aria-label="Liens légaux"
              className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
            >
              {footerNavigation.legal.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-primary-50 hover:text-white transition-colors font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* ══ MENTION DÉVELOPPEUR — Grande, Nette, Bien Lisible ══ */}
          <div
            className="pt-4"
            style={{ borderTop: "1px solid rgba(27,107,58,0.5)" }}
          >
            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-3
                            rounded-2xl px-6 py-5"
              style={{
                background: "rgba(27,107,58,0.12)",
                border: "1px solid rgba(27,107,58,0.3)",
              }}
            >
              <Code2
                className="w-6 h-6 flex-shrink-0"
                style={{ color: "#FFC600" }}
              />
              <p
                className="text-center text-base font-semibold leading-relaxed"
                style={{ color: "#d1d5e0" }}
              >
                Développé par{" "}
                <a
                  href="https://jt-crea.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold transition-colors underline underline-offset-2"
                  style={{ color: "#FFC600" }}
                >
                  JT-Créa Dev.
                </a>{" "}
                &amp;{" "}
                <span className="text-white font-bold">BIT TECH Graphics</span>{" "}
                / Josué TAMADAHO{" "}
                <a
                  href="tel:+2290197888353"
                  className="font-bold transition-colors whitespace-nowrap hover:text-white"
                  style={{ color: "#93c5fd" }}
                >
                  (+229 01 97 888 353
                </a>{" "}
                –{" "}
                <a
                  href="mailto:contact@jt-crea.com"
                  className="font-bold transition-colors hover:text-white"
                  style={{ color: "#93c5fd" }}
                >
                  contact@jt-crea.com)
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
