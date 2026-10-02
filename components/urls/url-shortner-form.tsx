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
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2"
          style={{ border: "none", outline: "none" }}
        >
          <div
            style={{ border: "none", outline: "none", boxShadow: "none" }}
            className="flex items-center w-full rounded-xl !border-0 !border-none !outline-none !shadow-none !ring-0 bg-neutral-100 dark:bg-[#141414] p-1.5 transition-colors focus-within:ring-1 focus-within:ring-neutral-400 dark:focus-within:ring-neutral-700"
          >
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem className="flex-1 space-y-0 min-w-0">
                  <FormControl>
                    <Input
                      placeholder="https://example.com/very-long-url"
                      disabled={isLoading}
                      style={{
                        border: "none",
                        outline: "none",
                        boxShadow: "none",
                        background: "transparent",
                      }}
                      className="h-10 !bg-transparent !border-0 !border-none !outline-none !shadow-none !ring-0 px-4 text-sm text-black dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 font-normal w-full"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading}
              style={{ border: "none", outline: "none", boxShadow: "none" }}
              className="h-10 px-5 rounded-lg !border-0 !border-none !outline-none !shadow-none !ring-0 bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 text-xs font-medium transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? "Shortening..." : "Shorten"}
            </Button>
          </div>

          <FormField
            control={form.control}
            name="url"
            render={() => (
              <FormItem className="space-y-0">
                <FormMessage className="text-xs text-destructive px-2 pt-1" />
              </FormItem>
            )}
          />
        </form>
      </Form>

      {/* Result Container */}
      {shortUrl && (
        <div
          style={{ border: "none", outline: "none", boxShadow: "none" }}
          className="flex items-center justify-between gap-3 rounded-xl !border-0 !border-none !outline-none !shadow-none !ring-0 bg-neutral-100 dark:bg-[#141414] px-4 py-3 text-left transition-colors"
        >
          <p className="truncate font-mono text-sm text-black dark:text-white select-all">
            {shortUrl}
          </p>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              onClick={handleCopy}
              style={{ border: "none", outline: "none", boxShadow: "none" }}
              className="h-8 px-3 rounded-lg !border-0 !border-none !outline-none !shadow-none !ring-0 bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 text-xs font-medium transition-colors cursor-pointer"
            >
              {copied ? "Copied" : "Copy"}
            </Button>

            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ border: "none", outline: "none" }}
              className="h-8 px-3 rounded-lg !border-0 !border-none bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-xs font-medium text-black dark:text-white inline-flex items-center justify-center transition-colors cursor-pointer"
            >
              Visit
            </a>

            <button
              type="button"
              onClick={handleReset}
              style={{ border: "none", outline: "none", background: "none" }}
              className="h-8 px-2 text-xs text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer font-medium"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}