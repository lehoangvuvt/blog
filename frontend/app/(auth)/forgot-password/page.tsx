"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import axios from "axios";
import { apiClient } from "@/shared/api/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading) return;

    setSuccessMessage("");
    setErrorMessage("");

    try {
      setLoading(true);

      const response = await apiClient.post(`/auth/reset-password/request`, {
        email,
      });

      setSuccessMessage(
        response.data.message ||
          "If an account with that email exists, a reset link has been sent."
      );

      setEmail("");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message ||
            "Something went wrong. Please try again."
        );
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5 text-[var(--midnight-text)]">
      <section className="w-full max-w-md">
        <div className="mb-10 text-center">
          <p className="text-xs tracking-[0.24em] text-[var(--midnight-soft)]">
            THE MIDNIGHT LETTERS
          </p>

          <h1 className="mt-5 text-5xl font-bold tracking-[-0.06em]">
            Forgot password
          </h1>

          <p className="mt-5 text-[15px] leading-7 text-[var(--midnight-muted)]">
            Enter your email address and we’ll send you a link to reset your
            password.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm text-[var(--midnight-muted)]"
            >
              Email address
            </label>

            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-[var(--midnight-border)]/70 bg-transparent px-4 py-3 text-sm outline-none transition placeholder:text-[var(--midnight-soft)] focus:border-[var(--midnight-accent)]"
            />
          </div>

          {successMessage ? (
            <div className="rounded-2xl border border-[var(--midnight-border)] bg-[var(--midnight-accent)]/5 px-4 py-3 text-sm leading-7 text-[var(--midnight-muted)]">
              {successMessage}
            </div>
          ) : null}

          {errorMessage ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm leading-7 text-red-400">
              {errorMessage}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[var(--midnight-accent)] px-5 py-3 text-sm font-medium text-[var(--midnight-on-accent)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-[var(--midnight-muted)]">
          Remember your password?{" "}
          <Link
            href="/sign-in"
            className="text-[var(--midnight-text)] transition hover:text-[var(--midnight-accent-hover)]"
          >
            Sign in
          </Link>
        </div>
      </section>
    </main>
  );
}
