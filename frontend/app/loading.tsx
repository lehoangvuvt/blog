export default function LoadingPage() {
  return (
    <main className="min-h-screen text-[#242424] animate-pulse">
      <div className="mx-auto max-w-3xl px-6 py-14">
        {/* Author */}
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-black/10" />

          <div className="space-y-2">
            <div className="h-3 w-32 rounded-full bg-black/10" />
            <div className="h-3 w-20 rounded-full bg-black/5" />
          </div>
        </div>

        {/* Title */}
        <div className="mt-10 space-y-4">
          <div className="h-10 w-full rounded-md bg-black/10" />
          <div className="h-10 w-[85%] rounded-md bg-black/10" />
        </div>

        {/* Subtitle */}
        <div className="mt-6 space-y-3">
          <div className="h-4 w-full rounded-full bg-black/5" />
          <div className="h-4 w-[92%] rounded-full bg-black/5" />
          <div className="h-4 w-[70%] rounded-full bg-black/5" />
        </div>

        {/* Thumbnail */}
        <div className="mt-10 h-[420px] w-full rounded-3xl bg-black/10" />

        {/* Article content */}
        <div className="mt-14 space-y-5">
          {Array.from({ length: 14 }).map((_, i) => (
            <div
              key={i}
              className={`h-4 rounded-full bg-black/5 ${
                i % 4 === 0 ? "w-[75%]" : i % 3 === 0 ? "w-[90%]" : "w-full"
              }`}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
