"use client";
import { useEffect, useRef, useState } from "react";
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
  const latestAt = useRef(initial.at(-1)?.created_at ?? new Date(0).toISOString());

  const addUnique = (incoming: ChatMessage[]) => {
    setMessages((prev) => {
      const ids = new Set(prev.map((m) => m.id));
      const fresh = incoming.filter((m) => !ids.has(m.id));
      if (!fresh.length) return prev;
      const next = [...prev, ...fresh].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      latestAt.current = next.at(-1)!.created_at;
      return next;
    });
  };

  // Realtime subscription
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
        (payload) => addUnique([payload.new as ChatMessage])
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [conversationId]);

  // Polling fallback every 3 seconds
  useEffect(() => {
    const supabase = createClient();
    const interval = setInterval(async () => {
      const { data } = await supabase
        .from("messages")
        .select("id, conversation_id, sender_id, content, created_at")
        .eq("conversation_id", conversationId)
        .gt("created_at", latestAt.current)
        .order("created_at", { ascending: true });

      if (data?.length) addUnique(data);
    }, 3000);

    return () => clearInterval(interval);
  }, [conversationId]);

  return messages;
}
