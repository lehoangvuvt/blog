"use client";

import Link from "next/link";
import { X, MoonStar } from "lucide-react";
import { useForm } from "react-hook-form";
import type { IAuthFormInput } from "@/features/auth/types";
import { useLogin } from "@/features/auth/hooks/use-login";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SignInModal({ open, onClose }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IAuthFormInput>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: loginMutation, isPending, error } = useLogin();

  const onSubmit = (data: IAuthFormInput) => {
    if (!data.email || !data.password) return;

    loginMutation(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: (response) => {
          localStorage.setItem("accessToken", response.token);
          window.location.reload();
        },
      }
    );
  };

  if (!open) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/55 px-4 backdrop-blur-md"
    >
      <div
        className="
          relative w-full max-w-md overflow-hidden
          rounded-[2rem]
          border border-[var(--midnight-border)]/70
          bg-[var(--midnight-surface)]/95
          p-7
          shadow-[0_30px_90px_rgba(0,0,0,0.45)]
        "
      >
        <button
          type="button"
          onClick={onClose}
          className="
            absolute right-5 top-5
            rounded-full p-2
            text-[var(--midnight-soft)]
            transition
            hover:bg-[var(--midnight-code-bg)]
            hover:text-[var(--midnight-text)]
          "
        >
          <X className="h-5 w-5" />
        </button>

        <div>
          <div
            className="
              mb-6 flex h-12 w-12 items-center justify-center
              rounded-2xl
              border border-[var(--midnight-border)]
              bg-[var(--midnight-code-bg)]
              text-[var(--midnight-accent)]
            "
          >
            <MoonStar className="h-5 w-5" />
          </div>

          <p className="text-[11px] tracking-[0.16em] text-[var(--midnight-soft)]">
            THE MIDNIGHT LETTERS
          </p>

          <h2
            className="
              mt-4 text-4xl font-bold
              tracking-[-0.055em]
              text-[var(--midnight-text)]
            "
          >
            Welcome back
          </h2>

          <p className="mt-4 text-[15px] leading-7 text-[var(--midnight-muted)]">
            Sign in to continue reading and writing after dark.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
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
              className="
                w-full rounded-2xl
                border border-[var(--midnight-border)]/70
                bg-[var(--midnight-code-bg)]
                px-4 py-3
                text-[15px]
                text-[var(--midnight-text)]
                outline-none transition
                placeholder:text-[var(--midnight-soft)]
                focus:border-[var(--midnight-border-strong)]
                disabled:opacity-50
              "
            />

            {errors.email && (
              <p className="mt-2 text-sm text-red-300">
                {errors.email.message as string}
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
              })}
              className="
                w-full rounded-2xl
                border border-[var(--midnight-border)]/70
                bg-[var(--midnight-code-bg)]
                px-4 py-3
                text-[15px]
                text-[var(--midnight-text)]
                outline-none transition
                placeholder:text-[var(--midnight-soft)]
                focus:border-[var(--midnight-border-strong)]
                disabled:opacity-50
              "
            />

            {errors.password && (
              <p className="mt-2 text-sm text-red-300">
                {errors.password.message as string}
              </p>
            )}
          </div>

          {error && (
            <div
              className="
                rounded-2xl
                border border-red-400/20
                bg-red-400/10
                px-4 py-3
                text-sm text-red-200
              "
            >
              {error.message}
            </div>
          )}

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              onClick={onClose}
              className="
                text-sm text-[var(--midnight-muted)]
                transition hover:text-[var(--midnight-text)]
              "
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="
              w-full rounded-2xl
              bg-[var(--midnight-accent)]
              py-3.5
              text-base font-medium
              text-[var(--midnight-on-accent)]
              transition-opacity
              hover:opacity-90
              disabled:opacity-40
            "
          >
            {isPending ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-[var(--midnight-muted)]">
          Don&apos;t have an account?
          <Link
            href="/sign-up"
            onClick={onClose}
            className="
              ml-2 font-medium
              text-[var(--midnight-text)]
              transition hover:text-[var(--midnight-accent-hover)]
            "
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
