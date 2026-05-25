/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Check, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useParams } from "next/navigation";
import useEmblaCarousel from "embla-carousel-react";

import { useMe } from "@/features/auth/hooks/use-me";
import useFollowTag from "@/features/tags/hooks/use-follow-tag";
import useUnfollowTag from "@/features/tags/hooks/use-unfollow-tag";
import { formatPostDate, getArticleLink } from "@/shared/utils";
import Loading from "@/shared/components/loading";
import useTagBySlug from "@/features/tags/hooks/use-tag-by-slug";
import useTagFeaturedPosts from "@/features/tags/hooks/use-tag-featured-posts";
import useTagFeaturedAuthors from "@/features/tags/hooks/use-tag-featured-authors";

export default function SubjectExplorePage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: me } = useMe();

  const followedTagIds = useMemo(
    () => me?.followedTags?.map((tag) => tag.id) ?? [],
    [me],
  );

  const { data: tagData, isLoading: isLoadingTag } = useTagBySlug(slug);
  const { data: featuredPosts = [], isLoading: isLoadingFeaturedPosts } =
    useTagFeaturedPosts(slug);
  const { data: featuredAuthors = [], isLoading: isLoadingFeaturedAuthors } =
    useTagFeaturedAuthors(slug);

  const { mutate: followTag } = useFollowTag();
  const { mutate: unfollowTag } = useUnfollowTag();

  const isFollowed = tagData ? followedTagIds.includes(tagData.id) : false;

  if (isLoadingTag) return <Loading />;

  return (
    <main className="min-h-screen text-[var(--midnight-text)]">
      <section className="mx-auto w-full max-w-6xl px-5 py-14 md:px-6">
        <header className="max-w-3xl">
          <p className="text-xs tracking-[0.18em] text-[var(--midnight-soft)]">
            SUBJECT
          </p>

          <h1 className="mt-4 text-5xl font-bold leading-[0.95] tracking-[-0.07em] md:text-7xl">
            {tagData?.name ?? slug}
          </h1>

          <p className="mt-6 max-w-2xl text-[16px] leading-8 text-[var(--midnight-muted)]">
            A quiet archive of featured letters and writers circling this
            subject.
          </p>

          {tagData && (
            <button
              type="button"
              onClick={() =>
                isFollowed ? unfollowTag(tagData) : followTag(tagData)
              }
              className={`mt-8 inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition ${
                isFollowed
                  ? "border-[var(--midnight-border)]/70 bg-[var(--midnight-code-bg)] text-[var(--midnight-text)] hover:border-red-400/40 hover:text-red-300"
                  : "border-[var(--midnight-accent)]/70 bg-[var(--midnight-accent)] text-[var(--midnight-on-accent)] hover:opacity-90"
              }`}
            >
              {isFollowed ? (
                <>
                  <Check className="h-4 w-4" />
                  Following
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Follow subject
                </>
              )}
            </button>
          )}
        </header>

        <div className="mt-14 border-t border-[var(--midnight-border)]/70 pt-10">
          <SectionHeader
            label="Featured letters"
            title="Start with these"
            description=""
          />

          <FeaturedPostsCarousel
            posts={featuredPosts}
            isLoading={isLoadingFeaturedPosts}
          />
        </div>

        <div className="mt-16 border-t border-[var(--midnight-border)]/70 pt-10">
          <SectionHeader
            label="Featured writers"
            title="Voices in this subject"
            description=""
          />

          <FeaturedAuthorsCarousel
            authors={featuredAuthors}
            isLoading={isLoadingFeaturedAuthors}
          />
        </div>
      </section>
    </main>
  );
}

function SectionHeader({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-xs tracking-[0.16em] text-[var(--midnight-soft)]">
          {label}
        </p>

        <h2 className="mt-2 text-3xl font-bold tracking-[-0.05em]">{title}</h2>
      </div>

      <p className="max-w-xs text-sm leading-6 text-[var(--midnight-muted)]">
        {description}
      </p>
    </div>
  );
}

