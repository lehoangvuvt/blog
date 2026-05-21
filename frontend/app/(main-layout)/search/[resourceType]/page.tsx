/* eslint-disable @next/next/no-img-element */
"use client";

import MainLayout from "@/shared/components/layout/main-layout/main-layout";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Loading from "@/shared/components/loading";
import { usePosts } from "@/features/posts/hooks/use-posts";
import { PostItem } from "@/features/posts/components/post-item";

const tabs = ["Articles", "People", "Topics"];

export default function SearchPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  const { data: postsData, isLoading: isLoadingPosts } = usePosts(
    {
      search: query ?? "",
      limit: 10,
    },
    params.resourceType === "articles"
  );
  const posts = postsData?.pages.flatMap((page) => page.data) ?? [];

  const isLoading = isLoadingPosts;

  const handleChangeTab = (tab: string) => {
    const url = `/search/${tab.toLowerCase()}?q=${query}`;
    router.push(url);
  };

  return (
    <MainLayout>
      <section className="mx-auto w-full max-w-170 py-10">
        <h1 className="text-[42px] font-semibold tracking-tight text-neutral-500">
          Results for <span className="font-bold text-black">{query}</span>
        </h1>

        <div className="mt-5 pt-5 sticky top-15 bg-[white] border-b border-neutral-200">
          <nav className="flex gap-8 text-sm text-neutral-700">
            {tabs.map((tab) => (
              <button
                type='button'
                key={tab}
                onClick={() => handleChangeTab(tab)}
                className={`pb-4 ${params.resourceType === tab.toLowerCase()
                  ? "border-b border-black text-black"
                  : "hover:text-black cursor-pointer"
                  }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="divide-y divide-neutral-200">
          {isLoading && <Loading />}

          {!isLoading &&
            params.resourceType === "articles" &&
            posts.length > 0 &&
            posts.map((post, i) => (
              <PostItem.Container key={`${post.id}-${i}`}>
                <PostItem.Content>
                  <PostItem.Header>
                    <PostItem.Author link={`/@${post.author?.slug}`}>
                      {post.author?.slug}
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

                  <PostItem.SubTitle>{post.subTitle}</PostItem.SubTitle>
                </PostItem.Content>

                <PostItem.Thumbnail
                  src={post.thumbnailImage ?? ""}
                  alt="Post thumbnail"
                />
              </PostItem.Container>
            ))}

          {!isLoading &&
            params.resourceType === "articles" &&
            posts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-28 text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50">
                  {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-7 w-7 text-neutral-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-4.35-4.35m0 0A7.5 7.5 0 1 0 6 16.65a7.5 7.5 0 0 0 10.65 0Z"
                    />
                  </svg>
                </div>

                <h2 className="text-2xl font-semibold tracking-tight text-black">
                  No {params.resourceType} found
                </h2>

                <p className="mt-3 max-w-md text-[15px] leading-7 text-neutral-500">
                  We couldn’t find any {params.resourceType} matching{" "}
                  <span className="font-medium text-neutral-700">“{query}”</span>.
                  Try searching for something else.
                </p>
              </div>
            )}
        </div>
      </section>
    </MainLayout>
  );
}
