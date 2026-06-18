"use client";

import { showErrorToast, showSuccessToast } from "@/components/providers/ToastProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ColorPicker,
  getWorkspaceColor,
  type WorkspaceColor,
} from "@/components/workspace/WorkspaceCard";
import { showApiErrorToast } from "@/lib/errorHandling";
import {
  useDeleteWorkspaceMutation,
  useGetWorkspaceCollectionsQuery,
  useGetWorkspacePapersQuery,
  useGetWorkspaceQuery,
  useGetWorkspaceSettingsQuery,
  useGetWorkspaceStatsQuery,
  useInviteWorkspaceMemberMutation,
  useListMembersQuery,
  useRemoveMemberMutation,
  useUpdateMemberRoleMutation,
  useUpdateWorkspaceMutation,
  useUpdateWorkspaceSettingsMutation,
} from "@/redux/api/workspaceApi";
import { selectAccessToken } from "@/redux/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  BookOpen,
  Building2,
  Calendar,
  Copy,
  Edit,
  FileText,
  Folder,
  Globe,
  Lock,
  Plus,
  Settings,
  Trash2,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

type TabType = "overview" | "collections" | "papers" | "members" | "settings";

export default function WorkspaceDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id as string;
  const accessToken = useAppSelector(selectAccessToken);
  const shouldFetch = !!accessToken && accessToken.length > 0;

  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCreateCollectionDialog, setShowCreateCollectionDialog] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const { data: workspace, isLoading } = useGetWorkspaceQuery(id, {
    skip: !shouldFetch,
  });
  const { data: stats } = useGetWorkspaceStatsQuery(id, { skip: !shouldFetch });
  const { data: settings } = useGetWorkspaceSettingsQuery(id, { skip: !shouldFetch });
  const { data: membersData } = useListMembersQuery({ id, limit: 50 });
  const members = membersData?.data || [];
  const { data: collectionsData } = useGetWorkspaceCollectionsQuery({ id, limit: 20 });
  const { data: papersData } = useGetWorkspacePapersQuery({ id, limit: 20 });

  const [updateWorkspace, { isLoading: updating }] = useUpdateWorkspaceMutation();
  const [deleteWorkspace, { isLoading: deleting }] = useDeleteWorkspaceMutation();
  const [updateSettings, { isLoading: updatingSettings }] =
    useUpdateWorkspaceSettingsMutation();
  const [inviteMember, { isLoading: inviting }] = useInviteWorkspaceMemberMutation();
  const [removeMember] = useRemoveMemberMutation();
  const [updateMemberRole] = useUpdateMemberRoleMutation();

  const [settingsColor, setSettingsColor] = useState<WorkspaceColor>("blue");
  const [allowExternalSharing, setAllowExternalSharing] = useState(false);
  const [allowDownload, setAllowDownload] = useState(true);
  const [aiFeaturesEnabled, setAiFeaturesEnabled] = useState(true);
  const [allowMemberInvites, setAllowMemberInvites] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Initialize settings state once data arrives
  if (settings && !initialized) {
    setSettingsColor((settings.color as WorkspaceColor) || "blue");
    setAllowExternalSharing(settings.allowExternalSharing ?? false);
    setAllowDownload(settings.allowDownload ?? true);
    setAiFeaturesEnabled(settings.aiFeaturesEnabled ?? true);
    setAllowMemberInvites(settings.allowMemberInvites ?? true);
    setInitialized(true);
  }

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: "overview", label: "Overview", icon: Building2 },
    { id: "collections", label: "Collections", icon: Folder },
    { id: "papers", label: "Papers", icon: FileText },
    { id: "members", label: "Members", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const isOwner = workspace?.isOwner;

  const handleSaveSettings = async () => {
    try {
      await updateSettings({
        id,
        color: settingsColor,
        allowExternalSharing,
        allowDownload,
        aiFeaturesEnabled,
        allowMemberInvites,
      }).unwrap();
      showSuccessToast("Settings saved");
    } catch (err) {
      showApiErrorToast(err as any);
    }
  };

  const handleSaveEdit = async () => {
    if (!editName.trim()) return;
    try {
      await updateWorkspace({
        id,
        name: editName.trim(),
        description: editDescription || undefined,
      }).unwrap();
      showSuccessToast("Workspace updated");
      setShowEditDialog(false);
    } catch (err) {
      showApiErrorToast(err as any);
    }
  };

  const handleDelete = async () => {
    if (deleteConfirmText !== workspace?.name) return;
    try {
      await deleteWorkspace(id).unwrap();
      showSuccessToast("Workspace deleted");
      router.push("/dashboard/workspaces");
    } catch (err) {
      showApiErrorToast(err as any);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      await removeMember({ id, memberId }).unwrap();
      showSuccessToast("Member removed");
    } catch (err) {
      showApiErrorToast(err as any);
    }
  };

  const handleUpdateMemberRole = async (
    memberId: string,
    role: "VIEWER" | "EDITOR" | "MANAGER"
  ) => {
    try {
      await updateMemberRole({ id, memberId, role }).unwrap();
      showSuccessToast("Role updated");
    } catch (err) {
      showApiErrorToast(err as any);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Skeleton className="h-16" />
        <Skeleton className="h-40" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="text-center py-12">
        <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
        <p>Workspace not found</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/workspaces">Back to Workspaces</Link>
        </Button>
      </div>
    );
  }

  const colorMeta = getWorkspaceColor(workspace.color as WorkspaceColor);
  const statsData = stats || { papers: 0, collections: 0, members: 0, storage: "0 KB" };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/workspaces">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Workspaces
          </Link>
        </Button>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setShowInviteDialog(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite
          </Button>
          {isOwner && (
            <Button
              onClick={() => {
                setEditName(workspace.name);
                setEditDescription(workspace.description || "");
                setShowEditDialog(true);
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
        </div>
      </div>

      {/* Workspace Hero Card */}
      <div
        className={cn(
          "rounded-xl border bg-gradient-to-r p-6 from-background via-primary/5 to-blue-500/10"
        )}
      >
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "p-4 rounded-xl shadow-lg bg-gradient-to-br",
                colorMeta.gradient
              )}
            >
              <Building2 className="h-10 w-10 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold">{workspace.name}</h1>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium",
                    workspace.visibility === "PUBLIC"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  )}
                >
                  {workspace.visibility === "PUBLIC" ? (
                    <Globe className="h-3 w-3" />
                  ) : (
                    <Lock className="h-3 w-3" />
                  )}
                  {workspace.visibility === "PUBLIC" ? "Public" : "Private"}
                </span>
              </div>
              {workspace.description && (
                <p className="text-muted-foreground max-w-2xl">
                  {workspace.description}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Created {formatDate(workspace.createdAt)}
                </span>
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  Owner: {workspace.ownerId.slice(0, 8)}…
                </span>
              </div>
            </div>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatTile label="Papers" value={statsData.papers} />
            <StatTile label="Collections" value={statsData.collections} />
            <StatTile label="Members" value={statsData.members} />
            <StatTile label="Storage" value={statsData.storage} small />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b">
        <nav className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 py-3 px-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap",
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "overview" && (
          <OverviewTab
            papers={papersData?.result || []}
            collections={collectionsData?.result || []}
            statsData={statsData}
            onUploadClick={() => router.push("/dashboard/papers/upload")}
            onCreateCollection={() => setShowCreateCollectionDialog(true)}
            onInvite={() => setShowInviteDialog(true)}
            onViewCollection={(collectionId) =>
              router.push(`/dashboard/collections/${collectionId}`)
            }
            onViewPaper={(paperId) => router.push(`/dashboard/papers/${paperId}`)}
          />
        )}

        {activeTab === "collections" && (
          <CollectionsTab
            collections={collectionsData?.result || []}
            onCreateClick={() => setShowCreateCollectionDialog(true)}
            onView={(collectionId) =>
              router.push(`/dashboard/collections/${collectionId}`)
            }
          />
        )}

        {activeTab === "papers" && (
          <PapersTab
            papers={papersData?.result || []}
            onUploadClick={() => router.push("/dashboard/papers/upload")}
            onView={(paperId) => router.push(`/dashboard/papers/${paperId}`)}
          />
        )}

        {activeTab === "members" && (
          <MembersTab
            members={members}
            isOwner={!!isOwner}
            onRemove={handleRemoveMember}
            onUpdateRole={handleUpdateMemberRole}
          />
        )}

        {activeTab === "settings" && (
          <SettingsTab
            color={settingsColor}
            setColor={setSettingsColor}
            allowExternalSharing={allowExternalSharing}
            setAllowExternalSharing={setAllowExternalSharing}
            allowDownload={allowDownload}
            setAllowDownload={setAllowDownload}
            aiFeaturesEnabled={aiFeaturesEnabled}
            setAiFeaturesEnabled={setAiFeaturesEnabled}
            allowMemberInvites={allowMemberInvites}
            setAllowMemberInvites={setAllowMemberInvites}
            isOwner={!!isOwner}
            saving={updatingSettings}
            onSave={handleSaveSettings}
            onDeleteClick={() => setShowDeleteDialog(true)}
          />
        )}
      </div>

      {/* Modals */}
      <InviteDialog
        isOpen={showInviteDialog}
        onClose={() => setShowInviteDialog(false)}
        inviting={inviting}
        onSend={async ({ email, role }) => {
          try {
            await inviteMember({ id, email, role: role as any }).unwrap();
            showSuccessToast("Invitation sent");
            setShowInviteDialog(false);
          } catch (err) {
            showApiErrorToast(err as any);
          }
        }}
      />

      <EditDialog
        isOpen={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        name={editName}
        setName={setEditName}
        description={editDescription}
        setDescription={setEditDescription}
        saving={updating}
        onSave={handleSaveEdit}
      />

      <DeleteDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        name={workspace.name}
        confirmText={deleteConfirmText}
        setConfirmText={setDeleteConfirmText}
        deleting={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}

// ============================================================================
// Sub-components
// ============================================================================

function StatTile({ label, value, small }: { label: string; value: number | string; small?: boolean }) {
  return (
    <div className="text-center p-3 bg-background/50 rounded-lg border">
      <p className={cn("font-bold text-primary", small ? "text-base" : "text-2xl")}>
        {value}
      </p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

interface OverviewTabProps {
  papers: any[];
  collections: any[];
  statsData: { papers: number; collections: number; members: number; storage: string };
  onUploadClick: () => void;
  onCreateCollection: () => void;
  onInvite: () => void;
  onViewCollection: (id: string) => void;
  onViewPaper: (id: string) => void;
}

function OverviewTab({
  papers,
  collections,
  onUploadClick,
  onCreateCollection,
  onInvite,
  onViewCollection,
  onViewPaper,
}: OverviewTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Recent Papers */}
      <div className="lg:col-span-2 rounded-xl border bg-card">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Papers
          </h3>
        </div>
        <div className="p-4 space-y-3">
          {papers.slice(0, 5).length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No papers yet. Upload your first paper.
            </p>
          ) : (
            papers.slice(0, 5).map((paper) => (
              <div
                key={paper.id}
                className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => onViewPaper(paper.id)}
              >
                <p className="font-medium text-sm line-clamp-1">{paper.title}</p>
                <p className="text-xs text-muted-foreground">
                  Added {formatDate(paper.createdAt)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-6">
        <div className="rounded-xl border bg-card p-4">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Button className="w-full" onClick={onUploadClick}>
              <Plus className="h-4 w-4 mr-2" />
              Upload Paper
            </Button>
            <Button variant="outline" className="w-full" onClick={onCreateCollection}>
              <Folder className="h-4 w-4 mr-2" />
              Create Collection
            </Button>
            <Button variant="outline" className="w-full" onClick={onInvite}>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          </div>
        </div>

        <div className="rounded-xl border bg-card">
          <div className="p-4 border-b">
            <h3 className="font-semibold flex items-center gap-2">
              <Folder className="h-5 w-5" />
              Collections
            </h3>
          </div>
          <div className="p-4 space-y-2">
            {collections.slice(0, 3).length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-2">
                No collections yet
              </p>
            ) : (
              collections.slice(0, 3).map((col) => (
                <div
                  key={col.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted cursor-pointer"
                  onClick={() => onViewCollection(col.id)}
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{col.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {col._count?.papers || 0} papers
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CollectionsTab({
  collections,
  onCreateClick,
  onView,
}: {
  collections: any[];
  onCreateClick: () => void;
  onView: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">All Collections</h2>
        <Button onClick={onCreateClick}>
          <Plus className="mr-2 h-4 w-4" />
          Create Collection
        </Button>
      </div>
      {collections.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No collections in this workspace yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((col) => {
            const colorMeta = getWorkspaceColor(col.color as WorkspaceColor);
            return (
              <div
                key={col.id}
                className="rounded-xl border bg-card p-4 hover:shadow-md cursor-pointer transition-shadow"
                onClick={() => onView(col.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={cn("p-2 rounded-lg bg-gradient-to-br", colorMeta.gradient)}>
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                </div>
                <h3 className="font-semibold mb-1 line-clamp-1">{col.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {col._count?.papers || 0} papers
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PapersTab({
  papers,
  onUploadClick,
  onView,
}: {
  papers: any[];
  onUploadClick: () => void;
  onView: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">All Papers</h2>
        <Button onClick={onUploadClick}>
          <Plus className="mr-2 h-4 w-4" />
          Upload Paper
        </Button>
      </div>
      {papers.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No papers in this workspace yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {papers.map((paper) => (
            <div
              key={paper.id}
              className="rounded-xl border bg-card p-4 hover:shadow-md cursor-pointer transition-shadow"
              onClick={() => onView(paper.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{paper.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Added {formatDate(paper.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MembersTab({
  members,
  isOwner,
  onRemove,
  onUpdateRole,
}: {
  members: any[];
  isOwner: boolean;
  onRemove: (memberId: string) => void;
  onUpdateRole: (memberId: string, role: "VIEWER" | "EDITOR" | "MANAGER") => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Team Members ({members.length})</h2>
      </div>
      <div className="rounded-xl border bg-card divide-y">
        {members.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">No members yet</div>
        ) : (
          members.map((member: any) => {
            const role = (member.role || "EDITOR").toString();
            return (
              <div
                key={member.id}
                className="p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{member.name || member.email || "Member"}</p>
                    <p className="text-sm text-muted-foreground">
                      {member.email || ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {isOwner && role !== "OWNER" ? (
                    <select
                      value={role}
                      onChange={(e) =>
                        onUpdateRole(member.id, e.target.value as "VIEWER" | "EDITOR" | "MANAGER")
                      }
                      className="h-8 px-2 text-xs border rounded-md bg-background"
                    >
                      <option value="VIEWER">Viewer</option>
                      <option value="EDITOR">Editor</option>
                      <option value="MANAGER">Manager</option>
                    </select>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {role}
                    </span>
                  )}
                  {isOwner && role !== "OWNER" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemove(member.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

interface SettingsTabProps {
  color: WorkspaceColor;
  setColor: (c: WorkspaceColor) => void;
  allowExternalSharing: boolean;
  setAllowExternalSharing: (v: boolean) => void;
  allowDownload: boolean;
  setAllowDownload: (v: boolean) => void;
  aiFeaturesEnabled: boolean;
  setAiFeaturesEnabled: (v: boolean) => void;
  allowMemberInvites: boolean;
  setAllowMemberInvites: (v: boolean) => void;
  isOwner: boolean;
  saving: boolean;
  onSave: () => void;
  onDeleteClick: () => void;
}

function SettingsTab({
  color,
  setColor,
  allowExternalSharing,
  setAllowExternalSharing,
  allowDownload,
  setAllowDownload,
  aiFeaturesEnabled,
  setAiFeaturesEnabled,
  allowMemberInvites,
  setAllowMemberInvites,
  isOwner,
  saving,
  onSave,
  onDeleteClick,
}: SettingsTabProps) {
  if (!isOwner) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <p className="text-muted-foreground">
          Only the workspace owner can edit settings.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="rounded-xl border bg-card p-6 space-y-5">
        <h3 className="font-semibold">Workspace Settings</h3>

        <div className="space-y-2">
          <label className="text-sm font-medium">Color Theme</label>
          <ColorPicker value={color} onChange={setColor} />
        </div>

        <ToggleRow
          label="Allow external sharing"
          description="Members can share papers and collections outside the workspace"
          value={allowExternalSharing}
          onChange={setAllowExternalSharing}
        />
        <ToggleRow
          label="Allow downloads"
          description="Members can download uploaded files"
          value={allowDownload}
          onChange={setAllowDownload}
        />
        <ToggleRow
          label="Enable AI features"
          description="Members can use AI-powered insights and recommendations"
          value={aiFeaturesEnabled}
          onChange={setAiFeaturesEnabled}
        />
        <ToggleRow
          label="Allow member invites"
          description="Members can invite other users without owner approval"
          value={allowMemberInvites}
          onChange={setAllowMemberInvites}
        />

        <Button onClick={onSave} disabled={saving}>
          {saving ? "Saving…" : "Save Settings"}
        </Button>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border border-destructive/50 bg-destructive/5 p-6">
        <h3 className="font-semibold text-destructive mb-2">Danger Zone</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Once you delete a workspace, there is no going back. Please be certain.
        </p>
        <Button variant="destructive" onClick={onDeleteClick}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Workspace
        </Button>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b last:border-0">
      <div>
        <p className="font-medium text-sm">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={cn(
          "relative w-11 h-6 rounded-full transition-colors shrink-0",
          value ? "bg-primary" : "bg-muted"
        )}
        aria-label={label}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform",
            value && "translate-x-5"
          )}
        />
      </button>
    </div>
  );
}

// ============================================================================
// Modals
// ============================================================================

function InviteDialog({
  isOpen,
  onClose,
  inviting,
  onSend,
}: {
  isOpen: boolean;
  onClose: () => void;
  inviting: boolean;
  onSend: (data: { email: string; role: string }) => Promise<void>;
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"VIEWER" | "EDITOR" | "MANAGER" | "OWNER">("EDITOR");
  const inviteLink = typeof window !== "undefined" ? `${window.location.origin}/workspaces/invite` : "";

  const copyInviteLink = () => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(inviteLink);
    showSuccessToast("Invite link copied");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-background border rounded-xl p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold mb-4">Invite Team Member</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Email Address</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="colleague@university.edu"
                  className="mt-1.5"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="mt-1.5 w-full h-10 px-3 rounded-md border bg-background text-sm"
                >
                  <option value="VIEWER">Viewer — Read only</option>
                  <option value="EDITOR">Editor — Can edit</option>
                  <option value="MANAGER">Manager — Can manage members</option>
                  <option value="OWNER">Owner — Full access</option>
                </select>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Or share invite link:</p>
                <div className="flex gap-2">
                  <Input type="text" readOnly value={inviteLink} className="text-xs" />
                  <Button size="icon" variant="outline" onClick={copyInviteLink}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-6">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                disabled={!email.trim() || inviting}
                onClick={() => onSend({ email: email.trim(), role })}
              >
                {inviting ? "Sending…" : "Send Invite"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function EditDialog({
  isOpen,
  onClose,
  name,
  setName,
  description,
  setDescription,
  saving,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  setName: (s: string) => void;
  description: string;
  setDescription: (s: string) => void;
  saving: boolean;
  onSave: () => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-background border rounded-xl p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold mb-4">Edit Workspace</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="mt-1.5 w-full px-3 py-2 border rounded-md bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-6">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={onSave} disabled={saving || !name.trim()}>
                {saving ? "Saving…" : "Save Changes"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DeleteDialog({
  isOpen,
  onClose,
  name,
  confirmText,
  setConfirmText,
  deleting,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  confirmText: string;
  setConfirmText: (s: string) => void;
  deleting: boolean;
  onConfirm: () => void;
}) {
  const isMatch = confirmText === name;
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-background border rounded-xl p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold text-destructive mb-2">Delete Workspace</h3>
            <p className="text-muted-foreground mb-4">
              This will permanently delete <strong>{name}</strong> and all its contents.
              This action cannot be undone.
            </p>
            <div className="mb-4">
              <label className="text-sm font-medium">
                Type <strong>{name}</strong> to confirm:
              </label>
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={!isMatch || deleting}
                onClick={onConfirm}
              >
                {deleting ? "Deleting…" : "Delete Workspace"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
