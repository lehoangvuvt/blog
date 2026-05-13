'use client'

import Header from "@/shared/components/layout/header/header";
import Sidebar from "@/shared/components/layout/sidebar/sidebar";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-zinc-100">
            <Header />
            <Sidebar />
            <main className="pl-60 pt-10">
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}