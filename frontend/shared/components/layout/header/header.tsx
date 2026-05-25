/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Menu,
  MoonStar,
  Search,
  Settings2,
  User2,
  PenSquare,
  LogOut,
  X,
} from "lucide-react";

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

    router.push(`/search/letters?q=${encodeURIComponent(query)}`);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-[var(--midnight-border)]/70 bg-[rgba(14,17,22,0.82)] text-[var(--midnight-text)] shadow-[0_18px_50px_rgba(0,0,0,0.24)] backdrop-blur-2xl">
        <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between gap-3 px-3 md:gap-5 md:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-2 md:gap-4">
            <button
              type="button"
              onClick={() => dispatch(toggleSideBar())}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--midnight-muted)] transition-all duration-300 hover:bg-[var(--midnight-code-bg)] hover:text-[var(--midnight-accent-hover)]"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>

            <Link href="/" className="flex min-w-0 shrink items-center gap-2">
              <MoonStar className="h-4 w-4 shrink-0 text-[var(--midnight-accent)]/80" />

              <span className="hidden truncate text-lg font-bold tracking-[-0.04em] text-[var(--midnight-text)] sm:block">
                The Midnight Letters
              </span>

              <span className="truncate text-sm font-bold tracking-[-0.04em] text-[var(--midnight-text)] sm:hidden">
                The Midnight Letters
              </span>
            </Link>

            <form
              ref={searchContainerRef}
              onSubmit={handleSearch}
              className="relative hidden w-full max-w-sm items-center rounded-full border border-[var(--midnight-border)]/70 bg-[var(--midnight-code-bg)] px-4 md:flex"
            >
              <Search className="h-4 w-4 text-[var(--midnight-soft)]" />

              <input
                type="text"
                placeholder="Search letters after dark"
                value={searchText}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => setSearchText(e.target.value)}
                className="h-10 w-full bg-transparent px-3 text-sm text-[var(--midnight-text)] outline-none placeholder:text-[var(--midnight-muted)]"
              />

              {isSearchFocused && recentSearches.length > 0 && (
                <div className="absolute left-0 top-12 z-50 w-full overflow-hidden rounded-2xl border border-[var(--midnight-border)]/70 bg-[var(--midnight-surface)] p-2 shadow-[0_28px_90px_rgba(0,0,0,0.38)]">
                  <div className="px-3 py-2 text-xs tracking-[0.14em] text-[var(--midnight-soft)]">
                    Recent searches
                  </div>

                  {recentSearches.map((item) => (
                    <div
                      key={item}
                      className="group flex items-center justify-between rounded-xl transition-colors hover:bg-[var(--midnight-code-bg)]"
                    >
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setSearchText(item);
                          saveRecentSearch(item);
                          setIsSearchFocused(false);
                          router.push(
                            `/search/letters?q=${encodeURIComponent(item)}`
                          );
                        }}
                        className="flex-1 px-3 py-2 text-left text-sm text-[var(--midnight-text)]"
                      >
                        {item}
                      </button>

                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => removeRecentSearch(item)}
                        className="mr-2 flex h-7 w-7 items-center justify-center rounded-full text-[var(--midnight-soft)] opacity-0 transition-all hover:bg-[var(--midnight-surface-soft)] hover:text-[var(--midnight-accent-hover)] group-hover:opacity-100"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </form>
          </div>

          <nav className="flex shrink-0 items-center gap-2 md:gap-3">
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="hidden items-center gap-2 text-sm text-[var(--midnight-muted)] transition hover:text-[var(--midnight-accent-hover)] sm:flex"
            >
              <Settings2 className="h-4 w-4" />
              <span className="hidden md:inline">Reading mood</span>
            </button>

            {isLoggedIn && (
              <Link
                href="/new-article"
                className="hidden items-center gap-2 text-sm text-[var(--midnight-muted)] transition hover:text-[var(--midnight-accent-hover)] md:flex"
              >
                <PenSquare className="h-4 w-4" />
                Write a letter
              </Link>
            )}

            {isCheckingAuth ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-[var(--midnight-code-bg)]" />
            ) : !isLoggedIn ? (
              <>
                <Link
                  href="/sign-in"
                  className="hidden text-sm text-[var(--midnight-muted)] transition hover:text-[var(--midnight-accent-hover)] sm:inline"
                >
                  Sign in
                </Link>

                <Link
                  href="/sign-up"
                  className="rounded-full bg-[var(--midnight-accent)] px-3 py-2 text-sm font-medium text-[var(--midnight-on-accent)] transition hover:opacity-90 sm:px-4"
                >
                  <span className="sm:hidden">Join</span>
                  <span className="hidden sm:inline">Join the letters</span>
                </Link>
              </>
            ) : (
              <div ref={profileRef} className="relative flex items-center">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-[var(--midnight-border)]/70 bg-[var(--midnight-code-bg)] text-xs font-medium text-[var(--midnight-accent)]"
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
                    <div className="w-56 overflow-hidden rounded-2xl border border-[var(--midnight-border)]/70 bg-[var(--midnight-surface)] p-2 shadow-[0_28px_90px_rgba(0,0,0,0.38)]">
                      <div className="border-b border-[var(--midnight-border)]/70 px-3 py-3">
                        <p className="text-sm font-medium text-[var(--midnight-text)]">
                          {me.fullName}
                        </p>

                        <p className="mt-1 text-xs text-[var(--midnight-soft)]">
                          @{me.slug}
                        </p>
                      </div>

                      <div className="mt-2 space-y-1">
                        <Link
                          href={`/${me.slug}`}
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[var(--midnight-text)] transition-colors hover:bg-[var(--midnight-code-bg)] hover:text-[var(--midnight-accent-hover)]"
                        >
                          <User2 className="h-4 w-4" />
                          Profile
                        </Link>

                        <Link
                          href="/settings"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[var(--midnight-text)] transition-colors hover:bg-[var(--midnight-code-bg)] hover:text-[var(--midnight-accent-hover)]"
                        >
                          <Settings2 className="h-4 w-4" />
                          Settings
                        </Link>

                        <button
                          type="button"
                          onClick={() => {
                            localStorage.removeItem("accessToken");
                            window.location.reload();
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-[var(--midnight-muted)] transition-colors hover:bg-[var(--midnight-code-bg)] hover:text-red-300"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign out
                        </button>
                      </div>
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
