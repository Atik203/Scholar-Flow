"use client";

import {
  AlertTriangle,
  ArrowRight,
  Briefcase,
  Building,
  CheckCircle,
  Clock,
  FileText,
  Gift,
  Loader2,
  Mail,
  Shield,
  Sparkles,
  Star,
  Users,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

// Mock invitation data types
type InvitationType = "workspace" | "collection" | "team" | "collaboration";
type InvitationStatus = "pending" | "accepted" | "declined" | "expired";

interface InvitationDetails {
  id: string;
  token: string;
  type: InvitationType;
  status: InvitationStatus;
  inviterName: string;
  inviterEmail: string;
  inviterImage?: string;
  targetName: string;
  targetDescription?: string;
  role: string;
  permissions: string[];
  expiresAt: string;
  createdAt: string;
  memberCount?: number;
  paperCount?: number;
  features: string[];
}

// Mock invitation data (simulating token lookup)
const mockInvitation: InvitationDetails = {
  id: "inv_123",
  token: "abc123xyz",
  type: "workspace",
  status: "pending",
  inviterName: "Dr. Sarah Chen",
  inviterEmail: "sarah.chen@university.edu",
  inviterImage: undefined,
  targetName: "AI Research Lab 2024",
  targetDescription:
    "A collaborative workspace for cutting-edge AI and machine learning research. Join our team of researchers working on next-generation neural architectures.",
  role: "Researcher",
  permissions: [
    "View all papers",
    "Upload papers",
    "Create collections",
    "Join discussions",
    "Access AI insights",
  ],
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  memberCount: 12,
  paperCount: 156,
  features: [
    "Unlimited paper storage",
    "AI-powered insights",
    "Citation graph visualization",
    "Team collaboration tools",
    "Advanced search",
  ],
};

interface InvitationResponsePageProps {
  onNavigate?: (path: string) => void;
}

export function InvitationResponsePage({
  onNavigate,
}: InvitationResponsePageProps) {
  const [invitation, setInvitation] = useState<InvitationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [responseStatus, setResponseStatus] = useState<
    "idle" | "accepting" | "declining" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Simulate fetching invitation data
  useEffect(() => {
    const fetchInvitation = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate different scenarios based on URL param
      const urlParams = new URLSearchParams(window.location.search);
      const scenario = urlParams.get("scenario");

      if (scenario === "expired") {
        setInvitation({
          ...mockInvitation,
          status: "expired",
          expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        });
      } else if (scenario === "accepted") {
        setInvitation({
          ...mockInvitation,
          status: "accepted",
        });
      } else if (scenario === "invalid") {
        setInvitation(null);
        setErrorMessage("This invitation link is invalid or has been revoked.");
      } else {
        setInvitation(mockInvitation);
      }

      setLoading(false);
    };

    fetchInvitation();
  }, []);

  const handleAccept = async () => {
    setProcessing(true);
    setResponseStatus("accepting");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setResponseStatus("success");
    setInvitation((prev) => (prev ? { ...prev, status: "accepted" } : null));
    setProcessing(false);
  };

  const handleDecline = async () => {
    setProcessing(true);
    setResponseStatus("declining");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setResponseStatus("success");
    setInvitation((prev) => (prev ? { ...prev, status: "declined" } : null));
    setProcessing(false);
  };

  const getTypeIcon = (type: InvitationType) => {
    switch (type) {
      case "workspace":
        return Building;
      case "collection":
        return FileText;
      case "team":
        return Users;
      case "collaboration":
        return Briefcase;
      default:
        return Mail;
    }
  };

  const getTypeLabel = (type: InvitationType) => {
    switch (type) {
      case "workspace":
        return "Workspace";
      case "collection":
        return "Collection";
      case "team":
        return "Team";
      case "collaboration":
        return "Collaboration";
      default:
        return "Invitation";
    }
  };

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();

    if (diff <= 0) return "Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} remaining`;
    return `${hours} hour${hours > 1 ? "s" : ""} remaining`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-6"
          >
            <div className="w-full h-full border-4 border-purple-500/30 border-t-purple-500 rounded-full" />
          </motion.div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Loading Invitation
          </h2>
          <p className="text-gray-400">
            Please wait while we fetch your invitation details...
          </p>
        </motion.div>
      </div>
    );
  }

  // Invalid/not found state
  if (!invitation && errorMessage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900/20 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-10 w-10 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">
            Invalid Invitation
          </h1>
          <p className="text-gray-300 mb-6">{errorMessage}</p>
          <button
            onClick={() => onNavigate?.("/dashboard")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            Go to Dashboard
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    );
  }

  if (!invitation) return null;

  const TypeIcon = getTypeIcon(invitation.type);
  const isExpired = invitation.status === "expired";
  const isResolved =
    invitation.status === "accepted" || invitation.status === "declined";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* Animated particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/30 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            y: [null, -20, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl w-full"
        >
          {/* Main card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden shadow-2xl">
            {/* Header with gradient */}
            <div
              className={`relative p-8 ${
                isExpired
                  ? "bg-gradient-to-r from-gray-600 to-gray-700"
                  : isResolved
                    ? invitation.status === "accepted"
                      ? "bg-gradient-to-r from-green-600 to-emerald-600"
                      : "bg-gradient-to-r from-red-600 to-rose-600"
                    : "bg-gradient-to-r from-purple-600 to-blue-600"
              }`}
            >
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjEiLz48L3N2Zz4=')] opacity-50" />

              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <TypeIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <span className="text-white/80 text-sm font-medium">
                      {getTypeLabel(invitation.type)} Invitation
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Clock className="h-3.5 w-3.5 text-white/60" />
                      <span className="text-white/60 text-xs">
                        {isExpired
                          ? "This invitation has expired"
                          : getTimeRemaining(invitation.expiresAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <h1 className="text-3xl font-bold text-white mb-2">
                  {invitation.targetName}
                </h1>
                {invitation.targetDescription && (
                  <p className="text-white/80 text-sm line-clamp-2">
                    {invitation.targetDescription}
                  </p>
                )}
              </div>
            </div>

            {/* Inviter info */}
            <div className="px-8 py-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
                  {invitation.inviterName.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold">
                    {invitation.inviterName}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {invitation.inviterEmail}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Sent on {formatDate(invitation.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium">
                    <Shield className="h-3.5 w-3.5" />
                    {invitation.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            {(invitation.memberCount || invitation.paperCount) && (
              <div className="px-8 py-4 bg-white/5 flex items-center gap-6 border-b border-white/10">
                {invitation.memberCount && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-white font-medium">
                      {invitation.memberCount}
                    </span>
                    <span className="text-gray-400 text-sm">members</span>
                  </div>
                )}
                {invitation.paperCount && (
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span className="text-white font-medium">
                      {invitation.paperCount}
                    </span>
                    <span className="text-gray-400 text-sm">papers</span>
                  </div>
                )}
              </div>
            )}

            {/* Permissions */}
            <div className="px-8 py-6 border-b border-white/10">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-400" />
                Your Permissions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {invitation.permissions.map((permission, index) => (
                  <motion.div
                    key={permission}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2 text-gray-300 text-sm"
                  >
                    <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                    {permission}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Features included */}
            <div className="px-8 py-6 border-b border-white/10">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Gift className="h-4 w-4 text-purple-400" />
                What You'll Get
              </h3>
              <div className="flex flex-wrap gap-2">
                {invitation.features.map((feature, index) => (
                  <motion.span
                    key={feature}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 text-gray-300 rounded-full text-xs"
                  >
                    <Sparkles className="h-3 w-3 text-purple-400" />
                    {feature}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="px-8 py-6">
              <AnimatePresence mode="wait">
                {isExpired ? (
                  <motion.div
                    key="expired"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-4"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-500/20 rounded-full flex items-center justify-center">
                      <Clock className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Invitation Expired
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      This invitation is no longer valid. Please contact the
                      inviter for a new link.
                    </p>
                    <button
                      onClick={() => onNavigate?.("/dashboard")}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                    >
                      Go to Dashboard
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </motion.div>
                ) : isResolved ? (
                  <motion.div
                    key="resolved"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-4"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", bounce: 0.5 }}
                      className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                        invitation.status === "accepted"
                          ? "bg-green-500/20"
                          : "bg-red-500/20"
                      }`}
                    >
                      {invitation.status === "accepted" ? (
                        <CheckCircle className="h-10 w-10 text-green-400" />
                      ) : (
                        <XCircle className="h-10 w-10 text-red-400" />
                      )}
                    </motion.div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {invitation.status === "accepted"
                        ? "Welcome Aboard! 🎉"
                        : "Invitation Declined"}
                    </h3>
                    <p className="text-gray-400 text-sm mb-6">
                      {invitation.status === "accepted"
                        ? `You're now a member of ${invitation.targetName}. Let's get started!`
                        : "You've declined this invitation. You can request a new one anytime."}
                    </p>
                    <button
                      onClick={() =>
                        onNavigate?.(
                          invitation.status === "accepted"
                            ? `/workspaces/${invitation.id}`
                            : "/dashboard"
                        )
                      }
                      className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                        invitation.status === "accepted"
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-500/25"
                          : "bg-white/10 hover:bg-white/20 text-white"
                      }`}
                    >
                      {invitation.status === "accepted"
                        ? "Go to Workspace"
                        : "Go to Dashboard"}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="pending"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleAccept}
                        disabled={processing}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl shadow-lg shadow-purple-500/25 transition-all"
                      >
                        {responseStatus === "accepting" ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Joining...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-5 w-5" />
                            Accept Invitation
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleDecline}
                        disabled={processing}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-red-500/20 hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl border border-white/20 transition-all"
                      >
                        {responseStatus === "declining" ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Declining...
                          </>
                        ) : (
                          <>
                            <XCircle className="h-5 w-5" />
                            Decline
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-center text-gray-500 text-xs mt-4">
                      By accepting, you agree to the workspace's terms and
                      privacy policy.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Need help?{" "}
              <button
                onClick={() => onNavigate?.("/help")}
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                Contact Support
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default InvitationResponsePage;
