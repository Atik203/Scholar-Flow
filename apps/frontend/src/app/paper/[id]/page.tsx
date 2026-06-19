"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

export default function PaperRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();

  const redirect = useCallback(async () => {
    const { id } = await params;
    router.replace(`/dashboard/papers/${id}`);
  }, [params, router]);

  useEffect(() => {
    redirect();
  }, [redirect]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-muted-foreground">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
      <span className="text-sm">Redirecting to paper...</span>
    </div>
  );
}
