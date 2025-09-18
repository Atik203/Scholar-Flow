"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/providers/ToastProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useProtectedRoute } from "@/hooks/useAuthGuard";
import {
  useAddPaperToCollectionMutation,
  useCreateCollectionMutation,
} from "@/redux/api/collectionApi";
import { useListPapersQuery } from "@/redux/api/paperApi";
import { ArrowLeft, BookOpen, Globe, Lock } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CreateCollectionPage() {
  const isProtected = useProtectedRoute();
  const router = useRouter();
  const { data: session } = useSession();

  const [createCollection, { isLoading: isSubmitting }] =
    useCreateCollectionMutation();
  const [addPaperToCollection] = useAddPaperToCollectionMutation();
  const [selectedPaperIds, setSelectedPaperIds] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPublic: false,
    workspaceId: "",
  });

  // Papers list for selection
  const { data: papersList } = useListPapersQuery({ page: 1, limit: 100 });
  const papers = papersList?.items || [];

  useEffect(() => {
    if (session?.user?.id) {
      const workspaceId = `workspace-${session.user.id}`;
      setFormData((prev) => ({ ...prev, workspaceId }));
    }
  }, [session]);

  if (!isProtected) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showErrorToast("Collection name is required");
      return;
    }
    if (!formData.workspaceId) {
      showErrorToast("Workspace not found. Please try again.");
      return;
    }

    try {
      const created = await createCollection(formData).unwrap();
      showSuccessToast("Collection created successfully");

      // Attach selected papers sequentially (simple approach)
      if (selectedPaperIds.length > 0) {
        await Promise.all(
          selectedPaperIds.map((paperId) =>
            addPaperToCollection({
              collectionId: created.id,
              data: { paperId },
            }).unwrap()
          )
        );
        showSuccessToast(`${selectedPaperIds.length} papers added`);
      }

      router.push(`/dashboard/collections/${created.id}`);
    } catch (error: any) {
      const message =
        error?.data?.message || error?.message || "Failed to create collection";
      showErrorToast(message);
    }
  };

  const togglePaper = (paperId: string, checked: boolean) => {
    setSelectedPaperIds((prev) =>
      checked ? [...prev, paperId] : prev.filter((id) => id !== paperId)
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/collections">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Collections
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Create New Collection
            </h1>
            <p className="text-muted-foreground">
              Organize your research papers
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" /> Collection Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Collection Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Machine Learning Papers"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe this collection..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                />
              </div>
              <div className="space-y-4">
                <Label className="text-base font-medium">
                  Privacy Settings
                </Label>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${formData.isPublic ? "bg-green-100 dark:bg-green-900/20" : "bg-gray-100 dark:bg-gray-800"}`}
                    >
                      {formData.isPublic ? (
                        <Globe className="h-4 w-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <Lock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {formData.isPublic
                          ? "Public Collection"
                          : "Private Collection"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formData.isPublic
                          ? "Anyone can view"
                          : "Only invited collaborators can view"}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.isPublic}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isPublic: checked })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-base font-medium">
                  Select Papers (optional)
                </Label>
                <div className="max-h-64 overflow-auto border rounded-md p-2 space-y-2">
                  {papers.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No papers found. Upload papers first.
                    </p>
                  ) : (
                    papers.map((p) => (
                      <label
                        key={p.id}
                        className="flex items-center gap-3 text-sm"
                      >
                        <Checkbox
                          checked={selectedPaperIds.includes(p.id)}
                          onCheckedChange={(checked) =>
                            togglePaper(p.id, Boolean(checked))
                          }
                        />
                        <span className="font-medium line-clamp-1">
                          {p.title}
                        </span>
                        <span className="text-muted-foreground ml-auto">
                          {p.metadata?.year || ""}
                        </span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/dashboard/collections">Cancel</Link>
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={!formData.name.trim() || isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Collection"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
}
