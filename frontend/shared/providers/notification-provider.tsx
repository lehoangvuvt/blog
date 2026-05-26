"use client";

import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type NotificationType = "success" | "info" | "error";

type NotificationItem = {
  id: string;
  message: string;
  type: NotificationType;
};

export type NotificationCtx = {
  notifications: NotificationItem[];
  pushNotification: (message: string, type?: NotificationType) => void;
  removeNotification: (id: string) => void;
};

export const NotificationContext = createContext<NotificationCtx>({
  notifications: [],
  pushNotification: () => {},
  removeNotification: () => {},
});

const notificationStyles: Record<NotificationType, string> = {
  success:
    "border-[var(--midnight-border)]/70 bg-[var(--midnight-surface)]/95 text-[var(--midnight-text)]",
  info: "border-[var(--midnight-border)]/70 bg-[var(--midnight-surface)]/95 text-[var(--midnight-text)]",
  error:
    "border-red-400/20 bg-[var(--midnight-surface)]/95 text-[var(--midnight-text)]",
};

const accentStyles: Record<NotificationType, string> = {
  success: "bg-[var(--midnight-accent)]",
  info: "bg-[var(--midnight-soft)]",
  error: "bg-red-300",
};

export default function NotificationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const pushNotification = useCallback(
    (message: string, type: NotificationType = "info") => {
      const id = crypto.randomUUID();

      setNotifications((prev) => [
        ...prev,
        {
          id,
          message,
          type,
        },
      ]);

      window.setTimeout(() => {
        removeNotification(id);
      }, 3200);
    },
    [removeNotification]
  );

  const value = useMemo(
    () => ({
      notifications,
      pushNotification,
      removeNotification,
    }),
    [notifications, pushNotification, removeNotification]
  );

  return (
    <NotificationContext.Provider value={value}>
      <div className="pointer-events-none fixed left-1/2 top-5 z-[1000] flex w-[min(520px,calc(100vw-24px))] -translate-x-1/2 flex-col gap-3">
        {notifications.map((item) => (
          <div
            key={item.id}
            className={[
              "group relative overflow-hidden rounded-2xl border",
              "backdrop-blur-xl",
              "animate-in fade-in slide-in-from-top-3 duration-500",
              "shadow-[0_18px_60px_rgba(0,0,0,0.28)]",
              notificationStyles[item.type],
            ].join(" ")}
          >
            <div
              className={`absolute left-0 top-0 h-full w-[2px] ${
                accentStyles[item.type]
              }`}
            />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_60%)]" />

            <div className="relative flex items-start gap-4 px-5 py-4">
              <div
                className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${
                  accentStyles[item.type]
                }`}
              />

              <div className="flex-1">
                <p className="font-serif text-[15px] leading-6 tracking-[0.01em] text-[var(--midnight-text)]">
                  {item.message}
                </p>
              </div>

              <button
                type="button"
                onClick={() => removeNotification(item.id)}
                className="pointer-events-auto -mr-1 flex h-7 w-7 items-center justify-center rounded-full text-[var(--midnight-muted)] transition hover:bg-[var(--midnight-code-bg)] hover:text-[var(--midnight-text)]"
                aria-label="Close notification"
              >
                ×
              </button>
            </div>

            <div className="absolute bottom-0 left-0 h-[1px] w-full overflow-hidden bg-[var(--midnight-border)]/50">
              <div className="h-full w-full origin-left animate-[midnight-progress_3.2s_linear_forwards] bg-[var(--midnight-accent)]/45" />
            </div>
          </div>
        ))}
      </div>

      {children}
    </NotificationContext.Provider>
  );
}
