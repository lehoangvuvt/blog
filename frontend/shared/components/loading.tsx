"use client";

export default function Loading() {
  const text = "THE MIDNIGHT LETTERS";

  return (
    <div className="flex min-h-screen items-center justify-center overflow-hidden bg-[var(--background)] px-6">
      {/* Soft ambient glow */}
      <div className="absolute h-72 w-72 rounded-full bg-[var(--midnight-accent)]/5 blur-3xl" />

      <div className="relative flex flex-wrap items-center justify-center gap-[0.06em]">
        {text.split("").map((char, index) => (
          <span
            key={`${char}-${index}`}
            className={`animated-letter ${
              char === " " ? "mx-2" : ""
            } text-sm md:text-base tracking-[0.28em]`}
            style={{
              animationDelay: `${index * 0.08}s`,
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}

        {/* Floating stars */}
        <span className="star star-1">✦</span>
        <span className="star star-2">✧</span>
        <span className="star star-3">✦</span>
      </div>

      <style jsx>{`
        .animated-letter {
          position: relative;
          display: inline-block;
          color: var(--midnight-soft);
          opacity: 0.18;
          animation: glowBounce 2.4s ease-in-out infinite;
          will-change: transform, opacity, text-shadow;
        }

        .star {
          position: absolute;
          color: var(--midnight-accent);
          opacity: 0.4;
          animation: twinkle 2.2s ease-in-out infinite;
          pointer-events: none;
        }

        .star-1 {
          top: -22px;
          left: 8%;
          font-size: 12px;
        }

        .star-2 {
          bottom: -18px;
          right: 14%;
          font-size: 10px;
          animation-delay: 0.8s;
        }

        .star-3 {
          top: -28px;
          right: 6%;
          font-size: 14px;
          animation-delay: 1.3s;
        }

        @keyframes glowBounce {
          0%,
          100% {
            opacity: 0.16;
            transform: translateY(0px) rotate(0deg) scale(1);
            text-shadow: 0 0 0px rgba(255, 255, 255, 0);
          }

          35% {
            opacity: 1;
            color: var(--midnight-accent);
            transform: translateY(-5px) rotate(-2deg) scale(1.08);
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.15),
              0 0 20px rgba(255, 255, 255, 0.08);
          }

          55% {
            opacity: 0.9;
            transform: translateY(1px) rotate(1deg) scale(0.98);
          }
        }

        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(0.8) rotate(0deg);
          }

          50% {
            opacity: 0.9;
            transform: scale(1.25) rotate(12deg);
          }
        }
      `}</style>
    </div>
  );
}
