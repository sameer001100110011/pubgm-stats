"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

type DogTagProps = {
  ign: string;
  tier: string;
  kd: string;
  wins: number;
  matches: number;
  className?: string;
};

// Signature element: player stats as a literal dog tag that responds to the
// cursor like a physical object on a chain — tilts toward the pointer, catches light.
export default function DogTag({ ign, tier, kd, wins, matches, className = "" }: DogTagProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

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
      style={{ perspective: 1000 }}
      className={className}
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        animate={{ rotateX: tilt.x, rotateY: tilt.y }}
        transition={{ type: "spring", stiffness: 150, damping: 15 }}
        className="tac-glow relative w-full max-w-sm rounded-[2.5rem] border border-[--color-border] bg-gradient-to-b from-[--color-panel-raised] to-[--color-panel] px-8 py-9"
        style={{
          clipPath:
            "polygon(18% 0%, 82% 0%, 100% 10%, 100% 90%, 82% 100%, 18% 100%, 0% 90%, 0% 10%)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* brushed-metal sheen that shifts with tilt */}
        <div
          className="absolute inset-0 rounded-[2.5rem] pointer-events-none"
          style={{
            background: `linear-gradient(${115 + tilt.y * 2}deg, transparent 30%, rgba(201,162,39,0.12) 50%, transparent 70%)`,
            clipPath:
              "polygon(18% 0%, 82% 0%, 100% 10%, 100% 90%, 82% 100%, 18% 100%, 0% 90%, 0% 10%)",
          }}
        />

        {/* chain hole */}
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
