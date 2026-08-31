"use client";

import { useState } from "react";
import { createWorker, type Worker } from "tesseract.js";
import DogTag from "@/components/DogTag";
import { parseCareerStats, type OcrWord, type ParsedCareerStats } from "@/lib/statParser";
import { preprocessImage } from "@/lib/imagePreprocess";
import { saveCareerSnapshot } from "@/lib/captureHistory";

// The real player-facing capture flow (as opposed to /test-capture, which
// is an internal debugging tool). Given known OCR accuracy (~50-60% of
// fields exact, per real testing), this ALWAYS shows a review step before
// anything is treated as final - never silently trusts OCR output.
type Step = "upload" | "processing" | "review";

export default function CapturePage() {
  const [step, setStep] = useState<Step>("upload");
  const [parsed, setParsed] = useState<ParsedCareerStats | null>(null);
  const [ign, setIgn] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setStep("processing");
    const preprocessed = await preprocessImage(file, { scale: 3, contrast: 1.8 });
    const worker: Worker = await createWorker("eng");
    const { data } = await worker.recognize(preprocessed, {}, { blocks: true });
    await worker.terminate();

    const words: OcrWord[] = [];
    for (const block of data.blocks ?? []) {
      for (const para of block.paragraphs ?? []) {
        for (const line of para.lines ?? []) {
          for (const word of line.words ?? []) {
            words.push({
              text: word.text,
              x: (word.bbox.x0 + word.bbox.x1) / 2,
              y: (word.bbox.y0 + word.bbox.y1) / 2,
            });
          }
        }
      }
    }
    setParsed(parseCareerStats(words));
    setStep("review");
  }

  function updateField(key: keyof ParsedCareerStats, value: string) {
    if (!parsed) return;
    const num = value === "" ? null : parseFloat(value);
    setParsed({ ...parsed, [key]: num });
  }

  // Saves locally on this device today (see captureHistory.ts). Syncing
  // to Supabase for cross-device access is the next real step, not done
  // yet - this is genuinely useful now, not a stub.
  function handleSave() {
    if (!parsed || !ign.trim()) {
      alert("Add your in-game name before saving.");
      return;
    }
    saveCareerSnapshot(parsed, ign.trim());
    window.location.href = "/trends";
  }

  return (
    <main className="min-h-screen bg-[--color-bg] text-[--color-text] px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <p className="stencil-label text-[--color-brass] mb-2">Dropcard</p>
        <h1 className="font-display text-3xl mb-8">Capture your report</h1>

        {step === "upload" && (
          <div>
            <p className="text-[--color-text-dim] text-sm mb-6">
              Upload a screenshot of your PUBG Mobile Statistics screen (Profile → Career →
              Detailed Statistics).
            </p>
            <label className="block rounded-2xl border border-dashed border-[--color-border] p-12 text-center cursor-pointer hover:border-[--color-brass]/50 transition-colors">
              <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
              <span className="stencil-label text-[--color-text-dim]">
                Tap to choose a screenshot
              </span>
            </label>
          </div>
        )}

        {step === "processing" && (
          <p className="font-data text-[--color-olive] animate-pulse">Reading your stats…</p>
        )}

        {step === "review" && parsed && (
          <div>
            <p className="text-[--color-text-dim] text-sm mb-6">
              Here&apos;s what we read. OCR isn&apos;t perfect — check each number against your
              screenshot and fix anything wrong before saving.
            </p>

            <input
              type="text"
              placeholder="Your in-game name"
              value={ign}
              onChange={(e) => setIgn(e.target.value)}
              className="w-full rounded-xl border border-[--color-border] bg-[--color-panel] px-4 py-3 mb-6 text-[--color-text] font-data"
            />

            <div className="grid grid-cols-2 gap-3 mb-8">
              {Object.entries(parsed)
                .filter(([k]) => k !== "rawWordCount")
                .map(([key, value]) => (
                  <label key={key} className="text-sm">
                    <span className="stencil-label text-[--color-text-dim] block mb-1">
                      {key}
                    </span>
                    <input
                      type="number"
                      value={value ?? ""}
                      onChange={(e) => updateField(key as keyof ParsedCareerStats, e.target.value)}
                      className={`w-full rounded-lg border px-3 py-2 font-data bg-[--color-panel] ${
                        value === null ? "border-[--color-rust]" : "border-[--color-border]"
                      }`}
                    />
                  </label>
                ))}
            </div>

            {ign && parsed.kd !== null && (
              <div className="flex justify-center mb-8">
                <DogTag
                  ign={ign}
                  tier="Captured Report"
                  kd={parsed.kd.toString()}
                  wins={parsed.wins ?? 0}
                  matches={parsed.matchesPlayed ?? 0}
                  interactive={false}
                />
              </div>
            )}

            <button
              onClick={handleSave}
              className="w-full rounded-full bg-[--color-brass] px-7 py-3 font-display text-[--color-bg] text-sm tracking-wide hover:bg-[#dab53a] transition-colors"
            >
              Save report
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
