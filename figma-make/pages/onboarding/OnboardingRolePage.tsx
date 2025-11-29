"use client";

/**
 * OnboardingRolePage - Role Selection with Feature Preview
 *
 * Multi-step onboarding role selection page that helps new users
 * choose their appropriate role with detailed feature previews.
 *
 * Features:
 * - Interactive role cards with feature breakdowns
 * - Comparison table for plan features
 * - Role recommendation quiz
 * - Animated transitions between selections
 * - Mobile-responsive design
 * - Upgrade path visualization
 */

import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Check,
  ChevronLeft,
  Crown,
  FolderKanban,
  HelpCircle,
  Infinity,
  Lock,
  Share2,
  Shield,
  Sparkles,
  Star,
  Upload,
  User,
  Users,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface OnboardingRolePageProps {
  onNavigate: (path: string) => void;
}

type UserRole = "researcher" | "pro_researcher" | "team_lead" | "admin";

interface RoleFeature {
  name: string;
  included: boolean;
  limit?: string;
}

interface RoleOption {
  id: UserRole;
  name: string;
  tagline: string;
  description: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  price: string;
  priceNote: string;
  recommended?: boolean;
  features: RoleFeature[];
  highlights: string[];
}

interface QuizAnswer {
  question: string;
  answers: { text: string; points: Record<UserRole, number> }[];
}

// Mock quiz questions for role recommendation
const quizQuestions: QuizAnswer[] = [
  {
    question: "How many research papers do you typically work with monthly?",
    answers: [
      {
        text: "1-10 papers",
        points: { researcher: 3, pro_researcher: 1, team_lead: 0, admin: 0 },
      },
      {
        text: "11-50 papers",
        points: { researcher: 1, pro_researcher: 3, team_lead: 1, admin: 0 },
      },
      {
        text: "50+ papers",
        points: { researcher: 0, pro_researcher: 2, team_lead: 3, admin: 1 },
      },
      {
        text: "Managing others' papers",
        points: { researcher: 0, pro_researcher: 0, team_lead: 2, admin: 3 },
      },
    ],
  },
  {
    question: "Do you collaborate with others on research?",
    answers: [
      {
        text: "I work mostly alone",
        points: { researcher: 3, pro_researcher: 2, team_lead: 0, admin: 0 },
      },
      {
        text: "Small collaborations (2-5 people)",
        points: { researcher: 1, pro_researcher: 3, team_lead: 2, admin: 0 },
      },
      {
        text: "Large team collaborations",
        points: { researcher: 0, pro_researcher: 1, team_lead: 3, admin: 1 },
      },
      {
        text: "I manage research teams",
        points: { researcher: 0, pro_researcher: 0, team_lead: 2, admin: 3 },
      },
    ],
  },
  {
    question: "What's your primary use case?",
    answers: [
      {
        text: "Personal research & reading",
        points: { researcher: 3, pro_researcher: 1, team_lead: 0, admin: 0 },
      },
      {
        text: "Academic writing & citations",
        points: { researcher: 2, pro_researcher: 3, team_lead: 1, admin: 0 },
      },
      {
        text: "Team project management",
        points: { researcher: 0, pro_researcher: 1, team_lead: 3, admin: 1 },
      },
      {
        text: "Organization-wide deployment",
        points: { researcher: 0, pro_researcher: 0, team_lead: 1, admin: 3 },
      },
    ],
  },
];

