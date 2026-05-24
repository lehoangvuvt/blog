"use client";

import Header from "@/shared/components/layout/header/header";
import Sidebar from "@/shared/components/layout/sidebar/sidebar";

import {
  selectSideBarStatus,
  selectSignInModalStatus,
} from "@/features/app-settings/selectors";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import SignInModal from "@/features/auth/components/sign-in-modal";
import { setSignInModalState } from "@/features/app-settings/slice";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isOpenSideBar = useAppSelector(selectSideBarStatus);
  const isOpenSignInModal = useAppSelector(selectSignInModalStatus);
  const dispatch = useAppDispatch();

  const closeSignInModal = () => {
    dispatch(setSignInModalState({ isOpen: false }));
  };

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
      <SignInModal
        open={isOpenSignInModal}
        onClose={() => closeSignInModal()}
      />
    </div>
  );
}
