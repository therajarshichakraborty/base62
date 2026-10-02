import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4 py-12 transition-colors duration-150">
      <div className="w-full max-w-sm mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Home</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/" className="font-semibold text-sm tracking-tight text-foreground">
            base62
          </Link>
          <div className="h-3 w-px bg-neutral-200 dark:bg-neutral-800" />
          <ThemeToggle />
        </div>
      </div>

      <main className="w-full max-w-sm bg-transparent" style={{ background: "transparent" }}>
        {children}
      </main>
    </div>
  );
}