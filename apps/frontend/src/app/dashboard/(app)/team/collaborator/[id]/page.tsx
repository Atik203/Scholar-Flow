"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useGetTeamMemberQuery } from "@/redux/api/teamApi";
import { selectAccessToken } from "@/redux/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
import { AnimatePresence, motion } from "motion/react";
import {
  Activity,
  Award,
  BookOpen,
  Building,
  Check,
  Clock,
  Copy,
  ExternalLink,
  Eye,
  FileText,
  Flag,
  Folder,
  Globe,
  Mail,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Send,
  Share2,
  Star,
  TrendingUp,
  Twitter,
  UserCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

type Tab = "papers" | "collections" | "activity";

const TABS: { id: Tab; label: string; count: number | null }[] = [
  { id: "papers", label: "Papers", count: null },
  { id: "collections", label: "Collections", count: null },
  { id: "activity", label: "Activity", count: null },
];

export default function CollaboratorProfilePage() {
  const params = useParams<{ id: string }>();
  const userId = params?.id as string;
  const accessToken = useAppSelector(selectAccessToken);
  const shouldFetch = !!accessToken && accessToken.length > 0;

  const [activeTab, setActiveTab] = useState<Tab>("papers");
  const [isFollowing, setIsFollowing] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState("");
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const { data: member, isLoading } = useGetTeamMemberQuery(userId, {
    skip: !shouldFetch,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-48 md:h-64 bg-muted rounded-xl animate-pulse" />
        <div className="h-32 bg-muted rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="text-center py-12">
        <Users className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
        <p>Collaborator not found</p>
      </div>
    );
  }

  const name =
    member.name || `${member.firstName || ""} ${member.lastName || ""}`.trim() || member.email;
  const initials = name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleCopyEmail = () => {
    if (typeof window === "undefined" || !member.email) return;
    navigator.clipboard.writeText(member.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="min-h-screen">
      {/* Cover Image */}
      <div className="relative h-48 md:h-64 bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-24 relative z-10">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border shadow-lg overflow-hidden"
        >
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="shrink-0">
                <div className="relative">
                  <Avatar className="w-28 h-28 md:w-36 md:h-36 border-4 border-card shadow-lg">
                    <AvatarImage src={member.image || undefined} alt={name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl font-medium">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-card" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">{name}</h1>
                    {member.institution && (
                      <p className="text-muted-foreground">
                        {member.fieldOfStudy || "Researcher"} at {member.institution}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      {member.institution && (
                        <span className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          {member.institution}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Joined {new Date(member.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => setIsFollowing(!isFollowing)}
                      className={
                        isFollowing
                          ? "bg-muted text-foreground"
                          : "bg-indigo-600 hover:bg-indigo-700"
                      }
                    >
                      {isFollowing ? (
                        <>
                          <UserCheck className="w-4 h-4 mr-1" />
                          Following
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 mr-1" />
                          Follow
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowMessageModal(true)}
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Message
                    </Button>
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowMoreMenu(!showMoreMenu)}
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </Button>
                      <AnimatePresence>
                        {showMoreMenu && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute right-0 top-full mt-2 w-48 bg-card rounded-lg shadow-lg border py-1 z-10"
                          >
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted">
                              <Share2 className="w-4 h-4" />
                              Share Profile
                            </button>
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted">
                              <Flag className="w-4 h-4" />
                              Report
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                {member.fieldOfStudy && (
                  <p className="mt-4 text-muted-foreground">
                    Researcher in {member.fieldOfStudy}
                    {member.institution ? ` at ${member.institution}` : ""}.
                  </p>
                )}

                {/* Links */}
                <div className="flex items-center gap-4 mt-4 flex-wrap">
                  {member.email && (
                    <button
                      onClick={handleCopyEmail}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-indigo-600"
                    >
                      <Mail className="w-4 h-4" />
                      {copiedEmail ? "Copied!" : member.email}
                      {!copiedEmail && <Copy className="w-3 h-3" />}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-6 pt-6 border-t">
              <StatTile label="Papers" value={0} icon={FileText} />
              <StatTile label="Collections" value={member._count?.memberships ?? 0} icon={BookOpen} />
              <StatTile label="Workspaces" value={member._count?.memberships ?? 0} icon={Users} />
              <StatTile label="Joined" value={new Date(member.createdAt).getFullYear()} icon={Clock} />
              <StatTile label="Role" value={member.role} icon={Award} />
              <StatTile label="Status" value="Active" icon={Activity} />
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t">
            <div className="flex">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-4 text-sm font-medium text-center border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tab Content */}
        <div className="mt-6 mb-8">
          <AnimatePresence mode="wait">
            {activeTab === "papers" && (
              <motion.div
                key="papers"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div className="bg-card rounded-xl border p-12 text-center text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Papers will appear here</p>
                </div>
              </motion.div>
            )}

            {activeTab === "collections" && (
              <motion.div
                key="collections"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                <div className="bg-card rounded-xl border p-6 text-center text-muted-foreground col-span-full">
                  <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Collections will appear here</p>
                </div>
              </motion.div>
            )}

            {activeTab === "activity" && (
              <motion.div
                key="activity"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-card rounded-xl border overflow-hidden"
              >
                <div className="divide-y">
                  <div className="p-12 text-center text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Activity feed will appear here</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Message Modal */}
      <AnimatePresence>
        {showMessageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowMessageModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-xl border w-full max-w-lg p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold mb-4">
                Send Message to {name}
              </h3>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message…"
                rows={4}
                className="w-full px-4 py-3 bg-muted border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex justify-end gap-3 mt-4">
                <Button variant="outline" onClick={() => setShowMessageModal(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => {
                    setShowMessageModal(false);
                    setMessage("");
                  }}
                >
                  <Send className="w-4 h-4 mr-1" />
                  Send Message
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatTile({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number | string;
  icon: any;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <div className="flex items-center justify-center mb-1">
        <Icon className="w-4 h-4 text-muted-foreground mr-1" />
        <span className="text-xl font-bold">
          {typeof value === "number" ? value.toLocaleString() : value}
        </span>
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
    </motion.div>
  );
}
