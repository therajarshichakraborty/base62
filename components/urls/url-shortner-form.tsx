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
import {
  Link2,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  RotateCcw,
  MousePointerClick,
  ClipboardPaste,
} from "lucide-react";
import { toast } from "sonner";

export function UrlShortenerForm() {
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [shortCode, setShortCode] = useState<string | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
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
        setShortCode(code);
        setShortUrl(generatedUrl);
        setOriginalUrl(data.url);
        toast.success("Short link created!", {
          description: "Your Base-62 link is ready to share.",
        });
      } else {
        toast.error("Failed to shorten URL", {
          description: response.error || "Please check your URL and try again.",
        });
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!shortUrl) return;
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        form.setValue("url", text, { shouldValidate: true });
        toast.info("Pasted from clipboard");
      }
    } catch {
      // Clipboard permissions denied
    }
  };

  const handleReset = () => {
    setShortUrl(null);
    setShortCode(null);
    setOriginalUrl(null);
    form.reset({ url: "" });
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Input Box Card */}
      <div className="relative rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-2 sm:p-2.5 backdrop-blur-xl shadow-2xl shadow-black/60 before:pointer-events-none before:absolute before:inset-x-0 before:-top-px before:h-px before:bg-gradient-to-r before:from-transparent before:via-indigo-500/50 before:to-transparent">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
          >
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem className="flex-1 space-y-0">
                  <FormControl>
                    <div className="relative flex items-center">
                      <Link2 className="pointer-events-none absolute left-3.5 size-4 text-zinc-500" />
                      <Input
                        placeholder="https://your-extremely-long-url.com/something/nested"
                        disabled={isLoading}
                        className="h-12 w-full rounded-xl border-0 bg-transparent pl-10 pr-20 text-sm text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                        {...field}
                      />
                      {!field.value && (
                        <button
                          type="button"
                          onClick={handlePaste}
                          className="absolute right-3 inline-flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-800/60 px-2 py-1 text-[11px] font-medium text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 transition-all"
                        >
                          <ClipboardPaste className="size-3" />
                          <span>Paste</span>
                        </button>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage className="pl-3.5 pt-1 text-xs text-rose-400" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="h-11 px-6 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:from-indigo-400 hover:to-violet-500 active:scale-[0.98] disabled:opacity-50 shrink-0"
            >
              {isLoading ? (
                <>
                  <span className="mr-2 size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Shortening...
                </>
              ) : (
                <>
                  <Sparkles className="mr-1.5 size-4" />
                  Shorten Link
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>

      {/* Result Card */}
      {shortUrl && (
        <div className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-zinc-900/80 to-zinc-950 p-4 sm:p-5 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active Link
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500 font-mono">
                  <MousePointerClick className="size-3" />
                  0 clicks
                </span>
              </div>

              {originalUrl && (
                <p className="truncate text-xs text-zinc-400 max-w-md">
                  {originalUrl}
                </p>
              )}

              <p className="text-base sm:text-lg font-mono font-semibold text-indigo-300 tracking-tight select-all">
                {shortUrl}
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <Button
                type="button"
                onClick={handleCopy}
                className="flex-1 sm:flex-none h-9 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-medium text-white shadow-md shadow-indigo-500/20 active:scale-[0.98] transition-all"
              >
                {copied ? (
                  <>
                    <Check className="mr-1.5 size-3.5 text-emerald-300" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-1.5 size-3.5" />
                    Copy Link
                  </>
                )}
              </Button>

              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open shortened link"
                className="size-9 inline-flex items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-800 text-zinc-300 transition-all active:scale-[0.98]"
              >
                <ExternalLink className="size-4" />
              </a>

              <Button
                type="button"
                variant="ghost"
                onClick={handleReset}
                title="Shorten another"
                aria-label="Shorten another URL"
                className="size-9 p-0 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
              >
                <RotateCcw className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}