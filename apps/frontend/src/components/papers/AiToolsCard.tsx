"use client";

/**
 * AI Tools — rewrite, translate, compare two papers, and literature review.
 * Wires the existing backend endpoints (/api/ai/*) that had no UI.
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAiComparePapersMutation,
  useAiLiteratureReviewMutation,
  useAiRewriteTextMutation,
  useAiTranslateTextMutation,
  useListPapersQuery,
} from "@/redux/api/paperApi";
import { showErrorToast } from "@/components/providers/ToastProvider";
import {
  BookOpenCheck,
  Languages,
  PenLine,
  Scale,
  Loader2,
} from "lucide-react";

type Tool = "rewrite" | "translate" | "compare" | "review";

const TOOLS: Array<{ key: Tool; label: string; icon: typeof PenLine }> = [
  { key: "rewrite", label: "Rewrite", icon: PenLine },
  { key: "translate", label: "Translate", icon: Languages },
  { key: "compare", label: "Compare", icon: Scale },
  { key: "review", label: "Literature Review", icon: BookOpenCheck },
];

interface AiToolsCardProps {
  paperId: string;
  paperTitle: string;
}

export function AiToolsCard({ paperId, paperTitle }: AiToolsCardProps) {
  const [tool, setTool] = useState<Tool>("rewrite");
  const [text, setText] = useState("");
  const [tone, setTone] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("");
  const [otherPaperId, setOtherPaperId] = useState("");
  const [topic, setTopic] = useState("");
  const [output, setOutput] = useState<string | null>(null);

  const { data: papersData, isLoading: papersLoading } = useListPapersQuery({
    limit: 100,
  });

  const [rewrite, { isLoading: isRewriting }] = useAiRewriteTextMutation();
  const [translate, { isLoading: isTranslating }] = useAiTranslateTextMutation();
  const [compare, { isLoading: isComparing }] = useAiComparePapersMutation();
  const [review, { isLoading: isReviewing }] = useAiLiteratureReviewMutation();

  const isRunning = isRewriting || isTranslating || isComparing || isReviewing;
  const papers = (papersData?.items ?? []).filter((p) => p.id !== paperId);
  const otherPaper = papers.find((p) => p.id === otherPaperId);

  const run = async (fn: () => Promise<unknown>) => {
    setOutput(null);
    try {
      const result = await fn();
      setOutput(
        typeof result === "string"
          ? result
          : JSON.stringify(result, null, 2)
      );
    } catch {
      showErrorToast("AI tool failed", "Please try again");
    }
  };

  const handleRewrite = () =>
    run(() =>
      rewrite({
        text: text || paperTitle,
        tone: tone || undefined,
      }).unwrap()
    );

  const handleTranslate = () =>
    run(() =>
      translate({
        text: text || paperTitle,
        targetLanguage: targetLanguage || "English",
      }).unwrap()
    );

  const handleCompare = () =>
    run(() => compare({ paper1Id: paperId, paper2Id: otherPaperId }).unwrap());

  const handleReview = () =>
    run(() => review({ paperIds: [paperId, ...(otherPaperId ? [otherPaperId] : [])], topic: topic || undefined }).unwrap());

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <PenLine className="h-5 w-5 text-primary" />
          AI Tools
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Rewrite, translate, compare, or review papers with AI
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {TOOLS.map((t) => {
            const Icon = t.icon;
            return (
              <Button
                key={t.key}
                size="sm"
                variant={tool === t.key ? "default" : "outline"}
                className="gap-1.5"
                onClick={() => {
                  setTool(t.key);
                  setOutput(null);
                }}
              >
                <Icon className="h-3.5 w-3.5" />
                {t.label}
              </Button>
            );
          })}
        </div>

        <div className="space-y-3">
          {(tool === "rewrite" || tool === "translate") && (
            <div className="space-y-2">
              <Label htmlFor="ai-tool-text">
                Text {tool === "rewrite" ? "to rewrite" : "to translate"}
              </Label>
              <Textarea
                id="ai-tool-text"
                rows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={`Defaults to the paper title: "${paperTitle}"`}
              />
            </div>
          )}

          {tool === "rewrite" && (
            <div className="space-y-2">
              <Label htmlFor="ai-tool-tone">Tone (optional)</Label>
              <Input
                id="ai-tool-tone"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                placeholder="e.g. academic, casual, concise"
              />
            </div>
          )}

          {tool === "translate" && (
            <div className="space-y-2">
              <Label htmlFor="ai-tool-lang">Target language</Label>
              <Input
                id="ai-tool-lang"
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                placeholder="e.g. English, French, Bengali"
              />
            </div>
          )}

          {(tool === "compare" || tool === "review") && (
            <div className="space-y-2">
              <Label>Compare with / include paper</Label>
              {papersLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select value={otherPaperId} onValueChange={setOtherPaperId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select another paper..." />
                  </SelectTrigger>
                  <SelectContent>
                    {papers.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}

          {tool === "review" && (
            <div className="space-y-2">
              <Label htmlFor="ai-tool-topic">Topic (optional)</Label>
              <Input
                id="ai-tool-topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. transformer architectures"
              />
            </div>
          )}

          <Button
            disabled={isRunning || (tool === "compare" && !otherPaperId)}
            onClick={() => {
              if (tool === "rewrite") handleRewrite();
              else if (tool === "translate") handleTranslate();
              else if (tool === "compare") handleCompare();
              else handleReview();
            }}
          >
            {isRunning ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isRunning
              ? "Working..."
              : tool === "rewrite"
                ? "Rewrite"
                : tool === "translate"
                  ? "Translate"
                  : tool === "compare"
                    ? "Compare papers"
                    : "Generate review"}
          </Button>
        </div>

        {output && (
          <pre className="whitespace-pre-wrap rounded-lg border bg-muted/40 p-4 text-sm max-h-80 overflow-y-auto">
            {output}
          </pre>
        )}
      </CardContent>
    </Card>
  );
}
