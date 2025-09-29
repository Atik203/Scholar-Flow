"use client";

import {
  showErrorToast,
  showSuccessToast,
} from "@/components/providers/ToastProvider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  useGeneratePaperInsightMutation,
  useGetPaperInsightsQuery,
} from "@/redux/api/paperApi";
import { Bot, MessageCircle, Send, User } from "lucide-react";
import { useState } from "react";

interface AiInsightsPanelProps {
  paperId: string;
  paperTitle: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const AI_MODELS = [
  // OpenAI Models
  {
    value: "gpt-4o-mini",
    label: "GPT-4o Mini (OpenAI - Fast & Affordable)",
    description: "Quick responses, good for basic questions",
    provider: "OpenAI",
  },
  {
    value: "gpt-3.5-turbo",
    label: "GPT-3.5 Turbo (OpenAI - Balanced)",
    description: "Good balance of speed and quality",
    provider: "OpenAI",
  },
  {
    value: "gpt-4o",
    label: "GPT-4o (OpenAI - Premium)",
    description: "Best quality responses for complex analysis",
    provider: "OpenAI",
  },
  // Google Gemini Models (Free)
  {
    value: "gemini-1.5-flash",
    label: "Gemini 1.5 Flash (Google - Free & Fast)",
    description: "Fast and free Google AI model",
    provider: "Google",
  },
  {
    value: "gemini-1.5-pro",
    label: "Gemini 1.5 Pro (Google - Free)",
    description: "More capable Google AI model with free usage",
    provider: "Google",
  },
  // Deepseek Models (Very Affordable)
  {
    value: "deepseek-chat",
    label: "Deepseek Chat (Very Affordable)",
    description: "High-quality responses at very low cost",
    provider: "Deepseek",
  },
  {
    value: "deepseek-coder",
    label: "Deepseek Coder (Code Specialist)",
    description: "Specialized for technical and code-related analysis",
    provider: "Deepseek",
  },
];

export function AiInsightsPanel({ paperId, paperTitle }: AiInsightsPanelProps) {
  const [prompt, setPrompt] = useState("");
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState("gpt-4o-mini");

  const {
    data: insightsData,
    isLoading: isLoadingInsights,
    error: insightsError,
    refetch: refetchInsights,
  } = useGetPaperInsightsQuery(paperId);

  const [generateInsight, { isLoading: isGenerating }] =
    useGeneratePaperInsightMutation();

  // Get current thread messages
  const currentThread = insightsData?.threads?.find(
    (thread) => thread.id === selectedThreadId
  );

  // Convert thread messages to chat format
  const chatMessages: ChatMessage[] =
    currentThread?.messages && Array.isArray(currentThread.messages)
      ? currentThread.messages.map((msg) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: msg.createdAt,
        }))
      : [];

  const handleSendMessage = async () => {
    if (!prompt.trim()) return;

    const userPrompt = prompt.trim();
    setPrompt("");

    try {
      const result = await generateInsight({
        paperId,
        input: {
          message: userPrompt,
          threadId: selectedThreadId || undefined,
          model: selectedModel,
        },
      }).unwrap();

      // If no thread was selected, set the new thread as selected
      if (!selectedThreadId) {
        setSelectedThreadId(result.threadId);
      }

      // Refetch insights to get updated data
      refetchInsights();
      showSuccessToast("Insight generated successfully");
    } catch (error: any) {
      console.error("Failed to generate insight:", error);
      showErrorToast(
        error?.data?.message || "Failed to generate insight. Please try again."
      );
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startNewConversation = () => {
    setSelectedThreadId(null);
  };

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoadingInsights) {
    return (
      <Card className="shadow-sm border-border/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <CardTitle>AI Insights</CardTitle>
          </div>
          <CardDescription>
            Chat with AI about this paper to get insights and ask questions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-border/50 hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-gray-900/20 transition-shadow">
      <CardHeader className="pb-3 bg-gradient-to-r from-background to-muted/20 dark:from-background dark:to-muted/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <div>
              <CardTitle className="text-lg">AI Insights</CardTitle>
              <CardDescription className="text-sm">
                Chat with AI about "{paperTitle}"
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-[200px] text-xs">
                <SelectValue placeholder="Select AI Model" />
              </SelectTrigger>
              <SelectContent>
                {AI_MODELS.map((model) => (
                  <SelectItem key={model.value} value={model.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{model.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {model.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={startNewConversation}
              className="text-xs"
            >
              <MessageCircle className="h-3 w-3 mr-1" />
              New Chat
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex h-[500px]">
          {/* Thread List Sidebar */}
          {insightsData?.threads && insightsData.threads.length > 0 && (
            <div className="w-48 border-r bg-muted/20 dark:bg-muted/10 dark:border-gray-700">
              <div className="p-3 border-b dark:border-gray-700">
                <h4 className="text-sm font-medium">Conversations</h4>
              </div>
              <ScrollArea className="h-[420px]">
                <div className="p-2 space-y-1">
                  {insightsData.threads.map((thread) => (
                    <button
                      key={thread.id}
                      onClick={() => setSelectedThreadId(thread.id)}
                      className={cn(
                        "w-full text-left p-2 rounded text-xs hover:bg-accent transition-colors",
                        selectedThreadId === thread.id
                          ? "bg-accent"
                          : "bg-transparent"
                      )}
                    >
                      <div className="font-medium truncate">
                        Chat {thread._count?.messages || 0} messages
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {new Date(thread.createdAt).toLocaleDateString()}
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Chat Interface */}
          <div className="flex-1 flex flex-col">
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {chatMessages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50 dark:text-muted-foreground/40" />
                    <p className="text-lg font-medium">Start a conversation</p>
                    <p className="text-sm">
                      Ask questions about this paper and get AI-powered insights
                    </p>
                  </div>
                ) : (
                  chatMessages.map((message) => (
                    <div key={message.id} className="flex gap-3">
                      <div className="flex-shrink-0">
                        {message.role === "user" ? (
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-primary-foreground" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center">
                            <Bot className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">
                            {message.role === "user" ? "You" : "AI Assistant"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatMessageTime(message.timestamp)}
                          </span>
                        </div>
                        <div
                          className={cn(
                            "p-3 rounded-lg text-sm",
                            message.role === "user"
                              ? "bg-primary text-primary-foreground ml-auto max-w-[80%]"
                              : "bg-muted"
                          )}
                        >
                          <div className="whitespace-pre-wrap">
                            {message.content}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            <Separator className="dark:bg-gray-700" />

            {/* Input Area */}
            <div className="p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask a question about this paper..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isGenerating}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!prompt.trim() || isGenerating}
                  size="sm"
                >
                  {isGenerating ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {insightsError && (
                <p className="text-sm text-destructive mt-2">
                  Failed to load insights. Please refresh the page.
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
