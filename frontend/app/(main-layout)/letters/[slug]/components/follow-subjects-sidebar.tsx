"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type Tag = {
  id: string | number;
  name: string;
  slug?: string;
};

export default function FollowSubjectsSidebar({ tags }: { tags: Tag[] }) {
  if (!tags.length) return null;

  return (
    <aside className="hidden xl:block">
      <div className="sticky top-28">
        <div className="border-l border-[var(--midnight-border)]/70 pl-5">
          <p className="text-xs tracking-[0.16em] text-[var(--midnight-soft)]">
            In this letter
          </p>

          <p className="mt-3 text-sm leading-6 text-[var(--midnight-muted)]">
            Follow subjects that keep appearing in your reading.
          </p>

          <div className="mt-5 space-y-1">
            {tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/subjects/${tag.slug ?? tag.name}`}
                className="group flex items-center justify-between py-2 text-sm text-[var(--midnight-muted)] transition hover:text-[var(--midnight-text)]"
              >
                <span className="truncate">#{tag.name}</span>

                <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}