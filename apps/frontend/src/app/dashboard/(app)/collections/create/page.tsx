"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateCollectionMutation } from "@/redux/api/collectionApi";
import { useListWorkspacesQuery } from "@/redux/api/workspaceApi";
import { showSuccessToast, showErrorToast } from "@/components/providers/ToastProvider";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Folder, Globe, Loader2, Lock, Palette, Plus, Users, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const COLORS = [
  { key: "blue", bg: "bg-blue-500" }, { key: "purple", bg: "bg-purple-500" },
  { key: "green", bg: "bg-green-500" }, { key: "orange", bg: "bg-orange-500" },
  { key: "pink", bg: "bg-pink-500" }, { key: "indigo", bg: "bg-indigo-500" },
];

const VISIBILITIES = [
  { key: "PRIVATE", label: "Private", desc: "Only you can access", icon: Lock },
  { key: "TEAM", label: "Team", desc: "Your workspace can access", icon: Users },
  { key: "PUBLIC", label: "Public", desc: "Anyone with the link", icon: Globe },
];

export default function CreateCollectionPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedVisibility, setSelectedVisibility] = useState("PRIVATE");
  const [selectedColor, setSelectedColor] = useState("blue");
  const [selectedWorkspace, setSelectedWorkspace] = useState("");
  const [tags, setTags] = useState("");

  const { data: workspacesData } = useListWorkspacesQuery({ page: 1, limit: 50, scope: "all" });
  const [createCollection, { isLoading }] = useCreateCollectionMutation();
  const workspaces = workspacesData?.data || [];

  const handleCreate = async () => {
    if (!name.trim() || !selectedWorkspace) { showErrorToast("Name and workspace required"); return; }
    try {
      const tagList = tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
      await createCollection({
        name: name.trim(), description: description.trim() || undefined,
        workspaceId: selectedWorkspace, visibility: selectedVisibility as any,
        isPublic: selectedVisibility === "PUBLIC", color: selectedColor, tags: tagList,
      }).unwrap();
      showSuccessToast("Collection created");
      router.push("/dashboard/collections");
    } catch (e: any) { showErrorToast(e?.data?.message || "Failed to create"); }
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/collections" className="inline-flex items-center px-3 py-2 text-sm border rounded-lg hover:bg-muted"><ArrowLeft className="mr-2 h-4 w-4" />Back</Link>
        <div><h1 className="text-3xl font-bold tracking-tight">Create Collection</h1><p className="text-muted-foreground">Organize your research with a new collection</p></div>
      </div>

      {/* Step progress */}
      <div className="flex items-center gap-2">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium", step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>{step > s ? <Check className="h-4 w-4" /> : s}</div>
            <div className={cn("flex-1 h-1 rounded", s < 2 ? (step > s ? "bg-primary" : "bg-muted") : "hidden")} />
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Card>
              <CardHeader><CardTitle className="text-lg">Basic Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div><label className="text-sm font-medium mb-1 block">Collection Name</label><Input placeholder="e.g., Machine Learning Research" value={name} onChange={(e) => setName(e.target.value)} /></div>
                <div><label className="text-sm font-medium mb-1 block">Description</label><Textarea placeholder="What is this collection about?" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} /></div>
                <div><label className="text-sm font-medium mb-1 block">Workspace</label>
                  <select value={selectedWorkspace} onChange={(e) => setSelectedWorkspace(e.target.value)} className="w-full h-10 px-3 rounded-lg border bg-background text-sm">
                    <option value="">Select workspace...</option>
                    {workspaces.map((w: any) => (<option key={w.id} value={w.id}>{w.name}</option>))}
                  </select>
                </div>
                <div><label className="text-sm font-medium mb-1 block">Tags</label><Input placeholder="machine-learning, research, NLP" value={tags} onChange={(e) => setTags(e.target.value)} /></div>
                <Button onClick={() => setStep(2)} className="w-full">Next <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Card>
              <CardHeader><CardTitle className="text-lg">Visibility & Color</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Visibility</label>
                  <div className="grid grid-cols-3 gap-3">
                    {VISIBILITIES.map((v) => (
                      <button key={v.key} onClick={() => setSelectedVisibility(v.key)}
                        className={cn("flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors", selectedVisibility === v.key ? "border-primary bg-primary/5" : "hover:border-primary/50")}>
                        <v.icon className="h-5 w-5" /><span className="text-sm font-medium">{v.label}</span><span className="text-xs text-muted-foreground">{v.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Color</label>
                  <div className="flex gap-3">
                    {COLORS.map((c) => (
                      <button key={c.key} onClick={() => setSelectedColor(c.key)}
                        className={cn("w-10 h-10 rounded-full border-2 transition-all", c.bg, selectedColor === c.key ? "ring-2 ring-offset-2 ring-primary scale-110" : "")} />
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1"><ArrowLeft className="mr-2 h-4 w-4" />Back</Button>
                  <Button onClick={handleCreate} disabled={isLoading} className="flex-1">
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</> : <>Create Collection</>}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function cn(...classes: (string | undefined | null | false)[]): string { return classes.filter(Boolean).join(" "); }
