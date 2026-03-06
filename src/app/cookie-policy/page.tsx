import type { Metadata } from "next";
import { siteConfig } from "@/config/site.config";
import PageHeader from "@/components/layout/PageHeader";
import LegalLayout from "@/components/ui/LegalLayout";

export const metadata: Metadata = {
  title: `Politique des Cookies | ${siteConfig.name}`,
  description: "Politique d'utilisation des cookies sur le site MRJC-BÉNIN.",
  robots: { index: false },
};

export default function CookiePolicyPage() {
  return (
    <>
      <PageHeader
        title="Politique des Cookies"
        subtitle="Comment nous utilisons les cookies pour améliorer votre expérience"
        breadcrumbs={[{ label: "Accueil", href: "/" }, { label: "Cookies" }]}
      />
      <LegalLayout lastUpdated="15 janvier 2024" readTime="4 min">
        <section>
          <h2>1. Qu'est-ce qu'un Cookie ?</h2>
          <p>
            Un cookie est un petit fichier texte déposé sur votre terminal
            (ordinateur, smartphone, tablette) lors de la visite d'un site web.
            Il permet au site de mémoriser certaines informations sur votre
            visite et d'améliorer votre expérience utilisateur.
          </p>
        </section>

        <section>
          <h2>2. Types de Cookies Utilisés</h2>

          <h3>2.1 Cookies Strictement Nécessaires</h3>
          <p>
            Ces cookies sont indispensables au fonctionnement du site. Ils ne
            peuvent pas être désactivés.
          </p>
          <ul>
            <li>
              <strong>Session :</strong> Maintien de votre session de navigation
            </li>
            <li>
              <strong>Préférences langue :</strong> Mémorisation de votre langue
              sélectionnée (FR/EN/ES)
            </li>
            <li>
              <strong>Sécurité :</strong> Protection contre les attaques CSRF
            </li>
            <li>
              <strong>Consentement cookies :</strong> Enregistrement de vos
              choix de cookies
            </li>
          </ul>

          <h3>2.2 Cookies de Performance (Analytiques)</h3>
          <p>
            Ces cookies collectent des informations anonymisées sur
            l'utilisation du site. Ils requièrent votre consentement.
          </p>
          <ul>
            <li>
              <strong>Google Analytics :</strong> Analyse d'audience (pages
              visitées, durée, source)
            </li>
            <li>
              <strong>Compteur de visiteurs interne :</strong> Statistiques
              anonymes de fréquentation
            </li>
          </ul>

          <h3>2.3 Cookies Fonctionnels</h3>
          <p>Permettent d'améliorer les fonctionnalités du site.</p>
          <ul>
            <li>
              <strong>Newsletter :</strong> Mémorisation du statut d'abonnement
            </li>
            <li>
              <strong>Préférences UI :</strong> Mémorisation de vos paramètres
              d'affichage
            </li>
          </ul>

          <h3>2.4 Cookies Tiers</h3>
          <ul>
            <li>
              <strong>YouTube (Google) :</strong> Lecture des vidéos intégrées —
              Politique de confidentialité{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener"
              >
                Google
              </a>
            </li>
            <li>
              <strong>OpenStreetMap / Leaflet :</strong> Affichage de la carte
              de localisation
            </li>
          </ul>
        </section>

        <section>
          <h2>3. Gestion de vos Préférences</h2>
          <p>
            Lors de votre première visite, une bannière vous demande d'accepter
            ou de refuser les cookies non essentiels. Vous pouvez modifier vos
            préférences à tout moment.
          </p>
          <p>Méthodes de gestion :</p>
          <ul>
            <li>
              Via la bannière de consentement (bouton "Paramètres cookies" en
              bas de page)
            </li>
            <li>
              Via les paramètres de votre navigateur (supprimer et bloquer les
              cookies)
            </li>
            <li>
              Via les outils de désactivation spécifiques (Google Analytics
              Opt-out)
            </li>
          </ul>
          <p>
            <strong>Attention :</strong> La désactivation de certains cookies
            peut affecter le fonctionnement du site et votre expérience
            utilisateur.
          </p>
        </section>

        <section>
          <h2>4. Durée de Conservation des Cookies</h2>
          <ul>
            <li>
              <strong>Cookies de session :</strong> Supprimés à la fermeture du
              navigateur
            </li>
            <li>
              <strong>Préférences langue / consentement :</strong> 12 mois
            </li>
            <li>
              <strong>Google Analytics :</strong> 26 mois maximum
            </li>
            <li>
              <strong>Newsletter :</strong> Durée de l'abonnement
            </li>
          </ul>
        </section>

        <section>
          <h2>5. Comment Refuser les Cookies via votre Navigateur</h2>
          <ul>
            <li>
              <a
                href="https://support.google.com/chrome/answer/95647"
                target="_blank"
                rel="noopener"
              >
                Google Chrome
              </a>
            </li>
            <li>
              <a
                href="https://support.mozilla.org/fr/kb/activer-desactiver-cookies"
                target="_blank"
                rel="noopener"
              >
                Mozilla Firefox
              </a>
            </li>
            <li>
              <a
                href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac"
                target="_blank"
                rel="noopener"
              >
                Apple Safari
              </a>
            </li>
            <li>
              <a
                href="https://support.microsoft.com/fr-fr/help/17442/windows-internet-explorer-delete-manage-cookies"
                target="_blank"
                rel="noopener"
              >
                Microsoft Edge
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2>6. Contact</h2>
          <p>
            Pour toute question concernant notre utilisation des cookies :{" "}
            <a href={`mailto:${siteConfig.contact.email}`}>
              {siteConfig.contact.email}
            </a>
          </p>
        </section>
      </LegalLayout>
    </>
  );
}
