"use client";

import { useForm } from "react-hook-form";
import type { IAuthFormInput } from "@/features/auth/types";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useLogin } from "@/features/auth/hooks/use-login";
import { useSendVerifyEmail } from "../hooks/use-send-verify-email";

export default function AuthForm({ type }: { type: "signup" | "signin" }) {
  const router = useRouter();

  const [registerSuccess, setRegisterSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<IAuthFormInput>({
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      agreeTerms: false,
    },
  });

  const agreedTerms = watch("agreeTerms");

  const {
    mutate: sendVerifyEmail,
    isPending: isSendingVerifyEmail,
    error: sendVerifyEmailError,
  } = useSendVerifyEmail();

  const {
    mutate: loginMutation,
    isPending: isLoginPending,
    error: loginError,
  } = useLogin();

  const isPending = isSendingVerifyEmail || isLoginPending;
  const error = sendVerifyEmailError || loginError;

  const onSubmit = (data: IAuthFormInput) => {
    if (type === "signup" && data.email) {
      sendVerifyEmail(data.email, {
        onSuccess: () => {
          setRegisterSuccess(true);
        },
        onError: console.error,
      });

      return;
    }

    if (data.password) {
      loginMutation(
        {
          email: data.email,
          password: data.password,
        },
        {
          onSuccess: (response) => {
            localStorage.setItem("accessToken", response.token);
            router.push("/");
          },
          onError: console.error,
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-[var(--midnight-bg)] text-[var(--midnight-text)]">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-16 md:px-10">
        <div className="grid gap-16 lg:grid-cols-[1fr_420px] lg:items-center">
          <div className="hidden lg:block">
            <p className="text-xs tracking-[0.16em] text-[var(--midnight-soft)]">
              The Midnight Letters
            </p>

            <h1 className="mt-6 max-w-xl text-6xl font-bold leading-[0.95] tracking-[-0.07em] text-[var(--midnight-text)]">
              Thoughts that arrive after dark.
            </h1>

            <p className="mt-8 max-w-lg text-[17px] leading-8 text-[var(--midnight-muted)]">
              A quiet place for essays, notes, unfinished thoughts, and letters
              written slowly.
            </p>

            <div className="mt-14 space-y-5 border-l border-[var(--midnight-border)]/70 pl-6">
              <div>
                <p className="text-sm text-[var(--midnight-soft)]">
                  Read slowly
                </p>

                <p className="mt-1 text-[15px] leading-7 text-[var(--midnight-muted)]">
                  A calmer reading experience without noise.
                </p>
              </div>

              <div>
                <p className="text-sm text-[var(--midnight-soft)]">
                  Build an archive
                </p>

                <p className="mt-1 text-[15px] leading-7 text-[var(--midnight-muted)]">
                  Keep collections of writing that matter to you.
                </p>
              </div>

              <div>
                <p className="text-sm text-[var(--midnight-soft)]">
                  Write honestly
                </p>

                <p className="mt-1 text-[15px] leading-7 text-[var(--midnight-muted)]">
                  Publish thoughts without turning them into content.
                </p>
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className="rounded-[2rem] border border-[var(--midnight-border)]/70 bg-[var(--midnight-surface)]/80 p-7 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-9">
              <div>
                <p className="text-xs tracking-[0.14em] text-[var(--midnight-soft)]">
                  {type === "signup" ? "Create account" : "Welcome back"}
                </p>

                <h2 className="mt-4 text-4xl font-bold tracking-[-0.055em] text-[var(--midnight-text)]">
                  {type === "signup" ? "Join the archive" : "Sign in"}
                </h2>

                <p className="mt-4 text-[15px] leading-7 text-[var(--midnight-muted)]">
                  {type === "signup"
                    ? "Enter your email and we’ll send you a verification link."
                    : "Continue reading and writing on The Midnight Letters."}
                </p>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-10 space-y-5"
              >
                <div>
                  <label className="mb-3 block text-sm font-medium text-[var(--midnight-text)]">
                    Email
                  </label>

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
                    className="w-full rounded-2xl border border-[var(--midnight-border)]/70 bg-[var(--midnight-code-bg)] px-4 py-3 text-[15px] text-[var(--midnight-text)] outline-none transition placeholder:text-[var(--midnight-soft)] focus:border-[var(--midnight-accent)]/60"
                  />

                  {errors.email && (
                    <p className="mt-2 text-sm text-red-300">
                      {errors.email.message as string}
                    </p>
                  )}
                </div>

                {type === "signin" && (
                  <div>
                    <label className="mb-3 block text-sm font-medium text-[var(--midnight-text)]">
                      Password
                    </label>

                    <input
                      type="password"
                      placeholder="••••••••"
                      disabled={isPending}
                      {...register("password", {
                        required: "Password is required",
                      })}
                      className="w-full rounded-2xl border border-[var(--midnight-border)]/70 bg-[var(--midnight-code-bg)] px-4 py-3 text-[15px] text-[var(--midnight-text)] outline-none transition placeholder:text-[var(--midnight-soft)] focus:border-[var(--midnight-accent)]/60"
                    />

                    {errors.password && (
                      <p className="mt-2 text-sm text-red-300">
                        {errors.password.message as string}
                      </p>
                    )}
                  </div>
                )}

                {error && (
                  <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                    {sendVerifyEmailError
                      ? sendVerifyEmailError.message
                      : loginError?.message}
                  </div>
                )}

                {type === "signin" && (
                  <div className="flex justify-end">
                    <Link
                      href="/forgot-password"
                      className="text-sm text-[var(--midnight-muted)] transition hover:text-[var(--midnight-text)]"
                    >
                      Forgot password?
                    </Link>
                  </div>
                )}

                {type === "signup" && (
                  <div>
                    <label className="flex items-start gap-3 text-sm leading-7 text-[var(--midnight-muted)]">
                      <input
                        type="checkbox"
                        disabled={isPending}
                        {...register("agreeTerms")}
                        className="mt-1 h-4 w-4 rounded border-[var(--midnight-border)] bg-[var(--midnight-code-bg)]"
                      />

                      <span>
                        I agree to the{" "}
                        <Link
                          href="/terms"
                          className="text-[var(--midnight-text)] underline underline-offset-4"
                        >
                          Terms of Use
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/privacy"
                          className="text-[var(--midnight-text)] underline underline-offset-4"
                        >
                          Privacy Policy
                        </Link>
                        .
                      </span>
                    </label>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isPending || (type === "signup" && !agreedTerms)}
                  className="w-full rounded-2xl bg-[var(--midnight-accent)] py-3.5 text-base font-medium text-[var(--midnight-on-accent)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isPending
                    ? "Loading..."
                    : type === "signup"
                    ? "Send verification email"
                    : "Sign in"}
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-[var(--midnight-muted)]">
                {type === "signup"
                  ? "Already have an account?"
                  : "Don’t have an account?"}

                <Link
                  href={type === "signup" ? "/sign-in" : "/sign-up"}
                  className="ml-2 font-medium text-[var(--midnight-text)] transition hover:text-[var(--midnight-accent-hover)]"
                >
                  {type === "signup" ? "Sign in" : "Create one"}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {registerSuccess && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 px-6 backdrop-blur-[3px]">
          <div className="w-full max-w-md rounded-[2rem] border border-[var(--midnight-border)]/70 bg-[var(--midnight-surface)] p-8 shadow-[0_28px_90px_rgba(0,0,0,0.38)]">
            <p className="text-xs tracking-[0.14em] text-[var(--midnight-soft)]">
              Verification
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-[-0.05em] text-[var(--midnight-text)]">
              Check your email
            </h2>

            <p className="mt-4 text-[15px] leading-7 text-[var(--midnight-muted)]">
              We sent you a verification link. Open it to continue setting up
              your account.
            </p>

            <div className="mt-8">
              <Link
                href="/sign-in"
                className="inline-flex w-full items-center justify-center rounded-2xl bg-[var(--midnight-accent)] px-6 py-3 text-base font-medium text-[var(--midnight-on-accent)] transition hover:opacity-90"
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
