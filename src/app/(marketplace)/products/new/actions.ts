"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { productFullSchema } from "@/lib/validators/product";

export async function createProduct(input: unknown) {
  const parsed = productFullSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: "Validation failed" };
  }
  const d = parsed.data;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, error: "Not authenticated" };

  await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: user.email!,
      full_name: user.user_metadata?.full_name ?? null,
    },
    { onConflict: "id" }
  );

  const { data: profile } = await supabase
    .from("profiles")
    .select("university_id")
    .eq("id", user.id)
    .single();

  const { data, error } = await supabase
    .from("products")
    .insert({
      seller_id: user.id,
      title: d.title,
      description: d.description ?? null,
      images: d.images,
      listing_type: d.listingType,
      condition: d.condition,
      price: d.listingType === "sell" ? d.price : null,
      subject_id: d.subjectId ?? null,
      university_id: profile?.university_id ?? null,
      location_label: d.locationLabel,
      geo: `SRID=4326;POINT(${d.lng} ${d.lat})`,
    })
    .select("id")
    .single();

  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/");
  return { ok: true as const, id: data.id };
}
