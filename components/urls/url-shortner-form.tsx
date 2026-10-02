"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../urls/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UrlFormData, urlSchema } from "@/lib/types";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import { shortenUrl } from "@/server/actions/url/shortner";
import { Copy, Check, ExternalLink, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export function UrlShortenerForm() {
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const form = useForm<UrlFormData>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: "",
    },
  });

  const onSubmit = async (data: UrlFormData) => {
    setIsLoading(true);
    setCopied(false);

    try {
      const formData = new FormData();
      formData.append("url", data.url);

      const response = await shortenUrl(formData);
      if (response.success && response.data) {
        const code = response.data.shortCode;
        const generatedUrl = `${window.location.origin}/r/${code}`;
        setShortUrl(generatedUrl);
        toast.success("Short link created");
      } else {
        toast.error(response.error || "Failed to shorten URL");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!shortUrl) return;
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  const handleReset = () => {
    setShortUrl(null);
    form.reset({ url: "" });
  };

  return (
    <div className="w-full space-y-3 text-left">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem className="flex-1 space-y-0">
                  <FormControl>
                    <Input
                      placeholder="https://example.com/very-long-url"
                      disabled={isLoading}
                      className="h-10 rounded-lg border-zinc-800 bg-zinc-950 px-3.5 text-sm text-white placeholder:text-zinc-500 focus-visible:ring-1 focus-visible:ring-zinc-600 focus-visible:border-zinc-600"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="pt-1.5 text-xs text-red-400" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="h-10 px-5 rounded-lg bg-white hover:bg-zinc-200 text-black text-xs font-medium transition-colors shrink-0 disabled:opacity-50"
            >
              {isLoading ? "Shortening..." : "Shorten"}
            </Button>
          </div>
        </form>
      </Form>

      {/* Result Container */}
      {shortUrl && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-3">
          <p className="truncate font-mono text-sm text-zinc-200 select-all">
            {shortUrl}
          </p>

          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              type="button"
              onClick={handleCopy}
              className="h-8 px-3 rounded-md bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-xs font-medium text-white transition-colors"
            >
              {copied ? (
                <>
                  <Check className="mr-1.5 size-3.5 text-zinc-300" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="mr-1.5 size-3.5 text-zinc-400" />
                  Copy
                </>
              )}
            </Button>

            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open shortened link"
              className="size-8 inline-flex items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            >
              <ExternalLink className="size-3.5" />
            </a>

            <Button
              type="button"
              variant="ghost"
              onClick={handleReset}
              aria-label="Shorten another URL"
              className="size-8 p-0 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
            >
              <RotateCcw className="size-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}