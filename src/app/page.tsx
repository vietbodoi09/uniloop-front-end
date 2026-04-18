import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

const isConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";

export default async function Home() {
  if (!isConfigured) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">UniLoop</h1>
          <p className="text-lg text-slate-600">
            Sàn giao dịch đồ dùng & tài liệu học tập dành cho sinh viên UEB
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl text-left text-sm">
          <div className="rounded-lg border p-4">
            <p className="font-semibold mb-1">📚 Mua bán sách</p>
            <p className="text-slate-500">Trao đổi giáo trình, sách tham khảo với sinh viên cùng trường.</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold mb-1">💬 Chat thời gian thực</p>
            <p className="text-slate-500">Nhắn tin trực tiếp với người bán ngay trên nền tảng.</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold mb-1">📍 Tìm theo khoảng cách</p>
            <p className="text-slate-500">Lọc bài đăng gần khu vực campus của bạn.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button asChild size="lg">
            <Link href="/signup">Đăng ký ngay</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/login">Đăng nhập</Link>
          </Button>
        </div>
        <p className="text-xs text-slate-400">
          Chỉ dành cho email <strong>*.edu.vn</strong>
        </p>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, title, images, listing_type, price, location_label")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(40);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Latest listings</h1>
        <Button asChild>
          <Link href="/products/new/step-1-details">+ Post listing</Link>
        </Button>
      </div>
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
