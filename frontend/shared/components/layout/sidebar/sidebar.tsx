"use client";

import { selectSideBarStatus } from "@/features/app-settings/selectors";
import { useAppSelector } from "@/store/hooks";

export default function Sidebar() {
  const isOpenSideBar = useAppSelector(selectSideBarStatus);

  return (
    <aside
      className={`
                    fixed ${
                      !isOpenSideBar ? `-left-60` : `left-0`
                    } top-16 bottom-0
                    z-40
                    w-60
                    border-r border-zinc-200 delay-50 duration-300 ease-in-out transition-all
                    bg-white
                `}
    >
      <div className="p-4">Sidebar</div>
    </aside>
  );
}
