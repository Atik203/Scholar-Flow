"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Command,
  FileText,
  FolderOpen,
  Grid,
  Home,
  Keyboard,
  Search,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";

import { useRole, type UserRole } from "../../components/context";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

interface KeyboardShortcutsPageProps {
  onNavigate: (path: string) => void;
  role?: UserRole;
}

interface Shortcut {
  keys: string[];
  description: string;
  category: string;
}

interface ShortcutCategory {
  name: string;
  icon: React.ReactNode;
  shortcuts: Shortcut[];
  color: string;
}

const shortcutCategories: ShortcutCategory[] = [
  {
    name: "Global Navigation",
    icon: <Home className="h-5 w-5" />,
    color: "from-blue-500 to-blue-600",
    shortcuts: [
      {
        keys: ["⌘", "K"],
        description: "Open command palette / global search",
        category: "navigation",
      },
      {
        keys: ["⌘", "/"],
        description: "Open keyboard shortcuts help",
        category: "navigation",
      },
      {
        keys: ["G", "H"],
        description: "Go to home / dashboard",
        category: "navigation",
      },
      { keys: ["G", "P"], description: "Go to papers", category: "navigation" },
      {
        keys: ["G", "C"],
        description: "Go to collections",
        category: "navigation",
      },
      {
        keys: ["G", "W"],
        description: "Go to workspaces",
        category: "navigation",
      },
      {
        keys: ["G", "S"],
        description: "Go to settings",
        category: "navigation",
      },
      {
        keys: ["G", "N"],
        description: "Go to notifications",
        category: "navigation",
      },
      {
        keys: ["Esc"],
        description: "Close current modal / panel",
        category: "navigation",
      },
    ],
  },
  {
    name: "Search & Discovery",
    icon: <Search className="h-5 w-5" />,
    color: "from-purple-500 to-purple-600",
    shortcuts: [
      {
        keys: ["⌘", "F"],
        description: "Focus search input",
        category: "search",
      },
      {
        keys: ["⌘", "Shift", "F"],
        description: "Advanced search",
        category: "search",
      },
      {
        keys: ["↓"],
        description: "Navigate to next result",
        category: "search",
      },
      {
        keys: ["↑"],
        description: "Navigate to previous result",
        category: "search",
      },
      {
        keys: ["Enter"],
        description: "Open selected result",
        category: "search",
      },
      {
        keys: ["⌘", "Enter"],
        description: "Open in new tab",
        category: "search",
      },
      {
        keys: ["Tab"],
        description: "Switch search filter",
        category: "search",
      },
    ],
  },
  {
    name: "Papers",
    icon: <FileText className="h-5 w-5" />,
    color: "from-emerald-500 to-emerald-600",
    shortcuts: [
      {
        keys: ["N"],
        description: "Create new paper / upload",
        category: "papers",
      },
      { keys: ["E"], description: "Edit selected paper", category: "papers" },
      { keys: ["D"], description: "Delete selected paper", category: "papers" },
      { keys: ["⌘", "S"], description: "Save paper", category: "papers" },
      {
        keys: ["⌘", "D"],
        description: "Download paper PDF",
        category: "papers",
      },
      {
        keys: ["⌘", "C"],
        description: "Copy paper citation",
        category: "papers",
      },
      {
        keys: ["⌘", "Shift", "C"],
        description: "Copy paper link",
        category: "papers",
      },
      { keys: ["A"], description: "Add to collection", category: "papers" },
      { keys: ["S"], description: "Star / favorite paper", category: "papers" },
      { keys: ["V"], description: "View paper details", category: "papers" },
    ],
  },
  {
    name: "Collections",
    icon: <FolderOpen className="h-5 w-5" />,
    color: "from-amber-500 to-amber-600",
    shortcuts: [
      {
        keys: ["⌘", "N"],
        description: "Create new collection",
        category: "collections",
      },
      {
        keys: ["⌘", "E"],
        description: "Edit collection",
        category: "collections",
      },
      {
        keys: ["⌘", "Delete"],
        description: "Delete collection",
        category: "collections",
      },
      {
        keys: ["⌘", "Shift", "S"],
        description: "Share collection",
        category: "collections",
      },
      {
        keys: ["M"],
        description: "Move paper to collection",
        category: "collections",
      },
      {
        keys: ["R"],
        description: "Remove from collection",
        category: "collections",
      },
    ],
  },
  {
    name: "AI & Insights",
    icon: <Sparkles className="h-5 w-5" />,
    color: "from-pink-500 to-pink-600",
    shortcuts: [
      {
        keys: ["⌘", "I"],
        description: "Open AI insights panel",
        category: "ai",
      },
      {
        keys: ["⌘", "Shift", "I"],
        description: "Generate paper summary",
        category: "ai",
      },
      {
        keys: ["⌘", "Q"],
        description: "Ask AI question about paper",
        category: "ai",
      },
      {
        keys: ["⌘", "R"],
        description: "Get AI recommendations",
        category: "ai",
      },
    ],
  },
  {
    name: "Research & Notes",
    icon: <BookOpen className="h-5 w-5" />,
    color: "from-cyan-500 to-cyan-600",
    shortcuts: [
      {
        keys: ["⌘", "Shift", "N"],
        description: "Create new note",
        category: "research",
      },
      { keys: ["⌘", "B"], description: "Bold text", category: "research" },
      { keys: ["⌘", "I"], description: "Italic text", category: "research" },
      { keys: ["⌘", "U"], description: "Underline text", category: "research" },
      {
        keys: ["⌘", "Shift", "H"],
        description: "Highlight text",
        category: "research",
      },
      { keys: ["⌘", "L"], description: "Add link", category: "research" },
      {
        keys: ["⌘", "Shift", "L"],
        description: "Add citation link",
        category: "research",
      },
    ],
  },
  {
    name: "Collaboration",
    icon: <Users className="h-5 w-5" />,
    color: "from-indigo-500 to-indigo-600",
    shortcuts: [
      {
        keys: ["⌘", "Shift", "M"],
        description: "Mention collaborator",
        category: "collaboration",
      },
      {
        keys: ["⌘", "Enter"],
        description: "Send comment",
        category: "collaboration",
      },
      {
        keys: ["R"],
        description: "Reply to comment",
        category: "collaboration",
      },
      {
        keys: ["⌘", "Shift", "Share"],
        description: "Quick share",
        category: "collaboration",
      },
    ],
  },
  {
    name: "View & Interface",
    icon: <Grid className="h-5 w-5" />,
    color: "from-slate-500 to-slate-600",
    shortcuts: [
      { keys: ["⌘", "1"], description: "Grid view", category: "view" },
      { keys: ["⌘", "2"], description: "List view", category: "view" },
      { keys: ["⌘", "3"], description: "Compact view", category: "view" },
      {
        keys: ["⌘", "Shift", "D"],
        description: "Toggle dark mode",
        category: "view",
      },
      { keys: ["⌘", "+"], description: "Zoom in", category: "view" },
      { keys: ["⌘", "-"], description: "Zoom out", category: "view" },
      { keys: ["⌘", "0"], description: "Reset zoom", category: "view" },
      { keys: ["F"], description: "Toggle fullscreen", category: "view" },
      { keys: ["["], description: "Collapse sidebar", category: "view" },
      { keys: ["]"], description: "Expand sidebar", category: "view" },
    ],
  },
];