// Role options with detailed features
const roleOptions: RoleOption[] = [
  {
    id: "researcher",
    name: "Researcher",
    tagline: "Perfect for getting started",
    description:
      "Essential tools for individual researchers. Upload, organize, and annotate your papers.",
    icon: User,
    color: "blue",
    gradient: "from-blue-500 to-blue-600",
    price: "Free",
    priceNote: "Forever",
    features: [
      { name: "Paper uploads", included: true, limit: "50/month" },
      { name: "Collections", included: true, limit: "5" },
      { name: "Basic annotations", included: true },
      { name: "Citation export", included: true },
      { name: "AI insights", included: false },
      { name: "Advanced analytics", included: false },
      { name: "Team collaboration", included: false },
      { name: "Priority support", included: false },
    ],
    highlights: [
      "Get started in minutes",
      "No credit card required",
      "Export citations anytime",
    ],
  },
  {
    id: "pro_researcher",
    name: "Pro Researcher",
    tagline: "Most popular for academics",
    description:
      "Advanced features for serious researchers. Unlock AI-powered insights and unlimited storage.",
    icon: Crown,
    color: "purple",
    gradient: "from-purple-500 to-purple-600",
    price: "$12",
    priceNote: "/month",
    recommended: true,
    features: [
      { name: "Paper uploads", included: true, limit: "Unlimited" },
      { name: "Collections", included: true, limit: "Unlimited" },
      { name: "Advanced annotations", included: true },
      { name: "Citation export", included: true },
      { name: "AI insights", included: true },
      { name: "Advanced analytics", included: true },
      { name: "Team collaboration", included: false },
      { name: "Priority support", included: true },
    ],
    highlights: [
      "AI-powered paper analysis",
      "Advanced citation graphs",
      "Research analytics dashboard",
    ],
  },
  {
    id: "team_lead",
    name: "Team Lead",
    tagline: "Best for research groups",
    description:
      "Collaborate with your team. Manage workspaces, share collections, and track progress.",
    icon: Users,
    color: "emerald",
    gradient: "from-emerald-500 to-emerald-600",
    price: "$29",
    priceNote: "/month",
    features: [
      { name: "Paper uploads", included: true, limit: "Unlimited" },
      { name: "Collections", included: true, limit: "Unlimited" },
      { name: "Advanced annotations", included: true },
      { name: "Citation export", included: true },
      { name: "AI insights", included: true },
      { name: "Advanced analytics", included: true },
      { name: "Team collaboration", included: true, limit: "Up to 10 members" },
      { name: "Priority support", included: true },
    ],
    highlights: [
      "Team workspace management",
      "Role-based permissions",
      "Team activity analytics",
    ],
  },
  {
    id: "admin",
    name: "Enterprise",
    tagline: "For organizations",
    description:
      "Full platform control for institutions. Custom integrations, SSO, and dedicated support.",
    icon: Shield,
    color: "amber",
    gradient: "from-amber-500 to-amber-600",
    price: "Custom",
    priceNote: "Contact us",
    features: [
      { name: "Paper uploads", included: true, limit: "Unlimited" },
      { name: "Collections", included: true, limit: "Unlimited" },
      { name: "Advanced annotations", included: true },
      { name: "Citation export", included: true },
      { name: "AI insights", included: true },
      { name: "Advanced analytics", included: true },
      { name: "Team collaboration", included: true, limit: "Unlimited" },
      { name: "Priority support", included: true },
    ],
    highlights: [
      "SSO & SAML integration",
      "Custom onboarding",
      "Dedicated account manager",
    ],
  },
];

