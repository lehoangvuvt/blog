/* eslint-disable @next/next/no-img-element */
import { useMe } from "@/features/auth/hooks/use-me";
import useCreatePostCollection from "@/features/post-collections/hooks/use-create-post-collection";
import { useQueryClient } from "@tanstack/react-query";
import { ImagePlus, X } from "lucide-react";
import { useState } from "react";

export default function CreateCollectionModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { data: myInfo } = useMe();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const { mutate: createCollection } = useCreatePostCollection();

  if (!open) return null;

  const handleThumbnailChange = (file?: File) => {
    if (!file) return;
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!myInfo) return;

    createCollection(
      {
        name,
        description,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["post-collections", myInfo.id],
          });

          onClose();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-[3px]">
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-[640px] overflow-hidden rounded-2xl border border-[var(--midnight-border)]/70 bg-[var(--midnight-surface)] shadow-[0_28px_90px_rgba(0,0,0,0.38)]"
      >
        <div className="flex items-center justify-between border-b border-[var(--midnight-border)]/70 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-3 py-1.5 text-sm text-[var(--midnight-muted)] transition hover:bg-[var(--midnight-code-bg)] hover:text-[var(--midnight-text)]"
          >
            Cancel
          </button>

          <p className="text-sm font-medium text-[var(--midnight-muted)]">
            New collection
          </p>

          <button
            type="submit"
            disabled={!name.trim() || !description.trim()}
            className="rounded-full bg-[var(--midnight-accent)] px-4 py-1.5 text-sm font-medium text-[var(--midnight-on-accent)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Create
          </button>
        </div>

        <div className="max-h-[78vh] overflow-y-auto px-8 py-8">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Collection title"
            className="w-full border-none bg-transparent px-0 text-[38px] font-bold leading-tight tracking-[-0.055em] text-[var(--midnight-text)] outline-none placeholder:text-[var(--midnight-soft)]"
            required
            autoFocus
          />

          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What belongs in this collection?"
            rows={3}
            className="mt-4 w-full resize-none border-none bg-transparent px-0 text-xl leading-8 text-[var(--midnight-muted)] outline-none placeholder:text-[var(--midnight-soft)]"
            required
          />

          <div className="mt-7">
            {thumbnailPreview ? (
              <div className="group relative overflow-hidden rounded-2xl border border-[var(--midnight-border)]/70 bg-[var(--midnight-code-bg)]">
                <img
                  src={thumbnailPreview}
                  alt="Collection thumbnail preview"
                  className="h-[240px] w-full object-cover opacity-90 saturate-[0.85]"
                />

                <div className="absolute inset-0 hidden items-center justify-center bg-black/45 backdrop-blur-[2px] group-hover:flex">
                  <label className="cursor-pointer rounded-full bg-[var(--midnight-accent)] px-4 py-2 text-sm font-medium text-[var(--midnight-on-accent)] shadow-sm">
                    Replace image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) =>
                        handleThumbnailChange(event.target.files?.[0])
                      }
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => setThumbnailPreview("")}
                    className="ml-2 rounded-full border border-[var(--midnight-border)]/70 bg-[var(--midnight-surface)] px-4 py-2 text-sm font-medium text-[var(--midnight-text)] shadow-sm transition hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex h-[180px] cursor-pointer items-center justify-center rounded-2xl border border-dashed border-[var(--midnight-border)]/70 bg-[var(--midnight-code-bg)] text-center transition hover:border-[var(--midnight-accent)]/60">
                <div>
                  <ImagePlus className="mx-auto h-5 w-5 text-[var(--midnight-muted)]" />

                  <p className="mt-2 text-sm font-medium text-[var(--midnight-text)]">
                    Add a cover image
                  </p>

                  <p className="mt-1 text-sm text-[var(--midnight-muted)]">
                    Optional, but useful for previews.
                  </p>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) =>
                    handleThumbnailChange(event.target.files?.[0])
                  }
                />
              </label>
            )}
          </div>

          <div className="mt-9 border-t border-[var(--midnight-border)]/70 pt-6">
            <p className="text-xs tracking-[0.14em] text-[var(--midnight-soft)]">
              Preview
            </p>

            <article className="mt-4 border-b border-[var(--midnight-border)]/70 pb-5">
              <h2 className="text-2xl font-bold tracking-[-0.045em] text-[var(--midnight-text)]">
                {name || "Collection title"}
              </h2>

              <p className="mt-2 max-w-xl text-base leading-7 text-[var(--midnight-muted)]">
                {description || "What belongs in this collection?"}
              </p>

              <p className="mt-4 text-sm text-[var(--midnight-soft)]">
                0 letters
              </p>
            </article>
          </div>
        </div>
      </form>

      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 -z-10"
        aria-label="Close modal"
      />
    </div>
  );
}
