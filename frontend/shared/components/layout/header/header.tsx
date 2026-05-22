/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { toggleSideBar } from "@/features/app-settings/slice";
import { AppSettingsModal } from "@/features/app-settings/components/app-settings-modal";
import { useMe } from "@/features/auth/hooks/use-me";
import { useAppDispatch } from "@/store/hooks";

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const [searchText, setSearchText] = useState(searchParams.get("q") ?? "");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const searchContainerRef = useRef<HTMLFormElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const { data: me, isLoading, isFetching } = useMe();
  const isCheckingAuth = isLoading || isFetching;
  const isLoggedIn = !!me;

  const RECENT_SEARCHES_KEY = "recentSearches";

  useEffect(() => {
    const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(target)
      ) {
        setIsSearchFocused(false);
      }

      if (profileRef.current && !profileRef.current.contains(target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const saveRecentSearch = (query: string) => {
    const next = [
      query,
      ...recentSearches.filter(
        (item) => item.toLowerCase() !== query.toLowerCase()
      ),
    ].slice(0, 5);

    setRecentSearches(next);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
  };

  const removeRecentSearch = (query: string) => {
    const next = recentSearches.filter((item) => item !== query);
    setRecentSearches(next);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const query = searchText.trim();
    if (!query) return;

    saveRecentSearch(query);
    setIsSearchFocused(false);

    router.push(`/search/articles?q=${encodeURIComponent(query)}`);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-black/10 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between gap-6 px-4 md:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <button
              type="button"
              onClick={() => dispatch(toggleSideBar())}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-black/60 transition hover:bg-black/[0.04] hover:text-black"
              aria-label="Toggle sidebar"
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
                  d="M4 7h16M4 12h16M4 17h16"
                />
              </svg>
            </button>

            <Link
              href="/"
              className="shrink-0 text-xl font-serif font-semibold tracking-tight text-black"
            >
              Letter
            </Link>

            <form
              ref={searchContainerRef}
              onSubmit={handleSearch}
              className="relative hidden w-full max-w-sm items-center rounded-full bg-black/[0.04] px-4 md:flex"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.7}
                stroke="currentColor"
                className="h-4 w-4 text-black/35"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-4.35-4.35m0 0A7.65 7.65 0 1 0 5.825 5.825a7.65 7.65 0 0 0 10.825 10.825Z"
                />
              </svg>

              <input
                type="text"
                placeholder="Search"
                value={searchText}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => setSearchText(e.target.value)}
                className="h-9 w-full bg-transparent px-3 text-sm text-black outline-none placeholder:text-black/35"
              />

              {isSearchFocused && recentSearches.length > 0 && (
                <div className="absolute left-0 top-11 z-50 w-full rounded-2xl border border-black/10 bg-white p-2 shadow-xl">
                  <div className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-black/40">
                    Recent searches
                  </div>

                  {recentSearches.map((item) => (
                    <div
                      key={item}
                      className="group flex items-center justify-between rounded-xl hover:bg-black/[0.04]"
                    >
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setSearchText(item);
                          saveRecentSearch(item);
                          setIsSearchFocused(false);
                          router.push(
                            `/search/articles?q=${encodeURIComponent(item)}`
                          );
                        }}
                        className="flex-1 px-3 py-2 text-left text-sm text-black/70"
                      >
                        {item}
                      </button>

                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => removeRecentSearch(item)}
                        className="mr-2 rounded-full px-2 py-1 text-xs text-black/35 opacity-0 transition hover:bg-black/10 hover:text-black group-hover:opacity-100"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </form>
          </div>

          <nav className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="text-sm text-black/55 transition hover:text-black"
            >
              Display
            </button>

            {isLoggedIn && (
              <Link
                href="/new-article"
                className="hidden text-sm text-black/55 transition hover:text-black md:inline"
              >
                Write
              </Link>
            )}

            {isCheckingAuth ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-black/10" />
            ) : !isLoggedIn ? (
              <>
                <Link
                  href="/sign-in"
                  className="text-sm text-black/55 transition hover:text-black"
                >
                  Sign in
                </Link>

                <Link
                  href="/sign-up"
                  className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-black/80"
                >
                  Start writing
                </Link>
              </>
            ) : (
              <div ref={profileRef} className="relative flex items-center">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-black text-xs font-medium text-white"
                  aria-label="Open profile menu"
                >
                  {me.avatarUrl ? (
                    <img
                      src={me.avatarUrl}
                      alt={me.fullName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    me.fullName?.charAt(0).toUpperCase()
                  )}
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 top-full z-50 mt-3">
                    <div className="w-48 rounded-xl border border-black/10 bg-white p-1 shadow-lg">
                      <Link
                        href={`/${me.slug}`}
                        onClick={() => setIsProfileOpen(false)}
                        className="block rounded-lg px-3 py-2 text-sm text-black/65 hover:bg-black/[0.04] hover:text-black"
                      >
                        Profile
                      </Link>

                      <Link
                        href="/settings"
                        onClick={() => setIsProfileOpen(false)}
                        className="block rounded-lg px-3 py-2 text-sm text-black/65 hover:bg-black/[0.04] hover:text-black"
                      >
                        Settings
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          localStorage.removeItem("accessToken");
                          window.location.reload();
                        }}
                        className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>
      </header>

      <AppSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}
