import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="w-full bg-white dark:bg-black border-0 shadow-none">
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-black dark:text-white">
          Sign in
        </h1>
        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
          Enter your credentials to continue
        </p>
      </div>

      <Suspense fallback={<div className="py-8 text-center text-xs text-neutral-500">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
