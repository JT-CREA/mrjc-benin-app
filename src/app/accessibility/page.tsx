import type { Metadata } from "next";
import LegalLayout from "@/components/ui/LegalLayout";
import { siteConfig } from "@/config/site.config";

export const metadata: Metadata = {
  title: `Accessibilité | ${siteConfig.name}`,
  description:
    "Déclaration d'accessibilité du site MRJC-BÉNIN conformément aux WCAG 2.1.",
};

export default function AccessibilityPage() {
  return (
    <LegalLayout lastUpdated="Janvier 2025" readTime="4 min">
      <h1>Déclaration d'Accessibilité</h1>

      <section>
        <h2>Engagement MRJC-BÉNIN</h2>
        <p>
          MRJC-BÉNIN s'engage à rendre son site web accessible à toutes les
          personnes, y compris celles en situation de handicap. Nous visons la
          conformité au niveau <strong>AA</strong> des Règles pour
          l'Accessibilité des Contenus Web (<strong>WCAG 2.1</strong>).
        </p>
      </section>

      <section>
        <h2>État de conformité</h2>
        <p>
          Le présent site est <strong>partiellement conforme</strong> aux WCAG
          2.1 niveau AA. Certains contenus tiers (cartes interactives, vidéos
          YouTube) peuvent présenter des limitations d'accessibilité
          indépendantes de notre volonté.
        </p>

        <h3>Fonctionnalités accessibles</h3>
        <ul>
          <li>Navigation clavier complète (Tab, Entrée, Échap)</li>
          <li>Structure de titres hiérarchique (H1–H6)</li>
          <li>
            Attributs <code>alt</code> sur toutes les images significatives
          </li>
          <li>Liens descriptifs (pas de "cliquez ici")</li>
          <li>Contraste des couleurs ≥ 4.5:1 pour le texte</li>
          <li>Redimensionnement jusqu'à 200% sans perte de contenu</li>
          <li>Formulaires avec labels associés et messages d'erreur clairs</li>
          <li>Balises ARIA sur les composants interactifs</li>
          <li>Fil d'Ariane sur toutes les pages secondaires</li>
        </ul>

        <h3>Non-conformités connues</h3>
        <ul>
          <li>
            Certaines cartes Leaflet ne sont pas entièrement navigables au
            clavier
          </li>
          <li>Les sous-titres des vidéos YouTube dépendent du contenu tiers</li>
          <li>
            Quelques graphiques statistiques sans équivalent textuel complet
          </li>
        </ul>
      </section>

      <section>
        <h2>Aide technique</h2>
        <p>Technologies recommandées pour une expérience optimale :</p>
        <ul>
          <li>
            <strong>Lecteurs d'écran :</strong> NVDA (Windows), VoiceOver
            (macOS/iOS), TalkBack (Android)
          </li>
          <li>
            <strong>Navigateurs :</strong> Chrome ≥ 100, Firefox ≥ 100, Safari ≥
            15, Edge ≥ 100
          </li>
          <li>
            <strong>Zoom navigateur :</strong> jusqu'à 200% supporté
          </li>
        </ul>
      </section>

      <section>
        <h2>Signaler un problème</h2>
        <p>
          Si vous rencontrez une difficulté d'accessibilité sur notre site,
          contactez-nous :
        </p>
        <ul>
          <li>
            Email :{" "}
            <a href={`mailto:${siteConfig.contact.email}`}>
              {siteConfig.contact.email}
            </a>
          </li>
          <li>
            Objet : <em>[ACCESSIBILITÉ] Description du problème</em>
          </li>
          <li>Délai de réponse : 5 jours ouvrables</li>
        </ul>
      </section>

      <section>
        <h2>Amélioration continue</h2>
        <p>
          Nous effectuons des audits d'accessibilité réguliers et mettons à jour
          ce site en conséquence. Notre objectif est d'atteindre la conformité
          totale au niveau AA d'ici fin 2025.
        </p>
      </section>
    </LegalLayout>
  );
}
