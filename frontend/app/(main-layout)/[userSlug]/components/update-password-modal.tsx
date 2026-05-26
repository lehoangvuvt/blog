"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { updatePassword } from "@/features/auth/api/update-password";
import axios from "axios";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onError: (errMsg: string) => void;
};

export default function UpdatePasswordModal({
  open,
  onClose,
  onSuccess,
  onError,
}: Props) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (!open) return null;

  const isDisabled =
    !currentPassword ||
    !newPassword ||
    !confirmPassword ||
    newPassword !== confirmPassword;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await updatePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      onSuccess();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        onError(err.response?.data.message);
        return;
      }

      onError(err instanceof Error ? err.message : "Failed to update password");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-5 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-[var(--midnight-border)] bg-[var(--midnight-bg)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--midnight-border)] px-6 py-5">
          <div>
            <p className="text-xs tracking-[0.18em] text-[var(--midnight-soft)]">
              SECURITY
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[var(--midnight-text)]">
              Update password
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[var(--midnight-border)] p-2 text-[var(--midnight-muted)] transition hover:text-[var(--midnight-text)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          <div>
            <label className="mb-2 block text-sm text-[var(--midnight-soft)]">
              Current password
            </label>

            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-2xl border border-[var(--midnight-border)] bg-[var(--midnight-code-bg)] px-4 py-3 text-sm text-[var(--midnight-text)] outline-none transition focus:border-[var(--midnight-accent)]"
              placeholder="Enter current password"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-[var(--midnight-soft)]">
              New password
            </label>

            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-2xl border border-[var(--midnight-border)] bg-[var(--midnight-code-bg)] px-4 py-3 text-sm text-[var(--midnight-text)] outline-none transition focus:border-[var(--midnight-accent)]"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-[var(--midnight-soft)]">
              Confirm new password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-2xl border border-[var(--midnight-border)] bg-[var(--midnight-code-bg)] px-4 py-3 text-sm text-[var(--midnight-text)] outline-none transition focus:border-[var(--midnight-accent)]"
              placeholder="Confirm new password"
            />
          </div>

          {confirmPassword && newPassword !== confirmPassword && (
            <p className="text-sm text-red-400">
              Password confirmation does not match
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[var(--midnight-border)] px-5 py-2 text-sm text-[var(--midnight-muted)] transition hover:text-[var(--midnight-text)]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isDisabled}
              className="rounded-full bg-[var(--midnight-accent)] px-5 py-2 text-sm font-medium text-[var(--midnight-on-accent)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Update password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
