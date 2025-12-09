"use client";

/**
 * AdminPlansPage - Subscription plans management for admins
 *
 * Features:
 * - View all subscription plans
 * - Create/edit/delete plans
 * - Plan feature configuration
 * - Pricing management
 * - Usage limits configuration
 * - Plan analytics
 * - Active subscribers per plan
 * - Framer Motion animations
 */

import { AnimatePresence, motion } from "motion/react";
import {
  AlertTriangle,
  BarChart3,
  Brain,
  Check,
  Crown,
  DollarSign,
  Edit2,
  Eye,
  FileJson,
  FileSpreadsheet,
  FileText,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Rocket,
  Save,
  Settings,
  Sparkles,
  Star,
  Trash2,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

import { useRole, type UserRole } from "../../components/context";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

interface AdminPlansPageProps {
  onNavigate: (path: string) => void;
  role?: UserRole;
}

// Plan type
interface Plan {
  id: string;
  name: string;
  description: string;
  tier: "free" | "pro" | "team" | "enterprise";
  monthlyPrice: number;
  yearlyPrice: number;
  features: PlanFeature[];
  limits: PlanLimits;
  isActive: boolean;
  subscriberCount: number;
  monthlyRevenue: number;
  popularityRank: number;
  createdAt: Date;
}

interface PlanFeature {
  id: string;
  name: string;
  included: boolean;
  description?: string;
}

interface PlanLimits {
  papers: number | "unlimited";
  storage: number; // in GB
  workspaces: number | "unlimited";
  collaborators: number | "unlimited";
  aiCredits: number | "unlimited";
  apiCalls: number | "unlimited";
}

// Mock plans data
const mockPlans: Plan[] = [
  {
    id: "plan_free",
    name: "Free",
    description: "Perfect for getting started with research management",
    tier: "free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      { id: "f1", name: "Paper Management", included: true },
      { id: "f2", name: "Basic Search", included: true },
      { id: "f3", name: "1 Workspace", included: true },
      { id: "f4", name: "PDF Annotations", included: true },
      { id: "f5", name: "AI Insights", included: false },
      { id: "f6", name: "Citation Analytics", included: false },
      { id: "f7", name: "Team Collaboration", included: false },
      { id: "f8", name: "API Access", included: false },
      { id: "f9", name: "Priority Support", included: false },
    ],
    limits: {
      papers: 50,
      storage: 1,
      workspaces: 1,
      collaborators: 0,
      aiCredits: 10,
      apiCalls: 0,
    },
    isActive: true,
    subscriberCount: 12453,
    monthlyRevenue: 0,
    popularityRank: 1,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "plan_pro",
    name: "Pro",
    description: "For serious researchers who need more power",
    tier: "pro",
    monthlyPrice: 12,
    yearlyPrice: 99,
    features: [
      { id: "f1", name: "Paper Management", included: true },
      { id: "f2", name: "Advanced Search", included: true },
      { id: "f3", name: "5 Workspaces", included: true },
      { id: "f4", name: "PDF Annotations", included: true },
      { id: "f5", name: "AI Insights", included: true },
      { id: "f6", name: "Citation Analytics", included: true },
      { id: "f7", name: "Team Collaboration", included: false },
      { id: "f8", name: "API Access", included: false },
      { id: "f9", name: "Priority Support", included: true },
    ],
    limits: {
      papers: 500,
      storage: 25,
      workspaces: 5,
      collaborators: 3,
      aiCredits: 500,
      apiCalls: 1000,
    },
    isActive: true,
    subscriberCount: 3241,
    monthlyRevenue: 38892,
    popularityRank: 2,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "plan_team",
    name: "Team",
    description: "Collaborate with your research team effectively",
    tier: "team",
    monthlyPrice: 29,
    yearlyPrice: 249,
    features: [
      { id: "f1", name: "Paper Management", included: true },
      { id: "f2", name: "Advanced Search", included: true },
      { id: "f3", name: "Unlimited Workspaces", included: true },
      { id: "f4", name: "PDF Annotations", included: true },
      { id: "f5", name: "AI Insights", included: true },
      { id: "f6", name: "Citation Analytics", included: true },
      { id: "f7", name: "Team Collaboration", included: true },
      { id: "f8", name: "API Access", included: true },
      { id: "f9", name: "Priority Support", included: true },
    ],
    limits: {
      papers: "unlimited",
      storage: 100,
      workspaces: "unlimited",
      collaborators: 20,
      aiCredits: 2000,
      apiCalls: 10000,
    },
    isActive: true,
    subscriberCount: 856,
    monthlyRevenue: 24824,
    popularityRank: 3,
    createdAt: new Date("2024-03-15"),
  },
  {
    id: "plan_enterprise",
    name: "Enterprise",
    description: "For organizations with advanced needs",
    tier: "enterprise",
    monthlyPrice: 99,
    yearlyPrice: 990,
    features: [
      { id: "f1", name: "Paper Management", included: true },
      { id: "f2", name: "Advanced Search", included: true },
      { id: "f3", name: "Unlimited Workspaces", included: true },
      { id: "f4", name: "PDF Annotations", included: true },
      { id: "f5", name: "AI Insights", included: true },
      { id: "f6", name: "Citation Analytics", included: true },
      { id: "f7", name: "Team Collaboration", included: true },
      { id: "f8", name: "API Access", included: true },
      { id: "f9", name: "Priority Support", included: true },
      { id: "f10", name: "SSO/SAML", included: true },
      { id: "f11", name: "Custom Integrations", included: true },
      { id: "f12", name: "Dedicated Account Manager", included: true },
    ],
    limits: {
      papers: "unlimited",
      storage: "unlimited" as unknown as number,
      workspaces: "unlimited",
      collaborators: "unlimited",
      aiCredits: "unlimited",
      apiCalls: "unlimited",
    },
    isActive: true,
    subscriberCount: 42,
    monthlyRevenue: 4158,
    popularityRank: 4,
    createdAt: new Date("2024-06-01"),
  },
];

