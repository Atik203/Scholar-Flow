"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  Activity,
  Award,
  Ban,
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
  Github,
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
} from "lucide-react";
import React, { useState } from "react";
import { useRole, type UserRole } from "../../components/context";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

interface CollaboratorProfilePageProps {
  onNavigate: (path: string) => void;
  role?: UserRole;
}

// Mock collaborator data
const mockCollaborator = {
  id: "user-1",
  name: "Dr. Emily Johnson",
  title: "Associate Professor of Computer Science",
  affiliation: "Stanford University",
  email: "emily.johnson@stanford.edu",
  location: "Palo Alto, CA",
  joinedDate: "2021-03-15",
  avatar:
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
  coverImage:
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=400&fit=crop",
  bio: "Researcher specializing in Natural Language Processing and Machine Learning. Passionate about developing AI systems that understand and generate human language. Currently working on large language models and their applications in healthcare.",
  website: "https://emilyj.stanford.edu",
  socialLinks: {
    github: "emilyjohnson",
    twitter: "dremilyjohnson",
    orcid: "0000-0002-1234-5678",
    googleScholar: "emily_johnson_cs",
  },
  stats: {
    papers: 47,
    citations: 2345,
    collaborators: 28,
    collections: 12,
    hIndex: 18,
    i10Index: 24,
  },
  badges: [
    { id: "1", name: "Top Contributor", icon: Award, color: "amber" },
    { id: "2", name: "Verified Researcher", icon: Check, color: "blue" },
    { id: "3", name: "Prolific Author", icon: FileText, color: "purple" },
  ],
  researchInterests: [
    "Natural Language Processing",
    "Machine Learning",
    "Large Language Models",
    "Healthcare AI",
    "Information Retrieval",
    "Deep Learning",
  ],
  isFollowing: false,
  isConnected: true,
  mutualConnections: 5,
};

// Mock papers
const mockPapers = [
  {
    id: "1",
    title:
      "Scaling Language Models: Methods, Analysis & Insights from Training GPT-4",
    authors: ["E. Johnson", "J. Smith", "A. Brown"],
    year: 2024,
    venue: "NeurIPS 2024",
    citations: 156,
    abstract:
      "We present a comprehensive analysis of scaling laws for large language models...",
  },
  {
    id: "2",
    title: "Efficient Fine-tuning Methods for Large Pre-trained Models",
    authors: ["E. Johnson", "M. Lee"],
    year: 2023,
    venue: "ICML 2023",
    citations: 89,
    abstract:
      "This paper introduces novel techniques for efficient fine-tuning...",
  },
  {
    id: "3",
    title: "Clinical NLP: Extracting Insights from Electronic Health Records",
    authors: ["E. Johnson", "R. Chen", "K. Williams"],
    year: 2023,
    venue: "Journal of AI in Healthcare",
    citations: 67,
    abstract:
      "We explore methods for extracting structured medical information...",
  },
];

// Mock activity
const mockActivity = [
  {
    id: "1",
    type: "paper",
    action: "Published new paper",
    title: "Vision Transformers Survey",
    time: "2 days ago",
  },
  {
    id: "2",
    type: "collaboration",
    action: "Started collaboration with",
    title: "Dr. Alex Rivera",
    time: "1 week ago",
  },
  {
    id: "3",
    type: "collection",
    action: "Created collection",
    title: "NLP Resources 2024",
    time: "2 weeks ago",
  },
  {
    id: "4",
    type: "citation",
    action: "Paper cited by",
    title: "Nature Machine Intelligence",
    time: "3 weeks ago",
  },
];

// Mock shared collections
const mockCollections = [
  { id: "1", name: "NLP Papers 2024", papers: 24, isPublic: true },
  { id: "2", name: "Healthcare AI Research", papers: 18, isPublic: true },
  { id: "3", name: "Transformer Architectures", papers: 32, isPublic: false },
];

export const CollaboratorProfilePage: React.FC<
  CollaboratorProfilePageProps
