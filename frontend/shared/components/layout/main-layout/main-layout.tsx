"use client";

import { selectSideBarStatus } from "@/features/app-settings/selectors";
import Header from "@/shared/components/layout/header/header";
import Sidebar from "@/shared/components/layout/sidebar/sidebar";
import { useAppSelector } from "@/store/hooks";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isOpenSideBar = useAppSelector(selectSideBarStatus);

  return (
    <div className="min-h-screen">
      <Header />
      <Sidebar />
      <main
        className={`${
          isOpenSideBar ? `pl-60` : `pl-0`
        } pt-10 delay-50 duration-300 ease-in-out transition-all`}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
