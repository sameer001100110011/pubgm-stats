"use client";

import { useState } from "react";
import { createWorker, type Worker } from "tesseract.js";
import {
  parseCareerStats,
  parseWeaponCapture,
  type OcrWord,
  type ParsedCareerStats,
  type ParsedWeaponStat,
} from "@/lib/statParser";
import { preprocessImage } from "@/lib/imagePreprocess";

// Internal testing tool — NOT part of the public product. Upload a real
// screenshot (Statistics screen or a Firearm Combat Power weapon screen)
// and see exactly what the OCR pipeline reads, using the same
// coordinate-based label-pairing technique validated against real
// screenshots in Aug 2026.
type Mode = "career" | "weapon";

export default function TestCapturePage() {
  const [mode, setMode] = useState<Mode>("career");
  const [status, setStatus] = useState<string>("Idle");
  const [career, setCareer] = useState<ParsedCareerStats | null>(null);
  const [weapon, setWeapon] = useState<ParsedWeaponStat | null>(null);
  const [rawText, setRawText] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUrl(URL.createObjectURL(file));
    setCareer(null);
    setWeapon(null);
    setRawText("");
    setStatus("Loading OCR engine…");
    const worker: Worker = await createWorker("eng");

    // Preprocessing (upscale + contrast) measurably fixed dropped decimals
    // on the Statistics screen in real testing - not yet validated on the
    // weapon screen, which was already clean without it, so we only apply
    // it in career mode for now.
    const ocrInput: Blob | File =
      mode === "career" ? await preprocessImage(file, { scale: 3, contrast: 1.8 }) : file;

    setStatus("Reading image…");
    const { data } = await worker.recognize(ocrInput, {}, { blocks: true });
    await worker.terminate();

    // Flatten tesseract.js's block/paragraph/line/word tree into flat
    // words with center coordinates - this is what the coordinate-pairing
    // parser needs.
    const words: OcrWord[] = [];
    let fullText = "";
    for (const block of data.blocks ?? []) {
      for (const para of block.paragraphs ?? []) {
        for (const line of para.lines ?? []) {
          for (const word of line.words ?? []) {
            words.push({
              text: word.text,
              x: (word.bbox.x0 + word.bbox.x1) / 2,
              y: (word.bbox.y0 + word.bbox.y1) / 2,
            });
            fullText += word.text + " ";
          }
        }
      }
    }
    setRawText(fullText.trim());

    setStatus("Parsing stats…");
    if (mode === "career") {
      setCareer(parseCareerStats(words));
    } else {
      // Title bar text ("AKM Combat Power") isn't reliably separable from
      // the grid in this quick test - paste it manually below if the auto
      // guess is wrong.
      const guessTitle = fullText.match(/^\S+\s+Combat Power/i)?.[0] ?? "";
      setWeapon(parseWeaponCapture(words, guessTitle));
    }
    setStatus("Done");
  }

  return (
    <main className="min-h-screen bg-[--color-bg] text-[--color-text] px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <p className="stencil-label text-[--color-brass] mb-2">Internal Test Tool</p>
        <h1 className="font-display text-3xl mb-2">OCR Capture Test</h1>
        <p className="text-[--color-text-dim] text-sm mb-6">
          Upload a real screenshot. Runs OCR entirely in your browser — nothing is
          uploaded anywhere.
        </p>

        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setMode("career")}
            className={`stencil-label px-4 py-2 rounded-full border ${
              mode === "career"
                ? "border-[--color-brass] text-[--color-brass]"
                : "border-[--color-border] text-[--color-text-dim]"
            }`}
          >
            Statistics screen
          </button>
          <button
            onClick={() => setMode("weapon")}
            className={`stencil-label px-4 py-2 rounded-full border ${
              mode === "weapon"
                ? "border-[--color-brass] text-[--color-brass]"
                : "border-[--color-border] text-[--color-text-dim]"
            }`}
          >
            Firearm Combat Power screen
          </button>
        </div>

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

        {career && (
          <div className="mt-8 rounded-2xl border border-[--color-border] p-6">
            <h2 className="font-display text-lg mb-4">Parsed career stats</h2>
            <dl className="grid grid-cols-2 gap-2 font-data text-sm">
              {Object.entries(career)
                .filter(([k]) => k !== "rawWordCount")
                .map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <dt className="text-[--color-text-dim]">{k}</dt>
                    <dd>{v ?? <span className="text-[--color-rust]">null</span>}</dd>
                  </div>
                ))}
            </dl>
          </div>
        )}

        {weapon && (
          <div className="mt-8 rounded-2xl border border-[--color-border] p-6">
            <h2 className="font-display text-lg mb-4">Parsed weapon stats</h2>
            <dl className="grid grid-cols-2 gap-2 font-data text-sm">
              {Object.entries(weapon).map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <dt className="text-[--color-text-dim]">{k}</dt>
                  <dd>{v ?? <span className="text-[--color-rust]">null</span>}</dd>
                </div>
              ))}
            </dl>
            <p className="text-xs text-[--color-text-dim] mt-4">
              If weaponName is null, paste the title bar text manually — this quick
              test doesn&apos;t isolate it reliably yet.
            </p>
          </div>
        )}

        {rawText && (
          <div className="mt-6 rounded-2xl border border-[--color-border] p-6">
            <h2 className="font-display text-lg mb-4">Raw OCR text</h2>
            <pre className="text-xs text-[--color-text-dim] whitespace-pre-wrap font-data">
              {rawText}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}
