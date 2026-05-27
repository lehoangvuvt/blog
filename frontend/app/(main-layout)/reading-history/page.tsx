"use client";

import { PostItem } from "@/features/posts/components/post-item";
import PostsContainer from "@/features/posts/components/posts-container";
import { formatTimeAgo, getArticleLink } from "@/shared/utils";
import useMeReadingHistories from "@/features/users/hooks/use-me-reading-histories";
import { useMe } from "@/features/auth/hooks/use-me";
import Loading from "@/shared/components/loading";
import ForbiddenPage from "@/app/forbbiden";

export default function ReadingHistoryPage() {
  const { data: meData, isLoading: isLoadingMe } = useMe();
  const { data: readingHistories, isLoading } = useMeReadingHistories(
    Boolean(meData)
  );

  if (isLoadingMe) {
    return <Loading />;
  }

  if (!meData && !isLoadingMe) {
    return <ForbiddenPage />;
  }

  return (
    <main className="min-h-screen text-[var(--midnight-text)]">
      <section className="mx-auto w-full max-w-3xl px-5 pt-12 md:px-6">
        <header className="border-b border-[var(--midnight-border)]/70 pb-7">
          <h1 className="mt-4 text-5xl font-bold tracking-[-0.06em] text-[var(--midnight-text)]">
            Reading history
          </h1>

          <p className="mt-4 max-w-xl text-[15px] leading-7 text-[var(--midnight-muted)]">
            Letters you recently opened and may want to return to.
          </p>
        </header>
      </section>

      <section className="mx-auto w-full max-w-3xl px-5 md:px-6">
        <PostsContainer hasMore={false} isLoading={false} onLoadMore={() => {}}>
          {isLoading &&
            Array.from({ length: 5 }).map((_, index) => (
              <PostItem.Skeleton
                key={`reading-history-skeleton-${index + 1}`}
              />
            ))}

          {!isLoading && readingHistories && readingHistories?.length > 0 && (
            <div className="divide-y divide-[var(--midnight-border)]/70">
              {readingHistories.map((item) => {
                const post = item.post;
                const articleLink = getArticleLink(post.slug);
                const progress = Math.min(Math.max(item.progress ?? 0, 0), 100);

                const authorName =
                  post.author?.fullName ||
                  post.author?.email ||
                  "Unknown writer";

                const authorLink = post.author?.slug
                  ? `/${post.author.slug}`
                  : "#";

                return (
                  <PostItem.Container key={`${post.id}-${item.readAt}`}>
                    <PostItem.Content>
                      <PostItem.Header>
                        <PostItem.Avatar
                          src={post.author?.avatar ?? ""}
                          alt={authorName}
                        />

                        <PostItem.Author link={authorLink}>
                          {authorName}
                        </PostItem.Author>

                        <PostItem.Dot />

                        <PostItem.Date>
                          Read {formatTimeAgo(item.readAt)}
                        </PostItem.Date>
                      </PostItem.Header>

                      <PostItem.Title link={articleLink}>
                        {post.title}
                      </PostItem.Title>

                      {post.subTitle && (
                        <PostItem.SubTitle>{post.subTitle}</PostItem.SubTitle>
                      )}

                      <PostItem.Footer>
                        <div className="flex w-full flex-col gap-2">
                          <div className="flex items-center justify-between text-xs text-[var(--midnight-muted)]">
                            {progress >= 100 ? (
                              <div className="flex items-center gap-2 text-[var(--midnight-accent)]">
                                <div
                                  className="
                                  flex h-4 w-4 items-center justify-center
                                  rounded-full
                                  bg-[rgba(245,214,140,0.14)]
                                  shadow-[0_0_12px_rgba(245,214,140,0.25)]
                                "
                                >
                                  <svg
                                    viewBox="0 0 24 24"
                                    className="h-2.5 w-2.5 fill-none stroke-current stroke-[3]"
                                  >
                                    <path
                                      d="M5 13l4 4L19 7"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </div>

                                <span className="font-medium tracking-[0.04em]">
                                  Reading completed
                                </span>
                              </div>
                            ) : (
                              <span>Reading progress</span>
                            )}

                            <span>{progress}%</span>
                          </div>

                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--midnight-code-bg)]">
                            <div
                              className={`
                              h-full rounded-full transition-[width] duration-300
                              ${
                                progress >= 100
                                  ? "bg-[linear-gradient(to_right,rgba(212,185,122,1),rgba(245,214,140,1))]"
                                  : "bg-[var(--midnight-accent)]"
                              }
                            `}
                              style={{
                                width: `${progress}%`,
                              }}
                            />
                          </div>
                        </div>
                      </PostItem.Footer>
                    </PostItem.Content>

                    <PostItem.Thumbnail
                      src={post.thumbnailImage ?? ""}
                      alt={post.title}
                      link={articleLink}
                    />
                  </PostItem.Container>
                );
              })}
            </div>
          )}

          {!isLoading && readingHistories?.length === 0 && (
            <div className="pt-12 pb-16">
              <h2 className="text-2xl font-bold tracking-[-0.04em] text-[var(--midnight-text)]">
                No reading history yet.
              </h2>

              <p className="mt-3 max-w-md text-[15px] leading-7 text-[var(--midnight-muted)]">
                Open a few letters and they will quietly gather here.
              </p>
            </div>
          )}
        </PostsContainer>
      </section>
    </main>
  );
}
