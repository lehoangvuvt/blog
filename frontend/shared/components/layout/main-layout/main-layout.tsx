"use client";

import Header from "@/shared/components/layout/header/header";
import Sidebar from "@/shared/components/layout/sidebar/sidebar";

import {
  selectSideBarStatus,
  selectTheme,
} from "@/features/app-settings/selectors";

import { useAppSelector } from "@/store/hooks";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isOpenSideBar = useAppSelector(selectSideBarStatus);

  const theme = useAppSelector(selectTheme);

  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-zinc-950 text-white" : "bg-white text-black"
      }`}
    >
      <Header />

      <Sidebar />

      <main
        className={`
        pt-10 transition-all duration-300 ease-in-out
        pl-0
        ${isOpenSideBar ? "md:pl-60" : "md:pl-0"}
      `}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
