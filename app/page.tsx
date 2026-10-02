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
          <div className="h-3 w-px bg-border mx-0.5" />
          <ThemeToggle />
        </div>
      </header>

      {/* Main hero shortener */}
      <main className="w-full max-w-xl mx-auto my-auto py-16 text-center">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-2">
          Shorten links
        </h1>
        <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto">
          Paste a long URL to generate a clean, minimal short link.
        </p>

        <UrlShortenerForm />
      </main>

      {/* Minimal footer */}
      <footer className="w-full max-w-xl mx-auto text-center text-xs text-muted-foreground/60 py-4">
        <span>base62 url shortener</span>
      </footer>
    </div>
  );
}