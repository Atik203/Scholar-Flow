"use client";

import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Copy,
  Edit,
  Eye,
  FileText,
  Globe,
  Lock,
  Plus,
  Search,
  Share2,
  Trash2,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";

// ============================================================================
// Default User for Demo
// ============================================================================
const defaultUser = {
  name: "John Researcher",
  email: "john@example.com",
  image: undefined,
  role: "researcher" as const,
};

interface CollectionDetailsPageProps {
  onNavigate?: (path: string) => void;
  collectionId?: string;
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
const dummyCollection = {
  id: "col-1",
  name: "Machine Learning Research",
  description:
    "A curated collection of foundational and cutting-edge machine learning papers covering deep learning, neural networks, and AI systems.",
  visibility: "private" as const,
  createdAt: "2024-01-10T10:00:00Z",
  updatedAt: "2024-01-25T15:30:00Z",
  owner: {
    id: "user-1",
    name: "John Researcher",
    email: "john@example.com",
  },
  paperCount: 12,
  memberCount: 3,
};

const dummyPapers = [
  {
    id: "paper-1",
    title: "Attention Is All You Need",
    abstract:
      "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks...",
    authors: ["Ashish Vaswani", "Noam Shazeer", "Niki Parmar"],
    year: 2017,
    processingStatus: "PROCESSED",
    addedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "paper-2",
    title: "BERT: Pre-training of Deep Bidirectional Transformers",
    abstract:
      "We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers...",
    authors: ["Jacob Devlin", "Ming-Wei Chang", "Kenton Lee"],
    year: 2018,
    processingStatus: "PROCESSED",
    addedAt: "2024-01-16T14:20:00Z",
  },
  {
    id: "paper-3",
    title: "GPT-3: Language Models are Few-Shot Learners",
    abstract:
      "Recent work has demonstrated substantial gains on many NLP tasks and benchmarks by pre-training on a large corpus of text...",
    authors: ["Tom B. Brown", "Benjamin Mann", "Nick Ryder"],
    year: 2020,
    processingStatus: "PROCESSED",
    addedAt: "2024-01-18T09:45:00Z",
  },
  {
    id: "paper-4",
    title: "Deep Residual Learning for Image Recognition",
    abstract:
      "Deeper neural networks are more difficult to train. We present a residual learning framework...",
    authors: ["Kaiming He", "Xiangyu Zhang", "Shaoqing Ren"],
    year: 2015,
    processingStatus: "PROCESSING",
    addedAt: "2024-01-20T11:00:00Z",
  },
];

const dummyMembers = [
  {
    id: "member-1",
    name: "John Researcher",
    email: "john@example.com",
    role: "OWNER",
    permission: "ADMIN",
    joinedAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "member-2",
    name: "Dr. Sarah Chen",
    email: "sarah@university.edu",
    role: "MEMBER",
    permission: "EDIT",
    joinedAt: "2024-01-12T14:30:00Z",
  },
  {
    id: "member-3",
    name: "Prof. Michael Lee",
    email: "michael@research.org",
    role: "MEMBER",
    permission: "VIEW",
    joinedAt: "2024-01-15T09:00:00Z",
  },
];

const dummyAvailablePapers = [
  {
    id: "avail-1",
    title: "ImageNet Classification with Deep Convolutional Neural Networks",
    authors: ["Alex Krizhevsky", "Ilya Sutskever"],
  },
  {
    id: "avail-2",
    title: "Generative Adversarial Networks",
    authors: ["Ian Goodfellow", "Jean Pouget-Abadie"],
  },
  {
    id: "avail-3",
    title: "Dropout: A Simple Way to Prevent Neural Networks from Overfitting",
    authors: ["Nitish Srivastava", "Geoffrey Hinton"],
  },
];

// ============================================================================
// Collection Details Page Component
// ============================================================================
export function CollectionDetailsPage({
  onNavigate,
  collectionId,
}: CollectionDetailsPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showAddPapersDialog, setShowAddPapersDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePermission, setInvitePermission] = useState<"VIEW" | "EDIT">(
    "EDIT"
  );
  const [selectedPapers, setSelectedPapers] = useState<Set<string>>(new Set());
  const [editName, setEditName] = useState(dummyCollection.name);
  const [editDescription, setEditDescription] = useState(
    dummyCollection.description
  );
  const [previewPaperId, setPreviewPaperId] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      UPLOADED: {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        label: "Uploaded",
      },
      PROCESSING: {
        color:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
        label: "Processing",
      },
      PROCESSED: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        label: "Processed",
      },
      FAILED: {
        color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        label: "Failed",
      },
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.UPLOADED;
  };

  const getPermissionBadge = (permission: string) => {
    const permMap = {
      ADMIN: {
        color:
          "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
        label: "Admin",
      },
      EDIT: {
        color:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
        label: "Editor",
      },
      VIEW: {
        color:
          "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
        label: "Viewer",
      },
    };
    return permMap[permission as keyof typeof permMap] || permMap.VIEW;
  };

  const filteredPapers = dummyPapers.filter(
    (paper) =>
      paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.authors.some((a) =>
        a.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const togglePaperSelection = (paperId: string) => {
    setSelectedPapers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(paperId)) {
        newSet.delete(paperId);
      } else {
        newSet.add(paperId);
      }
      return newSet;
    });
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(
      `https://scholarflow.com/collections/${dummyCollection.id}`
    );
  };

  return (
    <DashboardLayout
      user={defaultUser}
      onNavigate={onNavigate}
      currentPath="/collections/details"
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate?.("/collections")}
              className="inline-flex items-center px-3 py-2 text-sm border rounded-lg hover:bg-muted transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Collections
            </motion.button>
          </div>
          <div className="flex flex-wrap gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowShareDialog(true)}
              className="inline-flex items-center px-4 py-2 border rounded-lg hover:bg-muted"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowEditDialog(true)}
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowDeleteDialog(true)}
              className="inline-flex items-center px-4 py-2 bg-destructive text-destructive-foreground rounded-lg"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </motion.button>
          </div>
        </div>

        {/* Collection Info Card */}
        <div className="rounded-xl border bg-gradient-to-r from-background to-primary/5 p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold">{dummyCollection.name}</h1>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium",
                      dummyCollection.visibility === "private"
                        ? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    )}
                  >
                    {dummyCollection.visibility === "private" ? (
                      <Lock className="h-3 w-3" />
                    ) : (
                      <Globe className="h-3 w-3" />
                    )}
                    {dummyCollection.visibility === "private"
                      ? "Private"
                      : "Public"}
                  </span>
                </div>
                <p className="text-muted-foreground max-w-2xl">
                  {dummyCollection.description}
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    {dummyCollection.paperCount} papers
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {dummyCollection.memberCount} members
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Created {formatDate(dummyCollection.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Papers List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-lg font-semibold">Papers in Collection</h2>
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search papers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64 pl-10 pr-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAddPapersDialog(true)}
                  className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg whitespace-nowrap"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Papers
                </motion.button>
              </div>
            </div>

            {/* Papers Grid */}
            <div className="space-y-3">
              {filteredPapers.length > 0 ? (
                filteredPapers.map((paper) => {
                  const statusBadge = getStatusBadge(paper.processingStatus);
                  return (
                    <motion.div
                      key={paper.id}
                      whileHover={{ scale: 1.01 }}
                      className="rounded-xl border bg-card p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => onNavigate?.(`/papers/${paper.id}`)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-2 mb-1">
                            <h3 className="font-medium line-clamp-2">
                              {paper.title}
                            </h3>
                            <span
                              className={cn(
                                "px-2 py-0.5 rounded text-xs font-medium shrink-0",
                                statusBadge.color
                              )}
                            >
                              {statusBadge.label}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {paper.abstract}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {paper.authors.slice(0, 2).join(", ")}
                              {paper.authors.length > 2 &&
                                ` +${paper.authors.length - 2}`}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {paper.year}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewPaperId(paper.id);
                            }}
                            className="p-2 hover:bg-muted rounded-lg"
                          >
                            <Eye className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              // Remove paper
                            }}
                            className="p-2 hover:bg-destructive/10 text-destructive rounded-lg"
                          >
                            <Trash2 className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="text-center py-12 border rounded-xl bg-muted/10">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No papers found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm
                      ? "Try a different search term"
                      : "Add papers to this collection to get started"}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddPapersDialog(true)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg inline-flex items-center"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Papers
                  </motion.button>
                </div>
              )}
            </div>
          </div>

          {/* Members Sidebar */}
          <div className="space-y-6">
            {/* Members Card */}
            <div className="rounded-xl border bg-card">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Members
                </h3>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowInviteDialog(true)}
                  className="text-sm text-primary hover:underline inline-flex items-center"
                >
                  <UserPlus className="mr-1 h-4 w-4" />
                  Invite
                </motion.button>
              </div>
              <div className="p-4 space-y-3">
                {dummyMembers.map((member) => {
                  const permBadge = getPermissionBadge(member.permission);
                  return (
                    <div
                      key={member.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {member.email}
                          </p>
                        </div>
                      </div>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-xs font-medium",
                          permBadge.color
                        )}
                      >
                        {permBadge.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-xl border bg-card p-4 space-y-3">
              <h3 className="font-semibold">Quick Actions</h3>
              <div className="space-y-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowShareDialog(true)}
                  className="w-full py-2 px-4 border rounded-lg text-sm hover:bg-muted transition-colors inline-flex items-center justify-center gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Share Collection
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2 px-4 border rounded-lg text-sm hover:bg-muted transition-colors inline-flex items-center justify-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Duplicate Collection
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Invite Member Dialog */}
        <AnimatePresence>
          {showInviteDialog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
              onClick={() => setShowInviteDialog(false)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-background border rounded-xl p-6 w-full max-w-md"
              >
                <h3 className="text-lg font-semibold mb-4">Invite Member</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Email Address</label>
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="colleague@university.edu"
                      className="mt-1.5 w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Permission</label>
                    <select
                      value={invitePermission}
                      onChange={(e) =>
                        setInvitePermission(e.target.value as "VIEW" | "EDIT")
                      }
                      className="mt-1.5 w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="VIEW">View only</option>
                      <option value="EDIT">Can edit</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 justify-end mt-6">
                  <button
                    onClick={() => setShowInviteDialog(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowInviteDialog(false);
                      setInviteEmail("");
                    }}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                  >
                    Send Invite
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Papers Dialog */}
        <AnimatePresence>
          {showAddPapersDialog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
              onClick={() => setShowAddPapersDialog(false)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-background border rounded-xl p-6 w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col"
              >
                <h3 className="text-lg font-semibold mb-4">
                  Add Papers to Collection
                </h3>
                <div className="space-y-4 flex-1 overflow-y-auto">
                  {dummyAvailablePapers.map((paper) => (
                    <label
                      key={paper.id}
                      className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPapers.has(paper.id)}
                        onChange={() => togglePaperSelection(paper.id)}
                        className="mt-1"
                      />
                      <div>
                        <p className="font-medium text-sm">{paper.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {paper.authors.join(", ")}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="flex gap-2 justify-end mt-6 pt-4 border-t">
                  <button
                    onClick={() => setShowAddPapersDialog(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowAddPapersDialog(false);
                      setSelectedPapers(new Set());
                    }}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                  >
                    Add {selectedPapers.size} Paper
                    {selectedPapers.size !== 1 ? "s" : ""}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Share Dialog */}
        <AnimatePresence>
          {showShareDialog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
              onClick={() => setShowShareDialog(false)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-background border rounded-xl p-6 w-full max-w-md"
              >
                <h3 className="text-lg font-semibold mb-4">Share Collection</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Share Link</label>
                    <div className="mt-1.5 flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={`https://scholarflow.com/collections/${dummyCollection.id}`}
                        className="flex-1 px-3 py-2 border rounded-lg bg-muted text-sm"
                      />
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={copyShareLink}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                      >
                        <Copy className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      {dummyCollection.visibility === "private" ? (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Globe className="h-4 w-4 text-green-600" />
                      )}
                      <span className="text-sm">
                        {dummyCollection.visibility === "private"
                          ? "Private - Only members can access"
                          : "Public - Anyone with link can view"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setShowShareDialog(false)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Dialog */}
        <AnimatePresence>
          {showEditDialog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
              onClick={() => setShowEditDialog(false)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-background border rounded-xl p-6 w-full max-w-md"
              >
                <h3 className="text-lg font-semibold mb-4">Edit Collection</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="mt-1.5 w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      rows={3}
                      className="mt-1.5 w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end mt-6">
                  <button
                    onClick={() => setShowEditDialog(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowEditDialog(false)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                  >
                    Save Changes
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Dialog */}
        <AnimatePresence>
          {showDeleteDialog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
              onClick={() => setShowDeleteDialog(false)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-background border rounded-xl p-6 w-full max-w-md"
              >
                <h3 className="text-lg font-semibold mb-2">
                  Delete Collection
                </h3>
                <p className="text-muted-foreground mb-4">
                  Are you sure you want to delete "{dummyCollection.name}"? This
                  will remove all papers from the collection but won't delete
                  the papers themselves.
                </p>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowDeleteDialog(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteDialog(false);
                      onNavigate?.("/collections");
                    }}
                    className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

export default CollectionDetailsPage;
