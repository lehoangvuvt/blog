"use client";

import { useEffect, useState } from "react";
import { ListTree } from "lucide-react";

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
        rootMargin: "-18% 0px -70% 0px",
        threshold: 0.1,
      }
    );

    for (const headingElement of headingElements) {
      observer.observe(headingElement);
    }

    return () => observer.disconnect();
  }, [headings]);

  return (
    <aside className="hidden xl:block">
      <div className="sticky top-28 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-[var(--midnight-border)]/70 bg-[var(--midnight-surface)]/45 p-4 backdrop-blur-xl">
        <div className="mb-4 flex items-center gap-2 text-xs tracking-[0.14em] text-[var(--midnight-soft)]">
          <ListTree className="h-3.5 w-3.5 text-[var(--midnight-accent)]/80" />
          <span>Thread of thought</span>
        </div>

        <nav className="space-y-1 border-l border-[var(--midnight-border)]/70">
          {headings.map((heading) => {
            const isActive = activeId === heading.id;

            return (
              <a
                key={heading.id}
                href={`#${heading.id}`}
                className={`
                  relative block rounded-r-lg py-1.5 pr-2 text-sm leading-6 transition-all duration-300
                  ${
                    isActive
                      ? "bg-[var(--midnight-code-bg)] text-[var(--midnight-accent-hover)]"
                      : "text-[var(--midnight-muted)] hover:bg-[var(--midnight-code-bg)]/70 hover:text-[var(--midnight-text)]"
                  }
                  ${heading.level === 3 ? "pl-5" : "pl-4"}
                  ${heading.level >= 4 ? "pl-8" : ""}
                `}
              >
                {isActive && (
                  <span className="absolute left-[-1px] top-1/2 h-5 w-px -translate-y-1/2 bg-[var(--midnight-accent)]" />
                )}

                <span className="line-clamp-2">{heading.text}</span>
              </a>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
