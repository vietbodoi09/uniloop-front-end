"use client";
import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { submitReview } from "@/app/(marketplace)/products/[id]/review-actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ReviewForm({
  productId,
  sellerId,
}: {
  productId: string;
  sellerId: string;
}) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [pending, start] = useTransition();

  const submit = () => {
    if (rating === 0) return toast.error("Pick a rating");
    start(async () => {
      const res = await submitReview({ productId, sellerId, rating, comment });
      if (!res.ok) return toast.error(res.error);
      toast.success("Thanks for your review!");
      setComment("");
      setRating(0);
    });
  };

  return (
    <div className="rounded-lg border p-4 space-y-3">
      <p className="font-medium">Leave a review</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
          >
            <Star
              className={cn(
                "h-6 w-6 transition",
                (hover || rating) >= n
                  ? "fill-amber-400 text-amber-400"
                  : "text-slate-300"
              )}
            />
          </button>
        ))}
      </div>
      <Textarea
        rows={3}
        placeholder="How was the transaction?"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <Button onClick={submit} disabled={pending}>
        {pending ? "Submitting…" : "Submit review"}
      </Button>
    </div>
  );
}
