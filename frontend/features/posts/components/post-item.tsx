/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import {
  selectFont,
  selectFontSize,
  selectTheme,
} from "@/features/app-settings/selectors";

function usePostThemeClasses() {
  const theme = useAppSelector(selectTheme);
  const font = useAppSelector(selectFont);
  const fontSize = useAppSelector(selectFontSize);
  const isDark = theme === "dark";

  return {
    fontClass:
      font === "serif"
        ? "font-serif"
        : font === "monospace"
        ? "font-mono"
        : "font-sans",

    titleSize:
      fontSize === "small"
        ? "text-xl"
        : fontSize === "large"
        ? "text-3xl"
        : "text-2xl",

    subtitleSize:
      fontSize === "small"
        ? "text-sm"
        : fontSize === "large"
        ? "text-lg"
        : "text-base",

    borderClass: isDark ? "border-white/10" : "border-black/10",
    titleClass: isDark ? "text-zinc-100" : "text-neutral-950",
    mutedClass: isDark ? "text-zinc-400" : "text-neutral-600",
    softMutedClass: isDark ? "text-zinc-500" : "text-neutral-400",
    imageBgClass: isDark ? "bg-white/5" : "bg-black/[0.04]",
    skeletonClass: isDark ? "bg-white/10" : "bg-black/10",
    skeletonSoftClass: isDark ? "bg-white/5" : "bg-black/5",
  };
}

export const PostItem = {
  Container({ children }: { children: React.ReactNode }) {
    const styles = usePostThemeClasses();

    return (
      <article
        className={`
            border-b py-8 article-content 
            ${styles.borderClass}
            ${styles.fontClass}
          `}
      >
        <div className="grid gap-5 md:grid-cols-[1fr_112px]">{children}</div>
      </article>
    );
  },

  Content({ children }: { children: React.ReactNode }) {
    return <div className="min-w-0">{children}</div>;
  },

  Header({ children }: { children: React.ReactNode }) {
    const styles = usePostThemeClasses();

    return (
      <div
        className={`mb-3 flex flex-wrap items-center gap-2 text-sm ${styles.mutedClass}`}
      >
        {children}
      </div>
    );
  },

  Author({ children, link }: { children: React.ReactNode; link: string }) {
    const styles = usePostThemeClasses();

    return (
      <Link
        href={link}
        className={`font-medium hover:underline ${styles.titleClass}`}
      >
        {children}
      </Link>
    );
  },

  Dot() {
    const styles = usePostThemeClasses();
    return <span className={styles.softMutedClass}>·</span>;
  },

  Date({ children }: { children: React.ReactNode }) {
    return <span>{children}</span>;
  },

  Title({ children, link }: { children: React.ReactNode; link: string }) {
    const styles = usePostThemeClasses();

    return (
      <Link
        href={link}
        className={`
            block max-w-2xl line-clamp-2
            font-serif font-semibold leading-snug
            tracking-[-0.02em] hover:underline
            ${styles.titleSize}
            ${styles.titleClass}
          `}
      >
        <h3>{children}</h3>
      </Link>
    );
  },

  SubTitle({ children }: { children: React.ReactNode }) {
    const styles = usePostThemeClasses();

    return (
      <p
        className={`
            mt-2 max-w-2xl line-clamp-2 leading-relaxed
            ${styles.subtitleSize}
            ${styles.mutedClass}
          `}
      >
        {children}
      </p>
    );
  },

  Footer({ children }: { children?: React.ReactNode }) {
    const styles = usePostThemeClasses();

    return (
      <div
        className={`mt-4 flex items-center gap-2 text-sm ${styles.softMutedClass}`}
      >
        {children}
      </div>
    );
  },

  Avatar({ src, alt }: { src?: string; alt: string }) {
    if (!src) return null;

    return (
      <img src={src} alt={alt} className="h-5 w-5 rounded-full object-cover" />
    );
  },

  Thumbnail({ src, alt, link }: { src?: string; alt: string; link?: string }) {
    const styles = usePostThemeClasses();

    if (!src) return <div className="hidden md:block" />;

    const image = (
      <div
        className={`aspect-square overflow-hidden rounded-md ${styles.imageBgClass}`}
      >
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      </div>
    );

    if (!link) return image;

    return (
      <Link href={link} className="hidden md:block">
        {image}
      </Link>
    );
  },

  Skeleton() {
    const styles = usePostThemeClasses();

    return (
      <article
        className={`article-content animate-pulse border-b py-8 ${styles.borderClass}`}
      >
        <div className="grid gap-5 md:grid-cols-[1fr_112px]">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className={`h-5 w-5 rounded-full ${styles.skeletonClass}`} />
              <div className={`h-4 w-24 rounded ${styles.skeletonClass}`} />
              <div className={`h-1 w-1 rounded-full ${styles.skeletonClass}`} />
              <div className={`h-4 w-20 rounded ${styles.skeletonClass}`} />
            </div>

            <div className="space-y-2">
              <div className={`h-7 w-[85%] rounded ${styles.skeletonClass}`} />
              <div className={`h-7 w-[55%] rounded ${styles.skeletonClass}`} />
            </div>

            <div className="mt-3 space-y-2">
              <div
                className={`h-4 w-full rounded ${styles.skeletonSoftClass}`}
              />
              <div
                className={`h-4 w-[75%] rounded ${styles.skeletonSoftClass}`}
              />
            </div>
          </div>

          <div
            className={`hidden aspect-square rounded-md md:block ${styles.skeletonClass}`}
          />
        </div>
      </article>
    );
  },
};
