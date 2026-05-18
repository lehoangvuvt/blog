"use client";

import { useForm } from "react-hook-form";
import { useRegister } from "@/features/auth/hooks/use-register";
import type { IAuthFormInput } from "@/features/auth/types";
import { useState } from "react";
import Link from "next/link";
import { useLogin } from "@/features/auth/hooks/use-login";
import { useRouter } from "next/navigation";



export default function AuthForm({ type }: { type: "signup" | "signin" }) {
  const router = useRouter();
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IAuthFormInput>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const { mutate: registerMutation, isPending: isRegisterPending, error: registerError, } = useRegister();
  const { mutate: loginMutation, isPending: isLoginPending, error: loginError, } = useLogin();
  const isPending = isRegisterPending || isLoginPending; const error = registerError || loginError;

  const onSubmit = (data: IAuthFormInput) => {
    if (type === "signup") {
      registerMutation(data, {
        onSuccess: (response) => {
          console.log("Register success:", response);
          setRegisterSuccess(true);
        },

        onError: (err) => {
          console.error(err);
        },
      });

      return;
    }

    loginMutation(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: (response) => {
          console.log("Login success:", response);
          localStorage.setItem("accessToken", response.token);
          router.push("/");
        },

        onError: (err) => {
          console.error(err);
        },
      }
    );
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F6F3EE] px-6 py-10">
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `
        radial-gradient(circle at 20% 20%, rgba(0,0,0,0.04) 1px, transparent 1px), 
        radial-gradient(circle at 80% 80%, rgba(0,0,0,0.03) 1px, transparent 1px), 
        radial-gradient(circle at 40% 70%, rgba(0,0,0,0.025) 1px, transparent 1px)`,
        backgroundSize: "120px 120px, 160px 160px, 200px 200px",
      }} />

      {/* ambient gradients */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-[#F6D7A7]/35 blur-3xl" />

        <div className="absolute right-[-120px] top-[20%] h-[340px] w-[340px] rounded-full bg-[#C7E8CA]/30 blur-3xl" />

        <div className="absolute bottom-[-120px] left-[15%] h-[300px] w-[300px] rounded-full bg-[#E5D9FF]/25 blur-3xl" />

        <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/[0.03]" />

        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/[0.025]" />
      </div>

      <div className="relative w-full max-w-md bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_80px_rgba(0,0,0,0.08)] border border-white/40 p-8 md:p-10">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-black text-white text-3xl font-serif shadow-lg mb-6">
            S
          </div>

          <h1 className="text-5xl font-serif tracking-tight text-[#242424]">
            Stories
          </h1>

          <h2 className="mt-6 text-3xl font-bold text-[#242424]">
            {type === "signup" ? "Create your account" : "Welcome back"}
          </h2>

          <p className="mt-3 text-sm text-black/60 leading-relaxed">
            {type === "signup"
              ? "Join Stories to discover stories, follow writers, and publish your own content."
              : "Sign in to continue reading and writing on Stories."}
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <button
            type="button"
            className="w-full border border-black/10 bg-white rounded-2xl py-3 px-4 flex items-center justify-center gap-3 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
          >
            <span className="text-lg font-semibold">G</span>
            Continue with Google
          </button>

          <button
            type="button"
            className="w-full border border-black/10 bg-white rounded-2xl py-3 px-4 flex items-center justify-center gap-3 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
          >
            <span className="text-lg font-semibold">f</span>
            Continue with Facebook
          </button>
        </div>

        <div className="my-8 flex items-center gap-4">
          <div className="flex-1 h-px bg-black/10" />
          <span className="text-sm text-black/40">or</span>
          <div className="flex-1 h-px bg-black/10" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {type === "signup" && (
            <div>
              <div className="block text-sm font-medium mb-2 text-[#242424]">
                Full name
              </div>

              <input
                type="text"
                placeholder="John Doe"
                disabled={isPending}
                {...register("fullName", {
                  required:
                    type === "signup"
                      ? "Full name is required"
                      : false,
                  minLength: {
                    value: 2,
                    message: "Full name must be at least 2 characters",
                  },
                })}
                className="w-full bg-[#FAFAFA] border border-black/10 rounded-2xl px-4 py-3 outline-none transition focus:bg-white focus:ring-4 focus:ring-black/5 focus:border-black/20 disabled:opacity-50"
              />

              {errors.fullName && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.fullName.message as string}
                </p>
              )}
            </div>
          )}

          <div>
            <div className="block text-sm font-medium mb-2 text-[#242424]">
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
              className="w-full bg-[#FAFAFA] border border-black/10 rounded-2xl px-4 py-3 outline-none transition focus:bg-white focus:ring-4 focus:ring-black/5 focus:border-black/20 disabled:opacity-50"
            />

            {errors.email && (
              <p className="mt-2 text-sm text-red-500">
                {errors.email.message as string}
              </p>
            )}
          </div>

          <div>
            <div className="block text-sm font-medium mb-2 text-[#242424]">
              Password
            </div>

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
              className="w-full bg-[#FAFAFA] border border-black/10 rounded-2xl px-4 py-3 outline-none transition focus:bg-white focus:ring-4 focus:ring-black/5 focus:border-black/20 disabled:opacity-50"
            />

            {errors.password && (
              <p className="mt-2 text-sm text-red-500">
                {errors.password.message as string}
              </p>
            )}
          </div>

          {error && (
            <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              Failed to register. Please try again.
            </div>
          )}

          {type === "signin" && (
            <div className="flex justify-end">
              <a
                href="#"
                className="text-sm text-black/60 hover:text-black transition"
              >
                Forgot password?
              </a>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-black text-white rounded-2xl py-3 text-lg font-medium hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {isPending
                ? "Loading..."
                : type === "signup"
                  ? "Sign Up"
                  : "Sign In"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-black/60">
          {type === "signup"
            ? "Already have an account? "
            : "Don't have an account? "}

          <a
            href={type === "signup" ? "/sign-in" : "/sign-up"}
            className="text-black font-semibold hover:underline"
          >
            {type === "signup" ? "Sign in" : "Create one"}
          </a>
        </p>

        <p className="mt-8 text-xs text-center leading-relaxed text-black/40">
          By continuing, you agree to our Terms of Service and acknowledge that
          our Privacy Policy applies to you.
        </p>
      </div>

      {registerSuccess && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm px-6">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-8 text-center shadow-2xl border border-black/5 animate-in fade-in zoom-in duration-300">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h2 className="mt-6 text-3xl font-bold text-[#242424]">
              Account created
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-black/60">
              Your Stories account has been successfully created.
              You can now start reading, writing, and publishing stories.
            </p>

            <div className="mt-8">
              <Link
                href="/sign-in"
                className="inline-flex w-full items-center justify-center rounded-2xl bg-black px-6 py-3 text-lg font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
              >
                Continue to sign in
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
