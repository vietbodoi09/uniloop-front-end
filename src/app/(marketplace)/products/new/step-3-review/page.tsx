"use client";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { usePostingStore } from "@/lib/stores/postingStore";
import { createClient } from "@/lib/supabase/client";
import { createProduct } from "../actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const conditionLabel: Record<string, string> = {
  new: "New",
  like_new: "Like new",
  used: "Used",
  for_parts: "For parts",
};

export default function Step3() {
  const router = useRouter();
  const { draft, setStep, reset } = usePostingStore();
  const [pending, startTransition] = useTransition();
  useEffect(() => setStep(3), [setStep]);

  const [urls, setUrls] = useState<string[]>([]);
  useEffect(() => {
    const supabase = createClient();
    setUrls(
      draft.images.map(
        (p) =>
          supabase.storage.from("product-images").getPublicUrl(p).data.publicUrl
      )
    );
  }, [draft.images]);

  const publish = () => {
    startTransition(async () => {
      const result = await createProduct(draft);
      if (!result.ok) {
        toast.error(
          typeof result.error === "string" ? result.error : "Validation failed"
        );
        return;
      }
      reset();
      toast.success("Đăng bài thành công!");
      router.push(`/products/${result.id}`);
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex gap-2 overflow-x-auto">
            {urls.map((u) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={u}
                src={u}
                alt=""
                className="h-32 w-32 rounded-md object-cover shrink-0"
              />
            ))}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{draft.title}</h2>
            <div className="mt-1 flex gap-2">
              <Badge>
                {draft.listingType === "sell" ? "For sale" : "Exchange"}
              </Badge>
              <Badge variant="outline">{conditionLabel[draft.condition]}</Badge>
            </div>
            {draft.listingType === "sell" && draft.price && (
              <p className="mt-2 text-lg font-semibold">
                {draft.price.toLocaleString("vi-VN")} ₫
              </p>
            )}
            {draft.description && (
              <p className="mt-3 whitespace-pre-wrap text-slate-700">
                {draft.description}
              </p>
            )}
            <p className="mt-3 text-sm text-slate-600">
              📍 {draft.locationLabel}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => router.push("/products/new/step-2-location")}
        >
          ← Back
        </Button>
        <Button onClick={publish} disabled={pending}>
          {pending ? "Publishing…" : "Publish listing"}
        </Button>
      </div>
    </div>
  );
}
