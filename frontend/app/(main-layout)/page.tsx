"use client";

import MainLayout from "@/shared/components/layout/main-layout/main-layout";
import { useState } from "react";
import { DefaultTemplate } from "@/features/editor/components/default-template";

export default function Home() {
  const [isSettingsOpen, setSettingsOpen] = useState(true);

  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <MainLayout>
        <main className="mx-auto max-w-5xl p-8">
          <DefaultTemplate />
        </main>
      </MainLayout>
    </div>
  );
}
