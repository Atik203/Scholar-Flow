"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/providers/ToastProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useProtectedRoute } from "@/hooks/useAuthGuard";
import {
  useGetCollectionQuery,
  useUpdateCollectionMutation,
} from "@/redux/api/collectionApi";
import { ArrowLeft, BookOpen, Globe, Loader2, Lock } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditCollectionPage() {
  const isProtected = useProtectedRoute();
  const router = useRouter();
  const params = useParams();
  const collectionId = params.id as string;

  const {
    data: collection,
    isLoading: isLoadingCollection,
    error: collectionError,
  } = useGetCollectionQuery(collectionId);

  const [updateCollection, { isLoading: isUpdating }] =
    useUpdateCollectionMutation();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPublic: false,
  });

  // Update form when collection loads
  useEffect(() => {
    if (collection) {
      setFormData({
        name: collection.name,
        description: collection.description || "",
        isPublic: collection.isPublic,
      });
    }
  }, [collection]);

  if (!isProtected) return null;

  if (isLoadingCollection) {
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
            The collection you're trying to edit doesn't exist or you don't have
            permission.
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showErrorToast("Collection name is required");
      return;
    }

    try {
      await updateCollection({
        id: collectionId,
        data: formData,
      }).unwrap();

      showSuccessToast("Collection updated successfully");
      router.push(`/dashboard/collections/${collectionId}`);
    } catch (error: any) {
      const message =
        error?.data?.message || error?.message || "Failed to update collection";
      showErrorToast(message);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button asChild variant="outline" size="sm">
            <Link href={`/dashboard/collections/${collectionId}`}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Collection
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Edit Collection
            </h1>
            <p className="text-muted-foreground">
              Update "{collection.name}" details
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
                      className={`p-2 rounded-lg ${
                        formData.isPublic
                          ? "bg-green-100 dark:bg-green-900/20"
                          : "bg-gray-100 dark:bg-gray-800"
                      }`}
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
                          ? "Anyone can view this collection"
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

              <div className="flex gap-3 pt-4">
                <Button asChild variant="outline" className="flex-1">
                  <Link href={`/dashboard/collections/${collectionId}`}>
                    Cancel
                  </Link>
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={!formData.name.trim() || isUpdating}
                >
                  {isUpdating ? "Updating..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
}
