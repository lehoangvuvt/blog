/* eslint-disable @next/next/no-img-element */
import DOMPurify from "isomorphic-dompurify";
import MainLayout from "@/shared/components/layout/main-layout/main-layout";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const res = await fetch(`http://localhost:3001/posts/slug/${slug}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch post");
  }

  const post = await res.json();

  const sanitizedHtmlContent = DOMPurify.sanitize(post.htmlContent ?? "");

  return (
    <MainLayout>
      <main className="mx-auto w-full max-w-4xl px-6 py-12">
        <article className="mx-auto max-w-3xl">
          <header className="mb-10 space-y-5">
            <h1 className="text-5xl leading-tight font-bold tracking-tight text-black">
              {post.title}
            </h1>

            {post.subTitle && (
              <p className="text-xl leading-9 font-light text-neutral-600">
                {post.subTitle}
              </p>
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

          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: HTML is sanitized with DOMPurify before rendering */}
          <section
            className="prose prose-lg prose-neutral max-w-none"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
            dangerouslySetInnerHTML={{ __html: sanitizedHtmlContent }}
          />
        </article>
      </main>
    </MainLayout>
  );
}

export const revalidate = 60;