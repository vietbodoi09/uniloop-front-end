import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "UniLoop — Student marketplace",
  description:
    "Buy, sell, exchange study materials & items between Vietnamese university students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-mesh">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="mt-16 border-t bg-white/50">
          <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>
              <span className="font-semibold text-brand-gradient">UniLoop</span>
              {" "}— Sàn giao dịch dành cho sinh viên UEB
            </p>
            <p className="text-xs">© {new Date().getFullYear()} UniLoop. Made with care.</p>
          </div>
        </footer>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
