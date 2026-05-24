import type { Metadata } from "next";
import { Crimson_Text, IBM_Plex_Sans } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";
import { Suspense } from "react";
const plexSans = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  display: "swap",
});
const crimson = Crimson_Text({
  variable: "--font-book",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});
export const metadata: Metadata = {
  title: "The Midnight Letters",
  description: "A quiet place for late thoughts and midnight letters",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="vi"
      className={`${plexSans.variable} ${crimson.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)] font-sans">
        <Suspense>
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  );
}
