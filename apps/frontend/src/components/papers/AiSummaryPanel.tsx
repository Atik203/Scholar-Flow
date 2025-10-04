"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { formatDistanceToNow } from "date-fns";
import {
  AlertCircle,
  Bot,
  Clock,
  Lightbulb,
  RefreshCw,
  Settings2,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import {
  showErrorToast,
  showSuccessToast,
} from "@/components/providers/ToastProvider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useMutationErrorHandler } from "@/hooks/useErrorHandler";
import { aiSchemas, GenerateSummaryFormInput } from "@/lib/validators";
import {
  PaperSummaryRequest,
  PaperSummaryResponse,
  useGeneratePaperSummaryMutation,
} from "@/redux/api/paperApi";

const DEFAULT_OPTIONS: PaperSummaryRequest = {
  tone: "academic",
  audience: "researcher",
  wordLimit: 220,
};

const MAX_FOCUS_AREAS = 5;

const AI_TONE_OPTIONS = [
  { value: "academic", label: "Academic" },
  { value: "technical", label: "Technical" },
  { value: "executive", label: "Executive" },
  { value: "casual", label: "Casual" },
  { value: "conversational", label: "Conversational" },
] as const;

const AI_AUDIENCE_OPTIONS = [
  { value: "researcher", label: "Researcher" },
  { value: "student", label: "Student" },
  { value: "executive", label: "Executive" },
  { value: "general", label: "General" },
] as const;

interface AiSummaryPanelProps {
  paperId: string;
  paperTitle?: string;
}

export const AiSummaryPanel = ({
  paperId,
  paperTitle,
}: AiSummaryPanelProps) => {
  const aiEnabled = useMemo(
    () => process.env.NEXT_PUBLIC_AI_ASSISTANT_ENABLED !== "false",
    []
  );

  const [summary, setSummary] = useState<PaperSummaryResponse | null>(null);
  const [lastRequest, setLastRequest] =
    useState<PaperSummaryRequest>(DEFAULT_OPTIONS);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [hasAttemptedInitialLoad, setHasAttemptedInitialLoad] = useState(false);
  const [focusDraft, setFocusDraft] = useState("");

  const [generateSummary, generateState] = useGeneratePaperSummaryMutation();
  useMutationErrorHandler(generateState, undefined, { showToast: true });

  const form = useForm<GenerateSummaryFormInput>({
    resolver: zodResolver(aiSchemas.generateSummary),
    defaultValues: {
      instructions: "",
      focusAreas: [],
      tone: DEFAULT_OPTIONS.tone,
      audience: DEFAULT_OPTIONS.audience,
      language: "",
      wordLimit: DEFAULT_OPTIONS.wordLimit,
      refresh: false,
    },
  });

  const focusAreas = form.watch("focusAreas") || [];

  const applyFocusArea = () => {
    const trimmed = focusDraft.trim();
    if (!trimmed) {
      return;
    }

    if (focusAreas.includes(trimmed)) {
      showErrorToast("Focus area already added");
      setFocusDraft("");
      return;
    }

    if (focusAreas.length >= MAX_FOCUS_AREAS) {
      showErrorToast(`You can only add up to ${MAX_FOCUS_AREAS} focus areas`);
      return;
    }

    const nextFocusAreas = [...focusAreas, trimmed];
    form.setValue("focusAreas", nextFocusAreas, {
      shouldDirty: true,
      shouldValidate: true,
      shouldTouch: true,
    });
    setFocusDraft("");
  };

  const removeFocusArea = (value: string) => {
    const nextFocusAreas = focusAreas.filter((item) => item !== value);
    form.setValue("focusAreas", nextFocusAreas, {
      shouldDirty: true,
      shouldValidate: true,
      shouldTouch: true,
    });
  };

  const runSummary = async (input: PaperSummaryRequest) => {
    try {
      const result = await generateSummary({ paperId, input }).unwrap();
      setSummary(result);
      const { refresh: _refresh, ...persistedOptions } = input;
      setLastRequest({ ...persistedOptions });
      showSuccessToast(
        result.cached
          ? "Loaded saved summary"
          : "Summary generated successfully"
      );
    } catch (error) {
      // Error handling delegated to useMutationErrorHandler
    }
  };

  const handleQuickGenerate = () => {
    runSummary(lastRequest);
  };

  const handleRefreshSummary = () => {
    runSummary({ ...lastRequest, refresh: true });
  };

  const handleSubmitForm = async (values: GenerateSummaryFormInput) => {
    const payload: PaperSummaryRequest = {
      instructions: values.instructions?.trim() || undefined,
      focusAreas: (values.focusAreas || []).map((area) => area.trim()),
      tone: values.tone,
      audience: values.audience,
      language: values.language?.trim() || undefined,
      wordLimit: values.wordLimit,
    };

    await runSummary(payload);
    setIsSettingsOpen(false);
  };

  useEffect(() => {
    if (!aiEnabled || hasAttemptedInitialLoad) {
      return;
    }

    setHasAttemptedInitialLoad(true);
    runSummary(DEFAULT_OPTIONS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiEnabled]);

  if (!aiEnabled) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Bot className="h-4 w-4 text-muted-foreground" />
            AI Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>The AI assistant is currently disabled for this environment.</p>
          <p className="text-xs">
            Enable NEXT_PUBLIC_AI_ASSISTANT_ENABLED to use this feature.
          </p>
        </CardContent>
      </Card>
    );
  }

  const isLoading = generateState.isLoading && !summary;
  const isRefreshing = generateState.isLoading && Boolean(summary);

  return (
    <Card className="shadow-sm border-border/50 hover:shadow-md transition-shadow">
      <CardHeader className="pb-4 bg-gradient-to-r from-background to-muted/20">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Summary
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Concise overview generated for
              {paperTitle ? ` “${paperTitle}”` : " this paper"}.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSettingsOpen(true)}
              className="gap-2"
            >
              <Settings2 className="h-4 w-4" />
              Options
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : summary ? (
          <div className="space-y-4">
            <div className="rounded-lg border bg-muted/20 p-4">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {summary.summary}
              </p>
            </div>

            {summary.highlights && summary.highlights.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-primary" />
                  Key Highlights
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                  {summary.highlights.map((highlight, index) => (
                    <li key={`${highlight}-${index}`}>{highlight}</li>
                  ))}
                </ul>
              </div>
            )}

            {summary.followUpQuestions &&
              summary.followUpQuestions.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-primary" />
                    Follow-up Questions
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                    {summary.followUpQuestions.map((question, index) => (
                      <li key={`${question}-${index}`}>{question}</li>
                    ))}
                  </ul>
                </div>
              )}

            <Separator className="my-2" />

            <div className="text-xs text-muted-foreground grid grid-cols-1 gap-2">
              <div className="flex items-center gap-2">
                <Bot className="h-3.5 w-3.5" />
                <span className="font-medium">Provider:</span>
                <Badge variant="outline" className="capitalize">
                  {summary.provider}
                </Badge>
                <span className="ml-1">{summary.model}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5" />
                <span className="font-medium">Generated:</span>
                <span>
                  {formatDistanceToNow(new Date(summary.generatedAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Source:</span>
                <span className="capitalize">{summary.source}</span>
                <span className="text-muted-foreground/70">
                  • {summary.chunkCount} chunks
                </span>
              </div>
              {typeof summary.tokensUsed === "number" && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Tokens:</span>
                  <span>{summary.tokensUsed}</span>
                </div>
              )}
              <div>
                <Badge variant={summary.cached ? "secondary" : "default"}>
                  {summary.cached ? "Cached" : "Live"}
                </Badge>
                {summary.refreshed && (
                  <Badge variant="outline" className="ml-2">
                    Refreshed
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No summary yet</AlertTitle>
            <AlertDescription>
              Generate an AI-powered summary to see key takeaways and follow-up
              questions for this paper.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-3">
        <div className="flex w-full gap-2">
          <Button
            className="flex-1"
            onClick={handleQuickGenerate}
            disabled={generateState.isLoading}
          >
            {isRefreshing ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            {summary ? "Update summary" : "Generate summary"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleRefreshSummary}
            disabled={generateState.isLoading}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </CardFooter>

      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Customize summary</DialogTitle>
            <DialogDescription>
              Adjust tone, audience, and focus areas to tailor the generated
              summary.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={form.handleSubmit(handleSubmitForm)}
            className="space-y-5"
          >
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="instructions">Additional instructions</Label>
                <Textarea
                  id="instructions"
                  placeholder="Highlight methodology, limitations, or specific sections..."
                  {...form.register("instructions")}
                  rows={3}
                />
                {form.formState.errors.instructions && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.instructions.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label>Focus areas</Label>
                <div className="flex gap-2">
                  <Input
                    value={focusDraft}
                    onChange={(event) => setFocusDraft(event.target.value)}
                    placeholder="Add focus area"
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        applyFocusArea();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={applyFocusArea}
                  >
                    Add
                  </Button>
                </div>
                {focusAreas.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {focusAreas.map((area) => (
                      <Badge
                        key={area}
                        variant="secondary"
                        className="flex items-center gap-2"
                      >
                        {area}
                        <button
                          type="button"
                          className="text-muted-foreground/70 hover:text-destructive"
                          onClick={() => removeFocusArea(area)}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Add up to {MAX_FOCUS_AREAS} focus areas (e.g. methodology,
                    results, limitations).
                  </p>
                )}
                {form.formState.errors.focusAreas && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.focusAreas.message as string}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Tone</Label>
                  <Controller
                    control={form.control}
                    name="tone"
                    render={({ field }) => (
                      <Select
                        onValueChange={(value) => field.onChange(value)}
                        value={field.value ?? undefined}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                        <SelectContent>
                          {AI_TONE_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Audience</Label>
                  <Controller
                    control={form.control}
                    name="audience"
                    render={({ field }) => (
                      <Select
                        onValueChange={(value) => field.onChange(value)}
                        value={field.value ?? undefined}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select audience" />
                        </SelectTrigger>
                        <SelectContent>
                          {AI_AUDIENCE_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="language">Language</Label>
                <Input
                  id="language"
                  placeholder="Default detects source language"
                  {...form.register("language")}
                />
                {form.formState.errors.language && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.language.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="wordLimit">Word limit</Label>
                <Input
                  id="wordLimit"
                  type="number"
                  min={80}
                  max={600}
                  {...form.register("wordLimit", { valueAsNumber: true })}
                />
                {form.formState.errors.wordLimit && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.wordLimit.message}
                  </p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsSettingsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={generateState.isLoading}>
                {generateState.isLoading ? "Generating..." : "Generate summary"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
