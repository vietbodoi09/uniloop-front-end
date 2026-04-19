"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {
  loginSchema,
  magicLinkSchema,
  type LoginInput,
} from "@/lib/validators/auth";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/";
  const [loading, setLoading] = useState(false);

  const pwForm = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });
  const mlForm = useForm<{ email: string }>({
    resolver: zodResolver(magicLinkSchema),
  });

  const onPassword = async (data: LoginInput) => {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword(data);
    setLoading(false);
    if (error) return toast.error(error.message);
    router.push(next);
    router.refresh();
  };

  const onMagic = async ({ email }: { email: string }) => {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/api/auth/callback?next=${next}`,
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Magic link sent. Check your inbox.");
  };

  return (
    <Card className="border-border/60 shadow-xl shadow-red-500/5 backdrop-blur bg-white/80">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Chào mừng trở lại</CardTitle>
        <p className="text-sm text-muted-foreground text-center">
          Đăng nhập để tiếp tục giao dịch
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="password">
          <TabsList className="grid w-full grid-cols-2 rounded-full">
            <TabsTrigger value="password" className="rounded-full">Mật khẩu</TabsTrigger>
            <TabsTrigger value="magic" className="rounded-full">Magic link</TabsTrigger>
          </TabsList>

          <TabsContent value="password">
            <form
              onSubmit={pwForm.handleSubmit(onPassword)}
              className="space-y-4 pt-5"
            >
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="example@gmail.com"
                  {...pwForm.register("email")}
                />
                {pwForm.formState.errors.email && (
                  <p className="text-sm text-red-600">
                    {pwForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>Mật khẩu</Label>
                <Input type="password" {...pwForm.register("password")} />
              </div>
              <Button className="w-full rounded-full bg-brand-gradient text-white border-0 shadow-md shadow-red-500/20 hover:opacity-90" disabled={loading}>
                {loading ? "Đang đăng nhập…" : "Đăng nhập"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="magic">
            <form
              onSubmit={mlForm.handleSubmit(onMagic)}
              className="space-y-4 pt-5"
            >
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="example@gmail.com"
                  {...mlForm.register("email")}
                />
                {mlForm.formState.errors.email && (
                  <p className="text-sm text-red-600">
                    {mlForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              <Button className="w-full rounded-full bg-brand-gradient text-white border-0 shadow-md shadow-red-500/20 hover:opacity-90" disabled={loading}>
                {loading ? "Đang gửi…" : "Gửi magic link"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Chưa có tài khoản?{" "}
          <Link href="/signup" className="font-semibold text-red-700 hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <LoginInner />
    </Suspense>
  );
}
