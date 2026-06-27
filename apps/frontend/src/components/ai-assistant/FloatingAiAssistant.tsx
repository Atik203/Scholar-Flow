"use client";

import { Button } from "@/components/ui/button";
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
  Expand,
  MessageCircle,
  Minimize2,
  Pencil,
  Plus,
  RefreshCw,
  Search,
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
import { useAIVisibility } from "@/lib/aiVisibilityContext";
import { useAiContext } from "@/components/ai-assistant/AiContextProvider";
import { showErrorToast } from "@/components/providers/ToastProvider";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  model?: string;
  createdAt: string;
}

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
      // silent
    }
  };
  return (
    <button
      onClick={handleCopy}
      className="absolute top-1 right-1 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-muted-foreground/20 transition-opacity"
      title="Copy message"
    >
      {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3 text-muted-foreground" />}
    </button>
  );
}

export function FloatingAiAssistant() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [lastUserPrompt, setLastUserPrompt] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [convSearch, setConvSearch] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const sendingRef = useRef(false);

  const { showFloatingButton } = useAIVisibility();
  const { currentContext } = useAiContext();

  const { data: providersData } = useGetAiProvidersQuery();
  const availableModels =
    providersData?.providers?.flatMap((p) => p.models) ?? [];
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

  // Sync from server ONLY when NOT actively streaming
  useEffect(() => {
    if (sendingRef.current) return;
    if (activeConversation) {
      setLocalMessages(activeConversation.messages ?? []);
    } else if (!activeConvId) {
      setLocalMessages([]);
    }
  }, [activeConversation, activeConvId]);

  // Keep sendingRef in sync
  useEffect(() => {
    sendingRef.current = sending;
  }, [sending]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [localMessages]);

  useEffect(() => {
    if (!open && abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
  }, [open]);

  const startNewChat = async (model = selectedModel) => {
    try {
      const conv = await createConversation({
        title: currentContext?.title
          ? `${currentContext.type === "paper" ? "Paper" : "Workspace"}: ${currentContext.title.slice(0, 40)}`
          : "New Research Chat",
        model,
        context: currentContext || undefined,
      }).unwrap();
      setActiveConvId(conv.id);
      setLocalMessages([]);
      return conv.id as string;
    } catch {
      return null;
    }
  };

  const handleEditAndResend = (msgId: string) => {
    setEditingMessageId(msgId);
    const msg = localMessages.find((m) => m.id === msgId);
    if (msg) setEditContent(msg.content);
  };

  const submitEdit = async () => {
    if (!editingMessageId || !editContent.trim()) return;
    const trimmed = editContent.trim();
    setEditingMessageId(null);
    setEditContent("");
    setLocalMessages((prev) => prev.filter((m) => m.id !== editingMessageId));
    setLastUserPrompt(null);

    try {
      const convId = activeConvId;
      if (!convId) return;

      const userMsg: Message = {
        id: Date.now().toString(),
        role: "user",
        content: trimmed,
        createdAt: new Date().toISOString(),
      };
      setLocalMessages((prev) => [...prev, userMsg]);
      setLastUserPrompt(trimmed);
      setSending(true);

      const controller = new AbortController();
      abortRef.current = controller;

      const response = await streamingFetch(
        `/ai-chat/${convId}/messages/stream`,
        {
          method: "POST",
          body: { content: trimmed },
          signal: controller.signal,
        }
      );

      if (!response.body) throw new Error("No response body");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let accumulated = "";

      const assistantMsgId = `${Date.now()}-stream`;
      setLocalMessages((prev) => [
        ...prev,
        { id: assistantMsgId, role: "assistant", content: "", createdAt: new Date().toISOString() },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (typeof data?.token === "string") {
                accumulated += data.token;
                setLocalMessages((prev) =>
                  prev.map((m) => (m.id === assistantMsgId ? { ...m, content: accumulated } : m))
                );
              }
            } catch {}
          }
        }
      }
    } catch {
      try {
        const result = await sendMessageMutation({ convId: activeConvId!, content: trimmed }).unwrap();
        setLocalMessages((prev) => [
          ...prev,
          { id: result.id, role: "assistant", content: result.content, model: result.model, createdAt: new Date().toISOString() },
        ]);
      } catch {
        showErrorToast("Failed to send message");
      }
    } finally {
      abortRef.current = null;
      setSending(false);
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
    } catch {
      showErrorToast("Failed to delete conversation");
    }
  };

  const handleDeleteConversation = async (id: string, e: React.MouseEvent) => {
    if (!editingMessageId || !editContent.trim()) return;
    const trimmed = editContent.trim();
    setEditingMessageId(null);
    setEditContent("");
    setInput(trimmed);
    // Defer to sendMessage via setting input and triggering
    // We need to call sendMessage directly with the edited content
    setLocalMessages((prev) => prev.filter((m) => m.id !== editingMessageId));
    setLastUserPrompt(null);
    // Post edited content as new message
    try {
      const convId = activeConvId;
      if (!convId) return;

      const userMsg: Message = {
        id: Date.now().toString(),
        role: "user",
        content: trimmed,
        createdAt: new Date().toISOString(),
      };
      setLocalMessages((prev) => [...prev, userMsg]);
      setLastUserPrompt(trimmed);
      setSending(true);

      const controller = new AbortController();
      abortRef.current = controller;

      const response = await streamingFetch(
        `/ai-chat/${convId}/messages/stream`,
        {
          method: "POST",
          body: { content: trimmed },
          signal: controller.signal,
        }
      );

      if (!response.body) throw new Error("No response body");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let accumulated = "";

      const assistantMsgId = `${Date.now()}-stream`;
      setLocalMessages((prev) => [
        ...prev,
        { id: assistantMsgId, role: "assistant", content: "", createdAt: new Date().toISOString() },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (typeof data?.token === "string") {
                accumulated += data.token;
                setLocalMessages((prev) =>
                  prev.map((m) => (m.id === assistantMsgId ? { ...m, content: accumulated } : m))
                );
              }
            } catch {}
          }
        }
      }
    } catch {
      // fallback to regular send
      try {
        const result = await sendMessageMutation({ convId: activeConvId!, content: trimmed }).unwrap();
        setLocalMessages((prev) => [
          ...prev,
          { id: result.id, role: "assistant", content: result.content, model: result.model, createdAt: new Date().toISOString() },
        ]);
      } catch {
        showErrorToast("Failed to send message");
      }
    } finally {
      abortRef.current = null;
      setSending(false);
    }
  };
    e.stopPropagation();
    try {
      await deleteConversation(id).unwrap();
      if (activeConvId === id) {
        setActiveConvId(null);
        setLocalMessages([]);
      }
    } catch {
      showErrorToast("Failed to delete conversation");
    }
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
      // Stream unavailable, fall back to mutation
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
        showErrorToast("Failed to send message. Please try again.");
      }
    } finally {
      abortRef.current = null;
      setSending(false);
    }
  }, [input, sending, activeConvId, sendMessageMutation]);

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
      showErrorToast("Regeneration failed. Please try again.");
    } finally {
      abortRef.current = null;
      setSending(false);
    }
  }, [activeConvId, lastUserPrompt, sending]);

  const filteredConversations = convSearch
    ? conversations.filter((c) =>
        (c.title || "").toLowerCase().includes(convSearch.toLowerCase())
      )
    : conversations;

  const suggestedPrompts = currentContext?.type === "paper"
    ? [
        "What methodology does this paper use?",
        "Summarize the key contributions",
        "What are the limitations of this study?",
        "Explain the main findings in simple terms",
      ]
    : currentContext?.type === "workspace"
      ? [
          "Summarize recent activity in this workspace",
          "What are the common themes across papers?",
          "Suggest connections between papers",
        ]
      : [
          "Help me find papers on deep learning",
          "Summarize my recent research activity",
          "What should I focus on next?",
        ]; 

  if (!showFloatingButton && !open) return null;

  const panelWidth = fullscreen ? "min(100vw, 100%)" : "min(480px, calc(100vw - 24px))";
  const panelHeight = fullscreen ? "min(100vh, 100%)" : "min(600px, calc(100vh - 120px))";

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
            className={cn(
              "fixed bottom-6 right-6 z-50 shadow-2xl rounded-xl border bg-card flex flex-col overflow-hidden",
              fullscreen ? "inset-4 !bottom-4 !right-4 !left-4 !top-4" : ""
            )}
            style={{
              width: fullscreen ? undefined : panelWidth,
              height: fullscreen ? undefined : panelHeight,
              resize: fullscreen ? "none" : "both",
              overflow: "auto",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b shrink-0 bg-card">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                <span className="font-semibold text-sm">AI Assistant</span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => setFullscreen(!fullscreen)}
                  title={fullscreen ? "Exit fullscreen" : "Fullscreen"}
                >
                  {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
                </Button>
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
            </div>

            {/* Body */}
            <div className="flex flex-1 min-h-0">
              {/* Sidebar */}
              <div className="w-44 border-r bg-muted/20 flex flex-col shrink-0">
                <div className="p-2 border-b space-y-1">
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
                  <Button size="sm" className="w-full h-7 text-xs" onClick={() => void startNewChat()}>
                    <Plus className="h-3 w-3 mr-1" /> New Chat
                  </Button>
                </div>
                <div className="p-2 border-b">
                  <div className="relative">
                    <Search className="h-3 w-3 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={convSearch}
                      onChange={(e) => setConvSearch(e.target.value)}
                      placeholder="Search chats..."
                      className="h-7 text-xs pl-6"
                    />
                  </div>
                </div>
                <ScrollArea className="flex-1">
                  {loadingConvs ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="p-2"><Skeleton className="h-4 w-full" /></div>
                    ))
                  ) : filteredConversations.length === 0 ? (
                    <div className="p-3 text-xs text-muted-foreground text-center">
                      {convSearch ? "No matching chats" : "No conversations yet"}
                    </div>
                  ) : (
                    filteredConversations.map((c) => (
                      <div
                        key={c.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => setActiveConvId(c.id)}
                        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActiveConvId(c.id); } }}
                        className={cn(
                          "w-full text-left p-2 text-xs hover:bg-accent transition-colors group flex items-start justify-between border-b border-border/40 cursor-pointer",
                          activeConvId === c.id && "bg-accent"
                        )}
                      >
                        <div className="truncate flex-1 min-w-0">
                          <span className="truncate block">{c.title || "New Chat"}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {c._count?.messages ?? 0} msgs
                          </span>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteConversation(c.id, e); }}
                          className="opacity-0 group-hover:opacity-100 ml-1 flex-shrink-0 p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))
                  )}
                </ScrollArea>
              </div>

              {/* Main chat area */}
              <div className="flex-1 flex flex-col min-w-0">
                <ScrollArea className="flex-1 p-3" ref={scrollRef}>
                  {loadingMsgs ? (
                    <div className="space-y-3 p-2">
                      <Skeleton className="h-12 w-3/4" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  ) : localMessages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <Sparkles className="h-10 w-10 mx-auto mb-3 opacity-30" />
                      <p className="text-sm font-medium">Ask me anything about your research</p>
                      <p className="text-xs mt-1">I can help with summaries, analysis, and more</p>
                      {suggestedPrompts.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 justify-center mt-4">
                          {suggestedPrompts.map((prompt, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                setInput(prompt);
                                setTimeout(() => sendMessage(), 100);
                              }}
                              className="text-xs px-2.5 py-1 rounded-full border border-border bg-muted/50 hover:bg-accent hover:border-primary/30 transition-colors text-left"
                            >
                              {prompt}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {localMessages.map((msg, idx) => (
                        <div
                          key={msg.id}
                          className={cn(
                            "text-sm rounded-lg group relative",
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground ml-auto max-w-[85%] px-3 py-2"
                              : "max-w-full"
                          )}
                        >
                          {msg.role === "assistant" ? (
                            <div className="bg-muted rounded-lg px-3 py-2 pr-8">
                              {msg.content ? (
                                <div className="ai-message prose prose-sm dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground/90 prose-li:text-foreground/90 prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-pre:bg-muted-foreground/10 prose-pre:border prose-pre:rounded-lg">
                                  <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[rehypeHighlight]}
                                  >
                                    {msg.content}
                                  </ReactMarkdown>
                                </div>
                              ) : (
                                <div className="flex gap-1 py-1">
                                  <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                                  <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                                  <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                                </div>
                              )}
                              <CopyButton content={msg.content} />
                              {msg.model && (
                                <p className="text-[10px] opacity-40 mt-1">
                                  {resolveModelLabel(msg.model)}
                                </p>
                              )}
                            </div>
                          ) : (
                            <div className="whitespace-pre-wrap break-words group">
                              {msg.content}
                              <button
                                onClick={() => handleEditAndResend(msg.id)}
                                className="ml-2 opacity-0 group-hover:opacity-100 inline-flex items-center text-muted-foreground hover:text-foreground align-middle"
                                title="Edit and resend"
                              >
                                <Pencil className="h-3 w-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>

                {/* Input bar */}
                <div className="p-3 border-t flex gap-2 shrink-0 bg-card">
                  {lastUserPrompt && !sending && activeConvId && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 px-2 shrink-0"
                      onClick={regenerateLast}
                      title="Regenerate last response"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  <div className="flex-1 relative">
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
                      className="text-sm h-8 pr-8"
                      disabled={sending}
                    />
                  </div>
                  {sending ? (
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-8 shrink-0"
                      onClick={stopStream}
                      title="Stop generating"
                    >
                      <Square className="h-3.5 w-3.5" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="h-8 shrink-0"
                      onClick={sendMessage}
                      disabled={!input.trim()}
                    >
                      <Send className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
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
