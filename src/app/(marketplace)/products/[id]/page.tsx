import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, MessageCircle, Star } from "lucide-react";
import { openConversation } from "@/app/(marketplace)/chat/actions";
import { ReviewList } from "@/components/reviews/ReviewList";
import { ReviewForm } from "@/components/reviews/ReviewForm";

const conditionLabel: Record<string, string> = {
  new: "New",
  like_new: "Like new",
  used: "Used",
  for_parts: "For parts",
};

const publicUrl = (path: string) =>
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${path}`;

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select(
      `
      *,
      seller:profiles!products_seller_id_fkey (
        id, full_name, avatar_url, phone, zalo, messenger_url, rating_avg, rating_count
      )
    `
    )
    .eq("id", id)
    .single();

  if (!product) notFound();

  const imageUrls = (product.images ?? []).map((p: string) => publicUrl(p));
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const canReview = !!user && user.id !== product.seller_id;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 grid gap-8 md:grid-cols-2">
      <div className="space-y-3">
        {imageUrls[0] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrls[0]}
            alt=""
            className="w-full aspect-square object-cover rounded-lg"
          />
        )}
        <div className="grid grid-cols-4 gap-2">
          {imageUrls.slice(1).map((u: string) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={u}
              src={u}
              alt=""
              className="aspect-square object-cover rounded-md"
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <div className="flex gap-2">
          <Badge>{product.listing_type === "sell" ? "For sale" : "Exchange"}</Badge>
          <Badge variant="outline">{conditionLabel[product.condition]}</Badge>
        </div>
        {product.price && (
          <p className="text-2xl font-bold">
            {product.price.toLocaleString("vi-VN")} ₫
          </p>
        )}
        <p className="whitespace-pre-wrap text-slate-700">
          {product.description}
        </p>
        <p className="text-sm text-slate-600">📍 {product.location_label}</p>

        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={product.seller?.avatar_url ?? ""} />
              <AvatarFallback>
                {product.seller?.full_name?.[0] ?? "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium">{product.seller?.full_name}</p>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                {product.seller?.rating_avg?.toFixed(1) ?? "—"} (
                {product.seller?.rating_count ?? 0})
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <form
              action={async () => {
                "use server";
                await openConversation(product.id);
              }}
              className="col-span-2"
            >
              <Button type="submit" className="w-full">
                <MessageCircle className="h-4 w-4 mr-2" /> Chat in-app
              </Button>
            </form>
            {product.seller?.phone && (
              <Button variant="outline" asChild>
                <a href={`tel:${product.seller.phone}`}>
                  <Phone className="h-4 w-4 mr-1" />
                  Call
                </a>
              </Button>
            )}
            {product.seller?.zalo && (
              <Button variant="outline" asChild>
                <a
                  href={`https://zalo.me/${product.seller.zalo}`}
                  target="_blank"
                >
                  Zalo
                </a>
              </Button>
            )}
            {product.seller?.messenger_url && (
              <Button variant="outline" asChild>
                <a href={product.seller.messenger_url} target="_blank">
                  Messenger
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>

      <section className="md:col-span-2 mt-8 space-y-6">
        <h2 className="text-xl font-semibold">
          Reviews for {product.seller?.full_name}
        </h2>
        <ReviewList sellerId={product.seller_id} />
        {canReview && (
          <ReviewForm productId={product.id} sellerId={product.seller_id} />
        )}
      </section>
    </div>
  );
}
