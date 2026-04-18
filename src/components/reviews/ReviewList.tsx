import { createClient } from "@/lib/supabase/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export async function ReviewList({ sellerId }: { sellerId: string }) {
  const supabase = await createClient();
  const { data: reviews } = await supabase
    .from("reviews")
    .select(
      `
      id, rating, comment, created_at,
      reviewer:profiles!reviews_reviewer_id_fkey(full_name, avatar_url)
    `
    )
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (!reviews?.length)
    return <p className="text-sm text-slate-500">No reviews yet.</p>;

  return (
    <ul className="space-y-4">
      {reviews.map((r: any) => (
        <li key={r.id} className="flex gap-3">
          <Avatar>
            <AvatarImage src={r.reviewer?.avatar_url} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">
                {r.reviewer?.full_name}
              </span>
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < r.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-400">
                {formatDistanceToNow(new Date(r.created_at), {
                  addSuffix: true,
                })}
              </span>
            </div>
            {r.comment && (
              <p className="text-sm text-slate-700 mt-1">{r.comment}</p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
