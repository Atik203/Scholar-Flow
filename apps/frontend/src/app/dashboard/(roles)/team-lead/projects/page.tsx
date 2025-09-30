"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

const activeProjects = [
  {
    id: "fusion-pipeline",
    title: "Fusion Pipeline",
    summary:
      "Cross-lab exploration of plasma stability reports and experiment logs.",
    progress: "62%",
  },
  {
    id: "neural-compression",
    title: "Neural Compression",
    summary: "Benchmarking compression layers for edge inference workloads.",
    progress: "48%",
  },
  {
    id: "quantum-interfaces",
    title: "Quantum Interfaces",
    summary:
      "Designing robust communication between classical and quantum nodes.",
    progress: "71%",
  },
];

export default function TeamLeadProjectsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Team Projects</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor milestone progress and reassign collaborators as needed.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {activeProjects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
              <CardDescription>{project.summary}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Progress:{" "}
                <span className="font-medium">{project.progress}</span>
              </span>
              <Button size="sm" asChild>
                <Link href={`/dashboard/team-lead/projects/${project.id}`}>
                  Open
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
