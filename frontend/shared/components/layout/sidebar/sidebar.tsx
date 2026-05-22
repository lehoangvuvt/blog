"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { selectSideBarStatus } from "@/features/app-settings/selectors";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSideBarState } from "@/features/app-settings/slice"; // adjust path
import { useMe } from "@/features/auth/hooks/use-me";

const sidebarItems = [
  { label: "Explore", href: "/", needAuth: false },
  { label: "Following", href: "/following/writters", needAuth: true },
  { label: "Saved", href: "/saved-posts", needAuth: true },
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

  if (isAuthenticating) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => dispatch(setSideBarState({ isOpen: false }))}
        className={`
          fixed inset-0 top-16 z-30 bg-black/20 transition-opacity duration-300 md:hidden
          ${isOpenSideBar ? "opacity-100" : "pointer-events-none opacity-0"}
        `}
      />

      <aside
        className={`
        fixed top-16 bottom-0 left-0 z-40
        w-[72vw] max-w-72 border-r border-black/[0.07] bg-[#fdfcf9]
        transition-transform duration-300 ease-out
        md:w-64 md:max-w-none

        ${isOpenSideBar ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex h-full flex-col px-5 py-7">
          <div className="mb-8 px-1">
            <p className="font-serif text-2xl font-semibold tracking-tight text-black">
              Library
            </p>

            <p className="mt-1 max-w-47.5 text-sm leading-5 text-black/45">
              Essays, drafts, and saved ideas.
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
                    block border-l py-2.5 pl-4 text-[15px] transition-colors
                    ${
                      isActive
                        ? "border-black font-medium text-black"
                        : "border-transparent text-black/45 hover:border-black/20 hover:text-black"
                    }
                  `}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-black/[0.07] pt-5">
            <p className="text-xs uppercase tracking-[0.18em] text-black/30">
              Reading
            </p>

            <p className="mt-3 font-serif text-base leading-6 text-black">
              Notes for thoughtful people.
            </p>

            <p className="mt-2 text-sm leading-5 text-black/40">
              A quiet space for long-form writing.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
