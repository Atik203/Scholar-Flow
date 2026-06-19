"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Building2, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAppSelector } from "@/redux/hooks";
import { selectAccessToken } from "@/redux/auth/authSlice";
import { useCreateWorkspaceMutation, type WorkspaceColor } from "@/redux/api/workspaceApi";
import { showSuccessToast, showErrorToast } from "@/components/providers/ToastProvider";

const COLORS: { value: WorkspaceColor; hex: string }[] = [
  { value: "blue", hex: "#3b82f6" },
  { value: "purple", hex: "#8b5cf6" },
  { value: "green", hex: "#22c55e" },
  { value: "orange", hex: "#f97316" },
  { value: "pink", hex: "#ec4899" },
];

export default function WorkspaceOnboardingPage() {
  const router = useRouter();
  const accessToken = useAppSelector(selectAccessToken);
  const [createWorkspace, { isLoading }] = useCreateWorkspaceMutation();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState<WorkspaceColor>("blue");

  useEffect(() => {
    if (!accessToken) router.push("/login");
  }, [accessToken, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await createWorkspace({ name: name.trim(), color }).unwrap();
      showSuccessToast("Workspace created", "Redirecting to your dashboard...");
      setTimeout(() => router.push("/dashboard"), 800);
    } catch {
      showErrorToast("Failed to create workspace", "Please try again");
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
        className="w-full max-w-lg"
      >
        <div className="text-center mb-8">
          <div className="h-14 w-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-chart-1/20 border border-primary/30 flex items-center justify-center">
            <Building2 className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Create your workspace</h1>
          <p className="text-muted-foreground">
            Workspaces let you organize papers and collaborate with your team.
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Workspace name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., AI Research Lab, PhD Thesis"
                maxLength={100}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe your research focus..."
                maxLength={280}
              />
            </div>
            <div className="space-y-2.5">
              <Label className="flex items-center gap-1.5">
                <Palette className="h-4 w-4" />Color
              </Label>
              <div className="flex gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setColor(c.value)}
                    className={`h-9 w-9 rounded-full border-2 transition-all duration-150 ${
                      color === c.value
                        ? "border-foreground scale-110 shadow-md"
                        : "border-transparent hover:scale-105"
                    }`}
                    style={{ backgroundColor: c.hex }}
                    aria-label={c.value}
                  />
                ))}
              </div>
              <Badge variant="outline" className="text-xs capitalize">{color}</Badge>
            </div>
            <div className="flex items-center justify-between pt-2">
              <Button variant="ghost" type="button" onClick={() => router.push("/onboarding/role")}>
                <ArrowLeft className="h-4 w-4 mr-2" />Back
              </Button>
              <Button
                type="submit"
                size="lg"
                disabled={!name.trim() || isLoading}
                className="px-8 bg-gradient-to-r from-primary to-chart-1 hover:from-primary/90 hover:to-chart-1/90 text-primary-foreground font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
              >
                {isLoading ? (
                  <><div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />Creating...</>
                ) : (
                  <>Create workspace<ArrowRight className="h-4 w-4 ml-2" /></>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
