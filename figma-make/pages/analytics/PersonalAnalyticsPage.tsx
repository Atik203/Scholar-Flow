"use client";

import { motion } from "motion/react";
import {
  ArrowDown,
  ArrowUp,
  Award,
  BarChart3,
  BookOpen,
  ChevronDown,
  Clock,
  Download,
  Eye,
  Flame,
  Medal,
  MessageSquare,
  PenTool,
  Play,
  Share2,
  Sparkles,
  Star,
  Target,
  Timer,
  TrendingDown,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import { useState } from "react";

import { useRole, type UserRole } from "../../components/context";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

interface PersonalAnalyticsPageProps {
  onNavigate: (path: string) => void;
  role?: UserRole;
}

interface ActivityData {
  day: string;
  papers: number;
  annotations: number;
  discussions: number;
}

interface TopPaper {
  id: string;
  title: string;
  views: number;
  citations: number;
  annotations: number;
  trend: "up" | "down" | "stable";
}

const mockWeeklyActivity: ActivityData[] = [
  { day: "Mon", papers: 3, annotations: 12, discussions: 5 },
  { day: "Tue", papers: 2, annotations: 8, discussions: 3 },
  { day: "Wed", papers: 5, annotations: 15, discussions: 8 },
  { day: "Thu", papers: 1, annotations: 6, discussions: 2 },
  { day: "Fri", papers: 4, annotations: 18, discussions: 6 },
  { day: "Sat", papers: 2, annotations: 4, discussions: 1 },
  { day: "Sun", papers: 1, annotations: 3, discussions: 0 },
];

const mockTopPapers: TopPaper[] = [
  {
    id: "1",
    title: "Deep Learning for Natural Language Processing",
    views: 1250,
    citations: 45,
    annotations: 23,
    trend: "up",
  },
  {
    id: "2",
    title: "Quantum Computing: A Survey",
    views: 890,
    citations: 32,
    annotations: 18,
    trend: "up",
  },
  {
    id: "3",
    title: "Climate Change Modeling with ML",
    views: 654,
    citations: 28,
    annotations: 15,
    trend: "stable",
  },
  {
    id: "4",
    title: "Blockchain in Healthcare",
    views: 432,
    citations: 15,
    annotations: 8,
    trend: "down",
  },
  {
    id: "5",
    title: "Neural Network Architectures",
    views: 321,
    citations: 12,
    annotations: 6,
    trend: "up",
  },
];

const mockReadingStreak = [
  true,
  true,
  true,
  false,
  true,
  true,
  true,
  true,
  true,
  false,
  true,
  true,
  true,
  true,
  false,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  false,
];

const mockProductivityHours = [
  { hour: "6AM", value: 5 },
  { hour: "8AM", value: 25 },
  { hour: "10AM", value: 85 },
  { hour: "12PM", value: 45 },
  { hour: "2PM", value: 90 },
  { hour: "4PM", value: 75 },
  { hour: "6PM", value: 40 },
  { hour: "8PM", value: 30 },
  { hour: "10PM", value: 15 },
];

// Reading time tracking data
interface ReadingTimeData {
  today: number; // minutes
  thisWeek: number;
  thisMonth: number;
  weeklyGoal: number;
  dailyAverage: number;
  weeklyData: { day: string; minutes: number }[];
}

const mockReadingTime: ReadingTimeData = {
  today: 47,
  thisWeek: 285,
  thisMonth: 1240,
  weeklyGoal: 420, // 7 hours
  dailyAverage: 41,
  weeklyData: [
    { day: "Mon", minutes: 45 },
    { day: "Tue", minutes: 32 },
    { day: "Wed", minutes: 68 },
    { day: "Thu", minutes: 25 },
    { day: "Fri", minutes: 55 },
    { day: "Sat", minutes: 13 },
    { day: "Sun", minutes: 47 },
  ],
};

// Achievement badges
interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: "trophy" | "medal" | "star" | "award" | "flame" | "zap";
  color: string;
  earnedAt?: string;
  progress?: number;
  isUnlocked: boolean;
  rarity: "common" | "rare" | "epic" | "legendary";
}

