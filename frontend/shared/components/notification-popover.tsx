"use client";

import type { NotificationItem } from "@/hooks/use-notification";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Info, X } from "lucide-react";
import { useEffect } from "react";

type Props = {
  notifications: NotificationItem[];
  timeout?: number;
  onClose: (id: string) => void;
};

const meta = {
  success: {
    label: "Success",
    className: "border-l-black",
    icon: Check,
  },

  error: {
    label: "Error",
    className: "border-l-neutral-500",
    icon: X,
  },

  info: {
    label: "Info",
    className: "border-l-neutral-300",
    icon: Info,
  },
};

export default function NotificationPopover({
  notifications,
  timeout = 3000,
  onClose,
}: Props) {
  useEffect(() => {
    if (notifications.length === 0) return;

    const timers = notifications.map((notification) =>
      setTimeout(() => {
        onClose(notification.id);
      }, timeout)
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [notifications, timeout, onClose]);

  return (
    <div className="pointer-events-none fixed left-1/2 top-5 z-1000 flex -translate-x-1/2 flex-col gap-3">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => {
          const Icon = meta[notification.type].icon;

          return (
            <motion.div
              key={notification.id}
              layout
              initial={{
                opacity: 0,
                y: -24,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: -16,
                scale: 0.96,
              }}
              transition={{
                duration: 0.22,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`
                                pointer-events-auto
                                min-w-[320px]
                                rounded-2xl border border-black/10 border-l-4
                                bg-white/95 px-4 py-3
                                shadow-[0_8px_30px_rgba(0,0,0,0.08)]
                                backdrop-blur-xl
                                dark:border-white/10
                                dark:bg-neutral-900/95
                                ${meta[notification.type].className}`}
            >
              <div className="flex items-start gap-3">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: 0.05,
                    duration: 0.2,
                  }}
                  className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/10 bg-black/[0.03] dark:border-white/10 dark:bg-white/[0.03]"
                >
                  <Icon
                    size={16}
                    className="text-neutral-500 dark:text-neutral-400"
                  />
                </motion.div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">
                        {meta[notification.type].label}
                      </span>
                    </div>

                    <div className="h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                  </div>

                  <p className="mt-1 text-sm font-medium leading-relaxed text-black dark:text-white">
                    {notification.message}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onClose(notification.id)}
                  className="pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full text-neutral-400 transition hover:bg-black/[0.04] hover:text-black dark:hover:bg-white/[0.06] dark:hover:text-white"
                >
                  <X size={14} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
