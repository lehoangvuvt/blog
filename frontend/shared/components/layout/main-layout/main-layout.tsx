"use client";

import Header from "@/shared/components/layout/header/header";
import Sidebar from "@/shared/components/layout/sidebar/sidebar";

import { selectSideBarStatus } from "@/features/app-settings/selectors";

import { useAppSelector } from "@/store/hooks";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isOpenSideBar = useAppSelector(selectSideBarStatus);

  return (
    <div className="min-h-screen bg-transparent text-[var(--midnight-text)] transition-colors duration-300">
      <Header />

      <Sidebar />

      <main
        className={`
        pt-10 transition-all duration-300 ease-in-out
        pl-0
        ${isOpenSideBar ? "md:pl-64" : "md:pl-0"}
      `}
      >
        <div>{children}</div>
      </main>
    </div>
  );
}
