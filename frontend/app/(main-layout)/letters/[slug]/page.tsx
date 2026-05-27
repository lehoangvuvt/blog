/* eslint-disable @next/next/no-img-element */
import sanitizeHtml from "sanitize-html";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { MoonStar } from "lucide-react";

import { ArticleContent } from "@/app/(main-layout)/letters/[slug]/components/article-content";
import HeadingNavigation, {
  type Heading,
} from "@/app/(main-layout)/letters/[slug]/components/headings";

import type { PostDetails } from "@/features/posts/types";
import { PostsBySameAuthor } from "./components/posts-by-same-author";
import { ArticleToolbar } from "./components/article-toolbar";
import { BackButton } from "@/shared/components/back-button";
import ViewHandler from "./components/view-handler";
import FollowSubjectsSidebar from "./components/follow-subjects-sidebar";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/<[^>]+>/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function getReadingTime(html: string) {
  const text = html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const words = text.split(" ").filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 250));

  return `${minutes} min read`;
}

function extractHeadings(html: string) {
  const headings: Heading[] = [];
  const usedIds = new Map<string, number>();

  const htmlWithIds = html.replace(
    /<h([2-4])([^>]*)>(.*?)<\/h\1>/gi,
    (_, level, attrs, content) => {
      const text = content
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim();

      if (!text) return `<h${level}${attrs}>${content}</h${level}>`;

      const baseId = slugify(text);
      const count = usedIds.get(baseId) ?? 0;

      usedIds.set(baseId, count + 1);

      const id = count === 0 ? baseId : `${baseId}-${count + 1}`;

      headings.push({
        id,
        text,
        level: Number(level),
      });

      const cleanAttrs = attrs.replace(/\s?id=(["']).*?\1/g, "");

      return `<h${level}${cleanAttrs} id="${id}">${content}</h${level}>`;
    }
  );

  return {
    headings,
    htmlWithIds,
  };
}

async function getPost(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/posts/${slug}`,
    {
      next: { revalidate: 60 },
    }
  );

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    const text = await res.text();
    console.error("Failed to fetch post:", res.status, text);
    throw new Error(`Failed to fetch post: ${res.status}`);
  }

  return res.json() as Promise<PostDetails>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: "Letter Not Found",
      description: "This letter could not be found.",
    };
  }

  const title = post.title;
  const description = post.subTitle ?? "Read this article.";
  const image = post.thumbnailImage ?? "/default-og-image.png";
  const url = `https://themidnightletters.com/letters/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5 text-[var(--midnight-text)]">
        <section className="mx-auto max-w-2xl text-center">
          <p className="text-xs tracking-[0.18em] text-[var(--midnight-soft)]">
            LETTER NOT FOUND
          </p>

          <h1 className="mt-4 text-5xl font-bold tracking-[-0.07em] md:text-7xl">
            This letter vanished
          </h1>

          <p className="mt-6 text-lg leading-8 text-[var(--midnight-muted)]">
            The letter you are looking for may have been removed, renamed,
            unpublished, or perhaps never existed in the first place.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="rounded-full border border-[var(--midnight-border)]/70 px-5 py-2.5 text-sm font-medium transition hover:border-[var(--midnight-accent)]/70 hover:text-[var(--midnight-text)]"
            >
              Return home
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const sanitizedHtmlContent = sanitizeHtml(post.htmlContent ?? "", {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "img",
      "h1",
      "h2",
      "h3",
      "h4",
      "span",
      "pre",
      "code",
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "title", "width", "height", "loading"],
      a: ["href", "name", "target", "rel"],
      h1: ["id"],
      h2: ["id"],
      h3: ["id"],
      h4: ["id"],
      span: ["class"],
      code: ["class"],
      pre: ["class"],
    },
    allowedSchemes: ["http", "https", "mailto"],
  });

  const readingTime = getReadingTime(sanitizedHtmlContent);
  const { headings, htmlWithIds } = extractHeadings(sanitizedHtmlContent);

  const tagNames = post.tags?.map((tag) => tag.name).filter(Boolean) ?? [];
  const suggestedTags = post.tags?.slice(0, 6) ?? [];

  return (
    <main className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-16 px-5 py-12 text-[var(--midnight-text)] md:py-16 xl:grid-cols-[220px_minmax(0,1fr)_220px]">
      <ViewHandler postId={post.id} />

      <FollowSubjectsSidebar tags={suggestedTags} />

      <article className="article-content mx-auto w-full max-w-3xl">
        <header className="mb-14">
          <div className="mb-10">
            <BackButton />
          </div>

          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-[var(--midnight-border)]/70 bg-[var(--midnight-code-bg)] px-4 py-2 text-xs tracking-[0.14em] text-[var(--midnight-soft)]">
            <MoonStar className="h-3.5 w-3.5 text-[var(--midnight-accent)]/80" />
            <span>{tagNames.length > 0 ? tagNames.join(" / ") : "Letter"}</span>
            <span className="h-px w-8 bg-[var(--midnight-accent)]/50" />
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl font-bold leading-[1.04] tracking-[-0.055em] text-[var(--midnight-text)] md:text-6xl">
              {post.title}
            </h1>

            {post.subTitle && (
              <p className="max-w-2xl text-xl leading-9 tracking-[-0.02em] text-[var(--midnight-muted)] md:text-2xl">
                {post.subTitle}
              </p>
            )}
          </div>

          {(post.author || post.tags?.length) && (
            <div className="midnight-panel mt-10 rounded-2xl p-5">
              {post.author && (
                <div className="flex items-center gap-4">
                  {post.author.avatar ? (
                    <img
                      src={post.author.avatar}
                      alt={post.author.email}
                      className="h-11 w-11 rounded-full border border-[var(--midnight-border)] object-cover opacity-95"
                    />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--midnight-border)] bg-[var(--midnight-code-bg)] text-sm font-medium text-[var(--midnight-accent)]">
                      {`${post.author.email
                        .charAt(0)
                        .toUpperCase()}${post.author.email
                        .charAt(1)
                        .toUpperCase()}`}
                    </div>
                  )}

                  <div>
                    <Link
                      href={`/${post.author.slug}`}
                      className="text-[15px] font-medium text-[var(--midnight-text)] transition-colors hover:text-[var(--midnight-accent-hover)] hover:underline"
                    >
                      {post.author.fullName}
                    </Link>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-[var(--midnight-muted)]">
                      {post.createdAt && (
                        <span>
                          {new Date(post.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </span>
                      )}

                      <span>&middot;</span>
                      <span>{readingTime}</span>
                      <span>&middot;</span>
                      <span>written after hours</span>
                    </div>
                  </div>
                </div>
              )}

              {post.tags && post.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag.id}
                      href={`/subjects/${tag.slug}`}
                      className="rounded-full border border-[var(--midnight-border)]/70 bg-[var(--midnight-code-bg)] px-3 py-1 text-sm text-[var(--midnight-muted)] transition-colors hover:border-[var(--midnight-accent)]/70 hover:text-[var(--midnight-accent-hover)]"
                    >
                      {tag.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="mt-8">
            <ArticleToolbar postId={post.id} />
          </div>
        </header>

        {post.thumbnailImage && (
          <div className="mb-16 overflow-hidden rounded-[1.5rem] border border-[var(--midnight-border)]/70 bg-[var(--midnight-surface)] shadow-[0_28px_90px_rgba(0,0,0,0.24)]">
            <div className="relative aspect-video w-full">
              <Image
                src={post.thumbnailImage}
                alt={post.title}
                fill
                className="object-cover opacity-90 saturate-[0.82]"
                priority
                sizes="(max-width: 768px) 100vw, 1200px"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(9,11,15,0.56)] via-transparent to-transparent" />
            </div>
          </div>
        )}

        <div className="relative overflow-visible">
          <ArticleContent html={htmlWithIds} postId={post.id} />
        </div>

        {post.author && (
          <div className="mt-24">
            <PostsBySameAuthor
              author={post.author}
              posts={post.postsByAuthor}
            />
          </div>
        )}
      </article>

      {/* {headings.length > 0 && (
        <div className="hidden xl:block">
          <div className="sticky top-28">
            <HeadingNavigation headings={headings} />
          </div>
        </div>
      )} */}
    </main>
  );
}

export const revalidate = 60;
