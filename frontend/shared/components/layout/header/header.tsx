"use client";

import { toggleSideBar } from "@/features/app-settings/slice";
import { useAppDispatch } from "@/store/hooks";
import Link from "next/link";

export default function Header() {
  const dispatch = useAppDispatch();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-black/10 bg-white/80 backdrop-blur-xl">
      <div className="w-full h-full px-3 md:px-5 lg:px-6 flex items-center justify-between gap-6">
        <div className="flex items-center gap-4 flex-1">
          <button
            type="button"
            onClick={() => dispatch(toggleSideBar())}
            className="w-10 h-10 rounded-xl hover:bg-black/5 flex items-center justify-center transition shrink-0"
            aria-label="Toggle sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 text-black/80"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5m-16.5 5.25h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center text-xl font-serif shadow-sm">
              M
            </div>

            <span className="text-2xl font-serif tracking-tight text-black">
              Medium
            </span>
          </Link>

          <div className="hidden md:flex items-center bg-[#F9F9F9] border border-black/5 rounded-full px-4 h-11 max-w-md w-full transition focus-within:bg-white focus-within:shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="w-5 h-5 text-black/40"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-4.35-4.35m0 0A7.65 7.65 0 1 0 5.825 5.825a7.65 7.65 0 0 0 10.825 10.825Z"
              />
            </svg>

            <input
              type="text"
              placeholder="Search Medium"
              className="w-full bg-transparent outline-none px-3 text-sm placeholder:text-black/40"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/new-article"
            type="button"
            className="hidden md:flex items-center gap-2 h-10 px-4 rounded-full border border-black/10 hover:bg-black/5 transition text-sm text-black/70 hover:text-black"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Write
          </Link>

          <a
            href="/sign-in"
            className="text-sm text-black/70 hover:text-black transition"
          >
            Sign in
          </a>

          <a
            href="/sign-up"
            className="h-10 px-5 rounded-full bg-black text-white text-sm font-medium flex items-center justify-center hover:opacity-90 transition"
          >
            Get started
          </a>
        </div>
      </div>
    </header>
  );
}
