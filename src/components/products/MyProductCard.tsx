"use client";
import Link from "next/link";
import { useState } from "react";
import { Trash2, CheckCircle, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  deleteProduct,
  markAsSold,
  markAsActive,
} from "@/app/(marketplace)/profile/me/actions";
import { toast } from "sonner";

interface Props {
  product: {
    id: string;
    title: string;
    images: string[];
    listing_type: string;
    price: number | null;
    location_label: string | null;
    status: string;
  };
}

const publicUrl = (path: string) =>
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${path}`;

export function MyProductCard({ product }: Props) {
  const cover = product.images?.[0] ? publicUrl(product.images[0]) : null;
  const [loading, setLoading] = useState(false);
  const isSold = product.status === "sold";

  const run = async (fn: () => Promise<{ ok?: true; error?: string }>, msg: string) => {
    if (!confirm(msg)) return;
    setLoading(true);
    const res = await fn();
    setLoading(false);
    if (res.error) toast.error(res.error);
    else toast.success("Đã cập nhật.");
  };

  return (
    <div className="group relative block">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden rounded-lg bg-slate-100">
          {cover && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cover}
              alt={product.title}
              className={`h-full w-full object-cover transition group-hover:scale-105 ${isSold ? "opacity-50" : ""}`}
            />
          )}
          {isSold && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="rounded-full bg-red-500 px-3 py-1 text-sm font-semibold text-white">
                Đã bán
              </span>
            </div>
          )}
        </div>
        <div className="mt-2 space-y-1">
          <p className="line-clamp-2 text-sm font-medium">{product.title}</p>
          <div className="flex items-center gap-2">
            {isSold ? (
              <Badge variant="destructive">Đã bán</Badge>
            ) : (
              <span className="text-sm font-semibold">
                {product.listing_type === "exchange" ? (
                  <Badge variant="outline">Exchange</Badge>
                ) : (
                  `${product.price?.toLocaleString("vi-VN")} ₫`
                )}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Action buttons — visible on hover */}
      <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition">
        {!isSold ? (
          <button
            onClick={() => run(() => markAsSold(product.id), "Đánh dấu đã bán?")}
            disabled={loading}
            className="rounded-full bg-emerald-500 p-1.5 text-white hover:bg-emerald-600 disabled:opacity-50"
            title="Đánh dấu đã bán"
          >
            <CheckCircle className="h-3.5 w-3.5" />
          </button>
        ) : (
          <button
            onClick={() => run(() => markAsActive(product.id), "Đăng bán lại?")}
            disabled={loading}
            className="rounded-full bg-blue-500 p-1.5 text-white hover:bg-blue-600 disabled:opacity-50"
            title="Đăng bán lại"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          onClick={() => run(() => deleteProduct(product.id), "Xoá bài đăng này?")}
          disabled={loading}
          className="rounded-full bg-red-500 p-1.5 text-white hover:bg-red-600 disabled:opacity-50"
          title="Xoá bài đăng"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
