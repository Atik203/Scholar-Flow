"use client";

import {
  Activity,
  BarChart3,
  CheckCircle,
  ChevronDown,
  Clock,
  Download,
  Edit,
  ExternalLink,
  Eye,
  FileText,
  FolderOpen,
  MessageSquare,
  MoreHorizontal,
  RefreshCw,
  Search,
  Share2,
  Sparkles,
  Trash2,
  TrendingDown,
  TrendingUp,
  Upload,
  UserMinus,
  UserPlus,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useRole, type UserRole } from "../../components/context";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

// Activity types
type ActivityType =
  | "paper_upload"
  | "paper_view"
  | "paper_edit"
  | "paper_delete"
  | "paper_share"
  | "collection_create"
  | "collection_edit"
  | "collection_share"
  | "member_join"
  | "member_leave"
  | "member_role_change"
  | "comment_add"
  | "annotation_add"
  | "export"
  | "ai_insight";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  isOnline: boolean;
}

interface ActivityItem {
  id: string;
  type: ActivityType;
  user: TeamMember;
  target?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

// Mock team members
const mockMembers: TeamMember[] = [
  {
    id: "1",
    name: "Dr. Sarah Chen",
    email: "sarah.chen@university.edu",
    role: "Team Lead",
    isOnline: true,
  },
  {
    id: "2",
    name: "James Wilson",
    email: "j.wilson@research.org",
    role: "Researcher",
    isOnline: true,
  },
  {
    id: "3",
    name: "Emily Zhang",
    email: "emily.z@lab.edu",
    role: "Researcher",
    isOnline: false,
  },
  {
    id: "4",
    name: "Michael Park",
    email: "m.park@institute.com",
    role: "Pro Researcher",
    isOnline: true,
  },
  {
    id: "5",
    name: "Lisa Anderson",
    email: "l.anderson@uni.edu",
    role: "Researcher",
    isOnline: false,
  },
];

// Mock activity data
const mockActivities: ActivityItem[] = [
  {
    id: "1",
    type: "paper_upload",
    user: mockMembers[0],
    target: "Transformer Architecture Innovations 2024",
    targetId: "paper_123",
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    type: "comment_add",
    user: mockMembers[1],
    target: "Deep Learning Survey Paper",
    targetId: "paper_124",
    metadata: { commentPreview: "Great analysis of the attention mechanism!" },
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    type: "member_join",
    user: mockMembers[2],
    metadata: { invitedBy: "Dr. Sarah Chen" },
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    type: "collection_create",
    user: mockMembers[3],
    target: "Neural Networks Collection",
    targetId: "col_456",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    type: "paper_share",
    user: mockMembers[0],
    target: "Attention Is All You Need - Review",
    targetId: "paper_125",
    metadata: { sharedWith: "External Collaborators" },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "6",
    type: "ai_insight",
    user: mockMembers[1],
    target: "Research Gap Analysis",
    metadata: {
      insightType: "gap_analysis",
      paperCount: 15,
    },
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "7",
    type: "annotation_add",
    user: mockMembers[4],
    target: "Machine Learning Basics Paper",
    targetId: "paper_126",
    metadata: { annotationCount: 5 },
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "8",
    type: "export",
    user: mockMembers[3],
    target: "Q3 Research Report",
    metadata: { format: "PDF", pageCount: 45 },
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "9",
    type: "paper_edit",
    user: mockMembers[2],
    target: "NLP Advances Paper",
    targetId: "paper_127",
    metadata: { changes: ["Updated abstract", "Added references"] },
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "10",
    type: "member_role_change",
    user: mockMembers[0],
    target: "James Wilson",
    metadata: { oldRole: "Researcher", newRole: "Pro Researcher" },
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Team stats
const teamStats = {
  totalPapers: 156,
  papersThisWeek: 12,
  papersChange: 25,
  totalComments: 423,
  commentsThisWeek: 34,
  commentsChange: 15,
  activeMembers: 4,
  totalMembers: 5,
  activityScore: 87,
  activityChange: 12,
};

interface TeamActivityPageProps {
  onNavigate?: (path: string) => void;
  role?: UserRole;
}

export function TeamActivityPage({
  onNavigate,
  role: propRole,
}: TeamActivityPageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [timeRange, setTimeRange] = useState("7d");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const defaultUser = {
    name: "Dr. Sarah Chen",
    email: "sarah.chen@university.edu",
    role: "team_lead" as const,
  };
  const user = { ...defaultUser, role: effectiveRole };

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case "paper_upload":
        return Upload;
      case "paper_view":
        return Eye;
      case "paper_edit":
        return Edit;
      case "paper_delete":
        return Trash2;
      case "paper_share":
        return Share2;
      case "collection_create":
        return FolderOpen;
      case "collection_edit":
        return Edit;
      case "collection_share":
        return Share2;
      case "member_join":
        return UserPlus;
      case "member_leave":
        return UserMinus;
      case "member_role_change":
        return Users;
      case "comment_add":
        return MessageSquare;
      case "annotation_add":
        return FileText;
      case "export":
        return Download;
      case "ai_insight":
        return Sparkles;
      default:
        return Activity;
    }
  };

  const getActivityColor = (type: ActivityType) => {
    switch (type) {
      case "paper_upload":
        return "text-green-400 bg-green-500/20";
      case "paper_view":
        return "text-blue-400 bg-blue-500/20";
      case "paper_edit":
        return "text-yellow-400 bg-yellow-500/20";
      case "paper_delete":
        return "text-red-400 bg-red-500/20";
      case "paper_share":
        return "text-purple-400 bg-purple-500/20";
      case "collection_create":
        return "text-indigo-400 bg-indigo-500/20";
      case "collection_edit":
        return "text-orange-400 bg-orange-500/20";
      case "collection_share":
        return "text-pink-400 bg-pink-500/20";
      case "member_join":
        return "text-emerald-400 bg-emerald-500/20";
      case "member_leave":
        return "text-gray-400 bg-gray-500/20";
      case "member_role_change":
        return "text-cyan-400 bg-cyan-500/20";
      case "comment_add":
        return "text-blue-400 bg-blue-500/20";
      case "annotation_add":
        return "text-amber-400 bg-amber-500/20";
      case "export":
        return "text-teal-400 bg-teal-500/20";
      case "ai_insight":
        return "text-violet-400 bg-violet-500/20";
      default:
        return "text-gray-400 bg-gray-500/20";
    }
  };

  const getActivityDescription = (activity: ActivityItem) => {
    switch (activity.type) {
      case "paper_upload":
        return (
          <>
            uploaded{" "}
            <span className="text-white font-medium">{activity.target}</span>
          </>
        );
      case "paper_view":
        return (
          <>
            viewed{" "}
            <span className="text-white font-medium">{activity.target}</span>
          </>
        );
      case "paper_edit":
        return (
          <>
            edited{" "}
            <span className="text-white font-medium">{activity.target}</span>
          </>
        );
      case "paper_delete":
        return (
          <>
            deleted{" "}
            <span className="text-white font-medium">{activity.target}</span>
          </>
        );
      case "paper_share":
        return (
          <>
            shared{" "}
            <span className="text-white font-medium">{activity.target}</span>{" "}
            with {(activity.metadata?.sharedWith as string) || "team"}
          </>
        );
      case "collection_create":
        return (
          <>
            created collection{" "}
            <span className="text-white font-medium">{activity.target}</span>
          </>
        );
      case "collection_edit":
        return (
          <>
            updated collection{" "}
            <span className="text-white font-medium">{activity.target}</span>
          </>
        );
      case "collection_share":
        return (
          <>
            shared collection{" "}
            <span className="text-white font-medium">{activity.target}</span>
          </>
        );
      case "member_join":
        return (
          <>
            joined the team (invited by{" "}
            <span className="text-white font-medium">
              {(activity.metadata?.invitedBy as string) || "Admin"}
            </span>
            )
          </>
        );
      case "member_leave":
        return <>left the team</>;
      case "member_role_change":
        return (
          <>
            changed{" "}
            <span className="text-white font-medium">{activity.target}'s</span>{" "}
            role from {(activity.metadata?.oldRole as string) || "Member"} to{" "}
            <span className="text-purple-400">
              {(activity.metadata?.newRole as string) || "Admin"}
            </span>
          </>
        );
      case "comment_add":
        return (
          <>
            commented on{" "}
            <span className="text-white font-medium">{activity.target}</span>
          </>
        );
      case "annotation_add":
        return (
          <>
            added {(activity.metadata?.annotationCount as number) || 1}{" "}
            annotation(s) to{" "}
            <span className="text-white font-medium">{activity.target}</span>
          </>
        );
      case "export":
        return (
          <>
            exported{" "}
            <span className="text-white font-medium">{activity.target}</span> as{" "}
            {(activity.metadata?.format as string) || "PDF"}
          </>
        );
      case "ai_insight":
        return (
          <>
            generated AI insight:{" "}
            <span className="text-white font-medium">{activity.target}</span>
          </>
        );
      default:
        return <>performed an action</>;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return then.toLocaleDateString();
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  const filteredActivities = mockActivities.filter((activity) => {
    if (selectedMember && activity.user.id !== selectedMember) return false;
    if (selectedType !== "all" && activity.type !== selectedType) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        activity.target?.toLowerCase().includes(query) ||
        activity.user.name.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const activityTypes = [
    { value: "all", label: "All Activities" },
    { value: "paper_upload", label: "Uploads" },
    { value: "paper_edit", label: "Edits" },
    { value: "paper_share", label: "Shares" },
    { value: "collection_create", label: "Collections" },
    { value: "comment_add", label: "Comments" },
    { value: "member_join", label: "Members" },
    { value: "ai_insight", label: "AI Insights" },
  ];

  return (
    <DashboardLayout user={user} onNavigate={onNavigate}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl">
                    <Activity className="h-6 w-6" />
                  </div>
                  Team Activity
                </h1>
                <p className="text-gray-400 mt-2">
                  Monitor your team's research activities and collaboration
                </p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              {
                label: "Papers Uploaded",
                value: teamStats.totalPapers,
                subValue: `+${teamStats.papersThisWeek} this week`,
                change: teamStats.papersChange,
                icon: FileText,
                color: "purple",
              },
              {
                label: "Comments & Discussions",
                value: teamStats.totalComments,
                subValue: `+${teamStats.commentsThisWeek} this week`,
                change: teamStats.commentsChange,
                icon: MessageSquare,
                color: "blue",
              },
              {
                label: "Active Members",
                value: `${teamStats.activeMembers}/${teamStats.totalMembers}`,
                subValue: "Currently online",
                change: 0,
                icon: Users,
                color: "green",
              },
              {
                label: "Activity Score",
                value: teamStats.activityScore,
                subValue: "Team engagement",
                change: teamStats.activityChange,
                icon: BarChart3,
                color: "amber",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-5"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`p-2 rounded-lg ${
                      stat.color === "purple"
                        ? "bg-purple-500/20"
                        : stat.color === "blue"
                          ? "bg-blue-500/20"
                          : stat.color === "green"
                            ? "bg-green-500/20"
                            : "bg-amber-500/20"
                    }`}
                  >
                    <stat.icon
                      className={`h-5 w-5 ${
                        stat.color === "purple"
                          ? "text-purple-400"
                          : stat.color === "blue"
                            ? "text-blue-400"
                            : stat.color === "green"
                              ? "text-green-400"
                              : "text-amber-400"
                      }`}
                    />
                  </div>
                  {stat.change !== 0 && (
                    <div
                      className={`flex items-center gap-1 text-xs font-medium ${
                        stat.change > 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {stat.change > 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {Math.abs(stat.change)}%
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {stat.subValue}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Team Members Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-400" />
                  Team Members
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedMember(null)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      selectedMember === null
                        ? "bg-purple-500/20 border border-purple-500/30"
                        : "hover:bg-white/5"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-white font-medium">All Members</p>
                      <p className="text-gray-400 text-xs">
                        {mockMembers.length} total
                      </p>
                    </div>
                  </button>
                  {mockMembers.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => setSelectedMember(member.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        selectedMember === member.id
                          ? "bg-purple-500/20 border border-purple-500/30"
                          : "hover:bg-white/5"
                      }`}
                    >
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-medium">
                          {member.name.charAt(0)}
                        </div>
                        <div
                          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-900 ${
                            member.isOnline ? "bg-green-500" : "bg-gray-500"
                          }`}
                        />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-white font-medium text-sm truncate">
                          {member.name}
                        </p>
                        <p className="text-gray-400 text-xs">{member.role}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Activity Feed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-3"
            >
              <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10">
                {/* Filters */}
                <div className="p-4 border-b border-white/10">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search activities..."
                        className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      />
                    </div>
                    <div className="relative">
                      <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="appearance-none px-4 py-2 pr-10 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      >
                        {activityTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                    <div className="relative">
                      <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="appearance-none px-4 py-2 pr-10 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      >
                        <option value="24h">Last 24 Hours</option>
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                        <option value="all">All Time</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Activity List */}
                <div className="divide-y divide-white/5">
                  <AnimatePresence>
                    {filteredActivities.length === 0 ? (
                      <div className="py-12 text-center">
                        <Activity className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400">No activities found</p>
                        <p className="text-gray-500 text-sm">
                          Try adjusting your filters
                        </p>
                      </div>
                    ) : (
                      filteredActivities.map((activity, index) => {
                        const Icon = getActivityIcon(activity.type);
                        const colorClass = getActivityColor(activity.type);

                        return (
                          <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-4 hover:bg-white/5 transition-colors group"
                          >
                            <div className="flex items-start gap-4">
                              <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-medium">
                                  {activity.user.name.charAt(0)}
                                </div>
                                <div
                                  className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ${colorClass}`}
                                >
                                  <Icon className="h-2.5 w-2.5" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-gray-300 text-sm">
                                  <span className="text-white font-medium">
                                    {activity.user.name}
                                  </span>{" "}
                                  {getActivityDescription(activity)}
                                </p>
                                {activity.metadata?.commentPreview && (
                                  <p className="mt-1 text-gray-500 text-sm italic truncate">
                                    "
                                    {activity.metadata.commentPreview as string}
                                    "
                                  </p>
                                )}
                                {activity.metadata?.changes && (
                                  <div className="mt-2 flex flex-wrap gap-1">
                                    {(
                                      activity.metadata.changes as string[]
                                    ).map((change, i) => (
                                      <span
                                        key={i}
                                        className="inline-flex items-center px-2 py-0.5 bg-white/5 rounded text-xs text-gray-400"
                                      >
                                        <CheckCircle className="h-3 w-3 mr-1 text-green-400" />
                                        {change}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                <div className="flex items-center gap-4 mt-2">
                                  <span className="text-gray-500 text-xs flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {formatTimeAgo(activity.timestamp)}
                                  </span>
                                  {activity.targetId && (
                                    <button
                                      onClick={() =>
                                        onNavigate?.(
                                          `/${
                                            activity.type.includes("collection")
                                              ? "collections"
                                              : "papers"
                                          }/${activity.targetId}`
                                        )
                                      }
                                      className="text-purple-400 text-xs hover:text-purple-300 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      View details
                                      <ExternalLink className="h-3 w-3" />
                                    </button>
                                  )}
                                </div>
                              </div>
                              <button className="p-1 text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal className="h-4 w-4" />
                              </button>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </AnimatePresence>
                </div>

                {/* Load More */}
                {filteredActivities.length > 0 && (
                  <div className="p-4 border-t border-white/10 text-center">
                    <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
                      Load More Activities
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default TeamActivityPage;
