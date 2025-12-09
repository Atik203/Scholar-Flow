"use client";

import {
  ArrowLeft,
  BookOpen,
  Check,
  Loader2,
  Share2,
  UserPlus,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
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

interface SharedCollectionsPageProps {
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
const dummySharedCollections = [
  {
    id: "col-1",
    name: "Machine Learning Research",
    owner: "John Smith",
    memberStatus: "ACCEPTED",
    paperCount: 15,
  },
  {
    id: "col-2",
    name: "NLP Papers Collection",
    owner: "Jane Doe",
    memberStatus: "ACCEPTED",
    paperCount: 8,
  },
];

const dummyReceivedInvites = [
  {
    id: "inv-1",
    collectionId: "col-3",
    collectionName: "Computer Vision Studies",
    invitedBy: "Emily Chen",
    invitedAt: "2024-03-15",
    role: "VIEWER",
  },
  {
    id: "inv-2",
    collectionId: "col-4",
    collectionName: "Quantum Computing Papers",
    invitedBy: "Robert Brown",
    invitedAt: "2024-03-18",
    role: "EDITOR",
  },
];

const dummySentInvites = [
  {
    id: "sent-1",
    collectionId: "col-5",
    collectionName: "My AI Research",
    invitedEmail: "alice@example.com",
    status: "PENDING",
    sentAt: "2024-03-10",
  },
  {
    id: "sent-2",
    collectionId: "col-5",
    collectionName: "My AI Research",
    invitedEmail: "bob@example.com",
    status: "ACCEPTED",
    sentAt: "2024-03-08",
  },
];

// ============================================================================
// Shared Collections Page Component
// ============================================================================
export function SharedCollectionsPage({
  onNavigate,
  role: propRole,
}: SharedCollectionsPageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const user = { ...defaultUser, role: effectiveRole };

  const [activeTab, setActiveTab] = useState<"shared" | "received" | "sent">(
    "shared"
  );
  const [processingInvite, setProcessingInvite] = useState<string | null>(null);

  const handleAccept = async (collectionId: string) => {
    setProcessingInvite(collectionId);
    await new Promise((r) => setTimeout(r, 1000));
    setProcessingInvite(null);
  };

  const handleDecline = async (collectionId: string) => {
    setProcessingInvite(collectionId);
    await new Promise((r) => setTimeout(r, 1000));
    setProcessingInvite(null);
  };

  return (
    <DashboardLayout
      user={user}
      onNavigate={onNavigate}
      currentPath="/collections/shared"
    >
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center px-3 py-2 text-sm border rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Collections
          </motion.button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Shared Collections
            </h1>
            <p className="text-muted-foreground">
              Invitations and collections shared with you
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b">
          {[
            { id: "shared", label: "Accepted" },
            { id: "received", label: "Received Invites" },
            { id: "sent", label: "Sent Invites" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                "px-6 py-3 text-sm font-medium border-b-2 -mb-px transition-colors",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "shared" && (
          <div className="rounded-xl border bg-card">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Collections shared with me
              </h3>
            </div>
            <div className="p-4">
              {dummySharedCollections.length > 0 ? (
                <ul className="space-y-3">
                  {dummySharedCollections.map((collection) => (
                    <li
                      key={collection.id}
                      className="flex items-center justify-between border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{collection.name}</p>
                          <p className="text-sm text-muted-foreground">
                            By {collection.owner} • {collection.paperCount}{" "}
                            papers
                          </p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
                      >
                        Open
                      </motion.button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Share2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No shared collections yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "received" && (
          <div className="rounded-xl border bg-card">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Received invites
              </h3>
            </div>
            <div className="p-4">
              {dummyReceivedInvites.length > 0 ? (
                <ul className="space-y-3">
                  {dummyReceivedInvites.map((invite) => (
                    <li
                      key={invite.id}
                      className="flex items-center justify-between border rounded-lg p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{invite.collectionName}</p>
                          <p className="text-sm text-muted-foreground">
                            Invited by {invite.invitedBy} • Role: {invite.role}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {invite.invitedAt}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAccept(invite.collectionId)}
                          disabled={processingInvite === invite.collectionId}
                          className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50"
                        >
                          {processingInvite === invite.collectionId ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDecline(invite.collectionId)}
                          disabled={processingInvite === invite.collectionId}
                          className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50"
                        >
                          <X className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <UserPlus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No pending invites.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "sent" && (
          <div className="rounded-xl border bg-card">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Sent invites
              </h3>
            </div>
            <div className="p-4">
              {dummySentInvites.length > 0 ? (
                <ul className="space-y-3">
                  {dummySentInvites.map((invite) => (
                    <li
                      key={invite.id}
                      className="flex items-center justify-between border rounded-lg p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-muted">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{invite.collectionName}</p>
                          <p className="text-sm text-muted-foreground">
                            Sent to {invite.invitedEmail}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {invite.sentAt}
                          </p>
                        </div>
                      </div>
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium",
                          invite.status === "ACCEPTED"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        )}
                      >
                        {invite.status}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Share2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No sent invites.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default SharedCollectionsPage;
