/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { SubmitEvent, useState } from "react";

import { toggleSideBar } from "@/features/app-settings/slice";

import { useAppDispatch } from "@/store/hooks";

import { AppSettingsModal } from "@/features/app-settings/components/app-settings-modal";
import { useMe } from "@/features/auth/hooks/use-me";
import { useRouter, useSearchParams } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchText, setSearchText] = useState(searchParams.get("q") ?? "");
  const dispatch = useAppDispatch();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { data: me } = useMe();

  const isLoggedIn = !!me;

  const handleSearch = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchText.trim().length === 0) return;
    router.push(`/search/articles?q=${searchText}`);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-black/10 bg-white/80 backdrop-blur-xl">
        <div className="flex h-full w-full items-center justify-between gap-6 px-3 md:px-5 lg:px-6">
          <div className="flex flex-1 items-center gap-4">
            <button
              type="button"
              onClick={() => dispatch(toggleSideBar())}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition hover:bg-black/5"
              aria-label="Toggle sidebar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5 text-black/80"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5m-16.5 5.25h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>

            <Link href="/" className="flex shrink-0 items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-xl font-serif text-white shadow-sm">
                M
              </div>

              <span className="text-2xl font-serif tracking-tight text-black">
                Medium
              </span>
            </Link>

            <div className="hidden h-11 w-full max-w-md items-center rounded-full border border-black/5 bg-[#F9F9F9] px-4 transition focus-within:bg-white focus-within:shadow-sm md:flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="h-5 w-5 text-black/40"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-4.35-4.35m0 0A7.65 7.65 0 1 0 5.825 5.825a7.65 7.65 0 0 0 10.825 10.825Z"
                />
              </svg>
              <form onSubmit={handleSearch} className="w-full">
                <input
                  type="text"
                  placeholder="Search articles, people or topics"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full bg-transparent px-3 text-sm outline-none placeholder:text-black/40"
                />
              </form>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-black/70 transition hover:bg-black/5 hover:text-black"
              aria-label="Open settings"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12a7.5 7.5 0 1 1 15 0 7.5 7.5 0 0 1-15 0Zm7.5-4.5v4.5l3 3"
                />
              </svg>
            </button>

            <Link
              href="/new-article"
              className="hidden h-10 items-center gap-2 rounded-full border border-black/10 px-4 text-sm text-black/70 transition hover:bg-black/5 hover:text-black md:flex"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Write
            </Link>

            {!isLoggedIn ? (
              <>
                <Link
                  href="/sign-in"
                  className="text-sm text-black/70 transition hover:text-black"
                >
                  Sign in
                </Link>

                <Link
                  href="/sign-up"
                  className="flex h-10 items-center justify-center rounded-full bg-black px-5 text-sm font-medium text-white transition hover:opacity-90"
                >
                  Get started
                </Link>
              </>
            ) : (
              <div className="group relative flex items-center">
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-black text-sm font-semibold text-white transition group-hover:scale-105">
                  {me?.avatarUrl ? (
                    <img
                      src={me.avatarUrl}
                      alt={me.fullName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    me?.fullName?.charAt(0).toUpperCase()
                  )}
                </div>

                <div className="absolute right-0 top-full pt-2 opacity-0 invisible transition-all duration-200 group-hover:visible group-hover:opacity-100">
                  <div className="min-w-[180px] rounded-2xl border border-black/10 bg-white p-2 shadow-xl">
                    <Link
                      href="/me"
                      className="block rounded-xl px-4 py-2 text-sm text-black/70 transition hover:bg-black/5 hover:text-black"
                    >
                      Profile
                    </Link>

                    <Link
                      href="/settings"
                      className="block rounded-xl px-4 py-2 text-sm text-black/70 transition hover:bg-black/5 hover:text-black"
                    >
                      Settings
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        localStorage.removeItem("accessToken");
                        window.location.reload();
                      }}
                      className="w-full rounded-xl px-4 py-2 text-left text-sm text-red-500 transition hover:bg-red-50"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <AppSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}
