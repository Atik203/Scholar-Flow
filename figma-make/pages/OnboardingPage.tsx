"use client";

import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  Sparkles,
  Upload,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Button } from "../../components/ui/button";

// ============================================================================
// Types
// ============================================================================
interface OnboardingPageProps {
  onNavigate?: (path: string) => void;
  onComplete?: () => void;
}

type OnboardingStep = "welcome" | "role" | "workspace" | "complete";

interface RoleOption {
  id: "researcher" | "pro_researcher" | "team_lead";
  name: string;
  description: string;
  features: string[];
  icon: React.ElementType;
  recommended?: boolean;
}

// ============================================================================
// Role Options
// ============================================================================
const roleOptions: RoleOption[] = [
  {
    id: "researcher",
    name: "Researcher",
    description: "Perfect for individual researchers getting started",
    features: [
      "Up to 10 papers per month",
      "Basic AI summaries",
      "Personal workspace",
      "Community support",
    ],
    icon: BookOpen,
  },
  {
    id: "pro_researcher",
    name: "Pro Researcher",
    description: "For active researchers who need more power",
    features: [
      "Unlimited papers",
      "Advanced AI insights",
      "Team collaboration (5 members)",
      "Priority support",
      "Export capabilities",
    ],
    icon: Zap,
    recommended: true,
  },
  {
    id: "team_lead",
    name: "Team Lead",
    description: "For research teams and lab managers",
    features: [
      "Everything in Pro",
      "Unlimited team members",
      "Team analytics",
      "SSO integration",
      "Dedicated account manager",
    ],
    icon: Users,
  },
];

