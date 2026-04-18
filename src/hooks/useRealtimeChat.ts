"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export function useRealtimeChat(conversationId: string, initial: ChatMessage[]) {
  const [messages, setMessages] = useState<ChatMessage[]>(initial);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`conv:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) =>
          setMessages((prev) =>
            prev.some((m) => m.id === (payload.new as ChatMessage).id)
              ? prev
              : [...prev, payload.new as ChatMessage]
          )
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  return messages;
}
