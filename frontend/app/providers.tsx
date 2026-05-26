"use client";

import AuthProvider from "@/shared/providers/auth-provider";
import NotificationProvider from "@/shared/providers/notification-provider";
import QueryProvider from "@/shared/providers/query-provider";
import ReduxProvider from "@/shared/providers/redux-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <QueryProvider>
        <AuthProvider>
          <NotificationProvider>{children}</NotificationProvider>
        </AuthProvider>
      </QueryProvider>
    </ReduxProvider>
  );
}
