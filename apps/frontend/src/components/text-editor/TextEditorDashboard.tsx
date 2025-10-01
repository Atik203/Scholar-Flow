"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useListEditorPapersQuery } from "@/redux/api/paperApi";
import { Download, FileText, Plus, Save } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { CreatePaperDialog } from "./CreatePaperDialog";
import { EditorSkeleton } from "./EditorSkeleton";
import { PapersList } from "./PapersList";

// Lazy load the heavy TipTap editor (reduces initial bundle by ~3.5MB)
const ScholarFlowEditor = dynamic(
  () =>
    import("./ScholarFlowEditor").then((mod) => ({
      default: mod.ScholarFlowEditor,
    })),
  {
    loading: () => <EditorSkeleton />,
    ssr: false,
  }
);

export function TextEditorDashboard() {
  const [activeTab, setActiveTab] = useState("papers");
  const [currentPaper, setCurrentPaper] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Fetch all papers to calculate stats
  const { data: allPapersResponse } = useListEditorPapersQuery({});
  const allPapers = allPapersResponse?.data || [];

  // Calculate stats
  const totalPapers = allPapers.length;
  const drafts = allPapers.filter((paper: any) => paper.isDraft).length;
  const published = allPapers.filter((paper: any) => !paper.isDraft).length;

  const handleCreateNew = () => {
    setIsCreateDialogOpen(true);
  };

  const handlePaperCreated = (paperId: string) => {
    setCurrentPaper(paperId);
    setActiveTab("editor");
    setIsCreateDialogOpen(false);
  };

  const handlePaperSelected = (paperId: string) => {
    setCurrentPaper(paperId);
    setActiveTab("editor");
  };

  if (activeTab === "editor" && currentPaper) {
    return (
      <div className="min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={() => setActiveTab("papers")}>
            ← Back to Papers
          </Button>
        </div>

        <ScholarFlowEditor
          paperId={currentPaper}
          onBack={() => setActiveTab("papers")}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Text Editor</h1>
          <p className="text-muted-foreground">
            Create, edit, and manage your research papers with our rich text
            editor.
          </p>
        </div>
        <Button onClick={handleCreateNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Paper
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Papers</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPapers}</div>
            <p className="text-xs text-muted-foreground">
              {totalPapers === 0 ? "No papers yet" : "All your papers"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <Save className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{drafts}</div>
            <p className="text-xs text-muted-foreground">
              {drafts === 0 ? "No drafts" : "Ready to publish"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{published}</div>
            <p className="text-xs text-muted-foreground">
              {published === 0 ? "None published" : "Available for sharing"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="papers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="papers">My Papers</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="papers" className="space-y-4">
          <PapersList onPaperSelect={handlePaperSelected} />
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paper Templates</CardTitle>
              <CardDescription>
                Choose from our collection of research paper templates.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Templates coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Editor Settings</CardTitle>
              <CardDescription>
                Customize your writing experience.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Settings coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Paper Dialog */}
      <CreatePaperDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onPaperCreated={handlePaperCreated}
      />
    </div>
  );
}
