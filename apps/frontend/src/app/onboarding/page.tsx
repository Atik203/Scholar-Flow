"use client";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/customUI/form/FloatingInput";
import { useAuth } from "@/redux/auth/useAuth";
import { useUpdateOnboardingMutation } from "@/redux/auth/authApi";
import { useProtectedRoute } from "@/hooks/useAuthGuard";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Lightbulb,
  Loader2,
  Sparkles,
  Upload,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type OnboardingStep = "welcome" | "role" | "workspace" | "complete";

interface RoleOption {
  id: string;
  name: string;
  description: string;
  features: string[];
  icon: React.ElementType;
  recommended?: boolean;
}

const roleOptions: RoleOption[] = [
  {
    id: "RESEARCHER",
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
    id: "PRO_RESEARCHER",
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
    id: "TEAM_LEAD",
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

const roleSpecificTips: Record<string, { title: string; tips: string[] }> = {
  RESEARCHER: {
    title: "Tips for Individual Researchers",
    tips: [
      "Start by uploading your most important papers",
      "Use tags to organize papers by topic or project",
      "Try the AI summary feature to quickly understand new papers",
      "Set up reading reminders to stay consistent",
    ],
  },
  PRO_RESEARCHER: {
    title: "Pro Features to Explore",
    tips: [
      "Connect with up to 5 collaborators in your workspace",
      "Use advanced search to find papers by concept, not just keywords",
      "Export your library to popular citation formats",
      "Set up custom AI prompts for your research field",
    ],
  },
  TEAM_LEAD: {
    title: "Team Management Best Practices",
    tips: [
      "Create separate workspaces for different projects",
      "Use team analytics to track research progress",
      "Set up SSO for easy team member access",
      "Assign paper review tasks to team members",
    ],
  },
};

const steps: OnboardingStep[] = ["welcome", "role", "workspace", "complete"];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceDescription, setWorkspaceDescription] = useState("");
  const [videoOpen, setVideoOpen] = useState(false);

  const router = useRouter();
  const { isLoading: authLoading, isAuthenticated } = useProtectedRoute();
  const [updateOnboarding, { isLoading }] = useUpdateOnboardingMutation();

  const currentStepIndex = steps.indexOf(currentStep);

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
    }
  };

  const handleComplete = async () => {
    try {
      await updateOnboarding({
        onboardingCompleted: true,
        onboardingStep: 4,
      }).unwrap();
      router.push("/dashboard");
    } catch {
      router.push("/dashboard");
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  // Auth loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const currentStepIndex_0 = currentStepIndex;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Skip for now
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {steps.slice(0, -1).map((step, index) => (
                <div
                  key={step}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    index <= currentStepIndex_0
                      ? "w-8 bg-primary"
                      : "w-2 bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="min-h-[500px]">
          <AnimatePresence mode="wait">
            {/* Welcome Step */}
            {currentStep === "welcome" && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center max-w-xl mx-auto"
              >
                <div className="mb-8">
                  <div className="h-20 w-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-primary/20 to-chart-1/20 border border-primary/30 flex items-center justify-center">
                    <Sparkles className="h-10 w-10 text-primary" />
                  </div>
                  <h1 className="text-4xl font-bold tracking-tight mb-3">
                    Welcome to ScholarFlow
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    Let&apos;s get you set up in just a few steps. We&apos;ll help
                    you configure your account for the best research experience.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[
                    { icon: Upload, label: "Upload papers" },
                    { icon: Zap, label: "AI insights" },
                    { icon: Users, label: "Collaborate" },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="p-4 rounded-xl border border-border bg-card"
                    >
                      <item.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <p className="text-sm font-medium">{item.label}</p>
                    </motion.div>
                  ))}
                </div>

                <Button
                  size="lg"
                  onClick={handleNext}
                  className="px-12 bg-gradient-to-r from-primary to-chart-1 hover:from-primary/90 hover:to-chart-1/90 text-primary-foreground font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </motion.div>
            )}

            {/* Role Selection Step */}
            {currentStep === "role" && (
              <motion.div
                key="role"
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
                        type="button"
                        onClick={() => setSelectedRole(role.id)}
                        className={`w-full p-6 rounded-xl border-2 text-left transition-all ${
                          selectedRole === role.id
                            ? "border-primary bg-primary/5 shadow-lg"
                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              selectedRole === role.id
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <role.icon className="h-6 w-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">{role.name}</h3>
                              {role.recommended ? (
                                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                  Recommended
                                </span>
                              ) : null}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {role.description}
                            </p>
                            <ul className="mt-3 grid grid-cols-2 gap-1">
                              {role.features.map((feature) => (
                                <li
                                  key={feature}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                  <span className="truncate">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div
                            className={`h-6 w-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                              selectedRole === role.id
                                ? "border-primary bg-primary"
                                : "border-muted-foreground"
                            }`}
                          >
                            {selectedRole === role.id ? (
                              <CheckCircle className="h-4 w-4 text-primary-foreground" />
                            ) : null}
                          </div>
                        </div>
                      </button>
                    </motion.div>
                  ))}
                </div>

                <AnimatePresence>
                  {selectedRole && roleSpecificTips[selectedRole] ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-xl"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Lightbulb className="h-4 w-4 text-primary" />
                        <h4 className="font-medium text-sm">
                          {roleSpecificTips[selectedRole].title}
                        </h4>
                      </div>
                      <ul className="space-y-2">
                        {roleSpecificTips[selectedRole].tips.map((tip, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <div className="flex justify-between">
                  <Button variant="ghost" onClick={handleBack}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleNext}
                    disabled={!selectedRole}
                    className="px-8 bg-gradient-to-r from-primary to-chart-1 hover:from-primary/90 hover:to-chart-1/90 text-primary-foreground font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
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
                key="workspace"
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

                <div className="max-w-md mx-auto space-y-6 mb-8">
                  <FloatingInput
                    label="Workspace Name"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    placeholder="e.g., AI Research Lab"
                    required
                  />

                  <div className="relative">
                    <textarea
                      value={workspaceDescription}
                      onChange={(e) => setWorkspaceDescription(e.target.value)}
                      placeholder="Briefly describe your research focus..."
                      rows={3}
                      className="w-full px-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none text-sm"
                    />
                  </div>

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
                    <p className="text-xs text-muted-foreground">
                      You can invite team members and add papers after setup
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between max-w-md mx-auto">
                  <Button variant="ghost" onClick={handleBack}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" onClick={() => handleNext()}>
                      Skip for now
                    </Button>
                    <Button
                      size="lg"
                      onClick={handleNext}
                      disabled={!workspaceName || isLoading}
                      className="px-8 bg-gradient-to-r from-primary to-chart-1 hover:from-primary/90 hover:to-chart-1/90 text-primary-foreground font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Creating...
                        </>
                      ) : (
                        <>
                          Continue
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Complete Step */}
            {currentStep === "complete" && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center max-w-xl mx-auto"
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
                    You&apos;re all set!
                  </h1>
                  <p className="text-xl text-muted-foreground max-w-md mx-auto">
                    Your account is ready. Start exploring ScholarFlow and supercharge
                    your research.
                  </p>
                </div>

                <div className="rounded-xl border bg-card p-6 mb-6 text-left">
                  <h3 className="font-semibold mb-4">Quick Start Guide</h3>
                  <div className="space-y-3">
                    {[
                      { step: 1, title: "Upload your first paper", description: "Import a PDF or document to get started" },
                      { step: 2, title: "Get AI insights", description: "Ask questions and get intelligent summaries" },
                      { step: 3, title: "Organize with collections", description: "Group related papers for easy access" },
                      { step: 4, title: "Invite collaborators", description: "Share your workspace with team members" },
                    ].map((item) => (
                      <motion.div
                        key={item.step}
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: item.step * 0.1 }}
                      >
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-medium text-primary">{item.step}</span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <Button
                  size="lg"
                  onClick={handleComplete}
                  disabled={isLoading}
                  className="px-12 bg-gradient-to-r from-primary to-chart-1 hover:from-primary/90 hover:to-chart-1/90 text-primary-foreground font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Go to Dashboard
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
