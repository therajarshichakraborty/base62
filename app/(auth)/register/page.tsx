import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="w-full bg-white dark:bg-black border-0 shadow-none">
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-black dark:text-white">
          Create an account
        </h1>
        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
          Enter your details to get started
        </p>
      </div>

      <RegisterForm />
    </div>
  );
}