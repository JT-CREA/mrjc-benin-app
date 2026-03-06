/**
 * loading.tsx — Skeleton global (App Router)
 * Affiché pendant le chargement de n'importe quelle page racine.
 */
export default function RootLoading() {
  return (
    <div className="min-h-screen bg-white animate-pulse" aria-hidden="true">
      {/* Navbar skeleton */}
      <div className="h-16 bg-primary-900 w-full" />

      {/* Hero skeleton */}
      <div className="h-[480px] bg-gray-200 w-full" />

      {/* Content skeleton */}
      <div className="container mx-auto px-4 py-16 space-y-12">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <div className="h-4 bg-gray-200 rounded-full w-24 mx-auto" />
          <div className="h-8 bg-gray-200 rounded-full w-64 mx-auto" />
          <div className="h-4 bg-gray-200 rounded-full w-48 mx-auto" />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl p-6 space-y-4">
              <div className="h-48 bg-gray-200 rounded-xl" />
              <div className="h-4 bg-gray-200 rounded-full w-3/4" />
              <div className="h-3 bg-gray-200 rounded-full w-full" />
              <div className="h-3 bg-gray-200 rounded-full w-5/6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
