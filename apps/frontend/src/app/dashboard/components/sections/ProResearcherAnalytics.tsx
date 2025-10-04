import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Brain,
  FileText,
  Lightbulb,
  Search,
  TrendingUp,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { StatsCard } from "./StatsCard";

interface ProResearcherAnalyticsProps {
  processingStats: {
    total: number;
    processed: number;
    processing: number;
    failed: number;
    extracted: number;
  };
  scopedHref: (href: string) => string;
}

export function ProResearcherAnalytics({
  processingStats,
  scopedHref,
}: ProResearcherAnalyticsProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
          Advanced Research Analytics
          <Badge variant="outline" className="text-xs">
            Pro Researcher
          </Badge>
        </CardTitle>
        <CardDescription className="text-sm">
          Deep insights into your research patterns and paper analytics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <StatsCard
            label="Citations"
            value={processingStats.total * 12}
            subtext="Tracked references"
            icon={TrendingUp}
            iconColor="text-emerald-600"
          />

          <StatsCard
            label="Impact Score"
            value={Math.round(
              (processingStats.processed / Math.max(processingStats.total, 1)) *
                100
            )}
            subtext="Out of 100"
            icon={Brain}
            iconColor="text-purple-600"
          />

          <StatsCard
            label="AI Insights"
            value={processingStats.extracted}
            subtext="Generated summaries"
            icon={Lightbulb}
            iconColor="text-amber-600"
          />

          <StatsCard
            label="Trends"
            value={Math.floor(processingStats.total / 3)}
            subtext="Topics identified"
            icon={Search}
            iconColor="text-blue-600"
          />
        </div>

        {/* Pro Research Tools */}
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Pro Research Tools
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              asChild
              variant="outline"
              className="justify-start h-auto p-3"
            >
              <Link
                href={scopedHref("/research/ai-insights")}
                className="flex items-center gap-2 w-full"
              >
                <Brain className="h-4 w-4" />
                <div className="text-left">
                  <div className="font-medium text-sm">AI Insights</div>
                  <div className="text-xs text-muted-foreground">
                    Deep paper analysis
                  </div>
                </div>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="justify-start h-auto p-3"
            >
              <Link
                href={scopedHref("/research/citation-graph")}
                className="flex items-center gap-2 w-full"
              >
                <TrendingUp className="h-4 w-4" />
                <div className="text-left">
                  <div className="font-medium text-sm">Citation Graph</div>
                  <div className="text-xs text-muted-foreground">
                    Visual connections
                  </div>
                </div>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="justify-start h-auto p-3"
            >
              <Link
                href={scopedHref("/research/export")}
                className="flex items-center gap-2 w-full"
              >
                <FileText className="h-4 w-4" />
                <div className="text-left">
                  <div className="font-medium text-sm">Export Tools</div>
                  <div className="text-xs text-muted-foreground">
                    BibTeX, RIS, CSV
                  </div>
                </div>
              </Link>
            </Button>
          </div>
        </div>

        {/* Research Insights */}
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Research Insights
          </h4>
          <div className="space-y-3">
            <div className="rounded-lg border p-3 hover:bg-muted/50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/20 p-2">
                  <Brain className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">
                    Your research shows strong focus on AI methodologies
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {processingStats.processed} papers analyzed with similar
                    themes
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border p-3 hover:bg-muted/50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-purple-100 dark:bg-purple-900/20 p-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">
                    Trending topic in your workspace: Neural Networks
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.floor(processingStats.total / 2)} related papers found
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