function FeaturedPostsCarousel({
  posts,
  isLoading,
}: {
  posts: any[];
  isLoading: boolean;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start" });

  if (isLoading) {
    return (
      <div className="grid gap-5 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="h-80 animate-pulse rounded-2xl bg-[var(--midnight-code-bg)]"
          />
        ))}
      </div>
    );
  }

  if (!posts.length) {
    return <EmptyText>No featured letters yet.</EmptyText>;
  }

  return (
    <div>
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-5">
          {posts.map((post) => {
            const articleLink = getArticleLink(post.slug);
            const authorName =
              post.author?.fullName || post.author?.email || "Unknown writer";

            return (
              <article
                key={post.id}
                className="min-w-0 flex-[0_0_86%] md:flex-[0_0_46%]"
              >
                <Link href={articleLink} className="group block">
                  {post.thumbnailImage && (
                    <div className="overflow-hidden rounded-2xl border border-[var(--midnight-border)]/70 bg-[var(--midnight-code-bg)]">
                      <img
                        src={post.thumbnailImage}
                        alt={post.title}
                        className="aspect-[16/10] w-full object-cover opacity-85 saturate-[0.85] transition duration-500 group-hover:opacity-100 group-hover:saturate-100"
                      />
                    </div>
                  )}

                  <p className="mt-4 text-xs text-[var(--midnight-soft)]">
                    {authorName} · {formatPostDate(post.postedDate)}
                  </p>

                  <h3 className="mt-2 line-clamp-2 text-2xl font-bold leading-snug tracking-[-0.045em] transition group-hover:text-[var(--midnight-accent-hover)]">
                    {post.title}
                  </h3>

                  {post.subTitle && (
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--midnight-muted)]">
                      {post.subTitle}
                    </p>
                  )}
                </Link>
              </article>
            );
          })}
        </div>
      </div>

      <CarouselButtons emblaApi={emblaApi} />
    </div>
  );
}

function FeaturedAuthorsCarousel({
  authors,
  isLoading,
}: {
  authors: any[];
  isLoading: boolean;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start" });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-2xl bg-[var(--midnight-code-bg)]"
          />
        ))}
      </div>
    );
  }

  if (!authors.length) {
    return <EmptyText>No featured writers yet.</EmptyText>;
  }

  return (
    <div>
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-4">
          {authors.map((author) => (
            <Link
              key={author.id}
              href={`/${author.slug}`}
              className="min-w-0 flex-[0_0_68%] border-l border-[var(--midnight-border)]/70 pl-4 transition hover:border-[var(--midnight-accent)]/70 sm:flex-[0_0_38%] md:flex-[0_0_24%]"
            >
              {author.avatar ? (
                <img
                  src={author.avatar}
                  alt={author.fullName ?? "Writer"}
                  className="h-11 w-11 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--midnight-border)]/70 bg-[var(--midnight-code-bg)] text-sm text-[var(--midnight-accent)]">
                  {(author.fullName ?? author.email ?? "?")
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}

              <p className="mt-4 truncate text-sm font-medium text-[var(--midnight-text)]">
                {author.fullName ?? author.email}
              </p>

              <p className="mt-1 text-xs text-[var(--midnight-soft)]">
                {author.postsCount} letters
              </p>
            </Link>
          ))}
        </div>
      </div>

      <CarouselButtons emblaApi={emblaApi} />
    </div>
  );
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function CarouselButtons({ emblaApi }: { emblaApi: any }) {
  return (
    <div className="mt-6 flex gap-2">
      <button
        type="button"
        onClick={() => emblaApi?.scrollPrev()}
        className="rounded-full border border-[var(--midnight-border)]/70 p-2 text-[var(--midnight-muted)] transition hover:text-[var(--midnight-text)]"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={() => emblaApi?.scrollNext()}
        className="rounded-full border border-[var(--midnight-border)]/70 p-2 text-[var(--midnight-muted)] transition hover:text-[var(--midnight-text)]"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function EmptyText({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-2xl border border-[var(--midnight-border)]/70 px-5 py-8 text-sm text-[var(--midnight-muted)]">
      {children}
    </p>
  );
}