import Link from "next/link";
import { UrlShortenerForm } from "@/components/urls/url-shortner-form";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-black text-white px-4 py-8 sm:px-6 lg:px-8">
      {/* Top minimal bar */}
      <header className="w-full max-w-xl mx-auto flex items-center justify-between">
        <Link href="/" className="font-semibold text-sm tracking-tight text-white">
          base62
        </Link>
        <div className="flex items-center gap-4 text-xs">
          <Link
            href="/login"
            className="text-zinc-400 hover:text-white transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="text-white hover:text-zinc-300 font-medium transition-colors"
          >
            Register
          </Link>
        </div>
      </header>

      {/* Main hero shortener */}
      <main className="w-full max-w-xl mx-auto my-auto py-16 text-center">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-2">
          Shorten links
        </h1>
        <p className="text-sm text-zinc-400 mb-8 max-w-md mx-auto">
          Paste a long URL to generate a clean, minimal short link.
        </p>

        <UrlShortenerForm />
      </main>

      {/* Minimal footer */}
      <footer className="w-full max-w-xl mx-auto text-center text-xs text-zinc-600 py-4">
        <span>base62 url shortener</span>
      </footer>
    </div>
  );
}