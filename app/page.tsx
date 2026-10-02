import Link from "next/link";
import { UrlShortenerForm } from "@/components/urls/url-shortner-form";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-background text-foreground px-4 py-8 sm:px-6 lg:px-8 transition-colors duration-150">
      {/* Top minimal bar */}
      <header className="w-full max-w-xl mx-auto flex items-center justify-between">
        <Link href="/" className="font-semibold text-sm tracking-tight text-foreground">
          base62
        </Link>
        <div className="flex items-center gap-3 text-xs">
          <Link
            href="/login"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="text-foreground hover:text-muted-foreground font-medium transition-colors"
          >
            Register
          </Link>
          <div className="h-3 w-px bg-neutral-200 dark:bg-neutral-800 mx-0.5" />
          <ThemeToggle />
        </div>
      </header>

      {/* Main hero shortener */}
      <main className="w-full max-w-xl mx-auto my-auto py-12 sm:py-16 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight mb-3">
          <span className="bg-gradient-to-b from-black via-neutral-800 to-neutral-600 dark:from-white dark:via-neutral-100 dark:to-neutral-400 bg-clip-text text-transparent">
            Shorten links.
          </span>{" "}
          <span className="bg-gradient-to-r from-red-500 via-pink-500 to-violet-500 dark:from-red-400 dark:via-pink-400 dark:to-violet-400 bg-clip-text text-transparent">
            Share simply.
          </span>
        </h1>
        <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 mb-8 max-w-md mx-auto leading-relaxed">
          Paste a long URL to generate a clean, minimal short link. Fast, permanent, and free without tracking or clutter.
        </p>
        <UrlShortenerForm />
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs text-neutral-400 dark:text-neutral-500">
          <span>Instant redirect</span>
          <span>•</span>
          <span>No signup required</span>
          <span>•</span>
          <span>Permanent links</span>
        </div>
      </main>

      {/* Minimal footer */}
      <footer className="w-full max-w-xl mx-auto flex items-center justify-between text-xs text-neutral-400 dark:text-neutral-600 py-8">
        <span>base62 url shortener</span>
        <div className="flex items-center gap-4">
          <Link href="/login" className="hover:text-black dark:hover:text-white transition-colors">Sign in</Link>
          <Link href="/register" className="hover:text-black dark:hover:text-white transition-colors">Register</Link>
        </div>
      </footer>
    </div>
  );
}