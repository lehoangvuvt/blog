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
          fixed inset-y-0 left-0 z-[100]
          w-[76vw] max-w-80 border-r border-[var(--midnight-border)]/70
          bg-[var(--midnight-bg)] text-[var(--midnight-text)]
          shadow-[24px_0_80px_rgba(0,0,0,0.38)]
          transition-transform duration-300 ease-out
          md:w-72 md:max-w-none

          ${isOpenSideBar ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex h-screen flex-col px-6 py-8">
          <div className="mb-10 border-b border-[var(--midnight-border)]/70 pb-8">
            <p className="text-xs tracking-[0.16em] text-[var(--midnight-soft)]">
              The Midnight Letters
            </p>

            <p className="mt-4 text-2xl font-bold leading-tight tracking-[-0.045em] text-[var(--midnight-text)]">
              Letter desk
            </p>

            <p className="mt-3 text-sm leading-6 text-[var(--midnight-muted)]">
              Fragments, essays, and notes written after dark.
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
                    block border-l px-4 py-3 text-[15px] transition-colors
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

          <div className="mt-auto border-t border-[var(--midnight-border)]/70 pt-6">
            <p className="text-xs tracking-[0.16em] text-[var(--midnight-soft)]">
              Midnight margin
            </p>

            <p className="mt-3 text-sm leading-6 text-[var(--midnight-muted)]">
              Read slowly. Write honestly. Leave a trace.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
