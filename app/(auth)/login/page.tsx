import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="relative rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 sm:p-8 shadow-2xl shadow-black/80 backdrop-blur-xl before:pointer-events-none before:absolute before:inset-x-0 before:-top-px before:h-px before:bg-gradient-to-r before:from-transparent before:via-indigo-500/50 before:to-transparent">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl">
          Welcome back
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-zinc-400">
          Sign in to manage and track your shortened URLs
        </p>
      </div>

      <Suspense
        fallback={
          <div className="flex justify-center py-10">
            <Loader2 className="size-6 animate-spin text-indigo-500" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
