import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="rounded-xl border border-border bg-card text-card-foreground p-6 sm:p-7 shadow-sm">
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Create an account
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Enter your details to get started
        </p>
      </div>

      <RegisterForm />
    </div>
  );
}