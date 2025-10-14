"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreateDiscussionDialog } from "@/components/discussions/CreateDiscussionDialog";
import { ArrowLeft, MessageSquare, Plus, FileText, BookOpen, Layers } from "lucide-react";
import Link from "next/link";

export default function CreateDiscussionPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Plus className="h-8 w-8" />
            Start New Discussion
          </h1>
          <p className="text-muted-foreground">
            Create a new discussion thread for your research team
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/research/discussions">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Discussions
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Discussion Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Discussion Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CreateDiscussionDialog
              onDiscussionCreated={() => {
                // Handle successful creation
                console.log("Discussion created successfully");
              }}
              trigger={
                <Button className="w-full" size="lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Discussion
                </Button>
              }
            />
          </CardContent>
        </Card>

        {/* Discussion Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle>Discussion Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Best Practices</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use clear, descriptive titles</li>
                <li>• Be specific about your question or topic</li>
                <li>• Tag discussions appropriately</li>
                <li>• Be respectful and constructive</li>
                <li>• Mark as resolved when answered</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Discussion Types</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span>Paper Reviews</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="h-4 w-4 text-green-600" />
                  <span>Collection Discussions</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Layers className="h-4 w-4 text-purple-600" />
                  <span>Workspace Topics</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MessageSquare className="h-4 w-4 text-orange-600" />
                  <span>General Research</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Start Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Start Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
              <h3 className="font-medium mb-2">Paper Review</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Start a discussion about a specific research paper
              </p>
              <Button size="sm" variant="outline" className="w-full">
                Use Template
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
              <h3 className="font-medium mb-2">Research Question</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Ask a question about your research methodology
              </p>
              <Button size="sm" variant="outline" className="w-full">
                Use Template
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
              <h3 className="font-medium mb-2">Collaboration</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Coordinate research activities with your team
              </p>
              <Button size="sm" variant="outline" className="w-full">
                Use Template
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Discussions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Discussions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4" />
            <p>No recent discussions to show</p>
            <p className="text-sm">Start a new discussion to see it here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
