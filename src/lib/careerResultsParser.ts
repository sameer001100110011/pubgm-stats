// Parser for the Career Results screen — a match-by-match history table
// (mode, map, timestamp, placement, eliminations, score, performance
// rating), one row per match played.
//
// This needs a DIFFERENT technique from the Statistics/weapon screens.
// Those are grids (label above value, read top-to-bottom within a
// column) - this is a table (each row reads left-to-right as one
// record). So instead of pairing labels to the nearest number below
// them, we group words into horizontal bands by Y-position (one band =
// one match row), then sort each band left-to-right to reconstruct the
// row's fields in order.
//
// NOT YET VALIDATED against a real screenshot programmatically - built
// from the same sound technique that worked for the grid screens, but
// this is the honest next thing to test once there's a spare screenshot,
// not a proven result yet.

import type { OcrWord } from "./statParser";

// KNOWN LIMITATION (found via real testing, Aug 2026): eliminationsInMatch
// is currently unreliable. The value (a lone small number like "0" or "1")
// is often missed by OCR entirely - not misassigned, genuinely never
// detected as a word. placementRank and ranking are reliable; this field
// needs a dedicated column crop-and-upscale pass, not yet built.
export type ParsedMatchRow = {
  placementRank: number | null;
  mode: string | null;
  map: string | null;
  timestamp: string | null;
  ranking: number | null;
  eliminationsInMatch: number | null;
  ratingTitle: string | null;
  rawRowText: string;
};

function groupIntoRows(words: OcrWord[], rowHeightThreshold = 40): OcrWord[][] {
  const sorted = [...words].sort((a, b) => a.y - b.y);
  const rows: OcrWord[][] = [];
  let currentRow: OcrWord[] = [];
  let currentY: number | null = null;

  for (const word of sorted) {
    if (currentY === null || Math.abs(word.y - currentY) <= rowHeightThreshold) {
      currentRow.push(word);
      currentY = currentY === null ? word.y : (currentY + word.y) / 2;
    } else {
      if (currentRow.length > 0) rows.push(currentRow);
      currentRow = [word];
      currentY = word.y;
    }
  }
  if (currentRow.length > 0) rows.push(currentRow);

  // sort each row left-to-right
  return rows.map((row) => [...row].sort((a, b) => a.x - b.x));
}

const MODE_KEYWORDS = ["Ranked", "Classic", "Casual", "Arena"];
const NUMBER_RE = /^#?\d+$/;

export function parseCareerResults(words: OcrWord[]): ParsedMatchRow[] {
  const rows = groupIntoRows(words);
  const matches: ParsedMatchRow[] = [];

  for (const row of rows) {
    const text = row.map((w) => w.text).join(" ");
    const hasMode = MODE_KEYWORDS.some((kw) => text.includes(kw));
    if (!hasMode) continue; // skip header/nav rows that aren't match records

    const numbers = row.filter((w) => NUMBER_RE.test(w.text));
    const rankWords = row.filter((w) => /^#\d+$/.test(w.text));
    // Score looks like "4953(+21)" or similar - a large number, often
    // followed by a parenthesized delta. Eliminations is a small number
    // (0-20 realistically) that appears BEFORE the score in reading
    // order, not necessarily the row's last number - the previous
    // "last number in row" heuristic was wrong because tier badges
    // ("Ace Master 8") often appear after the real eliminations count,
    // caught via real testing against an actual Career Results screenshot.
    const scoreIdx = row.findIndex((w) => /^\d{3,5}\(/.test(w.text) || /^\d{3,5}$/.test(w.text));
    const eliminationsCandidate = numbers.find((n) => {
      const idx = row.indexOf(n);
      return idx !== -1 && idx < scoreIdx && parseInt(n.text.replace("#", "")) <= 30;
    });

    matches.push({
      placementRank: rankWords[0] ? parseInt(rankWords[0].text.replace("#", "")) : null,
      mode: MODE_KEYWORDS.find((kw) => text.includes(kw)) ?? null,
      map: null, // needs a known-map-name dictionary, same pattern as KNOWN_WEAPONS - not built yet
      timestamp: text.match(/\d{2}\/\d{2}\s+\d{2}:\d{2}/)?.[0] ?? null,
      ranking: rankWords[1] ? parseInt(rankWords[1].text.replace("#", "")) : null,
      eliminationsInMatch: eliminationsCandidate ? parseInt(eliminationsCandidate.text) : null,
      ratingTitle: null, // rating titles ("Tactical Expert" etc.) need a known-title dictionary too
      rawRowText: text,
    });
  }

  return matches;
}
