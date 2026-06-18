"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetTeamActivityQuery,
  useGetTeamActivitySummaryQuery,
  useGetTeamMembersQuery,
  useGetTeamStatsQuery,
  type TeamActivityItem,
  type TeamMember,
} from "@/redux/api/teamApi";
import { selectAccessToken } from "@/redux/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
import { AnimatePresence, motion } from "motion/react";
import {
  Activity,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  Crown,
  Download,
  Edit,
  ExternalLink,
  Eye,
  FileText,
  FolderOpen,
  Medal,
  MessageSquare,
  MoreHorizontal,
  RefreshCw,
  Search,
  Share2,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Trophy,
  Upload,
  UserMinus,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

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

const ACTIVITY_TYPES: { value: ActivityType | "all"; label: string }[] = [
  { value: "all", label: "All Activities" },
  { value: "paper_upload", label: "Uploads" },
  { value: "paper_edit", label: "Edits" },
  { value: "paper_share", label: "Shares" },
  { value: "collection_create", label: "Collections" },
  { value: "comment_add", label: "Comments" },
  { value: "member_join", label: "Members" },
  { value: "ai_insight", label: "AI Insights" },
];

const getActivityIcon = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes("paper_upload")) return Upload;
  if (t.includes("paper_view")) return Eye;
  if (t.includes("paper_edit")) return Edit;
  if (t.includes("paper_delete")) return FileText;
  if (t.includes("paper_share")) return Share2;
  if (t.includes("collection_create")) return FolderOpen;
  if (t.includes("collection_share")) return Share2;
  if (t.includes("member_join")) return UserPlus;
  if (t.includes("member_leave")) return UserMinus;
  if (t.includes("member_role")) return Users;
  if (t.includes("comment")) return MessageSquare;
  if (t.includes("annotation")) return FileText;
  if (t.includes("export")) return Download;
  if (t.includes("ai_insight")) return Sparkles;
  return Activity;
};

const getActivityColor = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes("paper_upload")) return "text-green-500 bg-green-500/20";
  if (t.includes("paper_view")) return "text-blue-500 bg-blue-500/20";
  if (t.includes("paper_edit")) return "text-yellow-500 bg-yellow-500/20";
  if (t.includes("paper_delete")) return "text-red-500 bg-red-500/20";
  if (t.includes("paper_share")) return "text-purple-500 bg-purple-500/20";
  if (t.includes("collection_create")) return "text-indigo-500 bg-indigo-500/20";
  if (t.includes("collection_share")) return "text-pink-500 bg-pink-500/20";
  if (t.includes("member_join")) return "text-emerald-500 bg-emerald-500/20";
  if (t.includes("member_leave")) return "text-gray-500 bg-gray-500/20";
  if (t.includes("comment")) return "text-blue-500 bg-blue-500/20";
  if (t.includes("annotation")) return "text-amber-500 bg-amber-500/20";
  if (t.includes("export")) return "text-teal-500 bg-teal-500/20";
  if (t.includes("ai_insight")) return "text-violet-500 bg-violet-500/20";
  return "text-gray-500 bg-gray-500/20";
};

const formatTimeAgo = (dateString: string) => {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateString).toLocaleDateString();
};

const getActivityDescription = (activity: TeamActivityItem) => {
  const target = activity.entityId ? (
    <span className="font-medium text-foreground">
      {activity.metadata?.title || activity.entityId.slice(0, 8)}
    </span>
  ) : null;
  const t = activity.action?.toLowerCase() || "";
  if (t.includes("upload") || activity.entity.toLowerCase() === "paper" && t.includes("create")) {
    return <>uploaded {target}</>;
  }
  if (t.includes("view")) return <>viewed {target}</>;
  if (t.includes("edit") || t.includes("update")) return <>updated {target}</>;
  if (t.includes("delete")) return <>deleted {target}</>;
  if (t.includes("share")) return <>shared {target}</>;
  if (t.includes("create") && activity.entity.toLowerCase() === "collection") {
    return <>created collection {target}</>;
  }
  if (t.includes("join")) return <>joined the team</>;
  if (t.includes("leave")) return <>left the team</>;
  if (t.includes("role")) return <>role changed</>;
  return <>{activity.action} {target}</>;
};

