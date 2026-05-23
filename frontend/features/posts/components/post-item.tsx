/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import Image from "next/image";
import { useAppSelector } from "@/store/hooks";
import { selectFont, selectFontSize } from "@/features/app-settings/selectors";

function usePostThemeClasses() {
  const font = useAppSelector(selectFont);
  const fontSize = useAppSelector(selectFontSize);

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

    borderClass: "border-[var(--midnight-border)]/70",
    titleClass: "text-[var(--midnight-text)]",
    mutedClass: "text-[var(--midnight-muted)]",
    softMutedClass: "text-[var(--midnight-soft)]",
    imageBgClass: "bg-[var(--midnight-code-bg)]",
    skeletonClass: "bg-[var(--midnight-code-bg)]",
    skeletonSoftClass: "bg-[var(--midnight-border)]/70",
  };
}

export const PostItem = {
  Container({ children }: { children: React.ReactNode }) {
    const styles = usePostThemeClasses();

    return (
      <article
        className={`
          group border-b px-0 py-8 transition-colors duration-300
          hover:bg-[rgba(21,25,34,0.45)]
          md:px-4
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
        className={`font-medium transition-colors duration-300 hover:text-[var(--midnight-accent-hover)] ${styles.titleClass}`}
      >
        {children}
      </Link>
    );
  },

  Dot() {
    const styles = usePostThemeClasses();

    return <span className={styles.softMutedClass}>&middot;</span>;
  },

  Date({ children }: { children: React.ReactNode }) {
    const styles = usePostThemeClasses();

    return <span className={styles.softMutedClass}>{children}</span>;
  },

  Title({ children, link }: { children: React.ReactNode; link: string }) {
    const styles = usePostThemeClasses();

    return (
      <Link
        href={link}
        className={`
          block max-w-2xl line-clamp-2
          font-semibold leading-snug tracking-[-0.035em]
          transition-colors duration-300
          hover:text-[var(--midnight-accent-hover)]
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
      <img
        src={src}
        alt={alt}
        className="h-5 w-5 rounded-full object-cover opacity-90 ring-1 ring-[var(--midnight-border)]"
      />
    );
  },

  Thumbnail({ src, alt, link }: { src?: string; alt: string; link?: string }) {
    const styles = usePostThemeClasses();

    if (!src) return <div className="hidden md:block" />;

    const image = (
      <div
        className={`
          relative aspect-square w-full overflow-hidden rounded-2xl
          border border-[var(--midnight-border)]/70
          ${styles.imageBgClass}
        `}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover opacity-85 saturate-[0.85] transition duration-500 group-hover:opacity-95 group-hover:saturate-100"
          sizes="(max-width: 768px) 100vw, 400px"
        />
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
        className={`animate-pulse border-b px-0 py-8 md:px-4 ${styles.borderClass}`}
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
            className={`hidden aspect-square rounded-2xl md:block ${styles.skeletonClass}`}
          />
        </div>
      </article>
    );
  },
};
