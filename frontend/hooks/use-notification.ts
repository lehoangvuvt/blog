import { NotificationContext } from "@/shared/providers/notification-provider";
import { useContext } from "react";

export function useNotification() {
  const { pushNotification } = useContext(NotificationContext);

  return {
    pushNotification,
  };
}