export function KeyboardShortcutsPage({
  onNavigate,
  role: propRole,
}: KeyboardShortcutsPageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    shortcutCategories.map((c) => c.name)
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [recentlyUsed, setRecentlyUsed] = useState<Shortcut[]>([]);
  const [osModifier, setOsModifier] = useState("⌘");

  // Detect OS for modifier key display
  useEffect(() => {
    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    setOsModifier(isMac ? "⌘" : "Ctrl");
  }, []);

  // Filter shortcuts based on search
  const filteredCategories = shortcutCategories
    .map((category) => ({
      ...category,
      shortcuts: category.shortcuts.filter(
        (shortcut) =>
          shortcut.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          shortcut.keys
            .join(" ")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.shortcuts.length > 0);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const handleShortcutClick = (shortcut: Shortcut) => {
    // Add to recently used
    setRecentlyUsed((prev) => {
      const filtered = prev.filter(
        (s) => s.description !== shortcut.description
      );
      return [shortcut, ...filtered].slice(0, 5);
    });
  };

  const defaultUser = {
    name: "Atik Rahaman",
    email: "atik@example.com",
    role: "researcher" as const,
  };
  const user = { ...defaultUser, role: effectiveRole };

  const renderShortcutKey = (key: string) => {
    // Replace ⌘ with appropriate modifier
    const displayKey = key === "⌘" ? osModifier : key;

    return (
      <span
        className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-md
                   bg-gradient-to-b from-white to-slate-100 dark:from-slate-700 dark:to-slate-800
                   border border-slate-300 dark:border-slate-600
                   text-xs font-semibold text-slate-700 dark:text-slate-200
                   shadow-sm"
      >
        {displayKey}
      </span>
    );
  };

  return (
    <DashboardLayout user={user} onNavigate={onNavigate}>
      <div className="p-6 lg:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/25">
              <Keyboard className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Keyboard Shortcuts
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Master ScholarFlow with these productivity shortcuts
              </p>
            </div>
          </div>

          {/* OS Modifier Note */}
          <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <Command className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-blue-700 dark:text-blue-300">
              On your device, use <strong>{osModifier}</strong> as the modifier
              key
            </span>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search shortcuts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-700
                       bg-white dark:bg-slate-800 text-slate-900 dark:text-white
                       focus:ring-2 focus:ring-violet-500 focus:border-transparent
                       placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full
                         hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="h-4 w-4 text-slate-400" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Recently Used */}
        {recentlyUsed.length > 0 && !searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-8"
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Recently Used
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {recentlyUsed.map((shortcut, index) => (
                <motion.div
                  key={shortcut.description}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-xl
                           bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800"
                >
                  <span className="text-sm text-slate-700 dark:text-slate-300 truncate pr-4">
                    {shortcut.description}
                  </span>
                  <div className="flex items-center gap-1">
                    {shortcut.keys.map((key, idx) => (
                      <React.Fragment key={idx}>
                        {renderShortcutKey(key)}
                        {idx < shortcut.keys.length - 1 && (
                          <span className="text-slate-400 mx-0.5">+</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Shortcut Categories */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {(searchQuery ? filteredCategories : shortcutCategories).map(
              (category, categoryIndex) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: categoryIndex * 0.05 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700
                           shadow-sm overflow-hidden"
                >
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(category.name)}
                    className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-xl bg-gradient-to-br ${category.color} text-white shadow-lg`}
                      >
                        {category.icon}
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          {category.name}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {category.shortcuts.length} shortcuts
                        </p>
                      </div>
                    </div>
                    <motion.div
                      animate={{
                        rotate: expandedCategories.includes(category.name)
                          ? 180
                          : 0,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-5 w-5 text-slate-400" />
                    </motion.div>
                  </button>

                  {/* Category Content */}
                  <AnimatePresence>
                    {expandedCategories.includes(category.name) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4">
                          <div className="border-t border-slate-100 dark:border-slate-700 pt-4">
                            <div className="grid gap-2">
                              {category.shortcuts.map((shortcut, index) => (
                                <motion.button
                                  key={shortcut.description}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.03 }}
                                  onClick={() => handleShortcutClick(shortcut)}
                                  className="flex items-center justify-between p-3 rounded-xl
                                           hover:bg-slate-50 dark:hover:bg-slate-700/50
                                           transition-colors text-left group"
                                >
                                  <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                    {shortcut.description}
                                  </span>
                                  <div className="flex items-center gap-1 ml-4">
                                    {shortcut.keys.map((key, idx) => (
                                      <React.Fragment key={idx}>
                                        {renderShortcutKey(key)}
                                        {idx < shortcut.keys.length - 1 && (
                                          <span className="text-slate-400 mx-0.5">
                                            +
                                          </span>
                                        )}
                                      </React.Fragment>
                                    ))}
                                  </div>
                                </motion.button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {searchQuery && filteredCategories.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No shortcuts found
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Try a different search term
            </p>
          </motion.div>
        )}

        {/* Pro Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 
                   border border-violet-200 dark:border-violet-800"
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-violet-500" />
            Pro Tips
          </h3>
          <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 text-violet-500 mt-0.5 flex-shrink-0" />
              <span>
                Press <strong>{osModifier} + K</strong> anywhere to open the
                command palette for quick actions
              </span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 text-violet-500 mt-0.5 flex-shrink-0" />
              <span>
                Use <strong>G</strong> followed by a letter for quick navigation
                (e.g., G + P for Papers)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 text-violet-500 mt-0.5 flex-shrink-0" />
              <span>
                Hold <strong>Shift</strong> while clicking to select multiple
                items
              </span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 text-violet-500 mt-0.5 flex-shrink-0" />
              <span>
                Press <strong>?</strong> on any page to see context-specific
                shortcuts
              </span>
            </li>
          </ul>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400"
        >
          <p>
            Press <strong>{osModifier} + /</strong> to toggle this shortcuts
            reference
          </p>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

export default KeyboardShortcutsPage;
