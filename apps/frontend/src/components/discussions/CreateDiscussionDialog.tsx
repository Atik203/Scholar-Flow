"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { showErrorToast, showSuccessToast } from "@/components/providers/ToastProvider";
import { MessageSquare, Plus, Pin, CheckCircle, XCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const discussionFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  content: z.string().min(1, "Content is required").max(5000, "Content too long"),
  tags: z.string().optional(),
});

type DiscussionFormData = z.infer<typeof discussionFormSchema>;

interface CreateDiscussionDialogProps {
  paperId?: string;
  collectionId?: string;
  workspaceId?: string;
  paperTitle?: string;
  collectionName?: string;
  workspaceName?: string;
  trigger?: React.ReactNode;
  onDiscussionCreated?: () => void;
}

export function CreateDiscussionDialog({
  paperId,
  collectionId,
  workspaceId,
  paperTitle,
  collectionName,
  workspaceName,
  trigger,
  onDiscussionCreated
}: CreateDiscussionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const form = useForm<DiscussionFormData>({
    resolver: zodResolver(discussionFormSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: "",
    },
  });

  const getContextInfo = () => {
    if (paperId) return { type: "Paper", name: paperTitle || "Unknown Paper" };
    if (collectionId) return { type: "Collection", name: collectionName || "Unknown Collection" };
    if (workspaceId) return { type: "Workspace", name: workspaceName || "Unknown Workspace" };
    return { type: "General", name: "Discussion" };
  };

  const handleCreateDiscussion = async (data: DiscussionFormData) => {
    setIsCreating(true);
    try {
      const tags = data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

      const response = await fetch('/api/discussions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          tags,
          ...(paperId && { paperId }),
          ...(collectionId && { collectionId }),
          ...(workspaceId && { workspaceId }),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create discussion');
      }

      const result = await response.json();
      showSuccessToast('Discussion created successfully');
      setIsOpen(false);
      form.reset();
      onDiscussionCreated?.();
    } catch (error) {
      console.error('Create discussion error:', error);
      showErrorToast('Failed to create discussion. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const contextInfo = getContextInfo();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Start Discussion
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Create Discussion
          </DialogTitle>
          <DialogDescription>
            Start a new discussion for {contextInfo.type}: {contextInfo.name}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCreateDiscussion)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Discussion Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a descriptive title for your discussion"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Discussion Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your thoughts, questions, or insights..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Tags (optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter tags separated by commas (e.g., methodology, results, question)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Discussion
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
