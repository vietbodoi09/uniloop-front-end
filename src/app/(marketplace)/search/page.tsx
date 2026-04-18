import { createClient } from "@/lib/supabase/server";
import { FilterSidebar } from "@/components/products/FilterSidebar";
import { ProductCard } from "@/components/products/ProductCard";
import { formatDistance } from "@/lib/utils/distance";

export const dynamic = "force-dynamic";

interface SP {
  q?: string;
  uni?: string;
  fac?: string;
  sub?: string;
  type?: string;
  min?: string;
  max?: string;
  r?: string;
  lat?: string;
  lng?: string;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const supabase = await createClient();

  const [{ data: universities }, { data: faculties }, { data: subjects }] =
    await Promise.all([
      supabase.from("universities").select("id, short_name").order("short_name"),
      supabase.from("faculties").select("id, name, university_id").order("name"),
      supabase.from("subjects").select("id, name, faculty_id").order("name"),
    ]);

  const { data: results } = await supabase.rpc("search_products", {
    q: sp.q || null,
    p_university: sp.uni || null,
    p_faculty: sp.fac || null,
    p_subject: sp.sub || null,
    p_listing_type: sp.type || null,
    p_min_price: sp.min ? Number(sp.min) : null,
    p_max_price: sp.max ? Number(sp.max) : null,
    p_lat: sp.lat ? Number(sp.lat) : null,
    p_lng: sp.lng ? Number(sp.lng) : null,
    p_radius_m: sp.r ? Number(sp.r) * 1000 : null,
    p_limit: 60,
    p_offset: 0,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 flex gap-8">
      <FilterSidebar
        universities={universities ?? []}
        faculties={faculties ?? []}
        subjects={subjects ?? []}
      />
      <section className="flex-1">
        <h1 className="text-2xl font-semibold mb-4">
          {results?.length ?? 0} result{results?.length === 1 ? "" : "s"}
        </h1>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {results?.map((p: any) => (
            <div key={p.id} className="relative">
              <ProductCard product={p} />
              {p.distance_m != null && (
                <span className="absolute top-2 left-2 rounded-full bg-black/70 px-2 py-0.5 text-xs text-white">
                  {formatDistance(p.distance_m)}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
