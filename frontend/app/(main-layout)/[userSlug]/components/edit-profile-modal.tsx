"use client";

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

        // TODO: upload file to storage, then replace preview with uploaded URL
        updateField("avatar", preview);
    };

    const handleBackgroundChange = (file?: File) => {
        if (!file) return;

        const preview = URL.createObjectURL(file);
        setBackgroundPreview(preview);

        // TODO: upload file to storage, then replace preview with uploaded URL
        updateField("backgroundImage", preview);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // TODO: call update profile mutation here
        console.log(form);

        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm">
            <div className="flex min-h-screen items-center justify-center p-4">
                <form
                    onSubmit={handleSubmit}
                    className="flex h-[82vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-2xl"
                >
                    <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-5">
                        <div>
                            <h1 className="text-xl font-semibold tracking-tight text-neutral-950">
                                Edit Profile
                            </h1>

                            <p className="mt-1 text-sm text-neutral-500">
                                Manage your public profile and branding.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-black"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-6 py-6">
                        <div className="mx-auto max-w-2xl">
                            <div className="mb-12">
                                <div className="relative h-24 w-24">
                                    {avatarPreview ? (
                                        <img
                                            src={avatarPreview}
                                            alt={form.fullName}
                                            className="h-24 w-24 rounded-full border border-neutral-200 object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-neutral-950 text-4xl font-semibold text-white">
                                            {form.fullName.charAt(0).toUpperCase() || "U"}
                                        </div>
                                    )}

                                    <label className="absolute bottom-1 right-1 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-neutral-300 bg-white shadow-sm transition hover:bg-neutral-50">
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

                            <div className="space-y-8">
                                <ProfileInput
                                    label="Name"
                                    value={form.fullName}
                                    placeholder="Your name"
                                    onChange={(value) => updateField("fullName", value)}
                                />

                                <div>
                                    <div className="mb-3 block text-base font-semibold text-neutral-950">
                                        Handle
                                    </div>

                                    <div className="flex gap-3">
                                        <div className="flex flex-1 items-center rounded-2xl border border-neutral-300 bg-white px-5 py-4 text-base focus-within:border-neutral-950">
                                            <span className="mr-1 text-neutral-400">@</span>

                                            <input
                                                value={form.slug}
                                                placeholder="your-handle"
                                                onChange={(event) =>
                                                    updateField("slug", event.target.value)
                                                }
                                                className="w-full bg-transparent outline-none"
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            className="rounded-2xl bg-neutral-100 px-5 text-sm font-semibold transition hover:bg-neutral-200"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </div>

                                <ProfileTextarea
                                    label="Bio"
                                    value={form.introduction}
                                    placeholder="Write a short bio..."
                                    onChange={(value) => updateField("introduction", value)}
                                />
                            </div>

                            <hr className="my-12 border-neutral-200" />

                            <section>
                                <h2 className="text-2xl font-semibold tracking-tight text-neutral-950">
                                    Branding
                                </h2>

                                <p className="mt-3 max-w-xl text-base leading-7 text-neutral-500">
                                    Customize the appearance of your public profile.
                                </p>

                                <div className="mt-8">
                                    <div className="mb-3 block text-base font-semibold text-neutral-950">
                                        Header image
                                    </div>

                                    <div className="overflow-hidden rounded-3xl border border-neutral-300">
                                        {backgroundPreview ? (
                                            <div
                                                className="relative h-40 bg-cover bg-center"
                                                style={{
                                                    backgroundImage: `url(${backgroundPreview})`,
                                                }}
                                            >
                                                <div className="absolute inset-0 bg-black/10" />
                                            </div>
                                        ) : (
                                            <div className="flex h-56 flex-col items-center justify-center bg-neutral-50 text-center">
                                                <ImageIcon className="mb-4 h-8 w-8 text-neutral-400" />

                                                <p className="text-lg font-semibold text-neutral-950">
                                                    Upload your header image
                                                </p>

                                                <p className="mt-2 text-neutral-500">
                                                    Recommended 1344×256px or wider
                                                </p>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between border-t border-neutral-200 p-4">
                                            <p className="text-sm text-neutral-500">
                                                PNG, JPG, WEBP supported
                                            </p>

                                            <label className="cursor-pointer rounded-xl bg-neutral-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800">
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

                            <hr className="my-12 border-neutral-200" />

                            <section>
                                <h2 className="text-3xl font-bold tracking-tight text-neutral-950">
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
                    <div className="border-t border-neutral-200 bg-white/95 px-6 py-4 backdrop-blur">
                        <div className="mx-auto flex max-w-2xl items-center justify-end gap-3">
                            <button type="button" onClick={onClose} className="rounded-xl px-4 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100" >
                                Cancel
                            </button>
                            <button type="submit" className="rounded-xl bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800" >
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
            <span className="mb-3 block text-base font-semibold text-neutral-950">
                {label}
            </span>

            <input
                value={value}
                placeholder={placeholder}
                onChange={(event) => onChange(event.target.value)}
                className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-950"
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
            <span className="mb-3 block text-base font-semibold text-neutral-950">
                {label}
            </span>

            <textarea
                value={value}
                placeholder={placeholder}
                rows={5}
                onChange={(event) => onChange(event.target.value)}
                className="w-full resize-none rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950"
            />
        </label>
    );
}