import type { Metadata } from "next";
import { Inter, Literata } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";
import { Suspense } from "react";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const literata = Literata({
  variable: "--font-serif",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Stories",
  description: "A place to write, read, and connect",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} ${literata.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-neutral-900 font-sans">
        <Suspense>
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  );
}
