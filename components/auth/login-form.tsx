"use client";

import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../urls/form";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const registered = searchParams.get("registered");
    if (registered === "true") {
      toast.success("Account created successfully. Please sign in.");
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("registered");
      router.replace(newUrl.pathname);
    }
  }, [searchParams, router]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        toast.error("Invalid email or password");
        return;
      }

      toast.success("Signed in successfully");
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  const handleOAuth = async (provider: "github" | "google") => {
    setIsSocialLoading(provider);
    try {
      await signIn(provider, { callbackUrl: "/dashboard" });
    } catch {
      toast.error(`Failed to connect with ${provider}`);
      setIsSocialLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Social login buttons */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          disabled={isLoading || !!isSocialLoading}
          onClick={() => handleOAuth("github")}
          className="h-9 rounded-lg border-0 bg-neutral-100 hover:bg-neutral-200 dark:bg-[#141414] dark:hover:bg-[#1e1e1e] text-xs font-normal text-black dark:text-white transition-colors cursor-pointer"
        >
          <svg className="mr-1.5 size-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          GitHub
        </Button>

        <Button
          type="button"
          disabled={isLoading || !!isSocialLoading}
          onClick={() => handleOAuth("google")}
          className="h-9 rounded-lg border-0 bg-neutral-100 hover:bg-neutral-200 dark:bg-[#141414] dark:hover:bg-[#1e1e1e] text-xs font-normal text-black dark:text-white transition-colors cursor-pointer"
        >
          <svg className="mr-1.5 size-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.08 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
          </svg>
          Google
        </Button>
      </div>

      <div className="relative flex items-center justify-center my-1">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-px bg-neutral-200 dark:bg-neutral-900" />
        </div>
        <span className="relative bg-white dark:bg-black px-2 text-[11px] text-neutral-400 dark:text-neutral-500">
          or
        </span>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-xs text-neutral-500 dark:text-neutral-400">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@example.com"
                    type="email"
                    autoComplete="email"
                    disabled={isLoading}
                    className="h-9 rounded-lg border-0 bg-neutral-100 dark:bg-[#141414] px-3 text-sm text-black dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-700"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs text-destructive" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-xs text-neutral-500 dark:text-neutral-400">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      disabled={isLoading}
                      className="h-9 rounded-lg border-0 bg-neutral-100 dark:bg-[#141414] pl-3 pr-8 text-sm text-black dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-700"
                      {...field}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black dark:hover:text-white"
                    >
                      {showPassword ? (
                        <EyeOff className="size-3.5" />
                      ) : (
                        <Eye className="size-3.5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-xs text-destructive" />
              </FormItem>
            )}
          />

          {error && (
            <p className="text-xs text-destructive pt-0.5">{error}</p>
          )}

          <Button
            type="submit"
            disabled={isLoading || !!isSocialLoading}
            className="w-full h-9 mt-1 rounded-lg border-0 bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </Form>

      <div className="pt-2 text-center text-xs text-neutral-500 dark:text-neutral-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-black dark:text-white hover:underline transition-colors font-medium"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}