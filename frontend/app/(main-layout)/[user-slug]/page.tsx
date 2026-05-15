/* eslint-disable @next/next/no-img-element */

import MainLayout from "@/shared/components/layout/main-layout/main-layout";

type Article = {
  id: string;
  title: string;
  subTitle?: string;
  thumbnail?: string;
  author: {
    name: string;
    avatar?: string;
  };
  tags: string[];
  readTime: string;
  createdAt: string;
};

const articles: Article[] = [
  {
    id: "1",
    title: "The First 3 Days Were Brutal",
    subTitle:
      "What waking up at 4:30 AM every day taught me about discipline, boredom, and momentum.",
    thumbnail:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200",
    author: {
      name: "Hoang Vu Le",
      avatar: "https://i.pravatar.cc/100?img=12",
    },
    tags: ["Productivity", "Self Improvement"],
    readTime: "5 min read",
    createdAt: "May 16, 2026",
  },
  {
    id: "2",
    title: "Building a Better Writing Habit",
    subTitle:
      "A simple system for turning small daily notes into full articles without forcing motivation.",
    thumbnail:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1200",
    author: {
      name: "Hoang Vu Le",
      avatar: "https://i.pravatar.cc/100?img=32",
    },
    tags: ["Writing", "Habits"],
    readTime: "4 min read",
    createdAt: "May 14, 2026",
  },
];

export default function UserArticlesPage() {
  const followers = 12800;

  return (
    <MainLayout>
      <main className="min-h-screen bg-white text-neutral-900">
        <section className="mx-auto max-w-6xl px-6 py-12">
          <header className="border-b border-neutral-200 pb-8">
            <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div className="flex items-start gap-5">
                <img
                  src="https://i.pravatar.cc/200?img=12"
                  alt="Hoang Vu Le"
                  className="h-20 w-20 rounded-full object-cover"
                />

                <div>
                  <h1 className="text-4xl font-bold tracking-tight">
                    Hoang Vu Le
                  </h1>

                  <div className="mt-2 flex items-center gap-2 text-sm text-neutral-500">
                    <span>{followers.toLocaleString()} followers</span>
                    <span>·</span>
                    <span>24 stories</span>
                  </div>

                  <p className="mt-4 max-w-2xl text-neutral-600">
                    Thoughts on software, writing, productivity, and building
                    things on the internet.
                  </p>
                </div>
              </div>

              <button className="h-11 rounded-full border border-neutral-900 px-6 text-sm font-medium transition hover:bg-neutral-900 hover:text-white">
                Follow
              </button>
            </div>
          </header>

          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_280px]">
            <section>
              <nav className="mb-8 flex gap-6 border-b border-neutral-200 text-sm text-neutral-500">
                <button className="border-b border-neutral-900 pb-3 font-medium text-neutral-900">
                  Home
                </button>

                <button className="pb-3 hover:text-neutral-900">Lists</button>

                <button className="pb-3 hover:text-neutral-900">About</button>
              </nav>

              <div className="space-y-10">
                {articles.map((article) => (
                  <article
                    key={article.id}
                    className="grid grid-cols-[1fr_160px] gap-6 border-b border-neutral-200 pb-10"
                  >
                    <div>
                      <div className="mb-4 flex items-center gap-2 text-sm text-neutral-600">
                        <img
                          src={article.author.avatar}
                          alt={article.author.name}
                          className="h-6 w-6 rounded-full object-cover"
                        />

                        <span>{article.author.name}</span>
                      </div>

                      <h2 className="text-2xl font-bold leading-snug tracking-tight hover:underline">
                        {article.title}
                      </h2>

                      {article.subTitle && (
                        <p className="mt-2 line-clamp-2 text-neutral-600">
                          {article.subTitle}
                        </p>
                      )}

                      <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-neutral-500">
                        <span>{article.createdAt}</span>

                        <span>·</span>

                        <span>{article.readTime}</span>

                        {article.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {article.thumbnail && (
                      <img
                        src={article.thumbnail}
                        alt={article.title}
                        className="h-28 w-40 rounded-md object-cover"
                      />
                    )}
                  </article>
                ))}
              </div>
            </section>

            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-8">
                <div>
                  <h3 className="font-semibold">About</h3>

                  <p className="mt-3 text-sm leading-6 text-neutral-600">
                    Developer and writer sharing notes about coding, systems,
                    discipline, and creative work.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold">Stats</h3>

                  <div className="mt-4 space-y-3 text-sm text-neutral-600">
                    <div className="flex items-center justify-between">
                      <span>Followers</span>
                      <span className="font-medium text-neutral-900">
                        {followers.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Total stories</span>
                      <span className="font-medium text-neutral-900">24</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Total views</span>
                      <span className="font-medium text-neutral-900">1.2M</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold">Topics</h3>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {[
                      "Next.js",
                      "Writing",
                      "Productivity",
                      "Backend",
                      "Life",
                    ].map((topic) => (
                      <span
                        key={topic}
                        className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-700"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </MainLayout>
  );
}
