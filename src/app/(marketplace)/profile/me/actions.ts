"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function deleteProduct(productId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId)
    .eq("seller_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/profile/me");
  revalidatePath("/");
  revalidatePath(`/products/${productId}`);
  return { ok: true };
}

export async function markAsSold(productId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("products")
    .update({ status: "sold" })
    .eq("id", productId)
    .eq("seller_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/profile/me");
  revalidatePath("/");
  revalidatePath(`/products/${productId}`);
  return { ok: true };
}

export async function markAsActive(productId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("products")
    .update({ status: "active" })
    .eq("id", productId)
    .eq("seller_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/profile/me");
  revalidatePath("/");
  revalidatePath(`/products/${productId}`);
  return { ok: true };
}
