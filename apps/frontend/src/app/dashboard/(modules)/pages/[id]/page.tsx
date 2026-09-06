"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useProtectedRoute } from "@/hooks/useAuthGuard";
import {
  getRoleBadgeVariant,
  ROLE_LABELS,
} from "@/lib/auth/roles";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";

import { RESEARCHER_PAGES_BY_ID } from "../pages.data";

export default function ResearcherPageDetail() {
  const params = useParams();
  const id = params.id as string;
  const { user, isAuthenticated } = useProtectedRoute();

  const detail = RESEARCHER_PAGES_BY_ID[id];

  if (!detail) {
    notFound();
  }

  if (!isAuthenticated) {
    return null;
  }

  const role = user?.role;
  const roleLabel = role
    ? (ROLE_LABELS[role as keyof typeof ROLE_LABELS] ?? "Researcher")
    : "Researcher";
  const badgeVariant = role ? getRoleBadgeVariant(role) : "outline";

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {detail.title}
            </h1>
            <p className="text-muted-foreground mt-2 max-w-3xl">
              {detail.summary}
            </p>
          </div>
          <Badge variant={badgeVariant}>{roleLabel}</Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Highlights</CardTitle>
            <CardDescription>
              Key capabilities available on this researcher page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {detail.highlights.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <span className="mt-1 size-2 rounded-full bg-primary" />
                <p className="text-sm text-muted-foreground">{item}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next actions</CardTitle>
            <CardDescription>
              Jump directly into workflows aligned with this page
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {detail.actions.map((action) => (
              <Button
                key={action.label}
                variant={action.variant ?? "outline"}
                asChild
              >
                <Link href={`/dashboard${action.path}`}>{action.label}</Link>
              </Button>
            ))}
          </CardContent>
        </Card>

        <Separator />

        <div className="flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link href="/dashboard/pages">Back to researcher pages</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard">Go to researcher hub</Link>
          </Button>
        </div>
      </div>
  );
}
