// Text-only game badges — deliberately no logos/branded marks (copyright), just
// monogram-style initials in the tactical dog-tag material language.
export function GameBadge({ label, status }: { label: string; status: "live" | "soon" }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[--color-border] bg-[--color-panel] px-5 py-4 transition-colors hover:border-[--color-brass]/50">
      <span className="font-display text-[--color-text]">{label}</span>
      <span
        className={`stencil-label text-[0.6rem] ${
          status === "live" ? "text-[--color-olive]" : "text-[--color-text-dim]"
        }`}
      >
        {status === "live" ? "● Live" : "Roadmap"}
      </span>
    </div>
  );
}
