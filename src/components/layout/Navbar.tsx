"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { useUser } from "@/hooks/useUser";

export function Navbar() {
  const router = useRouter();
  const { user, signOut } = useUser();
  const [q, setQ] = useState("");

  return (
    <header className="border-b bg-white sticky top-0 z-40">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 h-14">
        <Link href="/" className="font-bold text-lg">
          UniLoop
        </Link>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            router.push(`/search?q=${encodeURIComponent(q)}`);
          }}
          className="flex-1 max-w-xl relative"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            className="pl-9"
            placeholder="Search books, items…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </form>
        {user ? (
          <>
            <Button asChild size="sm">
              <Link href="/products/new/step-1-details">
                <Plus className="h-4 w-4 mr-1" />
                Post
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/chat">Chat</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/profile/me">Me</Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                await signOut();
                router.refresh();
              }}
            >
              Sign out
            </Button>
          </>
        ) : (
          <>
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/signup">Sign up</Link>
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
