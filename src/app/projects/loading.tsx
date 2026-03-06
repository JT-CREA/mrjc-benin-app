export default function ProjectsLoading() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header skeleton */}
      <div className="bg-primary-900 py-24">
        <div className="container-mrjc space-y-4">
          <div className="skeleton h-4 w-48 rounded-full" />
          <div className="skeleton h-12 w-2/3 rounded-xl" />
          <div className="skeleton h-5 w-1/2 rounded-lg" />
        </div>
      </div>

      {/* Filtres skeleton */}
      <div className="container-mrjc py-8">
        <div className="flex flex-wrap gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton h-10 w-28 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Grille projets skeleton */}
      <div className="container-mrjc pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-neutral-100 overflow-hidden"
            >
              <div className="skeleton h-52 w-full" />
              <div className="p-5 space-y-3">
                <div className="skeleton h-4 w-24 rounded-full" />
                <div className="skeleton h-6 w-full rounded-lg" />
                <div className="skeleton h-4 w-3/4 rounded-lg" />
                <div className="grid grid-cols-2 gap-2">
                  <div className="skeleton h-4 w-full rounded" />
                  <div className="skeleton h-4 w-full rounded" />
                </div>
                <div className="skeleton h-10 w-full rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
