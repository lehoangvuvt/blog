"use client";

import Loading from "@/shared/components/loading";
import AuthProvider from "@/shared/providers/auth-provider";
import QueryProvider from "@/shared/providers/query-provider";
import ReduxProvider from "@/shared/providers/redux-provider";
import { useEffect, useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  // const [showInitialLoading, setShowInitialLoading] = useState(true);

  // useEffect(() => {
  //   setTimeout(() => setShowInitialLoading(false), 2500);
  // }, []);

  return (
    <ReduxProvider>
      <QueryProvider>
        {/* {showInitialLoading && (
          <div className="fixed top-0 bottom-0 left-0 right-0 z-1000">
            <Loading />
          </div>
        )} */}
        <AuthProvider>{children}</AuthProvider>
      </QueryProvider>
    </ReduxProvider>
  );
}
