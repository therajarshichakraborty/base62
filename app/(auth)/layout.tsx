import { ReactNode } from "react";
import Link from "next/link";
import { Link2, ArrowLeft } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-zinc-950 px-4 py-8 sm:px-6 lg:px-8">
      {/* Dynamic ambient background glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full bg-gradient-to-tr from-indigo-600/15 via-violet-600/15 to-cyan-500/10 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-40 left-1/3 h-[450px] w-[500px] rounded-full bg-gradient-to-br from-violet-600/10 via-fuchsia-600/10 to-indigo-600/10 blur-[140px]" />

      {/* Subtle grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Top navigation header */}
      <header className="relative z-10 w-full max-w-md mx-auto mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-full border border-zinc-800/80 bg-zinc-900/60 px-3.5 py-1.5 text-xs font-medium text-zinc-400 backdrop-blur-md transition-all hover:border-zinc-700 hover:bg-zinc-800/60 hover:text-zinc-200"
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to home</span>
        </Link>

        <Link href="/" className="inline-flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md shadow-indigo-500/25">
            <Link2 className="size-4 text-white" />
          </div>
          <span className="font-bold tracking-tight text-sm text-zinc-100">
            Base<span className="text-indigo-400">62</span>
          </span>
        </Link>
      </header>

      {/* Main card container */}
      <main className="relative z-10 w-full max-w-md mx-auto">
        {children}
      </main>

      {/* Minimal footer */}
      <footer className="relative z-10 mt-8 text-center text-xs text-zinc-500">
        <p>Protected by secure JWT session authentication.</p>
      </footer>
    </div>
  );
}