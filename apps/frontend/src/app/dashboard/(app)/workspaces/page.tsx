"use client";

import { showSuccessToast } from "@/components/providers/ToastProvider";
import {
  ColorPicker,
  WorkspaceCard,
  getWorkspaceColor,
  type WorkspaceColor,
} from "@/components/workspace/WorkspaceCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryErrorHandler } from "@/hooks/useErrorHandler";
import { useAppSelector } from "@/redux/hooks";
import {
  useCreateWorkspaceMutation,
  useDeleteWorkspaceMutation,
  useInviteWorkspaceMemberMutation,
  useListWorkspacesQuery,
} from "@/redux/api/workspaceApi";
import { selectAccessToken } from "@/redux/auth/authSlice";
import { showApiErrorToast } from "@/lib/errorHandling";
import { AnimatePresence, motion } from "motion/react";
import {
  BookOpen,
  Building2,
  FileText,
  Plus,
  Search,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

type TabKey = "all" | "owned" | "shared";

const TABS: { id: TabKey; label: string }[] = [
  { id: "all", label: "All" },
  { id: "owned", label: "Owned" },
  { id: "shared", label: "Shared" },
];

export default function WorkspacesPage() {
  const router = useRouter();
  const accessToken = useAppSelector(selectAccessToken);
  const shouldFetch = !!accessToken && accessToken.length > 0;

  const [scope, setScope] = useState<TabKey>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const workspacesQuery = useListWorkspacesQuery(
    { limit: 50, scope: scope === "all" ? "all" : scope },
    { skip: !shouldFetch }
  );
  useQueryErrorHandler(workspacesQuery, { showToast: false });
  const { data, isLoading } = workspacesQuery;

  const [createWorkspace, { isLoading: creating }] = useCreateWorkspaceMutation();
  const [deleteWorkspace, { isLoading: deleting }] = useDeleteWorkspaceMutation();

  const workspaces = data?.data || [];

  // Filter by search term
  const filtered = workspaces.filter((w) =>
    w.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats
  const stats = {
    total: workspaces.length,
    owned: workspaces.filter((w) => w.isOwner).length,
    shared: workspaces.filter((w) => !w.isOwner).length,
    totalMembers: workspaces.reduce((acc, w) => acc + (w.memberCount || 1), 0),
    totalPapers: workspaces.reduce((acc, w) => acc + (w.paperCount || 0), 0),
  };

  const handleNavigate = (id: string) => {
    router.push(`/dashboard/workspaces/${id}`);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workspaces</h1>
          <p className="text-muted-foreground">
            Manage your research workspaces and collaborate with others
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowInviteModal(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Quick Invite
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Workspace
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { title: "Total", value: stats.total, icon: Building2, color: "text-blue-500" },
          { title: "Owned", value: stats.owned, icon: Building2, color: "text-purple-500" },
          { title: "Shared", value: stats.shared, icon: Users, color: "text-blue-500" },
          { title: "Collaborators", value: stats.totalMembers, icon: Users, color: "text-green-500" },
          { title: "Papers", value: stats.totalPapers, icon: FileText, color: "text-orange-500" },
        ].map((s) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border rounded-xl p-4 text-center"
          >
            <s.icon className={cn("h-4 w-4 mx-auto mb-1", s.color)} />
            <div className="text-2xl font-bold">{isLoading ? "…" : s.value}</div>
            <div className="text-xs text-muted-foreground">{s.title}</div>
          </motion.div>
        ))}
      </div>

      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search workspaces..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <div className="w-full">
        <div className="grid grid-cols-3 bg-muted rounded-lg p-1 max-w-md">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setScope(tab.id)}
              className={cn(
                "py-2 px-4 rounded-md text-sm font-medium transition-colors",
                activeTabIs(scope, tab.id)
                  ? "bg-background shadow-sm"
                  : "hover:bg-background/50"
              )}
            >
              {tab.id === "all"
                ? `All (${stats.total})`
                : tab.id === "owned"
                  ? `Owned (${stats.owned})`
                  : `Shared (${stats.shared})`}
            </button>
          ))}
        </div>
      </div>

      {/* Workspaces Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={scope}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-2"
        >
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No workspaces found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Create your first workspace to get started."}
              </p>
              {!searchTerm && (
                <Button onClick={() => setShowCreateModal(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Workspace
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((workspace) => (
                <WorkspaceCard
                  key={workspace.id}
                  workspace={{
                    ...workspace,
                    createdAt:
                      typeof workspace.createdAt === "string"
                        ? workspace.createdAt
                        : new Date(workspace.createdAt).toISOString(),
                  }}
                  onView={() => handleNavigate(workspace.id)}
                  onEdit={() => handleNavigate(workspace.id)}
                  onDelete={() => setShowDeleteConfirm(workspace.id)}
                />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Shared Workspaces Quick Link */}
      <div className="border-t pt-4">
        <Link
          href="/dashboard/workspaces/shared"
          className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
        >
          <BookOpen className="h-4 w-4" />
          View shared workspaces and invitations
        </Link>
      </div>

      {/* Create Modal */}
      <CreateWorkspaceModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={async ({ name, color }) => {
          try {
            const result = await createWorkspace({ name, color }).unwrap();
            showSuccessToast("Workspace created successfully");
            setShowCreateModal(false);
            router.push(`/dashboard/workspaces/${result.id}`);
          } catch (err) {
            showApiErrorToast(err as any);
          }
        }}
        creating={creating}
      />

      {/* Quick Invite Modal */}
      <QuickInviteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        ownedWorkspaces={workspaces.filter((w) => w.isOwner)}
        onInvited={() => {
          setShowInviteModal(false);
          showSuccessToast("Invitation sent");
        }}
      />

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        workspaceId={showDeleteConfirm}
        workspaceName={
          workspaces.find((w) => w.id === showDeleteConfirm)?.name || ""
        }
        deleting={deleting}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={async () => {
          if (!showDeleteConfirm) return;
          try {
            await deleteWorkspace(showDeleteConfirm).unwrap();
            showSuccessToast("Workspace deleted");
            setShowDeleteConfirm(null);
          } catch (err) {
            showApiErrorToast(err as any);
          }
        }}
      />
    </div>
  );
}