export default function TeamActivityPage() {
  const accessToken = useAppSelector(selectAccessToken);
  const shouldFetch = !!accessToken && accessToken.length > 0;

  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<ActivityType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeChartView, setActiveChartView] = useState<"bar" | "heatmap">("bar");

  const { data: activityData, isLoading, refetch } = useGetTeamActivityQuery(
    { limit: 50 },
    { skip: !shouldFetch }
  );
  const { data: summary } = useGetTeamActivitySummaryQuery({ days: 7 }, { skip: !shouldFetch });
  const { data: stats } = useGetTeamStatsQuery(undefined, { skip: !shouldFetch });
  const { data: membersData } = useGetTeamMembersQuery({ limit: 50 }, { skip: !shouldFetch });

  const activities = activityData?.result || [];
  const members: TeamMember[] = membersData?.data || [];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const filtered = activities.filter((a) => {
    if (selectedMember && a.userId !== selectedMember) return false;
    if (selectedType !== "all" && !a.action.toLowerCase().includes(selectedType.replace("_", ""))) {
      // simple type filter: just look at action/entity
      if (selectedType === "paper_upload" && a.entity !== "Paper") return false;
      if (selectedType === "collection_create" && a.entity !== "Collection") return false;
      // ... other filters via substring; lenient for now
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        a.user?.name?.toLowerCase().includes(q) ||
        a.entity.toLowerCase().includes(q) ||
        a.action.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl">
              <Activity className="h-6 w-6 text-white" />
            </div>
            Team Activity
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor your team&apos;s research activities and collaboration
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw
            className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")}
          />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Papers Uploaded"
          value={stats?.totalPapers ?? 0}
          subValue="All time"
          change={0}
          icon={FileText}
          color="purple"
        />
        <StatCard
          label="Comments & Discussions"
          value={summary?.totalActivities ?? 0}
          subValue="This week"
          change={0}
          icon={MessageSquare}
          color="blue"
        />
        <StatCard
          label="Active Members"
          value={`${stats?.activeMembers ?? 0}/${stats?.totalMembers ?? 0}`}
          subValue="Last 7 days"
          change={0}
          icon={Users}
          color="green"
        />
        <StatCard
          label="Activity Score"
          value={stats?.activityScore ?? 0}
          subValue="Engagement"
          change={0}
          icon={BarChart3}
          color="amber"
        />
      </div>

      {/* Main grid: Members sidebar + Activity feed */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Members Sidebar */}
        <div className="rounded-xl border bg-card p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-500" />
            Team Members
          </h3>
          <div className="space-y-2">
            <button
              onClick={() => setSelectedMember(null)}
              className={cn(
                "w-full flex items-center gap-3 p-2 rounded-lg transition-colors",
                selectedMember === null
                  ? "bg-purple-500/10 border border-purple-500/30"
                  : "hover:bg-muted"
              )}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white">
                <Users className="h-5 w-5" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-sm">All Members</p>
                <p className="text-xs text-muted-foreground">
                  {members.length} total
                </p>
              </div>
            </button>
            {members.slice(0, 10).map((member) => (
              <button
                key={member.id}
                onClick={() => setSelectedMember(member.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-2 rounded-lg transition-colors",
                  selectedMember === member.id
                    ? "bg-purple-500/10 border border-purple-500/30"
                    : "hover:bg-muted"
                )}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={member.image || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                    {member.name?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left min-w-0">
                  <p className="font-medium text-sm truncate">{member.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {member.email}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-3 rounded-xl border bg-card">
          <div className="p-4 border-b">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search activities…"
                  className="pl-10"
                />
              </div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as any)}
                className="h-10 px-3 rounded-md border bg-background text-sm"
              >
                {ACTIVITY_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="divide-y">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-12 text-center">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No activities found</p>
                <p className="text-muted-foreground text-sm">Try adjusting your filters</p>
              </div>
            ) : (
              <AnimatePresence>
                {filtered.map((activity, index) => {
                  const Icon = getActivityIcon(activity.entity + " " + activity.action);
                  const colorClass = getActivityColor(activity.entity + " " + activity.action);
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.02 }}
                      className="p-4 hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="relative shrink-0">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={activity.user?.image || undefined}
                            />
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-sm">
                              {activity.user?.name?.charAt(0) || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={cn(
                              "absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center",
                              colorClass
                            )}
                          >
                            <Icon className="h-2.5 w-2.5" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm">
                            <span className="font-medium">
                              {activity.user?.name || "Someone"}
                            </span>{" "}
                            {getActivityDescription(activity)}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTimeAgo(activity.createdAt)}
                            </span>
                            {activity.workspace && (
                              <span className="text-xs text-muted-foreground">
                                in {activity.workspace.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  subValue,
  change,
  icon: Icon,
  color,
}: {
  label: string;
  value: number | string;
  subValue: string;
  change: number;
  icon: any;
  color: "purple" | "blue" | "green" | "amber";
}) {
  const colorClasses = {
    purple: { bg: "bg-purple-500/20", text: "text-purple-500" },
    blue: { bg: "bg-blue-500/20", text: "text-blue-500" },
    green: { bg: "bg-green-500/20", text: "text-green-500" },
    amber: { bg: "bg-amber-500/20", text: "text-amber-500" },
  }[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border bg-card p-5"
    >
      <div className="flex items-start justify-between">
        <div className={cn("p-2 rounded-lg", colorClasses.bg)}>
          <Icon className={cn("h-5 w-5", colorClasses.text)} />
        </div>
        {change !== 0 && (
          <div
            className={cn(
              "flex items-center gap-1 text-xs font-medium",
              change > 0 ? "text-green-500" : "text-red-500"
            )}
          >
            {change > 0 ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-muted-foreground text-sm mt-1">{label}</p>
        <p className="text-muted-foreground text-xs mt-0.5">{subValue}</p>
      </div>
    </motion.div>
  );
}
