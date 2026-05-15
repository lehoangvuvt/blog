/* eslint-disable @next/next/no-img-element */
"use client";

import { useAppSelector } from "@/store/hooks";
import {
  selectFont,
  selectFontSize,
  selectTheme,
} from "@/features/app-settings/selectors";
import Link from "next/link";

function usePostThemeClasses() {
  const theme = useAppSelector(selectTheme);
  const font = useAppSelector(selectFont);
  const fontSize = useAppSelector(selectFontSize);
  const isDark = theme === "dark";

  return {
    isDark,
    titleSize:
      fontSize === "small"
        ? "text-lg"
        : fontSize === "large"
          ? "text-2xl"
          : "text-xl",

    subtitleSize:
      fontSize === "small"
        ? "text-sm"
        : fontSize === "large"
          ? "text-lg"
          : "text-base",

    metaSize:
      fontSize === "small"
        ? "text-xs"
        : fontSize === "large"
          ? "text-base"
          : "text-sm",

    fontClass:
      font === "serif"
        ? "font-serif"
        : font === "monospace"
          ? "font-mono"
          : "font-sans",
    sizeClass:
      fontSize === "small"
        ? "text-sm"
        : fontSize === "large"
          ? "text-lg"
          : "text-base",

    borderClass: isDark ? "border-white/10" : "border-black/10",
    titleClass: isDark ? "text-white" : "text-[#242424]",
    mutedClass: isDark ? "text-zinc-400" : "text-black/60",
    softMutedClass: isDark ? "text-zinc-500" : "text-black/40",
    thumbnailBgClass: isDark ? "bg-white/10" : "bg-black/5",
    skeletonClass: isDark ? "bg-white/10" : "bg-black/10",
    skeletonSoftClass: isDark ? "bg-white/5" : "bg-black/5",
  };
}

export const PostItem = {
  Container({ children }: { children: React.ReactNode }) {
    const styles = usePostThemeClasses();

    return (
      <article
        className={`group border-b py-8 transition-colors ${styles.borderClass} ${styles.fontClass} ${styles.sizeClass}`}
      >
        <div className="flex gap-6">{children}</div>
      </article>
    );
  },

  Content({ children }: { children: React.ReactNode }) {
    return <div className="min-w-0 flex-1">{children}</div>;
  },

  Header({ children }: { children: React.ReactNode }) {
    const styles = usePostThemeClasses();

    return (
      <div
        className={`mb-3 flex items-center gap-2 ${styles.metaSize} ${styles.mutedClass}`}
      >
        {children}
      </div>
    );
  },

  Author({ children }: { children: React.ReactNode }) {
    const styles = usePostThemeClasses();

    return (
      <span className={`font-medium ${styles.titleClass}`}>{children}</span>
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
        className={`line-clamp-2 cursor-pointer font-semibold tracking-tight group-hover:underline ${styles.titleSize} ${styles.titleClass}`}
      >
        {children}
      </Link>
    );
  },

  SubTitle({ children }: { children: React.ReactNode }) {
    const styles = usePostThemeClasses();

    return (
      <p
        className={`mt-2 line-clamp-2 leading-relaxed ${styles.subtitleSize} ${styles.mutedClass}`}
      >
        {children}
      </p>
    );
  },

  Thumbnail({ src, alt }: { src: string; alt: string }) {
    const styles = usePostThemeClasses();

    if (!src) return null;

    return (
      <div
        className={`h-24 w-32 shrink-0 overflow-hidden md:h-32 md:w-44 ${styles.thumbnailBgClass}`}
      >
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
    );
  },

  Skeleton() {
    const styles = usePostThemeClasses();

    return (
      <article
        className={`animate-pulse border-b py-8 ${styles.borderClass} ${styles.fontClass} ${styles.sizeClass}`}
      >
        <div className="flex gap-6 w-full">
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex items-center gap-2">
              <div
                className={`h-4 w-4xl rounded-full ${styles.skeletonClass}`}
              />
              <div className={`h-1 w-1 rounded-full ${styles.skeletonClass}`} />
              <div
                className={`h-4 w-20 rounded-full ${styles.skeletonClass}`}
              />
            </div>

            <div className="space-y-2">
              <div className={`h-6 w-[85%] rounded ${styles.skeletonClass}`} />
              <div className={`h-6 w-[60%] rounded ${styles.skeletonClass}`} />
            </div>

            <div className="mt-4 space-y-2">
              <div
                className={`h-4 w-full rounded ${styles.skeletonSoftClass}`}
              />
              <div
                className={`h-4 w-[90%] rounded ${styles.skeletonSoftClass}`}
              />
            </div>
          </div>

          <div
            className={`h-24 w-32 shrink-0 rounded md:h-32 md:w-44 ${styles.skeletonClass}`}
          />
        </div>
      </article>
    );
  },
};
