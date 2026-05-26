export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center overflow-hidden bg-[var(--background)]">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-24 w-24 rounded-full border border-[var(--midnight-border)]/40" />

        <div className="absolute h-16 w-16 rounded-full border border-[var(--midnight-border)]/60" />

        <div className="flex gap-2">
          <span className="h-2.5 w-2.5 animate-[pulse_1.4s_ease-in-out_infinite] rounded-full bg-[var(--midnight-accent)]" />

          <span className="h-2.5 w-2.5 animate-[pulse_1.4s_ease-in-out_0.2s_infinite] rounded-full bg-[var(--midnight-accent)]/80" />

          <span className="h-2.5 w-2.5 animate-[pulse_1.4s_ease-in-out_0.4s_infinite] rounded-full bg-[var(--midnight-accent)]/60" />
        </div>

        <div className="absolute -bottom-10 text-center">
          <p className="text-xs tracking-[0.24em] text-[var(--midnight-soft)]">
            THE MIDNIGHT LETTERS
          </p>
        </div>
      </div>
    </div>
  );
}