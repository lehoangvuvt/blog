export default function EmptyState({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-neutral-200 py-20 text-center text-neutral-500">
      <div className="mb-3 text-neutral-400">{icon}</div>
      <p className="text-sm">{title}</p>
    </div>
  );
}
