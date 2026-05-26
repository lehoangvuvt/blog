import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5 text-[var(--midnight-text)]">
      <section className="max-w-md text-center">
        <p className="text-xs tracking-[0.24em] text-[var(--midnight-soft)]">
          403
        </p>

        <h1 className="mt-5 text-5xl font-bold tracking-[-0.06em]">
          Access denied
        </h1>

        <p className="mt-5 text-[15px] leading-7 text-[var(--midnight-muted)]">
          This room is quiet, but it is not open to everyone. You do not have
          permission to view this page.
        </p>

        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-[var(--midnight-accent)] px-5 py-2.5 text-sm font-medium text-[var(--midnight-on-accent)] transition hover:opacity-90"
          >
            Go home
          </Link>

          <Link
            href="/sign-in"
            className="rounded-full border border-[var(--midnight-border)]/70 px-5 py-2.5 text-sm font-medium text-[var(--midnight-muted)] transition hover:text-[var(--midnight-text)]"
          >
            Sign in
          </Link>
        </div>
      </section>
    </main>
  );
}
