import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen text-[var(--midnight-text)]">
      <div className="mx-auto max-w-3xl px-5 py-16 md:px-6 md:py-20">
        <header className="border-b border-[var(--midnight-border)]/70 pb-10">
          <p className="text-xs tracking-[0.16em] text-[var(--midnight-soft)]">
            THE MIDNIGHT LETTERS
          </p>

          <h1 className="mt-5 text-5xl font-bold tracking-[-0.06em] text-[var(--midnight-text)] md:text-6xl">
            Privacy &nbsp;Policy
          </h1>

          <p className="mt-5 max-w-2xl text-[17px] leading-8 text-[var(--midnight-muted)]">
            How we collect, use, and protect your information.
          </p>

          <p className="mt-4 text-sm text-[var(--midnight-soft)]">
            Last updated: May 20, 2026
          </p>
        </header>

        <div className="space-y-10 py-10">
          {[
            {
              title: "Information we collect",
              body: "We may collect information such as your email address, profile details, and activity on The Midnight Letters including letters, comments, and interactions.",
            },
            {
              title: "How we use your information",
              body: "Your information is used to operate the platform, personalize your experience, improve The Midnight Letters, and keep the service secure.",
            },
            {
              title: "Content visibility",
              body: "Letters, comments, profile information, and other public activity may be visible to other users on The Midnight Letters.",
            },
            {
              title: "Data protection",
              body: "We take reasonable measures to protect your information, but no online service can guarantee complete security.",
            },
            {
              title: "Changes to this policy",
              body: "We may update this Privacy Policy from time to time. Continued use of The Midnight Letters means you accept the updated version.",
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
              href="/terms"
              className="transition hover:text-[var(--midnight-accent-hover)]"
            >
              Terms of Use
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
