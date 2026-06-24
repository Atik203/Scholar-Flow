import { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

async function getPublishedPaper(id: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
  try {
    const res = await fetch(`${apiUrl}/public/editor/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || json;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const paper = await getPublishedPaper(id);
  if (!paper) return { title: "Paper not found" };
  return {
    title: paper.title,
    description: `Published paper: ${paper.title}`,
  };
}

export default async function PublicViewPage({ params }: Props) {
  const { id } = await params;
  const paper = await getPublishedPaper(id);
  if (!paper) notFound();

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          {paper.title}
        </h1>
        <p className="mb-8 text-sm text-gray-500">
          Published on {new Date(paper.createdAt).toLocaleDateString()}
        </p>
        {paper.contentHtml ? (
          <article
            className="prose prose-gray max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: paper.contentHtml }}
          />
        ) : (
          <p className="text-gray-400">This paper has no content yet.</p>
        )}
      </div>
    </main>
  );
}
