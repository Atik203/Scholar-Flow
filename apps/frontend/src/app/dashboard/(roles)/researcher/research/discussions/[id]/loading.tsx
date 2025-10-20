import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DiscussionDetailLoading() {
  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      {/* Back button skeleton */}
      <Skeleton className="h-10 w-32" />

      {/* Discussion header */}
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </CardContent>
      </Card>

      {/* Messages skeleton */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reply input skeleton */}
      <Card>
        <CardContent className="p-4">
          <Skeleton className="h-24 w-full mb-2" />
          <Skeleton className="h-10 w-24" />
        </CardContent>
      </Card>
    </div>
  );
}
