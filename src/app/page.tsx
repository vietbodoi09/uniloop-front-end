import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/products/ProductCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, title, images, listing_type, price, location_label")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(40);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Latest listings</h1>
      {!products?.length && (
        <p className="text-slate-500">No listings yet. Be the first to post!</p>
      )}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {products?.map((p) => (
          <ProductCard key={p.id} product={p as any} />
        ))}
      </div>
    </div>
  );
}
