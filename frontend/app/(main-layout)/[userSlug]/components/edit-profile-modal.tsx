"use client";

import {
  getUploadPresignedUrl,
  uploadFile,
} from "@/features/files/api/upload.api";
import useUpdateProfile from "@/features/users/hooks/use-update-profile";
import type { GetUserInfoResponse } from "@/features/users/types";
import { ImageIcon, Pencil, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import useNotification from "@/hooks/use-notification";
import NotificationPopover from "@/shared/components/notification-popover";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

type TextField =
  | "slug"
  | "fullName"
  | "introduction"
  | "avatar"
  | "backgroundImage";

type SocialField = "x" | "facebook" | "youtube" | "linkedin" | "website";

type CropTarget = "avatar" | "backgroundImage";

type CropModalState = {
  type: CropTarget;
  imageUrl: string;
  fileName: string;
  mimeType: string;
};

export default function EditProfileModal({
  open,
  onClose,
  userInfo,
  refetch,
}: {
  open: boolean;
  onClose: () => void;
  userInfo: GetUserInfoResponse;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<GetUserInfoResponse, Error>>;
}) {
  const { close, open: openNotification, notifications } = useNotification();

  const notifySuccess = (message: string) => {
    openNotification(message, "success");
  };

  const notifyError = (message: string) => {
    openNotification(message, "error");
  };

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

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [cropModal, setCropModal] = useState<CropModalState | null>(null);

  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingBackground, setUploadingBackground] = useState(false);

  const { mutate: updateProfile, isPending } = useUpdateProfile();

  useEffect(() => {
    return () => {
      if (avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }

      if (backgroundPreview.startsWith("blob:")) {
        URL.revokeObjectURL(backgroundPreview);
      }

      if (cropModal?.imageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(cropModal.imageUrl);
      }
    };
  }, [avatarPreview, backgroundPreview, cropModal]);

  const changed = useMemo(
    () => ({
      fullName: form.fullName !== (userInfo.fullName ?? ""),
      slug: form.slug !== (userInfo.slug ?? ""),
      introduction: form.introduction !== (userInfo.introduction ?? ""),
      avatar: Boolean(avatarFile),
      backgroundImage: Boolean(backgroundFile),
      x: form.social.x !== (userInfo.social?.x ?? ""),
      facebook: form.social.facebook !== (userInfo.social?.facebook ?? ""),
      youtube: form.social.youtube !== (userInfo.social?.youtube ?? ""),
      linkedin: form.social.linkedin !== (userInfo.social?.linkedin ?? ""),
      website: form.social.website !== (userInfo.social?.website ?? ""),
    }),
    [form, avatarFile, backgroundFile, userInfo]
  );

  if (!open) return null;

  const busy = isPending || uploadingAvatar || uploadingBackground;

  const updateField = (key: TextField, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateSocial = (key: SocialField, value: string) => {
    setForm((prev) => ({
      ...prev,
      social: {
        ...prev.social,
        [key]: value,
      },
    }));
  };

  const handleImageSelect = (type: CropTarget, file?: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      notifyError("Please select a valid image file");
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setCropModal({
      type,
      imageUrl,
      fileName: file.name,
      mimeType: file.type || "image/jpeg",
    });
  };

  const handleCloseCropModal = () => {
    if (cropModal?.imageUrl.startsWith("blob:")) {
      URL.revokeObjectURL(cropModal.imageUrl);
    }

    setCropModal(null);
  };

  const handleCropConfirm = (croppedFile: File, previewUrl: string) => {
    if (!cropModal) return;

    if (cropModal.type === "avatar") {
      if (avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }

      setAvatarFile(croppedFile);
      setAvatarPreview(previewUrl);
      notifySuccess("Avatar cropped successfully");
    }

    if (cropModal.type === "backgroundImage") {
      if (backgroundPreview.startsWith("blob:")) {
        URL.revokeObjectURL(backgroundPreview);
      }

      setBackgroundFile(croppedFile);
      setBackgroundPreview(previewUrl);
      notifySuccess("Header image cropped successfully");
    }

    if (cropModal.imageUrl.startsWith("blob:")) {
      URL.revokeObjectURL(cropModal.imageUrl);
    }

    setCropModal(null);
  };

  const handleUpdateField = (key: "slug" | "fullName" | "introduction") => {
    updateProfile(
      {
        [key]: form[key],
      },
      {
        onSuccess: () => {
          notifySuccess("Profile updated successfully");
          refetch();
        },
        onError: (err) => {
          notifyError(err.message);
        },
      }
    );
  };

  const handleUpdateSocial = (key: SocialField) => {
    const value = form.social[key];

    updateProfile(
      {
        ...(key === "facebook" && { facebookLink: value }),
        ...(key === "linkedin" && { linkedinLink: value }),
        ...(key === "website" && { websiteLink: value }),
        ...(key === "x" && { xLink: value }),
        ...(key === "youtube" && { youtubeLink: value }),
      },
      {
        onSuccess: () => {
          notifySuccess(`${getSocialLabel(key)} updated successfully`);
          refetch();
        },
        onError: () => {
          notifyError(`Failed to update ${getSocialLabel(key)}`);
        },
      }
    );
  };

  const handleUpdateAvatar = async () => {
    if (!avatarFile) return;

    setUploadingAvatar(true);

    try {
      const { url, publicUrl } = await getUploadPresignedUrl(
        avatarFile.name,
        avatarFile.type
      );

      await uploadFile(avatarFile, url);

      updateProfile(
        {
          avatarUrl: publicUrl,
        },
        {
          onSuccess: () => {
            if (avatarPreview.startsWith("blob:")) {
              URL.revokeObjectURL(avatarPreview);
            }

            setAvatarFile(null);
            updateField("avatar", publicUrl);
            setAvatarPreview(publicUrl);

            notifySuccess("Avatar updated successfully");
            refetch();
          },
          onError: () => {
            notifyError("Failed to update avatar");
          },
        }
      );
    } catch {
      notifyError("Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleUpdateBackgroundImage = async () => {
    if (!backgroundFile) return;

    setUploadingBackground(true);

    try {
      const { url, publicUrl } = await getUploadPresignedUrl(
        backgroundFile.name,
        backgroundFile.type
      );

      await uploadFile(backgroundFile, url);

      updateProfile(
        {
          backgroundImage: publicUrl,
        },
        {
          onSuccess: () => {
            if (backgroundPreview.startsWith("blob:")) {
              URL.revokeObjectURL(backgroundPreview);
            }

            setBackgroundFile(null);
            updateField("backgroundImage", publicUrl);
            setBackgroundPreview(publicUrl);

            notifySuccess("Header image updated successfully");

            refetch();
          },
          onError: () => {
            notifyError("Failed to update header image");
          },
        }
      );
    } catch {
      notifyError("Failed to upload header image");
    } finally {
      setUploadingBackground(false);
    }
  };

  return (
    <>
      <NotificationPopover onClose={close} notifications={notifications} />
      <div className="fixed inset-0 z-50 bg-black/60 px-4 backdrop-blur-[3px]">
        <div className="flex min-h-screen items-center justify-center">
          <div className="flex h-[82vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[var(--midnight-border)]/70 bg-[var(--midnight-surface)] shadow-[0_28px_90px_rgba(0,0,0,0.38)]">
            <div className="flex items-start justify-between border-b border-[var(--midnight-border)]/70 px-6 py-5">
              <div>
                <p className="text-xs tracking-[0.14em] text-[var(--midnight-soft)]">
                  Profile
                </p>

                <h1 className="mt-2 text-2xl font-bold tracking-[-0.045em] text-[var(--midnight-text)]">
                  Edit profile
                </h1>

                <p className="mt-2 text-sm leading-6 text-[var(--midnight-muted)]">
                  Update each field separately.
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
                  <span className="mb-3 block text-sm font-medium text-[var(--midnight-text)]">
                    Avatar
                  </span>

                  <div className="flex items-end gap-4">
                    <div className="relative aspect-square h-28 overflow-hidden rounded-full border border-[var(--midnight-border)]/70 bg-[var(--midnight-code-bg)]">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt={form.fullName}
                          className="h-full w-full object-cover object-center"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-[var(--midnight-accent)]">
                          {form.fullName.charAt(0).toUpperCase() || "U"}
                        </div>
                      )}

                      <label className="absolute bottom-2 right-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[var(--midnight-border)]/70 bg-[var(--midnight-surface)] text-[var(--midnight-muted)] shadow-sm transition hover:text-[var(--midnight-accent-hover)]">
                        <Pencil className="h-4 w-4" />

                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) =>
                            handleImageSelect("avatar", event.target.files?.[0])
                          }
                        />
                      </label>
                    </div>

                    <UpdateButton
                      disabled={busy || !changed.avatar}
                      onClick={handleUpdateAvatar}
                    >
                      {uploadingAvatar ? "Uploading..." : "Update"}
                    </UpdateButton>
                  </div>

                  <p className="mt-3 text-xs text-[var(--midnight-soft)]">
                    Select an image, crop it as a circle, then update.
                  </p>
                </div>

                <div className="space-y-7">
                  <ProfileInput
                    label="Name"
                    value={form.fullName}
                    placeholder="Your name"
                    disabled={busy || !changed.fullName}
                    onChange={(value) => updateField("fullName", value)}
                    onUpdate={() => handleUpdateField("fullName")}
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

                      <UpdateButton
                        disabled={busy || !changed.slug}
                        onClick={() => handleUpdateField("slug")}
                      />
                    </div>
                  </div>

                  <ProfileTextarea
                    label="Bio"
                    value={form.introduction}
                    placeholder="Write a short bio..."
                    disabled={busy || !changed.introduction}
                    onChange={(value) => updateField("introduction", value)}
                    onUpdate={() => handleUpdateField("introduction")}
                  />
                </div>

                <hr className="my-10 border-[var(--midnight-border)]/70" />

                <section>
                  <h2 className="text-2xl font-bold tracking-[-0.04em] text-[var(--midnight-text)]">
                    Branding
                  </h2>

                  <div className="mt-7">
                    <span className="mb-3 block text-sm font-medium text-[var(--midnight-text)]">
                      Header image
                    </span>

                    <div className="overflow-hidden rounded-2xl border border-[var(--midnight-border)]/70 bg-[var(--midnight-code-bg)]">
                      <div className="aspect-video w-full overflow-hidden bg-[var(--midnight-code-bg)]">
                        {backgroundPreview ? (
                          <img
                            src={backgroundPreview}
                            alt="Profile header preview"
                            className="h-full w-full object-cover object-center"
                          />
                        ) : (
                          <div className="flex h-full flex-col items-center justify-center text-center">
                            <ImageIcon className="mb-4 h-7 w-7 text-[var(--midnight-muted)]" />

                            <p className="text-sm font-medium text-[var(--midnight-text)]">
                              Upload your header image
                            </p>

                            <p className="mt-2 text-sm text-[var(--midnight-muted)]">
                              Crop preview will use 16:9.
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between border-t border-[var(--midnight-border)]/70 p-4">
                        <p className="text-sm text-[var(--midnight-soft)]">
                          PNG, JPG, WEBP supported
                        </p>

                        <div className="flex items-center gap-3">
                          <label className="cursor-pointer rounded-full bg-[var(--midnight-code-bg)] px-4 py-2 text-sm font-medium text-[var(--midnight-text)] transition hover:opacity-80">
                            Select image
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(event) =>
                                handleImageSelect(
                                  "backgroundImage",
                                  event.target.files?.[0]
                                )
                              }
                            />
                          </label>

                          <UpdateButton
                            disabled={busy || !changed.backgroundImage}
                            onClick={handleUpdateBackgroundImage}
                          >
                            {uploadingBackground ? "Uploading..." : "Update"}
                          </UpdateButton>
                        </div>
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
                      disabled={busy || !changed.x}
                      onChange={(value) => updateSocial("x", value)}
                      onUpdate={() => handleUpdateSocial("x")}
                    />

                    <ProfileInput
                      label="Facebook"
                      value={form.social.facebook}
                      placeholder="https://facebook.com/..."
                      disabled={busy || !changed.facebook}
                      onChange={(value) => updateSocial("facebook", value)}
                      onUpdate={() => handleUpdateSocial("facebook")}
                    />

                    <ProfileInput
                      label="YouTube"
                      value={form.social.youtube}
                      placeholder="https://youtube.com/..."
                      disabled={busy || !changed.youtube}
                      onChange={(value) => updateSocial("youtube", value)}
                      onUpdate={() => handleUpdateSocial("youtube")}
                    />

                    <ProfileInput
                      label="LinkedIn"
                      value={form.social.linkedin}
                      placeholder="https://linkedin.com/in/..."
                      disabled={busy || !changed.linkedin}
                      onChange={(value) => updateSocial("linkedin", value)}
                      onUpdate={() => handleUpdateSocial("linkedin")}
                    />

                    <ProfileInput
                      label="Website"
                      value={form.social.website}
                      placeholder="https://yourwebsite.com"
                      disabled={busy || !changed.website}
                      onChange={(value) => updateSocial("website", value)}
                      onUpdate={() => handleUpdateSocial("website")}
                    />
                  </div>
                </section>
              </div>
            </div>

            <div className="border-t border-[var(--midnight-border)]/70 bg-[var(--midnight-surface)]/95 px-6 py-4 backdrop-blur">
              <div className="mx-auto flex max-w-2xl items-center justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full px-4 py-2 text-sm font-medium text-[var(--midnight-muted)] transition hover:bg-[var(--midnight-code-bg)] hover:text-[var(--midnight-text)]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {cropModal && (
        <ImageCropModal
          imageUrl={cropModal.imageUrl}
          fileName={cropModal.fileName}
          mimeType={cropModal.mimeType}
          aspect={cropModal.type === "avatar" ? 1 : 16 / 9}
          cropShape={cropModal.type === "avatar" ? "round" : "rect"}
          title={
            cropModal.type === "avatar" ? "Crop avatar" : "Crop header image"
          }
          onClose={handleCloseCropModal}
          onConfirm={handleCropConfirm}
          onError={() => notifyError("Failed to crop image")}
        />
      )}
    </>
  );
}

