import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  MessageSquare,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";

export const dynamic = "force-dynamic";

const isConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-red-300/40 blur-3xl animate-float" />
        <div
          className="absolute top-10 right-0 h-96 w-96 rounded-full bg-amber-300/40 blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute -bottom-20 left-1/3 h-80 w-80 rounded-full bg-orange-300/30 blur-3xl animate-float"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-14 pb-10 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-white/70 px-3 py-1 text-xs font-medium text-red-700 backdrop-blur">
          <Sparkles className="h-3.5 w-3.5" />
          Dành cho sinh viên toàn quốc
        </div>
        <h1 className="mt-5 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
          UniLoop
          <br />
          <span className="text-brand-gradient">kết nối hôm nay cho ngày mai</span>
        </h1>
        <p className="mt-4 mx-auto max-w-xl text-base sm:text-lg text-muted-foreground">
          Sàn giao dịch đáng tin cậy cho sinh viên Việt Nam: sách, đồ dùng, thiết bị —
          tất cả chỉ cách bạn vài bước chân.
        </p>
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="group rounded-2xl bg-white/70 backdrop-blur border border-border/60 p-5 card-hover">
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-md shadow-red-500/20">
        {icon}
      </div>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}

export default async function Home() {
  if (!isConfigured) {
    return (
      <div className="min-h-[80vh]">
        <Hero />
        <div className="mx-auto max-w-5xl px-4 pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FeatureCard
              icon={<BookOpen className="h-5 w-5" />}
              title="Mua bán sách"
              desc="Trao đổi giáo trình, sách tham khảo với sinh viên cùng trường."
            />
            <FeatureCard
              icon={<MessageSquare className="h-5 w-5" />}
              title="Chat thời gian thực"
              desc="Nhắn tin trực tiếp với người bán ngay trên nền tảng."
            />
            <FeatureCard
              icon={<MapPin className="h-5 w-5" />}
              title="Tìm theo khoảng cách"
              desc="Lọc bài đăng gần khu vực campus của bạn."
            />
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-brand-gradient border-0 text-white shadow-lg shadow-red-500/25 hover:opacity-90"
            >
              <Link href="/signup">
                Bắt đầu ngay
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full bg-white/80 backdrop-blur"
            >
              <Link href="/login">Tôi đã có tài khoản</Link>
            </Button>
          </div>
        </div>
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
    <>
      <Hero />

      <div className="mx-auto max-w-7xl px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
          <div className="flex items-center gap-3 rounded-2xl bg-white/70 backdrop-blur border border-border/60 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-700">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Giao dịch an toàn</p>
              <p className="text-xs text-muted-foreground">Cộng đồng sinh viên xác thực</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-white/70 backdrop-blur border border-border/60 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Nhanh chóng</p>
              <p className="text-xs text-muted-foreground">Chat & chốt deal realtime</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-white/70 backdrop-blur border border-border/60 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Gần bạn</p>
              <p className="text-xs text-muted-foreground">Lọc theo vị trí campus</p>
            </div>
          </div>
        </div>

        <div className="mb-6 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Bài đăng mới nhất
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Cập nhật liên tục từ cộng đồng UEB
            </p>
          </div>
          <Button
            asChild
            className="rounded-full bg-brand-gradient text-white border-0 shadow-md shadow-red-500/20 hover:opacity-90"
          >
            <Link href="/products/new/step-1-details">
              <Sparkles className="h-4 w-4 mr-1" />
              Đăng bài mới
            </Link>
          </Button>
        </div>

        {!products?.length ? (
          <div className="rounded-2xl border border-dashed border-border bg-white/50 p-12 text-center">
            <p className="text-slate-500">Chưa có bài đăng nào. Hãy là người đầu tiên!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {products.map((p) => (
              <ProductCard key={p.id} product={p as any} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
