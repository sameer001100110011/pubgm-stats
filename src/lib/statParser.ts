// Label-anchored parser for PUBG Mobile's Detailed Statistics screen.
//
// Why label-anchored, not position-anchored: screen resolution and aspect
// ratio vary a lot across Android phones, so pixel coordinates from one
// screenshot won't line up on another. Anchoring to the text labels the
// game itself prints ("Damage", "Accuracy", etc.) is what survives that
// variation — this is the same technique real OCR-based stat tools use.
//
// This is a first pass, built from what we know the screen contains, not
// yet validated against a real screenshot. Expect to revise the regexes
// once we see actual OCR output — OCR text is noisy (misreads letters,
// drops symbols), so exact matching will need loosening in places.

export type ParsedWeaponStat = {
  weaponName: string;
  timeUsedSeconds: number | null;
  damage: number | null;
  accuracy: number | null;
};

export type ParsedCareerStats = {
  kd: number | null;
  wins: number | null;
  matches: number | null;
  headshotRate: number | null;
  weapons: ParsedWeaponStat[];
  rawText: string;
  warnings: string[];
};

const NUMBER = "[\\d,]+(?:\\.\\d+)?";

function firstNumberAfter(text: string, label: RegExp): number | null {
  const match = text.match(label);
  if (!match) return null;
  const numMatch = match[0].match(new RegExp(NUMBER));
  if (!numMatch) return null;
  return parseFloat(numMatch[0].replace(/,/g, ""));
}

// Known PUBG Mobile weapon names — used to find weapon rows in noisy OCR
// text. Not exhaustive; extend as we see real screenshots.
const KNOWN_WEAPONS = [
  "M416", "AKM", "SCAR-L", "M16A4", "AUG", "Groza", "QBZ", "M762", "Mk47",
  "Beryl", "UMP45", "Vector", "Tommy Gun", "MP5K", "Kar98k", "M24", "AWM",
  "Mini14", "SKS", "Mk14", "VSS", "S12K", "S1897", "S686", "DBS",
];

export function parseCareerStats(rawText: string): ParsedCareerStats {
  const warnings: string[] = [];
  const text = rawText.replace(/\s+/g, " ");

  const kd = firstNumberAfter(text, /K\/?D\s*Ratio?[:\s]*([\d,]+(?:\.\d+)?)/i);
  if (kd === null) warnings.push("Could not find K/D — label may read differently in OCR.");

  const wins = firstNumberAfter(text, /Wins?[:\s]*([\d,]+)/i);
  const matches = firstNumberAfter(text, /Matches?(?:\s*Played)?[:\s]*([\d,]+)/i);
  const headshotRate = firstNumberAfter(
    text,
    /Headshot\s*(?:Rate|Ratio)?[:\s]*([\d,]+(?:\.\d+)?)\s*%?/i
  );

  const weapons: ParsedWeaponStat[] = [];
  for (const weapon of KNOWN_WEAPONS) {
    const idx = text.indexOf(weapon);
    if (idx === -1) continue;
    // Look at the text immediately following the weapon name for its stat row
    const window = text.slice(idx, idx + 120);
    weapons.push({
      weaponName: weapon,
      timeUsedSeconds: firstNumberAfter(window, /(?:Time\s*Used?)[:\s]*([\d,]+)/i),
      damage: firstNumberAfter(window, /Damage[:\s]*([\d,]+(?:\.\d+)?)/i),
      accuracy: firstNumberAfter(window, /Accuracy[:\s]*([\d,]+(?:\.\d+)?)\s*%?/i),
    });
  }
  if (weapons.length === 0) {
    warnings.push(
      "No known weapon names matched — either none appeared on screen, or OCR misread the names."
    );
  }

  return { kd, wins, matches, headshotRate, weapons, rawText, warnings };
}
