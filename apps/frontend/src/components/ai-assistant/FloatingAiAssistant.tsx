"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAiProvidersQuery } from "@/redux/api/paperApi";
import {
  useListConversationsQuery,
  useCreateConversationMutation,
  useGetConversationQuery,
  useDeleteConversationMutation,
  useSendMessageMutation,
} from "@/redux/api/aiChatApi";
import { AnimatePresence, motion } from "motion/react";
import {
  Bot,
  Check,
  Copy,
  MessageCircle,
  Plus,
  RefreshCw,
  Send,
  Sparkles,
  Square,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { streamingFetch } from "@/lib/api/streamingFetch";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  model?: string;
  createdAt: string;
}

// Fallback label dictionary for legacy / unknown model ids. The dropdown
// itself is now populated from the live API response (Phase C.3), so this
// only matters for messages already persisted in the database that
// reference a model id not present in the current admin catalog.
const LEGACY_MODEL_LABELS: Record<string, string> = {
  "gpt-4o": "GPT-4o",
  "gpt-4o-mini": "GPT-4o Mini",
  "gpt-3.5-turbo": "GPT-3.5",
  "gemini-2.5-flash-lite": "Gemini Flash",
  "gemini-2.5-pro": "Gemini Pro",
  "claude-3-5-sonnet-latest": "Claude Sonnet",
  "claude-3-5-haiku-latest": "Claude Haiku",
  "claude-3-opus-latest": "Claude Opus",
  "deepseek-chat": "DeepSeek V3",
  "deepseek-reasoner": "DeepSeek R1",
};

function CopyButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard may be unavailable in some browsers; silently ignore.
    }
  };
  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-6 w-6 p-0 absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
      onClick={handleCopy}
      title="Copy message"
    >
      {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
    </Button>
  );
}

