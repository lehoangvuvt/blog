import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen text-[var(--midnight-text)]">
      <div className="mx-auto max-w-3xl px-5 py-16 md:px-6 md:py-20">
        <header className="border-b border-[var(--midnight-border)]/70 pb-10">
          <p className="text-xs tracking-[0.16em] text-[var(--midnight-soft)]">
            THE MIDNIGHT LETTERS
          </p>

          <h1 className="mt-5 text-5xl font-bold tracking-[-0.06em] text-[var(--midnight-text)] md:text-6xl">
            Terms &nbsp;of &nbsp;Use
          </h1>

          <p className="mt-5 max-w-2xl text-[17px] leading-8 text-[var(--midnight-muted)]">
            Simple rules for using The Midnight Letters.
          </p>

          <p className="mt-4 text-sm text-[var(--midnight-soft)]">
            Last updated: May 20, 2026
          </p>
        </header>

        <div className="space-y-10 py-10">
          {[
            {
              title: "Respect the platform",
              body: "Don’t misuse The Midnight Letters, attack the service, spam users, or post illegal or harmful content.",
            },
            {
              title: "Your content stays yours",
              body: "You keep ownership of what you write. By publishing on The Midnight Letters, you allow us to display and distribute your content on the platform.",
            },
            {
              title: "Accounts can be restricted",
              body: "We may remove content or suspend accounts that violate these Terms or harm the community.",
            },
            {
              title: "Policies may change",
              body: "We may update these Terms over time. Continued use of The Midnight Letters means you accept the updated version.",
            },
          ].map((item) => (
            <section
              key={item.title}
              className="border-b border-[var(--midnight-border)]/70 pb-10 last:border-b-0 last:pb-0"
            >
              <h2 className="text-2xl font-bold tracking-[-0.04em] text-[var(--midnight-text)]">
                {item.title}
              </h2>

              <p className="mt-3 text-[15px] leading-8 text-[var(--midnight-muted)]">
                {item.body}
              </p>
            </section>
          ))}
        </div>

        <footer className="border-t border-[var(--midnight-border)]/70 pt-8 text-sm text-[var(--midnight-muted)]">
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/privacy"
              className="transition hover:text-[var(--midnight-accent-hover)]"
            >
              Privacy Policy
            </Link>

            <span className="text-[var(--midnight-soft)]">•</span>

            <a
              href="mailto:support@themidnightletters.com"
              className="transition hover:text-[var(--midnight-accent-hover)]"
            >
              support@themidnightletters.com
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
