"use client";

import { useAppSelector } from "@/store/hooks";
import {
  selectFont,
  selectFontSize,
  selectTheme,
} from "@/features/app-settings/selectors";

type Props = {
  html: string;
};

export function ArticleContent({ html }: Props) {
  const theme = useAppSelector(selectTheme);
  const font = useAppSelector(selectFont);
  const fontSize = useAppSelector(selectFontSize);

  const fontClass =
    font === "serif"
      ? "font-serif"
      : font === "monospace"
      ? "font-mono"
      : "font-sans";

  const sizeClass =
    fontSize === "small"
      ? "text-base prose-base"
      : fontSize === "large"
      ? "text-xl prose-xl"
      : "text-lg prose-lg";

  return (
    <section
      className={`
        prose prose-neutral max-w-none scroll-smooth transition-colors
        ${theme === "dark" ? "prose-invert text-zinc-200" : "text-neutral-800"}
        ${fontClass}
        ${sizeClass}

        [&_*]:font-inherit

        prose-headings:font-serif
        prose-headings:font-semibold
        prose-headings:tracking-[-0.025em]
        prose-headings:text-neutral-950
        dark:prose-headings:text-zinc-100

        prose-h2:mt-14
        prose-h2:mb-5
        prose-h2:text-3xl
        prose-h2:leading-tight

        prose-h3:mt-10
        prose-h3:mb-4
        prose-h3:text-2xl
        prose-h3:leading-tight

        prose-p:my-6
        prose-p:leading-8
        prose-p:text-[inherit]

        prose-a:text-neutral-950
        prose-a:underline
        prose-a:decoration-black/20
        prose-a:underline-offset-4
        hover:prose-a:decoration-black
        dark:prose-a:text-zinc-100
        dark:prose-a:decoration-white/25

        prose-strong:font-semibold
        prose-strong:text-neutral-950
        dark:prose-strong:text-zinc-100

        prose-blockquote:border-l-neutral-300
        prose-blockquote:pl-5
        prose-blockquote:font-serif
        prose-blockquote:text-[inherit]
        prose-blockquote:text-neutral-600
        dark:prose-blockquote:border-l-zinc-700
        dark:prose-blockquote:text-zinc-300

        prose-ul:my-6
        prose-ol:my-6
        prose-li:my-2
        prose-li:text-[inherit]
        prose-li:leading-8

        prose-img:my-10
        prose-img:rounded-xl

        prose-hr:my-12
        prose-hr:border-black/10
        dark:prose-hr:border-white/10

        prose-code:rounded-md
        prose-code:bg-black/[0.04]
        prose-code:px-1.5
        prose-code:py-0.5
        prose-code:text-[0.9em]
        prose-code:font-normal
        prose-code:text-neutral-800
        before:prose-code:content-none
        after:prose-code:content-none
        dark:prose-code:bg-white/10
        dark:prose-code:text-zinc-200

        prose-pre:my-8
        prose-pre:rounded-xl
        prose-pre:bg-neutral-950
        prose-pre:p-5
        prose-pre:text-sm
      `}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized before render
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
