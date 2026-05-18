"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRegister } from "@/features/auth/hooks/use-register";
import { useState } from "react";

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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F6F3EE] px-6 py-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-[#F6D7A7]/35 blur-3xl" />
        <div className="absolute right-[-120px] top-[20%] h-[340px] w-[340px] rounded-full bg-[#C7E8CA]/30 blur-3xl" />
        <div className="absolute bottom-[-120px] left-[15%] h-[300px] w-[300px] rounded-full bg-[#E5D9FF]/25 blur-3xl" />
      </div>
      <div className="relative w-full max-w-md rounded-[2rem] border border-white/40 bg-white/90 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.08)] backdrop-blur-xl md:p-10">
        <div className="text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-3xl text-white shadow-lg">
            ⌨
          </div>

          <h1 className="font-serif text-5xl tracking-tight text-[#242424]">
            Stories
          </h1>

          <h2 className="mt-6 text-3xl font-bold text-[#242424]">
            Finish signing up
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-black/60">
            Create your profile and password to start writing.
          </p>
        </div>

        {!token ? (
          <div className="mt-8 text-center">
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              Missing registration token.
            </div>

            <Link
              href="/sign-up"
              className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-black px-6 py-3 text-lg font-medium text-white"
            >
              Back to sign up
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div>
              <div className="mb-2 block text-sm font-medium text-[#242424]">
                Full name
              </div>

              <input
                type="text"
                placeholder="John Doe"
                disabled={isPending}
                {...register("fullName", {
                  required: "Full name is required",
                  minLength: {
                    value: 2,
                    message: "Full name must be at least 2 characters",
                  },
                })}
                className="w-full rounded-2xl border border-black/10 bg-[#FAFAFA] px-4 py-3 outline-none transition focus:border-black/20 focus:bg-white focus:ring-4 focus:ring-black/5 disabled:opacity-50"
              />

              {errors.fullName && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <div className="mb-2 block text-sm font-medium text-[#242424]">
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
                className="w-full rounded-2xl border border-black/10 bg-[#FAFAFA] px-4 py-3 outline-none transition focus:border-black/20 focus:bg-white focus:ring-4 focus:ring-black/5 disabled:opacity-50"
              />

              {errors.password && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {isError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error.message}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-2xl bg-black py-3 text-lg font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {isPending ? "Creating account..." : "Create account"}
            </button>
          </form>
        )}
      </div>

      {registerSuccess && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 px-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2rem] border border-black/5 bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <span className="text-3xl text-green-600">✓</span>
            </div>

            <h2 className="mt-6 text-3xl font-bold text-[#242424]">
              Account created
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-black/60">
              Your Stories account is ready. You can now sign in and start
              writing.
            </p>

            <button
              type="button"
              onClick={() => router.push("/sign-in")}
              className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-black px-6 py-3 text-lg font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
            >
              Continue to sign in
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
