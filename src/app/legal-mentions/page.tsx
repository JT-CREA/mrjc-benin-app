import type { Metadata } from "next";
import { siteConfig } from "@/config/site.config";
import PageHeader from "@/components/layout/PageHeader";
import LegalLayout from "@/components/ui/LegalLayout";

export const metadata: Metadata = {
  title: `Mentions Légales | ${siteConfig.name}`,
  description:
    "Mentions légales, informations sur l'éditeur et hébergeur du site MRJC-BÉNIN.",
  robots: { index: false },
};

export default function LegalMentionsPage() {
  return (
    <>
      <PageHeader
        title="Mentions Légales"
        subtitle="Informations légales et réglementaires concernant le site MRJC-BÉNIN"
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Mentions Légales" },
        ]}
      />
      <LegalLayout lastUpdated="15 janvier 2024" readTime="5 min">
        <section>
          <h2>1. Identification de l'Éditeur</h2>
          <p>
            Le présent site web <strong>{siteConfig.url}</strong> est édité par
            :
          </p>
          <ul>
            <li>
              <strong>Dénomination :</strong> {siteConfig.fullName}
            </li>
            <li>
              <strong>Sigle :</strong> {siteConfig.name}
            </li>
            <li>
              <strong>Statut juridique :</strong> {siteConfig.legalStatus}
            </li>
            <li>
              <strong>Numéro d'enregistrement :</strong>{" "}
              {siteConfig.registrationNumber}
            </li>
            <li>
              <strong>Siège social :</strong> {siteConfig.contact.addressFull}
            </li>
            <li>
              <strong>Téléphone :</strong> {siteConfig.contact.phoneBureau}
            </li>
            <li>
              <strong>Email :</strong> {siteConfig.contact.email}
            </li>
            <li>
              <strong>Année de fondation :</strong> {siteConfig.founded}
            </li>
          </ul>
          <p>
            <strong>Directeur de la publication :</strong> Le Directeur Exécutif
            de MRJC-BÉNIN
          </p>
        </section>

        <section>
          <h2>2. Hébergement</h2>
          <p>Ce site est hébergé par :</p>
          <ul>
            <li>
              <strong>Hébergeur :</strong> Vercel Inc.
            </li>
            <li>
              <strong>Adresse :</strong> 340 Pine Street, Suite 701, San
              Francisco, CA 94104, USA
            </li>
            <li>
              <strong>Site :</strong>{" "}
              <a
                href="https://vercel.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                vercel.com
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2>3. Propriété Intellectuelle</h2>
          <p>
            L'ensemble du contenu de ce site (textes, images, vidéos, logos,
            graphismes) est la propriété exclusive de {siteConfig.fullName} ou
            de ses partenaires, sauf mention contraire explicite.
          </p>
          <p>
            Toute reproduction, représentation, diffusion ou redistribution,
            totale ou partielle, des contenus présents sur ce site, par quelque
            procédé que ce soit, sans l'autorisation préalable écrite de
            MRJC-BÉNIN, est strictement interdite et constituerait une
            contrefaçon sanctionnée par la loi.
          </p>
          <p>
            Pour toute demande d'autorisation de reproduction, contactez :{" "}
            <a href={`mailto:${siteConfig.contact.email}`}>
              {siteConfig.contact.email}
            </a>
          </p>
        </section>

        <section>
          <h2>4. Responsabilité</h2>
          <p>
            MRJC-BÉNIN s'efforce d'assurer l'exactitude et la mise à jour des
            informations diffusées sur ce site. Toutefois, elle ne peut garantir
            l'exactitude, la précision ou l'exhaustivité des informations mises
            à disposition sur ce site.
          </p>
          <p>
            MRJC-BÉNIN ne saurait être tenue responsable des dommages directs ou
            indirects résultant de l'accès au site ou de l'utilisation des
            informations qui y sont contenues.
          </p>
          <p>
            Les liens hypertextes mis en place dans le cadre de ce site, en
            direction d'autres ressources présentes sur le réseau internet, ne
            sauraient engager la responsabilité de MRJC-BÉNIN.
          </p>
        </section>

        <section>
          <h2>5. Données Personnelles</h2>
          <p>
            La collecte et le traitement des données personnelles des
            utilisateurs de ce site sont effectués conformément à notre{" "}
            <a href="/privacy-policy">Politique de Confidentialité</a> et dans
            le respect des lois en vigueur en République du Bénin.
          </p>
          <p>
            Pour toute question relative à vos données personnelles, vous pouvez
            nous contacter à :{" "}
            <a href={`mailto:${siteConfig.contact.email}`}>
              {siteConfig.contact.email}
            </a>
          </p>
        </section>

        <section>
          <h2>6. Cookies</h2>
          <p>
            Ce site utilise des cookies afin d'améliorer l'expérience
            utilisateur et d'analyser le trafic. Pour en savoir plus sur
            l'utilisation des cookies et comment les gérer, consultez notre{" "}
            <a href="/cookie-policy">Politique des Cookies</a>.
          </p>
        </section>

        <section>
          <h2>7. Droit Applicable</h2>
          <p>
            Les présentes mentions légales sont soumises au droit de la
            République du Bénin. En cas de litige, les tribunaux béninois seront
            seuls compétents.
          </p>
        </section>

        <section>
          <h2>8. Contact</h2>
          <p>
            Pour toute question relative aux présentes mentions légales ou au
            fonctionnement du site, vous pouvez nous contacter :
          </p>
          <ul>
            <li>
              Par email :{" "}
              <a href={`mailto:${siteConfig.contact.email}`}>
                {siteConfig.contact.email}
              </a>
            </li>
            <li>Par téléphone : {siteConfig.contact.phoneBureau}</li>
            <li>
              Via le <a href="/contact">formulaire de contact</a>
            </li>
          </ul>
        </section>
      </LegalLayout>
    </>
  );
}
