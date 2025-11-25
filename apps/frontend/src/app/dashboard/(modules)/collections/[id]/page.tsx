"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DocumentPreview } from "@/components/papers/DocumentPreview";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/providers/ToastProvider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProtectedRoute } from "@/hooks/useAuthGuard";
import {
  useAddPaperToCollectionMutation,
  useDeleteCollectionMutation,
  useGetCollectionPapersQuery,
  useGetCollectionQuery,
  useInviteMemberMutation,
  useRemovePaperFromCollectionMutation,
} from "@/redux/api/collectionApi";
import {
  useGetPaperFileUrlQuery,
  useListPapersQuery,
} from "@/redux/api/paperApi";
import { useAuth } from "@/redux/auth/useAuth";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Copy,
  Edit,
  Eye,
  FileText,
  Globe,
  Loader2,
  Lock,
  Plus,
  Search,
  Settings,
  Share2,
  Trash2,
  User,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { use, useState } from "react";

export default function CollectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const isProtected = useProtectedRoute();
  const router = useRouter();
  const { session } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePermission, setInvitePermission] = useState<"VIEW" | "EDIT">(
    "EDIT"
  );
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [previewPaperId, setPreviewPaperId] = useState<string | null>(null);
  const [isAddPapersDialogOpen, setIsAddPapersDialogOpen] = useState(false);
  const [selectedPapers, setSelectedPapers] = useState<Set<string>>(new Set());

  const resolvedParams = use(params);

  // Validate params
  if (!resolvedParams?.id) {
    notFound();
  }

  const {
    data: collection,
    isLoading: collectionLoading,
    error: collectionError,
    refetch: refetchCollection,
  } = useGetCollectionQuery(resolvedParams.id, {
    pollingInterval: 30000, // Poll every 30 seconds for real-time updates
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: papersData,
    isLoading: papersLoading,
    error: papersError,
    refetch: refetchPapers,
  } = useGetCollectionPapersQuery(
    {
      collectionId: resolvedParams.id,
      page: 1,
      limit: 100,
    },
    {
      pollingInterval: 30000, // Poll every 30 seconds for real-time updates
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  const [deleteCollection, { isLoading: isDeleting }] =
    useDeleteCollectionMutation();
  const [inviteMember, { isLoading: isInviting }] = useInviteMemberMutation();
  const [removePaperFromCollection, { isLoading: isRemovingPaper }] =
    useRemovePaperFromCollectionMutation();
  const [addPaperToCollection, { isLoading: isAddingPaper }] =
    useAddPaperToCollectionMutation();

  // Query for available papers to add
  const { data: availablePapersData, isLoading: availablePapersLoading } =
    useListPapersQuery(
      { page: 1, limit: 100 },
      { skip: !isAddPapersDialogOpen }
    );

  // Query for paper preview
  const {
    data: previewUrlData,
    isLoading: previewLoading,
    error: previewError,
  } = useGetPaperFileUrlQuery(previewPaperId || "", { skip: !previewPaperId });

  // Process papers data and apply search filter
  const papers = papersData?.result || [];
  const filteredPapers = papers.filter((collectionPaper: any) => {
    const paper = collectionPaper.paper;
    const searchLower = searchTerm.toLowerCase();

    return (
      paper.title.toLowerCase().includes(searchLower) ||
      (paper.abstract || "").toLowerCase().includes(searchLower) ||
      (paper.metadata?.authors || []).some((author: string) =>
        author.toLowerCase().includes(searchLower)
      )
    );
  });

  // Handler functions
  const handleInvite = async () => {
    if (!inviteEmail.trim()) {
      showErrorToast("Please enter a valid email");
      return;
    }

    try {
      await inviteMember({
        id: resolvedParams.id,
        email: inviteEmail.trim(),
        role: "RESEARCHER",
        permission: invitePermission,
      }).unwrap();

      // Manual refetch for immediate updates
      refetchCollection();

      showSuccessToast("Invitation sent successfully");
      setInviteEmail("");
      setInvitePermission("EDIT");
      setIsInviteDialogOpen(false);
    } catch (error: any) {
      showErrorToast(error?.data?.message || "Failed to send invitation");
    }
  };

  const handleRemovePaper = async (paperId: string, paperTitle: string) => {
    try {
      await removePaperFromCollection({
        collectionId: resolvedParams.id,
        paperId,
      }).unwrap();

      // Manual refetch for immediate updates
      refetchCollection();
      refetchPapers();

      showSuccessToast(`Removed "${paperTitle}" from collection`);
    } catch (error: any) {
      showErrorToast(
        error?.data?.message || "Failed to remove paper from collection"
      );
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCollection(resolvedParams.id).unwrap();
      showSuccessToast("Collection deleted successfully");
      router.push("/dashboard/collections");
    } catch (error: any) {
      showErrorToast(error?.data?.message || "Failed to delete collection");
    }
  };

  const handleAddPapers = async () => {
    if (selectedPapers.size === 0) {
      showErrorToast("Please select at least one paper to add");
      return;
    }

    try {
      const promises = Array.from(selectedPapers).map((paperId) =>
        addPaperToCollection({
          collectionId: resolvedParams.id,
          data: { paperId },
        }).unwrap()
      );

      await Promise.all(promises);

      // Manual refetch for immediate updates
      refetchCollection();
      refetchPapers();

      showSuccessToast(`Added ${selectedPapers.size} paper(s) to collection`);
      setSelectedPapers(new Set());
      setIsAddPapersDialogOpen(false);
    } catch (error: any) {
      showErrorToast(
        error?.data?.message || "Failed to add papers to collection"
      );
    }
  };

  const togglePaperSelection = (paperId: string) => {
    const newSelection = new Set(selectedPapers);
    if (newSelection.has(paperId)) {
      newSelection.delete(paperId);
    } else {
      newSelection.add(paperId);
    }
    setSelectedPapers(newSelection);
  };

  if (!isProtected) {
    return null;
  }

  if (collectionLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">
            Loading collection...
          </span>
        </div>
      </DashboardLayout>
    );
  }

  if (collectionError || !collection) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Collection not found</h3>
          <p className="text-muted-foreground mb-4">
            The collection you're looking for doesn't exist or you don't have
            access to it.
          </p>
          <Button asChild>
            <Link href="/dashboard/collections">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Collections
            </Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  // Permission checking
  const userPermission = collection?.userPermission;
  const canEdit = userPermission === "OWNER" || userPermission === "EDIT";
  const isOwner = userPermission === "OWNER";

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/collections">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Collections
            </Link>
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="h-6 w-6 text-muted-foreground" />
              <h1 className="text-3xl font-bold tracking-tight">
                {collection.name}
              </h1>
              <Badge variant={collection.isPublic ? "default" : "secondary"}>
                {collection.isPublic ? (
                  <>
                    <Globe className="h-3 w-3 mr-1" />
                    Public
                  </>
                ) : (
                  <>
                    <Lock className="h-3 w-3 mr-1" />
                    Private
                  </>
                )}
              </Badge>
              {userPermission && userPermission !== "OWNER" && (
                <Badge
                  variant={userPermission === "EDIT" ? "default" : "outline"}
                >
                  <User className="h-3 w-3 mr-1" />
                  {userPermission === "EDIT" ? "Editor" : "View Only"}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">
              {collection.description || "No description provided"}
            </p>
            {userPermission === "VIEW" && (
              <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center text-sm text-blue-800 dark:text-white">
                  <Eye className="h-4 w-4 mr-2" />
                  You have view-only access to this collection. You can browse
                  papers but cannot make changes.
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share Collection</DialogTitle>
                  <DialogDescription>
                    Share this collection with others
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Input
                      readOnly
                      value={`${window.location.origin}/dashboard/collections/${collection.id}`}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${window.location.origin}/dashboard/collections/${collection.id}`
                        );
                        showSuccessToast("Link copied to clipboard");
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    onClick={() => setIsInviteDialogOpen(true)}
                    className="w-full"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite People
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {canEdit && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {canEdit && (
                    <DropdownMenuItem
                      onClick={() =>
                        router.push(
                          `/dashboard/collections/${collection.id}/edit`
                        )
                      }
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Collection
                    </DropdownMenuItem>
                  )}
                  {isOwner && (
                    <DropdownMenuItem
                      onClick={() => setIsInviteDialogOpen(true)}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Invite Members
                    </DropdownMenuItem>
                  )}
                  {(canEdit || isOwner) && <DropdownMenuSeparator />}
                  {isOwner && (
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={handleDelete}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Collection
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Papers
                  </p>
                  <p className="text-2xl font-bold">
                    {collection._count?.papers || 0}
                  </p>
                </div>
                <div className="rounded-full p-2 bg-blue-50 dark:bg-blue-950/20">
                  <FileText className="h-4 w-4 text-blue-600 dark:text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Owner
                  </p>
                  <p className="text-sm font-medium">{collection.owner.name}</p>
                </div>
                <div className="rounded-full p-2 bg-green-50 dark:bg-green-950/20">
                  <User className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Created
                  </p>
                  <p className="text-sm font-medium">
                    {new Date(collection.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="rounded-full p-2 bg-purple-50 dark:bg-purple-950/20">
                  <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Status
                  </p>
                  <p className="text-sm font-medium">
                    {collection.isPublic ? "Public" : "Private"}
                  </p>
                </div>
                <div className="rounded-full p-2 bg-orange-50 dark:bg-orange-950/20">
                  {collection.isPublic ? (
                    <Globe className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  ) : (
                    <Lock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Papers in Collection</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => setIsAddPapersDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Papers
                </Button>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search papers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {papersLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">
                  Loading papers...
                </span>
              </div>
            ) : papersError ? (
              <div className="text-center py-8">
                <p className="text-destructive mb-4">Failed to load papers</p>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            ) : filteredPapers.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No papers found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm
                    ? "No papers match your search criteria"
                    : "This collection doesn't have any papers yet"}
                </p>
                {!searchTerm && canEdit && (
                  <Button onClick={() => setIsAddPapersDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Papers
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPapers.map((collectionPaper: any) => {
                  const paper = collectionPaper.paper;
                  return (
                    <Card
                      key={collectionPaper.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-lg mb-2">
                              {paper.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {paper.abstract || "No abstract available"}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>
                                Authors:{" "}
                                {(paper.metadata?.authors || []).join(", ") ||
                                  "Unknown"}
                              </span>
                              <span>
                                Year: {paper.metadata?.year || "Unknown"}
                              </span>
                              {paper.file && (
                                <span>
                                  Size:{" "}
                                  {Math.round(
                                    paper.file.sizeBytes / (1024 * 1024)
                                  )}
                                  MB
                                </span>
                              )}
                              <span>
                                Added:{" "}
                                {new Date(
                                  collectionPaper.addedAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Badge variant="outline">
                              {paper.processingStatus}
                            </Badge>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/dashboard/papers/${paper.id}`}>
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Link>
                            </Button>
                            {paper.file && (
                              <Dialog
                                open={previewPaperId === paper.id}
                                onOpenChange={(open) =>
                                  setPreviewPaperId(open ? paper.id : null)
                                }
                              >
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    Preview
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl">
                                  <DialogHeader>
                                    <DialogTitle>{paper.title}</DialogTitle>
                                  </DialogHeader>
                                  <div className="max-h-[80vh] overflow-auto">
                                    {previewLoading && (
                                      <div className="h-64 flex items-center justify-center text-sm text-muted-foreground">
                                        Loading preview...
                                      </div>
                                    )}
                                    {previewUrlData?.data?.url && (
                                      <DocumentPreview
                                        fileUrl={previewUrlData.data.url}
                                        fileName={paper.file?.originalFilename}
                                        mimeType={paper.file?.contentType}
                                        originalFilename={
                                          paper.file?.originalFilename
                                        }
                                        className="mx-auto"
                                      />
                                    )}
                                    {!previewLoading &&
                                      !previewUrlData?.data?.url && (
                                        <div className="h-64 flex items-center justify-center text-sm text-muted-foreground">
                                          Preview unavailable
                                        </div>
                                      )}
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )}
                            {canEdit && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={isRemovingPaper}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Remove Paper
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to remove "
                                      {paper.title}" from this collection? The
                                      paper itself will not be deleted.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleRemovePaper(paper.id, paper.title)
                                      }
                                    >
                                      Remove
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Invite Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite to Collection</DialogTitle>
            <DialogDescription>
              Invite a colleague to collaborate on this collection
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="colleague@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsInviteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleInvite}
              disabled={isInviting || !inviteEmail}
            >
              {isInviting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Papers Dialog */}
      <Dialog
        open={isAddPapersDialogOpen}
        onOpenChange={setIsAddPapersDialogOpen}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Add Papers to Collection</DialogTitle>
            <DialogDescription>
              Select papers from your library to add to this collection
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {availablePapersLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Loading papers...</span>
              </div>
            ) : availablePapersData?.items?.length ? (
              <div className="max-h-96 overflow-y-auto space-y-2">
                {availablePapersData.items
                  .filter(
                    (paper) =>
                      !papers.some((cp: any) => cp.paper.id === paper.id)
                  )
                  .map((paper: any) => (
                    <div
                      key={paper.id}
                      className={`border rounded p-3 cursor-pointer transition-colors ${
                        selectedPapers.has(paper.id)
                          ? "bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                      onClick={() => togglePaperSelection(paper.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{paper.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {paper.abstract || "No abstract available"}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                            <span>
                              Authors:{" "}
                              {(paper.metadata?.authors || []).join(", ") ||
                                "Unknown"}
                            </span>
                            <span>
                              Year: {paper.metadata?.year || "Unknown"}
                            </span>
                            <span>Status: {paper.processingStatus}</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <Checkbox
                            checked={selectedPapers.has(paper.id)}
                            onChange={() => togglePaperSelection(paper.id)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No papers available to add
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddPapersDialogOpen(false);
                setSelectedPapers(new Set());
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddPapers}
              disabled={isAddingPaper || selectedPapers.size === 0}
            >
              {isAddingPaper && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Add {selectedPapers.size > 0 ? `${selectedPapers.size} ` : ""}
              Papers
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite Member Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Member to Collection</DialogTitle>
            <DialogDescription>
              Send an invitation to collaborate on this collection. Choose the
              appropriate permission level.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email Address</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="Enter email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invite-permission">Permission Level</Label>
              <Select
                value={invitePermission}
                onValueChange={(value: "VIEW" | "EDIT") =>
                  setInvitePermission(value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VIEW">
                    <div className="flex flex-col">
                      <span>View Only</span>
                      <span className="text-sm text-muted-foreground">
                        Can view collection and papers but cannot edit
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="EDIT">
                    <div className="flex flex-col">
                      <span>Edit Access</span>
                      <span className="text-sm text-muted-foreground">
                        Can view, add, and remove papers from collection
                      </span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsInviteDialogOpen(false);
                setInviteEmail("");
                setInvitePermission("EDIT");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleInvite}
              disabled={isInviting || !inviteEmail.trim()}
            >
              {isInviting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="hidden">
            Delete Collection
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the collection "{collection?.name}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete Collection
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