// ============================================================================
// Onboarding Page Component
// ============================================================================
export function OnboardingPage({
  onNavigate,
  onComplete,
}: OnboardingPageProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceDescription, setWorkspaceDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const steps: OnboardingStep[] = ["welcome", "role", "workspace", "complete"];
  const currentStepIndex = steps.indexOf(currentStep);

  const handleNext = () => {
    if (currentStep === "welcome") {
      setCurrentStep("role");
    } else if (currentStep === "role" && selectedRole) {
      setCurrentStep("workspace");
    } else if (currentStep === "workspace" && workspaceName) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        setCurrentStep("complete");
      }, 1500);
    } else if (currentStep === "complete") {
      onComplete?.();
      onNavigate?.("/dashboard");
    }
  };

  const handleSkip = () => {
    if (currentStep === "workspace") {
      setCurrentStep("complete");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-muted z-50">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: "0%" }}
          animate={{
            width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
          }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-2xl">
          {/* Welcome Step */}
          {currentStep === "welcome" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div className="mb-8">
                <div className="h-20 w-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-chart-1/20 border border-primary/30 flex items-center justify-center">
                  <Sparkles className="h-10 w-10 text-primary" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight mb-4">
                  Welcome to ScholarFlow
                </h1>
                <p className="text-xl text-muted-foreground max-w-md mx-auto">
                  Your AI-powered research paper collaboration hub. Let's get
                  you set up in just a few steps.
                </p>
              </div>

              {/* Features Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                  {
                    icon: Upload,
                    title: "Upload Papers",
                    description: "Import PDFs and documents",
                  },
                  {
                    icon: Sparkles,
                    title: "AI Insights",
                    description: "Get intelligent summaries",
                  },
                  {
                    icon: Users,
                    title: "Collaborate",
                    description: "Work with your team",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="rounded-xl border bg-card p-4"
                  >
                    <feature.icon className="h-8 w-8 text-primary mb-2" />
                    <h3 className="font-medium">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>

              <Button size="lg" onClick={handleNext} className="px-8">
                Get Started
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </motion.div>
          )}

          {/* Role Selection Step */}
          {currentStep === "role" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold tracking-tight mb-2">
                  Choose your plan
                </h2>
                <p className="text-muted-foreground">
                  Select the plan that best fits your research needs
                </p>
              </div>

              <div className="grid gap-4 mb-8">
                {roleOptions.map((role, index) => (
                  <motion.div
                    key={role.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <button
                      onClick={() => setSelectedRole(role.id)}
                      className={`w-full p-6 rounded-xl border-2 text-left transition-all ${
                        selectedRole === role.id
                          ? "border-primary bg-primary/5 shadow-lg"
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                            selectedRole === role.id
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <role.icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">
                              {role.name}
                            </h3>
                            {role.recommended && (
                              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                Recommended
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {role.description}
                          </p>
                          <ul className="mt-3 space-y-1">
                            {role.features.map((feature) => (
                              <li
                                key={feature}
                                className="flex items-center gap-2 text-sm"
                              >
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div
                          className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                            selectedRole === role.id
                              ? "border-primary bg-primary"
                              : "border-muted-foreground"
                          }`}
                        >
                          {selectedRole === role.id && (
                            <CheckCircle className="h-4 w-4 text-primary-foreground" />
                          )}
                        </div>
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-end">
                <Button
                  size="lg"
                  onClick={handleNext}
                  disabled={!selectedRole}
                  className="px-8"
                >
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Workspace Creation Step */}
          {currentStep === "workspace" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold tracking-tight mb-2">
                  Create your first workspace
                </h2>
                <p className="text-muted-foreground">
                  Workspaces help you organize your research projects
                </p>
              </div>

              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Workspace Name
                  </label>
                  <input
                    type="text"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    placeholder="e.g., AI Research Lab, PhD Thesis Project"
                    className="w-full px-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    value={workspaceDescription}
                    onChange={(e) => setWorkspaceDescription(e.target.value)}
                    placeholder="Briefly describe your research focus..."
                    rows={3}
                    className="w-full px-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                  />
                </div>

                {/* Workspace Preview */}
                <div className="rounded-xl border bg-muted/50 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {workspaceName || "Your Workspace"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {workspaceDescription || "No description provided"}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    You can invite team members and add papers after setup
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={handleSkip}>
                  Skip for now
                </Button>
                <Button
                  size="lg"
                  onClick={handleNext}
                  disabled={!workspaceName || isLoading}
                  className="px-8"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating...
                    </div>
                  ) : (
                    <>
                      Create Workspace
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Complete Step */}
          {currentStep === "complete" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="h-20 w-20 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center"
                >
                  <CheckCircle className="h-10 w-10 text-green-500" />
                </motion.div>
                <h1 className="text-4xl font-bold tracking-tight mb-4">
                  You're all set! 🎉
                </h1>
                <p className="text-xl text-muted-foreground max-w-md mx-auto">
                  Your account is ready. Start exploring ScholarFlow and
                  supercharge your research.
                </p>
              </div>

              {/* Quick Start Guide */}
              <div className="rounded-xl border bg-card p-6 mb-8 text-left">
                <h3 className="font-semibold mb-4">Quick Start Guide</h3>
                <div className="space-y-3">
                  {[
                    {
                      step: 1,
                      title: "Upload your first paper",
                      description: "Import a PDF or document to get started",
                    },
                    {
                      step: 2,
                      title: "Get AI insights",
                      description:
                        "Ask questions and get intelligent summaries",
                    },
                    {
                      step: 3,
                      title: "Organize with collections",
                      description: "Group related papers for easy access",
                    },
                    {
                      step: 4,
                      title: "Invite collaborators",
                      description: "Share your workspace with team members",
                    },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-primary">
                          {item.step}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button size="lg" onClick={handleNext} className="px-8">
                Go to Dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Step Indicator */}
      {currentStep !== "complete" && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-2">
            {steps.slice(0, -1).map((step, index) => (
              <div
                key={step}
                className={`h-2 rounded-full transition-all ${
                  index <= currentStepIndex ? "w-8 bg-primary" : "w-2 bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
