import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ImageIcon, MapPin, Repeat } from "lucide-react";

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
  const isExchange = product.listing_type === "exchange";

  return (
    <Link
      href={`/products/${product.id}`}
      className="group card-hover block rounded-xl bg-card border border-border/60 overflow-hidden"
    >
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-indigo-50">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageIcon className="h-10 w-10 text-slate-300" />
          </div>
        )}

        <div className="absolute top-2 left-2 flex gap-1.5">
          {isExchange && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur px-2 py-0.5 text-[10px] font-semibold text-indigo-700 shadow-sm">
              <Repeat className="h-3 w-3" />
              Trao đổi
            </span>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition" />
      </div>

      <div className="p-3 space-y-1.5">
        <p className="line-clamp-2 text-sm font-medium leading-snug min-h-[2.5rem] group-hover:text-primary transition-colors">
          {product.title}
        </p>
        <div className="flex items-end justify-between gap-2 pt-1">
          <span className="text-base font-bold text-brand-gradient leading-none">
            {isExchange ? (
              <Badge variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-50/60 font-semibold">
                Exchange
              </Badge>
            ) : (
              <>{product.price?.toLocaleString("vi-VN")} ₫</>
            )}
          </span>
        </div>
        {product.location_label && (
          <p className="flex items-center gap-1 text-[11px] text-muted-foreground truncate pt-0.5">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{product.location_label}</span>
          </p>
        )}
      </div>
    </Link>
  );
}
