import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="rounded-xl border border-border bg-card text-card-foreground p-6 sm:p-7 shadow-sm">
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Sign in
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Enter your credentials to continue
        </p>
      </div>

      <Suspense fallback={<div className="py-8 text-center text-xs text-muted-foreground">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
