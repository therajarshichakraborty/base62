import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4 py-12">
      <div className="w-full max-w-sm mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Home</span>
        </Link>
        <Link href="/" className="font-semibold text-sm tracking-tight text-white">
          base62
        </Link>
      </div>

      <main className="w-full max-w-sm">
        {children}
      </main>
    </div>
  );
}