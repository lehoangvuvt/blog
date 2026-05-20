import Link from "next/link";
import MainLayout from "@/shared/components/layout/main-layout/main-layout";

export default function TermsPage() {
  return (
    <MainLayout>
      <main className="min-h-screen">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <div className="mb-16">
            <p className="text-sm uppercase tracking-[0.2em] text-black/40">
              Stories
            </p>

            <h1 className="mt-5 font-serif text-6xl tracking-tight text-[#242424]">
              Terms of Use
            </h1>

            <p className="mt-5 text-lg leading-8 text-black/60">
              Simple rules for using Stories.
            </p>

            <p className="mt-3 text-sm text-black/40">
              Last updated: May 20, 2026
            </p>
          </div>

          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-semibold text-[#242424]">
                Respect the platform
              </h2>

              <p className="mt-3 leading-8 text-black/65">
                Don’t misuse Stories, attack the service, spam users, or post
                illegal or harmful content.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#242424]">
                Your content stays yours
              </h2>

              <p className="mt-3 leading-8 text-black/65">
                You keep ownership of what you write. By publishing on Stories,
                you allow us to display and distribute your content on the
                platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#242424]">
                Accounts can be restricted
              </h2>

              <p className="mt-3 leading-8 text-black/65">
                We may remove content or suspend accounts that violate these
                Terms or harm the community.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#242424]">
                Policies may change
              </h2>

              <p className="mt-3 leading-8 text-black/65">
                We may update these Terms over time. Continued use of Stories
                means you accept the updated version.
              </p>
            </section>
          </div>

          <div className="mt-20 border-t border-black/10 pt-8 text-sm text-black/50">
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/privacy" className="hover:text-black">
                Privacy Policy
              </Link>

              <span>•</span>

              <a href="mailto:support@stories.com" className="hover:text-black">
                support@stories.com
              </a>
            </div>
          </div>
        </div>
      </main>
    </MainLayout>
  );
}
