"use client";

import {
  BookOpen,
  Check,
  CheckCircle2,
  Copy,
  Download,
  FileText,
  History,
  Quote,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
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

interface CitationsPageProps {
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
// Dummy Data
// ============================================================================
const citationFormats = [
  {
    name: "BibTeX",
    description: "Standard bibliography format for LaTeX",
    recommended: true,
  },
  {
    name: "EndNote",
    description: "EndNote reference manager format",
    recommended: false,
  },
  {
    name: "APA",
    description: "American Psychological Association style",
    recommended: true,
  },
  {
    name: "MLA",
    description: "Modern Language Association style",
    recommended: false,
  },
  {
    name: "IEEE",
    description: "Institute of Electrical and Electronics Engineers",
    recommended: true,
  },
  {
    name: "Chicago",
    description: "Chicago Manual of Style",
    recommended: false,
  },
  {
    name: "Harvard",
    description: "Harvard referencing style",
    recommended: false,
  },
];

const dummyPapers = [
  {
    id: "paper-1",
    title: "Deep Learning in Natural Language Processing",
    authors: ["John Smith", "Jane Doe"],
    year: 2023,
    selected: false,
  },
  {
    id: "paper-2",
    title: "Machine Learning for Healthcare Applications",
    authors: ["Emily Chen", "Robert Brown"],
    year: 2024,
    selected: false,
  },
  {
    id: "paper-3",
    title: "Computer Vision Advances in Autonomous Systems",
    authors: ["Michael Lee"],
    year: 2023,
    selected: false,
  },
  {
    id: "paper-4",
    title: "Quantum Computing: Theory and Practice",
    authors: ["Sarah Johnson", "David Kim"],
    year: 2024,
    selected: false,
  },
];

const dummyCollections = [
  { id: "col-1", name: "Machine Learning Papers", count: 15 },
  { id: "col-2", name: "NLP Research", count: 8 },
  { id: "col-3", name: "Computer Vision", count: 12 },
];

const dummyExportHistory = [
  {
    id: "exp-1",
    format: "BibTeX",
    paperCount: 5,
    date: "2024-03-18",
    time: "14:30",
  },
  {
    id: "exp-2",
    format: "APA",
    paperCount: 3,
    date: "2024-03-17",
    time: "10:15",
  },
  {
    id: "exp-3",
    format: "IEEE",
    paperCount: 8,
    date: "2024-03-15",
    time: "16:45",
  },
];

// ============================================================================
// Citations Page Component
// ============================================================================
export function CitationsPage({
  onNavigate,
  role: propRole,
}: CitationsPageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const user = { ...defaultUser, role: effectiveRole };

  const [selectedPaperIds, setSelectedPaperIds] = useState<string[]>([]);
  const [selectedFormat, setSelectedFormat] = useState("BibTeX");
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const togglePaper = (paperId: string) => {
    setSelectedPaperIds((prev) =>
      prev.includes(paperId)
        ? prev.filter((id) => id !== paperId)
        : [...prev, paperId]
    );
  };

  const handleCopy = async (id: string) => {
    // Simulate copy
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const generateCitation = (paper: (typeof dummyPapers)[0], format: string) => {
    const authors = paper.authors.join(" and ");
    switch (format) {
      case "BibTeX":
        return `@article{${paper.id},
  title={${paper.title}},
  author={${authors}},
  year={${paper.year}}
}`;
      case "APA":
        return `${paper.authors.join(", ")} (${paper.year}). ${paper.title}.`;
      case "MLA":
        return `${paper.authors.join(", ")}. "${paper.title}." ${paper.year}.`;
      case "IEEE":
        return `${paper.authors.join(", ")}, "${paper.title}," ${paper.year}.`;
      default:
        return paper.title;
    }
  };

  return (
    <DashboardLayout
      user={user}
      onNavigate={onNavigate}
      currentPath="/research/citations"
    >
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Quote className="h-8 w-8 text-primary" />
              Citations & References
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage and export citations in various academic formats
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Format Guide
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
            >
              <History className="mr-2 h-4 w-4" />
              Export History
            </motion.button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Papers Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Citation Formats */}
            <div className="rounded-xl border bg-card p-6">
              <h2 className="text-lg font-semibold mb-4">Citation Format</h2>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {citationFormats.map((format) => (
                  <motion.button
                    key={format.name}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedFormat(format.name)}
                    className={cn(
                      "p-3 rounded-lg border text-left transition-colors",
                      selectedFormat === format.name
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{format.name}</span>
                      {format.recommended && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format.description}
                    </p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Papers List */}
            <div className="rounded-xl border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Select Papers
                </h2>
                <span className="text-sm text-muted-foreground">
                  {selectedPaperIds.length} selected
                </span>
              </div>
              <div className="space-y-2">
                {dummyPapers.map((paper) => (
                  <div
                    key={paper.id}
                    className={cn(
                      "flex items-start gap-3 p-4 rounded-lg border transition-colors",
                      selectedPaperIds.includes(paper.id)
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={selectedPaperIds.includes(paper.id)}
                      onChange={() => togglePaper(paper.id)}
                      className="mt-1 rounded border-muted-foreground"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{paper.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {paper.authors.join(", ")} • {paper.year}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCopy(paper.id)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      {copiedId === paper.id ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4 text-muted-foreground" />
                      )}
                    </motion.button>
                  </div>
                ))}
              </div>

              {/* Export Button */}
              <div className="mt-4 pt-4 border-t">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={selectedPaperIds.length === 0}
                  onClick={() => setShowExportDialog(true)}
                  className={cn(
                    "w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2",
                    selectedPaperIds.length > 0
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  )}
                >
                  <Download className="h-5 w-5" />
                  Export {selectedPaperIds.length} Citation
                  {selectedPaperIds.length !== 1 ? "s" : ""} as {selectedFormat}
                </motion.button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Collections */}
            <div className="rounded-xl border bg-card p-6">
              <h3 className="font-semibold flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5" />
                Quick Export by Collection
              </h3>
              <div className="space-y-2">
                {dummyCollections.map((collection) => (
                  <motion.button
                    key={collection.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full p-3 rounded-lg border hover:bg-muted transition-colors text-left"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{collection.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {collection.count} papers
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Recent Exports */}
            <div className="rounded-xl border bg-card p-6">
              <h3 className="font-semibold flex items-center gap-2 mb-4">
                <History className="h-5 w-5" />
                Recent Exports
              </h3>
              <div className="space-y-3">
                {dummyExportHistory.map((exp) => (
                  <div
                    key={exp.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div>
                      <p className="font-medium text-sm">{exp.format}</p>
                      <p className="text-xs text-muted-foreground">
                        {exp.paperCount} papers • {exp.date}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 hover:bg-muted rounded-lg"
                    >
                      <Download className="h-4 w-4 text-muted-foreground" />
                    </motion.button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Export Dialog */}
        <AnimatePresence>
          {showExportDialog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
              onClick={() => setShowExportDialog(false)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-background border rounded-xl p-6 w-full max-w-lg"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Export Ready</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedPaperIds.length} citations in {selectedFormat}{" "}
                      format
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg font-mono text-sm max-h-64 overflow-auto mb-4">
                  {selectedPaperIds.map((id) => {
                    const paper = dummyPapers.find((p) => p.id === id);
                    if (!paper) return null;
                    return (
                      <pre
                        key={id}
                        className="mb-4 last:mb-0 whitespace-pre-wrap"
                      >
                        {generateCitation(paper, selectedFormat)}
                      </pre>
                    );
                  })}
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      handleCopy("export");
                      setShowExportDialog(false);
                    }}
                    className="flex-1 py-2 border rounded-lg hover:bg-muted transition-colors flex items-center justify-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copy to Clipboard
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowExportDialog(false)}
                    className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg flex items-center justify-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download File
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

export default CitationsPage;
