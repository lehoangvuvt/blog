/* eslint-disable @next/next/no-img-element */
import DOMPurify from "isomorphic-dompurify";
import MainLayout from "@/shared/components/layout/main-layout/main-layout";
import Link from "next/link";
import { ArticleContent } from "@/app/(main-layout)/articles/[slug]/components/article-content";
import { CommentsSection } from "@/app/(main-layout)/articles/[slug]/components/comments-section";
import HeadingNavigation, {
  type Heading,
} from "@/app/(main-layout)/articles/[slug]/components/headings";
import type { PostDetails } from "@/features/posts/types";
import { PostsBySameAuthor } from "./components/posts-by-same-author";
import { ArticleToolbar } from "./components/article-toolbar";
import type { Metadata } from "next";

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

  if (!res.ok) {
    throw new Error("Failed to fetch post");
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
    USE_PROFILES: { html: true },
  });

  const readingTime = getReadingTime(sanitizedHtmlContent);
  const { headings, htmlWithIds } = extractHeadings(sanitizedHtmlContent);

  return (
    <MainLayout>
      <main className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 px-6 py-12 xl:grid-cols-[1fr_240px]">
        <article className="mx-auto w-full max-w-3xl">
          <header className="mb-10">
            <div className="space-y-5">
              <h1 className="text-5xl leading-tight font-bold tracking-tight text-black">
                {post.title}
              </h1>

              {post.subTitle && (
                <p className="text-xl leading-9 font-light text-neutral-600">
                  {post.subTitle}
                </p>
              )}
            </div>

            {(post.author || post.tags?.length) && (
              <div className="mt-8 space-y-5 border-t border-black/5 pt-6">
                {post.author && (
                  <div className="flex items-center gap-3">
                    {post.author.avatar ? (
                      <img
                        src={post.author.avatar}
                        alt={post.author.email}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-sm font-medium text-neutral-500">
                        {`${post.author.email
                          .charAt(0)
                          .toUpperCase()}${post.author.email
                            .charAt(1)
                            .toUpperCase()}`}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-x-2 text-sm text-neutral-500">
                      <Link
                        href={`/@${post.author.slug}`}
                        className="font-medium text-neutral-900  hover:underline cursor-pointer"
                      >
                        {post.author.slug}
                      </Link>

                      {post.createdAt && (
                        <>
                          <span>·</span>
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
                        </>
                      )}

                      <span>·</span>
                      <span>{readingTime}</span>
                    </div>
                  </div>
                )}

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-neutral-500">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag.id}
                        href={`/tags/${tag.name}`}
                        className="underline-offset-4 transition-colors hover:text-black hover:underline"
                      >
                        #{tag.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            <ArticleToolbar postId={post.id} />
          </header>

          {post.thumbnailImage && (
            <div className="mb-12 overflow-hidden rounded-3xl border border-black/5">
              <img
                src={post.thumbnailImage}
                alt={post.title}
                className="max-h-[520px] w-full object-cover"
              />
            </div>
          )}

          <ArticleContent html={htmlWithIds} />

          {post.author && <PostsBySameAuthor author={post.author} posts={post.postsByAuthor} />}

          <CommentsSection postId={post.id} />
        </article>

        {headings.length > 0 && <HeadingNavigation headings={headings} />}
      </main>
    </MainLayout>
  );
}

export const revalidate = 60;
