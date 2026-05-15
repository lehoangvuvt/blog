/* eslint-disable @next/next/no-img-element */
import DOMPurify from "isomorphic-dompurify";
import MainLayout from "@/shared/components/layout/main-layout/main-layout";
import Link from "next/link";
import { ArticleContent } from "./article-content";
import { CommentsSection } from "./comments-section";

type Author = {
  id: string;
  email: string;
  avatar?: string;
};

type Tag = {
  id: string;
  name: string;
};

type Post = {
  title: string;
  subTitle?: string;
  htmlContent?: string;
  thumbnailImage?: string;
  createdAt?: string;
  author?: Author;
  tags?: Tag[];
};

type Heading = {
  id: string;
  text: string;
  level: number;
};

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

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/posts/slug/${slug}`,
    {
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch post");
  }

  const post: Post = await res.json();

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
                        {post.author.email.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-x-2 text-sm text-neutral-500">
                      <span className="font-medium text-neutral-900">
                        {post.author.email}
                      </span>

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

          <CommentsSection
            postId={slug}

          />
        </article>

        {headings.length > 0 && (
          <aside className="hidden xl:block">
            <div className="sticky top-24 border-l border-black/5 pl-5">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-400">
                On this page
              </p>

              <nav className="space-y-2">
                {headings.map((heading) => (
                  <a
                    key={heading.id}
                    href={`#${heading.id}`}
                    className={`block text-sm leading-6 text-neutral-500 transition-colors duration-300 hover:text-black ${heading.level === 3 ? "pl-4" : ""
                      } ${heading.level >= 4 ? "pl-8" : ""}`}
                  >
                    {heading.text}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        )}
      </main>
    </MainLayout>
  );
}

export const revalidate = 60;