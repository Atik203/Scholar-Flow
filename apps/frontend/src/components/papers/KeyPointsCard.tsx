"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useExtractKeyPointsMutation } from "@/redux/api/paperApi";
import { Lightbulb, RefreshCw } from "lucide-react";
import { useState } from "react";

interface KeyPointsCardProps {
  paperId: string;
}

export function KeyPointsCard({ paperId }: KeyPointsCardProps) {
  const [keyPoints, setKeyPoints] = useState<string[] | null>(null);
  const [extract, { isLoading }] = useExtractKeyPointsMutation();

  const handleExtract = async () => {
    const result = await extract({ paperId }).unwrap();
    setKeyPoints(result.keyPoints);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-primary" />
          Key Points
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExtract}
          disabled={isLoading}
        >
          <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isLoading ? "animate-spin" : ""}`} />
          {keyPoints ? "Refresh" : "Extract"}
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        ) : keyPoints && keyPoints.length > 0 ? (
          <ul className="space-y-2">
            {keyPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium mt-0.5">
                  {i + 1}
                </span>
                <span className="text-muted-foreground">{point}</span>
              </li>
            ))}
          </ul>
        ) : keyPoints && keyPoints.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No key points found. Try refreshing.
          </p>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-6">
            Click &quot;Extract&quot; to use AI to identify the key findings from this paper.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
