export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <section className="max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">About</h1>
        <p className="mt-4 text-muted-foreground">
          ScholarFlow is an AI-powered hub to organize, annotate, and
          collaborate on research papers.
        </p>
      </section>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-6">
          <h3 className="font-semibold">Mission</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Accelerate literature review and insight for researchers.
          </p>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <h3 className="font-semibold">Roadmap</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Semantic search, annotations, team workspaces, and more.
          </p>
        </div>
      </div>
    </div>
  );
}
