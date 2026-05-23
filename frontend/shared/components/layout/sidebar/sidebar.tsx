"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { selectSideBarStatus } from "@/features/app-settings/selectors";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSideBarState } from "@/features/app-settings/slice";
import { useMe } from "@/features/auth/hooks/use-me";

const sidebarItems = [
  { label: "Latest letters", href: "/", needAuth: false },
  { label: "Following", href: "/following/writters", needAuth: true },
  { label: "Saved letters", href: "/saved-posts", needAuth: true },
];

export default function Sidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const isOpenSideBar = useAppSelector(selectSideBarStatus);
  const { data: me, isLoading, isFetching } = useMe();

  const isAuthenticating = isLoading || isFetching;
  const isLoggedIn = Boolean(me);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    if (isMobile) {
      dispatch(setSideBarState({ isOpen: false }));
    }
  }, [dispatch]);

  if (isAuthenticating) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => dispatch(setSideBarState({ isOpen: false }))}
        className={`
          fixed inset-0 z-[90] bg-black/60 backdrop-blur-[2px] transition-opacity duration-300 md:hidden
          ${isOpenSideBar ? "opacity-100" : "pointer-events-none opacity-0"}
        `}
        aria-label="Close sidebar"
      />

      <aside
        className={`
    fixed left-0 top-16 z-40
    h-[calc(100vh-4rem)]
    w-[76vw] max-w-72
    border-r border-[var(--midnight-border)]/70
    bg-[var(--midnight-bg)]/96
    text-[var(--midnight-text)]
    backdrop-blur-2xl
    transition-transform duration-300 ease-out
    md:w-64 md:max-w-none

    ${isOpenSideBar ? "translate-x-0" : "-translate-x-full"}
  `}
      >
        <div className="flex h-full flex-col px-5 py-6">
          <div className="mb-7 border-b border-[var(--midnight-border)]/70 pb-5">
            <p className="text-xs tracking-[0.14em] text-[var(--midnight-soft)]">
              The Midnight Letters
            </p>

            <p className="mt-3 text-sm leading-6 text-[var(--midnight-muted)]">
              Thoughts written after dark.
            </p>
          </div>

          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              if (item.needAuth && !isLoggedIn) return null;

              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
              block border-l px-4 py-2.5 text-[15px] transition-colors
              ${
                isActive
                  ? "border-[var(--midnight-accent)] text-[var(--midnight-text)]"
                  : "border-transparent text-[var(--midnight-muted)] hover:border-[var(--midnight-border-strong)] hover:text-[var(--midnight-text)]"
              }
            `}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-[var(--midnight-border)]/70 pt-5">
            <p className="text-sm leading-6 text-[var(--midnight-muted)]">
              Read slowly. Leave a trace.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
