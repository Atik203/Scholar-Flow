export default function HowItWorksPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <section className="max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          How it works
        </h1>
        <p className="mt-4 text-muted-foreground">
          Three steps from upload to insight.
        </p>
      </section>
      <ol className="mt-10 space-y-6">
        <li className="rounded-xl border bg-card p-6">
          <h3 className="font-semibold">Upload & Parse</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Ingest PDFs and extract text and structure.
          </p>
        </li>
        <li className="rounded-xl border bg-card p-6">
          <h3 className="font-semibold">Organize & Annotate</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Collections and inline notes.
          </p>
        </li>
        <li className="rounded-xl border bg-card p-6">
          <h3 className="font-semibold">Search & Summarize</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Semantic retrieval and AI overviews.
          </p>
        </li>
      </ol>
    </div>
  );
}
