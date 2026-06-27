"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGeneratePaperInsightMutation } from "@/redux/api/paperApi";
import { useState, useRef, useEffect } from "react";
import { Bot, Send, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AiPaperChatProps {
  paperId: string;
}

export function AiPaperChat({ paperId }: AiPaperChatProps) {
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [input, setInput] = useState("");
  const [generate, { isLoading }] = useGeneratePaperInsightMutation();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);

    try {
      const result = await generate({ paperId, message: trimmed }).unwrap();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: result?.content || result?.message || "No response" },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I couldn't process that question. Please try again." },
      ]);
    }
  };

  return (
    <div className="border rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/30">
        <div className="flex items-center justify-center w-6 h-6 rounded-md bg-primary/10">
          <Bot className="h-3.5 w-3.5 text-primary" />
        </div>
        <span className="text-sm font-medium">Ask about this paper</span>
      </div>

      <div ref={scrollRef} className="p-3 max-h-[200px] overflow-y-auto space-y-2.5">
        <AnimatePresence>
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              <Sparkles className="h-5 w-5 mx-auto mb-1.5 opacity-30" />
              <p className="text-xs">Ask a question about the paper content</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-xs rounded-lg px-3 py-2 ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground ml-8"
                    : "bg-muted mr-4"
                }`}
              >
                {msg.content}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-2 p-2 border-t">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          placeholder="Ask about this paper..."
          className="h-8 text-xs"
          disabled={isLoading}
        />
        <Button size="sm" className="h-8 px-2.5" onClick={handleSend} disabled={isLoading || !input.trim()}>
          {isLoading ? (
            <div className="h-3 w-3 border-2 border-background border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
    </div>
  );
}
