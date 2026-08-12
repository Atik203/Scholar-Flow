import { redirect } from "next/navigation";

export default async function DiscussionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/dashboard/discussions/${id}`);
}
