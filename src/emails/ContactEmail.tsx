/**
 * Email — Confirmation de message reçu (envoyé à l'expéditeur)
 * Utilisé par l'API /api/contact
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
interface ContactEmailProps {
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  recipientType?: "sender" | "admin";
}

/* ── Styles ── */
const palette = {
  primary: "#2d6a2d",
  secondary: "#e8500a",
  bg: "#f8f9fa",
  white: "#ffffff",
  text: "#1f2937",
  muted: "#6b7280",
  border: "#e5e7eb",
};

const styles = {
  body: {
    backgroundColor: palette.bg,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    margin: 0,
    padding: 0,
  } as React.CSSProperties,
  container: {
    maxWidth: "580px",
    margin: "0 auto",
    padding: "32px 16px",
  } as React.CSSProperties,
  card: {
    backgroundColor: palette.white,
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
  } as React.CSSProperties,
  header: {
    backgroundColor: palette.primary,
    padding: "32px 32px 24px",
  } as React.CSSProperties,
  headerTitle: {
    color: palette.white,
    fontSize: "22px",
    fontWeight: "700",
    margin: "12px 0 4px",
    lineHeight: 1.3,
  } as React.CSSProperties,
  headerSubtitle: {
    color: "rgba(255,255,255,0.75)",
    fontSize: "13px",
    margin: 0,
  } as React.CSSProperties,
  body_content: {
    padding: "28px 32px",
  } as React.CSSProperties,
  greeting: {
    fontSize: "16px",
    color: palette.text,
    fontWeight: "600",
    marginBottom: "8px",
  } as React.CSSProperties,
  paragraph: {
    fontSize: "14px",
    color: palette.muted,
    lineHeight: "1.6",
    margin: "0 0 16px",
  } as React.CSSProperties,
  messageBox: {
    backgroundColor: palette.bg,
    border: `1px solid ${palette.border}`,
    borderRadius: "10px",
    padding: "16px 20px",
    margin: "16px 0",
  } as React.CSSProperties,
  messageLabel: {
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase" as const,
    color: palette.muted,
    letterSpacing: "0.08em",
    margin: "0 0 6px",
  } as React.CSSProperties,
  messageText: {
    fontSize: "14px",
    color: palette.text,
    lineHeight: "1.65",
    margin: 0,
    whiteSpace: "pre-wrap" as const,
  } as React.CSSProperties,
  subjectBadge: {
    display: "inline-block",
    backgroundColor: "#eff6ff",
    color: "#1d4ed8",
    padding: "4px 12px",
    borderRadius: "99px",
    fontSize: "12px",
    fontWeight: "600",
    marginBottom: "16px",
  } as React.CSSProperties,
  ctaButton: {
    display: "inline-block",
    backgroundColor: palette.primary,
    color: palette.white,
    fontSize: "14px",
    fontWeight: "700",
    padding: "12px 24px",
    borderRadius: "10px",
    textDecoration: "none",
    margin: "8px 0 16px",
  } as React.CSSProperties,
  divider: {
    borderColor: palette.border,
    margin: "24px 0",
  } as React.CSSProperties,
  footer: {
    padding: "0 32px 28px",
    textAlign: "center" as const,
  } as React.CSSProperties,
  footerText: {
    fontSize: "12px",
    color: palette.muted,
    lineHeight: "1.5",
    margin: "0 0 4px",
  } as React.CSSProperties,
  footerLink: {
    color: palette.primary,
    textDecoration: "none",
  } as React.CSSProperties,
};

