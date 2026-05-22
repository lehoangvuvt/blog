"use client";

"use client";

import Link from "next/link";
import { X } from "lucide-react";
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
      email: "hoangvule.183@gmail.com",
      password: "12345",
    },
  });

  const { mutate: loginMutation, isPending, error } = useLogin();

  const onSubmit = (data: IAuthFormInput) => {
    if(!data.email || !data.password) return;

    loginMutation(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: (response) => {
          localStorage.setItem("accessToken", response.token);
          //   onClose();
          window.location.reload();
        },
      }
    );
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-[2rem] border border-black/5 bg-white p-7 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-black/50 transition hover:bg-black/5 hover:text-black"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-2xl text-white">
            ⌨
          </div>

          <h2 className="font-serif text-4xl tracking-tight text-[#242424]">
            Welcome back
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-black/60">
            Sign in to continue reading and writing on Stories.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-5">
          <div>
            {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
            <label className="mb-2 block text-sm font-medium text-[#242424]">
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
              className="w-full rounded-2xl border border-black/10 bg-[#FAFAFA] px-4 py-3 outline-none transition focus:border-black/20 focus:bg-white focus:ring-4 focus:ring-black/5 disabled:opacity-50"
            />

            {errors.email && (
              <p className="mt-2 text-sm text-red-500">
                {errors.email.message as string}
              </p>
            )}
          </div>

          <div>
            {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
            <label className="mb-2 block text-sm font-medium text-[#242424]">
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              disabled={isPending}
              {...register("password", {
                required: "Password is required",
              })}
              className="w-full rounded-2xl border border-black/10 bg-[#FAFAFA] px-4 py-3 outline-none transition focus:border-black/20 focus:bg-white focus:ring-4 focus:ring-black/5 disabled:opacity-50"
            />

            {errors.password && (
              <p className="mt-2 text-sm text-red-500">
                {errors.password.message as string}
              </p>
            )}
          </div>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error.message}
            </div>
          )}

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              onClick={onClose}
              className="text-sm text-black/60 transition hover:text-black"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-2xl bg-black py-3 text-base font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {isPending ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-black/60">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            onClick={onClose}
            className="font-semibold text-black hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
