import Link from "next/link";
import { PenSquare, Lock, ArrowLeft } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ed] text-[#242424]">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-16">
        <div className="grid items-center gap-16 md:grid-cols-2">
          {/* Left */}
          <div>
            <p className="mb-5 text-sm font-medium tracking-[0.2em] uppercase text-neutral-500">
              403 — Forbidden
            </p>

            <h1 className="font-serif text-5xl leading-tight font-semibold tracking-tight md:text-7xl">
              You don’t have access to this page.
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-neutral-600">
              This resource may require sign in, special permissions, or access
              granted by the author or publication.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full bg-[#1a8917] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#156d12]"
              >
                <ArrowLeft size={16} />
                Back home
              </Link>

              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-5 py-3 text-sm font-medium text-neutral-800 transition hover:border-neutral-500 hover:bg-black/5"
              >
                Sign in
              </Link>
            </div>
          </div>

          {/* Right */}
          <div className="relative">
            <div className="rounded-[32px] border border-black/10 bg-white p-10 shadow-[0_10px_60px_rgba(0,0,0,0.06)]">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f2f2f2]">
                <Lock className="text-neutral-700" size={28} />
              </div>

              <div className="mt-8 space-y-4">
                <div className="h-3 w-24 rounded-full bg-neutral-200" />

                <div className="space-y-3">
                  <div className="h-3 w-full rounded-full bg-neutral-100" />
                  <div className="h-3 w-[92%] rounded-full bg-neutral-100" />
                  <div className="h-3 w-[75%] rounded-full bg-neutral-100" />
                </div>
              </div>

              <div className="mt-10 flex items-center gap-3 rounded-2xl border border-black/5 bg-[#fafafa] p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1a8917] text-white">
                  <PenSquare size={18} />
                </div>

                <div>
                  <p className="text-sm font-medium">Restricted content</p>

                  <p className="text-sm text-neutral-500">
                    Sign in or request access to continue.
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -right-6 -bottom-6 h-32 w-32 rounded-full bg-[#1a8917]/10 blur-3xl" />
          </div>
        </div>
      </div>
    </main>
  );
}