> = ({ onNavigate, role: propRole }) => {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const [activeTab, setActiveTab] = useState<
    "papers" | "collections" | "activity"
  >("papers");
  const [isFollowing, setIsFollowing] = useState(mockCollaborator.isFollowing);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState("");
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const defaultUser = {
    name: "Dr. Sarah Chen",
    email: "sarah.chen@research.edu",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    role: "pro_researcher" as const,
  };
  const user = { ...defaultUser, role: effectiveRole };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(mockCollaborator.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const tabs = [
    { id: "papers", label: "Papers", count: mockCollaborator.stats.papers },
    {
      id: "collections",
      label: "Collections",
      count: mockCollaborator.stats.collections,
    },
    { id: "activity", label: "Activity", count: null },
  ];

  return (
    <DashboardLayout user={user} onNavigate={onNavigate}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Cover Image */}
        <div className="relative h-48 md:h-64">
          <img
            src={mockCollaborator.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <div className="max-w-6xl mx-auto px-6 -mt-24 relative z-10">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden"
          >
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <img
                      src={mockCollaborator.avatar}
                      alt={mockCollaborator.name}
                      className="w-28 h-28 md:w-36 md:h-36 rounded-xl border-4 border-white dark:border-gray-800 shadow-lg object-cover"
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-gray-800" />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                          {mockCollaborator.name}
                        </h1>
                        {mockCollaborator.badges.slice(0, 2).map((badge) => (
                          <span
                            key={badge.id}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-${badge.color}-100 dark:bg-${badge.color}-900/30 text-${badge.color}-700 dark:text-${badge.color}-300`}
                          >
                            <badge.icon className="w-3 h-3" />
                            {badge.name}
                          </span>
                        ))}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">
                        {mockCollaborator.title}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          {mockCollaborator.affiliation}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {mockCollaborator.location}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleFollow}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                          isFollowing
                            ? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                            : "bg-indigo-600 text-white hover:bg-indigo-700"
                        }`}
                      >
                        {isFollowing ? (
                          <>
                            <UserCheck className="w-4 h-4" />
                            Following
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4" />
                            Follow
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setShowMessageModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Message
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => setShowMoreMenu(!showMoreMenu)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <MoreHorizontal className="w-5 h-5 text-gray-500" />
                        </button>
                        <AnimatePresence>
                          {showMoreMenu && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10"
                            >
                              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                                <Share2 className="w-4 h-4" />
                                Share Profile
                              </button>
                              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                                <Ban className="w-4 h-4" />
                                Block User
                              </button>
                              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700">
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
                  <p className="mt-4 text-gray-600 dark:text-gray-400">
                    {mockCollaborator.bio}
                  </p>

                  {/* Research Interests */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {mockCollaborator.researchInterests.map((interest) => (
                      <span
                        key={interest}
                        className="px-3 py-1 text-sm bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex items-center gap-4 mt-4">
                    <button
                      onClick={handleCopyEmail}
                      className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      <Mail className="w-4 h-4" />
                      {copiedEmail ? "Copied!" : mockCollaborator.email}
                      {!copiedEmail && <Copy className="w-3 h-3" />}
                    </button>
                    {mockCollaborator.website && (
                      <a
                        href={mockCollaborator.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                      >
                        <Globe className="w-4 h-4" />
                        Website
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {mockCollaborator.socialLinks.github && (
                      <a
                        href={`https://github.com/${mockCollaborator.socialLinks.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Github className="w-5 h-5 text-gray-500" />
                      </a>
                    )}
                    {mockCollaborator.socialLinks.twitter && (
                      <a
                        href={`https://twitter.com/${mockCollaborator.socialLinks.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Twitter className="w-5 h-5 text-gray-500" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                {[
                  {
                    label: "Papers",
                    value: mockCollaborator.stats.papers,
                    icon: FileText,
                  },
                  {
                    label: "Citations",
                    value: mockCollaborator.stats.citations,
                    icon: BookOpen,
                  },
                  {
                    label: "h-Index",
                    value: mockCollaborator.stats.hIndex,
                    icon: TrendingUp,
                  },
                  {
                    label: "i10-Index",
                    value: mockCollaborator.stats.i10Index,
                    icon: Award,
                  },
                  {
                    label: "Collaborators",
                    value: mockCollaborator.stats.collaborators,
                    icon: Users,
                  },
                  {
                    label: "Collections",
                    value: mockCollaborator.stats.collections,
                    icon: Folder,
                  },
                ].map((stat, idx) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="text-center"
                  >
                    <div className="flex items-center justify-center mb-1">
                      <stat.icon className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        {stat.value.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="border-t border-gray-200 dark:border-gray-700">
              <div className="flex">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex-1 py-4 text-sm font-medium text-center border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  >
                    {tab.label}
                    {tab.count !== null && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded-full">
                        {tab.count}
                      </span>
                    )}
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
                  {mockPapers.map((paper, idx) => (
                    <motion.div
                      key={paper.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">
                            {paper.title}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {paper.authors.join(", ")} • {paper.year}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                            {paper.abstract}
                          </p>
                          <div className="flex items-center gap-4 mt-3">
                            <span className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded">
                              {paper.venue}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />
                              {paper.citations} citations
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <Star className="w-5 h-5 text-gray-400 hover:text-amber-500" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <Share2 className="w-5 h-5 text-gray-400 hover:text-indigo-500" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
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
                  {mockCollections.map((collection, idx) => (
                    <motion.div
                      key={collection.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                          <Folder className="w-6 h-6 text-white" />
                        </div>
                        {collection.isPublic ? (
                          <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            Public
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                            Private
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {collection.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {collection.papers} papers
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === "activity" && (
                <motion.div
                  key="activity"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {mockActivity.map((activity, idx) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                            <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-900 dark:text-white">
                              <span className="font-medium">
                                {activity.action}
                              </span>{" "}
                              <span className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
                                {activity.title}
                              </span>
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                              <Clock className="w-3 h-3" />
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
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
                className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-lg p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Send Message to {mockCollaborator.name}
                </h3>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message..."
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => setShowMessageModal(false)}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowMessageModal(false);
                      setMessage("");
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    Send Message
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

export default CollaboratorProfilePage;
