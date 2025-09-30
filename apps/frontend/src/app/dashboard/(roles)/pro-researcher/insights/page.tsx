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

const insightReports = [
  {
    id: "vector-discovery",
    title: "Vector Discovery Report",
    description: "Similarity clusters across AI Safety literature for Q3 2025.",
    confidence: "0.94",
  },
  {
    id: "collaboration-network",
    title: "Collaboration Network",
    description: "Suggested co-authors based on citation graph overlaps.",
    confidence: "0.88",
  },
  {
    id: "funding-matches",
    title: "Funding Matches",
    description:
      "Grants aligned with ongoing projects inside Fusion workspace.",
    confidence: "0.81",
  },
];

export default function ProResearcherInsightsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          AI Insight Reports
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Dive deeper into AI-generated research, collaboration, and funding
          opportunities.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {insightReports.map((report) => (
          <Card key={report.id}>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                {report.title}
              </CardTitle>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Confidence score:{" "}
                <span className="font-medium">{report.confidence}</span>
              </div>
              <Button size="sm" asChild>
                <Link href={`/dashboard/pro-researcher/insights/${report.id}`}>
                  View
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator />

      <div className="text-xs text-muted-foreground">
        Insight confidence is calculated via embedding similarity and feedback
        loops.
      </div>
    </div>
  );
}
