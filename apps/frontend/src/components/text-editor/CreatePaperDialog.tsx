"use client";

import {
  showErrorToast,
  showSuccessToast,
} from "@/components/providers/ToastProvider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useAddPaperToCollectionMutation,
  useCreateCollectionMutation,
  useGetMyCollectionsQuery,
} from "@/redux/api/collectionApi";
import { useCreateEditorPaperMutation } from "@/redux/api/paperApi";
import { useListWorkspacesQuery } from "@/redux/api/workspaceApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen, Loader2, Plus, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const createPaperSchema = z.object({
  title: z.string().min(1, "Title is required").max(300, "Title is too long"),
  abstract: z.string().max(5000, "Abstract is too long").optional(),
  workspaceId: z
    .string()
    .uuid("Please select a valid workspace")
    .refine(
      (val) => val !== "loading" && val !== "no-workspaces",
      "Please select a valid workspace"
    ),
  authors: z
    .array(
      z
        .string()
        .min(1, "Author name is required")
        .max(120, "Author name is too long")
    )
    .min(1, "At least one author is required")
    .max(25, "Maximum 25 authors allowed"),
});

type CreatePaperFormData = z.infer<typeof createPaperSchema>;

interface CreatePaperDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onPaperCreated: (paperId: string) => void;
}

