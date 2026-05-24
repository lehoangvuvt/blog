"use client";

import { PostItem } from "@/features/posts/components/post-item";
import { usePosts } from "@/features/posts/hooks/use-posts";
import Loading from "@/shared/components/loading";
import { useParams, useRouter, useSearchParams } from "next/navigation";

const tabs = [
  { label: "Letters", resource: "articles" },
  { label: "Writers", resource: "people" },
  { label: "Topics", resource: "topics" },
];

export default function SearchPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const query = searchParams.get("q") ?? "";
  const resourceType = String(params.resourceType ?? "articles");

  const { data: postsData, isLoading } = usePosts(
    {
      search: query,
      limit: 10,
    },
    resourceType === "articles" && query.length > 0
  );

  const posts = postsData?.pages.flatMap((page) => page.data) ?? [];

  const handleChangeTab = (resource: string) => {
    router.push(`/search/${resource}?q=${encodeURIComponent(query)}`);
  };

  return (
    <main className="min-h-screen bg-[var(--midnight-bg)] text-[var(--midnight-text)]">
      <section className="mx-auto w-full max-w-5xl px-5 py-12 md:px-6">
        <div className="mb-10">
          <p className="text-xs tracking-[0.16em] text-[var(--midnight-soft)]">
            Search results
          </p>

          <h1 className="mt-4 text-5xl font-bold tracking-[-0.06em] text-[var(--midnight-text)]">
            {query}
          </h1>

          {!isLoading && resourceType === "articles" && (
            <p className="mt-4 text-[15px] leading-7 text-[var(--midnight-muted)]">
              {posts.length} {posts.length === 1 ? "letter" : "letters"} found
              in the archive.
            </p>
          )}
        </div>

        <div className="sticky top-16 z-20 border-b border-[var(--midnight-border)]/70 bg-[var(--midnight-bg)]/92 py-3 backdrop-blur-xl">
          <nav className="flex gap-2">
            {tabs.map((tab) => {
              const isActive = resourceType === tab.resource;

              return (
                <button
                  type="button"
                  key={tab.resource}
                  onClick={() => handleChangeTab(tab.resource)}
                  className={`rounded-full border px-4 py-2 text-sm transition-all ${
                    isActive
                      ? "border-[var(--midnight-accent)]/70 bg-[var(--midnight-code-bg)] text-[var(--midnight-text)]"
                      : "border-transparent text-[var(--midnight-muted)] hover:border-[var(--midnight-border)]/70 hover:text-[var(--midnight-text)]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <section className="mt-5">
          {isLoading && <Loading />}

          {!isLoading && resourceType === "articles" && posts.length > 0 && (
            <div className="divide-y divide-[var(--midnight-border)]/70">
              {posts.map((post, index) => (
                <PostItem.Container key={`${post.id}-${index}`}>
                  <PostItem.Content>
                    <PostItem.Header>
                      <PostItem.Author link={`/@${post.author?.slug}`}>
                        {post.author?.slug ?? "Unknown writer"}
                      </PostItem.Author>

                      <PostItem.Dot />

                      <PostItem.Date>
                        {new Date(post.postedDate).toLocaleDateString("en", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </PostItem.Date>
                    </PostItem.Header>

                    <PostItem.Title link={`/articles/${post.slug}`}>
                      {post.title}
                    </PostItem.Title>

                    {post.subTitle && (
                      <PostItem.SubTitle>{post.subTitle}</PostItem.SubTitle>
                    )}
                  </PostItem.Content>

                  <PostItem.Thumbnail
                    src={post.thumbnailImage ?? ""}
                    alt={post.title}
                    link={`/articles/${post.slug}`}
                  />
                </PostItem.Container>
              ))}
            </div>
          )}

          {!isLoading && resourceType === "articles" && posts.length === 0 && (
            <div className="pt-10 pb-16">
              <p className="text-2xl font-bold tracking-[-0.04em] text-[var(--midnight-text)]">
                Nothing surfaced.
              </p>

              <p className="mt-3 max-w-md text-[15px] leading-7 text-[var(--midnight-muted)]">
                No letters matched “{query}”.
              </p>
            </div>
          )}

          {!isLoading && resourceType !== "articles" && (
            <div className="py-14">
              <p className="text-2xl font-bold tracking-[-0.04em] text-[var(--midnight-text)]">
                This room is not open yet.
              </p>

              <p className="mt-3 max-w-md text-[15px] leading-7 text-[var(--midnight-muted)]">
                Search for {resourceType} is not connected yet.
              </p>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
