import DogTag from "@/components/DogTag";
import { FadeUp } from "@/components/AnimatedSection";
import { GameBadge } from "@/components/GameBadge";
import CountUp from "@/components/CountUp";

const feed = [
  { time: "0:04 ago", text: "RUPPO_YT captured a Squad report — 6.2 K/D, M416 top weapon" },
  { time: "1:12 ago", text: "SNIPE_KTM captured a Solo report — 41% headshot rate" },
  { time: "3:40 ago", text: "GHOST_88 compared results against 3 squadmates" },
  { time: "5:02 ago", text: "VALKYR_NP captured a Duo report — 3 chicken dinners today" },
  { time: "6:47 ago", text: "K2_SNIPES compared results against 2 squadmates" },
];

export default function Home() {
  return (
    <main className="flex-1 overflow-hidden">
      {/* Nav */}
      <header className="border-b border-[--color-border] relative z-10">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
          <span className="font-display text-lg tracking-wide text-[--color-text]">
            DROP<span className="text-[--color-brass]">CARD</span>
          </span>
          <span className="stencil-label text-[--color-text-dim]">PUBG Mobile · Beta</span>
        </div>
      </header>

      {/* Hero — tactical HUD: grid texture, scanning light sweep, reactive dog tag */}
      <section className="relative tac-grid tac-scan overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[--color-bg] pointer-events-none" />
        <div className="mx-auto max-w-6xl px-6 pt-16 pb-20 grid gap-14 lg:grid-cols-2 lg:items-center relative">
          <FadeUp>
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
                className="rounded-full bg-[--color-brass] px-7 py-3 font-display text-[--color-bg] text-sm tracking-wide hover:bg-[#dab53a] hover:scale-105 transition-all"
              >
                See how it works
              </a>
              <span className="stencil-label text-[--color-text-dim]">
                Free for basic reports
              </span>
            </div>
          </FadeUp>

          <div className="flex justify-center lg:justify-end">
            <DogTag ign="RUPPO_YT" tier="Diamond V · Squad" kd="6.2" wins={36} matches={653} />
          </div>
        </div>
      </section>

      {/* Live feed — genuinely scrolling ticker, pauses on hover */}
      <section className="border-y border-[--color-border] bg-[--color-panel] overflow-hidden">
        <div className="flex items-center gap-8 py-4">
          <span className="stencil-label text-[--color-olive] shrink-0 pl-6">
            Live captures
          </span>
          <div className="flex overflow-hidden">
            <div className="tac-ticker flex gap-14 whitespace-nowrap font-data text-sm text-[--color-text-dim]">
              {[...feed, ...feed].map((f, i) => (
                <span key={i}>
                  <span className="text-[--color-text-dim]/60">{f.time}</span> — {f.text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social proof — counting numbers give the "live, growing" pull */}
      {/* ⚠️ TODO BEFORE LAUNCH: these are PLACEHOLDER numbers, not real data.
          Do not deploy live with fake numbers — replace with real counts from
          Supabase once you have actual captures, or remove this section
          entirely until you do. Showing fabricated stats to real visitors is
          misleading and will damage trust if noticed. */}
      <section className="border-b border-[--color-border]">
        <div className="mx-auto max-w-6xl px-6 py-10 grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="font-display text-2xl sm:text-3xl text-[--color-brass]">
              <CountUp end={12847} suffix="+" />
            </p>
            <p className="stencil-label text-[--color-text-dim] mt-1">Reports captured</p>
          </div>
          <div>
            <p className="font-display text-2xl sm:text-3xl text-[--color-brass]">
              <CountUp end={2103} suffix="+" />
            </p>
            <p className="stencil-label text-[--color-text-dim] mt-1">Squads compared</p>
          </div>
          <div>
            <p className="font-display text-2xl sm:text-3xl text-[--color-brass]">
              <CountUp end={97} suffix="%" />
            </p>
            <p className="stencil-label text-[--color-text-dim] mt-1">Capture accuracy</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-24">
        <FadeUp>
          <p className="stencil-label text-[--color-brass] mb-4">Briefing</p>
          <h2 className="font-display text-3xl text-[--color-text] mb-14 max-w-lg">
            Three steps. Nothing installed inside the game.
          </h2>
        </FadeUp>

        <div className="grid gap-10 sm:grid-cols-3">
          <FadeUp delay={0.05}>
            <Step
              n="01"
              title="Open your stats"
              body="In PUBG Mobile: Profile → Career → Detailed Statistics. This is the screen with your weapon breakdown."
            />
          </FadeUp>
          <FadeUp delay={0.15}>
            <Step
              n="02"
              title="Tap the overlay"
              body="Dropcard's floating button sits over the game. One tap captures exactly what's on screen — nothing else."
            />
          </FadeUp>
          <FadeUp delay={0.25}>
            <Step
              n="03"
              title="Get your report"
              body="Seconds later: a shareable card with K/D, weapon stats, and accuracy — ready to post or compare."
            />
          </FadeUp>
        </div>
      </section>

      {/* What's in a report — the actual analysis depth, grounded in real fields not vague promises */}
      <section className="border-t border-[--color-border] bg-[--color-panel]">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <FadeUp>
            <p className="stencil-label text-[--color-brass] mb-4">Intel Package</p>
            <h2 className="font-display text-3xl text-[--color-text] mb-14 max-w-lg">
              Everything on your stats screen, structured and kept.
            </h2>
          </FadeUp>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { t: "Weapon breakdown", d: "Time used, damage dealt, and accuracy per weapon — see what's actually carrying your matches." },
              { t: "K/D & win rate", d: "Career and per-mode numbers, tracked over every report you capture." },
              { t: "Headshot & accuracy", d: "Precision stats pulled straight from your Detailed Statistics screen." },
              { t: "Match history", d: "Recent placements at a glance, building a timeline as you capture more reports." },
              { t: "Squad comparison", d: "Line up your card against squadmates who've also captured — see who's carrying." },
              { t: "Rank progression", d: "Track tier movement across seasons as your capture history grows." },
            ].map((f, i) => (
              <FadeUp key={f.t} delay={i * 0.05}>
                <div className="h-full rounded-2xl border border-[--color-border] p-6 hover:border-[--color-brass]/50 transition-colors">
                  <h3 className="font-display text-lg text-[--color-text]">{f.t}</h3>
                  <p className="text-sm text-[--color-text-dim] mt-2 leading-relaxed">{f.d}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Squad comparison teaser — visual side-by-side */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <FadeUp>
          <p className="stencil-label text-[--color-brass] mb-4">Squad Debrief</p>
          <h2 className="font-display text-3xl text-[--color-text] mb-4 max-w-lg">
            Line up cards. See who's actually carrying.
          </h2>
          <p className="text-[--color-text-dim] max-w-md mb-14">
            Everyone in your squad captures their own report — Dropcard puts them side by
            side so bragging rights are settled with numbers, not vibes.
          </p>
        </FadeUp>
        <div className="flex flex-wrap justify-center gap-6">
          <FadeUp delay={0}>
            <DogTag ign="RUPPO_YT" tier="Diamond V" kd="6.2" wins={36} matches={653} className="scale-90" />
          </FadeUp>
          <FadeUp delay={0.1}>
            <DogTag ign="GHOST_88" tier="Platinum II" kd="3.4" wins={19} matches={402} className="scale-90" />
          </FadeUp>
          <FadeUp delay={0.2}>
            <DogTag ign="VALKYR_NP" tier="Diamond I" kd="4.9" wins={28} matches={511} className="scale-90" />
          </FadeUp>
        </div>
      </section>

      {/* Coaching / recommendations teaser — clearly labeled as roadmap, not live */}
      <section className="border-y border-[--color-border] bg-[--color-panel]">
        <div className="mx-auto max-w-6xl px-6 py-24 grid gap-10 lg:grid-cols-2 items-center">
          <FadeUp>
            <p className="stencil-label text-[--color-olive] mb-4">Roadmap · Not live yet</p>
            <h2 className="font-display text-3xl text-[--color-text] mb-4">
              Where you're losing fights, in plain language.
            </h2>
            <p className="text-[--color-text-dim] leading-relaxed max-w-md">
              Once enough reports build up, Dropcard will surface patterns — weapons
              underperforming for you, accuracy dropping in late-game fights, and
              specific weak points to work on. Coaching, not just numbers.
            </p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className="rounded-2xl border border-dashed border-[--color-border] p-8 font-data text-sm text-[--color-text-dim] space-y-3">
              <p>▸ Accuracy drops 18% after your first knockdown</p>
              <p>▸ M416 outperforms your AKM by 2.1x avg damage</p>
              <p>▸ 60% of deaths occur in the final two circles</p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Multi-game roadmap — text-only badges, no logos, honest live/soon labeling */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <FadeUp>
          <p className="stencil-label text-[--color-brass] mb-4">Full Roster</p>
          <h2 className="font-display text-3xl text-[--color-text] mb-4 max-w-lg">
            Starting with PUBG Mobile. Not stopping there.
          </h2>
          <p className="text-[--color-text-dim] max-w-md mb-14">
            Same account, same report format, expanding one game at a time as each
            one's data access is proven out.
          </p>
        </FadeUp>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: "PUBG Mobile", status: "live" as const },
            { label: "PUBG: BATTLEGROUNDS (PC)", status: "soon" as const },
            { label: "Free Fire", status: "soon" as const },
            { label: "Fortnite", status: "soon" as const },
            { label: "Counter-Strike 2", status: "soon" as const },
            { label: "Minecraft (Hypixel)", status: "soon" as const },
          ].map((g, i) => (
            <FadeUp key={g.label} delay={i * 0.04}>
              <GameBadge label={g.label} status={g.status} />
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Streak mechanic — gamification hook, clearly marked roadmap */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <FadeUp>
          <p className="stencil-label text-[--color-olive] mb-4">Roadmap · Not live yet</p>
          <h2 className="font-display text-3xl text-[--color-text] mb-4 max-w-lg">
            Capture streaks. Because one report is never enough.
          </h2>
          <p className="text-[--color-text-dim] max-w-md mb-10">
            Capture after three matches in a row and Dropcard tracks your streak —
            longer streaks unlock deeper trend charts, since more reports means more
            signal in your data.
          </p>
        </FadeUp>
        <FadeUp delay={0.1}>
          <div className="flex flex-wrap gap-4">
            {["Bronze · 3 reports", "Silver · 10 reports", "Gold · 25 reports"].map(
              (s, i) => (
                <div
                  key={s}
                  className={`rounded-xl border px-6 py-4 stencil-label ${
                    i === 0
                      ? "border-[--color-brass]/60 text-[--color-brass]"
                      : "border-[--color-border] text-[--color-text-dim]"
                  }`}
                >
                  {s}
                </div>
              )
            )}
          </div>
        </FadeUp>
      </section>

      {/* Pricing — reflects the free/paid tier plan */}
      <section className="border-t border-[--color-border] bg-[--color-panel]">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <FadeUp>
            <p className="stencil-label text-[--color-brass] mb-4">Enlistment</p>
            <h2 className="font-display text-3xl text-[--color-text] mb-14 max-w-lg">
              Free to start. Pay only for deeper intel.
            </h2>
          </FadeUp>
          <div className="grid gap-6 sm:grid-cols-2 max-w-3xl">
            <FadeUp>
              <div className="h-full rounded-2xl border border-[--color-border] p-8">
                <p className="stencil-label text-[--color-text-dim]">Recruit</p>
                <p className="font-display text-3xl text-[--color-text] mt-2">Free</p>
                <ul className="mt-6 space-y-2 text-sm text-[--color-text-dim]">
                  <li>▸ Unlimited stat captures</li>
                  <li>▸ Full weapon breakdown per report</li>
                  <li>▸ Squad comparison</li>
                </ul>
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              <div className="h-full rounded-2xl border border-[--color-brass]/60 p-8 tac-glow">
                <p className="stencil-label text-[--color-brass]">Command</p>
                <p className="font-display text-3xl text-[--color-text] mt-2">Coming soon</p>
                <ul className="mt-6 space-y-2 text-sm text-[--color-text-dim]">
                  <li>▸ Historical trend charts across seasons</li>
                  <li>▸ Coaching-style recommendations</li>
                  <li>▸ Priority capture processing</li>
                </ul>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Trust — addresses the honest safety question directly */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <FadeUp>
          <p className="stencil-label text-[--color-brass] mb-4">Safety Brief</p>
          <h2 className="font-display text-3xl text-[--color-text] mb-10 max-w-lg">
            Nothing here touches your account or your game while it's running.
          </h2>
        </FadeUp>
        <div className="grid gap-8 sm:grid-cols-3">
          <FadeUp delay={0}>
            <p className="font-data text-sm text-[--color-text-dim] leading-relaxed">
              <span className="text-[--color-text]">No login required.</span> We never ask
              for your PUBG Mobile credentials — capture works entirely from what's on
              your screen.
            </p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="font-data text-sm text-[--color-text-dim] leading-relaxed">
              <span className="text-[--color-text]">Never reads live matches.</span>{" "}
              Capture only works on your post-match stats screen — nothing runs while
              you're playing.
            </p>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="font-data text-sm text-[--color-text-dim] leading-relaxed">
              <span className="text-[--color-text]">No memory access, ever.</span> Dropcard
              reads screen pixels, the same way a screenshot does — never the game's
              process or files.
            </p>
          </FadeUp>
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
    <div className="group border-t border-[--color-border] pt-5 transition-colors hover:border-[--color-brass]/60">
      <span className="font-data text-sm text-[--color-brass]">{n}</span>
      <h3 className="font-display text-xl text-[--color-text] mt-2">{title}</h3>
      <p className="text-[--color-text-dim] text-sm mt-2 leading-relaxed">{body}</p>
    </div>
  );
}
