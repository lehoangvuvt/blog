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
        font === "serif" ? "font-serif" : font === "monospace" ? "font-mono" : "font-sans";

    const sizeClass =
        fontSize === "small"
            ? "text-base prose-base"
            : fontSize === "large"
                ? "text-xl prose-xl"
                : "text-lg prose-lg";

    return (
        <section
            className={`
        prose max-w-none scroll-smooth transition-colors
        ${theme === "dark" ? "prose-invert prose-neutral text-zinc-200" : "prose-neutral text-neutral-800"}
        ${fontClass}
        ${sizeClass}

        [&_*]:font-inherit
        [&_p]:text-[inherit]
        [&_li]:text-[inherit]
        [&_blockquote]:text-[inherit]

        prose-headings:font-semibold
        prose-p:leading-8
        prose-img:rounded-2xl
        prose-pre:rounded-2xl
      `}
            // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}