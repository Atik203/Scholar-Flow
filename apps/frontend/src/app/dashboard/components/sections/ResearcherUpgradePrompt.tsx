import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowUpRight, Brain, TrendingUp, Users, Zap } from "lucide-react";
import Link from "next/link";

export function ResearcherUpgradePrompt() {
  return (
    <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/10 dark:to-purple-950/10">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          Unlock Pro Researcher Features
          <Badge variant="default" className="text-xs">
            Upgrade
          </Badge>
        </CardTitle>
        <CardDescription className="text-sm">
          Get access to advanced analytics, AI insights, and collaboration tools
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-lg border bg-background p-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <h4 className="font-semibold text-sm">AI-Powered Insights</h4>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Deep paper analysis, citation graphs, and research trend tracking
            </p>
            <Badge variant="outline" className="text-xs">
              Pro Researcher
            </Badge>
          </div>

          <div className="rounded-lg border bg-background p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-blue-600" />
              <h4 className="font-semibold text-sm">Team Collaboration</h4>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Invite team members, manage permissions, and track activity
            </p>
            <Badge variant="outline" className="text-xs">
              Team Lead
            </Badge>
          </div>

          <div className="rounded-lg border bg-background p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              <h4 className="font-semibold text-sm">Advanced Analytics</h4>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Research impact metrics, citation analysis, and export tools
            </p>
            <Badge variant="outline" className="text-xs">
              Pro Researcher
            </Badge>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button asChild className="flex-1">
            <Link href="/pricing">
              <Zap className="h-4 w-4 mr-2" />
              View Pricing Plans
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href="/features">
              Learn More
              <ArrowUpRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
