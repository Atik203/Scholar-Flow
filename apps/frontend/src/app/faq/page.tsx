const faqs = [
  {
    q: "Is ScholarFlow free?",
    a: "Yes, during early access. Pricing tiers will be introduced later.",
  },
  { q: "Do you support PDFs?", a: "Yes, with planned OCR and embeddings." },
  {
    q: "Can I invite my team?",
    a: "Collections and shared workspaces are in the roadmap.",
  },
];

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <section className="max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">FAQ</h1>
        <p className="mt-4 text-muted-foreground">
          Common questions about ScholarFlow.
        </p>
      </section>
      <dl className="mt-10 space-y-6">
        {faqs.map((f) => (
          <div key={f.q} className="rounded-xl border bg-card p-6">
            <dt className="font-medium">{f.q}</dt>
            <dd className="mt-2 text-sm text-muted-foreground">{f.a}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
