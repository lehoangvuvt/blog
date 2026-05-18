"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const AUTH_PAGES = ["/sign-in", "/signin", "/login", "/sign-up", "/signup", "/register"];

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const isAuthPage = AUTH_PAGES.includes(pathname);

    if (token && isAuthPage) {
      router.replace("/");
    }
  }, [pathname, router]);

  return <>{children}</>;
}