export function FloatingAiAssistant() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [lastUserPrompt, setLastUserPrompt] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const { data: providersData } = useGetAiProvidersQuery();
  const availableModels =
    providersData?.providers?.flatMap((p) => p.models) ?? [];
  // Build a label map from the live provider list so dropdown labels stay
  // in sync with whatever the admin has configured (Phase C.3).
  const modelLabelByValue: Record<string, string> = Object.fromEntries(
    availableModels.map((m) => [m.value, m.label.split("(")[0].trim()])
  );
  const resolveModelLabel = (model?: string) => {
    if (!model) return "";
    return modelLabelByValue[model] ?? LEGACY_MODEL_LABELS[model] ?? model;
  };
  const [selectedModel, setSelectedModel] = useState(
    availableModels[0]?.value ?? "gpt-4o-mini"
  );
  // Keep the selected model in sync if the catalog loads after mount.
  useEffect(() => {
    if (availableModels.length > 0 && !availableModels.find((m) => m.value === selectedModel)) {
      setSelectedModel(availableModels[0].value);
    }
  }, [availableModels, selectedModel]);

  const { data: conversations = [], isLoading: loadingConvs } = useListConversationsQuery(undefined, {
    skip: !open,
  });

  const { data: activeConversation, isLoading: loadingMsgs } = useGetConversationQuery(activeConvId ?? "", {
    skip: !activeConvId,
  });

  const [createConversation] = useCreateConversationMutation();
  const [deleteConversation] = useDeleteConversationMutation();
  const [sendMessageMutation] = useSendMessageMutation();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "j") {
        e.preventDefault();
        setOpen((prev) => !prev);
        setMinimized(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (activeConversation) {
      setLocalMessages(activeConversation.messages ?? []);
    } else if (!activeConvId) {
      setLocalMessages([]);
    }
  }, [activeConversation, activeConvId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [localMessages]);

  // Abort any in-flight stream when the panel closes.
  useEffect(() => {
    if (!open && abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
  }, [open]);

  const startNewChat = async (model = selectedModel) => {
    try {
      const conv = await createConversation({
        title: "New Research Chat",
        model,
      }).unwrap();
      setActiveConvId(conv.id);
      setLocalMessages([]);
      return conv.id as string;
    } catch {
      return null;
    }
  };

  const handleDeleteConversation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteConversation(id).unwrap();
      if (activeConvId === id) {
        setActiveConvId(null);
        setLocalMessages([]);
      }
    } catch {}
  };

  const stopStream = () => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setSending(false);
  };

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    let convId = activeConvId;
    if (!convId) {
      const newId = await startNewChat();
      if (!newId) return;
      convId = newId;
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
    };
    setLocalMessages((prev) => [...prev, userMsg]);
    setLastUserPrompt(trimmed);
    setInput("");
    setSending(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      // Use the auth-aware streaming helper. No window global, no
      // missing token race — the helper reads from the Redux store.
      const response = await streamingFetch(
        `/ai-chat/${convId}/messages/stream`,
        {
          method: "POST",
          body: { content: trimmed },
          signal: controller.signal,
        }
      );

      if (!response.body) {
        throw new Error("No response body for stream");
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let accumulatedContent = "";

      const assistantMsgId = `${Date.now()}-stream`;
      setLocalMessages((prev) => [
        ...prev,
        {
          id: assistantMsgId,
          role: "assistant",
          content: "",
          createdAt: new Date().toISOString(),
        },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          // Backend emits two shapes:
          //   event: token\ndata: { token: "..." }
          //   event: done\ndata: { content: "..." }
          // We only care about token lines for streaming; the final
          // done event closes the connection.
          if (line.startsWith("event: done")) {
            break;
          }
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (typeof data?.token === "string") {
                accumulatedContent += data.token;
                setLocalMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsgId
                      ? { ...m, content: accumulatedContent }
                      : m
                  )
                );
              }
            } catch {
              // ignore malformed lines
            }
          }
        }
      }
    } catch {
      // Stream unavailable (network, 4xx, abort). Fall back to the
      // RTK Query mutation which returns the full response in one go.
      try {
        const result = await sendMessageMutation({ convId: convId!, content: trimmed }).unwrap();
        setLocalMessages((prev) => [
          ...prev,
          {
            id: result.id,
            role: "assistant",
            content: result.content,
            model: result.model,
            createdAt: new Date().toISOString(),
          },
        ]);
      } catch {
        // Final fallback failed too — surface nothing here; the user
        // can retry. (The previous version of this code already had
        // this behavior.)
      }
    } finally {
      abortRef.current = null;
      setSending(false);
    }
  }, [input, sending, activeConvId, sendMessageMutation, selectedModel]);

  const regenerateLast = useCallback(async () => {
    if (!lastUserPrompt || !activeConvId || sending) return;
    setSending(true);
    setLocalMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}-regen`,
        role: "assistant",
        content: "",
        createdAt: new Date().toISOString(),
      },
    ]);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const response = await streamingFetch(
        `/ai-chat/${activeConvId}/messages/stream`,
        {
          method: "POST",
          body: { content: lastUserPrompt },
          signal: controller.signal,
        }
      );
      if (!response.body) {
        throw new Error("No response body for stream");
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let accumulated = "";
      const targetId = `${Date.now()}-regen`;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (line.startsWith("event: done")) break;
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (typeof data?.token === "string") {
                accumulated += data.token;
                setLocalMessages((prev) =>
                  prev.map((m) =>
                    m.id === targetId ? { ...m, content: accumulated } : m
                  )
                );
              }
            } catch {}
          }
        }
      }
    } catch {
      // silent — the empty assistant message remains so the user can retry
    } finally {
      abortRef.current = null;
      setSending(false);
    }
  }, [activeConvId, lastUserPrompt, sending]);

  return (
    <>
      {!open && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center"
          onClick={() => { setOpen(true); setMinimized(false); }}
          title="AI Assistant (Ctrl+J)"
        >
          <Sparkles className="h-6 w-6" />
        </motion.button>
      )}

      <AnimatePresence>
        {open && !minimized && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[420px] max-w-[calc(100vw-24px)] shadow-2xl rounded-xl border bg-card"
          >
            <Card className="border-0 shadow-none">
              <CardHeader className="flex flex-row items-center justify-between p-3 border-b space-y-0">
                <CardTitle className="text-base flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  AI Assistant
                </CardTitle>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => setMinimized(true)}
                    title="Minimize"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <div className="flex h-[500px]">
                  <div className="w-36 border-r bg-muted/20 flex flex-col">
                    <div className="p-2 border-b">
                      <Select value={selectedModel} onValueChange={setSelectedModel}>
                        <SelectTrigger className="h-7 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {availableModels.map((m) => (
                            <SelectItem key={m.value} value={m.value} className="text-xs">
                              {m.label.split("(")[0].trim()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button size="sm" className="w-full mt-1 h-7 text-xs" onClick={() => void startNewChat()}>
                        <Plus className="h-3 w-3 mr-1" /> New
                      </Button>
                    </div>
                    <ScrollArea className="flex-1">
                      {loadingConvs ? (
                        Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="p-2"><Skeleton className="h-4 w-full" /></div>
                        ))
                      ) : (
                        conversations.map((c) => (
                          <button
                            key={c.id}
                            onClick={() => setActiveConvId(c.id)}
                            className={cn(
                              "w-full text-left p-2 text-xs hover:bg-accent transition-colors group flex items-start justify-between",
                              activeConvId === c.id && "bg-accent"
                            )}
                          >
                            <span className="truncate flex-1">
                              {c.title || "New Chat"}
                            </span>
                            <button
                              onClick={(e) => handleDeleteConversation(c.id, e)}
                              className="opacity-0 group-hover:opacity-100 ml-1 flex-shrink-0 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </button>
                        ))
                      )}
                    </ScrollArea>
                  </div>

                  <div className="flex-1 flex flex-col">
                    <ScrollArea className="flex-1 p-3" ref={scrollRef}>
                      {loadingMsgs ? (
                        <div className="space-y-3 p-2">
                          <Skeleton className="h-12 w-3/4" />
                          <Skeleton className="h-20 w-full" />
                        </div>
                      ) : localMessages.length === 0 ? (
                        <div className="text-center text-muted-foreground py-12">
                          <Sparkles className="h-10 w-10 mx-auto mb-3 opacity-30" />
                          <p className="text-sm font-medium">Ask me anything about your research</p>
                          <p className="text-xs mt-1">I can help with summaries, analysis, and more</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {localMessages.map((msg) => (
                            <div
                              key={msg.id}
                              className={cn(
                                "text-sm p-2.5 rounded-lg max-w-[95%] group relative",
                                msg.role === "user"
                                  ? "bg-primary text-primary-foreground ml-auto"
                                  : "bg-muted pr-7"
                              )}
                            >
                              {msg.role === "assistant" ? (
                                <div className="ai-message prose prose-sm dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground/90 prose-li:text-foreground/90 prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-pre:bg-muted-foreground/10 prose-pre:border prose-pre:rounded-lg">
                                  <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[rehypeHighlight]}
                                  >
                                    {msg.content}
                                  </ReactMarkdown>
                                </div>
                              ) : (
                                <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                              )}
                              {msg.role === "assistant" && (
                                <CopyButton content={msg.content} />
                              )}
                              {msg.model && (
                                <p className="text-[10px] opacity-40 mt-1">
                                  {resolveModelLabel(msg.model)}
                                </p>
                              )}
                            </div>
                          ))}
                          {sending && (
                            <div className="text-sm p-2.5 rounded-lg bg-muted max-w-[90%]">
                              <div className="flex gap-1">
                                <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                                <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                                <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </ScrollArea>

                    <div className="p-3 border-t flex gap-2">
                      {lastUserPrompt && !sending && activeConvId && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 px-2"
                          onClick={regenerateLast}
                          title="Regenerate last response"
                          aria-label="Regenerate last response"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                        placeholder="Ask about your research..."
                        className="flex-1 text-sm h-8"
                        disabled={sending}
                      />
                      {sending ? (
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-8"
                          onClick={stopStream}
                          title="Stop generating"
                          aria-label="Stop generating"
                        >
                          <Square className="h-3.5 w-3.5" />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="h-8"
                          onClick={sendMessage}
                          disabled={!input.trim()}
                          aria-label="Send message"
                        >
                          <Send className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && minimized && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-6 right-6 z-50 bg-card border rounded-full shadow-lg px-4 py-2 flex items-center gap-2 cursor-pointer"
            onClick={() => setMinimized(false)}
          >
            <Bot className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">AI Assistant</span>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1" onClick={(e) => { e.stopPropagation(); setOpen(false); }}>
              <X className="h-3 w-3" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
