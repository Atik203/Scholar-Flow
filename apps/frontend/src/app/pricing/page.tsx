export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <section className="max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Pricing
        </h1>
        <p className="mt-4 text-muted-foreground">
          Simple, transparent pricing. Free during early access.
        </p>
      </section>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-6">
          <h3 className="font-semibold">Individual</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Solo research workflow.
          </p>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <h3 className="font-semibold">Team</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Collaborate across a small team.
          </p>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <h3 className="font-semibold">Lab</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Advanced roles and workspace isolation.
          </p>
        </div>
      </div>
    </div>
  );
}
