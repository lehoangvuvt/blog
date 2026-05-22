/* eslint-disable @next/next/no-img-element */
import { useMe } from "@/features/auth/hooks/use-me";
import useCreatePostCollection from "@/features/post-collections/hooks/use-create-post-collection";
import { useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Upload, X } from "lucide-react";
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
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const { mutate: createCollection } = useCreatePostCollection();

  if (!open) return null;

  const handleThumbnailChange = (file?: File) => {
    if (!file) return;

    setThumbnailFile(file);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 px-4">
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-[640px] rounded-xl bg-white shadow-[0_16px_60px_rgba(0,0,0,0.14)]"
      >
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-neutral-500 hover:text-neutral-950"
          >
            Cancel
          </button>

          <p className="text-sm font-medium text-neutral-700">New collection</p>

          <button
            type="submit"
            disabled={!name.trim() || !description.trim()}
            className="rounded-full bg-[#ff6719] px-4 py-1.5 text-sm font-medium text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            Create
          </button>
        </div>

        <div className="max-h-[78vh] overflow-y-auto px-8 py-8">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Collection title"
            className="w-full border-none bg-transparent px-0 text-[38px] font-semibold leading-tight tracking-[-0.04em] text-neutral-950 outline-none placeholder:text-neutral-300"
            required
            autoFocus
          />

          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What is this collection about?"
            rows={3}
            className="mt-4 w-full resize-none border-none bg-transparent px-0 text-xl leading-8 text-neutral-600 outline-none placeholder:text-neutral-300"
            required
          />

          <div className="mt-7">
            {thumbnailPreview ? (
              <div className="group relative overflow-hidden rounded-md border border-neutral-200">
                <img
                  src={thumbnailPreview}
                  alt="Collection thumbnail preview"
                  className="h-[240px] w-full object-cover"
                />

                <div className="absolute inset-0 hidden items-center justify-center bg-black/30 group-hover:flex">
                  <label className="cursor-pointer rounded-full bg-white px-4 py-2 text-sm font-medium text-neutral-950 shadow-sm">
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
                    onClick={() => {
                      setThumbnailFile(null);
                      setThumbnailPreview("");
                    }}
                    className="ml-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-neutral-950 shadow-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex h-[180px] cursor-pointer items-center justify-center rounded-md border border-dashed border-neutral-300 bg-[#f8f6f1] text-center transition hover:bg-neutral-100">
                <div>
                  <ImagePlus className="mx-auto h-5 w-5 text-neutral-400" />

                  <p className="mt-2 text-sm font-medium text-neutral-700">
                    Add a cover image
                  </p>

                  <p className="mt-1 text-sm text-neutral-400">
                    Optional, but useful for previews
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

          <div className="mt-9 border-t border-neutral-200 pt-6">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
              Preview
            </p>

            <article className="article-content mt-4 border-b border-neutral-200 pb-5">
              <h2 className="text-2xl font-semibold tracking-tight text-neutral-950">
                {name || "Collection title"}
              </h2>

              <p className="mt-2 max-w-xl text-base leading-7 text-neutral-600">
                {description || "What is this collection about?"}
              </p>

              <p className="mt-4 text-sm text-neutral-400">0 articles</p>
            </article>
          </div>
        </div>
      </form>
    </div>
  );
}
