/* eslint-disable @next/next/no-img-element */
"use client";

import MainLayout from "@/shared/components/layout/main-layout/main-layout";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import LoadingPage from "@/app/loading";
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
    params["resourceType"] === "articles"
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

        <div className="mt-10 border-b border-neutral-200">
          <nav className="flex gap-8 text-sm text-neutral-700">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => handleChangeTab(tab)}
                className={`pb-4 ${
                  params["resourceType"] === tab.toLowerCase()
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
          {isLoading && <LoadingPage />}
          {!isLoading &&
            params["resourceType"] === "articles" &&
            posts.map((post) => (
              <PostItem.Container key={post.id}>
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
        </div>
      </section>
    </MainLayout>
  );
}
