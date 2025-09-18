"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useProtectedRoute } from "@/hooks/useAuthGuard";
import { useCreateCollectionMutation } from "@/redux/api/collectionApi";
import { ArrowLeft, BookOpen, Globe, Lock } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { v4 as uuidv4 } from "uuid";

export default function CreateCollectionPage() {
  const isProtected = useProtectedRoute();
  const router = useRouter();
  const { data: session } = useSession();
  const [createCollection, { isLoading: isSubmitting }] = useCreateCollectionMutation();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPublic: false,
    workspaceId: "",
  });

  // Get workspace ID from user session or create a default one
  useEffect(() => {
    if (session?.user?.id) {
      // Use a consistent workspace ID based on user ID
      // The backend will create the workspace if it doesn't exist
      const workspaceId = `workspace-${session.user.id}`;
      setFormData(prev => ({
        ...prev,
        workspaceId: workspaceId,
      }));
    }
  }, [session]);

  if (!isProtected) {
    return null; // Loading state handled by useProtectedRoute
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Collection name is required");
      return;
    }

    if (!formData.workspaceId) {
      toast.error("Workspace not found. Please try again.");
      return;
    }
    
    try {
      console.log("Creating collection with data:", formData);
      const result = await createCollection(formData).unwrap();
      console.log("Collection created successfully:", result);
      toast.success("Collection created successfully!");
      router.push(`/collections/${result.id}`);
    } catch (error: any) {
      console.error("Error creating collection:", error);
      console.error("Full error object:", JSON.stringify(error, null, 2));
      
      // Enhanced error logging for debugging
      if (error?.data) {
        console.error("Error data:", error.data);
      }
      if (error?.status) {
        console.error("Error status:", error.status);
      }
      if (error?.message) {
        console.error("Error message:", error.message);
      }
      
      let errorMessage = "Failed to create collection";
      
      // Handle different error types
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.status === 401) {
        errorMessage = "Authentication required. Please log in again.";
      } else if (error?.status === 403) {
        errorMessage = "Access denied. You don't have permission to create collections.";
      } else if (error?.status === 400) {
        errorMessage = "Invalid data. Please check your input.";
      } else if (error?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error?.status === 0) {
        errorMessage = "Network error. Please check your connection.";
      }
      
      toast.error(errorMessage);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button asChild variant="outline" size="sm">
            <Link href="/collections">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Collections
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Create New Collection
            </h1>
            <p className="text-muted-foreground">
              Organize your research papers into a themed collection
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Collection Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Collection Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Collection Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Machine Learning Research Papers"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Choose a descriptive name that clearly identifies your collection
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the purpose and scope of this collection..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  Optional: Provide context about what papers belong in this collection
                </p>
              </div>

              {/* Privacy Setting */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Privacy Settings</Label>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${formData.isPublic ? 'bg-green-100 dark:bg-green-900/20' : 'bg-gray-100 dark:bg-gray-800'}`}>
                      {formData.isPublic ? (
                        <Globe className="h-4 w-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <Lock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {formData.isPublic ? "Public Collection" : "Private Collection"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formData.isPublic 
                          ? "Anyone can discover and view this collection"
                          : "Only you and invited collaborators can access this collection"
                        }
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.isPublic}
                    onCheckedChange={(checked) => handleInputChange("isPublic", checked)}
                  />
                </div>
              </div>

              {/* Preview */}
              <div className="space-y-2">
                <Label className="text-base font-medium">Preview</Label>
                <Card className="border-dashed">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <BookOpen className="h-4 w-4 text-muted-foreground mt-1" />
                      <div className="flex-1">
                        <h3 className="font-medium">
                          {formData.name || "Collection Name"}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formData.description || "Collection description will appear here..."}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-muted-foreground">0 papers</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">
                            {formData.isPublic ? "Public" : "Private"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/collections">Cancel</Link>
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