const mockAchievements: Achievement[] = [
  {
    id: "a1",
    name: "Paper Pioneer",
    description: "Read your first 10 papers",
    icon: "trophy",
    color: "from-amber-400 to-amber-600",
    earnedAt: "2024-01-10",
    isUnlocked: true,
    rarity: "common",
  },
  {
    id: "a2",
    name: "Annotation Master",
    description: "Create 100 annotations",
    icon: "medal",
    color: "from-emerald-400 to-emerald-600",
    earnedAt: "2024-01-15",
    isUnlocked: true,
    rarity: "rare",
  },
  {
    id: "a3",
    name: "Streak Champion",
    description: "Maintain a 14-day reading streak",
    icon: "flame",
    color: "from-orange-400 to-red-500",
    earnedAt: "2024-01-08",
    isUnlocked: true,
    rarity: "rare",
  },
  {
    id: "a4",
    name: "Knowledge Sharer",
    description: "Participate in 50 discussions",
    icon: "star",
    color: "from-blue-400 to-indigo-600",
    progress: 46,
    isUnlocked: false,
    rarity: "epic",
  },
  {
    id: "a5",
    name: "Deep Diver",
    description: "Read papers for 100 hours total",
    icon: "zap",
    color: "from-purple-400 to-pink-500",
    progress: 78,
    isUnlocked: false,
    rarity: "legendary",
  },
  {
    id: "a6",
    name: "Speed Reader",
    description: "Read 5 papers in a single day",
    icon: "award",
    color: "from-cyan-400 to-teal-500",
    progress: 80,
    isUnlocked: false,
    rarity: "epic",
  },
];

const achievementIcons: Record<Achievement["icon"], React.ReactNode> = {
  trophy: <Trophy className="h-5 w-5" />,
  medal: <Medal className="h-5 w-5" />,
  star: <Star className="h-5 w-5" />,
  award: <Award className="h-5 w-5" />,
  flame: <Flame className="h-5 w-5" />,
  zap: <Zap className="h-5 w-5" />,
};

const rarityColors: Record<Achievement["rarity"], string> = {
  common: "border-slate-300 dark:border-slate-600",
  rare: "border-blue-400 dark:border-blue-500",
  epic: "border-purple-400 dark:border-purple-500",
  legendary: "border-amber-400 dark:border-amber-500",
};

const defaultUser = {
  name: "John Researcher",
  email: "john@research.edu",
  role: "pro_researcher" as const,
};

