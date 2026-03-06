import type { Metadata } from "next";
import { siteConfig } from "@/config/site.config";
import PageHeader from "@/components/layout/PageHeader";
import LegalLayout from "@/components/ui/LegalLayout";

export const metadata: Metadata = {
  title: `Conditions d'Utilisation | ${siteConfig.name}`,
  description: "Conditions générales d'utilisation du site web MRJC-BÉNIN.",
  robots: { index: false },
};

export default function TermsOfUsePage() {
  return (
    <>
      <PageHeader
        title="Conditions d'Utilisation"
        subtitle="Règles et conditions régissant l'utilisation du site MRJC-BÉNIN"
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Conditions d'Utilisation" },
        ]}
      />
      <LegalLayout lastUpdated="15 janvier 2024" readTime="6 min">
        <section>
          <h2>1. Acceptation des Conditions</h2>
          <p>
            En accédant au site web de MRJC-BÉNIN ({siteConfig.url}), vous
            acceptez sans réserve les présentes Conditions Générales
            d'Utilisation (CGU). Si vous n'acceptez pas ces conditions, veuillez
            ne pas utiliser ce site.
          </p>
        </section>

        <section>
          <h2>2. Présentation du Site</h2>
          <p>
            Le site {siteConfig.url} est le site officiel de{" "}
            {siteConfig.fullName}, organisation non gouvernementale œuvrant pour
            le développement rural en République du Bénin. Le site a pour
            objectif de :
          </p>
          <ul>
            <li>Présenter les activités, projets et missions de MRJC-BÉNIN</li>
            <li>
              Partager des informations, rapports et ressources documentaires
            </li>
            <li>Permettre le contact avec l'organisation</li>
            <li>Faciliter les partenariats et collaborations</li>
          </ul>
        </section>

        <section>
          <h2>3. Utilisation du Site</h2>
          <p>En utilisant ce site, vous vous engagez à :</p>
          <ul>
            <li>Utiliser le site uniquement à des fins légales et licites</li>
            <li>
              Ne pas tenter d'accéder sans autorisation à des zones protégées du
              site
            </li>
            <li>
              Ne pas introduire de virus, malwares ou tout autre code
              malveillant
            </li>
            <li>
              Ne pas utiliser le site pour envoyer des communications non
              sollicitées (spam)
            </li>
            <li>
              Respecter les droits de propriété intellectuelle de MRJC-BÉNIN et
              de ses partenaires
            </li>
            <li>
              Ne pas reproduire le contenu sans autorisation écrite préalable
            </li>
          </ul>
        </section>

        <section>
          <h2>4. Propriété Intellectuelle</h2>
          <p>
            L'ensemble des contenus présents sur ce site (textes, images,
            vidéos, logos, données, graphismes) sont la propriété exclusive de
            MRJC-BÉNIN ou de ses partenaires et sont protégés par les lois
            relatives à la propriété intellectuelle.
          </p>
          <p>
            Toute reproduction, copie, modification, adaptation ou utilisation
            commerciale sans autorisation préalable écrite de MRJC-BÉNIN est
            strictement interdite.
          </p>
          <p>
            Une utilisation à des fins éducatives ou de citation est tolérée
            sous réserve de citer MRJC-BÉNIN comme source et de ne pas modifier
            le contenu original.
          </p>
        </section>

        <section>
          <h2>5. Liens Hypertextes</h2>
          <h3>5.1 Liens vers d'autres sites</h3>
          <p>
            Notre site peut contenir des liens vers des sites web tiers.
            MRJC-BÉNIN n'est pas responsable du contenu de ces sites et ne peut
            garantir leur disponibilité ou leur conformité.
          </p>
          <h3>5.2 Liens depuis d'autres sites</h3>
          <p>
            Tout lien vers notre site est autorisé à condition de ne pas
            utiliser de techniques de framing et de ne pas présenter notre
            contenu de manière trompeuse ou préjudiciable à MRJC-BÉNIN.
          </p>
        </section>

        <section>
          <h2>6. Limitation de Responsabilité</h2>
          <p>MRJC-BÉNIN ne saurait être tenue responsable de :</p>
          <ul>
            <li>
              L'indisponibilité temporaire du site pour des raisons de
              maintenance ou techniques
            </li>
            <li>
              Toute inexactitude ou omission dans les informations publiées
            </li>
            <li>
              Tout dommage résultant de l'utilisation ou de l'impossibilité
              d'utiliser le site
            </li>
            <li>
              Tout virus pouvant infecter votre équipement lors de l'accès au
              site
            </li>
          </ul>
        </section>

        <section>
          <h2>7. Disponibilité du Site</h2>
          <p>
            MRJC-BÉNIN s'efforce de maintenir le site accessible 24h/24 et 7j/7.
            Toutefois, des interruptions peuvent survenir pour des raisons de
            maintenance, mises à jour ou incidents techniques. MRJC-BÉNIN ne
            saurait être tenue responsable des conséquences de ces
            interruptions.
          </p>
        </section>

        <section>
          <h2>8. Modification des CGU</h2>
          <p>
            MRJC-BÉNIN se réserve le droit de modifier les présentes CGU à tout
            moment. Les nouvelles conditions entrent en vigueur dès leur
            publication sur le site. L'utilisation continue du site après
            modification vaut acceptation des nouvelles CGU.
          </p>
        </section>

        <section>
          <h2>9. Droit Applicable et Juridiction</h2>
          <p>
            Les présentes CGU sont soumises au droit de la République du Bénin.
            Tout litige relatif à l'utilisation de ce site relèvera de la
            compétence exclusive des tribunaux de Cotonou, République du Bénin.
          </p>
        </section>

        <section>
          <h2>10. Contact</h2>
          <p>Pour toute question relative aux présentes CGU :</p>
          <ul>
            <li>
              Email :{" "}
              <a href={`mailto:${siteConfig.contact.email}`}>
                {siteConfig.contact.email}
              </a>
            </li>
            <li>
              Via notre <a href="/contact">formulaire de contact</a>
            </li>
          </ul>
        </section>
      </LegalLayout>
    </>
  );
}
