"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function VerifyInner() {
  const email = useSearchParams().get("email");
  return (
    <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
      <h1 className="text-2xl font-semibold">Verify your email</h1>
      <p className="mt-3 text-slate-600">
        We sent a verification link to {email ? <b>{email}</b> : "your inbox"}.
        Open it from your university email to activate your account.
      </p>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <VerifyInner />
    </Suspense>
  );
}