export function PersonalAnalyticsPage({
  onNavigate,
  role: propRole,
}: PersonalAnalyticsPageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const user = { ...defaultUser, role: effectiveRole };

  const [dateRange, setDateRange] = useState("month");
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  const [isReadingActive, setIsReadingActive] = useState(false);
  const [currentReadingTime, setCurrentReadingTime] = useState(0);

  // Format minutes to hours and minutes
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Calculate weekly goal progress
  const weeklyProgress =
    (mockReadingTime.thisWeek / mockReadingTime.weeklyGoal) * 100;

  // Count achievements
  const unlockedAchievements = mockAchievements.filter((a) => a.isUnlocked);
  const lockedAchievements = mockAchievements.filter((a) => !a.isUnlocked);

  const stats = [
    {
      label: "Papers Read",
      value: 48,
      change: "+12",
      trend: "up",
      icon: <BookOpen className="h-5 w-5" />,
      color: "from-blue-500 to-indigo-600",
    },
    {
      label: "Annotations Made",
      value: 156,
      change: "+34",
      trend: "up",
      icon: <PenTool className="h-5 w-5" />,
      color: "from-emerald-500 to-teal-600",
    },
    {
      label: "Discussions",
      value: 23,
      change: "+8",
      trend: "up",
      icon: <MessageSquare className="h-5 w-5" />,
      color: "from-purple-500 to-violet-600",
    },
    {
      label: "Reading Streak",
      value: "7 days",
      change: "Current",
      trend: "neutral",
      icon: <Flame className="h-5 w-5" />,
      color: "from-orange-500 to-red-600",
    },
  ];

  const goals = [
    { label: "Weekly Reading Goal", current: 5, target: 7, unit: "papers" },
    {
      label: "Monthly Annotations",
      current: 156,
      target: 200,
      unit: "annotations",
    },
    { label: "Collaboration Score", current: 78, target: 100, unit: "points" },
  ];

  const maxActivityValue = Math.max(
    ...mockWeeklyActivity.flatMap((d) => [
      d.papers,
      d.annotations,
      d.discussions,
    ])
  );

  return (
    <DashboardLayout user={user} onNavigate={onNavigate}>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25">
              <BarChart3 className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Personal Analytics
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Track your research productivity and engagement
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700
                         bg-white dark:bg-slate-800 text-slate-900 dark:text-white
                         focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="week">Last 7 days</option>
                <option value="month">Last 30 days</option>
                <option value="quarter">Last 3 months</option>
                <option value="year">This year</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white
                           hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/25"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700
                       hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.color} text-white`}
                >
                  {stat.icon}
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-medium
                  ${stat.trend === "up" ? "text-emerald-500" : stat.trend === "down" ? "text-red-500" : "text-slate-500"}`}
                >
                  {stat.trend === "up" && <TrendingUp className="h-3 w-3" />}
                  {stat.trend === "down" && (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {stat.change}
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {stat.value}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Reading Time Tracker & Achievement Badges */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Reading Time Tracker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 text-white">
                  <Timer className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Reading Time
                  </h2>
                  <p className="text-sm text-slate-500">
                    Track your daily reading progress
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsReadingActive(!isReadingActive)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                  isReadingActive
                    ? "bg-red-100 dark:bg-red-900/30 text-red-600 hover:bg-red-200"
                    : "bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600 shadow-lg shadow-cyan-500/25"
                }`}
              >
                {isReadingActive ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    Stop
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Start Session
                  </>
                )}
              </button>
            </div>

            {/* Today's Reading */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {formatTime(mockReadingTime.today)}
                </p>
                <p className="text-xs text-slate-500">Today</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {formatTime(mockReadingTime.thisWeek)}
                </p>
                <p className="text-xs text-slate-500">This Week</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {formatTime(mockReadingTime.thisMonth)}
                </p>
                <p className="text-xs text-slate-500">This Month</p>
              </div>
            </div>

            {/* Weekly Goal Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Weekly Goal
                </span>
                <span className="text-sm text-slate-500">
                  {formatTime(mockReadingTime.thisWeek)} /{" "}
                  {formatTime(mockReadingTime.weeklyGoal)}
                </span>
              </div>
              <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(weeklyProgress, 100)}%` }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-teal-500"
                />
              </div>
            </div>

            {/* Weekly Chart */}
            <div className="flex items-end gap-2 h-20">
              {mockReadingTime.weeklyData.map((day, index) => {
                const maxMinutes = Math.max(
                  ...mockReadingTime.weeklyData.map((d) => d.minutes)
                );
                const height = (day.minutes / maxMinutes) * 100;
                return (
                  <div
                    key={day.day}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: 0.4 + index * 0.05, duration: 0.5 }}
                      className="w-full bg-gradient-to-t from-cyan-400 to-teal-300 rounded-t-md min-h-[4px]"
                      title={`${day.minutes} min`}
                    />
                    <span className="text-xs text-slate-500">{day.day}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Achievement Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Achievements
                  </h2>
                  <p className="text-sm text-slate-500">
                    {unlockedAchievements.length} of {mockAchievements.length}{" "}
                    unlocked
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAllAchievements(!showAllAchievements)}
                className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {showAllAchievements ? "Show Less" : "View All"}
              </button>
            </div>

            {/* Achievement Progress Bar */}
            <div className="mb-6">
              <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(unlockedAchievements.length / mockAchievements.length) * 100}%`,
                  }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                />
              </div>
            </div>

            {/* Achievement Grid */}
            <div className="grid grid-cols-3 gap-3">
              {(showAllAchievements
                ? mockAchievements
                : mockAchievements.slice(0, 6)
              ).map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className={`relative p-3 rounded-xl border-2 ${rarityColors[achievement.rarity]} ${
                    achievement.isUnlocked
                      ? "bg-white dark:bg-slate-700"
                      : "bg-slate-50 dark:bg-slate-800 opacity-60"
                  }`}
                >
                  <div
                    className={`w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center ${
                      achievement.isUnlocked
                        ? `bg-gradient-to-br ${achievement.color} text-white`
                        : "bg-slate-200 dark:bg-slate-600 text-slate-400"
                    }`}
                  >
                    {achievementIcons[achievement.icon]}
                  </div>
                  <p className="text-xs font-medium text-center text-slate-900 dark:text-white truncate">
                    {achievement.name}
                  </p>
                  {!achievement.isUnlocked && achievement.progress && (
                    <div className="mt-2">
                      <div className="h-1 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full"
                          style={{ width: `${achievement.progress}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-center text-slate-400 mt-1">
                        {achievement.progress}%
                      </p>
                    </div>
                  )}
                  {achievement.isUnlocked && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                      <Sparkles className="h-3 w-3 text-white" />
                    </div>
                  )}
                  {/* Rarity indicator */}
                  <div
                    className={`absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      achievement.rarity === "legendary"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                        : achievement.rarity === "epic"
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                          : achievement.rarity === "rare"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                    }`}
                  >
                    {achievement.rarity}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Weekly Activity Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Weekly Activity
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-500" />
                  <span className="text-xs text-slate-500">Papers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs text-slate-500">Annotations</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <span className="text-xs text-slate-500">Discussions</span>
                </div>
              </div>
            </div>

            <div className="flex items-end gap-4 h-48">
              {mockWeeklyActivity.map((day, index) => (
                <div
                  key={day.day}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <div className="w-full flex gap-1 items-end h-40">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{
                        height: `${(day.papers / maxActivityValue) * 100}%`,
                      }}
                      transition={{ delay: 0.3 + index * 0.05, duration: 0.5 }}
                      className="flex-1 bg-indigo-500 rounded-t-lg min-h-[4px]"
                    />
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{
                        height: `${(day.annotations / maxActivityValue) * 100}%`,
                      }}
                      transition={{ delay: 0.35 + index * 0.05, duration: 0.5 }}
                      className="flex-1 bg-emerald-500 rounded-t-lg min-h-[4px]"
                    />
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{
                        height: `${(day.discussions / maxActivityValue) * 100}%`,
                      }}
                      transition={{ delay: 0.4 + index * 0.05, duration: 0.5 }}
                      className="flex-1 bg-purple-500 rounded-t-lg min-h-[4px]"
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-500">
                    {day.day}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Reading Streak Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Reading Streak
              </h2>
              <div className="flex items-center gap-2 text-orange-500">
                <Flame className="h-5 w-5" />
                <span className="font-bold">7 days</span>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1.5 mb-4">
              {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                <div
                  key={i}
                  className="text-center text-xs font-medium text-slate-400"
                >
                  {day}
                </div>
              ))}
              {mockReadingStreak.map((active, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.02 }}
                  className={`aspect-square rounded-md ${
                    active
                      ? "bg-gradient-to-br from-orange-400 to-orange-600"
                      : "bg-slate-100 dark:bg-slate-700"
                  }`}
                />
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Longest streak</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  14 days
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-slate-500">Total active days</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  23 / 30
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Goals & Top Papers */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Goals Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <Target className="h-5 w-5 text-indigo-500" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Research Goals
              </h2>
            </div>

            <div className="space-y-5">
              {goals.map((goal, index) => {
                const percentage = Math.min(
                  (goal.current / goal.target) * 100,
                  100
                );
                return (
                  <motion.div
                    key={goal.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + index * 0.05 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {goal.label}
                      </span>
                      <span className="text-sm text-slate-500">
                        {goal.current} / {goal.target} {goal.unit}
                      </span>
                    </div>
                    <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: 0.4 + index * 0.1, duration: 0.8 }}
                        className={`h-full rounded-full ${
                          percentage >= 100
                            ? "bg-gradient-to-r from-emerald-400 to-emerald-600"
                            : percentage >= 70
                              ? "bg-gradient-to-r from-blue-400 to-indigo-600"
                              : "bg-gradient-to-r from-amber-400 to-orange-600"
                        }`}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                className="w-full py-2.5 rounded-xl text-indigo-600 dark:text-indigo-400 font-medium
                             hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
              >
                Set New Goals
              </button>
            </div>
          </motion.div>

          {/* Top Papers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500" />
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Top Papers
                </h2>
              </div>
              <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                View All
              </button>
            </div>

            <div className="space-y-4">
              {mockTopPapers.map((paper, index) => (
                <motion.div
                  key={paper.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <span className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-sm font-bold text-slate-600 dark:text-slate-400">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 dark:text-white truncate">
                      {paper.title}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" /> {paper.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Share2 className="h-3 w-3" /> {paper.citations}
                      </span>
                      <span className="flex items-center gap-1">
                        <PenTool className="h-3 w-3" /> {paper.annotations}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-1 ${
                      paper.trend === "up"
                        ? "text-emerald-500"
                        : paper.trend === "down"
                          ? "text-red-500"
                          : "text-slate-400"
                    }`}
                  >
                    {paper.trend === "up" && <ArrowUp className="h-4 w-4" />}
                    {paper.trend === "down" && (
                      <ArrowDown className="h-4 w-4" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Productivity Hours */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-indigo-500" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Peak Productivity Hours
              </h2>
            </div>
            <p className="text-sm text-slate-500">
              Best time:{" "}
              <span className="font-semibold text-indigo-600">
                2:00 PM - 4:00 PM
              </span>
            </p>
          </div>

          <div className="flex items-end gap-4 h-32">
            {mockProductivityHours.map((hour, index) => (
              <div
                key={hour.hour}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${hour.value}%` }}
                  transition={{ delay: 0.5 + index * 0.05, duration: 0.5 }}
                  className={`w-full rounded-t-lg ${
                    hour.value >= 80
                      ? "bg-gradient-to-t from-indigo-500 to-indigo-400"
                      : hour.value >= 50
                        ? "bg-gradient-to-t from-indigo-400 to-indigo-300"
                        : "bg-indigo-200 dark:bg-indigo-900/50"
                  }`}
                  style={{ minHeight: "8px" }}
                />
                <span className="text-xs text-slate-500 whitespace-nowrap">
                  {hour.hour}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 
                   border border-indigo-200 dark:border-indigo-800"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/50">
              <Zap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                AI Research Insights
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Based on your reading patterns, you're most productive in the
                early afternoon. Consider scheduling complex paper reviews
                between 2-4 PM. You've been focusing heavily on machine learning
                topics—explore interdisciplinary connections with healthcare
                research for potential collaboration opportunities.
              </p>
              <button className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                Get Personalized Recommendations →
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

export default PersonalAnalyticsPage;
