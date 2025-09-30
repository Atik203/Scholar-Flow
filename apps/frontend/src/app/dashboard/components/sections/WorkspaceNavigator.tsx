import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type Workspace } from "@/redux/api/workspaceApi";
import {
  ArrowUpRight,
  BookOpen,
  Building2,
  FileText,
  Plus,
  Users,
} from "lucide-react";
import Link from "next/link";

interface WorkspaceNavigatorProps {
  workspacesData:
    | {
        data: Workspace[];
        meta: { page: number; limit: number; total: number; totalPage: number };
      }
    | undefined;
  scopedHref: (href: string) => string;
}

export function WorkspaceNavigator({
  workspacesData,
  scopedHref,
}: WorkspaceNavigatorProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />
          Your Workspaces
        </CardTitle>
        <CardDescription className="text-sm">
          Quick access to all your research workspaces
        </CardDescription>
      </CardHeader>
      <CardContent>
        {workspacesData?.data && workspacesData.data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {workspacesData.data.slice(0, 6).map((workspace: Workspace) => (
              <Link
                key={workspace.id}
                href={scopedHref(`/workspaces/${workspace.id}`)}
                className="group"
              >
                <div className="rounded-lg border p-4 hover:shadow-md hover:border-primary/50 transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <div className="rounded p-2 bg-blue-50 dark:bg-blue-950/20">
                      <Building2 className="h-4 w-4 text-blue-600" />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {workspace.userRole || "Member"}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-sm mb-1 line-clamp-1 group-hover:text-primary">
                    {workspace.name}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {workspace.description || "No description"}
                  </p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {workspace.memberCount || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {workspace.paperCount || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      {workspace.collectionCount || 0}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-4">
              No workspaces yet. Create your first workspace to start
              collaborating!
            </p>
            <Button asChild>
              <Link href={scopedHref("/workspaces/create")}>
                <Plus className="h-4 w-4 mr-2" />
                Create Workspace
              </Link>
            </Button>
          </div>
        )}

        {workspacesData?.data && workspacesData.data.length > 6 && (
          <div className="mt-4">
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href={scopedHref("/workspaces")}>
                View All Workspaces
                <ArrowUpRight className="h-3 w-3 ml-1" />
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
