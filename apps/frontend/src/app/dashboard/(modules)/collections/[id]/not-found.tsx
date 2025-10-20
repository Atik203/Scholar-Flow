import { Button } from "@/components/ui/button";
import { FolderX } from "lucide-react";
import Link from "next/link";

export default function CollectionNotFound() {
  return (
    <div className="flex min-h-[600px] flex-col items-center justify-center space-y-4 p-6">
      <FolderX className="h-20 w-20 text-muted-foreground" />
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Collection Not Found</h2>
        <p className="text-muted-foreground max-w-md">
          The collection you're looking for doesn't exist or you don't have
          permission to view it.
        </p>
      </div>
      <Button asChild>
        <Link href="/dashboard/collections">Browse All Collections</Link>
      </Button>
    </div>
  );
}
