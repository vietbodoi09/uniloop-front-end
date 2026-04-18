"use client";
import { usePostingStore } from "@/lib/stores/postingStore";
import { cn } from "@/lib/utils";

const STEPS = [
  { n: 1, label: "Details" },
  { n: 2, label: "Location" },
  { n: 3, label: "Review" },
];

export default function NewProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const current = usePostingStore((s) => s.step);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Create listing</h1>
      <ol className="mb-8 flex items-center gap-2">
        {STEPS.map((s, i) => (
          <li key={s.n} className="flex items-center gap-2 flex-1">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border text-sm font-medium",
                current === s.n
                  ? "bg-slate-900 text-white border-slate-900"
                  : current > s.n
                  ? "bg-emerald-500 text-white border-emerald-500"
                  : "bg-white text-slate-500"
              )}
            >
              {s.n}
            </div>
            <span className="text-sm font-medium">{s.label}</span>
            {i < STEPS.length - 1 && (
              <div className="h-px flex-1 bg-slate-200" />
            )}
          </li>
        ))}
      </ol>
      {children}
    </div>
  );
}
