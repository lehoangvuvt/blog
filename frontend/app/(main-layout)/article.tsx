"use client";

type ArticleProps = {
    title: string;
    subtitle?: string;
    author: {
        name: string;
        avatar?: string;
    };
    publishedAt: string;
    readTime: string;
    category?: string;
    coverImage?: string;
    content: React.ReactNode;
};

export function Article({
    title,
    subtitle,
    author,
    publishedAt,
    readTime,
    category,
    coverImage,
    content,
}: ArticleProps) {
    return (
        <article className="mx-auto w-full max-w-3xl px-6 py-10">
            {/* Category */}
            {category && (
                <div className="mb-5">
                    <span className="rounded-full bg-zinc-100 px-4 py-1 text-sm font-medium text-zinc-700">
                        {category}
                    </span>
                </div>
            )}

            {/* Title */}
            <header className="mb-8">
                <h1 className="mb-4 text-5xl font-extrabold leading-tight tracking-tight text-zinc-900">
                    {title}
                </h1>

                {subtitle && (
                    <p className="text-xl leading-8 text-zinc-600">
                        {subtitle}
                    </p>
                )}
            </header>

            {/* Author */}
            <div className="mb-10 flex items-center justify-between border-y border-zinc-200 py-5">
                <div className="flex items-center gap-4">
                    {author.avatar ? (
                        <img
                            src={author.avatar}
                            alt={author.name}
                            className="h-12 w-12 rounded-full object-cover"
                        />
                    ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-200 text-sm font-semibold text-zinc-700">
                            {author.name[0]}
                        </div>
                    )}

                    <div>
                        <div className="font-semibold text-zinc-900">
                            {author.name}
                        </div>

                        <div className="text-sm text-zinc-500">
                            {publishedAt} · {readTime}
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium transition hover:bg-zinc-100"
                >
                    Follow
                </button>
            </div>

            {/* Cover */}
            {coverImage && (
                <div className="mb-10 overflow-hidden rounded-3xl">
                    <img
                        src={coverImage}
                        alt={title}
                        className="h-full w-full object-cover"
                    />
                </div>
            )}

            {/* Content */}
            <div
                className="
                    prose
                    prose-zinc
                    max-w-none

                    prose-headings:font-bold
                    prose-headings:tracking-tight

                    prose-h2:mt-14
                    prose-h2:text-3xl

                    prose-p:text-lg
                    prose-p:leading-9

                    prose-blockquote:border-l-4
                    prose-blockquote:border-zinc-300
                    prose-blockquote:pl-5
                    prose-blockquote:italic

                    prose-pre:rounded-2xl
                    prose-pre:bg-zinc-950
                    prose-pre:p-5

                    prose-img:rounded-2xl
                "
            >
                {content}
            </div>
        </article>
    );
}