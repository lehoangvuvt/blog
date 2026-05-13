"use client";

import type { Editor } from "@tiptap/react";

type Props = {
  editor: Editor;
};

export function Toolbar({ editor }: Props) {
  return (
    <div
      className="sticky top-0 z-10
        flex flex-wrap gap-2
        border-b bg-white p-3
"
    >
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className="rounded-lg border px-3 py-1"
      >
        Bold
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className="rounded-lg border px-3 py-1"
      >
        Italic
      </button>

      <button
        type="button"
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleHeading({
              level: 1,
            })
            .run()
        }
        className="rounded-lg border px-3 py-1"
      >
        H1
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className="rounded-lg border px-3 py-1"
      >
        List
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className="rounded-lg border px-3 py-1"
      >
        Quote
      </button>

      <button
        type="button"
        onClick={() => {
          const url = window.prompt("Enter URL");

          if (!url) {
            return;
          }

          editor
            .chain()
            .focus()
            .setLink({
              href: url,
            })
            .run();
        }}
        className="rounded-lg border px-3 py-1"
      >
        Link
      </button>
    </div>
  );
}
