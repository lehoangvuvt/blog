"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";

async function checkVerifyEmailToken(token: string) {
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_BASE_API_URL
    }/auth/verify-email/check?token=${encodeURIComponent(token)}`
  );

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || "Invalid verification link");
  }

  return res.json();
}

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
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || "Failed to verify email");
  }

  return res.json();
}

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const {
    data,
    isPending: isChecking,
    isError: isCheckError,
    error: checkError,
  } = useQuery({
    queryKey: ["verify-email-check", token],
    queryFn: () => checkVerifyEmailToken(token as string),
    enabled: Boolean(token),
    retry: false,
  });

  const {
    mutate,
    isPending: isVerifying,
    isSuccess,
    isError: isVerifyError,
    error: verifyError,
  } = useMutation({
    mutationFn: verifyEmail,
  });

  const isAlreadyVerified = data?.status === "already_verified";

  function handleVerify() {
    if (!token || isVerifying) return;
    mutate(token);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--midnight-bg)] px-5 py-12 text-[var(--midnight-text)]">
      <section className="w-full max-w-md text-center">
        <p className="text-xs tracking-[0.24em] text-[var(--midnight-soft)]">
          THE MIDNIGHT LETTERS
        </p>

        <div className="mt-8 rounded-[2rem] border border-[var(--midnight-border)]/70 bg-[var(--midnight-surface)] px-6 py-10 shadow-sm">
          {!token && (
            <>
              <h1 className="text-5xl font-bold tracking-[-0.06em]">
                Invalid link
              </h1>

              <p className="mt-5 text-[15px] leading-7 text-[var(--midnight-muted)]">
                This verification link is missing a token.
              </p>

              <Link
                href="/sign-up"
                className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-[var(--midnight-accent)] px-5 py-3 text-sm font-medium text-[var(--midnight-on-accent)] transition hover:opacity-90"
              >
                Back to sign up
              </Link>
            </>
          )}

          {token && isChecking && (
            <>
              <div className="mx-auto mb-7 h-2 w-16 overflow-hidden rounded-full bg-[var(--midnight-border)]">
                <div className="h-full w-1/2 animate-pulse rounded-full bg-[var(--midnight-accent)]" />
              </div>

              <h1 className="text-5xl font-bold tracking-[-0.06em]">
                Checking link
              </h1>

              <p className="mt-5 text-[15px] leading-7 text-[var(--midnight-muted)]">
                Please wait while we check your verification link.
              </p>
            </>
          )}

          {token && isCheckError && (
            <>
              <h1 className="text-5xl font-bold tracking-[-0.06em]">
                Verification failed
              </h1>

              <p className="mt-5 text-[15px] leading-7 text-[var(--midnight-muted)]">
                {checkError.message ||
                  "This link may be invalid or expired. Please request a new verification email."}
              </p>

              <Link
                href="/sign-up"
                className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-[var(--midnight-accent)] px-5 py-3 text-sm font-medium text-[var(--midnight-on-accent)] transition hover:opacity-90"
              >
                Try again
              </Link>
            </>
          )}

          {token && !isChecking && !isCheckError && !isSuccess && (
            <>
              <h1 className="text-5xl font-bold tracking-[-0.06em]">
                {isAlreadyVerified ? "Already verified" : "Verify email"}
              </h1>

              <p className="mt-5 text-[15px] leading-7 text-[var(--midnight-muted)]">
                {isAlreadyVerified
                  ? "Your email has already been confirmed. Continue setting up your account."
                  : "Your verification link is valid. Confirm your email address to continue."}
              </p>

              {isVerifyError && (
                <p className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm leading-6 text-red-400">
                  {verifyError.message || "Failed to verify email"}
                </p>
              )}

              {isAlreadyVerified ? (
                <Link
                  href={`/finish-sign-up?token=${encodeURIComponent(token)}`}
                  className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-[var(--midnight-accent)] px-5 py-3 text-sm font-medium text-[var(--midnight-on-accent)] transition hover:opacity-90"
                >
                  Set up account
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={handleVerify}
                  disabled={isVerifying}
                  className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-[var(--midnight-accent)] px-5 py-3 text-sm font-medium text-[var(--midnight-on-accent)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isVerifying ? "Verifying..." : "Verify email"}
                </button>
              )}
            </>
          )}

          {token && isSuccess && (
            <>
              <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-full border border-[var(--midnight-border)] bg-[var(--midnight-accent)]/10">
                <span className="text-2xl text-[var(--midnight-accent)]">
                  ✓
                </span>
              </div>

              <h1 className="text-5xl font-bold tracking-[-0.06em]">
                Email verified
              </h1>

              <p className="mt-5 text-[15px] leading-7 text-[var(--midnight-muted)]">
                Your email has been confirmed. Continue setting up your account.
              </p>

              <Link
                href={`/finish-sign-up?token=${encodeURIComponent(token)}`}
                className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-[var(--midnight-accent)] px-5 py-3 text-sm font-medium text-[var(--midnight-on-accent)] transition hover:opacity-90"
              >
                Set up account
              </Link>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
