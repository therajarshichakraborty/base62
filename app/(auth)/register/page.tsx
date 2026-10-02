import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 sm:p-7">
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-white">
          Create an account
        </h1>
        <p className="mt-1 text-xs text-zinc-400">
          Enter your details to get started
        </p>
      </div>

      <RegisterForm />
    </div>
  );
}