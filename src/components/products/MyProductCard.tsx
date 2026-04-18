"use client";
import Link from "next/link";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { deleteProduct } from "@/app/(marketplace)/profile/me/actions";
import { toast } from "sonner";

interface Props {
  product: {
    id: string;
    title: string;
    images: string[];
    listing_type: string;
    price: number | null;
    location_label: string | null;
  };
}

const publicUrl = (path: string) =>
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${path}`;

export function MyProductCard({ product }: Props) {
  const cover = product.images?.[0] ? publicUrl(product.images[0]) : null;
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Xoá bài đăng này?")) return;
    setDeleting(true);
    const res = await deleteProduct(product.id);
    if (res.error) {
      toast.error(res.error);
      setDeleting(false);
    } else {
      toast.success("Đã xoá bài đăng.");
    }
  };

  return (
    <div className="group relative block">
      <Link href={`/products/${product.id}`}>
        <div className="aspect-square overflow-hidden rounded-lg bg-slate-100">
          {cover && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover} alt={product.title} className="h-full w-full object-cover group-hover:scale-105 transition" />
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
          </div>
        </div>
      </Link>

      {/* Delete button */}
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="absolute top-2 right-2 rounded-full bg-red-500 p-1.5 text-white opacity-0 group-hover:opacity-100 transition hover:bg-red-600 disabled:opacity-50"
        title="Xoá bài đăng"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