// Plan card component
function PlanCard({
  plan,
  onEdit,
  onDelete,
  onToggle,
}: {
  plan: Plan;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
}) {
  const [showActions, setShowActions] = useState(false);

  const getTierIcon = () => {
    switch (plan.tier) {
      case "free":
        return <Star className="h-5 w-5" />;
      case "pro":
        return <Zap className="h-5 w-5" />;
      case "team":
        return <Users className="h-5 w-5" />;
      case "enterprise":
        return <Crown className="h-5 w-5" />;
    }
  };

  const getTierColor = () => {
    switch (plan.tier) {
      case "free":
        return "from-gray-500 to-gray-600";
      case "pro":
        return "from-blue-500 to-purple-500";
      case "team":
        return "from-green-500 to-emerald-500";
      case "enterprise":
        return "from-amber-500 to-orange-500";
    }
  };

  const getTierBgColor = () => {
    switch (plan.tier) {
      case "free":
        return "bg-gray-100 dark:bg-gray-700";
      case "pro":
        return "bg-blue-100 dark:bg-blue-900/50";
      case "team":
        return "bg-green-100 dark:bg-green-900/50";
      case "enterprise":
        return "bg-amber-100 dark:bg-amber-900/50";
    }
  };

  const formatLimit = (value: number | "unlimited") =>
    value === "unlimited" ? "∞" : value.toLocaleString();

  return (
    <motion.div
      layout
      className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden ${
        !plan.isActive ? "opacity-60" : ""
      }`}
    >
      {/* Header */}
      <div
        className={`p-4 bg-gradient-to-r ${getTierColor()} text-white relative`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">{getTierIcon()}</div>
            <div>
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p className="text-sm text-white/80">{plan.description}</p>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>
            <AnimatePresence>
              {showActions && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 min-w-[140px] z-10"
                >
                  <button
                    onClick={() => {
                      onEdit();
                      setShowActions(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit Plan
                  </button>
                  <button
                    onClick={() => {
                      onToggle();
                      setShowActions(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Eye className="h-4 w-4" />
                    {plan.isActive ? "Deactivate" : "Activate"}
                  </button>
                  {plan.tier !== "free" && (
                    <button
                      onClick={() => {
                        onDelete();
                        setShowActions(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Pricing */}
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-4xl font-bold">${plan.monthlyPrice}</span>
          <span className="text-white/80">/month</span>
          {plan.yearlyPrice > 0 && (
            <span className="text-sm text-white/60 ml-2">
              (${plan.yearlyPrice}/year)
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 divide-x divide-gray-200 dark:divide-gray-700 border-b border-gray-200 dark:border-gray-700">
        <div className="p-4 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {plan.subscriberCount.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Subscribers
          </p>
        </div>
        <div className="p-4 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${plan.monthlyRevenue.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">MRR</p>
        </div>
        <div className="p-4 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            #{plan.popularityRank}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Rank</p>
        </div>
      </div>

      {/* Features */}
      <div className="p-4">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          Features
        </h4>
        <div className="space-y-2">
          {plan.features.slice(0, 5).map((feature) => (
            <div key={feature.id} className="flex items-center gap-2">
              {feature.included ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <X className="h-4 w-4 text-gray-300 dark:text-gray-600" />
              )}
              <span
                className={`text-sm ${
                  feature.included
                    ? "text-gray-700 dark:text-gray-300"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              >
                {feature.name}
              </span>
            </div>
          ))}
          {plan.features.length > 5 && (
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
              +{plan.features.length - 5} more features
            </p>
          )}
        </div>
      </div>

      {/* Limits */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          Limits
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div className={`${getTierBgColor()} rounded-lg p-2`}>
            <p className="text-xs text-gray-500 dark:text-gray-400">Papers</p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {formatLimit(plan.limits.papers)}
            </p>
          </div>
          <div className={`${getTierBgColor()} rounded-lg p-2`}>
            <p className="text-xs text-gray-500 dark:text-gray-400">Storage</p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {typeof plan.limits.storage === "number"
                ? `${plan.limits.storage} GB`
                : "∞"}
            </p>
          </div>
          <div className={`${getTierBgColor()} rounded-lg p-2`}>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              AI Credits
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {formatLimit(plan.limits.aiCredits)}
            </p>
          </div>
          <div className={`${getTierBgColor()} rounded-lg p-2`}>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Collaborators
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {formatLimit(plan.limits.collaborators)}
            </p>
          </div>
        </div>
      </div>

      {/* Status */}
      {!plan.isActive && (
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm">
            <AlertTriangle className="h-4 w-4" />
            <span>This plan is currently inactive</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// Edit modal component
function EditPlanModal({
  isOpen,
  plan,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  plan: Plan | null;
  onClose: () => void;
  onSave: (plan: Plan) => void;
}) {
  const [editedPlan, setEditedPlan] = useState<Plan | null>(plan);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen || !plan) return null;

  const handleSave = () => {
    if (!editedPlan) return;
    setIsSaving(true);
    setTimeout(() => {
      onSave(editedPlan);
      setIsSaving(false);
      onClose();
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg">
              <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Edit {plan.name} Plan
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Basic Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Plan Name
                </label>
                <input
                  type="text"
                  value={editedPlan?.name || ""}
                  onChange={(e) =>
                    setEditedPlan(
                      editedPlan
                        ? { ...editedPlan, name: e.target.value }
                        : null
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Tier
                </label>
                <select
                  value={editedPlan?.tier || "free"}
                  onChange={(e) =>
                    setEditedPlan(
                      editedPlan
                        ? {
                            ...editedPlan,
                            tier: e.target.value as Plan["tier"],
                          }
                        : null
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="free">Free</option>
                  <option value="pro">Pro</option>
                  <option value="team">Team</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                Description
              </label>
              <textarea
                value={editedPlan?.description || ""}
                onChange={(e) =>
                  setEditedPlan(
                    editedPlan
                      ? { ...editedPlan, description: e.target.value }
                      : null
                  )
                }
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              />
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Pricing
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Monthly Price ($)
                </label>
                <input
                  type="number"
                  value={editedPlan?.monthlyPrice || 0}
                  onChange={(e) =>
                    setEditedPlan(
                      editedPlan
                        ? {
                            ...editedPlan,
                            monthlyPrice: Number(e.target.value),
                          }
                        : null
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Yearly Price ($)
                </label>
                <input
                  type="number"
                  value={editedPlan?.yearlyPrice || 0}
                  onChange={(e) =>
                    setEditedPlan(
                      editedPlan
                        ? { ...editedPlan, yearlyPrice: Number(e.target.value) }
                        : null
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Limits */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Usage Limits
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Papers
                </label>
                <input
                  type="text"
                  value={
                    editedPlan?.limits.papers === "unlimited"
                      ? "unlimited"
                      : editedPlan?.limits.papers || 0
                  }
                  onChange={(e) =>
                    setEditedPlan(
                      editedPlan
                        ? {
                            ...editedPlan,
                            limits: {
                              ...editedPlan.limits,
                              papers:
                                e.target.value === "unlimited"
                                  ? "unlimited"
                                  : Number(e.target.value),
                            },
                          }
                        : null
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Storage (GB)
                </label>
                <input
                  type="number"
                  value={editedPlan?.limits.storage || 0}
                  onChange={(e) =>
                    setEditedPlan(
                      editedPlan
                        ? {
                            ...editedPlan,
                            limits: {
                              ...editedPlan.limits,
                              storage: Number(e.target.value),
                            },
                          }
                        : null
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  AI Credits
                </label>
                <input
                  type="text"
                  value={
                    editedPlan?.limits.aiCredits === "unlimited"
                      ? "unlimited"
                      : editedPlan?.limits.aiCredits || 0
                  }
                  onChange={(e) =>
                    setEditedPlan(
                      editedPlan
                        ? {
                            ...editedPlan,
                            limits: {
                              ...editedPlan.limits,
                              aiCredits:
                                e.target.value === "unlimited"
                                  ? "unlimited"
                                  : Number(e.target.value),
                            },
                          }
                        : null
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Features
            </h3>
            <div className="space-y-2">
              {editedPlan?.features.map((feature) => (
                <div
                  key={feature.id}
                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {feature.name}
                  </span>
                  <button
                    onClick={() =>
                      setEditedPlan(
                        editedPlan
                          ? {
                              ...editedPlan,
                              features: editedPlan.features.map((f) =>
                                f.id === feature.id
                                  ? { ...f, included: !f.included }
                                  : f
                              ),
                            }
                          : null
                      )
                    }
                    className={`p-1.5 rounded-lg transition-colors ${
                      feature.included
                        ? "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400"
                        : "bg-gray-200 dark:bg-gray-600 text-gray-400"
                    }`}
                  >
                    {feature.included ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 disabled:opacity-50"
          >
            {isSaving ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Settings className="h-4 w-4" />
              </motion.div>
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isSaving ? "Saving..." : "Save Changes"}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

const defaultUser = {
  name: "Admin User",
  email: "admin@scholarflow.app",
  image: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
  role: "admin" as const,
};

export function AdminPlansPage({
  onNavigate,
  role: propRole,
}: AdminPlansPageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const user = { ...defaultUser, role: effectiveRole };

  const [plans, setPlans] = useState<Plan[]>(mockPlans);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Enhanced features state
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [savedViews, setSavedViews] = useState([
    { id: "1", name: "Active Plans", filter: "active" },
    { id: "2", name: "Enterprise Focus", filter: "enterprise" },
    { id: "3", name: "High Revenue", filter: "high-revenue" },
  ]);
  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [aiInsights] = useState([
    {
      type: "recommendation",
      message: "Professional plan shows highest conversion rate at 45%",
      icon: TrendingUp,
    },
    {
      type: "alert",
      message:
        "Consider adding a Team tier between Professional and Enterprise",
      icon: Sparkles,
    },
    {
      type: "info",
      message: "Free trial conversion improved 12% this month",
      icon: Brain,
    },
  ]);

  // Auto-refresh effect
  useEffect(() => {
    if (!isAutoRefresh) return;
    const interval = setInterval(() => {
      setLastRefresh(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, [isAutoRefresh]);

  // Bulk selection handlers
  const togglePlanSelection = (planId: string) => {
    setSelectedPlans((prev) =>
      prev.includes(planId)
        ? prev.filter((id) => id !== planId)
        : [...prev, planId]
    );
  };

  const toggleAllPlans = () => {
    setSelectedPlans((prev) =>
      prev.length === plans.length ? [] : plans.map((p) => p.id)
    );
  };

  // Export handlers
  const handleExport = (format: string) => {
    console.log(`Exporting plans as ${format}`);
    setShowExportMenu(false);
  };

  // Calculate totals
  const totalSubscribers = plans.reduce((sum, p) => sum + p.subscriberCount, 0);
  const totalMRR = plans.reduce((sum, p) => sum + p.monthlyRevenue, 0);
  const activePlans = plans.filter((p) => p.isActive).length;

  const handleEdit = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowEditModal(true);
  };

  const handleSave = (updatedPlan: Plan) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p))
    );
  };

  const handleToggle = (planId: string) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === planId ? { ...p, isActive: !p.isActive } : p))
    );
  };

  const handleDelete = (planId: string) => {
    setPlans((prev) => prev.filter((p) => p.id !== planId));
  };

  return (
    <DashboardLayout user={user} onNavigate={onNavigate}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Subscription Plans
                </h1>
                <p className="mt-1 text-gray-600 dark:text-gray-400">
                  Manage pricing plans and features
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600"
              >
                <Plus className="h-5 w-5" />
                Create Plan
              </motion.button>
            </div>

            {/* Enhanced Toolbar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="mt-4 flex flex-wrap items-center gap-3"
            >
              {/* Live Refresh Indicator */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <motion.div
                  animate={isAutoRefresh ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`h-2 w-2 rounded-full ${isAutoRefresh ? "bg-green-500" : "bg-gray-400"}`}
                />
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {isAutoRefresh ? "Live" : "Paused"}
                </span>
                <button
                  onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                  className="text-xs text-blue-500 hover:text-blue-600"
                >
                  {isAutoRefresh ? "Pause" : "Resume"}
                </button>
              </div>

              {/* Saved Views */}
              <div className="flex items-center gap-1">
                {savedViews.map((view) => (
                  <button
                    key={view.id}
                    className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {view.name}
                  </button>
                ))}
              </div>

              {/* Bulk Actions */}
              {selectedPlans.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800"
                >
                  <span className="text-xs text-blue-600 dark:text-blue-400">
                    {selectedPlans.length} selected
                  </span>
                  <button className="text-xs text-green-600 hover:text-green-700">
                    Activate
                  </button>
                  <button className="text-xs text-yellow-600 hover:text-yellow-700">
                    Deactivate
                  </button>
                  <button className="text-xs text-red-600 hover:text-red-700">
                    Delete
                  </button>
                </motion.div>
              )}

              {/* Export Menu */}
              <div className="relative ml-auto">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5" />
                  Export
                </button>
                <AnimatePresence>
                  {showExportMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50"
                    >
                      <button
                        onClick={() => handleExport("csv")}
                        className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <FileSpreadsheet className="h-3.5 w-3.5" /> CSV
                      </button>
                      <button
                        onClick={() => handleExport("json")}
                        className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <FileJson className="h-3.5 w-3.5" /> JSON
                      </button>
                      <button
                        onClick={() => handleExport("pdf")}
                        className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <FileText className="h-3.5 w-3.5" /> PDF
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Last Refresh */}
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <RefreshCw className="h-3 w-3" />
                {lastRefresh.toLocaleTimeString()}
              </div>
            </motion.div>

            {/* AI Insights Panel */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200 dark:border-purple-800"
            >
              <div className="flex items-center gap-2 mb-3">
                <Brain className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  AI Insights
                </span>
                <span className="px-2 py-0.5 text-xs bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300 rounded-full">
                  3 new
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {aiInsights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + index * 0.05 }}
                    className="flex items-start gap-2 p-2 bg-white dark:bg-gray-800 rounded-lg"
                  >
                    <insight.icon
                      className={`h-4 w-4 mt-0.5 ${
                        insight.type === "alert"
                          ? "text-amber-500"
                          : insight.type === "recommendation"
                            ? "text-green-500"
                            : "text-blue-500"
                      }`}
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {insight.message}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalSubscribers.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Total Subscribers
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${totalMRR.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Monthly Revenue
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                  <Rocket className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {activePlans}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Active Plans
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    +12.5%
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Growth Rate
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Plans Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + index * 0.05 }}
              >
                <PlanCard
                  plan={plan}
                  onEdit={() => handleEdit(plan)}
                  onDelete={() => handleDelete(plan.id)}
                  onToggle={() => handleToggle(plan.id)}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Revenue Chart Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Revenue by Plan
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Monthly revenue distribution
                  </p>
                </div>
              </div>
            </div>

            {/* Simple bar chart visualization */}
            <div className="space-y-4">
              {plans
                .filter((p) => p.monthlyRevenue > 0)
                .map((plan) => (
                  <div key={plan.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {plan.name}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        ${plan.monthlyRevenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(plan.monthlyRevenue / totalMRR) * 100}%`,
                        }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={`h-full rounded-full bg-gradient-to-r ${
                          plan.tier === "pro"
                            ? "from-blue-500 to-purple-500"
                            : plan.tier === "team"
                              ? "from-green-500 to-emerald-500"
                              : "from-amber-500 to-orange-500"
                        }`}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && (
          <EditPlanModal
            isOpen={showEditModal}
            plan={selectedPlan}
            onClose={() => {
              setShowEditModal(false);
              setSelectedPlan(null);
            }}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}

export default AdminPlansPage;
