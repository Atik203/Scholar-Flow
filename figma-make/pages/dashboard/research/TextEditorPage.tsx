"use client";

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowUp,
  Bold,
  BookOpen,
  Bot,
  ChevronDown,
  Code,
  Download,
  FileDown,
  FileText,
  Heading1,
  Heading2,
  Heading3,
  Image,
  Italic,
  Languages,
  Lightbulb,
  Link,
  List,
  ListOrdered,
  Loader2,
  PenTool,
  Quote,
  Redo,
  Save,
  Sparkles,
  Strikethrough,
  Subscript,
  Superscript,
  Table,
  Type,
  Underline,
  Undo,
  Wand2,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";
import { useRole, type UserRole } from "../../../components/context";
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
  role?: UserRole;
}

// ============================================================================
// Utility Functions
// ============================================================================
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// ============================================================================
// AI Writing Models
// ============================================================================
const AI_WRITING_MODELS = [
  { value: "gpt-5.1", label: "GPT 5.1", tier: "premium", icon: "🚀" },
  { value: "opus-4.5", label: "Opus 4.5", tier: "premium", icon: "🧠" },
  {
    value: "gemini-3-flash",
    label: "Gemini 3 Flash",
    tier: "free",
    icon: "⚡",
  },
];

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

const aiSuggestions = [
  { type: "improve", label: "Improve writing", icon: Wand2 },
  { type: "simplify", label: "Simplify", icon: Type },
  { type: "expand", label: "Expand", icon: PenTool },
  { type: "summarize", label: "Summarize", icon: FileText },
  { type: "academic", label: "Make academic", icon: BookOpen },
  { type: "translate", label: "Translate", icon: Languages },
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
export function TextEditorPage({
  onNavigate,
  role: propRole,
}: TextEditorPageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const user = { ...defaultUser, role: effectiveRole };
  const isPremiumUser =
    effectiveRole === "pro_researcher" || effectiveRole === "admin";

  const [selectedDocId, setSelectedDocId] = useState<string | null>("doc-1");
  const [content, setContent] = useState(
    `# Research Paper Draft

## Abstract

This paper presents a comprehensive analysis of machine learning techniques applied to natural language processing tasks. We explore various transformer-based architectures and their effectiveness in handling complex linguistic patterns.

## Introduction

Natural language processing (NLP) has witnessed remarkable advancements in recent years, largely driven by the development of deep learning models. The introduction of the Transformer architecture by Vaswani et al. (2017) marked a significant milestone in the field.

### Mathematical Foundation

The self-attention mechanism can be expressed as:

$$
\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V
$$

Where $Q$, $K$, and $V$ represent the query, key, and value matrices respectively, and $d_k$ is the dimension of the key vectors.

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

The loss function used is defined as:

$$
L = -\\sum_{i=1}^{N} y_i \\log(\\hat{y}_i)
$$

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
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showLatexPreview, setShowLatexPreview] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [selectedAiModel, setSelectedAiModel] = useState("gemini-3-flash");
  const [showCitationPanel, setShowCitationPanel] = useState(false);
  const [editorMode, setEditorMode] = useState<"markdown" | "latex">(
    "markdown"
  );

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSaving(false);
  };

  const handleAISuggestion = (type: string) => {
    setIsAiLoading(true);
    setTimeout(() => {
      setIsAiLoading(false);
      // Simulate AI response
    }, 1500);
  };

  const selectedDoc = dummyDocuments.find((d) => d.id === selectedDocId);
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const currentModel = AI_WRITING_MODELS.find(
    (m) => m.value === selectedAiModel
  );

  return (
    <DashboardLayout
      user={user}
      onNavigate={onNavigate}
      currentPath="/research/editor"
    >
      <div className="flex h-[calc(100vh-80px)] overflow-hidden">
        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b bg-card">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
              </div>
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
                <AnimatePresence>
                  {showDocList && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 mt-1 w-72 bg-card border rounded-xl shadow-xl z-50"
                    >
                      <div className="p-2">
                        {dummyDocuments.map((doc) => (
                          <button
                            key={doc.id}
                            onClick={() => {
                              setSelectedDocId(doc.id);
                              setShowDocList(false);
                            }}
                            className={cn(
                              "w-full px-3 py-2 text-left rounded-lg hover:bg-muted transition-colors",
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
                        <button className="w-full px-3 py-2 text-left rounded-lg hover:bg-muted transition-colors text-primary text-sm font-medium">
                          + New Document
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Mode Toggle */}
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button
                  onClick={() => setEditorMode("markdown")}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium transition-colors",
                    editorMode === "markdown"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  Markdown
                </button>
                <button
                  onClick={() => setEditorMode("latex")}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium transition-colors",
                    editorMode === "latex"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  LaTeX
                </button>
              </div>

              <span className="text-sm text-muted-foreground">
                {wordCount} words
              </span>

              {/* Export Menu */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-muted"
                >
                  <Download className="h-4 w-4" />
                  Export
                  <ChevronDown className="h-3 w-3" />
                </motion.button>
                <AnimatePresence>
                  {showExportMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-card border rounded-xl shadow-xl z-50"
                    >
                      <div className="p-2">
                        <button className="w-full px-3 py-2 text-left rounded-lg hover:bg-muted transition-colors text-sm flex items-center gap-2">
                          <FileDown className="h-4 w-4 text-red-500" />
                          Export as PDF
                        </button>
                        <button className="w-full px-3 py-2 text-left rounded-lg hover:bg-muted transition-colors text-sm flex items-center gap-2">
                          <FileDown className="h-4 w-4 text-blue-500" />
                          Export as DOCX
                        </button>
                        <button className="w-full px-3 py-2 text-left rounded-lg hover:bg-muted transition-colors text-sm flex items-center gap-2">
                          <FileDown className="h-4 w-4 text-green-500" />
                          Export as LaTeX
                        </button>
                        <button className="w-full px-3 py-2 text-left rounded-lg hover:bg-muted transition-colors text-sm flex items-center gap-2">
                          <FileDown className="h-4 w-4 text-gray-500" />
                          Export as Markdown
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
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

            {/* Math/LaTeX */}
            <div className="flex items-center gap-1 px-2 border-r">
              <ToolbarButton icon={Superscript} label="Superscript" />
              <ToolbarButton icon={Subscript} label="Subscript" />
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowLatexPreview(!showLatexPreview)}
                className={cn(
                  "px-2 py-1.5 rounded text-xs font-medium transition-colors",
                  showLatexPreview
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                    : "hover:bg-muted"
                )}
              >
                LaTeX
              </motion.button>
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
            <div className="flex items-center gap-1 px-2 border-r">
              <ToolbarButton icon={Link} label="Insert Link" />
              <ToolbarButton icon={Image} label="Insert Image" />
              <ToolbarButton icon={Table} label="Insert Table" />
              <ToolbarButton icon={Code} label="Code Block" />
              <ToolbarButton icon={Quote} label="Block Quote" />
            </div>

            {/* Citations */}
            <div className="flex items-center gap-1 px-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => setShowCitationPanel(!showCitationPanel)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors",
                  showCitationPanel
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    : "hover:bg-muted"
                )}
              >
                <BookOpen className="h-3.5 w-3.5" />
                Citations
              </motion.button>
            </div>

            {/* AI Button */}
            <div className="flex-1" />
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => setShowAIPanel(!showAIPanel)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-sm font-medium inline-flex items-center gap-2 transition-colors",
                showAIPanel
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  : "bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-600 dark:text-purple-400 hover:from-purple-500/20 hover:to-pink-500/20"
              )}
            >
              <Sparkles className="h-4 w-4" />
              AI Assistant
            </motion.button>
          </div>

          {/* Editor Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Main Editor */}
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

            {/* LaTeX Preview Panel */}
            <AnimatePresence>
              {showLatexPreview && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 400, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="border-l bg-card overflow-hidden"
                >
                  <div className="p-4 border-b flex items-center justify-between">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      <Code className="h-4 w-4 text-purple-500" />
                      LaTeX Preview
                    </h3>
                    <button
                      onClick={() => setShowLatexPreview(false)}
                      className="p-1 hover:bg-muted rounded"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="p-6 overflow-auto h-[calc(100%-60px)]">
                    <div className="prose prose-sm dark:prose-invert">
                      <h1>Research Paper Draft</h1>
                      <h2>Mathematical Foundation</h2>
                      <p>The self-attention mechanism:</p>
                      <div className="bg-muted/50 p-4 rounded-lg my-4 font-mono text-sm overflow-x-auto">
                        Attention(Q, K, V) = softmax(QK<sup>T</sup> / √d
                        <sub>k</sub>)V
                      </div>
                      <p>Cross-entropy loss function:</p>
                      <div className="bg-muted/50 p-4 rounded-lg my-4 font-mono text-sm">
                        L = -Σ y<sub>i</sub> log(ŷ<sub>i</sub>)
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Citation Panel */}
            <AnimatePresence>
              {showCitationPanel && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 350, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="border-l bg-card overflow-hidden"
                >
                  <div className="p-4 border-b flex items-center justify-between">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-blue-500" />
                      Citations
                    </h3>
                    <button
                      onClick={() => setShowCitationPanel(false)}
                      className="p-1 hover:bg-muted rounded"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="p-4">
                    <input
                      type="text"
                      placeholder="Search papers to cite..."
                      className="w-full px-3 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <div className="mt-4 space-y-3">
                      {[
                        {
                          title: "Attention Is All You Need",
                          authors: "Vaswani et al.",
                          year: 2017,
                        },
                        {
                          title: "BERT: Pre-training",
                          authors: "Devlin et al.",
                          year: 2019,
                        },
                        {
                          title: "Language Models are Few-Shot Learners",
                          authors: "Brown et al.",
                          year: 2020,
                        },
                      ].map((paper, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.01 }}
                          className="p-3 border rounded-lg hover:border-primary cursor-pointer transition-colors"
                        >
                          <p className="font-medium text-sm line-clamp-2">
                            {paper.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {paper.authors} ({paper.year})
                          </p>
                          <button className="mt-2 text-xs text-primary font-medium">
                            + Insert citation
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Status Bar */}
          <div className="flex items-center justify-between px-4 py-2 border-t bg-card text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="capitalize">{editorMode}</span>
              <span>UTF-8</span>
              {showLatexPreview && (
                <span className="text-purple-500">LaTeX Preview Active</span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span>Line 1, Column 1</span>
              <span>{content.length} characters</span>
            </div>
          </div>
        </div>

        {/* AI Assistant Panel */}
        <AnimatePresence>
          {showAIPanel && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 380, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-l bg-card flex flex-col overflow-hidden"
            >
              {/* AI Panel Header */}
              <div className="p-4 border-b bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2">
                    <div className="p-1.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    AI Writing Assistant
                  </h3>
                  <button
                    onClick={() => setShowAIPanel(false)}
                    className="p-1 hover:bg-muted rounded"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                {/* Model Selector */}
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Model:</span>
                  <select
                    value={selectedAiModel}
                    onChange={(e) => setSelectedAiModel(e.target.value)}
                    className="text-xs bg-background border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {AI_WRITING_MODELS.map((model) => (
                      <option
                        key={model.value}
                        value={model.value}
                        disabled={model.tier === "premium" && !isPremiumUser}
                      >
                        {model.icon} {model.label}{" "}
                        {model.tier === "premium" ? "(Pro)" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-4 border-b">
                <p className="text-xs font-medium text-muted-foreground mb-3">
                  Quick Actions
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {aiSuggestions.map((suggestion) => (
                    <motion.button
                      key={suggestion.type}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAISuggestion(suggestion.type)}
                      className="p-3 border rounded-lg text-left hover:border-primary hover:bg-primary/5 transition-colors"
                    >
                      <suggestion.icon className="h-4 w-4 text-primary mb-1.5" />
                      <span className="text-xs font-medium">
                        {suggestion.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* AI Chat */}
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl mb-4">
                    <Lightbulb className="h-8 w-8 text-purple-500" />
                  </div>
                  <h4 className="font-medium mb-2">How can I help?</h4>
                  <p className="text-sm text-muted-foreground max-w-[250px]">
                    Select text in the editor or ask me to help improve your
                    writing, generate content, or explain concepts.
                  </p>
                </div>
              </div>

              {/* AI Input */}
              <div className="p-4 border-t">
                <div className="relative bg-muted rounded-xl border focus-within:border-primary transition-colors">
                  <textarea
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    placeholder="Ask AI to help with your writing..."
                    rows={2}
                    className="w-full px-4 py-3 pr-12 bg-transparent text-sm rounded-xl resize-none focus:outline-none"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!aiInput.trim() || isAiLoading}
                    className={cn(
                      "absolute right-2 bottom-2 p-2 rounded-lg transition-colors",
                      aiInput.trim()
                        ? "bg-primary text-white"
                        : "bg-muted-foreground/20 text-muted-foreground cursor-not-allowed"
                    )}
                  >
                    {isAiLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowUp className="h-4 w-4" />
                    )}
                  </motion.button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2 text-center flex items-center justify-center gap-1">
                  <Zap className="h-3 w-3" />
                  Powered by {currentModel?.label}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

export default TextEditorPage;
