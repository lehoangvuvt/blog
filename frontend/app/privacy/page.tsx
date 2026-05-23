import Link from "next/link";
import MainLayout from "@/shared/components/layout/main-layout/main-layout";

export default function PrivacyPage() {
  return (
    <MainLayout>
      <main className="min-h-screen">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <div className="mb-16">
            <p className="text-sm uppercase tracking-[0.2em] text-black/40">
              The Midnight Letters
            </p>

            <h1 className="mt-5 font-serif text-6xl tracking-tight text-[#242424]">
              Privacy Policy
            </h1>

            <p className="mt-5 text-lg leading-8 text-black/60">
              How we collect, use, and protect your information.
            </p>

            <p className="mt-3 text-sm text-black/40">
              Last updated: May 20, 2026
            </p>
          </div>

          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-semibold text-[#242424]">
                Information we collect
              </h2>

              <p className="mt-3 leading-8 text-black/65">
                We may collect information such as your email address, profile
                details, and activity on The Midnight Letters including letters, comments,
                and interactions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#242424]">
                How we use your information
              </h2>

              <p className="mt-3 leading-8 text-black/65">
                Your information is used to operate the platform, personalize
                your experience, improve The Midnight Letters, and keep the service secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#242424]">
                Content visibility
              </h2>

              <p className="mt-3 leading-8 text-black/65">
                Letters, comments, profile information, and other public
                activity may be visible to other users on The Midnight Letters.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#242424]">
                Data protection
              </h2>

              <p className="mt-3 leading-8 text-black/65">
                We take reasonable measures to protect your information, but no
                online service can guarantee complete security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#242424]">
                Changes to this policy
              </h2>

              <p className="mt-3 leading-8 text-black/65">
                We may update this Privacy Policy from time to time. Continued
                use of The Midnight Letters means you accept the updated version.
              </p>
            </section>
          </div>

          <div className="mt-20 border-t border-black/10 pt-8 text-sm text-black/50">
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/terms" className="hover:text-black">
                Terms of Use
              </Link>

              <span>•</span>

              <a href="mailto:support@themidnightletters.com" className="hover:text-black">
                support@themidnightletters.com
              </a>
            </div>
          </div>
        </div>
      </main>
    </MainLayout>
  );
}
