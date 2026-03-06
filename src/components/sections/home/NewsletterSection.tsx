"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  CheckCircle,
  AlertCircle,
  Send,
  Bell,
  ArrowRight,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

const benefits = [
  { icon: Bell, text: "Actualités & événements MRJC-BÉNIN" },
  { icon: Mail, text: "Nouvelles publications et ressources" },
  { icon: ArrowRight, text: "Appels à candidatures & offres d'emploi" },
];

export default function NewsletterSection() {
  const { ref, isVisible } = useIntersectionObserver<HTMLElement>({
    threshold: 0.15,
  });
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setMessage("Veuillez saisir une adresse email valide.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      if (res.ok) {
        setStatus("success");
        setMessage("");
        setEmail("");
        setName("");
      } else {
        throw new Error();
      }
    } catch {
      setStatus("error");
      setMessage("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  return (
    <section
      ref={ref}
      className="py-20 lg:py-28 bg-neutral-50"
      aria-labelledby="newsletter-heading"
    >
      <div className="container-mrjc">
        <div className="bg-primary-500 rounded-3xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Colonne gauche — Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="p-10 lg:p-14 flex flex-col justify-center"
            >
              <div
                className="w-14 h-14 bg-white/15 rounded-2xl flex items-center
                              justify-center mb-6"
              >
                <Mail className="w-7 h-7 text-white" />
              </div>

              <div
                className="text-secondary-300 text-sm font-semibold uppercase
                              tracking-widest mb-3"
              >
                Newsletter MRJC-BÉNIN
              </div>

              <h2
                id="newsletter-heading"
                className="font-display text-3xl lg:text-4xl font-bold text-white
                             mb-4 leading-tight"
              >
                Restez connecté à notre mission
              </h2>

              <p className="text-primary-200 leading-relaxed mb-8">
                Rejoignez notre communauté de{" "}
                <strong className="text-white">1 200+ abonnés</strong> qui
                suivent l'actualité de MRJC-BÉNIN. Nouvelles des projets,
                publications, événements — tout dans une seule newsletter
                mensuelle.
              </p>

              {/* Avantages */}
              <ul className="space-y-3">
                {benefits.map((b, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isVisible ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-3 text-sm text-primary-100"
                  >
                    <div
                      className="w-7 h-7 bg-white/15 rounded-lg flex items-center
                                    justify-center flex-shrink-0"
                    >
                      <b.icon className="w-3.5 h-3.5 text-secondary-300" />
                    </div>
                    {b.text}
                  </motion.li>
                ))}
              </ul>

              {/* Statistiques abonnés */}
              <div className="mt-8 pt-6 border-t border-primary-400/50 flex items-center gap-6">
                <div className="text-center">
                  <div className="font-display font-bold text-2xl text-white">
                    1 200+
                  </div>
                  <div className="text-xs text-primary-300 mt-0.5">
                    abonnés actifs
                  </div>
                </div>
                <div className="w-px h-8 bg-primary-400/50" />
                <div className="text-center">
                  <div className="font-display font-bold text-2xl text-white">
                    1×/mois
                  </div>
                  <div className="text-xs text-primary-300 mt-0.5">
                    fréquence d'envoi
                  </div>
                </div>
                <div className="w-px h-8 bg-primary-400/50" />
                <div className="text-center">
                  <div className="font-display font-bold text-2xl text-white">
                    0 spam
                  </div>
                  <div className="text-xs text-primary-300 mt-0.5">garanti</div>
                </div>
              </div>
            </motion.div>

            {/* Colonne droite — Formulaire */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-10 lg:p-14 flex flex-col justify-center"
            >
              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center
                                  justify-center mx-auto mb-6"
                  >
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-neutral-900 mb-3">
                    Inscription confirmée !
                  </h3>
                  <p className="text-neutral-600 leading-relaxed mb-6">
                    Merci de rejoindre notre communauté. Vous recevrez bientôt
                    un email de confirmation. Vérifiez vos spams si nécessaire.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="btn-outline text-sm"
                  >
                    S'inscrire avec un autre email
                  </button>
                </motion.div>
              ) : (
                <>
                  <h3 className="font-display font-bold text-2xl text-neutral-900 mb-2">
                    S'abonner maintenant
                  </h3>
                  <p className="text-neutral-500 text-sm mb-8">
                    Renseignez vos informations pour recevoir notre newsletter
                    mensuelle. Désabonnement facile à tout moment.
                  </p>

                  <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="space-y-4"
                  >
                    {/* Prénom */}
                    <div>
                      <label htmlFor="nl-name" className="label-field">
                        Prénom (optionnel)
                      </label>
                      <input
                        id="nl-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Votre prénom"
                        className="input-field"
                        disabled={status === "loading"}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="nl-email" className="label-field">
                        Adresse email <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="nl-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="votre@email.com"
                        required
                        className={cn(
                          "input-field",
                          status === "error" && message ? "input-error" : "",
                        )}
                        disabled={status === "loading"}
                        aria-describedby={
                          status === "error" ? "nl-error" : undefined
                        }
                      />
                      {status === "error" && message && (
                        <motion.p
                          id="nl-error"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-1.5 flex items-center gap-1.5 text-sm text-red-600"
                          role="alert"
                        >
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          {message}
                        </motion.p>
                      )}
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full btn-primary py-3.5 text-base justify-center
                                 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {status === "loading" ? (
                        <>
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="block w-5 h-5 border-2 border-white/30
                                       border-t-white rounded-full"
                          />
                          Inscription en cours...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          S'abonner à la newsletter
                        </>
                      )}
                    </button>

                    {/* RGPD */}
                    <div
                      className="flex items-start gap-2.5 p-3 bg-neutral-50
                                    rounded-xl border border-neutral-200"
                    >
                      <Shield className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-neutral-500 leading-relaxed">
                        Vos données sont traitées par MRJC-BÉNIN uniquement pour
                        l'envoi de la newsletter. En vous inscrivant, vous
                        acceptez notre{" "}
                        <Link
                          href="/privacy-policy"
                          className="text-primary-600 hover:underline font-medium"
                        >
                          politique de confidentialité
                        </Link>
                        .
                      </p>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Helper cn local */
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
