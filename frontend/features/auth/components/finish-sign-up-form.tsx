"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useState } from "react";
import { Check } from "lucide-react";

import { useRegister } from "@/features/auth/hooks/use-register";

type FinishSignUpInput = {
  fullName: string;
  password: string;
};

export default function FinishSignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [registerSuccess, setRegisterSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FinishSignUpInput>({
    defaultValues: {
      fullName: "",
      password: "",
    },
  });

  const { mutate: registerMutation, isPending, isError, error } = useRegister();

  const onSubmit = (data: FinishSignUpInput) => {
    if (!token) return;

    registerMutation(
      {
        token,
        fullName: data.fullName,
        password: data.password,
      },
      {
        onSuccess: () => {
          setRegisterSuccess(true);
        },
      }
    );
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
              Finish your place in the archive.
            </h1>

            <p className="mt-8 max-w-lg text-[17px] leading-8 text-[var(--midnight-muted)]">
              Create your writer profile and password. After that, the desk is
              yours.
            </p>
          </div>

          <div className="w-full">
            <div className="rounded-[2rem] border border-[var(--midnight-border)]/70 bg-[var(--midnight-surface)]/80 p-7 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-9">
              <div>
                <p className="text-xs tracking-[0.14em] text-[var(--midnight-soft)]">
                  Account setup
                </p>

                <h2 className="mt-4 text-4xl font-bold tracking-[-0.055em] text-[var(--midnight-text)]">
                  Finish signing up
                </h2>

                <p className="mt-4 text-[15px] leading-7 text-[var(--midnight-muted)]">
                  Create your profile and password to start writing.
                </p>
              </div>

              {!token ? (
                <div className="mt-8">
                  <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                    Missing registration token.
                  </div>

                  <Link
                    href="/sign-up"
                    className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-[var(--midnight-accent)] px-6 py-3 text-base font-medium text-[var(--midnight-on-accent)] transition hover:opacity-90"
                  >
                    Back to sign up
                  </Link>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="mt-10 space-y-5"
                >
                  <div>
                    <label className="mb-3 block text-sm font-medium text-[var(--midnight-text)]">
                      Full name
                    </label>

                    <input
                      type="text"
                      placeholder="Your name"
                      disabled={isPending}
                      {...register("fullName", {
                        required: "Full name is required",
                        minLength: {
                          value: 2,
                          message: "Full name must be at least 2 characters",
                        },
                      })}
                      className="w-full rounded-2xl border border-[var(--midnight-border)]/70 bg-[var(--midnight-code-bg)] px-4 py-3 text-[15px] text-[var(--midnight-text)] outline-none transition placeholder:text-[var(--midnight-soft)] focus:border-[var(--midnight-accent)]/60 disabled:opacity-50"
                    />

                    {errors.fullName && (
                      <p className="mt-2 text-sm text-red-300">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

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
                        minLength: {
                          value: 5,
                          message: "Password must be at least 5 characters",
                        },
                        maxLength: {
                          value: 20,
                          message: "Password cannot exceed 20 characters",
                        },
                      })}
                      className="w-full rounded-2xl border border-[var(--midnight-border)]/70 bg-[var(--midnight-code-bg)] px-4 py-3 text-[15px] text-[var(--midnight-text)] outline-none transition placeholder:text-[var(--midnight-soft)] focus:border-[var(--midnight-accent)]/60 disabled:opacity-50"
                    />

                    {errors.password && (
                      <p className="mt-2 text-sm text-red-300">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {isError && (
                    <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                      {error.message}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full rounded-2xl bg-[var(--midnight-accent)] py-3.5 text-base font-medium text-[var(--midnight-on-accent)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isPending ? "Creating account..." : "Create account"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {registerSuccess && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 px-6 backdrop-blur-[3px]">
          <div className="w-full max-w-md rounded-[2rem] border border-[var(--midnight-border)]/70 bg-[var(--midnight-surface)] p-8 shadow-[0_28px_90px_rgba(0,0,0,0.38)]">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--midnight-accent)] text-[var(--midnight-on-accent)]">
              <Check className="h-6 w-6" />
            </div>

            <h2 className="mt-6 text-3xl font-bold tracking-[-0.05em] text-[var(--midnight-text)]">
              Account created
            </h2>

            <p className="mt-4 text-[15px] leading-7 text-[var(--midnight-muted)]">
              Your Midnight Letters account is ready. You can now sign in and
              start writing.
            </p>

            <button
              type="button"
              onClick={() => router.push("/sign-in")}
              className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-[var(--midnight-accent)] px-6 py-3 text-base font-medium text-[var(--midnight-on-accent)] transition hover:opacity-90"
            >
              Continue to sign in
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
