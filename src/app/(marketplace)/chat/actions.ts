"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function openConversation(productId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: product } = await supabase
    .from("products")
    .select("seller_id")
    .eq("id", productId)
    .maybeSingle();

  if (!product || product.seller_id === user.id) {
    return { error: "Invalid conversation target" };
  }

  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .eq("product_id", productId)
    .eq("buyer_id", user.id)
    .eq("seller_id", product.seller_id)
    .maybeSingle();

  if (existing) redirect(`/chat/${existing.id}`);

  const { data: created, error } = await supabase
    .from("conversations")
    .insert({
      product_id: productId,
      buyer_id: user.id,
      seller_id: product.seller_id,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };
  redirect(`/chat/${created.id}`);
}

export async function sendMessage(conversationId: string, content: string) {
  if (!content.trim()) return { error: "Empty message" };
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender_id: user.id,
    content: content.trim(),
  });
  if (error) return { error: error.message };

  await supabase
    .from("conversations")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", conversationId);

  return { ok: true };
}
