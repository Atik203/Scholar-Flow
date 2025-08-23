export default function FeaturesPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <section className="max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Features
        </h1>
        <p className="mt-4 text-muted-foreground">
          Explore the core capabilities of ScholarFlow built for research teams.
        </p>
      </section>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-6">
          <h3 className="font-semibold">Semantic Search</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Vector similarity to surface relevant passages.
          </p>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <h3 className="font-semibold">AI Summaries</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Condensed insights and highlights.
          </p>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <h3 className="font-semibold">Collaborative Collections</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Organize and share papers in context.
          </p>
        </div>
      </div>
    </div>
  );
}
