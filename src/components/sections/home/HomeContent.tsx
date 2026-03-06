"use client";

/**
 * HomeContent.tsx — MRJC-BÉNIN
 * Client Component contenant toutes les sections de la page d'accueil.
 * dynamic({ ssr: false }) est autorisé uniquement ici ('use client').
 *
 * Utilisé par : src/app/page.tsx (Server Component)
 * Emplacement : src/components/sections/home/HomeContent.tsx
 */

import dynamic from "next/dynamic";

/* ─── Skeletons ──────────────────────────────────────────────────────────── */

function HeroSkeleton() {
  return (
    <div
      className="w-full bg-primary-950"
      style={{ minHeight: "min(100vh, 800px)" }}
    >
      <div className="container-mrjc flex items-center h-full py-32">
        <div className="space-y-6 max-w-2xl w-full">
          <div className="h-4 w-48 bg-primary-800 rounded animate-pulse" />
          <div className="h-14 w-full bg-primary-800 rounded-xl animate-pulse" />
          <div className="h-14 w-4/5 bg-primary-800 rounded-xl animate-pulse" />
          <div className="h-5 w-2/3 bg-primary-800 rounded animate-pulse" />
          <div className="flex gap-4 pt-2">
            <div className="h-12 w-44 bg-secondary-700 rounded-xl animate-pulse" />
            <div className="h-12 w-36 bg-primary-800 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionSkeleton({
  height = "h-64",
  bg = "bg-white",
}: {
  height?: string;
  bg?: string;
}) {
  return (
    <div className={`w-full ${height} ${bg} flex items-center justify-center`}>
      <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
    </div>
  );
}

/* ─── Sections — dynamic ssr:false (autorisé dans un Client Component) ────── */

const HeroSection = dynamic(
  () => import("@/components/sections/home/HeroSection"),
  { ssr: false, loading: () => <HeroSkeleton /> },
);

const ActionSection = dynamic(
  () => import("@/components/sections/home/ActionSection"),
  { ssr: false, loading: () => <SectionSkeleton height="h-96" /> },
);

const ImpactSection = dynamic(
  () => import("@/components/sections/home/ImpactSection"),
  {
    ssr: false,
    loading: () => <SectionSkeleton height="h-72" bg="bg-primary-950" />,
  },
);

const FeaturedProjects = dynamic(
  () => import("@/components/sections/home/FeaturedProjects"),
  { ssr: false, loading: () => <SectionSkeleton height="h-96" /> },
);

const TestimonialsSection = dynamic(
  () => import("@/components/sections/home/TestimonialsSection"),
  {
    ssr: false,
    loading: () => <SectionSkeleton height="h-80" bg="bg-neutral-50" />,
  },
);

const LatestNewsSection = dynamic(
  () => import("@/components/sections/home/LatestNewsSection"),
  { ssr: false, loading: () => <SectionSkeleton height="h-96" /> },
);

const NewsletterSection = dynamic(
  () => import("@/components/sections/home/NewsletterSection"),
  {
    ssr: false,
    loading: () => <SectionSkeleton height="h-64" bg="bg-primary-900" />,
  },
);

const PartnersSection = dynamic(
  () => import("@/components/sections/home/PartnersSection"),
  { ssr: false, loading: () => <SectionSkeleton height="h-48" /> },
);

const SearchSection = dynamic(
  () => import("@/components/sections/home/SearchSection"),
  {
    ssr: false,
    loading: () => <SectionSkeleton height="h-40" bg="bg-neutral-100" />,
  },
);

/* ─── Composant principal ────────────────────────────────────────────────── */

export default function HomeContent() {
  return (
    <>
      <HeroSection />
      <ActionSection />
      <ImpactSection />
      <FeaturedProjects />
      <TestimonialsSection />
      <LatestNewsSection />
      <NewsletterSection />
      <PartnersSection />
      <SearchSection />
    </>
  );
}
