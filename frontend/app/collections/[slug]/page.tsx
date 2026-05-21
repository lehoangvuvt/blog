/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Bookmark, Check, Menu, X } from "lucide-react";
import { useParams } from "next/navigation";

type Author = {
  id: string;
  full_name: string;
  avatar: string | null;
  slug: string;
};

type CollectionPost = {
  id: number;
  title: string;
  subTitle: string;
  thumbnailImage: string | null;
  slug: string;
  postedDate: string;
  htmlContent: string;
  author: Author;
};

type CollectionDetails = {
  id: string;
  slug: string;
  name: string;
  description: string;
  createdAt: string;
  posts: CollectionPost[];
};

export default function CollectionBookReader() {
  const params = useParams();
  const slug = params.slug as string;

  const [collection, setCollection] = useState<CollectionDetails | null>(null);
  const [articleIndex, setArticleIndex] = useState(-1);
  const [openMenu, setOpenMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchCollection = async () => {
      try {
        setIsLoading(true);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/post-collections/${slug}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch collection");
        }

        const data = (await response.json()) as CollectionDetails;

        setCollection(data);
        setArticleIndex(-1);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollection();
  }, [slug]);

  const articles = collection?.posts ?? [];
  const isIntroPage = articleIndex === -1;

  const currentArticle = useMemo(() => {
    if (isIntroPage) return null;
    return articles[articleIndex];
  }, [articles, articleIndex, isIntroPage]);

  const isFirst = isIntroPage;
  const isLast = !isIntroPage && articleIndex === articles.length - 1;

  const progress =
    articles.length > 0 && !isIntroPage
      ? Math.round(((articleIndex + 1) / articles.length) * 100)
      : 0;

  const goToArticle = (index: number) => {
    setArticleIndex(index);
    setOpenMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goIntro = () => {
    setArticleIndex(-1);
    setOpenMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goNext = () => {
    if (isIntroPage) {
      goToArticle(0);
      return;
    }

    if (!isLast) {
      goToArticle(articleIndex + 1);
    }
  };

  const goPrevious = () => {
    if (articleIndex === 0) {
      goIntro();
      return;
    }

    if (articleIndex > 0) {
      goToArticle(articleIndex - 1);
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#ece4d8] text-[#211b16]">
        <p className="font-serif text-xl">Opening collection...</p>
      </main>
    );
  }

  if (!collection || articles.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#ece4d8] text-[#211b16]">
        <p className="font-serif text-xl">Collection not found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#ece4d8] text-[#211b16]">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <button
          type='button'
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-sm text-black/50 transition hover:text-black"
        >
          <ArrowLeft className="h-4 w-4" />
          Collection
        </button>

        <div className="flex items-center gap-3">
          <button
            type='button'
            onClick={goIntro}
            className={`h-2 rounded-full transition-all ${isIntroPage ? "w-10 bg-black" : "w-2 bg-black/70"
              }`}
            aria-label="Go to introduction"
          />

          {articles.map((_, index) => (
            <button
              type='button'
              key={`article-progress-${index + 1}`}
              onClick={() => goToArticle(index)}
              className={`h-2 rounded-full transition-all ${index === articleIndex
                ? "w-10 bg-black"
                : index < articleIndex
                  ? "w-2 bg-black/70"
                  : "w-2 bg-black/20"
                }`}
              aria-label={`Go to article ${index + 1}`}
            />
          ))}
        </div>

        <button
          type='button'
          onClick={() => setOpenMenu((prev) => !prev)}
          className="rounded-full p-2 text-black/50 transition hover:bg-black/5 hover:text-black"
        >
          {openMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {openMenu && (
        <div className="mx-auto max-w-5xl px-6 pb-6">
          <div className="rounded-3xl bg-[#fbf7ef] p-3 shadow-[0_20px_60px_rgba(60,40,20,0.16)]">
            <button
              type='button'
              onClick={goIntro}
              className={`block w-full rounded-2xl px-5 py-4 text-left transition ${isIntroPage ? "bg-[#211b16] text-white" : "hover:bg-black/5"
                }`}
            >
              <p className="text-xs opacity-50">Introduction</p>
              <p className="mt-1 line-clamp-1 font-serif text-lg">
                {collection.name}
              </p>
            </button>

            {articles.map((article, index) => (
              <button
                type='button'
                key={article.id}
                onClick={() => goToArticle(index)}
                className={`block w-full rounded-2xl px-5 py-4 text-left transition ${index === articleIndex
                  ? "bg-[#211b16] text-white"
                  : "hover:bg-black/5"
                  }`}
              >
                <p className="text-xs opacity-50">Article {index + 1}</p>
                <p className="mt-1 line-clamp-1 font-serif text-lg">
                  {article.title}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      <section className="mx-auto max-w-4xl px-4 pb-20">
        <article className="relative min-h-[760px] overflow-hidden rounded-sm bg-[#fbf7ef] px-8 py-12 shadow-[0_30px_80px_rgba(60,40,20,0.18)] md:px-20 md:py-16">
          <div className="absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-black/10 to-transparent" />

          {!isIntroPage && (
            <button
              type='button'
              className="absolute right-8 top-0 flex flex-col items-center">
              <div className="h-16 w-10 rounded-b-md bg-[#211b16]" />
              <Bookmark className="-mt-12 h-5 w-5 text-white" />
            </button>
          )}

          {isIntroPage ? (
            <div className="flex min-h-[620px] flex-col items-center justify-center text-center">
              <p className="text-xs uppercase tracking-[0.35em] text-black/35">
                Reading Collection
              </p>

              <h1 className="mx-auto mt-8 max-w-2xl font-serif text-6xl leading-tight">
                {collection.name}
              </h1>

              <p className="mx-auto mt-6 max-w-xl font-serif text-xl leading-8 text-black/55">
                {collection.description}
              </p>

              <div className="mx-auto my-12 h-px w-24 bg-black/20" />

              <div className="grid max-w-xl grid-cols-1 gap-8">
                <div>
                  <p className="font-serif text-4xl">{articles.length}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-black/35">
                    Articles
                  </p>
                </div>
              </div>
            </div>
          ) : (
            currentArticle && (
              <>
                <div className="mb-10 text-center">
                  <p className="text-xs uppercase tracking-[0.35em] text-black/35">
                    Article {articleIndex + 1}
                  </p>

                  <h1 className="mx-auto mt-6 max-w-2xl font-serif text-5xl leading-tight">
                    {currentArticle.title}
                  </h1>

                  <p className="mx-auto mt-5 max-w-xl font-serif text-xl leading-8 text-black/55">
                    {currentArticle.subTitle}
                  </p>

                  <p className="mt-5 text-sm text-black/40">
                    By {currentArticle.author.full_name}
                  </p>
                </div>

                <div className="mx-auto mb-12 h-px w-24 bg-black/20" />

                {currentArticle.thumbnailImage && (
                  <img
                    src={currentArticle.thumbnailImage}
                    alt={currentArticle.title}
                    className="mx-auto mb-12 max-h-105 w-full max-w-2xl rounded-sm object-cover"
                  />
                )}

                <div
                  className="prose prose-lg mx-auto max-w-2xl font-serif prose-headings:font-serif prose-p:text-[22px] prose-p:leading-[2.2rem] prose-p:text-black/75 prose-img:rounded-sm"
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                  dangerouslySetInnerHTML={{
                    __html: currentArticle.htmlContent,
                  }}
                />

                <footer className="mt-20 flex items-center justify-between border-t border-black/10 pt-6 text-sm text-black/45">
                  <span>
                    {articleIndex + 1} / {articles.length}
                  </span>

                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    {progress}% completed
                  </div>
                </footer>
              </>
            )
          )}
        </article>

        <div className="mt-8 flex items-center justify-between">
          <button
            type='button'
            onClick={goPrevious}
            disabled={isFirst}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${isFirst
              ? "cursor-not-allowed text-black/20"
              : "text-black/50 hover:bg-black/5 hover:text-black"
              }`}
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </button>

          <button
            type='button'
            onClick={goNext}
            disabled={isLast}
            className={`flex items-center gap-2 rounded-full px-5 py-3 text-sm transition ${isLast
              ? "cursor-not-allowed bg-black/20 text-white/60"
              : "bg-[#211b16] text-white hover:bg-black"
              }`}
          >
            {isIntroPage
              ? "Start reading"
              : isLast
                ? "Finished"
                : "Next article"}
            {!isLast && <ArrowRight className="h-4 w-4" />}
          </button>
        </div>
      </section>
    </main>
  );
}
