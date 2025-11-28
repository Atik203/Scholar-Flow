"use client";

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  Code,
  FileText,
  Heading1,
  Heading2,
  Heading3,
  Image,
  Italic,
  Link,
  List,
  ListOrdered,
  Quote,
  Redo,
  Save,
  Strikethrough,
  Table,
  Underline,
  Undo,
} from "lucide-react";
import { motion } from "motion/react";
import React, { useState } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";

// ============================================================================
// Default User for Demo
// ============================================================================
const defaultUser = {
  name: "Demo Researcher",
  email: "demo@scholarflow.com",
  image: undefined,
  role: "researcher" as const,
};

interface TextEditorPageProps {
  onNavigate?: (path: string) => void;
}

// ============================================================================
// Utility Functions
// ============================================================================
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// ============================================================================
// Dummy Data
// ============================================================================
const dummyDocuments = [
  {
    id: "doc-1",
    title: "Research Paper Draft",
    lastModified: "2024-03-18 14:30",
    wordCount: 2450,
  },
  {
    id: "doc-2",
    title: "Literature Review",
    lastModified: "2024-03-17 10:15",
    wordCount: 1820,
  },
  {
    id: "doc-3",
    title: "Methodology Notes",
    lastModified: "2024-03-15 16:45",
    wordCount: 890,
  },
];

// ============================================================================
// Toolbar Button Component
// ============================================================================
interface ToolbarButtonProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  icon: Icon,
  label,
  active,
  onClick,
}) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    title={label}
    className={cn(
      "p-2 rounded hover:bg-muted transition-colors",
      active && "bg-primary/10 text-primary"
    )}
  >
    <Icon className="h-4 w-4" />
  </motion.button>
);

// ============================================================================
// Text Editor Page Component
// ============================================================================
export function TextEditorPage({ onNavigate }: TextEditorPageProps) {
  const [selectedDocId, setSelectedDocId] = useState<string | null>("doc-1");
  const [content, setContent] = useState(
    `# Research Paper Draft

## Abstract

This paper presents a comprehensive analysis of machine learning techniques applied to natural language processing tasks. We explore various transformer-based architectures and their effectiveness in handling complex linguistic patterns.

## Introduction

Natural language processing (NLP) has witnessed remarkable advancements in recent years, largely driven by the development of deep learning models. The introduction of the Transformer architecture by Vaswani et al. (2017) marked a significant milestone in the field.

### Background

The evolution of NLP can be traced through several key developments:

1. **Statistical Methods**: Early approaches relied heavily on statistical models
2. **Neural Networks**: The introduction of recurrent neural networks
3. **Attention Mechanisms**: The breakthrough of attention-based models
4. **Pre-trained Models**: Modern approaches using large-scale pre-training

## Methodology

Our research methodology involves the following steps:

- Data collection from multiple sources
- Preprocessing and tokenization
- Model training with various configurations
- Evaluation using standard metrics

> "The key to successful NLP applications lies in understanding the nuances of human language." - Research Team

## Results

| Model | Accuracy | F1 Score | Training Time |
|-------|----------|----------|---------------|
| BERT  | 94.2%    | 0.93     | 4 hours       |
| GPT-2 | 92.8%    | 0.91     | 6 hours       |
| T5    | 95.1%    | 0.94     | 8 hours       |

## Conclusion

Our findings demonstrate the effectiveness of modern transformer-based models in NLP tasks...`
  );
  const [isSaving, setIsSaving] = useState(false);
  const [showDocList, setShowDocList] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSaving(false);
  };

  const selectedDoc = dummyDocuments.find((d) => d.id === selectedDocId);
  const wordCount = content.split(/\s+/).filter(Boolean).length;

  return (
    <DashboardLayout
      user={defaultUser}
      onNavigate={onNavigate}
      currentPath="/research/editor"
    >
      <div className="flex flex-col h-[calc(100vh-120px)]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-card">
          <div className="flex items-center gap-4">
            <FileText className="h-6 w-6 text-primary" />
            <div className="relative">
              <button
                onClick={() => setShowDocList(!showDocList)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-muted rounded-lg transition-colors"
              >
                <span className="font-semibold">
                  {selectedDoc?.title || "Untitled Document"}
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
              {showDocList && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-card border rounded-lg shadow-lg z-50">
                  <div className="p-2">
                    {dummyDocuments.map((doc) => (
                      <button
                        key={doc.id}
                        onClick={() => {
                          setSelectedDocId(doc.id);
                          setShowDocList(false);
                        }}
                        className={cn(
                          "w-full px-3 py-2 text-left rounded hover:bg-muted transition-colors",
                          selectedDocId === doc.id && "bg-muted"
                        )}
                      >
                        <p className="font-medium text-sm">{doc.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {doc.wordCount} words • {doc.lastModified}
                        </p>
                      </button>
                    ))}
                    <div className="border-t my-2" />
                    <button className="w-full px-3 py-2 text-left rounded hover:bg-muted transition-colors text-primary text-sm">
                      + New Document
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {wordCount} words
            </span>
            <span className="text-sm text-muted-foreground">Auto-saved</span>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save"}
            </motion.button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1 p-2 border-b bg-card flex-wrap">
          {/* Undo/Redo */}
          <div className="flex items-center gap-1 pr-2 border-r">
            <ToolbarButton icon={Undo} label="Undo" />
            <ToolbarButton icon={Redo} label="Redo" />
          </div>

          {/* Headings */}
          <div className="flex items-center gap-1 px-2 border-r">
            <ToolbarButton icon={Heading1} label="Heading 1" />
            <ToolbarButton icon={Heading2} label="Heading 2" />
            <ToolbarButton icon={Heading3} label="Heading 3" />
          </div>

          {/* Text Formatting */}
          <div className="flex items-center gap-1 px-2 border-r">
            <ToolbarButton icon={Bold} label="Bold" />
            <ToolbarButton icon={Italic} label="Italic" />
            <ToolbarButton icon={Underline} label="Underline" />
            <ToolbarButton icon={Strikethrough} label="Strikethrough" />
          </div>

          {/* Lists */}
          <div className="flex items-center gap-1 px-2 border-r">
            <ToolbarButton icon={List} label="Bullet List" />
            <ToolbarButton icon={ListOrdered} label="Numbered List" />
          </div>

          {/* Alignment */}
          <div className="flex items-center gap-1 px-2 border-r">
            <ToolbarButton icon={AlignLeft} label="Align Left" />
            <ToolbarButton icon={AlignCenter} label="Align Center" />
            <ToolbarButton icon={AlignRight} label="Align Right" />
          </div>

          {/* Insert */}
          <div className="flex items-center gap-1 px-2">
            <ToolbarButton icon={Link} label="Insert Link" />
            <ToolbarButton icon={Image} label="Insert Image" />
            <ToolbarButton icon={Table} label="Insert Table" />
            <ToolbarButton icon={Code} label="Code Block" />
            <ToolbarButton icon={Quote} label="Block Quote" />
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 overflow-hidden bg-background">
          <div className="h-full max-w-4xl mx-auto p-8">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-full resize-none bg-transparent border-0 focus:outline-none focus:ring-0 font-mono text-sm leading-relaxed"
              placeholder="Start writing..."
            />
          </div>
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between px-4 py-2 border-t bg-card text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Markdown</span>
            <span>UTF-8</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Line 1, Column 1</span>
            <span>{content.length} characters</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default TextEditorPage;
