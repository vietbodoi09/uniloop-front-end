"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { signupSchema, type SignupInput } from "@/lib/validators/auth";
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
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (data: SignupInput) => {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${location.origin}/api/auth/callback`,
        data: { full_name: data.fullName },
      },
    });
    setLoading(false);

    if (error) return toast.error(error.message);
    toast.success("Account created! Welcome to UniLoop.");
    router.push("/");
    router.refresh();
  };

  return (
    <Card className="border-border/60 shadow-xl shadow-red-500/5 backdrop-blur bg-white/80">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Tạo tài khoản</CardTitle>
        <p className="text-sm text-muted-foreground text-center">
          Tham gia cộng đồng sinh viên Việt Nam
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="fullName">Họ và tên</Label>
            <Input id="fullName" placeholder="Nguyễn Văn A" {...register("fullName")} />
            {errors.fullName && (
              <p className="text-sm text-red-600">{errors.fullName.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@gmail.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input id="password" type="password" {...register("password")} />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm">Xác nhận mật khẩu</Label>
            <Input id="confirm" type="password" {...register("confirm")} />
            {errors.confirm && (
              <p className="text-sm text-red-600">{errors.confirm.message}</p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full rounded-full bg-brand-gradient text-white border-0 shadow-md shadow-red-500/20 hover:opacity-90"
            disabled={loading}
          >
            {loading ? "Đang tạo tài khoản…" : "Đăng ký"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Đã có tài khoản?{" "}
            <Link href="/login" className="font-semibold text-red-700 hover:underline">
              Đăng nhập
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
