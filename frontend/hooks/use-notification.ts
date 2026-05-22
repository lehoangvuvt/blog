"use client";

import { useState } from "react";

export type NotificationItem = {
  id: string;
  message: string;
  type: "success" | "error" | "info";
};

export default function useNotification() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const open = (
    message: string,
    type: "success" | "error" | "info" = "info",
  ) => {
    const id = crypto.randomUUID();

    setNotifications((prev) => [
      ...prev,
      {
        id,
        message,
        type,
      },
    ]);
  };

  const close = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  };

  const clear = () => {
    setNotifications([]);
  };

  return {
    notifications,
    open,
    close,
    clear,
  };
}