/* ── Composant Email Expéditeur ── */
export function ContactConfirmationEmail({
  senderName,
  subject,
  message,
}: ContactEmailProps) {
  return (
    <Html lang="fr">
      <Head />
      <Preview>
        Merci {senderName} — Nous avons bien reçu votre message concernant «{" "}
        {subject} »
      </Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <div style={styles.card}>
            {/* ── Header ── */}
            <Section style={styles.header}>
              <Text
                style={{
                  color: "rgba(255,255,255,0.8)",
                  fontSize: "13px",
                  margin: "0 0 4px",
                }}
              >
                🌿 MRJC-BÉNIN — Mouvement Rural de Jeunesse Chrétienne du Bénin
              </Text>
              <Text style={styles.headerTitle}>
                Nous avons bien reçu votre message
              </Text>
              <Text style={styles.headerSubtitle}>
                Notre équipe vous répondra dans un délai de 48 heures ouvrées
              </Text>
            </Section>

            {/* ── Corps ── */}
            <Section style={styles.body_content}>
              <Text style={styles.greeting}>Bonjour {senderName},</Text>
              <Text style={styles.paragraph}>
                Nous accusons réception de votre message transmis via le
                formulaire de contact de notre site web. Nous prenons soin de
                répondre à chaque message reçu dans les plus brefs délais.
              </Text>

              {/* Récapitulatif */}
              <div style={styles.messageBox}>
                <Text style={styles.messageLabel}>Sujet de votre message</Text>
                <Text
                  style={{
                    ...styles.messageText,
                    fontWeight: "600",
                    marginBottom: "12px",
                  }}
                >
                  {subject}
                </Text>
                <Text style={styles.messageLabel}>Votre message</Text>
                <Text style={styles.messageText}>
                  {message.length > 300
                    ? `${message.substring(0, 300)}…`
                    : message}
                </Text>
              </div>

              <Text style={styles.paragraph}>
                En attendant notre réponse, nous vous invitons à explorer nos
                ressources et publications disponibles librement en ligne.
              </Text>

              <Link
                href="https://mrjc-benin.org/resources"
                style={styles.ctaButton}
              >
                Consulter nos ressources →
              </Link>

              <Hr style={styles.divider} />

              <Text style={styles.paragraph}>
                Si vous avez envoyé ce message par erreur ou souhaitez compléter
                votre demande, n'hésitez pas à nous recontacter directement à{" "}
                <Link
                  href="mailto:contact@mrjc-benin.org"
                  style={{ color: palette.primary }}
                >
                  contact@mrjc-benin.org
                </Link>
              </Text>
            </Section>

            {/* ── Footer ── */}
            <Section style={styles.footer}>
              <Hr style={styles.divider} />
              <Text style={styles.footerText}>
                <strong style={{ color: palette.primary }}>MRJC-BÉNIN</strong> —
                Mouvement Rural de Jeunesse Chrétienne du Bénin
              </Text>
              <Text style={styles.footerText}>
                01 BP 2017, Cotonou — Bénin | Tél. : +229 21 31 42 78
              </Text>
              <Text style={styles.footerText}>
                <Link href="https://mrjc-benin.org" style={styles.footerLink}>
                  mrjc-benin.org
                </Link>
                {" · "}
                <Link
                  href="https://mrjc-benin.org/legal-mentions"
                  style={styles.footerLink}
                >
                  Mentions légales
                </Link>
                {" · "}
                <Link
                  href="https://mrjc-benin.org/privacy-policy"
                  style={styles.footerLink}
                >
                  Confidentialité
                </Link>
              </Text>
              <Text
                style={{
                  ...styles.footerText,
                  marginTop: "8px",
                  fontSize: "11px",
                  color: "#9ca3af",
                }}
              >
                Vous recevez cet email car vous avez soumis le formulaire de
                contact de notre site.
              </Text>
            </Section>
          </div>
        </Container>
      </Body>
    </Html>
  );
}

/* ── Composant Email Admin (notification interne) ── */
export function ContactAdminNotificationEmail({
  senderName,
  senderEmail,
  subject,
  message,
}: ContactEmailProps) {
  const adminUrl = `https://mrjc-benin.org/admin/messages`;

  return (
    <Html lang="fr">
      <Head />
      <Preview>
        📬 Nouveau message de {senderName} : « {subject} »
      </Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <div style={styles.card}>
            {/* Header admin */}
            <Section style={{ ...styles.header, backgroundColor: "#1f2937" }}>
              <Text
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "12px",
                  margin: "0 0 4px",
                }}
              >
                ⚙️ Notification interne — Tableau de bord admin
              </Text>
              <Text style={styles.headerTitle}>
                📬 Nouveau message de contact
              </Text>
              <Text style={styles.headerSubtitle}>
                Reçu le{" "}
                {new Date().toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </Text>
            </Section>

            <Section style={styles.body_content}>
              {/* Infos expéditeur */}
              <div
                style={{
                  ...styles.messageBox,
                  borderLeft: `4px solid ${palette.secondary}`,
                }}
              >
                <Text style={styles.messageLabel}>Expéditeur</Text>
                <Text style={{ ...styles.messageText, fontWeight: "600" }}>
                  {senderName}
                </Text>
                <Link
                  href={`mailto:${senderEmail}`}
                  style={{ ...styles.footerLink, fontSize: "14px" }}
                >
                  {senderEmail}
                </Link>
              </div>

              {/* Sujet */}
              <Text style={styles.messageLabel}>Sujet</Text>
              <Text
                style={{
                  ...styles.messageText,
                  fontWeight: "700",
                  fontSize: "15px",
                  marginBottom: "16px",
                }}
              >
                {subject}
              </Text>

              {/* Message complet */}
              <div style={styles.messageBox}>
                <Text style={styles.messageLabel}>Message complet</Text>
                <Text style={styles.messageText}>{message}</Text>
              </div>

              {/* CTA admin */}
              <Link href={adminUrl} style={styles.ctaButton}>
                Voir dans le tableau de bord →
              </Link>

              <Text
                style={{
                  ...styles.paragraph,
                  fontSize: "12px",
                  color: "#9ca3af",
                }}
              >
                Rappel : merci de répondre dans les 48 heures ouvrées.
              </Text>
            </Section>
          </div>
        </Container>
      </Body>
    </Html>
  );
}

export default ContactConfirmationEmail;
