"use client";

import { useEffect, useState } from "react";

export type Heading = {
  id: string;
  text: string;
  level: number;
};

export default function HeadingNavigation({
  headings,
}: {
  headings: Heading[];
}) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const headingElements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter(Boolean) as HTMLElement[];

    if (!headingElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              headingElements.indexOf(a.target as HTMLElement) -
              headingElements.indexOf(b.target as HTMLElement)
          );

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -65% 0px",
        threshold: 0.1,
      }
    );

    for (const headingEle of headingElements) {
      observer.observe(headingEle);
    }

    return () => observer.disconnect();
  }, [headings]);

  return (
    <aside className="hidden xl:block">
      <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto border-l border-black/5 pl-5 pr-2">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-400">
          On this page
        </p>

        <nav className="space-y-1">
          {headings.map((heading) => {
            const isActive = activeId === heading.id;

            return (
              <a
                key={heading.id}
                href={`#${heading.id}`}
                className={`
              relative block rounded-md py-1 text-sm leading-6 transition-all duration-300
              ${
                isActive
                  ? "translate-x-1 font-medium text-black"
                  : "text-neutral-500 hover:text-black"
              }
              ${heading.level === 3 ? "pl-4" : ""}
              ${heading.level >= 4 ? "pl-8" : ""}
            `}
              >
                {isActive && (
                  <span className="absolute top-0 left-[-21px] h-full w-[2px] rounded-full bg-black" />
                )}

                {heading.text}
              </a>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
