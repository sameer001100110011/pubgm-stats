type DogTagProps = {
  ign: string;
  tier: string;
  kd: string;
  wins: number;
  matches: number;
  className?: string;
};

// Signature element: player stats rendered as a literal dog tag —
// the object every battle royale player already associates with identity + record.
export default function DogTag({ ign, tier, kd, wins, matches, className = "" }: DogTagProps) {
  return (
    <div
      className={`relative w-full max-w-sm rounded-[2.5rem] border border-[--color-border] bg-[--color-panel] px-8 py-9 shadow-[0_0_0_1px_rgba(201,162,39,0.08)] ${className}`}
      style={{
        clipPath:
          "polygon(18% 0%, 82% 0%, 100% 10%, 100% 90%, 82% 100%, 18% 100%, 0% 90%, 0% 10%)",
      }}
    >
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
    </div>
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
