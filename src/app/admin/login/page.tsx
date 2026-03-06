"use client";

/**
 * Page — Admin Login — MRJC-BÉNIN
 *
 * CORRECTIONS CRITIQUES v3 :
 *  ✅ Utilise POST /api/auth (JWT signé côté serveur → cookie httpOnly fiable)
 *     → Fin des session_expired : le middleware voit le cookie correctement
 *  ✅ window.location.href = '/admin' après login (navigation complète)
 *     → garantit que le navigateur envoie le cookie Set-Cookie dans la requête
 *  ✅ Dégradés inline (indépendants de Tailwind config) → toujours visibles
 *  ✅ Identifiants affichés en développement
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  AlertCircle,
  Loader2,
  ShieldCheck,
  KeyRound,
} from "lucide-react";
import Image from "next/image";

export default function AdminLoginPage() {
  const emailRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);

  /* Autofocus email */
  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  /* Décompte verrouillage */
  useEffect(() => {
    if (!isLocked || lockTimer <= 0) return;
    const t = setInterval(() => {
      setLockTimer((s) => {
        if (s <= 1) {
          setIsLocked(false);
          clearInterval(t);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [isLocked, lockTimer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked || loading) return;
    if (!form.email.trim() || !form.password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ← IMPORTANT : inclure les cookies
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        /* Stocker les infos user pour l'interface admin */
        try {
          sessionStorage.setItem("mrjc_admin_user", JSON.stringify(data.user));
        } catch {}

        /* Navigation COMPLÈTE (pas router.push) → le navigateur envoie le cookie */
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get("redirect");
        const dest = redirect ? decodeURIComponent(redirect) : "/admin";
        window.location.href = dest;
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        if (newAttempts >= 5) {
          setIsLocked(true);
          setLockTimer(30);
          setError(
            "Trop de tentatives. Attendez 30 secondes avant de réessayer.",
          );
        } else {
          const remaining = 5 - newAttempts;
          setError(
            data.message ||
              `Identifiants incorrects. ${remaining} tentative${remaining > 1 ? "s" : ""} restante${remaining > 1 ? "s" : ""}.`,
          );
        }
      }
    } catch {
      setError("Erreur de connexion. Vérifiez votre réseau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    /* ── Fond dégradé principal — couleurs logo MRJC ── */
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #061a0e 0%, #0a3019 30%, #003087 70%, #061a0e 100%)",
      }}
    >
      {/* Orbes décoratifs */}
      <div
        className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(255,198,0,0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-56 h-56 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(90,174,224,0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(27,107,58,0.20) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
        className="relative w-full max-w-md z-10"
      >
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: "#fff",
            boxShadow: "0 32px 80px rgba(0,0,0,0.50)",
          }}
        >
          {/* ── En-tête dégradé ── */}
          <div
            className="px-8 py-8 text-center relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, #0a3019 0%, #1B6B3A 60%, #175f33 100%)",
            }}
          >
            {/* Cercles déco dans l'en-tête */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-8 translate-x-8 opacity-25"
                style={{ background: "#FFC600" }}
              />
              <div
                className="absolute bottom-0 left-0 w-24 h-24 rounded-full translate-y-6 -translate-x-6 opacity-20"
                style={{ background: "#5AAEE0" }}
              />
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, #ffffff 0, #ffffff 1px, transparent 0, transparent 50%)",
                  backgroundSize: "20px 20px",
                }}
              />
            </div>

            <div className="relative">
              {/* Logo MRJC */}
              <div className="mx-auto mb-4 w-16 h-16 relative">
                <Image
                  src="/assets/images/logo.svg"
                  alt="Logo MRJC-BÉNIN"
                  fill
                  unoptimized
                  className="object-contain"
                  sizes="64px"
                  onError={() => {}}
                />
              </div>
              <h1 className="text-xl font-black text-white font-sans tracking-tight">
                Panel Administrateur
              </h1>
              <p
                className="mt-1 text-sm font-medium"
                style={{ color: "rgba(255,255,255,0.70)" }}
              >
                MRJC-BÉNIN · Accès sécurisé
              </p>

              {/* Bandeau sécurité */}
              <div
                className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Connexion chiffrée · Session 8h
              </div>
            </div>
          </div>

          {/* ── Formulaire ── */}
          <div className="p-8">
            {/* Identifiants de test (dev uniquement) */}
            {process.env.NODE_ENV === "development" && (
              <div
                className="mb-5 p-4 rounded-xl"
                style={{ background: "#fffbeb", border: "1px solid #fde68a" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <KeyRound className="w-4 h-4" style={{ color: "#d97706" }} />
                  <span
                    className="text-xs font-bold"
                    style={{ color: "#92400e" }}
                  >
                    Identifiants de test
                  </span>
                </div>
                <div
                  className="text-xs space-y-1 font-mono"
                  style={{ color: "#b45309" }}
                >
                  <p>📧 admin@mrjc-benin.org / 🔑 Admin@MRJC2024</p>
                  <p>📧 editeur@mrjc-benin.org / 🔑 Editor@MRJC2024</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Email */}
              <div>
                <label
                  className="block text-sm font-semibold mb-1.5"
                  style={{ color: "#374151" }}
                >
                  Adresse email
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: "#9ca3af" }}
                  />
                  <input
                    ref={emailRef}
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    placeholder="admin@mrjc-benin.org"
                    required
                    autoComplete="email"
                    disabled={isLocked || loading}
                    className="w-full rounded-xl py-3 pl-10 pr-4 text-sm font-sans
                               transition-all focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    style={{
                      border: "1px solid #e5e7eb",
                      background: "#f9fafb",
                      color: "#111827",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#1B6B3A";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(27,107,58,0.12)";
                      e.target.style.background = "#fff";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e5e7eb";
                      e.target.style.boxShadow = "none";
                      e.target.style.background = "#f9fafb";
                    }}
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div>
                <label
                  className="block text-sm font-semibold mb-1.5"
                  style={{ color: "#374151" }}
                >
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: "#9ca3af" }}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, password: e.target.value }))
                    }
                    placeholder="••••••••••"
                    required
                    autoComplete="current-password"
                    disabled={isLocked || loading}
                    className="w-full rounded-xl py-3 pl-10 pr-11 text-sm font-sans
                               transition-all focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    style={{
                      border: "1px solid #e5e7eb",
                      background: "#f9fafb",
                      color: "#111827",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#1B6B3A";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(27,107,58,0.12)";
                      e.target.style.background = "#fff";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e5e7eb";
                      e.target.style.boxShadow = "none";
                      e.target.style.background = "#f9fafb";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: "#9ca3af" }}
                    tabIndex={-1}
                    aria-label={showPassword ? "Masquer" : "Afficher"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Erreur */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-start gap-2.5 rounded-xl p-3.5 text-sm"
                    style={{
                      background: "#fef2f2",
                      border: "1px solid #fecaca",
                      color: "#b91c1c",
                    }}
                  >
                    <AlertCircle
                      size={16}
                      className="mt-0.5 shrink-0"
                      style={{ color: "#ef4444" }}
                    />
                    <span className="font-medium">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Verrouillage */}
              {isLocked && lockTimer > 0 && (
                <div
                  className="flex items-center justify-center gap-2 rounded-xl p-3 text-sm"
                  style={{
                    background: "#fff7ed",
                    border: "1px solid #fed7aa",
                    color: "#c2410c",
                  }}
                >
                  <Lock size={14} />
                  <span className="font-semibold">
                    Compte verrouillé ({lockTimer}s)
                  </span>
                </div>
              )}

              {/* Bouton connexion */}
              <motion.button
                type="submit"
                disabled={loading || isLocked || !form.email || !form.password}
                whileHover={!loading && !isLocked ? { scale: 1.01 } : {}}
                whileTap={!loading && !isLocked ? { scale: 0.99 } : {}}
                className="flex w-full items-center justify-center gap-2.5 rounded-xl
                           py-3.5 text-sm font-bold text-white transition-all
                           disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  background:
                    "linear-gradient(135deg, #1B6B3A 0%, #003087 100%)",
                  boxShadow: "0 4px 14px rgba(27,107,58,0.35)",
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Connexion en
                    cours…
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} /> Se connecter
                  </>
                )}
              </motion.button>
            </form>

            {/* Lien retour */}
            <p
              className="mt-6 text-center text-xs font-medium"
              style={{ color: "#9ca3af" }}
            >
              <a
                href="/"
                className="font-semibold transition-colors hover:underline"
                style={{ color: "#1B6B3A" }}
              >
                ← Retour au site public
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
