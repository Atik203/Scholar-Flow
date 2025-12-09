"use client";

import {
  AlertCircle,
  ArrowLeft,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  Link2,
  Link2Off,
  Loader2,
  Puzzle,
  RefreshCw,
  Search,
  Settings2,
  Shield,
  Sparkles,
  Unplug,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useRole, type UserRole } from "../../components/context";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

interface IntegrationsSettingsPageProps {
  onNavigate: (path: string) => void;
  role?: UserRole;
}

// Mock user for DashboardLayout
const defaultUser = {
  name: "Dr. Sarah Chen",
  email: "sarah.chen@university.edu",
  image: undefined,
  role: "researcher" as const,
};

// Integration types
interface Integration {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  icon: string;
  color: string;
  bgColor: string;
  category:
    | "reference-manager"
    | "search"
    | "repository"
    | "productivity"
    | "writing"
    | "communication";
  status: "connected" | "available" | "coming-soon";
  features: string[];
  lastSync?: string;
  syncStatus?: "synced" | "syncing" | "error";
  itemCount?: number;
  permissions?: string[];
  website?: string;
}

const integrations: Integration[] = [
  {
    id: "zotero",
    name: "Zotero",
    description: "Free, open-source reference manager",
    longDescription:
      "Sync your entire Zotero library including papers, annotations, and tags. Two-way sync keeps everything up to date.",
    icon: "📚",
    color: "from-red-500 to-rose-600",
    bgColor: "bg-red-500/10",
    category: "reference-manager",
    status: "connected",
    features: [
      "Two-way sync",
      "Folder preservation",
      "Tag import",
      "Annotations sync",
      "Batch import",
    ],
    lastSync: "2 minutes ago",
    syncStatus: "synced",
    itemCount: 1247,
    permissions: ["Read library", "Write annotations", "Manage folders"],
    website: "https://zotero.org",
  },
  {
    id: "mendeley",
    name: "Mendeley",
    description: "Academic social network & reference manager",
    longDescription:
      "Import your Mendeley library with all annotations and highlights. Sync groups and collaborative collections.",
    icon: "📖",
    color: "from-red-600 to-orange-500",
    bgColor: "bg-orange-500/10",
    category: "reference-manager",
    status: "available",
    features: [
      "Full library import",
      "PDF annotations",
      "Groups sync",
      "Citation styles",
      "Social features",
    ],
    website: "https://mendeley.com",
  },
  {
    id: "endnote",
    name: "EndNote",
    description: "Professional reference management",
    longDescription:
      "Transfer your EndNote database with smart groups, custom fields, and citation styles preserved.",
    icon: "📝",
    color: "from-blue-600 to-blue-500",
    bgColor: "bg-blue-500/10",
    category: "reference-manager",
    status: "available",
    features: [
      "XML import",
      "Citation styles",
      "Smart groups",
      "Custom fields",
      "Library sharing",
    ],
    website: "https://endnote.com",
  },
  {
    id: "google-scholar",
    name: "Google Scholar",
    description: "Search academic literature",
    longDescription:
      "Search and import papers directly from Google Scholar. Get citation metrics and discover related research.",
    icon: "🎓",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-cyan-500/10",
    category: "search",
    status: "connected",
    features: [
      "One-click save",
      "Citation metrics",
      "Related papers",
      "Author profiles",
      "Alerts",
    ],
    lastSync: "Live",
    syncStatus: "synced",
    itemCount: 89,
    permissions: ["Search access"],
    website: "https://scholar.google.com",
  },
  {
    id: "semantic-scholar",
    name: "Semantic Scholar",
    description: "AI-powered research discovery",
    longDescription:
      "Get AI-powered paper recommendations based on your research interests. Explore citation graphs and author networks.",
    icon: "🧠",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/10",
    category: "search",
    status: "connected",
    features: [
      "AI recommendations",
      "Citation graphs",
      "Author profiles",
      "Research feeds",
      "API access",
    ],
    lastSync: "5 minutes ago",
    syncStatus: "synced",
    itemCount: 156,
    permissions: ["Read recommendations", "Access API"],
    website: "https://semanticscholar.org",
  },
  {
    id: "arxiv",
    name: "arXiv",
    description: "Open-access preprint repository",
    longDescription:
      "Direct import from arXiv preprints with automatic metadata extraction and version tracking.",
    icon: "📄",
    color: "from-red-500 to-red-600",
    bgColor: "bg-red-500/10",
    category: "repository",
    status: "available",
    features: [
      "Auto-import",
      "Version tracking",
      "Categories",
      "Daily alerts",
      "API access",
    ],
    website: "https://arxiv.org",
  },
  {
    id: "pubmed",
    name: "PubMed",
    description: "Biomedical literature database",
    longDescription:
      "Search and import from the world's largest biomedical literature database. Get MESH terms and abstracts.",
    icon: "🏥",
    color: "from-blue-600 to-indigo-600",
    bgColor: "bg-indigo-500/10",
    category: "repository",
    status: "available",
    features: [
      "MESH terms",
      "Abstracts",
      "Full-text links",
      "Clinical trials",
      "Alerts",
    ],
    website: "https://pubmed.ncbi.nlm.nih.gov",
  },
  {
    id: "notion",
    name: "Notion",
    description: "All-in-one workspace",
    longDescription:
      "Export your research notes and summaries to Notion. Create databases and link to your papers.",
    icon: "📋",
    color: "from-gray-700 to-gray-900",
    bgColor: "bg-gray-500/10",
    category: "productivity",
    status: "coming-soon",
    features: [
      "Database sync",
      "Rich text export",
      "Templates",
      "Linked databases",
      "API access",
    ],
    website: "https://notion.so",
  },
  {
    id: "slack",
    name: "Slack",
    description: "Team communication platform",
    longDescription:
      "Share papers and insights with your team directly in Slack. Get notifications for new papers and comments.",
    icon: "💬",
    color: "from-purple-600 to-pink-500",
    bgColor: "bg-pink-500/10",
    category: "communication",
    status: "coming-soon",
    features: [
      "Paper sharing",
      "Notifications",
      "Bot commands",
      "Channel integration",
      "Search",
    ],
    website: "https://slack.com",
  },
  {
    id: "overleaf",
    name: "Overleaf",
    description: "Online LaTeX editor",
    longDescription:
      "Insert citations directly into your LaTeX documents. Auto-generate BibTeX and keep references in sync.",
    icon: "🍃",
    color: "from-green-600 to-green-500",
    bgColor: "bg-green-500/10",
    category: "writing",
    status: "coming-soon",
    features: [
      "BibTeX export",
      "Citation insert",
      "Auto-format",
      "Project sync",
      "Templates",
    ],
    website: "https://overleaf.com",
  },
  {
    id: "ms-word",
    name: "Microsoft Word",
    description: "Document processing",
    longDescription:
      "Insert citations and generate bibliographies directly in Word. Support for all major citation styles.",
    icon: "📘",
    color: "from-blue-600 to-blue-700",
    bgColor: "bg-blue-600/10",
    category: "writing",
    status: "available",
    features: [
      "Citation insert",
      "Bibliography",
      "Style formatting",
      "Add-in support",
      "Real-time sync",
    ],
    website: "https://microsoft.com/word",
  },
  {
    id: "google-docs",
    name: "Google Docs",
    description: "Collaborative document editing",
    longDescription:
      "Cite papers and create bibliographies in Google Docs. Collaborate with your team in real-time.",
    icon: "📝",
    color: "from-blue-500 to-green-500",
    bgColor: "bg-emerald-500/10",
    category: "writing",
    status: "available",
    features: [
      "Citation insert",
      "Bibliography",
      "Collaboration",
      "Add-on support",
      "Templates",
    ],
    website: "https://docs.google.com",
  },
];

