"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";

async function verifyEmail(token: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/verify-email`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to verify email");
  }

  return res.json();
}

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: verifyEmail,
  });

  useEffect(() => {
    if (token) {
      mutate(token);
    }
  }, [token, mutate]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F6F3EE] px-6 py-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-[#F6D7A7]/35 blur-3xl" />
        <div className="absolute right-[-120px] top-[20%] h-[340px] w-[340px] rounded-full bg-[#C7E8CA]/30 blur-3xl" />
        <div className="absolute bottom-[-120px] left-[15%] h-[300px] w-[300px] rounded-full bg-[#E5D9FF]/25 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md rounded-[2rem] border border-white/40 bg-white/90 p-8 text-center shadow-[0_20px_80px_rgba(0,0,0,0.08)] backdrop-blur-xl md:p-10">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-3xl text-white shadow-lg">
          ⌨
        </div>

        <h1 className="font-serif text-5xl tracking-tight text-[#242424]">
          The Midnight Letters
        </h1>

        {!token && (
          <>
            <h2 className="mt-8 text-3xl font-bold text-[#242424]">
              Invalid link
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-black/60">
              This verification link is missing a token.
            </p>

            <Link
              href="/sign-up"
              className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-black px-6 py-3 text-lg font-medium text-white"
            >
              Back to sign up
            </Link>
          </>
        )}

        {token && isPending && (
          <>
            <h2 className="mt-8 text-3xl font-bold text-[#242424]">
              Verifying email
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-black/60">
              Please wait while we confirm your email address.
            </p>
          </>
        )}

        {token && isError && (
          <>
            <h2 className="mt-8 text-3xl font-bold text-[#242424]">
              Verification failed
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-black/60">
              This link may be invalid or expired. Please request a new
              verification email.
            </p>

            <Link
              href="/sign-up"
              className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-black px-6 py-3 text-lg font-medium text-white"
            >
              Try again
            </Link>
          </>
        )}

        {token && isSuccess && (
          <>
            <div className="mx-auto mt-8 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <span className="text-3xl text-green-600">✓</span>
            </div>

            <h2 className="mt-6 text-3xl font-bold text-[#242424]">
              Email verified
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-black/60">
              Your email has been confirmed. Continue setting up your account.
            </p>

            <Link
              href={`/finish-sign-up?token=${encodeURIComponent(token)}`}
              className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-black px-6 py-3 text-lg font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
            >
              Set up account
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
