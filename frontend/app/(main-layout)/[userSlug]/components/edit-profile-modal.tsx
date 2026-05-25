"use client";

import useUpdateProfile from "@/features/users/hooks/use-update-profile";
import type { GetUserInfoResponse } from "@/features/users/types";
import { ImageIcon, Pencil, X } from "lucide-react";
import { useState } from "react";

export default function EditProfileModal({
  open,
  onClose,
  userInfo,
}: {
  open: boolean;
  onClose: () => void;
  userInfo: GetUserInfoResponse;
}) {
  const [form, setForm] = useState({
    slug: userInfo.slug ?? "",
    fullName: userInfo.fullName ?? "",
    introduction: userInfo.introduction ?? "",
    avatar: userInfo.avatar ?? "",
    backgroundImage: userInfo.backgroundImage ?? "",
    social: {
      x: userInfo.social?.x ?? "",
      facebook: userInfo.social?.facebook ?? "",
      youtube: userInfo.social?.youtube ?? "",
      linkedin: userInfo.social?.linkedin ?? "",
      website: userInfo.social?.website ?? "",
    },
  });

  const [avatarPreview, setAvatarPreview] = useState(form.avatar);
  const [backgroundPreview, setBackgroundPreview] = useState(
    form.backgroundImage
  );

  const { mutate: updateProfile } = useUpdateProfile();

  if (!open) return null;

  const updateField = (
    key: "slug" | "fullName" | "introduction" | "avatar" | "backgroundImage",
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateSocial = (key: keyof typeof form.social, value: string) => {
    setForm((prev) => ({
      ...prev,
      social: {
        ...prev.social,
        [key]: value,
      },
    }));
  };

  const handleAvatarChange = (file?: File) => {
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setAvatarPreview(preview);
    updateField("avatar", preview);
  };

  const handleBackgroundChange = (file?: File) => {
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setBackgroundPreview(preview);
    updateField("backgroundImage", preview);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateProfile({
      fullName: form.fullName,
      slug: form.slug,
      introduction: form.introduction,
    })
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 px-4 backdrop-blur-[3px]">
      <div className="flex min-h-screen items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="flex h-[82vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[var(--midnight-border)]/70 bg-[var(--midnight-surface)] shadow-[0_28px_90px_rgba(0,0,0,0.38)]"
        >
          <div className="flex items-start justify-between border-b border-[var(--midnight-border)]/70 px-6 py-5">
            <div>
              <p className="text-xs tracking-[0.14em] text-[var(--midnight-soft)]">
                Profile
              </p>

              <h1 className="mt-2 text-2xl font-bold tracking-[-0.045em] text-[var(--midnight-text)]">
                Edit profile
              </h1>

              <p className="mt-2 text-sm leading-6 text-[var(--midnight-muted)]">
                Manage how your writer archive appears to readers.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-[var(--midnight-muted)] transition hover:bg-[var(--midnight-code-bg)] hover:text-[var(--midnight-text)]"
              aria-label="Close edit profile modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="mx-auto max-w-2xl">
              <div className="mb-10">
                <div className="relative h-24 w-24">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt={form.fullName}
                      className="h-24 w-24 rounded-full border border-[var(--midnight-border)]/70 object-cover opacity-95"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-full border border-[var(--midnight-border)]/70 bg-[var(--midnight-code-bg)] text-4xl font-bold text-[var(--midnight-accent)]">
                      {form.fullName.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}

                  <label className="absolute bottom-1 right-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[var(--midnight-border)]/70 bg-[var(--midnight-code-bg)] text-[var(--midnight-muted)] shadow-sm transition hover:text-[var(--midnight-accent-hover)]">
                    <Pencil className="h-4 w-4" />

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) =>
                        handleAvatarChange(event.target.files?.[0])
                      }
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-7">
                <ProfileInput
                  label="Name"
                  value={form.fullName}
                  placeholder="Your name"
                  onChange={(value) => updateField("fullName", value)}
                />

                <div>
                  <span className="mb-3 block text-sm font-medium text-[var(--midnight-text)]">
                    Handle
                  </span>

                  <div className="flex gap-3">
                    <div className="flex flex-1 items-center rounded-xl border border-[var(--midnight-border)]/70 bg-[var(--midnight-code-bg)] px-4 py-3 text-sm focus-within:border-[var(--midnight-accent)]/70">
                      <span className="mr-1 text-[var(--midnight-soft)]">
                        @
                      </span>

                      <input
                        value={form.slug}
                        placeholder="your-handle"
                        onChange={(event) =>
                          updateField("slug", event.target.value)
                        }
                        className="w-full bg-transparent text-[var(--midnight-text)] outline-none placeholder:text-[var(--midnight-soft)]"
                      />
                    </div>
                  </div>
                </div>

                <ProfileTextarea
                  label="Bio"
                  value={form.introduction}
                  placeholder="Write a short bio..."
                  onChange={(value) => updateField("introduction", value)}
                />
              </div>

              <hr className="my-10 border-[var(--midnight-border)]/70" />

              <section>
                <h2 className="text-2xl font-bold tracking-[-0.04em] text-[var(--midnight-text)]">
                  Branding
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--midnight-muted)]">
                  Customize the appearance of your public profile.
                </p>

                <div className="mt-7">
                  <span className="mb-3 block text-sm font-medium text-[var(--midnight-text)]">
                    Header image
                  </span>

                  <div className="overflow-hidden rounded-2xl border border-[var(--midnight-border)]/70 bg-[var(--midnight-code-bg)]">
                    {backgroundPreview ? (
                      <div
                        className="relative h-40 bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${backgroundPreview})`,
                        }}
                      >
                        <div className="absolute inset-0 bg-black/25" />
                      </div>
                    ) : (
                      <div className="flex h-48 flex-col items-center justify-center text-center">
                        <ImageIcon className="mb-4 h-7 w-7 text-[var(--midnight-muted)]" />

                        <p className="text-sm font-medium text-[var(--midnight-text)]">
                          Upload your header image
                        </p>

                        <p className="mt-2 text-sm text-[var(--midnight-muted)]">
                          Recommended 1344×256px or wider.
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between border-t border-[var(--midnight-border)]/70 p-4">
                      <p className="text-sm text-[var(--midnight-soft)]">
                        PNG, JPG, WEBP supported
                      </p>

                      <label className="cursor-pointer rounded-full bg-[var(--midnight-accent)] px-4 py-2 text-sm font-medium text-[var(--midnight-on-accent)] transition hover:opacity-90">
                        Select image
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) =>
                            handleBackgroundChange(event.target.files?.[0])
                          }
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </section>

              <hr className="my-10 border-[var(--midnight-border)]/70" />

              <section>
                <h2 className="text-2xl font-bold tracking-[-0.04em] text-[var(--midnight-text)]">
                  Links
                </h2>

                <div className="mt-6 space-y-5">
                  <ProfileInput
                    label="X"
                    value={form.social.x}
                    placeholder="https://x.com/..."
                    onChange={(value) => updateSocial("x", value)}
                  />

                  <ProfileInput
                    label="Facebook"
                    value={form.social.facebook}
                    placeholder="https://facebook.com/..."
                    onChange={(value) => updateSocial("facebook", value)}
                  />

                  <ProfileInput
                    label="YouTube"
                    value={form.social.youtube}
                    placeholder="https://youtube.com/..."
                    onChange={(value) => updateSocial("youtube", value)}
                  />

                  <ProfileInput
                    label="LinkedIn"
                    value={form.social.linkedin}
                    placeholder="https://linkedin.com/in/..."
                    onChange={(value) => updateSocial("linkedin", value)}
                  />

                  <ProfileInput
                    label="Website"
                    value={form.social.website}
                    placeholder="https://yourwebsite.com"
                    onChange={(value) => updateSocial("website", value)}
                  />
                </div>
              </section>
            </div>
          </div>

          <div className="border-t border-[var(--midnight-border)]/70 bg-[var(--midnight-surface)]/95 px-6 py-4 backdrop-blur">
            <div className="mx-auto flex max-w-2xl items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full px-4 py-2 text-sm font-medium text-[var(--midnight-muted)] transition hover:bg-[var(--midnight-code-bg)] hover:text-[var(--midnight-text)]"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-full bg-[var(--midnight-accent)] px-5 py-2.5 text-sm font-medium text-[var(--midnight-on-accent)] transition hover:opacity-90"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProfileInput({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-3 block text-sm font-medium text-[var(--midnight-text)]">
        {label}
      </span>

      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-[var(--midnight-border)]/70 bg-[var(--midnight-code-bg)] px-4 py-3 text-sm text-[var(--midnight-text)] outline-none transition placeholder:text-[var(--midnight-soft)] focus:border-[var(--midnight-accent)]/70"
      />
    </label>
  );
}

function ProfileTextarea({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-3 block text-sm font-medium text-[var(--midnight-text)]">
        {label}
      </span>

      <textarea
        value={value}
        placeholder={placeholder}
        rows={5}
        onChange={(event) => onChange(event.target.value)}
        className="w-full resize-none rounded-xl border border-[var(--midnight-border)]/70 bg-[var(--midnight-code-bg)] px-4 py-3 text-sm leading-6 text-[var(--midnight-text)] outline-none transition placeholder:text-[var(--midnight-soft)] focus:border-[var(--midnight-accent)]/70"
      />
    </label>
  );
}
