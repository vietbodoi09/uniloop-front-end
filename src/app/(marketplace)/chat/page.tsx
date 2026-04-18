import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

export const dynamic = "force-dynamic";

export default async function ChatListPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/chat");

  const { data: convs } = await supabase
    .from("conversations")
    .select(
      `
      id, last_message_at, buyer_id, seller_id,
      product:products(id, title, images),
      buyer:profiles!conversations_buyer_id_fkey(id, full_name, avatar_url),
      seller:profiles!conversations_seller_id_fkey(id, full_name, avatar_url)
    `
    )
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order("last_message_at", { ascending: false });

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Messages</h1>
      <ul className="divide-y rounded-lg border bg-white">
        {convs?.map((c: any) => {
          const other = c.buyer_id === user.id ? c.seller : c.buyer;
          return (
            <li key={c.id}>
              <Link
                href={`/chat/${c.id}`}
                className="flex items-center gap-3 p-4 hover:bg-slate-50"
              >
                <Avatar>
                  <AvatarImage src={other?.avatar_url ?? ""} />
                  <AvatarFallback>
                    {other?.full_name?.[0] ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{other?.full_name}</p>
                  <p className="text-sm text-slate-500 truncate">
                    Re: {c.product?.title}
                  </p>
                </div>
                <span className="text-xs text-slate-400 shrink-0">
                  {c.last_message_at &&
                    formatDistanceToNow(new Date(c.last_message_at), {
                      addSuffix: true,
                    })}
                </span>
              </Link>
            </li>
          );
        })}
        {!convs?.length && (
          <li className="p-8 text-center text-slate-500">No messages yet.</li>
        )}
      </ul>
    </div>
  );
}
