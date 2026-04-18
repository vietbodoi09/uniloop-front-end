import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface Props {
  product: {
    id: string;
    title: string;
    images: string[];
    listing_type: "sell" | "exchange";
    price: number | null;
    location_label: string | null;
  };
}

const publicUrl = (path: string) =>
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${path}`;

export function ProductCard({ product }: Props) {
  const cover = product.images?.[0] ? publicUrl(product.images[0]) : null;

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="aspect-square overflow-hidden rounded-lg bg-slate-100">
        {cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={product.title}
            className="h-full w-full object-cover group-hover:scale-105 transition"
          />
        )}
      </div>
      <div className="mt-2 space-y-1">
        <p className="line-clamp-2 text-sm font-medium">{product.title}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">
            {product.listing_type === "exchange" ? (
              <Badge variant="outline">Exchange</Badge>
            ) : (
              `${product.price?.toLocaleString("vi-VN")} ₫`
            )}
          </span>
          <span className="text-xs text-slate-500 truncate max-w-[50%]">
            {product.location_label}
          </span>
        </div>
      </div>
    </Link>
  );
}