const categories = [
  { id: "all", label: "All", icon: Puzzle },
  { id: "reference-manager", label: "References", icon: Link2 },
  { id: "search", label: "Search", icon: Search },
  { id: "repository", label: "Repos", icon: Sparkles },
  { id: "writing", label: "Writing", icon: Settings2 },
  { id: "productivity", label: "Tools", icon: Zap },
];

// Connection history
interface ConnectionLog {
  id: string;
  integration: string;
  action: "connected" | "disconnected" | "synced" | "error";
  timestamp: string;
  details?: string;
}

const connectionHistory: ConnectionLog[] = [
  {
    id: "1",
    integration: "Zotero",
    action: "synced",
    timestamp: "2 minutes ago",
    details: "1,247 items synced",
  },
  {
    id: "2",
    integration: "Semantic Scholar",
    action: "synced",
    timestamp: "5 minutes ago",
    details: "156 recommendations updated",
  },
  {
    id: "3",
    integration: "Google Scholar",
    action: "connected",
    timestamp: "1 hour ago",
  },
  {
    id: "4",
    integration: "Mendeley",
    action: "disconnected",
    timestamp: "2 days ago",
  },
];

export const IntegrationsSettingsPage: React.FC<
  IntegrationsSettingsPageProps
> = ({ onNavigate }) => {
  const { role } = useRole();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedIntegration, setSelectedIntegration] =
    useState<Integration | null>(null);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState<
    string | null
  >(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState<string | null>(null);

  // Filter integrations
  const filteredIntegrations = integrations.filter((integration) => {
    const matchesSearch =
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || integration.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Stats
  const connectedCount = integrations.filter(
    (i) => i.status === "connected"
  ).length;
  const availableCount = integrations.filter(
    (i) => i.status === "available"
  ).length;
  const comingSoonCount = integrations.filter(
    (i) => i.status === "coming-soon"
  ).length;

  // Handle connect
  const handleConnect = (integration: Integration) => {
    setSelectedIntegration(integration);
    setShowConnectModal(true);
  };

  // Handle confirm connect
  const handleConfirmConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setShowConnectModal(false);
      setSelectedIntegration(null);
    }, 2000);
  };

  // Handle sync
  const handleSync = (integrationId: string) => {
    setIsSyncing(integrationId);
    setTimeout(() => {
      setIsSyncing(null);
    }, 2000);
  };

  // Handle disconnect
  const handleDisconnect = (integrationId: string) => {
    setShowDisconnectConfirm(integrationId);
  };

  return (
    <DashboardLayout
      user={defaultUser}
      onNavigate={onNavigate}
      currentPath="/settings/integrations"
    >
      <div className="min-h-screen bg-gradient-to-b from-background via-muted/5 to-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            {/* Back button */}
            <button
              onClick={() => onNavigate("/settings")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Settings</span>
            </button>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-chart-1/20 border border-primary/20">
                    <Puzzle className="h-6 w-6 text-primary" />
                  </div>
                  <h1 className="text-3xl font-bold">Integrations</h1>
                </div>
                <p className="text-muted-foreground">
                  Connect your favorite tools and sync your research seamlessly
                </p>
              </div>

              {/* Quick stats */}
              <div className="flex gap-4">
                <div className="px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">
                      {connectedCount} Connected
                    </span>
                  </div>
                </div>
                <div className="px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <div className="flex items-center gap-2">
                    <Link2 className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">
                      {availableCount} Available
                    </span>
                  </div>
                </div>
                <div className="px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-500" />
                    <span className="text-sm font-medium">
                      {comingSoonCount} Coming Soon
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Search and Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search integrations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                />
              </div>

              {/* Category filter */}
              <div className="flex gap-1.5 overflow-x-auto pb-2 lg:pb-0">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                      activeCategory === category.id
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                        : "bg-card border border-border hover:border-primary/30"
                    }`}
                  >
                    <category.icon className="h-3.5 w-3.5" />
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Connected Integrations Section */}
          {filteredIntegrations.some((i) => i.status === "connected") && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-10"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </div>
                <h2 className="text-xl font-semibold">Connected</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredIntegrations
                  .filter((i) => i.status === "connected")
                  .map((integration, index) => (
                    <motion.div
                      key={integration.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="group relative"
                    >
                      <div className="relative p-6 rounded-2xl bg-card border border-border hover:border-green-500/30 hover:shadow-xl hover:shadow-green-500/5 transition-all duration-300">
                        {/* Status indicator */}
                        <div className="absolute top-4 right-4 flex items-center gap-2">
                          {integration.syncStatus === "syncing" ||
                          isSyncing === integration.id ? (
                            <span className="flex items-center gap-1.5 text-xs text-blue-500">
                              <Loader2 className="h-3 w-3 animate-spin" />
                              Syncing...
                            </span>
                          ) : integration.syncStatus === "error" ? (
                            <span className="flex items-center gap-1.5 text-xs text-red-500">
                              <AlertCircle className="h-3 w-3" />
                              Error
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-xs text-green-500">
                              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                              Connected
                            </span>
                          )}
                        </div>

                        {/* Icon and Name */}
                        <div className="flex items-start gap-4 mb-4">
                          <div
                            className={`p-3 rounded-xl ${integration.bgColor}`}
                          >
                            <span className="text-3xl">{integration.icon}</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">
                              {integration.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {integration.description}
                            </p>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4 mb-4 text-sm">
                          {integration.itemCount && (
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Sparkles className="h-4 w-4" />
                              <span>
                                {integration.itemCount.toLocaleString()} items
                              </span>
                            </div>
                          )}
                          {integration.lastSync && (
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>Synced {integration.lastSync}</span>
                            </div>
                          )}
                        </div>

                        {/* Features */}
                        <div className="flex flex-wrap gap-2 mb-5">
                          {integration.features.slice(0, 3).map((feature) => (
                            <span
                              key={feature}
                              className="px-2.5 py-1 rounded-lg bg-muted/50 text-xs font-medium"
                            >
                              {feature}
                            </span>
                          ))}
                          {integration.features.length > 3 && (
                            <span className="px-2.5 py-1 rounded-lg bg-muted/50 text-xs font-medium text-muted-foreground">
                              +{integration.features.length - 3} more
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSync(integration.id)}
                            disabled={isSyncing === integration.id}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium text-sm disabled:opacity-50"
                          >
                            <RefreshCw
                              className={`h-4 w-4 ${isSyncing === integration.id ? "animate-spin" : ""}`}
                            />
                            {isSyncing === integration.id
                              ? "Syncing..."
                              : "Sync Now"}
                          </button>
                          <button
                            onClick={() => setSelectedIntegration(integration)}
                            className="p-2.5 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                          >
                            <Settings2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDisconnect(integration.id)}
                            className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                          >
                            <Unplug className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          )}

          {/* Available Integrations Section */}
          {filteredIntegrations.some((i) => i.status === "available") && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-10"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Link2 className="h-5 w-5 text-blue-500" />
                </div>
                <h2 className="text-xl font-semibold">Available</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredIntegrations
                  .filter((i) => i.status === "available")
                  .map((integration, index) => (
                    <motion.div
                      key={integration.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="group"
                    >
                      <div className="relative p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300">
                        {/* Icon and Name */}
                        <div className="flex items-start gap-4 mb-4">
                          <div
                            className={`p-3 rounded-xl ${integration.bgColor} group-hover:scale-110 transition-transform`}
                          >
                            <span className="text-3xl">{integration.icon}</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">
                              {integration.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {integration.description}
                            </p>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {integration.longDescription}
                        </p>

                        {/* Features */}
                        <div className="flex flex-wrap gap-2 mb-5">
                          {integration.features.slice(0, 3).map((feature) => (
                            <span
                              key={feature}
                              className="px-2.5 py-1 rounded-lg bg-muted/50 text-xs font-medium"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>

                        {/* Connect button */}
                        <button
                          onClick={() => handleConnect(integration)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-chart-1 text-white font-medium hover:shadow-lg hover:shadow-primary/25 transition-all group"
                        >
                          <Link2 className="h-4 w-4" />
                          Connect
                          <ArrowUpRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          )}

          {/* Coming Soon Section */}
          {filteredIntegrations.some((i) => i.status === "coming-soon") && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-10"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Clock className="h-5 w-5 text-amber-500" />
                </div>
                <h2 className="text-xl font-semibold">Coming Soon</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredIntegrations
                  .filter((i) => i.status === "coming-soon")
                  .map((integration, index) => (
                    <motion.div
                      key={integration.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="group"
                    >
                      <div className="relative p-6 rounded-2xl bg-card/50 border border-dashed border-border hover:border-amber-500/30 transition-all duration-300">
                        {/* Coming soon badge */}
                        <div className="absolute top-4 right-4">
                          <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-medium">
                            Coming Soon
                          </span>
                        </div>

                        {/* Icon and Name */}
                        <div className="flex items-start gap-4 mb-4">
                          <div
                            className={`p-3 rounded-xl ${integration.bgColor} opacity-60`}
                          >
                            <span className="text-3xl grayscale-[30%]">
                              {integration.icon}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">
                              {integration.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {integration.description}
                            </p>
                          </div>
                        </div>

                        {/* Features */}
                        <div className="flex flex-wrap gap-2 mb-5">
                          {integration.features.slice(0, 3).map((feature) => (
                            <span
                              key={feature}
                              className="px-2.5 py-1 rounded-lg bg-muted/30 text-xs font-medium text-muted-foreground"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>

                        {/* Notify button */}
                        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-muted/50 text-muted-foreground font-medium hover:bg-muted transition-colors">
                          <Sparkles className="h-4 w-4" />
                          Notify Me
                        </button>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          )}

          {/* Connection History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-10"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold">Recent Activity</h2>
              </div>
              <button className="text-sm text-primary hover:underline">
                View All
              </button>
            </div>

            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              {connectionHistory.map((log, index) => (
                <div
                  key={log.id}
                  className={`flex items-center gap-4 px-6 py-4 ${
                    index !== connectionHistory.length - 1
                      ? "border-b border-border"
                      : ""
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      log.action === "connected"
                        ? "bg-green-500/10"
                        : log.action === "disconnected"
                          ? "bg-red-500/10"
                          : log.action === "synced"
                            ? "bg-blue-500/10"
                            : "bg-amber-500/10"
                    }`}
                  >
                    {log.action === "connected" ? (
                      <Link2 className="h-4 w-4 text-green-500" />
                    ) : log.action === "disconnected" ? (
                      <Link2Off className="h-4 w-4 text-red-500" />
                    ) : log.action === "synced" ? (
                      <RefreshCw className="h-4 w-4 text-blue-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">
                      {log.integration}{" "}
                      <span className="text-muted-foreground font-normal">
                        {log.action}
                      </span>
                    </p>
                    {log.details && (
                      <p className="text-sm text-muted-foreground">
                        {log.details}
                      </p>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {log.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* API & Developer Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="p-8 rounded-2xl bg-gradient-to-r from-primary/10 via-chart-1/10 to-purple-500/10 border border-primary/20">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/20">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Build Your Own Integration
                    </h3>
                    <p className="text-muted-foreground max-w-xl">
                      Use our powerful API to build custom integrations with
                      your favorite tools. Full documentation and SDKs
                      available.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => onNavigate("/api")}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-card border border-border hover:border-primary/30 font-medium transition-all"
                  >
                    <ExternalLink className="h-4 w-4" />
                    API Docs
                  </button>
                  <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-chart-1 text-white font-medium hover:shadow-lg hover:shadow-primary/25 transition-all">
                    <Sparkles className="h-4 w-4" />
                    Get API Key
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Connect Modal */}
        <AnimatePresence>
          {showConnectModal && selectedIntegration && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowConnectModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-card rounded-2xl border border-border shadow-2xl max-w-md w-full overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="p-6 border-b border-border">
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-xl ${selectedIntegration.bgColor}`}
                    >
                      <span className="text-3xl">
                        {selectedIntegration.icon}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">
                        Connect {selectedIntegration.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedIntegration.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-muted-foreground mb-6">
                    {selectedIntegration.longDescription}
                  </p>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium mb-3">
                      What you'll get:
                    </h4>
                    <div className="space-y-2">
                      {selectedIntegration.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Permissions */}
                  <div className="p-4 rounded-xl bg-muted/50 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        Required Permissions
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      ScholarFlow will request access to read and sync your
                      library data. You can revoke access at any time.
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-border bg-muted/20 flex gap-3">
                  <button
                    onClick={() => setShowConnectModal(false)}
                    className="flex-1 px-4 py-3 rounded-xl border border-border hover:bg-muted transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmConnect}
                    disabled={isConnecting}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-chart-1 text-white font-medium hover:shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-50"
                  >
                    {isConnecting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Link2 className="h-4 w-4" />
                        Connect
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Disconnect Confirmation Modal */}
        <AnimatePresence>
          {showDisconnectConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowDisconnectConfirm(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-card rounded-2xl border border-border shadow-2xl max-w-sm w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-full bg-red-500/10">
                    <Unplug className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Disconnect Integration</h3>
                    <p className="text-sm text-muted-foreground">
                      This action can be undone
                    </p>
                  </div>
                </div>

                <p className="text-muted-foreground mb-6">
                  Are you sure you want to disconnect this integration? Your
                  synced data will remain in ScholarFlow.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDisconnectConfirm(null)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-border hover:bg-muted transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowDisconnectConfirm(null)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors font-medium"
                  >
                    Disconnect
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};
