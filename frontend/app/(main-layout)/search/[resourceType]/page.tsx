"use client";

import { useMemo } from "react";
import { Hash } from "lucide-react";
import { PostItem } from "@/features/posts/components/post-item";
import { usePosts } from "@/features/posts/hooks/use-posts";
import { useTags } from "@/features/tags/hooks/use-tags";
import { useParams, useRouter, useSearchParams } from "next/navigation";

const tabs = [
  { label: "Letters", resource: "letters" },
  { label: "Subjects", resource: "subjects" },
];

export default function SearchPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const query = searchParams.get("q") ?? "";
  const resourceType = String(params.resourceType ?? "letters");
  const shouldSearch = query.trim().length > 0;

  const { data: postsData, isLoading: isLoadingPosts } = usePosts(
    {
      search: query,
      limit: 10,
    },
    resourceType === "letters" && shouldSearch
  );

  const { data: subjectsData, isLoading: isLoadingSubjects } = useTags(
    {
      search: query,
      limit: 10,
    },
    resourceType === "subjects" && shouldSearch
  );

  const posts = useMemo(() => {
    return postsData?.pages.flatMap((page) => page.data) ?? [];
  }, [postsData]);

  const subjects = useMemo(() => {
    return subjectsData?.pages.flatMap((page) => page.data) ?? [];
  }, [subjectsData]);

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
            {query || "Search"}
          </h1>

          {!isLoadingPosts && resourceType === "letters" && shouldSearch && (
            <p className="mt-4 text-[15px] leading-7 text-[var(--midnight-muted)]">
              {posts.length} {posts.length === 1 ? "letter" : "letters"} found
              in the archive.
            </p>
          )}

          {!isLoadingSubjects &&
            resourceType === "subjects" &&
            shouldSearch && (
              <p className="mt-4 text-[15px] leading-7 text-[var(--midnight-muted)]">
                {subjects.length}{" "}
                {subjects.length === 1 ? "subject" : "subjects"} found in the
                archive.
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
          {isLoadingPosts && resourceType === "letters" && (
            <div className="divide-y divide-[var(--midnight-border)]/70">
              {Array.from({ length: 5 }).map((_, index) => (
                <PostItem.Skeleton key={`post-search-skeleton-${index + 1}`} />
              ))}
            </div>
          )}

          {isLoadingSubjects && resourceType === "subjects" && (
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <SubjectSkeleton key={`subject-search-skeleton-${index + 1}`} />
              ))}
            </div>
          )}

          {!isLoadingPosts &&
            resourceType === "letters" &&
            posts.length > 0 && (
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

                      <PostItem.Title link={`/letters/${post.slug}`}>
                        {post.title}
                      </PostItem.Title>

                      {post.subTitle && (
                        <PostItem.SubTitle>{post.subTitle}</PostItem.SubTitle>
                      )}
                    </PostItem.Content>

                    <PostItem.Thumbnail
                      src={post.thumbnailImage ?? ""}
                      alt={post.title}
                      link={`/letters/${post.slug}`}
                    />
                  </PostItem.Container>
                ))}
              </div>
            )}

          {!isLoadingPosts &&
            resourceType === "letters" &&
            posts.length === 0 && (
              <div className="pb-16 pt-10">
                <p className="text-2xl font-bold tracking-[-0.04em] text-[var(--midnight-text)]">
                  Nothing surfaced.
                </p>

                <p className="mt-3 max-w-md text-[15px] leading-7 text-[var(--midnight-muted)]">
                  No letters matched “{query}”.
                </p>
              </div>
            )}

          {!isLoadingSubjects &&
            resourceType === "subjects" &&
            subjects.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2">
                {subjects.map((subject) => (
                  <a
                    key={subject.id}
                    href={`/subjects/${subject.slug}`}
                    className="group rounded-[28px] border border-[var(--midnight-border)]/70 bg-[var(--midnight-code-bg)] px-5 py-5 transition hover:border-[var(--midnight-accent)]/50 hover:bg-[var(--midnight-surface-soft)]"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--midnight-border)]/70 text-[var(--midnight-muted)] transition group-hover:border-[var(--midnight-accent)]/50 group-hover:text-[var(--midnight-accent)]">
                        <Hash className="h-4 w-4" />
                      </div>

                      <div className="min-w-0">
                        <h2 className="truncate text-lg font-semibold tracking-[-0.03em] text-[var(--midnight-text)]">
                          {subject.name}
                        </h2>

                        <p className="mt-1 text-sm text-[var(--midnight-muted)]">
                          {subject.postsCount}{" "}
                          {subject.postsCount === 1 ? "letter" : "letters"} ·{" "}
                          {subject.authorsCount}{" "}
                          {subject.authorsCount === 1 ? "writer" : "writers"}
                        </p>

                        <p className="mt-4 text-xs uppercase tracking-[0.14em] text-[var(--midnight-soft)] transition group-hover:text-[var(--midnight-accent)]">
                          View subject
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}

          {!isLoadingSubjects &&
            resourceType === "subjects" &&
            subjects.length === 0 && (
              <div className="pb-16 pt-10">
                <p className="text-2xl font-bold tracking-[-0.04em] text-[var(--midnight-text)]">
                  No subjects found.
                </p>

                <p className="mt-3 max-w-md text-[15px] leading-7 text-[var(--midnight-muted)]">
                  No subjects matched “{query}”.
                </p>
              </div>
            )}
        </section>
      </section>
    </main>
  );
}

function SubjectSkeleton() {
  return (
    <div className="rounded-[28px] border border-[var(--midnight-border)]/70 bg-[var(--midnight-code-bg)] px-5 py-5">
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-[var(--midnight-border)]/40" />

        <div className="min-w-0 flex-1">
          <div className="h-5 w-32 animate-pulse rounded-full bg-[var(--midnight-border)]/40" />
          <div className="mt-3 h-4 w-44 animate-pulse rounded-full bg-[var(--midnight-border)]/30" />
          <div className="mt-5 h-3 w-24 animate-pulse rounded-full bg-[var(--midnight-border)]/30" />
        </div>
      </div>
    </div>
  );
}