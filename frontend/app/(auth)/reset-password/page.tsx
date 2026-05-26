"use client";

import { apiClient } from "@/shared/api/client";
import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");

  const [checking, setChecking] = useState(true);
  const [valid, setValid] = useState(false);

  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function checkToken() {
      if (!token) {
        setChecking(false);
        setValid(false);
        return;
      }

      try {
        await apiClient.get(`/auth/reset-password/check`, {
          params: {
            token,
          },
        });

        setValid(true);
      } catch (error) {
        setValid(false);

        if (axios.isAxiosError(error)) {
          setErrorMessage(
            error.response?.data?.message || "Invalid reset link"
          );
        } else {
          setErrorMessage("Invalid reset link");
        }
      } finally {
        setChecking(false);
      }
    }

    checkToken();
  }, [token]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!token || loading) return;

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await apiClient.post(
        `/auth/reset-password`,
        {
          password,
        },
        {
          params: {
            token,
          },
        }
      );

      setSuccessMessage(response.data.message || "Password reset successfully");

      setTimeout(() => {
        router.push("/sign-in");
      }, 1500);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message || "Failed to reset password"
        );
      } else {
        setErrorMessage("Failed to reset password");
      }
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5">
        <p className="text-sm text-[var(--midnight-muted)]">
          Verifying reset link...
        </p>
      </main>
    );
  }

  if (!valid) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5 text-[var(--midnight-text)]">
        <section className="w-full max-w-md text-center">
          <p className="text-xs tracking-[0.24em] text-[var(--midnight-soft)]">
            THE MIDNIGHT LETTERS
          </p>

          <h1 className="mt-5 text-4xl font-bold tracking-[-0.05em]">
            Invalid reset link
          </h1>

          <p className="mt-5 text-[15px] leading-7 text-[var(--midnight-muted)]">
            {errorMessage || "This reset link is invalid or expired."}
          </p>

          <Link
            href="/forgot-password"
            className="mt-8 inline-flex rounded-full bg-[var(--midnight-accent)] px-5 py-3 text-sm font-medium text-[var(--midnight-on-accent)] transition hover:opacity-90"
          >
            Request new link
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5 text-[var(--midnight-text)]">
      <section className="w-full max-w-md">
        <div className="mb-10 text-center">
          <p className="text-xs tracking-[0.24em] text-[var(--midnight-soft)]">
            THE MIDNIGHT LETTERS
          </p>

          <h1 className="mt-5 text-5xl font-bold tracking-[-0.06em]">
            Reset password
          </h1>

          <p className="mt-5 text-[15px] leading-7 text-[var(--midnight-muted)]">
            Enter a new password for your account.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm text-[var(--midnight-muted)]"
            >
              New password
            </label>

            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
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
            {loading ? "Updating..." : "Update password"}
          </button>
        </form>
      </section>
    </main>
  );
}
