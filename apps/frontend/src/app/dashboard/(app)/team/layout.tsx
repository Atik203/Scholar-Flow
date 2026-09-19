"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetTeamAccessQuery } from "@/redux/api/teamApi";
import { selectAccessToken } from "@/redux/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
import { Shield } from "lucide-react";
import Link from "next/link";

/**
 * Team pages are open to anyone with derived team access: TEAM_LEAD+ or an
 * active collaborator in a shared workspace (the invitee of a team lead).
 * Manage-only pages (settings) add their own lead check on top.
 */
export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const accessToken = useAppSelector(selectAccessToken);
  const { data: accessInfo, isLoading } = useGetTeamAccessQuery(undefined, {
    skip: !accessToken,
  });

  if (!accessToken || isLoading || !accessInfo) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-muted-foreground/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!accessInfo.hasAccess) {
    return (
      <div className="mx-auto max-w-md py-20">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-muted-foreground" />
              Team access
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The Team area opens when you collaborate in a shared workspace or
              when a team lead invites you. Ask your team lead for an
              invitation.
            </p>
            <Button asChild className="w-full">
              <Link href="/dashboard/workspaces">Go to Workspaces</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