export function OnboardingRolePage({ onNavigate }: OnboardingRolePageProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [recommendedRole, setRecommendedRole] = useState<UserRole | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  const handleQuizAnswer = (answerIndex: number) => {
    const newAnswers = [...quizAnswers, answerIndex];
    setQuizAnswers(newAnswers);

    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      // Calculate recommendation
      const scores: Record<UserRole, number> = {
        researcher: 0,
        pro_researcher: 0,
        team_lead: 0,
        admin: 0,
      };

      newAnswers.forEach((answerIdx, questionIdx) => {
        const points = quizQuestions[questionIdx].answers[answerIdx].points;
        Object.keys(points).forEach((role) => {
          scores[role as UserRole] += points[role as UserRole];
        });
      });

      const recommended = (Object.keys(scores) as UserRole[]).reduce((a, b) =>
        scores[a] > scores[b] ? a : b
      );
      setRecommendedRole(recommended);
      setSelectedRole(recommended);
      setShowQuiz(false);
    }
  };

  const handleContinue = () => {
    if (selectedRole) {
      onNavigate("/onboarding/workspace");
    }
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setQuizAnswers([]);
    setRecommendedRole(null);
    setShowQuiz(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onNavigate("/onboarding")}
              className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div className="w-16 h-1 bg-blue-500 rounded-full" />
              </div>
              <div className="flex items-center gap-1">
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div className="w-16 h-1 bg-slate-200 dark:bg-slate-700 rounded-full" />
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 flex items-center justify-center text-sm font-medium">
                3
              </div>
            </div>

            <div className="text-sm text-slate-500 dark:text-slate-400">
              Step 1 of 3
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Choose Your Research Path
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Select the plan that best fits your research needs. You can always
            upgrade later.
          </p>

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={() => setShowQuiz(true)}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            >
              <HelpCircle className="w-5 h-5" />
              Not sure? Take the quiz
            </button>
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <BarChart3 className="w-5 h-5" />
              {showComparison ? "Hide comparison" : "Compare plans"}
            </button>
          </div>

          {/* Recommendation badge */}
          {recommendedRole && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:from-purple-500/20 dark:to-blue-500/20 border border-purple-200 dark:border-purple-800 rounded-full"
            >
              <Sparkles className="w-5 h-5 text-purple-500" />
              <span className="text-purple-700 dark:text-purple-300">
                Based on your answers, we recommend{" "}
                <strong>
                  {roleOptions.find((r) => r.id === recommendedRole)?.name}
                </strong>
              </span>
              <button
                onClick={resetQuiz}
                className="text-sm text-purple-500 hover:text-purple-600 underline"
              >
                Retake quiz
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Quiz Modal */}
        <AnimatePresence>
          {showQuiz && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowQuiz(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Find Your Perfect Plan
                  </h3>
                  <button
                    onClick={() => setShowQuiz(false)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Progress */}
                <div className="flex gap-1 mb-6">
                  {quizQuestions.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1 flex-1 rounded-full ${
                        idx <= quizStep
                          ? "bg-blue-500"
                          : "bg-slate-200 dark:bg-slate-700"
                      }`}
                    />
                  ))}
                </div>

                <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-4">
                  {quizQuestions[quizStep].question}
                </h4>

                <div className="space-y-3">
                  {quizQuestions[quizStep].answers.map((answer, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleQuizAnswer(idx)}
                      className="w-full p-4 text-left rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                    >
                      {answer.text}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {roleOptions.map((role, idx) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            const isRecommended = recommendedRole === role.id;

            return (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setSelectedRole(role.id)}
                className={`relative rounded-2xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? `border-${role.color}-500 bg-${role.color}-50 dark:bg-${role.color}-900/20`
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-600"
                } ${role.recommended ? "ring-2 ring-purple-500 ring-offset-2 dark:ring-offset-slate-950" : ""}`}
              >
                {/* Recommended badge */}
                {role.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full text-white text-xs font-medium flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Most Popular
                  </div>
                )}

                {/* AI Recommended badge */}
                {isRecommended && !role.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-white text-xs font-medium flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Recommended for you
                  </div>
                )}

                <div className="p-6">
                  {/* Icon & Name */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-r ${role.gradient} flex items-center justify-center`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {role.name}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {role.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">
                      {role.price}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {role.priceNote}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                    {role.description}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-2 mb-6">
                    {role.highlights.map((highlight, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
                      >
                        <Check className={`w-4 h-4 text-${role.color}-500`} />
                        {highlight}
                      </div>
                    ))}
                  </div>

                  {/* Selection indicator */}
                  <div
                    className={`w-full py-3 rounded-xl text-center font-medium transition-colors ${
                      isSelected
                        ? `bg-gradient-to-r ${role.gradient} text-white`
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {isSelected ? "Selected" : "Select"}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Comparison Table */}
        <AnimatePresence>
          {showComparison && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-12"
            >
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <th className="text-left p-4 font-medium text-slate-600 dark:text-slate-400">
                          Feature
                        </th>
                        {roleOptions.map((role) => (
                          <th
                            key={role.id}
                            className="p-4 font-medium text-slate-900 dark:text-white text-center"
                          >
                            {role.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {roleOptions[0].features.map((feature, idx) => (
                        <tr
                          key={feature.name}
                          className={
                            idx % 2 === 0
                              ? "bg-slate-50 dark:bg-slate-800/50"
                              : ""
                          }
                        >
                          <td className="p-4 text-slate-600 dark:text-slate-400">
                            {feature.name}
                          </td>
                          {roleOptions.map((role) => {
                            const roleFeature = role.features[idx];
                            return (
                              <td key={role.id} className="p-4 text-center">
                                {roleFeature.included ? (
                                  <div className="flex items-center justify-center gap-1">
                                    <Check className="w-5 h-5 text-green-500" />
                                    {roleFeature.limit && (
                                      <span className="text-xs text-slate-500 dark:text-slate-400">
                                        {roleFeature.limit}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <X className="w-5 h-5 text-slate-300 dark:text-slate-600 mx-auto" />
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feature Icons Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-12"
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 text-center">
            All Plans Include
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { icon: BookOpen, label: "Paper Library" },
              { icon: FolderKanban, label: "Collections" },
              { icon: Upload, label: "Easy Upload" },
              { icon: Share2, label: "Sharing" },
              { icon: Lock, label: "Secure Storage" },
              { icon: Zap, label: "Fast Search" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-2 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center"
        >
          <button
            onClick={handleContinue}
            disabled={!selectedRole}
            className={`flex items-center gap-2 px-8 py-4 rounded-xl font-medium text-lg transition-all ${
              selectedRole
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-lg shadow-blue-500/25"
                : "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
            }`}
          >
            Continue to Workspace Setup
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center gap-8 mt-12 text-sm text-slate-500 dark:text-slate-400"
        >
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Secure & Encrypted
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Instant Access
          </div>
          <div className="flex items-center gap-2">
            <Infinity className="w-4 h-4" />
            Cancel Anytime
          </div>
        </motion.div>
      </div>
    </div>
  );
}
