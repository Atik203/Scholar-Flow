import Link from "next/link";

export default function PublicPaperNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <h1 className="text-2xl font-bold">Paper not available</h1>
      <p className="max-w-md text-muted-foreground">
        This paper doesn&apos;t exist or hasn&apos;t been published yet. If
        someone shared this link with you, ask them to publish the paper or
        send you an email invitation instead.
      </p>
      <Link href="/" className="text-primary hover:underline">
        Back to ScholarFlow
      </Link>
    </main>
  );
}
