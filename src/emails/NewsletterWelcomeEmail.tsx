/**
 * Email — Bienvenue à la Newsletter MRJC-BÉNIN
 * Envoyé automatiquement à chaque nouvel abonné
 * Stack : @react-email/components + Resend
 */

import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Link,
} from "@react-email/components";

/* ── Props ── */
interface NewsletterWelcomeEmailProps {
  subscriberEmail: string;
  subscriberName?: string;
  unsubscribeToken: string;
}

/* ── Styles ── */
const primary = "#2d6a2d";
const bg = "#f8faf8";
const white = "#ffffff";
const text = "#1f2937";
const muted = "#6b7280";
const border = "#e5e7eb";

/* ── Template ── */
export default function NewsletterWelcomeEmail({
  subscriberName = "Cher(e) ami(e)",
  unsubscribeToken,
}: NewsletterWelcomeEmailProps) {
  const firstName = subscriberName.split(" ")[0];
  const unsubUrl = `https://mrjc-benin.org/api/newsletter/unsubscribe?token=${unsubscribeToken}`;

  return (
    <Html lang="fr">
      <Head />
      <Preview>
        🌿 Bienvenue dans la communauté MRJC-BÉNIN — Vous recevrez nos
        actualités et ressources mensuellement
      </Preview>
      <Body
        style={{
          backgroundColor: bg,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          margin: 0,
          padding: 0,
        }}
      >
        <Container
          style={{ maxWidth: "580px", margin: "0 auto", padding: "32px 16px" }}
        >
          {/* ── Card principale ── */}
          <div
            style={{
              backgroundColor: white,
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
            }}
          >
            {/* Header avec dégradé vert */}
            <Section
              style={{
                background: `linear-gradient(135deg, ${primary} 0%, #4a7c59 100%)`,
                padding: "40px 32px 32px",
                textAlign: "center" as const,
              }}
            >
              <Text
                style={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: "32px",
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                🌿
              </Text>
              <Text
                style={{
                  color: white,
                  fontSize: "24px",
                  fontWeight: "800",
                  margin: "12px 0 6px",
                  lineHeight: 1.2,
                }}
              >
                Bienvenue dans notre communauté !
              </Text>
              <Text
                style={{
                  color: "rgba(255,255,255,0.75)",
                  fontSize: "14px",
                  margin: 0,
                }}
              >
                MRJC-BÉNIN — Mouvement Rural de Jeunesse Chrétienne du Bénin
              </Text>
            </Section>

            {/* Corps */}
            <Section style={{ padding: "32px 32px 8px" }}>
              <Text
                style={{
                  fontSize: "16px",
                  color: text,
                  fontWeight: "600",
                  margin: "0 0 12px",
                }}
              >
                Bonjour {firstName} 👋
              </Text>
              <Text
                style={{
                  fontSize: "14px",
                  color: muted,
                  lineHeight: "1.7",
                  margin: "0 0 16px",
                }}
              >
                Merci de vous être abonné(e) à la newsletter de MRJC-BÉNIN !
                Votre intérêt pour le développement rural et le bien-être des
                communautés béninoises nous touche profondément.
              </Text>
              <Text
                style={{
                  fontSize: "14px",
                  color: muted,
                  lineHeight: "1.7",
                  margin: "0 0 24px",
                }}
              >
                Chaque mois, vous recevrez directement dans votre boîte mail :
              </Text>

              {/* Ce que vous allez recevoir */}
              {[
                {
                  emoji: "📰",
                  title: "Nos actualités",
                  desc: "Les dernières nouvelles de nos projets sur le terrain",
                },
                {
                  emoji: "📊",
                  title: "Résultats & Impact",
                  desc: "Données chiffrées et témoignages de bénéficiaires",
                },
                {
                  emoji: "📚",
                  title: "Ressources exclusives",
                  desc: "Guides, rapports et publications en avant-première",
                },
                {
                  emoji: "💼",
                  title: "Opportunités",
                  desc: "Offres d'emploi, stages et appels à collaboration",
                },
              ].map(({ emoji, title, desc }) => (
                <div
                  key={title}
                  style={{
                    display: "flex",
                    gap: "12px",
                    marginBottom: "14px",
                    padding: "12px 16px",
                    backgroundColor: bg,
                    borderRadius: "10px",
                  }}
                >
                  <Text
                    style={{
                      fontSize: "22px",
                      margin: 0,
                      lineHeight: 1,
                      flexShrink: 0,
                    }}
                  >
                    {emoji}
                  </Text>
                  <div>
                    <Text
                      style={{
                        fontSize: "13px",
                        fontWeight: "700",
                        color: text,
                        margin: 0,
                      }}
                    >
                      {title}
                    </Text>
                    <Text
                      style={{
                        fontSize: "12px",
                        color: muted,
                        margin: "2px 0 0",
                      }}
                    >
                      {desc}
                    </Text>
                  </div>
                </div>
              ))}
            </Section>

            {/* CTA Visiter le site */}
            <Section
              style={{ padding: "8px 32px 24px", textAlign: "center" as const }}
            >
              <Link
                href="https://mrjc-benin.org"
                style={{
                  display: "inline-block",
                  backgroundColor: primary,
                  color: white,
                  fontSize: "14px",
                  fontWeight: "700",
                  padding: "14px 32px",
                  borderRadius: "12px",
                  textDecoration: "none",
                  margin: "8px 0",
                }}
              >
                Visiter notre site →
              </Link>
              <Text
                style={{ fontSize: "12px", color: muted, margin: "8px 0 0" }}
              >
                ou{" "}
                <Link
                  href="https://mrjc-benin.org/resources"
                  style={{ color: primary }}
                >
                  consulter nos ressources gratuites
                </Link>
              </Text>
            </Section>

            {/* Chiffres clés */}
            <Section
              style={{
                backgroundColor: "#f0fdf4",
                padding: "20px 32px",
                margin: "0",
              }}
            >
              <Text
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.08em",
                  color: primary,
                  margin: "0 0 16px",
                  textAlign: "center" as const,
                }}
              >
                MRJC-BÉNIN en chiffres
              </Text>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "8px",
                }}
              >
                {[
                  { value: "85 000+", label: "Bénéficiaires directs" },
                  { value: "38 ans", label: "D'expérience" },
                  { value: "12/12", label: "Départements" },
                ].map(({ value, label }) => (
                  <div
                    key={label}
                    style={{ textAlign: "center" as const, padding: "8px" }}
                  >
                    <Text
                      style={{
                        fontSize: "18px",
                        fontWeight: "800",
                        color: primary,
                        margin: "0 0 2px",
                      }}
                    >
                      {value}
                    </Text>
                    <Text
                      style={{
                        fontSize: "11px",
                        color: muted,
                        margin: 0,
                        lineHeight: "1.3",
                      }}
                    >
                      {label}
                    </Text>
                  </div>
                ))}
              </div>
            </Section>

            {/* Footer */}
            <Section
              style={{ padding: "24px 32px", textAlign: "center" as const }}
            >
              <Hr style={{ borderColor: border, margin: "0 0 16px" }} />
              <Text
                style={{ fontSize: "12px", color: muted, margin: "0 0 4px" }}
              >
                <strong style={{ color: primary }}>MRJC-BÉNIN</strong> | 01 BP
                2017 Cotonou — Bénin
              </Text>
              <Text
                style={{ fontSize: "12px", color: muted, margin: "0 0 8px" }}
              >
                <Link href="https://mrjc-benin.org" style={{ color: primary }}>
                  Site web
                </Link>
                {" · "}
                <Link
                  href="https://mrjc-benin.org/contact"
                  style={{ color: primary }}
                >
                  Contact
                </Link>
                {" · "}
                <Link
                  href="https://mrjc-benin.org/resources"
                  style={{ color: primary }}
                >
                  Ressources
                </Link>
              </Text>
              <Text
                style={{
                  fontSize: "11px",
                  color: "#9ca3af",
                  margin: 0,
                  lineHeight: "1.5",
                }}
              >
                Vous recevez cet email car vous vous êtes abonné(e) à la
                newsletter via{" "}
                <Link
                  href="https://mrjc-benin.org"
                  style={{ color: "#9ca3af" }}
                >
                  mrjc-benin.org
                </Link>
                .{" "}
                <Link
                  href={unsubUrl}
                  style={{ color: "#9ca3af", textDecoration: "underline" }}
                >
                  Se désabonner
                </Link>
              </Text>
            </Section>
          </div>

          {/* Pied de page hors carte */}
          <Text
            style={{
              fontSize: "11px",
              color: "#9ca3af",
              textAlign: "center" as const,
              marginTop: "16px",
            }}
          >
            © {new Date().getFullYear()} MRJC-BÉNIN — Tous droits réservés
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
