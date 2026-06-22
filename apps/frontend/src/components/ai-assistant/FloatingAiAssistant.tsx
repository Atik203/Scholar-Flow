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
import { AnimatePresence, motion } from "motion/react";
import {
  Bot,
  Check,
  Copy,
  MessageCircle,
  Plus,
  Send,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
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

interface Conversation {
  id: string;
  title?: string | null;
  model?: string | null;
  updatedAt: string;
  _count?: { messages: number };
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

function getToken(): string | null {
  try {
    const store = (window as any).__REDUX_STORE__;
    if (store) {
      const state = store.getState();
      return state.auth?.accessToken || null;
    }
  } catch {}
  return null;
}

const MODEL_LABELS: Record<string, string> = {
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
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingConvs, setLoadingConvs] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: providersData } = useGetAiProvidersQuery();
  const availableModels =
    providersData?.providers?.flatMap((p) => p.models) ?? [];
  const [selectedModel, setSelectedModel] = useState(
    availableModels[0]?.value ?? "gemini-2.5-flash-lite"
  );

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
    if (!open) return;
    setLoadingConvs(true);
    fetch(`${API_BASE}/ai-chat`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((r) => r.json())
      .then((d) => {
        setConversations(d.data?.conversations || []);
      })
      .catch(() => {})
      .finally(() => setLoadingConvs(false));
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const startNewChat = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API_BASE}/ai-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ title: "New Research Chat", model: selectedModel }),
      });
      const d = await r.json();
      if (d.data) {
        setConversations((prev) => [d.data, ...prev]);
        setActiveConvId(d.data.id);
        setMessages([]);
      }
    } catch {} finally { setLoading(false); }
  };

  const loadConversation = async (id: string) => {
    setActiveConvId(id);
    setLoading(true);
    try {
      const r = await fetch(`${API_BASE}/ai-chat/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const d = await r.json();
      setMessages(d.data?.messages || []);
    } catch {} finally { setLoading(false); }
  };

  const deleteConversation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await fetch(`${API_BASE}/ai-chat/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConvId === id) {
      setActiveConvId(null);
      setMessages([]);
    }
  };

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const convId = activeConvId;
    if (!convId) {
      await startNewChat();
      return;
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const r = await fetch(`${API_BASE}/ai-chat/${convId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ content: trimmed }),
      });
      const d = await r.json();
      if (d.data) {
        setMessages((prev) => [
          ...prev,
          {
            id: d.data.id,
            role: "assistant",
            content: d.data.content,
            model: d.data.model,
            createdAt: new Date().toISOString(),
          },
        ]);
      }
    } catch {} finally { setLoading(false); }
  }, [input, loading, activeConvId]);

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
                      <Button size="sm" className="w-full mt-1 h-7 text-xs" onClick={startNewChat}>
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
                            onClick={() => loadConversation(c.id)}
                            className={cn(
                              "w-full text-left p-2 text-xs hover:bg-accent transition-colors group flex items-start justify-between",
                              activeConvId === c.id && "bg-accent"
                            )}
                          >
                            <span className="truncate flex-1">
                              {c.title || "New Chat"}
                            </span>
                            <button
                              onClick={(e) => deleteConversation(c.id, e)}
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
                      {messages.length === 0 ? (
                        <div className="text-center text-muted-foreground py-12">
                          <Sparkles className="h-10 w-10 mx-auto mb-3 opacity-30" />
                          <p className="text-sm font-medium">Ask me anything about your research</p>
                          <p className="text-xs mt-1">I can help with summaries, analysis, and more</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {messages.map((msg) => (
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
                                  {MODEL_LABELS[msg.model] || msg.model}
                                </p>
                              )}
                            </div>
                          ))}
                          {loading && (
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
                      <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Ask about your research..."
                        className="flex-1 text-sm h-8"
                      />
                      <Button size="sm" className="h-8" onClick={sendMessage} disabled={!input.trim() || loading}>
                        <Send className="h-3.5 w-3.5" />
                      </Button>
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
