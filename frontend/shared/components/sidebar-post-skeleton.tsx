export function SidebarPostSkeleton() {
  return (
    <div className="flex animate-pulse gap-4">
      <div className="h-4 w-5 rounded bg-neutral-200" />

      <div className="flex-1 space-y-3">
        <div className="h-4 w-full rounded bg-neutral-200" />
        <div className="h-4 w-4/5 rounded bg-neutral-200" />
        <div className="h-3 w-24 rounded bg-neutral-200" />
      </div>
    </div>
  );
}
