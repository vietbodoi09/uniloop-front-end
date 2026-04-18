"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRealtimeChat, type ChatMessage } from "@/hooks/useRealtimeChat";
import { sendMessage } from "@/app/(marketplace)/chat/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  conv: {
    id: string;
    buyer_id: string;
    seller_id: string;
    product: { title: string; images: string[] } | null;
    buyer: { id: string; full_name: string };
    seller: { id: string; full_name: string };
  };
  currentUserId: string;
  initialMessages: ChatMessage[];
}

export function ChatRoom({ conv, currentUserId, initialMessages }: Props) {
  const messages = useRealtimeChat(conv.id, initialMessages);
  const [text, setText] = useState("");
  const [pending, start] = useTransition();
  const scrollRef = useRef<HTMLDivElement>(null);
  const other = conv.buyer.id === currentUserId ? conv.seller : conv.buyer;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const content = text;
    if (!content.trim()) return;
    setText("");
    start(() => {
      sendMessage(conv.id, content);
    });
  };

  return (
    <div className="mx-auto max-w-2xl h-[calc(100vh-3.5rem)] flex flex-col">
      <header className="border-b px-4 py-3">
        <p className="font-semibold">{other.full_name}</p>
        <p className="text-xs text-slate-500 truncate">
          Re: {conv.product?.title}
        </p>
      </header>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-2"
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "flex",
              m.sender_id === currentUserId ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[75%] rounded-2xl px-3 py-2 text-sm",
                m.sender_id === currentUserId
                  ? "bg-slate-900 text-white rounded-br-sm"
                  : "bg-slate-100 rounded-bl-sm"
              )}
            >
              {m.content}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={submit} className="border-t p-3 flex gap-2">
        <Input
          placeholder="Type a message…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button type="submit" disabled={pending || !text.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
