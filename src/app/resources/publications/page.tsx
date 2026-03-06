import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import ResourcesClient from "@/components/sections/resources/ResourcesClient";
import allResources from "@/data/resources.json";
import type { Resource } from "@/types/resource.types";

export const metadata: Metadata = {
  title: "Ressources & Publications | MRJC-BÉNIN",
  description:
    "Téléchargez nos rapports annuels, guides techniques, études d'impact, outils pédagogiques et documents cadres. Accès libre à toutes nos publications.",
};

export default function ResourcesPage() {
  // --- HARMONISATION DES DONNÉES ---
  // On transforme les données JSON pour qu'elles correspondent à l'interface Resource
  const formattedResources = (allResources as any[]).map((res) => ({
    ...res,
    // On s'assure que fileUrl existe (en utilisant downloadUrl si nécessaire)
    fileUrl: res.fileUrl || res.downloadUrl || "",
    // On s'assure que type existe (en utilisant category par défaut)
    type: res.type || res.category || "publication",
  })) as Resource[];

  return (
    <>
      <PageHeader
        tag="Bibliothèque en ligne"
        title="Centre de Ressources"
        subtitle="Accédez librement à l'ensemble de nos publications : rapports annuels, guides techniques, études d'impact, outils pédagogiques et documents institutionnels."
        breadcrumbs={[
          { label: "Ressources", href: "/resources" },
          { label: "Publications" },
        ]}
        image="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1920"
        size="sm"
      />
      {/* On passe maintenant les ressources formatées au client */}
      <ResourcesClient resources={formattedResources} />
    </>
  );
}
