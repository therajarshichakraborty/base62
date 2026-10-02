import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./styles/globals.css";

export const metadata: Metadata = {
  title: "Base62 | Minimal URL Shortener",
  description:
    "A clean, minimal URL shortener powered by base-62 encoding.",
};

const themeScript = `
  (function() {
    try {
      var saved = localStorage.getItem('theme');
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (saved === 'dark' || (!saved && prefersDark)) {
        document.documentElement.classList.add('dark');
      } else if (saved === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.add('dark');
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground selection:bg-foreground selection:text-background transition-colors duration-150">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
