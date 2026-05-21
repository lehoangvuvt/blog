/* eslint-disable @next/next/no-img-element */
import DOMPurify from "isomorphic-dompurify";
import type { Metadata } from "next";
import Link from "next/link";

import MainLayout from "@/shared/components/layout/main-layout/main-layout";

import { ArticleContent } from "@/app/(main-layout)/articles/[slug]/components/article-content";
import HeadingNavigation, {
  type Heading,
} from "@/app/(main-layout)/articles/[slug]/components/headings";

import type { PostDetails } from "@/features/posts/types";

import { PostsBySameAuthor } from "./components/posts-by-same-author";
import { ArticleToolbar } from "./components/article-toolbar";
import { BackButton } from "@/shared/components/back-button";
import ViewHandler from "./components/view-handler";
import { notFound } from "next/navigation";

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

      if (!text) {
        return `<h${level}${attrs}>${content}</h${level}>`;
      }

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
    notFound();
  }

  if (!res.ok) {
    const text = await res.text();
    console.error('Failed to fetch post:', res.status, text);
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

  const title = post.title;

  const description = post.subTitle ?? "Read this article.";

  const image = post.thumbnailImage ?? "/default-og-image.png";

  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/articles/${slug}`;

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

  const sanitizedHtmlContent = DOMPurify.sanitize(post.htmlContent ?? "", {
    USE_PROFILES: {
      html: true,
    },
  });

  const readingTime = getReadingTime(sanitizedHtmlContent);

  const { headings, htmlWithIds } = extractHeadings(sanitizedHtmlContent);

  return (
    <MainLayout>
      <ViewHandler postId={post.id} />
      <main className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-20 px-5 py-14 xl:grid-cols-[minmax(0,1fr)_220px]">
        <article className="mx-auto w-full max-w-3xl">
          <header className="mb-14">
            <div className="mb-8">
              <BackButton />
            </div>

            <div className="space-y-6">
              <h1 className="font-serif text-5xl leading-[1.08] font-semibold tracking-[-0.04em] text-black">
                {post.title}
              </h1>

              {post.subTitle && (
                <p className="max-w-2xl text-xl leading-9 text-black/60">
                  {post.subTitle}
                </p>
              )}
            </div>

            {(post.author || post.tags?.length) && (
              <div className="mt-10 border-t border-black/5 pt-6">
                {post.author && (
                  <div className="flex items-center gap-4">
                    {post.author.avatar ? (
                      <img
                        src={post.author.avatar}
                        alt={post.author.email}
                        className="h-11 w-11 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/[0.04] text-sm font-medium text-black/50">
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
                        className="text-[15px] font-medium text-black hover:underline"
                      >
                        {post.author.slug}
                      </Link>

                      <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-black/45">
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

                        <span>·</span>

                        <span>{readingTime}</span>
                      </div>
                    </div>
                  </div>
                )}

                {post.tags && post.tags.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag.id}
                        href={`/tags/${tag.name}`}
                        className="
                          rounded-full border border-black/10
                          px-3 py-1 text-sm text-black/55
                          transition-colors hover:border-black/20 hover:text-black
                        "
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
            <div className="mb-14 overflow-hidden rounded-2xl bg-black/[0.03]">
              <img
                src={post.thumbnailImage}
                alt={post.title}
                className="w-full object-cover"
              />
            </div>
          )}

          <ArticleContent html={htmlWithIds} />

          {post.author && (
            <div className="mt-24">
              <PostsBySameAuthor
                author={post.author}
                posts={post.postsByAuthor}
              />
            </div>
          )}
        </article>

        {headings.length > 0 && (
          <div className="hidden xl:block">
            <div className="sticky top-28">
              <HeadingNavigation headings={headings} />
            </div>
          </div>
        )}
      </main>
    </MainLayout>
  );
}

export const revalidate = 60;
