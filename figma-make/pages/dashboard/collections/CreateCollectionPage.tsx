"use client";

/**
 * CreateCollectionPage - Enhanced Collection Creation
 *
 * Features:
 * - AI-suggested collections based on user's papers
 * - Smart paper recommendations
 * - Topic clustering visualization
 * - Visibility & permission presets
 * - Multi-step wizard with progress
 * - Framer Motion animations
 */

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Brain,
  Check,
  Folder,
  Globe,
  Lock,
  Palette,
  Plus,
  Search,
  Sparkles,
  Tag,
  TrendingUp,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useRole, type UserRole } from "../../../components/context";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";

// ============================================================================
// Types
// ============================================================================
interface CreateCollectionPageProps {
  onNavigate?: (path: string) => void;
  role?: UserRole;
}

type WizardStep = "basics" | "papers" | "team" | "review";
type VisibilityOption = "private" | "team" | "public";

interface AISuggestion {
  id: string;
  name: string;
  description: string;
  paperCount: number;
  topics: string[];
  relevanceScore: number;
}

interface RecommendedPaper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  topic: string;
  citationCount: number;
  selected: boolean;
}

interface TopicCluster {
  id: string;
  name: string;
  paperCount: number;
  color: string;
  papers: { id: string; title: string }[];
}

// ============================================================================
// Sample Data
// ============================================================================
const defaultUser = {
  name: "John Researcher",
  email: "john@example.com",
  image: undefined,
  role: "researcher" as const,
};

const aiSuggestions: AISuggestion[] = [
  {
    id: "sug-1",
    name: "Transformer Architectures",
    description: "Papers exploring attention mechanisms and transformer models",
    paperCount: 8,
    topics: ["transformers", "attention", "NLP"],
    relevanceScore: 95,
  },
  {
    id: "sug-2",
    name: "Few-Shot Learning",
    description: "Research on learning from limited data samples",
    paperCount: 5,
    topics: ["few-shot", "meta-learning", "prompting"],
    relevanceScore: 88,
  },
  {
    id: "sug-3",
    name: "Vision & Language",
    description: "Multimodal AI combining visual and textual understanding",
    paperCount: 6,
    topics: ["vision", "multimodal", "VLM"],
    relevanceScore: 82,
  },
];

const recommendedPapers: RecommendedPaper[] = [
  {
    id: "paper-1",
    title: "Attention Is All You Need",
    authors: ["Vaswani et al."],
    year: 2017,
    topic: "Transformers",
    citationCount: 89542,
    selected: false,
  },
  {
    id: "paper-2",
    title: "BERT: Pre-training Deep Bidirectional Transformers",
    authors: ["Devlin et al."],
    year: 2018,
    topic: "NLP",
    citationCount: 67234,
    selected: false,
  },
  {
    id: "paper-3",
    title: "GPT-3: Language Models are Few-Shot Learners",
    authors: ["Brown et al."],
    year: 2020,
    topic: "LLMs",
    citationCount: 45123,
    selected: false,
  },
  {
    id: "paper-4",
    title: "LoRA: Low-Rank Adaptation",
    authors: ["Hu et al."],
    year: 2021,
    topic: "Fine-tuning",
    citationCount: 12456,
    selected: false,
  },
  {
    id: "paper-5",
    title: "Chain-of-Thought Prompting",
    authors: ["Wei et al."],
    year: 2022,
    topic: "Prompting",
    citationCount: 8765,
    selected: false,
  },
];

const topicClusters: TopicCluster[] = [
  {
    id: "cluster-1",
    name: "Transformers",
    paperCount: 4,
    color: "#8B5CF6",
    papers: [
      { id: "1", title: "Attention Is All You Need" },
      { id: "2", title: "BERT" },
    ],
  },
  {
    id: "cluster-2",
    name: "Language Models",
    paperCount: 3,
    color: "#EC4899",
    papers: [
      { id: "3", title: "GPT-3" },
      { id: "4", title: "GPT-4" },
    ],
  },
  {
    id: "cluster-3",
    name: "Fine-tuning",
    paperCount: 2,
    color: "#06B6D4",
    papers: [{ id: "5", title: "LoRA" }],
  },
  {
    id: "cluster-4",
    name: "Prompting",
    paperCount: 2,
    color: "#F59E0B",
    papers: [{ id: "6", title: "Chain-of-Thought" }],
  },
];

