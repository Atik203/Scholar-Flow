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
  BookOpen,
  Clock,
  FileText,
  Settings,
  Shield,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import Link from "next/link";
import { StatsCard } from "./StatsCard";

interface TeamLeadCollaborationHubProps {
  currentWorkspace: any;
  selectedWorkspaceId: string;
  dynamicActivity: any[];
  recentActivity: any[];
  scopedHref: (href: string) => string;
}

export function TeamLeadCollaborationHub({
  currentWorkspace,
  selectedWorkspaceId,
  dynamicActivity,
  recentActivity,
  scopedHref,
}: TeamLeadCollaborationHubProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Users className="h-4 w-4 sm:h-5 sm:w-5" />
          Team Collaboration Hub
          <Badge variant="outline" className="text-xs">
            Team Lead
          </Badge>
        </CardTitle>
        <CardDescription className="text-sm">
          Manage your team and track workspace collaboration activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard
            label="Team Members"
            value={currentWorkspace?.memberCount || 0}
            subtext="Active collaborators"
            icon={Users}
            iconColor="text-blue-600"
          />

          <StatsCard
            label="Team Papers"
            value={currentWorkspace?.paperCount || 0}
            subtext="Shared research"
            icon={FileText}
            iconColor="text-green-600"
          />

          <StatsCard
            label="Collections"
            value={currentWorkspace?.collectionCount || 0}
            subtext="Organized collections"
            icon={BookOpen}
            iconColor="text-purple-600"
          />
        </div>

        {/* Team Management Actions */}
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Team Management
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              asChild
              variant="outline"
              className="justify-start h-auto p-3"
            >
              <Link
                href={scopedHref(`/workspaces/${selectedWorkspaceId}`)}
                className="flex items-center gap-2 w-full"
              >
                <UserPlus className="h-4 w-4" />
                <span>Invite Members</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="justify-start h-auto p-3"
            >
              <Link
                href={scopedHref(`/workspaces/${selectedWorkspaceId}`)}
                className="flex items-center gap-2 w-full"
              >
                <Shield className="h-4 w-4" />
                <span>Manage Permissions</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="justify-start h-auto p-3"
            >
              <Link
                href={scopedHref(`/workspaces/${selectedWorkspaceId}`)}
                className="flex items-center gap-2 w-full"
              >
                <TrendingUp className="h-4 w-4" />
                <span>Team Analytics</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Recent Team Activity */}
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Recent Team Activity
          </h4>
          <div className="space-y-2">
            {(dynamicActivity.length ? dynamicActivity : recentActivity)
              .slice(0, 4)
              .map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-2 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="rounded-full p-2 bg-muted flex-shrink-0">
                    <activity.icon
                      className={`h-3 w-3 sm:h-4 sm:w-4 ${activity.color}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm line-clamp-1">
                      {activity.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