function ImageCropModal({
  imageUrl,
  fileName,
  mimeType,
  aspect,
  cropShape,
  title,
  onClose,
  onConfirm,
  onError,
}: {
  imageUrl: string;
  fileName: string;
  mimeType: string;
  aspect: number;
  cropShape: "round" | "rect";
  title: string;
  onClose: () => void;
  onConfirm: (file: File, previewUrl: string) => void;
  onError: () => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedPixels, setCroppedPixels] = useState<Area | null>(null);
  const [isCropping, setIsCropping] = useState(false);

  const handleConfirm = async () => {
    if (!croppedPixels) return;

    setIsCropping(true);

    try {
      const blob = await getCroppedImageBlob(imageUrl, croppedPixels, mimeType);

      const croppedFile = new File([blob], buildCroppedFileName(fileName), {
        type: mimeType,
      });

      const previewUrl = URL.createObjectURL(croppedFile);

      onConfirm(croppedFile, previewUrl);
    } catch {
      onError();
    } finally {
      setIsCropping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/70 px-4 backdrop-blur-sm">
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-[var(--midnight-border)] bg-[var(--midnight-surface)] shadow-[0_28px_90px_rgba(0,0,0,0.45)]">
          <div className="flex items-center justify-between border-b border-[var(--midnight-border)] px-5 py-4">
            <div>
              <h2 className="text-lg font-semibold text-[var(--midnight-text)]">
                {title}
              </h2>

              <p className="mt-1 text-sm text-[var(--midnight-muted)]">
                Move and zoom the image, then click OK.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-[var(--midnight-muted)] transition hover:bg-[var(--midnight-code-bg)] hover:text-[var(--midnight-text)]"
              aria-label="Close crop modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="relative h-[420px] bg-black">
            <Cropper
              image={imageUrl}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              cropShape={cropShape}
              showGrid={cropShape === "rect"}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, croppedAreaPixels) =>
                setCroppedPixels(croppedAreaPixels)
              }
            />
          </div>

          <div className="space-y-4 border-t border-[var(--midnight-border)] p-5">
            <div>
              <div className="mb-2 flex items-center justify-between text-xs text-[var(--midnight-soft)]">
                <span>Zoom</span>
                <span>{zoom.toFixed(1)}x</span>
              </div>

              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(event) => setZoom(Number(event.target.value))}
                className="w-full"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                disabled={isCropping}
                onClick={onClose}
                className="rounded-full px-4 py-2 text-sm font-medium text-[var(--midnight-muted)] transition hover:bg-[var(--midnight-code-bg)] hover:text-[var(--midnight-text)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isCropping || !croppedPixels}
                onClick={handleConfirm}
                className="rounded-full bg-[var(--midnight-accent)] px-5 py-2 text-sm font-medium text-[var(--midnight-on-accent)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCropping ? "Cropping..." : "OK"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UpdateButton({
  disabled,
  onClick,
  children = "Update",
}: {
  disabled?: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="shrink-0 rounded-xl bg-[var(--midnight-accent)] px-4 py-3 text-sm font-medium text-[var(--midnight-on-accent)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  );
}

