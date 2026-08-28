import DogTag from "@/components/DogTag";

const feed = [
  { time: "0:04 ago", text: "RUPPO_YT captured a Squad report — 6.2 K/D, M416 top weapon" },
  { time: "1:12 ago", text: "SNIPE_KTM captured a Solo report — 41% headshot rate" },
  { time: "3:40 ago", text: "GHOST_88 compared results against 3 squadmates" },
];

export default function Home() {
  return (
    <main className="flex-1">
      {/* Nav */}
      <header className="border-b border-[--color-border]">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
          <span className="font-display text-lg tracking-wide text-[--color-text]">
            DROP<span className="text-[--color-brass]">CARD</span>
          </span>
          <span className="stencil-label text-[--color-text-dim]">PUBG Mobile · Beta</span>
        </div>
      </header>

      {/* Hero — the thesis: your career stats, made into a card worth sharing */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-20 grid gap-14 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="stencil-label text-[--color-brass] mb-5">After-Action Report</p>
          <h1 className="font-display text-5xl sm:text-6xl leading-[1.05] text-[--color-text]">
            Your career screen,
            <br />
            turned into a <span className="text-[--color-brass]">record</span>.
          </h1>
          <p className="mt-6 text-[--color-text-dim] text-lg leading-relaxed max-w-md">
            Open your Detailed Statistics screen in PUBG Mobile, tap once, and Dropcard
            reads it straight off the screen — no login, no account access, nothing that
            touches the game while it&apos;s running.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#how-it-works"
              className="rounded-full bg-[--color-brass] px-7 py-3 font-display text-[--color-bg] text-sm tracking-wide hover:bg-[#dab53a] transition-colors"
            >
              See how it works
            </a>
            <span className="stencil-label text-[--color-text-dim]">
              Free for basic reports
            </span>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <DogTag ign="RUPPO_YT" tier="Diamond V · Squad" kd="6.2" wins={36} matches={653} />
        </div>
      </section>

      {/* Live feed — a real sequence, so a ticker structure is earned here */}
      <section className="border-y border-[--color-border] bg-[--color-panel]">
        <div className="mx-auto max-w-6xl px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8 overflow-hidden">
          <span className="stencil-label text-[--color-olive] shrink-0">Live captures</span>
          <div className="flex flex-col gap-1.5 text-sm text-[--color-text-dim] font-data">
            {feed.map((f, i) => (
              <p key={i}>
                <span className="text-[--color-text-dim]/60">{f.time}</span> — {f.text}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* How it works — real steps, numbering earns its place */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-24">
        <p className="stencil-label text-[--color-brass] mb-4">Briefing</p>
        <h2 className="font-display text-3xl text-[--color-text] mb-14 max-w-lg">
          Three steps. Nothing installed inside the game.
        </h2>

        <div className="grid gap-10 sm:grid-cols-3">
          <Step
            n="01"
            title="Open your stats"
            body="In PUBG Mobile: Profile → Career → Detailed Statistics. This is the screen with your weapon breakdown."
          />
          <Step
            n="02"
            title="Tap the overlay"
            body="Dropcard's floating button sits over the game. One tap captures exactly what's on screen — nothing else."
          />
          <Step
            n="03"
            title="Get your report"
            body="Seconds later: a shareable card with K/D, weapon stats, and accuracy — ready to post or compare."
          />
        </div>
      </section>

      <footer className="border-t border-[--color-border] mt-auto">
        <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row justify-between gap-3">
          <p className="stencil-label text-[--color-text-dim]">Dropcard — built for PUBG Mobile</p>
          <p className="stencil-label text-[--color-text-dim]">
            Not affiliated with Krafton or Tencent
          </p>
        </div>
      </footer>
    </main>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="border-t border-[--color-border] pt-5">
      <span className="font-data text-sm text-[--color-brass]">{n}</span>
      <h3 className="font-display text-xl text-[--color-text] mt-2">{title}</h3>
      <p className="text-[--color-text-dim] text-sm mt-2 leading-relaxed">{body}</p>
    </div>
  );
}
