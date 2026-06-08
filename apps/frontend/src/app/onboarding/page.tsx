"use client";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/customUI/form/FloatingInput";
import { useUpdateOnboardingMutation } from "@/redux/auth/authApi";
import { useProtectedRoute } from "@/hooks/useAuthGuard";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Clock,
  FileText,
  Lightbulb,
  Pause,
  Play,
  PlayCircle,
  Sparkles,
  Upload,
  Users,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

const videoTutorials = [
  {
    id: 1,
    title: "Getting Started with ScholarFlow",
    duration: "3:24",
    thumbnail:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop",
    category: "basics",
  },
  {
    id: 2,
    title: "Uploading and Organizing Papers",
    duration: "5:12",
    thumbnail:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=225&fit=crop",
    category: "basics",
  },
  {
    id: 3,
    title: "Using AI-Powered Insights",
    duration: "4:45",
    thumbnail:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=225&fit=crop",
    category: "advanced",
  },
  {
    id: 4,
    title: "Team Collaboration Features",
    duration: "6:30",
    thumbnail:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=225&fit=crop",
    category: "team",
  },
];

const demoSteps = [
  { title: "Upload a Paper", description: "Drag and drop or click to upload", icon: Upload },
  { title: "AI Analysis", description: "Watch AI extract insights automatically", icon: Sparkles },
  { title: "Organize", description: "Add to collections and tag papers", icon: FileText },
  { title: "Collaborate", description: "Share with your team", icon: Users },
];