const collectionColors = [
  { name: "Purple", value: "#8B5CF6" },
  { name: "Blue", value: "#3B82F6" },
  { name: "Green", value: "#10B981" },
  { name: "Orange", value: "#F59E0B" },
  { name: "Pink", value: "#EC4899" },
  { name: "Red", value: "#EF4444" },
];

// ============================================================================
// Utility Functions
// ============================================================================
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// ============================================================================
// Create Collection Page Component
// ============================================================================
export function CreateCollectionPage({
  onNavigate,
  role: propRole,
}: CreateCollectionPageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const user = { ...defaultUser, role: effectiveRole };

  const isPremiumUser =
    effectiveRole === "pro_researcher" ||
    effectiveRole === "team_lead" ||
    effectiveRole === "admin";

  // Wizard State
  const [currentStep, setCurrentStep] = useState<WizardStep>("basics");
  const steps: WizardStep[] = ["basics", "papers", "team", "review"];
  const stepIndex = steps.indexOf(currentStep);

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState(collectionColors[0].value);
  const [visibility, setVisibility] = useState<VisibilityOption>("private");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [selectedPapers, setSelectedPapers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [inviteEmails, setInviteEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [showAISuggestions, setShowAISuggestions] = useState(true);
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<AISuggestion | null>(null);

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const togglePaper = (paperId: string) => {
    setSelectedPapers((prev) =>
      prev.includes(paperId)
        ? prev.filter((id) => id !== paperId)
        : [...prev, paperId]
    );
  };

  const addEmail = () => {
    if (
      emailInput.trim() &&
      emailInput.includes("@") &&
      !inviteEmails.includes(emailInput.trim())
    ) {
      setInviteEmails([...inviteEmails, emailInput.trim()]);
      setEmailInput("");
    }
  };

  const removeEmail = (email: string) => {
    setInviteEmails(inviteEmails.filter((e) => e !== email));
  };

  const applySuggestion = (suggestion: AISuggestion) => {
    setSelectedSuggestion(suggestion);
    setName(suggestion.name);
    setDescription(suggestion.description);
    setTags(suggestion.topics);
  };

  const goNext = () => {
    const nextIndex = stepIndex + 1;
    if (nextIndex < steps.length) setCurrentStep(steps[nextIndex]);
  };

  const goPrev = () => {
    const prevIndex = stepIndex - 1;
    if (prevIndex >= 0) setCurrentStep(steps[prevIndex]);
  };

  const handleCreate = () => {
    // Would submit the collection
    onNavigate?.("/collections");
  };

  const isStepValid = () => {
    switch (currentStep) {
      case "basics":
        return name.trim().length >= 3;
      case "papers":
        return true; // Optional
      case "team":
        return true; // Optional
      case "review":
        return name.trim().length >= 3;
      default:
        return false;
    }
  };

  const filteredPapers = recommendedPapers.filter((paper) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      paper.title.toLowerCase().includes(query) ||
      paper.topic.toLowerCase().includes(query)
    );
  });

  return (
    <DashboardLayout
      user={user}
      onNavigate={onNavigate}
      currentPath="/collections/create"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate?.("/collections")}
            className="inline-flex items-center px-3 py-2 text-sm border rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </motion.button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Create Collection
            </h1>
            <p className="text-muted-foreground">
              Organize your research papers into themed collections
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between px-4">
          {steps.map((step, index) => {
            const isActive = index === stepIndex;
            const isCompleted = index < stepIndex;
            return (
              <div key={step} className="flex items-center">
                <div className="flex flex-col items-center">
                  <motion.div
                    animate={{
                      scale: isActive ? 1.1 : 1,
                      backgroundColor: isCompleted
                        ? "#10B981"
                        : isActive
                          ? "#8B5CF6"
                          : "#E5E7EB",
                    }}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold",
                      isCompleted || isActive ? "text-white" : "text-gray-500"
                    )}
                  >
                    {isCompleted ? <Check className="h-5 w-5" /> : index + 1}
                  </motion.div>
                  <span
                    className={cn(
                      "text-xs mt-2 capitalize",
                      isActive ? "font-medium" : "text-muted-foreground"
                    )}
                  >
                    {step}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "w-24 h-1 mx-4 rounded-full",
                      isCompleted ? "bg-green-500" : "bg-gray-200"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step 1: Basics */}
            {currentStep === "basics" && (
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-card border rounded-xl p-6 space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Folder className="h-5 w-5 text-primary" />
                      Collection Details
                    </h3>

                    {/* Name */}
                    <div>
                      <label className="text-sm font-medium">Name *</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Machine Learning Research"
                        className="mt-1.5 w-full px-4 py-3 border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe what this collection is about..."
                        rows={3}
                        className="mt-1.5 w-full px-4 py-3 border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      />
                    </div>

                    {/* Color */}
                    <div>
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Palette className="h-4 w-4" />
                        Color
                      </label>
                      <div className="flex gap-2 mt-2">
                        {collectionColors.map((color) => (
                          <button
                            key={color.value}
                            onClick={() => setSelectedColor(color.value)}
                            className={cn(
                              "w-8 h-8 rounded-full transition-all",
                              selectedColor === color.value &&
                                "ring-2 ring-offset-2 ring-primary"
                            )}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        Tags
                      </label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary rounded-full text-sm"
                          >
                            #{tag}
                            <button
                              onClick={() => removeTag(tag)}
                              className="hover:text-primary/70"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addTag()}
                            placeholder="Add tag..."
                            className="px-2 py-1 border rounded-lg text-sm w-24 bg-background"
                          />
                          <button
                            onClick={addTag}
                            className="p-1 hover:bg-muted rounded"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Visibility */}
                    <div>
                      <label className="text-sm font-medium">Visibility</label>
                      <div className="grid grid-cols-3 gap-3 mt-2">
                        {[
                          {
                            key: "private",
                            icon: Lock,
                            label: "Private",
                            desc: "Only you",
                          },
                          {
                            key: "team",
                            icon: Users,
                            label: "Team",
                            desc: "Invite members",
                          },
                          {
                            key: "public",
                            icon: Globe,
                            label: "Public",
                            desc: "Anyone",
                          },
                        ].map((opt) => (
                          <button
                            key={opt.key}
                            onClick={() =>
                              setVisibility(opt.key as VisibilityOption)
                            }
                            className={cn(
                              "p-3 border rounded-xl text-left transition-all hover:border-primary/50",
                              visibility === opt.key &&
                                "border-primary bg-primary/5 ring-1 ring-primary"
                            )}
                          >
                            <opt.icon
                              className={cn(
                                "h-5 w-5 mb-2",
                                visibility === opt.key
                                  ? "text-primary"
                                  : "text-muted-foreground"
                              )}
                            />
                            <p className="font-medium text-sm">{opt.label}</p>
                            <p className="text-xs text-muted-foreground">
                              {opt.desc}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Suggestions Sidebar */}
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold flex items-center gap-2 text-purple-900 dark:text-purple-100">
                        <Sparkles className="h-4 w-4" />
                        AI Suggestions
                      </h3>
                      {!isPremiumUser && (
                        <span className="px-1.5 py-0.5 text-xs rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium">
                          PRO
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-purple-700 dark:text-purple-300 mb-3">
                      Based on your papers, we suggest:
                    </p>
                    <div className="space-y-2">
                      {aiSuggestions.map((suggestion) => (
                        <motion.button
                          key={suggestion.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => applySuggestion(suggestion)}
                          className={cn(
                            "w-full bg-white/50 dark:bg-gray-900/50 rounded-lg p-3 text-left transition-all",
                            selectedSuggestion?.id === suggestion.id &&
                              "ring-2 ring-purple-500"
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium text-sm">
                                {suggestion.name}
                              </h4>
                              <p className="text-xs text-muted-foreground line-clamp-1">
                                {suggestion.description}
                              </p>
                            </div>
                            <span className="text-xs font-medium text-purple-600">
                              {suggestion.relevanceScore}%
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-muted-foreground">
                              {suggestion.paperCount} papers
                            </span>
                            <div className="flex gap-1">
                              {suggestion.topics.slice(0, 2).map((topic) => (
                                <span
                                  key={topic}
                                  className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded text-xs"
                                >
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Topic Clusters Preview */}
                  <div className="bg-card border rounded-xl p-4">
                    <h3 className="font-semibold text-sm flex items-center gap-2 mb-3">
                      <Brain className="h-4 w-4" />
                      Your Paper Topics
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {topicClusters.map((cluster) => (
                        <span
                          key={cluster.id}
                          className="px-2.5 py-1 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: cluster.color }}
                        >
                          {cluster.name} ({cluster.paperCount})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Papers */}
            {currentStep === "papers" && (
              <div className="bg-card border rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Add Papers
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    {selectedPapers.length} selected
                  </span>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search your papers..."
                    className="w-full pl-10 pr-4 py-3 border rounded-xl bg-background"
                  />
                </div>

                {/* AI Recommendations */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    <span className="font-medium text-sm">
                      AI Recommended Papers
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Based on "{name || "collection"}"
                    </span>
                  </div>
                  <div className="space-y-2">
                    {filteredPapers.map((paper, index) => (
                      <motion.div
                        key={paper.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => togglePaper(paper.id)}
                        className={cn(
                          "flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg cursor-pointer transition-all hover:shadow-sm",
                          selectedPapers.includes(paper.id) &&
                            "ring-2 ring-primary bg-primary/5"
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={selectedPapers.includes(paper.id)}
                          onChange={() => togglePaper(paper.id)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-1">
                            {paper.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {paper.authors.join(", ")} • {paper.year}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-muted rounded text-xs">
                            {paper.topic}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {(paper.citationCount / 1000).toFixed(0)}K
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Selected Papers Summary */}
                {selectedPapers.length > 0 && (
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm">
                      {selectedPapers.length} papers will be added
                    </span>
                    <button
                      onClick={() => setSelectedPapers([])}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Clear all
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Team */}
            {currentStep === "team" && (
              <div className="bg-card border rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Invite Team Members
                </h3>
                <p className="text-sm text-muted-foreground">
                  Add collaborators who can view or edit this collection
                </p>

                {/* Email Input */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addEmail()}
                      placeholder="Enter email address..."
                      className="w-full pl-10 pr-4 py-3 border rounded-xl bg-background"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={addEmail}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-xl flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </motion.button>
                </div>

                {/* Invited Members */}
                {inviteEmails.length > 0 && (
                  <div className="space-y-2">
                    {inviteEmails.map((email, index) => (
                      <motion.div
                        key={email}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                            {email.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm">{email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <select className="px-2 py-1 text-xs border rounded bg-background">
                            <option value="editor">Editor</option>
                            <option value="viewer">Viewer</option>
                          </select>
                          <button
                            onClick={() => removeEmail(email)}
                            className="p-1 hover:bg-muted rounded"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {inviteEmails.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No team members invited yet</p>
                    <p className="text-sm">You can always add people later</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === "review" && (
              <div className="bg-card border rounded-xl p-6 space-y-6">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  Review & Create
                </h3>

                <div className="grid gap-4 md:grid-cols-2">
                  {/* Collection Preview */}
                  <div className="p-4 border rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: selectedColor }}
                      >
                        <Folder className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold">
                          {name || "Untitled Collection"}
                        </h4>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          {visibility === "private" && (
                            <>
                              <Lock className="h-3 w-3" />
                              Private
                            </>
                          )}
                          {visibility === "team" && (
                            <>
                              <Users className="h-3 w-3" />
                              Team
                            </>
                          )}
                          {visibility === "public" && (
                            <>
                              <Globe className="h-3 w-3" />
                              Public
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                    {description && (
                      <p className="text-sm text-muted-foreground">
                        {description}
                      </p>
                    )}
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Summary Stats */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Papers
                      </span>
                      <span className="font-medium">
                        {selectedPapers.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Team Members
                      </span>
                      <span className="font-medium">
                        {inviteEmails.length + 1}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        Tags
                      </span>
                      <span className="font-medium">{tags.length}</span>
                    </div>
                  </div>
                </div>

                {/* Create Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreate}
                  className="w-full py-4 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl font-semibold text-lg flex items-center justify-center gap-2"
                >
                  <Sparkles className="h-5 w-5" />
                  Create Collection
                </motion.button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={goPrev}
            disabled={stepIndex === 0}
            className="flex items-center gap-2 px-4 py-2 border rounded-xl hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </motion.button>

          {currentStep !== "review" && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={goNext}
              disabled={!isStepValid()}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default CreateCollectionPage;
