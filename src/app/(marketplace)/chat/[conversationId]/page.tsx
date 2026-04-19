import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ChatRoom } from "@/components/chat/ChatRoom";

export const dynamic = "force-dynamic";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: conv } = await supabase
    .from("conversations")
    .select(
      `
      id, buyer_id, seller_id,
      product:products(id, title, images, price),
      buyer:profiles!conversations_buyer_id_fkey(id, full_name, avatar_url),
      seller:profiles!conversations_seller_id_fkey(id, full_name, avatar_url)
    `
    )
    .eq("id", conversationId)
    .maybeSingle();

  if (!conv) notFound();
  if (conv.buyer_id !== user.id && conv.seller_id !== user.id) notFound();

  const { data: messages } = await supabase
    .from("messages")
    .select("id, conversation_id, sender_id, content, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  return (
    <ChatRoom
      conv={conv as any}
      currentUserId={user.id}
      initialMessages={messages ?? []}
    />
  );
}
