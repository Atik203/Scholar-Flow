"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
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
  buildRoleScopedPath,
  getRoleBadgeVariant,
  ROLE_LABELS,
} from "@/lib/auth/roles";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useCallback, useMemo } from "react";

import { RESEARCHER_PAGES_BY_ID } from "../pages.data";

interface ResearcherPageDetailProps {
  params: { id: string };
}

export default function ResearcherPageDetail({
  params,
}: ResearcherPageDetailProps) {
  const { user, isAuthenticated } = useProtectedRoute();

  const scopedPath = useCallback(
    (segment: string) => buildRoleScopedPath(user?.role, segment),
    [user?.role]
  );

  const detail = useMemo(() => RESEARCHER_PAGES_BY_ID[params.id], [params.id]);

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
    <DashboardLayout>
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
                <Link href={scopedPath(action.path)}>{action.label}</Link>
              </Button>
            ))}
          </CardContent>
        </Card>

        <Separator />

        <div className="flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link href={scopedPath("/pages")}>Back to researcher pages</Link>
          </Button>
          <Button asChild>
            <Link href={scopedPath("")}>Go to researcher hub</Link>
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