function activeTabIs(current: TabKey, target: TabKey) {
  return current === target;
}

// ============================================================================
// Create Workspace Modal
// ============================================================================

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: { name: string; color: WorkspaceColor }) => Promise<void> | void;
  creating: boolean;
}

function CreateWorkspaceModal({ isOpen, onClose, onCreate, creating }: CreateModalProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState<WorkspaceColor>("blue");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await onCreate({ name: name.trim(), color });
    setName("");
    setColor("blue");
  };

  const colorMeta = getWorkspaceColor(color);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-4"
          >
            <div className="bg-background border rounded-xl shadow-lg">
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "p-2 rounded-lg bg-gradient-to-br",
                      colorMeta.gradient
                    )}
                  >
                    <Building2 className="h-4 w-4 text-white" />
                  </div>
                  <h2 className="text-lg font-semibold">Create New Workspace</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Workspace Name</label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter workspace name"
                    required
                    maxLength={120}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Color Theme</label>
                  <ColorPicker value={color} onChange={setColor} />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={creating || !name.trim()}>
                    {creating ? "Creating…" : "Create Workspace"}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// Quick Invite Modal
// ============================================================================

interface QuickInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  ownedWorkspaces: { id: string; name: string; color?: WorkspaceColor }[];
  onInvited?: () => void;
}

function QuickInviteModal({ isOpen, onClose, ownedWorkspaces, onInvited }: QuickInviteModalProps) {
  const [email, setEmail] = useState("");
  const [selectedWorkspace, setSelectedWorkspace] = useState(ownedWorkspaces[0]?.id || "");
  const [role, setRole] = useState<"VIEWER" | "EDITOR" | "MANAGER">("VIEWER");
  const [inviteMutation] = useInviteWorkspaceMemberMutation();
  const [submitting, setSubmitting] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !selectedWorkspace) return;
    setSubmitting(true);
    try {
      await inviteMutation({
        id: selectedWorkspace,
        email: email.trim(),
        role: role as any,
      }).unwrap();
      setEmail("");
      onInvited?.();
    } catch (err) {
      showApiErrorToast(err as any);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-4"
          >
            <div className="bg-background border rounded-xl shadow-lg">
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                    <UserPlus className="h-4 w-4 text-white" />
                  </div>
                  <h2 className="text-lg font-semibold">Quick Invite</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleInvite} className="p-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="colleague@university.edu"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Workspace</label>
                  <select
                    value={selectedWorkspace}
                    onChange={(e) => setSelectedWorkspace(e.target.value)}
                    required
                    className="w-full h-10 px-3 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select workspace…</option>
                    {ownedWorkspaces.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["VIEWER", "EDITOR", "MANAGER"] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={cn(
                          "py-2 px-3 rounded-lg text-sm font-medium transition-colors border capitalize",
                          role === r
                            ? "bg-primary text-primary-foreground border-primary"
                            : "hover:bg-accent"
                        )}
                      >
                        {r.charAt(0) + r.slice(1).toLowerCase()}
                      </button>
                    ))}
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={submitting || !email.trim() || !selectedWorkspace}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {submitting ? "Sending…" : "Send Invitation"}
                </Button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// Delete Confirm Modal
// ============================================================================

interface DeleteConfirmProps {
  workspaceId: string | null;
  workspaceName: string;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
}

function DeleteConfirmModal({
  workspaceId,
  workspaceName,
  deleting,
  onClose,
  onConfirm,
}: DeleteConfirmProps) {
  const [confirmText, setConfirmText] = useState("");

  if (!workspaceId) return null;
  const isMatch = confirmText === workspaceName;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-50"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-4"
      >
        <div className="bg-background border rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-destructive mb-2">
            Delete Workspace
          </h3>
          <p className="text-muted-foreground mb-4">
            This will permanently delete <strong>{workspaceName}</strong> and all
            its contents. This action cannot be undone.
          </p>
          <div className="mb-4">
            <label className="text-sm font-medium">
              Type <strong>{workspaceName}</strong> to confirm:
            </label>
            <Input
              type="text"
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
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
