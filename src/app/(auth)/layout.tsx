import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-red-300/40 blur-3xl animate-float" />
        <div
          className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-amber-300/40 blur-3xl animate-float"
          style={{ animationDelay: "3s" }}
        />
      </div>

      <div className="w-full max-w-md">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 mb-6 group"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient text-white font-bold shadow-lg shadow-red-500/30 group-hover:scale-105 transition">
            U
          </span>
          <span className="text-2xl font-bold tracking-tight text-brand-gradient">
            UniLoop
          </span>
        </Link>
        {children}
      </div>
    </div>
  );
}
