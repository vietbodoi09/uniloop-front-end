"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRealtimeChat, type ChatMessage } from "@/hooks/useRealtimeChat";
import { sendMessage } from "@/app/(marketplace)/chat/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = text.trim();
    if (!content) return;
    setText("");

    start(async () => {
      const res = await sendMessage(conv.id, content);
      if (res && "error" in res) {
        toast.error(res.error);
        setText(content); // restore text on error
      }
    });
  };

  return (
    <div className="mx-auto max-w-2xl h-[calc(100vh-3.5rem)] flex flex-col border-x">
      <header className="border-b px-4 py-3 bg-white">
        <p className="font-semibold">{other.full_name}</p>
        <p className="text-xs text-slate-500 truncate">Re: {conv.product?.title}</p>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-2 bg-slate-50">
        {messages.length === 0 && (
          <p className="text-center text-sm text-slate-400 mt-8">
            No messages yet. Say hi!
          </p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn("flex", m.sender_id === currentUserId ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[75%] rounded-2xl px-3 py-2 text-sm",
                m.sender_id === currentUserId
                  ? "bg-slate-900 text-white rounded-br-sm"
                  : "bg-white border rounded-bl-sm"
              )}
            >
              {m.content}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={submit} className="border-t p-3 flex gap-2 bg-white">
        <Input
          placeholder="Type a message…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit(e as any);
            }
          }}
        />
        <Button type="submit" disabled={pending || !text.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
