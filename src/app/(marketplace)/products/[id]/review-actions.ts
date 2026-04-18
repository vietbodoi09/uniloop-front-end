"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { reviewSchema } from "@/lib/validators/review";

export async function submitReview(input: unknown) {
  const parsed = reviewSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Invalid input" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, error: "Not authenticated" };
  if (user.id === parsed.data.sellerId)
    return { ok: false as const, error: "Can't review yourself" };

  const { error } = await supabase.from("reviews").upsert(
    {
      product_id: parsed.data.productId,
      reviewer_id: user.id,
      seller_id: parsed.data.sellerId,
      rating: parsed.data.rating,
      comment: parsed.data.comment ?? null,
    },
    { onConflict: "product_id,reviewer_id" }
  );
  if (error) return { ok: false as const, error: error.message };

  revalidatePath(`/products/${parsed.data.productId}`);
  revalidatePath(`/profile/${parsed.data.sellerId}`);
  return { ok: true as const };
}
