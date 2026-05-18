import AuthProvider from "@/shared/providers/auth-provider";
import QueryProvider from "@/shared/providers/query-provider";
import ReduxProvider from "@/shared/providers/redux-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <QueryProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </QueryProvider>
    </ReduxProvider>
  );
}