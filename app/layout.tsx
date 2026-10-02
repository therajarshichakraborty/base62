import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./styles/globals.css";

export const metadata: Metadata = {
  title: "Base62 | Minimal & Fast URL Shortener",
  description:
    "A clever, lightning-fast URL shortener powered by base-62 encoding and modern link analytics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground selection:bg-indigo-500/25 selection:text-indigo-200">
        {children}
        <Toaster richColors position="top-right" theme="dark" />
      </body>
    </html>
  );
}
