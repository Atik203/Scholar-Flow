"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowRight, BookOpen, FlaskConical, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectAccessToken, updateUser } from "@/redux/auth/authSlice";
import { useUpdateOnboardingMutation } from "@/redux/auth/authApi";
import { showErrorToast } from "@/components/providers/ToastProvider";

type RoleId = "RESEARCHER" | "PRO_RESEARCHER" | "TEAM_LEAD";

const ROLE_OPTIONS = [
  {
    id: "RESEARCHER" as RoleId,
    title: "Researcher",
    subtitle: "Free plan for individuals",
    icon: BookOpen,
    gradient: "from-blue-500/20 to-cyan-500/20",
    features: ["Up to 10 papers", "Basic AI analysis", "1 workspace"],
  },
  {
    id: "PRO_RESEARCHER" as RoleId,
    title: "Pro Researcher",
    subtitle: "For serious scholars",
    icon: FlaskConical,
    gradient: "from-purple-500/20 to-pink-500/20",
    features: ["Unlimited papers", "Advanced AI", "5 workspaces", "Semantic search"],
  },
  {
    id: "TEAM_LEAD" as RoleId,
    title: "Team Lead",
    subtitle: "For research teams",
    icon: Users,
    gradient: "from-orange-500/20 to-rose-500/20",
    features: ["Unlimited everything", "Team management", "Role-based access", "Admin dashboard", "API access"],
  },
];

export default function RoleSelectionPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector(selectAccessToken);
  const [selected, setSelected] = useState<RoleId | null>(null);
  const [updateOnboarding, { isLoading }] = useUpdateOnboardingMutation();

  useEffect(() => {
    if (!accessToken) router.push("/login");
  }, [accessToken, router]);

  const handleSubmit = async () => {
    if (!selected) return;
    try {
      dispatch(updateUser({ role: selected }));
      await updateOnboarding({ onboardingCompleted: false, onboardingStep: 1 }).unwrap();
      router.push("/onboarding/workspace");
    } catch {
      showErrorToast("Failed to save role", "Please try again");
    }
  };

  if (!accessToken) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl font-bold tracking-tight mb-2">Choose your role</h1>
        <p className="text-muted-foreground">
          Select a plan that fits your research. You can upgrade anytime.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-4xl">
        {ROLE_OPTIONS.map((role, i) => (
          <motion.div
            key={role.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card
              onClick={() => setSelected(role.id)}
              className={`relative cursor-pointer border-2 p-6 h-full transition-all duration-200 hover:shadow-lg ${
                selected === role.id
                  ? "border-primary shadow-md shadow-primary/10"
                  : "border-border hover:border-muted-foreground/30"
              }`}
            >
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${role.gradient} opacity-50`} />
              <div className="relative">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <role.icon className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-lg font-semibold mb-0.5">{role.title}</h2>
                <p className="text-sm text-muted-foreground mb-4">{role.subtitle}</p>
                <ul className="space-y-2">
                  {role.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                {selected === role.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center"
                  >
                    <svg className="h-3.5 w-3.5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {selected && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-10">
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-10 bg-gradient-to-r from-primary to-chart-1 hover:from-primary/90 hover:to-chart-1/90 text-primary-foreground font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
          >
            {isLoading ? (
              <><div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />Saving...</>
            ) : (
              <>Continue<ArrowRight className="h-4 w-4 ml-2" /></>
            )}
          </Button>
        </motion.div>
      )}
    </div>
  );
}
