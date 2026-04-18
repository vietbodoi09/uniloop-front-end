import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MyProductCard } from "@/components/products/MyProductCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MyProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/profile/me");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: products } = await supabase
    .from("products")
    .select("id, title, images, listing_type, price, location_label, status")
    .eq("seller_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={profile?.avatar_url ?? ""} />
          <AvatarFallback>{profile?.full_name?.[0] ?? "U"}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-semibold">
            {profile?.full_name ?? user.email}
          </h1>
          <p className="text-sm text-slate-500">{user.email}</p>
          <p className="mt-1 text-sm flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            {profile?.rating_avg?.toFixed(1) ?? "—"} (
            {profile?.rating_count ?? 0} reviews)
          </p>
        </div>
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-4">
          Your listings ({products?.length ?? 0})
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {products?.map((p) => (
            <MyProductCard key={p.id} product={p as any} />
          ))}
        </div>
      </section>
    </div>
  );
}
