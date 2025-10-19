"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateDiscussionDialog } from "@/components/discussions/CreateDiscussionDialog";
import { ArrowLeft, MessageSquare, Plus, FileText, BookOpen, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreateDiscussionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    entityType: "",
    entityId: "",
    tags: "",
    isPinned: false,
    discussionType: "question"
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Creating discussion:", formData);
    // Redirect to discussions list
    router.push("/research/discussions");
  };

  const mockPapers = [
    { id: "1", title: "Machine Learning in Healthcare: A Comprehensive Review" },
    { id: "2", title: "Deep Learning Approaches for Natural Language Processing" },
    { id: "3", title: "Blockchain Technology in Supply Chain Management" },
  ];

  const mockCollections = [
    { id: "1", name: "AI Research Papers" },
    { id: "2", name: "Healthcare Technology" },
    { id: "3", name: "Blockchain Studies" },
  ];

  const discussionTypes = [
    { value: "question", label: "Question", description: "Ask for clarification or help" },
    { value: "idea", label: "Idea", description: "Share research ideas and insights" },
    { value: "review", label: "Review", description: "Discuss paper findings and methodology" },
    { value: "collaboration", label: "Collaboration", description: "Coordinate research activities" },
    { value: "feedback", label: "Feedback", description: "Provide constructive feedback" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-background to-muted/30 p-6 rounded-lg border">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild className="hover:bg-white/80">
            <Link href="/research/discussions">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Discussions
            </Link>
          </Button>
          <div className="h-6 border-l border-border" />
          <div>
            <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Plus className="h-6 w-6" />
              Create Discussion
            </h1>
            <p className="text-sm text-muted-foreground">
              Start a new research discussion with your team
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Discussion Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Discussion Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter a clear, descriptive title..."
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="content">Discussion Content *</Label>
                  <Textarea
                    id="content"
                    placeholder="Describe your discussion topic, questions, or ideas..."
                    value={formData.content}
                    onChange={(e) => handleInputChange("content", e.target.value)}
                    rows={6}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="discussionType">Discussion Type</Label>
                    <Select
                      value={formData.discussionType}
                      onValueChange={(value) => handleInputChange("discussionType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {discussionTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div>
                              <div className="font-medium">{type.label}</div>
                              <div className="text-xs text-muted-foreground">{type.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      placeholder="research, ai, methodology (comma-separated)"
                      value={formData.tags}
                      onChange={(e) => handleInputChange("tags", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Entity Association */}
            <Card>
              <CardHeader>
                <CardTitle>Associate with Research</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="entityType">Associate with</Label>
                  <Select
                    value={formData.entityType}
                    onValueChange={(value) => handleInputChange("entityType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select entity type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paper">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Research Paper
                        </div>
                      </SelectItem>
                      <SelectItem value="collection">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          Collection
                        </div>
                      </SelectItem>
                      <SelectItem value="workspace">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Workspace
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.entityType === "paper" && (
                  <div>
                    <Label htmlFor="paperSelect">Select Paper</Label>
                    <Select
                      value={formData.entityId}
                      onValueChange={(value) => handleInputChange("entityId", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a paper" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockPapers.map((paper) => (
                          <SelectItem key={paper.id} value={paper.id}>
                            {paper.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {formData.entityType === "collection" && (
                  <div>
                    <Label htmlFor="collectionSelect">Select Collection</Label>
                    <Select
                      value={formData.entityId}
                      onValueChange={(value) => handleInputChange("entityId", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a collection" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockCollections.map((collection) => (
                          <SelectItem key={collection.id} value={collection.id}>
                            {collection.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Discussion Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPinned"
                    checked={formData.isPinned}
                    onChange={(e) => handleInputChange("isPinned", e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="isPinned" className="text-sm">
                    Pin this discussion
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Pinned discussions appear at the top of the list
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tips for Good Discussions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Use clear, descriptive titles</p>
                <p>• Provide context and background</p>
                <p>• Ask specific questions</p>
                <p>• Tag with relevant keywords</p>
                <p>• Be respectful and constructive</p>
                <p>• Mark as resolved when done</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" asChild>
            <Link href="/research/discussions">
              Cancel
            </Link>
          </Button>
          <Button type="submit">
            <Plus className="h-4 w-4 mr-2" />
            Create Discussion
          </Button>
        </div>
      </form>
    </div>
  );
}
