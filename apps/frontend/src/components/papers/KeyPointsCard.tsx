"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useExtractKeyPointsMutation } from "@/redux/api/paperApi";
import { useGetAiProvidersQuery } from "@/redux/api/paperApi";
import { motion, AnimatePresence } from "motion/react";
import {
  Lightbulb,
  RefreshCw,
  Sparkles,
  Copy,
  Check,
  Zap,
  BeakerIcon,
  BookOpen,
  Brain,
} from "lucide-react";
import { useState, useCallback, useEffect } from "react";

interface KeyPointsCardProps {
  paperId: string;
}

const accentIcons = [Zap, Brain, BeakerIcon, BookOpen, Sparkles, Lightbulb];
const accentColors = [
  "from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300",
  "from-violet-500/20 to-purple-500/10 border-violet-500/30 text-violet-700 dark:text-violet-300",
  "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300",
  "from-sky-500/20 to-blue-500/10 border-sky-500/30 text-sky-700 dark:text-sky-300",
  "from-rose-500/20 to-pink-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300",
  "from-cyan-500/20 to-indigo-500/10 border-cyan-500/30 text-cyan-700 dark:text-cyan-300",
];
const accentIconColors = [
  "text-amber-500",
  "text-violet-500",
  "text-emerald-500",
  "text-sky-500",
  "text-rose-500",
  "text-cyan-500",
];

const highlightTerms = (text: string) => {
  const patterns = [
    /\b(\d+(?:\.\d+)?%)\b/g,
    /\b(BLEU|CER|WER|F1|ROUGE|BLEURT)\b/gi,
    /\b(YOLO\w*|BERT|GPT|CNN|RNN|LSTM|Transformer|ResNet|U-Net|GAN|VAE)\b/gi,
    /\b(state-of-the-art|novel|significant|achieves|outperforms|improves|reduces|increases)\b/gi,
  ];

  let result = text;
  for (const pattern of patterns) {
    result = result.replace(
      pattern,
      '<span class="font-semibold text-primary">$1</span>'
    );
  }
  return result;
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
      onClick={handleCopy}
    >
      {copied ? (
        <Check className="h-3 w-3 text-emerald-500" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </Button>
  );
}

export function KeyPointsCard({ paperId }: KeyPointsCardProps) {
  const [keyPoints, setKeyPoints] = useState<string[] | null>(null);
  const [persisted, setPersisted] = useState(false);
  const [extract, { isLoading }] = useExtractKeyPointsMutation();
  const { data: providersData } = useGetAiProvidersQuery();
  const defaultModel = providersData?.defaultModel;

  // Load persisted key points on mount
  useEffect(() => {
    const loadKeyPoints = async () => {
      try {
        const result = await extract({
          paperId,
          refresh: false,
        }).unwrap();
        if (result.keyPoints && result.keyPoints.length > 0) {
          setKeyPoints(result.keyPoints);
          setPersisted(result.persisted || false);
        }
      } catch {
        // No key points yet — user can generate
      }
    };
    loadKeyPoints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paperId]);

  const handleExtract = async (regenerate = false) => {
    const result = await extract({
      paperId,
      model: defaultModel ?? undefined,
      refresh: regenerate || !persisted,
    }).unwrap();
    setKeyPoints(result.keyPoints);
    setPersisted(true);
  };

  const hasError =
    keyPoints &&
    keyPoints.length === 1 &&
    (keyPoints[0].startsWith("Could not") ||
      keyPoints[0].startsWith("No paper content") ||
      keyPoints[0].startsWith("AI features are"));

  return (
    <Card className="overflow-hidden border-primary/10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            AI Key Points
          </span>
        </CardTitle>
        <Button
          variant={keyPoints && keyPoints.length > 0 ? "outline" : "default"}
          size="sm"
          onClick={() => handleExtract(true)}
          disabled={isLoading}
          className="gap-1.5"
        >
          {isLoading ? (
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Sparkles className="h-3.5 w-3.5" />
          )}
          {isLoading
            ? "Analyzing..."
            : keyPoints && keyPoints.length > 0
              ? "Regenerate"
              : "Extract Key Points"}
        </Button>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-3 px-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ))}
          </div>
        ) : null}

        <AnimatePresence mode="wait">
          {keyPoints && !hasError && keyPoints.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              {keyPoints.map((point, i) => {
                const AccentIcon = accentIcons[i % accentIcons.length];
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.35 }}
                    className="group relative"
                  >
                    <div
                      className={`rounded-xl border bg-gradient-to-br ${accentColors[i % accentColors.length]} p-4 transition-shadow hover:shadow-md`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`shrink-0 mt-0.5 ${accentIconColors[i % accentIconColors.length]}`}
                        >
                          <AccentIcon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className="text-sm leading-relaxed"
                            dangerouslySetInnerHTML={{
                              __html: highlightTerms(point),
                            }}
                          />
                        </div>
                        <CopyButton text={point} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : null}
        </AnimatePresence>

        {hasError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center"
          >
            <p className="text-sm text-muted-foreground">{keyPoints[0]}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => handleExtract(true)}
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              Try Again
            </Button>
          </motion.div>
        )}

        {!keyPoints && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl border border-dashed bg-muted/30 p-8 text-center"
          >
            <div className="flex justify-center mb-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                <Brain className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">
              Extract key findings from this paper using AI
            </p>
            <p className="text-xs text-muted-foreground/60">
              Click the button above to identify claims, findings, and
              contributions
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
