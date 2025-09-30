"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const insightsDetail = {
  "vector-discovery": {
    title: "Vector Discovery Report",
    points: [
      'Top match: "Contrastive Alignment in AI Governance" (similarity 0.94)',
      'New citation cluster forming around "Interpretability pipelines"',
      "Recommended action: Publish internal summary for workspace collaborators",
    ],
  },
  "collaboration-network": {
    title: "Collaboration Network",
    points: [
      "Potential collaborator: Dr. Lee (4 shared citations, 2 mutual co-authors)",
      "Emerging group: Quantum Interface Lab (6 related publications)",
      "Recommended action: Send invitation via workspace collaborations",
    ],
  },
  "funding-matches": {
    title: "Funding Matches",
    points: [
      "Grant: Emerging AI Systems Fund (Deadline Nov 15)",
      'Match factor: 78% overlap with "Fusion" workspace objectives',
      "Recommended action: Draft proposal with auto-generated outline",
    ],
  },
} as const;

interface ProResearcherInsightDetailProps {
  params: { id: string };
}

export default function ProResearcherInsightDetail({
  params,
}: ProResearcherInsightDetailProps) {
  const detail = insightsDetail[params.id as keyof typeof insightsDetail];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {detail?.title || "Insight report"}
          </h1>
          <p className="text-muted-foreground mt-2">
            Generated using ScholarFlow AI pipelines with feedback from your
            workspaces.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/pro-researcher/insights">
            Back to insights
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Key takeaways</CardTitle>
          <CardDescription>
            Highlights tailored to current workspace priorities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          {detail?.points?.map((point) => (
            <div key={point} className="flex items-start gap-3">
              <span className="mt-1 size-2 rounded-full bg-primary" />
              <p>{point}</p>
            </div>
          )) || <p>Select an insight to view generated recommendations.</p>}
        </CardContent>
      </Card>

      <Separator />

      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" asChild>
          <Link href="/dashboard/pro-researcher">Go to Pro Researcher hub</Link>
        </Button>
        <Button asChild>
          <Link href="/dashboard/ai-insights">Open AI Insights</Link>
        </Button>
      </div>
    </div>
  );
}
