"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

type DogTagProps = {
  ign: string;
  tier: string;
  kd: string;
  wins: number;
  matches: number;
  weapon?: string;
  headshot?: string;
  className?: string;
  interactive?: boolean;
};

// Signature element: player stats as a literal dog tag. Reacts to the cursor
// like a physical object on a chain, and clicking flips it — a small tactile
// payoff that rewards curiosity instead of just displaying static numbers.
export default function DogTag({
  ign,
  tier,
  kd,
  wins,
  matches,
  weapon = "M416",
  headshot = "34%",
  className = "",
  interactive = true,
}: DogTagProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [flipped, setFlipped] = useState(false);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -10, y: px * 12 });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotate: -3 }}
      animate={{ opacity: 1, y: 0, rotate: -3 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1200 }}
      className={className}
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        onClick={() => interactive && setFlipped((f) => !f)}
        animate={{
          rotateX: tilt.x,
          rotateY: tilt.y + (flipped ? 180 : 0),
        }}
        whileTap={interactive ? { scale: 0.97 } : undefined}
        transition={{ type: "spring", stiffness: 140, damping: 16 }}
        className={`relative w-full max-w-sm ${interactive ? "cursor-pointer" : ""}`}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* FRONT */}
        <div
          className="tac-glow relative rounded-[2.5rem] border border-[--color-border] bg-gradient-to-b from-[--color-panel-raised] to-[--color-panel] px-8 py-9"
          style={{
            clipPath:
              "polygon(18% 0%, 82% 0%, 100% 10%, 100% 90%, 82% 100%, 18% 100%, 0% 90%, 0% 10%)",
            backfaceVisibility: "hidden",
          }}
        >
          <div
            className="absolute inset-0 rounded-[2.5rem] pointer-events-none"
            style={{
              background: `linear-gradient(${115 + tilt.y * 2}deg, transparent 30%, rgba(201,162,39,0.12) 50%, transparent 70%)`,
              clipPath:
                "polygon(18% 0%, 82% 0%, 100% 10%, 100% 90%, 82% 100%, 18% 100%, 0% 90%, 0% 10%)",
            }}
          />
          <div className="absolute left-1/2 top-3 h-3 w-3 -translate-x-1/2 rounded-full border border-[--color-border] bg-[--color-bg]" />

          <p className="stencil-label text-[--color-olive] text-center mt-2">Career Record</p>
          <h3 className="font-display text-3xl text-[--color-text] text-center mt-1 truncate">
            {ign}
          </h3>
          <p className="stencil-label text-[--color-brass] text-center mt-1">{tier}</p>

          <div className="mt-6 grid grid-cols-3 gap-3 border-t border-[--color-border] pt-6">
            <Stat label="K/D" value={kd} />
            <Stat label="Wins" value={wins.toString()} />
            <Stat label="Matches" value={matches.toString()} />
          </div>

          {interactive && (
            <p className="stencil-label text-[--color-text-dim]/50 text-center mt-6 text-[0.55rem]">
              Tap to flip
            </p>
          )}
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 tac-glow rounded-[2.5rem] border border-[--color-border] bg-gradient-to-b from-[--color-panel-raised] to-[--color-panel] px-8 py-9"
          style={{
            clipPath:
              "polygon(18% 0%, 82% 0%, 100% 10%, 100% 90%, 82% 100%, 18% 100%, 0% 90%, 0% 10%)",
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="absolute left-1/2 top-3 h-3 w-3 -translate-x-1/2 rounded-full border border-[--color-border] bg-[--color-bg]" />
          <p className="stencil-label text-[--color-olive] text-center mt-2">Top Weapon</p>
          <h3 className="font-display text-3xl text-[--color-text] text-center mt-1">
            {weapon}
          </h3>
          <p className="stencil-label text-[--color-brass] text-center mt-1">
            {headshot} headshot rate
          </p>
          <div className="mt-6 border-t border-[--color-border] pt-6 text-center">
            <p className="font-data text-xs text-[--color-text-dim] leading-relaxed">
              Full weapon-by-weapon breakdown unlocks once you capture your first report.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="font-data text-xl text-[--color-text]">{value}</p>
      <p className="stencil-label text-[--color-text-dim] mt-1 text-[0.6rem]">{label}</p>
    </div>
  );
}
