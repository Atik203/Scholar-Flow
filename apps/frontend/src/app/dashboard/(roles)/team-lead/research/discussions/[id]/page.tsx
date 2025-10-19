import DiscussionDetailClient from "./DiscussionDetailClient";

interface DiscussionDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DiscussionDetailPage({ params }: DiscussionDetailPageProps) {
  const { id } = await params;
  
  return <DiscussionDetailClient threadId={id} />;
}

