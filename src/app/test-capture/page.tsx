"use client";

import { useState } from "react";
import { createWorker } from "tesseract.js";
import { parseCareerStats, type ParsedCareerStats } from "@/lib/statParser";

// Internal testing tool — NOT part of the public product. Upload a real
// screenshot of the Detailed Statistics screen and see exactly what the
// OCR pipeline reads. This is how we validate (or fix) the capture
// pipeline against real screens instead of guessing.
export default function TestCapturePage() {
  const [status, setStatus] = useState<string>("Idle");
  const [rawText, setRawText] = useState<string>("");
  const [parsed, setParsed] = useState<ParsedCareerStats | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUrl(URL.createObjectURL(file));
    setParsed(null);
    setRawText("");
    setStatus("Loading OCR engine…");

    const worker = await createWorker("eng");

    setStatus("Reading image…");
    const {
      data: { text },
    } = await worker.recognize(file);
    await worker.terminate();

    setRawText(text);
    setStatus("Parsing stats…");
    setParsed(parseCareerStats(text));
    setStatus("Done");
  }

  return (
    <main className="min-h-screen bg-[--color-bg] text-[--color-text] px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <p className="stencil-label text-[--color-brass] mb-2">Internal Test Tool</p>
        <h1 className="font-display text-3xl mb-2">OCR Capture Test</h1>
        <p className="text-[--color-text-dim] text-sm mb-8">
          Upload a real screenshot of the PUBG Mobile Detailed Statistics screen.
          This runs OCR entirely in your browser — nothing is uploaded anywhere.
        </p>

        <label className="block rounded-2xl border border-dashed border-[--color-border] p-10 text-center cursor-pointer hover:border-[--color-brass]/50 transition-colors">
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
          <span className="stencil-label text-[--color-text-dim]">
            Click to choose a screenshot
          </span>
        </label>

        <p className="font-data text-sm text-[--color-olive] mt-4">{status}</p>

        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt="Uploaded screenshot"
            className="mt-6 max-h-96 rounded-xl border border-[--color-border]"
          />
        )}

        {parsed && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-[--color-border] p-6">
              <h2 className="font-display text-lg mb-4">Parsed result</h2>
              <dl className="space-y-2 font-data text-sm">
                <Row label="K/D" value={parsed.kd} />
                <Row label="Wins" value={parsed.wins} />
                <Row label="Matches" value={parsed.matches} />
                <Row label="Headshot rate" value={parsed.headshotRate} />
              </dl>
              {parsed.weapons.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[--color-border]">
                  <p className="stencil-label text-[--color-text-dim] mb-2">Weapons found</p>
                  {parsed.weapons.map((w) => (
                    <p key={w.weaponName} className="font-data text-sm">
                      {w.weaponName} — dmg {w.damage ?? "?"}, acc {w.accuracy ?? "?"}
                    </p>
                  ))}
                </div>
              )}
              {parsed.warnings.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[--color-border]">
                  <p className="stencil-label text-[--color-rust] mb-2">Warnings</p>
                  {parsed.warnings.map((w, i) => (
                    <p key={i} className="text-sm text-[--color-rust]">
                      {w}
                    </p>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-[--color-border] p-6">
              <h2 className="font-display text-lg mb-4">Raw OCR text</h2>
              <pre className="text-xs text-[--color-text-dim] whitespace-pre-wrap font-data">
                {rawText}
              </pre>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="flex justify-between">
      <dt className="text-[--color-text-dim]">{label}</dt>
      <dd>{value ?? <span className="text-[--color-rust]">not found</span>}</dd>
    </div>
  );
}