export function CreatePaperDialog({
  isOpen,
  onClose,
  onPaperCreated,
}: CreatePaperDialogProps) {
  const [createPaper] = useCreateEditorPaperMutation();
  const { data: session } = useSession();
  const [authors, setAuthors] = useState<string[]>([""]);

  // Collection selection state
  const [selectedCollectionIds, setSelectedCollectionIds] = useState<string[]>(
    []
  );
  const [showCreateCollection, setShowCreateCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [newCollectionDescription, setNewCollectionDescription] = useState("");

  // Fetch user workspaces
  const { data: workspacesData, isLoading: isLoadingWorkspaces } =
    useListWorkspacesQuery({
      limit: 50,
    });

  // Collection API hooks
  const [createCollection, { isLoading: creatingCollection }] =
    useCreateCollectionMutation();
  const [addPaperToCollection] = useAddPaperToCollectionMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreatePaperFormData>({
    resolver: zodResolver(createPaperSchema),
  });

  const watchedWorkspaceId = watch("workspaceId");
  const { data: collectionsData } = useGetMyCollectionsQuery(
    watchedWorkspaceId
      ? { workspaceId: watchedWorkspaceId, page: 1, limit: 50 }
      : { page: 1, limit: 50 },
    { skip: !watchedWorkspaceId }
  );

  // Set default author when session loads
  useEffect(() => {
    if (session?.user?.name && authors.length === 1 && !authors[0]) {
      const newAuthors = [session.user.name];
      setAuthors(newAuthors);
      setValue("authors", newAuthors);
    }
  }, [session, setValue, authors]);

  // Update form value when authors state changes
  useEffect(() => {
    setValue("authors", authors);
  }, [authors, setValue]);

  const workspaces = workspacesData?.data || [];

  // Collection helper functions
  const toggleCollectionSelection = (collectionId: string) => {
    setSelectedCollectionIds((prev) =>
      prev.includes(collectionId)
        ? prev.filter((id) => id !== collectionId)
        : [...prev, collectionId]
    );
  };

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim() || !watchedWorkspaceId) return;

    try {
      const result = await createCollection({
        name: newCollectionName,
        description: newCollectionDescription || undefined,
        workspaceId: watchedWorkspaceId,
      }).unwrap();

      setSelectedCollectionIds([...selectedCollectionIds, result.id]);
      setNewCollectionName("");
      setNewCollectionDescription("");
      setShowCreateCollection(false);
      showSuccessToast("Collection created successfully");
    } catch (error: any) {
      showErrorToast(error?.data?.message || "Failed to create collection");
    }
  };

  const onSubmit = async (data: CreatePaperFormData) => {
    try {
      // Validate that a real workspace is selected
      if (
        data.workspaceId === "loading" ||
        data.workspaceId === "no-workspaces"
      ) {
        showErrorToast("Please select a valid workspace");
        return;
      }

      const response = await createPaper({
        workspaceId: data.workspaceId,
        title: data.title,
        content:
          "<h1>" +
          data.title +
          "</h1>" +
          (data.abstract ? "<p>" + data.abstract + "</p>" : ""),
        isDraft: true,
        authors: authors.filter((author) => author.trim() !== ""),
      }).unwrap();

      showSuccessToast(
        "Paper created successfully!",
        "You can now start editing your paper."
      );

      // Add paper to selected collections
      if (selectedCollectionIds.length > 0) {
        try {
          await Promise.all(
            selectedCollectionIds.map((collectionId) =>
              addPaperToCollection({
                collectionId,
                data: { paperId: response.data.paper.id },
              }).unwrap()
            )
          );
          showSuccessToast(
            `Paper added to ${selectedCollectionIds.length} collection${selectedCollectionIds.length !== 1 ? "s" : ""}`
          );
        } catch (collectionError) {
          console.warn(
            "Failed to add paper to some collections:",
            collectionError
          );
          showErrorToast("Paper created but failed to add to some collections");
        }
      }

      // Reset form and close dialog
      reset({
        title: "",
        abstract: "",
        workspaceId: "",
        authors: [""], // Reset to single empty author field
      });
      setAuthors([""]);
      setSelectedCollectionIds([]);
      onClose();

      // Notify parent component
      onPaperCreated(response.data.paper.id);
    } catch (error: any) {
      console.error("Error creating paper:", error);
      showErrorToast(
        "Failed to create paper",
        error?.data?.message || "Please try again later."
      );
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset({
        title: "",
        abstract: "",
        workspaceId: "",
        authors: [""], // Reset to single empty author field
      });
      setAuthors([""]);
      setSelectedCollectionIds([]);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Paper</DialogTitle>
          <DialogDescription>
            Start writing your research paper with our rich text editor.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter paper title..."
              disabled={isSubmitting}
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="abstract">Abstract (Optional)</Label>
            <Textarea
              id="abstract"
              placeholder="Brief description of your paper..."
              rows={3}
              disabled={isSubmitting}
              {...register("abstract")}
            />
            {errors.abstract && (
              <p className="text-sm text-red-600">{errors.abstract.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="workspaceId">Workspace</Label>
            <Select
              onValueChange={(value) => setValue("workspaceId", value)}
              disabled={isSubmitting || isLoadingWorkspaces}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a workspace..." />
              </SelectTrigger>
              <SelectContent>
                {isLoadingWorkspaces ? (
                  <SelectItem value="loading" disabled>
                    Loading workspaces...
                  </SelectItem>
                ) : workspaces.length === 0 ? (
                  <SelectItem value="no-workspaces" disabled>
                    No workspaces available
                  </SelectItem>
                ) : (
                  workspaces.map((workspace) => (
                    <SelectItem key={workspace.id} value={workspace.id}>
                      {workspace.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errors.workspaceId && (
              <p className="text-sm text-red-600">
                {errors.workspaceId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Authors</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const newAuthors = [...authors, ""];
                  setAuthors(newAuthors);
                }}
                disabled={isSubmitting || authors.length >= 25}
                className="text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Author
              </Button>
            </div>

            <div className="space-y-2">
              {authors.map((author, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    placeholder={`Author ${index + 1} name...`}
                    disabled={isSubmitting}
                    value={author}
                    onChange={(e) => {
                      const newAuthors = [...authors];
                      newAuthors[index] = e.target.value;
                      setAuthors(newAuthors);
                    }}
                  />
                  {authors.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newAuthors = authors.filter(
                          (_, i) => i !== index
                        );
                        setAuthors(newAuthors);
                      }}
                      disabled={isSubmitting}
                      className="flex-shrink-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {errors.authors && (
              <p className="text-sm text-red-600">{errors.authors.message}</p>
            )}
            {errors.authors?.root && (
              <p className="text-sm text-red-600">
                {errors.authors.root.message}
              </p>
            )}
            {errors.authors && Array.isArray(errors.authors) && (
              <div className="space-y-1">
                {errors.authors.map(
                  (error, index) =>
                    error && (
                      <p key={index} className="text-sm text-red-600">
                        Author {index + 1}: {error.message}
                      </p>
                    )
                )}
              </div>
            )}
          </div>

          {/* Collection Selection */}
          {watchedWorkspaceId && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Collections (Optional)
                </Label>
                <Dialog
                  open={showCreateCollection}
                  onOpenChange={setShowCreateCollection}
                >
                  <DialogTrigger asChild>
                    <Button type="button" variant="outline" size="sm">
                      <Plus className="h-3 w-3 mr-1" />
                      New Collection
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Collection</DialogTitle>
                    </DialogHeader>
                    <form
                      onSubmit={handleCreateCollection}
                      className="space-y-4"
                    >
                      <div>
                        <Label htmlFor="collectionName">Collection Name</Label>
                        <Input
                          id="collectionName"
                          value={newCollectionName}
                          onChange={(e) => setNewCollectionName(e.target.value)}
                          placeholder="Enter collection name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="collectionDescription">
                          Description (Optional)
                        </Label>
                        <Input
                          id="collectionDescription"
                          value={newCollectionDescription}
                          onChange={(e) =>
                            setNewCollectionDescription(e.target.value)
                          }
                          placeholder="Enter collection description"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowCreateCollection(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={
                            creatingCollection || !newCollectionName.trim()
                          }
                        >
                          {creatingCollection ? "Creating..." : "Create"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="border rounded-lg p-3 max-h-32 overflow-y-auto">
                {collectionsData?.result?.length ? (
                  <div className="space-y-2">
                    {collectionsData.result.map((collection) => (
                      <div
                        key={collection.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={collection.id}
                          checked={selectedCollectionIds.includes(
                            collection.id
                          )}
                          onCheckedChange={() =>
                            toggleCollectionSelection(collection.id)
                          }
                        />
                        <Label
                          htmlFor={collection.id}
                          className="flex-1 text-sm cursor-pointer"
                        >
                          {collection.name}
                          {collection.description && (
                            <span className="text-muted-foreground ml-1">
                              - {collection.description}
                            </span>
                          )}
                        </Label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    No collections available. Create one to organize your
                    papers.
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting ? "Creating..." : "Create Paper"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
