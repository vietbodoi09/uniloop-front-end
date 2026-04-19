"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, MessageCircle, User, LogOut } from "lucide-react";
import { useUser } from "@/hooks/useUser";

export function Navbar() {
  const router = useRouter();
  const { user, signOut } = useUser();
  const [q, setQ] = useState("");

  return (
    <header className="sticky top-0 z-40 glass border-b border-border/60">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 h-16">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient text-white font-bold shadow-lg shadow-red-500/20">
            U
          </span>
          <span className="hidden sm:inline text-lg font-bold tracking-tight text-brand-gradient">
            UniLoop
          </span>
        </Link>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            router.push(`/search?q=${encodeURIComponent(q)}`);
          }}
          className="flex-1 max-w-xl relative"
        >
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            className="pl-10 h-10 rounded-full bg-white/70 border-border/70 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-ring/40 transition"
            placeholder="Tìm sách, đồ dùng, tài liệu…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </form>

        {user ? (
          <div className="flex items-center gap-1">
            <Button asChild size="sm" className="rounded-full bg-brand-gradient hover:opacity-90 text-white shadow-md shadow-red-500/20 border-0">
              <Link href="/products/new/step-1-details">
                <Plus className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Đăng bài</span>
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="rounded-full">
              <Link href="/chat">
                <MessageCircle className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">Chat</span>
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="rounded-full">
              <Link href="/profile/me">
                <User className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">Me</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full text-muted-foreground hover:text-foreground"
              onClick={async () => {
                await signOut();
                router.refresh();
              }}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="rounded-full">
              <Link href="/login">Đăng nhập</Link>
            </Button>
            <Button asChild size="sm" className="rounded-full bg-brand-gradient hover:opacity-90 text-white border-0 shadow-md shadow-red-500/20">
              <Link href="/signup">Đăng ký</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
