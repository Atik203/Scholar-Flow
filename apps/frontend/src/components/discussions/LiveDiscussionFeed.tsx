"use client";

import { useDiscussionSocket, DiscussionMessage } from "@/hooks/useDiscussionSocket";
import { cn } from "@/lib/utils";
import { MessageCircle, Users } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send } from "lucide-react";

interface LiveDiscussionFeedProps {
  room: string;
}

export function LiveDiscussionFeed({ room }: LiveDiscussionFeedProps) {
  const [messages, setMessages] = useState<DiscussionMessage[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const onMessage = useCallback((msg: DiscussionMessage) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const { connected, memberCount, typingUsers, sendMessage, sendTyping } =
    useDiscussionSocket({
      room,
      enabled: true,
      onMessage,
    });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    sendMessage(trimmed);
    setInput("");
  };

  const handleTyping = (value: string) => {
    setInput(value);
    sendTyping(value.length > 0);
  };

  return (
    <div className="flex flex-col border rounded-lg bg-card h-[400px]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/20">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Live Discussion</span>
          {connected ? (
            <Badge variant="outline" className="text-xs h-5 bg-green-50 text-green-700 border-green-200">
              Live
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs h-5 bg-red-50 text-red-700 border-red-200">
              Offline
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Users className="h-3 w-3" />
          {memberCount}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {messages.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No messages yet. Start the conversation!
          </p>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "text-sm",
                  msg.userName === "You" ? "text-right" : "text-left"
                )}
              >
                <div
                  className={cn(
                    "inline-block max-w-[85%] p-2.5 rounded-lg",
                    msg.userName === "You"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {msg.userName !== "You" && (
                    <p className="text-xs font-medium mb-0.5 opacity-70">
                      {msg.userName}
                    </p>
                  )}
                  <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                  <p className="text-[10px] opacity-50 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Typing indicators */}
        {typingUsers.length > 0 && (
          <div className="text-xs text-muted-foreground italic mt-2">
            {typingUsers.map((u) => u.userName).join(", ")} typing...
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="flex gap-2 p-3 border-t">
        <Input
          value={input}
          onChange={(e) => handleTyping(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="flex-1 text-sm h-9"
        />
        <Button size="sm" className="h-9" onClick={handleSend} disabled={!input.trim()}>
          <Send className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