function ProfileInput({
  label,
  value,
  placeholder,
  disabled,
  onChange,
  onUpdate,
}: {
  label: string;
  value: string;
  placeholder?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onUpdate: () => void;
}) {
  return (
    <label className="block">
      <span className="mb-3 block text-sm font-medium text-[var(--midnight-text)]">
        {label}
      </span>

      <div className="flex gap-3">
        <input
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-xl border border-[var(--midnight-border)]/70 bg-[var(--midnight-code-bg)] px-4 py-3 text-sm text-[var(--midnight-text)] outline-none transition placeholder:text-[var(--midnight-soft)] focus:border-[var(--midnight-accent)]/70"
        />

        <UpdateButton disabled={disabled} onClick={onUpdate} />
      </div>
    </label>
  );
}

function ProfileTextarea({
  label,
  value,
  placeholder,
  disabled,
  onChange,
  onUpdate,
}: {
  label: string;
  value: string;
  placeholder?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onUpdate: () => void;
}) {
  return (
    <label className="block">
      <span className="mb-3 block text-sm font-medium text-[var(--midnight-text)]">
        {label}
      </span>

      <div className="flex items-start gap-3">
        <textarea
          value={value}
          placeholder={placeholder}
          rows={5}
          onChange={(event) => onChange(event.target.value)}
          className="w-full resize-none rounded-xl border border-[var(--midnight-border)]/70 bg-[var(--midnight-code-bg)] px-4 py-3 text-sm leading-6 text-[var(--midnight-text)] outline-none transition placeholder:text-[var(--midnight-soft)] focus:border-[var(--midnight-accent)]/70"
        />

        <UpdateButton disabled={disabled} onClick={onUpdate} />
      </div>
    </label>
  );
}

function getImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

async function getCroppedImageBlob(
  imageSrc: string,
  crop: Area,
  mimeType: string
): Promise<Blob> {
  const image = await getImageElement(imageSrc);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not create canvas context");
  }

  canvas.width = crop.width;
  canvas.height = crop.height;

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }

        resolve(blob);
      },
      mimeType || "image/jpeg",
      0.92
    );
  });
}

function buildCroppedFileName(fileName: string) {
  const dotIndex = fileName.lastIndexOf(".");

  if (dotIndex === -1) {
    return `${fileName}-cropped`;
  }

  const name = fileName.slice(0, dotIndex);
  const extension = fileName.slice(dotIndex);

  return `${name}-cropped${extension}`;
}

function getSocialLabel(key: SocialField) {
  const labels: Record<SocialField, string> = {
    x: "X",
    facebook: "Facebook",
    youtube: "YouTube",
    linkedin: "LinkedIn",
    website: "Website",
  };

  return labels[key];
}
