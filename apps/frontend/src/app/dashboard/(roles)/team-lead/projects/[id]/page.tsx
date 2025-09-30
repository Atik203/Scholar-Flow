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
import { useParams } from "next/navigation";

const projectsDetail = {
  "fusion-pipeline": {
    title: "Fusion Pipeline",
    description:
      "Coordinated research between plasma labs with focus on stabilizing confinement experiments.",
    updates: [
      "New diagnostics uploaded by Dr. Rivera (Oct 1)",
      "Analysis queue completed for 7 high-priority datasets",
      "Pending action: Approve remote workspace access for visiting fellows",
    ],
  },
  "neural-compression": {
    title: "Neural Compression",
    description:
      "Edge inference models optimized for low-power devices with auto-tuned compression.",
    updates: [
      "Benchmark suite executed on 3 new architectures",
      "Annotation backlog reduced to 4 items",
      "Pending action: Assign reviewer for experiment log #214",
    ],
  },
  "quantum-interfaces": {
    title: "Quantum Interfaces",
    description:
      "Bridging classical controllers with quantum nodes for hybrid experiments.",
    updates: [
      "Interface spec draft uploaded by Dr. Singh",
      "3 collaboration requests awaiting approval",
      "Pending action: Schedule review with hardware partners",
    ],
  },
} as const;

export default function TeamLeadProjectDetail() {
  const params = useParams();
  const id = params.id as string;
  const detail = projectsDetail[id as keyof typeof projectsDetail];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {detail?.title || "Team project"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {detail?.description ||
              "Select a project to view milestones, recent updates, and assigned collaborators."}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/team-lead/projects">Back to projects</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Latest updates</CardTitle>
          <CardDescription>Highlights since your last visit</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          {detail?.updates?.map((update) => (
            <div key={update} className="flex items-start gap-3">
              <span className="mt-1 size-2 rounded-full bg-primary" />
              <p>{update}</p>
            </div>
          )) || <p>Select a project to review its current progress.</p>}
        </CardContent>
      </Card>

      <Separator />

      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" asChild>
          <Link href="/dashboard/team-lead">Open Team Lead hub</Link>
        </Button>
        <Button asChild>
          <Link href="/dashboard/collaborations/projects">
            View collaboration board
          </Link>
        </Button>
      </div>
    </div>
  );
}
