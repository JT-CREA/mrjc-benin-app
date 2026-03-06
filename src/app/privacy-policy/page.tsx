import type { Metadata } from "next";
import { siteConfig } from "@/config/site.config";
import PageHeader from "@/components/layout/PageHeader";
import LegalLayout from "@/components/ui/LegalLayout";

export const metadata: Metadata = {
  title: `Politique de Confidentialité | ${siteConfig.name}`,
  description:
    "Politique de confidentialité et protection des données personnelles de MRJC-BÉNIN.",
  robots: { index: false },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHeader
        title="Politique de Confidentialité"
        subtitle="Comment MRJC-BÉNIN collecte, utilise et protège vos données personnelles"
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Confidentialité" },
        ]}
      />
      <LegalLayout lastUpdated="15 janvier 2024" readTime="8 min">
        <section>
          <h2>1. Introduction</h2>
          <p>
            MRJC-BÉNIN (<em>{siteConfig.fullName}</em>) s'engage à protéger la
            vie privée et les données personnelles des utilisateurs de son site
            web. La présente politique décrit comment nous collectons, utilisons
            et protégeons vos informations personnelles.
          </p>
          <p>
            En utilisant notre site web ou en nous soumettant vos informations,
            vous acceptez les pratiques décrites dans cette politique de
            confidentialité.
          </p>
        </section>

        <section>
          <h2>2. Données Collectées</h2>
          <h3>2.1 Données que vous nous fournissez</h3>
          <ul>
            <li>Nom et prénom</li>
            <li>Adresse email</li>
            <li>Numéro de téléphone (optionnel)</li>
            <li>Nom de votre organisation (optionnel)</li>
            <li>Contenu de vos messages ou demandes</li>
            <li>
              Informations fournies lors d'une candidature (emploi, stage,
              bénévolat)
            </li>
          </ul>
          <h3>2.2 Données collectées automatiquement</h3>
          <ul>
            <li>Adresse IP (anonymisée)</li>
            <li>Type et version de navigateur</li>
            <li>Pages visitées et durée de visite</li>
            <li>Source de trafic (référent)</li>
            <li>
              Données de cookies (voir notre{" "}
              <a href="/cookie-policy">Politique des Cookies</a>)
            </li>
          </ul>
        </section>

        <section>
          <h2>3. Finalités du Traitement</h2>
          <p>Vos données personnelles sont utilisées pour :</p>
          <ul>
            <li>Répondre à vos demandes de contact et d'information</li>
            <li>Vous envoyer notre newsletter (avec votre consentement)</li>
            <li>
              Traiter vos candidatures à nos offres d'emploi, stages ou
              bénévolat
            </li>
            <li>Améliorer nos services et l'expérience utilisateur du site</li>
            <li>Respecter nos obligations légales et réglementaires</li>
            <li>Analyser l'utilisation du site (statistiques anonymisées)</li>
          </ul>
        </section>

        <section>
          <h2>4. Base Légale du Traitement</h2>
          <p>Le traitement de vos données repose sur :</p>
          <ul>
            <li>
              <strong>Votre consentement</strong> : pour l'envoi de la
              newsletter et l'utilisation de cookies non essentiels
            </li>
            <li>
              <strong>L'exécution d'un contrat</strong> : pour le traitement des
              candidatures et des demandes de partenariat
            </li>
            <li>
              <strong>Notre intérêt légitime</strong> : pour répondre à vos
              messages et améliorer nos services
            </li>
            <li>
              <strong>Obligation légale</strong> : pour la conservation de
              certaines données
            </li>
          </ul>
        </section>

        <section>
          <h2>5. Durée de Conservation</h2>
          <ul>
            <li>
              <strong>Messages de contact :</strong> 3 ans après le dernier
              échange
            </li>
            <li>
              <strong>Abonnements newsletter :</strong> Jusqu'au désabonnement +
              1 an
            </li>
            <li>
              <strong>Candidatures :</strong> 2 ans après la réception si non
              retenue
            </li>
            <li>
              <strong>Données analytiques :</strong> 26 mois maximum
              (anonymisées)
            </li>
          </ul>
        </section>

        <section>
          <h2>6. Partage des Données</h2>
          <p>
            MRJC-BÉNIN ne vend, ne loue et ne cède jamais vos données
            personnelles à des tiers à des fins commerciales.
          </p>
          <p>Vos données peuvent être partagées avec :</p>
          <ul>
            <li>
              Nos prestataires techniques (hébergement, emailing) liés par des
              contrats stricts de confidentialité
            </li>
            <li>Les autorités compétentes en cas d'obligation légale</li>
            <li>
              Nos partenaires de financement, uniquement dans le cadre de
              rapports d'activité anonymisés
            </li>
          </ul>
        </section>

        <section>
          <h2>7. Vos Droits</h2>
          <p>
            Conformément aux lois applicables, vous disposez des droits suivants
            :
          </p>
          <ul>
            <li>
              <strong>Droit d'accès :</strong> obtenir une copie de vos données
              personnelles
            </li>
            <li>
              <strong>Droit de rectification :</strong> corriger des données
              inexactes
            </li>
            <li>
              <strong>Droit à l'effacement :</strong> demander la suppression de
              vos données
            </li>
            <li>
              <strong>Droit d'opposition :</strong> vous opposer au traitement
              de vos données
            </li>
            <li>
              <strong>Droit à la limitation :</strong> restreindre le traitement
              dans certains cas
            </li>
            <li>
              <strong>Droit à la portabilité :</strong> recevoir vos données
              dans un format structuré
            </li>
          </ul>
          <p>
            Pour exercer ces droits, contactez-nous à :{" "}
            <a href={`mailto:${siteConfig.contact.email}`}>
              {siteConfig.contact.email}
            </a>
          </p>
        </section>

        <section>
          <h2>8. Sécurité des Données</h2>
          <p>
            MRJC-BÉNIN met en œuvre des mesures techniques et organisationnelles
            appropriées pour protéger vos données contre l'accès non autorisé,
            la modification, la divulgation ou la destruction :
          </p>
          <ul>
            <li>Chiffrement SSL/TLS pour toutes les communications</li>
            <li>Accès limité aux données aux seules personnes habilitées</li>
            <li>Mots de passe hashés et authentification à deux facteurs</li>
            <li>Sauvegardes régulières et sécurisées</li>
          </ul>
        </section>

        <section>
          <h2>9. Modifications</h2>
          <p>
            MRJC-BÉNIN se réserve le droit de modifier cette politique de
            confidentialité à tout moment. Les modifications prendront effet dès
            leur publication sur ce site. Nous vous informerons de tout
            changement significatif par email ou via un avis sur le site.
          </p>
        </section>

        <section>
          <h2>10. Contact</h2>
          <p>
            Pour toute question concernant cette politique ou vos données
            personnelles :
          </p>
          <ul>
            <li>
              Email :{" "}
              <a href={`mailto:${siteConfig.contact.email}`}>
                {siteConfig.contact.email}
              </a>
            </li>
            <li>Courrier : {siteConfig.contact.addressFull}</li>
          </ul>
        </section>
      </LegalLayout>
    </>
  );
}