const steps: OnboardingStep[] = ["welcome", "role", "workspace", "complete"];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceDescription, setWorkspaceDescription] = useState("");
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<(typeof videoTutorials)[0] | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showInteractiveDemo, setShowInteractiveDemo] = useState(false);
  const [demoStep, setDemoStep] = useState(0);

  const router = useRouter();
  const { isLoading: authLoading, isAuthenticated } = useProtectedRoute();
  const [updateOnboarding, { isLoading }] = useUpdateOnboardingMutation();

  const currentStepIndex = steps.indexOf(currentStep);

  useEffect(() => {
    const savedProgress = localStorage.getItem("scholarflow_onboarding");
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        if (progress.step) setCurrentStep(progress.step);
        if (progress.role) setSelectedRole(progress.role);
        if (progress.workspaceName) setWorkspaceName(progress.workspaceName);
        if (progress.workspaceDescription) setWorkspaceDescription(progress.workspaceDescription);
      } catch {
        // ignore parse error
      }
    }
  }, []);

  useEffect(() => {
    const progress = {
      step: currentStep,
      role: selectedRole,
      workspaceName,
      workspaceDescription,
    };
    localStorage.setItem("scholarflow_onboarding", JSON.stringify(progress));
  }, [currentStep, selectedRole, workspaceName, workspaceDescription]);

  const clearProgress = () => {
    localStorage.removeItem("scholarflow_onboarding");
  };

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
      clearProgress();
      router.push("/dashboard");
    } catch {
      clearProgress();
      router.push("/dashboard");
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleVideoClick = (video: (typeof videoTutorials)[0]) => {
    setSelectedVideo(video);
    setShowVideoModal(true);
    setIsVideoPlaying(true);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="fixed top-0 left-0 right-0 h-1 bg-muted z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-chart-1"
          initial={{ width: "0%" }}
          animate={{
            width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
          }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <AnimatePresence>
        {showVideoModal && selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setShowVideoModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-2xl overflow-hidden max-w-3xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video bg-black">
                <img
                  src={selectedVideo.thumbnail}
                  alt={selectedVideo.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-16 w-16 rounded-full bg-white/20 border-white/30 hover:bg-white/30"
                    onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                  >
                    {isVideoPlaying ? (
                      <Pause className="h-8 w-8 text-white" />
                    ) : (
                      <Play className="h-8 w-8 text-white" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{selectedVideo.title}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {selectedVideo.duration}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setShowVideoModal(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 pt-12">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {currentStep === "welcome" && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                <div className="mb-8">
                  <motion.div
                    className="h-20 w-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-chart-1/20 border border-primary/30 flex items-center justify-center"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Sparkles className="h-10 w-10 text-primary" />
                  </motion.div>
                  <h1 className="text-4xl font-bold tracking-tight mb-4">
                    Welcome to ScholarFlow
                  </h1>
                  <p className="text-xl text-muted-foreground max-w-md mx-auto">
                    Your AI-powered research paper collaboration hub. Let&apos;s get
                    you set up in just a few steps.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  {[
                    { icon: Upload, title: "Upload Papers", description: "Import PDFs and documents" },
                    { icon: Sparkles, title: "AI Insights", description: "Get intelligent summaries" },
                    { icon: Users, title: "Collaborate", description: "Work with your team" },
                  ].map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="rounded-xl border bg-card p-4"
                    >
                      <feature.icon className="h-8 w-8 text-primary mb-2 mx-auto" />
                      <h3 className="font-medium">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </motion.div>
                  ))}
                </div>

                <Button
                  size="lg"
                  onClick={handleNext}
                  className="px-8 bg-gradient-to-r from-primary to-chart-1 hover:from-primary/90 hover:to-chart-1/90 text-primary-foreground font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>

                <div className="mt-8">
                  <button
                    onClick={() => setShowInteractiveDemo(!showInteractiveDemo)}
                    className="text-sm text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-2"
                  >
                    <PlayCircle className="h-4 w-4" />
                    {showInteractiveDemo ? "Hide" : "See"} interactive demo
                  </button>
                </div>

                <AnimatePresence>
                  {showInteractiveDemo && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 overflow-hidden"
                    >
                      <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border p-6">
                        <div className="flex justify-between items-center mb-4">
                          {demoSteps.map((step, index) => (
                            <div
                              key={index}
                              className={`flex flex-col items-center cursor-pointer transition-all ${
                                index === demoStep ? "scale-110" : "opacity-50"
                              }`}
                              onClick={() => setDemoStep(index)}
                            >
                              <motion.div
                                animate={{
                                  backgroundColor:
                                    index === demoStep ? "hsl(var(--primary))" : "transparent",
                                }}
                                className={`h-10 w-10 rounded-full border-2 flex items-center justify-center ${
                                  index === demoStep
                                    ? "border-primary"
                                    : "border-muted-foreground/30"
                                }`}
                              >
                                <step.icon
                                  className={`h-5 w-5 ${index === demoStep ? "text-primary-foreground" : "text-muted-foreground"}`}
                                />
                              </motion.div>
                            </div>
                          ))}
                        </div>

                        <motion.div
                          key={demoStep}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-center py-8 bg-muted/30 rounded-lg"
                        >
                          {(() => {
                            const IconComponent = demoSteps[demoStep].icon;
                            return <IconComponent className="h-12 w-12 text-primary mx-auto mb-3" />;
                          })()}
                          <h4 className="font-semibold">{demoSteps[demoStep].title}</h4>
                          <p className="text-sm text-muted-foreground">{demoSteps[demoStep].description}</p>
                        </motion.div>

                        <div className="flex justify-center gap-2 mt-4">
                          {demoSteps.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setDemoStep(index)}
                              className={`h-2 rounded-full transition-all ${
                                index === demoStep ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-8">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">
                    Watch video tutorials
                  </h3>
                  <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                    {videoTutorials.slice(0, 2).map((video) => (
                      <button
                        key={video.id}
                        onClick={() => handleVideoClick(video)}
                        className="group relative rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-all"
                      >
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-20 object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <PlayCircle className="h-8 w-8 text-white" />
                        </div>
                        <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                          {video.duration}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === "role" && (
              <motion.div
                key="role"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold tracking-tight mb-2">Choose your plan</h2>
                  <p className="text-muted-foreground">Select the plan that best fits your research needs</p>
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
                            <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
                            <ul className="mt-3 grid grid-cols-2 gap-1">
                              {role.features.map((feature) => (
                                <li key={feature} className="flex items-center gap-2 text-sm">
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
                        <h4 className="font-medium text-sm">{roleSpecificTips[selectedRole].title}</h4>
                      </div>
                      <ul className="space-y-2">
                        {roleSpecificTips[selectedRole].tips.map((tip, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
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

            {currentStep === "workspace" && (
              <motion.div
                key="workspace"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold tracking-tight mb-2">Create your first workspace</h2>
                  <p className="text-muted-foreground">Workspaces help you organize your research projects</p>
                </div>

                <div className="space-y-6 mb-8">
                  <FloatingInput
                    label="Workspace Name"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    placeholder="e.g., AI Research Lab, PhD Thesis Project"
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
                        <h3 className="font-medium">{workspaceName || "Your Workspace"}</h3>
                        <p className="text-sm text-muted-foreground">{workspaceDescription || "No description provided"}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">You can invite team members and add papers after setup</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
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
                          <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
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

            {currentStep === "complete" && (
              <motion.div
                key="complete"
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
                  <h1 className="text-4xl font-bold tracking-tight mb-4">You&apos;re all set!</h1>
                  <p className="text-xl text-muted-foreground max-w-md mx-auto">
                    Your account is ready. Start exploring ScholarFlow and supercharge your research.
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

                <div className="rounded-xl border bg-card p-6 mb-8 text-left">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <PlayCircle className="h-5 w-5 text-primary" />
                    Video Tutorials
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {videoTutorials.map((video, index) => (
                      <motion.button
                        key={video.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        onClick={() => handleVideoClick(video)}
                        className="group relative rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-all text-left"
                      >
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-20 object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <PlayCircle className="h-8 w-8 text-white" />
                        </div>
                        <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                          {video.duration}
                        </div>
                        <div className="p-2">
                          <p className="text-xs font-medium truncate">{video.title}</p>
                        </div>
                      </motion.button>
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
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
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
