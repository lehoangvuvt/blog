"use client";

import { AnimatePresence, motion } from "framer-motion";

import { useAppDispatch, useAppSelector } from "@/store/hooks";

import {
    selectFont,
    selectFontSize,
    selectTheme,
} from "@/features/app-settings/selectors";

import {
    setFont,
    setFontSize,
    setTheme,
} from "@/features/app-settings/slice";

import type { Font, FontSize } from "../types";

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

export function AppSettingsModal({
    isOpen,
    onClose,
}: Props) {
    const dispatch = useAppDispatch();

    const theme = useAppSelector(selectTheme);
    const font = useAppSelector(selectFont);
    const fontSize =
        useAppSelector(selectFontSize);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={(e) =>
                        e.target ===
                            e.currentTarget && onClose()
                    }
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
                >
                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.96,
                            y: 20,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.96,
                            y: 20,
                        }}
                        transition={{
                            duration: 0.22,
                            ease: "easeOut",
                        }}
                        className="
                            flex
                            h-[70vh]
                            w-full
                            max-w-5xl
                            overflow-hidden
                            rounded-3xl
                            bg-white
                            shadow-2xl
                        "
                    >
                        {/* Left Panel */}
                        <div
                            className={`
                                h-full
                                overflow-y-auto
                                w-full
                                max-w-md
                                border-r
                                p-6
                                transition-all

                                ${
                                    theme === "dark"
                                        ? "border-zinc-800 bg-zinc-900 text-white"
                                        : "border-gray-200 bg-white text-black"
                                }
                            `}
                        >
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold">
                                    Cài đặt giao diện
                                </h2>

                                <p
                                    className={`mt-1 text-sm ${
                                        theme ===
                                        "dark"
                                            ? "text-zinc-400"
                                            : "text-gray-500"
                                    }`}
                                >
                                    Tùy chỉnh giao
                                    diện hiển thị
                                </p>
                            </div>

                            {/* Theme */}
                            <div className="mb-5">
                                <div className="mb-2 text-sm font-medium">
                                    Theme
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            dispatch(
                                                setTheme(
                                                    "light"
                                                )
                                            )
                                        }
                                        className={`
                                            rounded-xl border px-4 py-2 transition

                                            ${
                                                theme ===
                                                "light"
                                                    ? "border-black bg-black text-white"
                                                    : theme ===
                                                      "dark"
                                                    ? "border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700"
                                                    : "border-gray-300"
                                            }
                                        `}
                                    >
                                        Sáng
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            dispatch(
                                                setTheme(
                                                    "dark"
                                                )
                                            )
                                        }
                                        className={`
                                            rounded-xl border px-4 py-2 transition

                                            ${
                                                theme ===
                                                "dark"
                                                    ? "border-white bg-white text-black"
                                                    : "border-gray-300 bg-white text-black"
                                            }
                                        `}
                                    >
                                        Tối
                                    </button>
                                </div>
                            </div>

                            {/* Font */}
                            <div className="mb-5">
                                <div className="mb-2 text-sm font-medium">
                                    Phông chữ
                                </div>

                                <select
                                    value={font}
                                    onChange={(
                                        e
                                    ) =>
                                        dispatch(
                                            setFont(
                                                e
                                                    .target
                                                    .value as Font
                                            )
                                        )
                                    }
                                    className={`
                                        w-full rounded-xl border px-3 py-2 outline-none transition

                                        ${
                                            theme ===
                                            "dark"
                                                ? "border-zinc-700 bg-zinc-800 text-white"
                                                : "border-gray-300 bg-white text-black"
                                        }
                                    `}
                                >
                                    <option value="sans-serif">
                                        Sans Serif
                                    </option>

                                    <option value="serif">
                                        Serif
                                    </option>

                                    <option value="monospace">
                                        Monospace
                                    </option>
                                </select>
                            </div>

                            {/* Font Size */}
                            <div className="mb-6">
                                <div className="mb-2 text-sm font-medium">
                                    Cỡ chữ
                                </div>

                                <select
                                    value={
                                        fontSize
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        dispatch(
                                            setFontSize(
                                                e
                                                    .target
                                                    .value as FontSize
                                            )
                                        )
                                    }
                                    className={`
                                        w-full rounded-xl border px-3 py-2 outline-none transition

                                        ${
                                            theme ===
                                            "dark"
                                                ? "border-zinc-700 bg-zinc-800 text-white"
                                                : "border-gray-300 bg-white text-black"
                                        }
                                    `}
                                >
                                    <option value="small">
                                        Nhỏ
                                    </option>

                                    <option value="medium">
                                        Vừa
                                    </option>

                                    <option value="large">
                                        Lớn
                                    </option>
                                </select>
                            </div>

                            {/* Actions */}
                            <div className="mt-8 flex gap-3">
                                <button
                                    type="button"
                                    onClick={
                                        onClose
                                    }
                                    className={`
                                        w-1/2 rounded-xl border px-4 py-3 transition

                                        ${
                                            theme ===
                                            "dark"
                                                ? "border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700"
                                                : "border-gray-300 bg-white text-black hover:bg-gray-100"
                                        }
                                    `}
                                >
                                    Hủy
                                </button>

                                <button
                                    type="button"
                                    className={`
                                        w-1/2 rounded-xl px-4 py-3 font-medium transition

                                        ${
                                            theme ===
                                            "dark"
                                                ? "bg-white text-black hover:bg-zinc-200"
                                                : "bg-black text-white hover:bg-zinc-800"
                                        }
                                    `}
                                >
                                    Lưu
                                </button>
                            </div>
                        </div>

                        {/* Right Preview */}
                        <div
                            className={`
                                flex flex-1 justify-center overflow-hidden p-6 transition-all

                                ${
                                    theme ===
                                    "dark"
                                        ? "bg-zinc-950 text-white"
                                        : "bg-zinc-100 text-black"
                                }

                                ${
                                    font ===
                                    "serif"
                                        ? "font-serif"
                                        : font ===
                                          "monospace"
                                        ? "font-mono"
                                        : "font-sans"
                                }

                                ${
                                    fontSize ===
                                    "small"
                                        ? "text-sm"
                                        : fontSize ===
                                          "large"
                                        ? "text-lg"
                                        : "text-base"
                                }
                            `}
                        >
                            <div className="h-full w-full max-w-2xl overflow-y-auto rounded-3xl pr-2">
                                <article
                                    className={`
                                        rounded-3xl p-6

                                        ${
                                            theme ===
                                            "dark"
                                                ? "bg-zinc-900"
                                                : "bg-white"
                                        }
                                    `}
                                >
                                    <div
                                        className={`
                                            mb-3 inline-flex rounded-full px-3 py-1 text-xs font-medium

                                            ${
                                                theme ===
                                                "dark"
                                                    ? "bg-white/10 text-zinc-300"
                                                    : "bg-black/5 text-zinc-600"
                                            }
                                        `}
                                    >
                                        Công nghệ
                                    </div>

                                    <h1 className="mb-3 text-3xl font-bold leading-tight">
                                        Xây dựng trải
                                        nghiệm blog
                                        hiện đại
                                    </h1>

                                    <div
                                        className={`
                                            mb-6 flex items-center gap-3 text-sm

                                            ${
                                                theme ===
                                                "dark"
                                                    ? "text-zinc-400"
                                                    : "text-zinc-500"
                                            }
                                        `}
                                    >
                                        <div
                                            className={`
                                                h-9 w-9 rounded-full

                                                ${
                                                    theme ===
                                                    "dark"
                                                        ? "bg-zinc-700"
                                                        : "bg-zinc-300"
                                                }
                                            `}
                                        />

                                        <div>
                                            <div className="font-medium">
                                                Nguyễn
                                                Văn A
                                            </div>

                                            <div>
                                                12
                                                tháng
                                                5,
                                                2026
                                                · 8
                                                phút
                                                đọc
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-5 leading-7">
                                        <p className="opacity-90">
                                            Kiến
                                            trúc
                                            frontend
                                            hiện
                                            đại đã
                                            thay
                                            đổi rất
                                            nhiều
                                            với sự
                                            phát
                                            triển
                                            của
                                            Next.js.
                                        </p>

                                        <p className="opacity-90">
                                            Redux
                                            Toolkit
                                            giúp
                                            quản lý
                                            state
                                            đơn
                                            giản
                                            hơn và
                                            cải
                                            thiện
                                            khả
                                            năng mở
                                            rộng.
                                        </p>

                                        <blockquote
                                            className={`
                                                rounded-2xl border-l-4 p-4 italic

                                                ${
                                                    theme ===
                                                    "dark"
                                                        ? "border-white/20 bg-white/5"
                                                        : "border-black/20 bg-black/5"
                                                }
                                            `}
                                        >
                                            “Một
                                            kiến
                                            trúc
                                            tốt nằm
                                            ở tính
                                            rõ ràng
                                            và dễ
                                            bảo
                                            trì.”
                                        </blockquote>
                                    </div>
                                </article>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}