"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

type ForgotPasswordInput = {
  email: string;
};

export default function ForgotPasswordPage() {
  const [emailSent, setEmailSent] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      setIsPending(true);
      setError(null);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.email,
          }),
        }
      );

      if (!res.ok) {
        const result = await res.json().catch(() => null);
        throw new Error(result?.message || "Failed to send reset email");
      }

      setEmailSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F6F3EE] px-6 py-10">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(0,0,0,0.04) 1px, transparent 1px), 
            radial-gradient(circle at 80% 80%, rgba(0,0,0,0.03) 1px, transparent 1px), 
            radial-gradient(circle at 40% 70%, rgba(0,0,0,0.025) 1px, transparent 1px)
          `,
          backgroundSize: "120px 120px, 160px 160px, 200px 200px",
        }}
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-[#F6D7A7]/35 blur-3xl" />
        <div className="absolute right-[-120px] top-[20%] h-[340px] w-[340px] rounded-full bg-[#C7E8CA]/30 blur-3xl" />
        <div className="absolute bottom-[-120px] left-[15%] h-[300px] w-[300px] rounded-full bg-[#E5D9FF]/25 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md rounded-[2rem] border border-white/40 bg-white/90 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.08)] backdrop-blur-xl md:p-10">
        <div className="text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-3xl text-white shadow-lg">
            ✉
          </div>

          <h1 className="font-serif text-5xl tracking-tight text-[#242424]">
            The Midnight Letters
          </h1>

          <h2 className="mt-6 text-3xl font-bold text-[#242424]">
            Forgot password?
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-black/60">
            Enter your email and we’ll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <div>
            <div className="mb-2 block text-sm font-medium text-[#242424]">
              Email
            </div>

            <input
              type="email"
              placeholder="you@example.com"
              disabled={isPending}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
              className="w-full rounded-2xl border border-black/10 bg-[#FAFAFA] px-4 py-3 outline-none transition focus:border-black/20 focus:bg-white focus:ring-4 focus:ring-black/5 disabled:opacity-50"
            />

            {errors.email && (
              <p className="mt-2 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-2xl bg-black py-3 text-lg font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {isPending ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-black/60">
          Remember your password?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-black hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>

      {emailSent && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 px-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2rem] border border-black/5 bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-black text-3xl text-white">
              ✓
            </div>

            <h2 className="mt-6 text-3xl font-bold text-[#242424]">
              Check your email
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-black/60">
              We sent you a password reset link. Open it to create a new
              password.
            </p>

            <div className="mt-8">
              <Link
                href="/sign-in"
                className="inline-flex w-full items-center justify-center rounded-2xl bg-black px-6 py-3 text-lg font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
              >
                Back to sign in
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
