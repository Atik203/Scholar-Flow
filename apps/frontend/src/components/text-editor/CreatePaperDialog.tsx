"use client";

import {
  showErrorToast,
  showSuccessToast,
} from "@/components/providers/ToastProvider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { useCreateEditorPaperMutation } from "@/redux/api/paperApi";
import { useListWorkspacesQuery } from "@/redux/api/workspaceApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const createPaperSchema = z.object({
  title: z.string().min(1, "Title is required").max(300, "Title is too long"),
  abstract: z.string().max(5000, "Abstract is too long").optional(),
  workspaceId: z.string().uuid("Please select a valid workspace"),
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

  // Fetch user workspaces
  const { data: workspacesData, isLoading: isLoadingWorkspaces } =
    useListWorkspacesQuery({
      limit: 50,
    });

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

  // Set default author when session loads
  useEffect(() => {
    if (session?.user?.name) {
      setValue("author", session.user.name);
    }
  }, [session, setValue]);

  const watchedWorkspaceId = watch("workspaceId");
  const workspaces = workspacesData?.data || [];

  const onSubmit = async (data: CreatePaperFormData) => {
    try {
      const response = await createPaper({
        workspaceId: data.workspaceId,
        title: data.title,
        content:
          "<h1>" +
          data.title +
          "</h1>" +
          (data.abstract ? "<p>" + data.abstract + "</p>" : ""),
        isDraft: true,
      }).unwrap();

      showSuccessToast(
        "Paper created successfully!",
        "You can now start editing your paper."
      );

      // Reset form and close dialog
      reset();
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
      reset();
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
                  <SelectItem value="" disabled>
                    Loading workspaces...
                  </SelectItem>
                ) : workspaces.length === 0 ? (
                  <SelectItem value="" disabled>
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
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              placeholder="Enter author name..."
              disabled={isSubmitting}
              {...register("author")}
            />
            {errors.author && (
              <p className="text-sm text-red-600">{errors.author.message}</p>
            )}
          </div>

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
