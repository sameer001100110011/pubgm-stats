// Parsers for the two PUBG Mobile screens we've validated against real
// screenshots: the career-aggregate "Statistics" screen, and the
// per-weapon "Firearm Combat Power" screen.
//
// Both use coordinate-based label-to-nearest-number pairing rather than
// flat-text regex matching. This matters because these screens are dense
// grids — plain top-to-bottom text reading jumbles adjacent columns
// together. Finding each label's actual on-screen position (via OCR word
// bounding boxes) and pairing it with the nearest number below/right of
// it survives that, and generalizes across different phone screen sizes
// in a way hardcoded pixel coordinates never would.
//
// Validated accuracy so far (real screenshots, Aug 2026):
// - Statistics screen: ~10-11 of 15 fields exact per test, a few digit
//   misreads and dropped decimals remain on some fields.
// - Firearm Combat Power screen: 7-8 of 10 values exact with ZERO
//   preprocessing (much cleaner layout - light background, big text).
//   The stylized "Combat Power" number consistently fails OCR and needs
//   a dedicated crop-and-enhance pass - not yet built.

export type OcrWord = { text: string; x: number; y: number };

function pairLabelsToNumbers(words: OcrWord[]): { label: string; value: string }[] {
  const numberRe = /^[\d.,%]+$/;
  const numbers = words.filter((w) => numberRe.test(w.text) && /\d/.test(w.text));
  const labels = words.filter((w) => !numberRe.test(w.text));

  const pairs: { label: string; value: string }[] = [];
  for (const n of numbers) {
    const candidates = labels.filter((l) => l.y < n.y);
    if (candidates.length === 0) continue;
    const nearest = candidates.reduce((closest, l) => {
      const d = (l.x - n.x) ** 2 + (n.y - l.y) ** 2;
      const closestD = (closest.x - n.x) ** 2 + (n.y - closest.y) ** 2;
      return d < closestD ? l : closest;
    });
    pairs.push({ label: nearest.text, value: n.text });
  }
  return pairs;
}

function toNumber(raw: string): number {
  return parseFloat(raw.replace(/,/g, "").replace(/%$/, ""));
}

// Fuzzy label matching: OCR often truncates or garbles labels ("K/D Ratio"
// -> "Ratio", "Top 10 Rate" -> "Rate"), so we match on a distinctive
// substring rather than requiring an exact label.
function findValue(
  pairs: { label: string; value: string }[],
  ...labelHints: string[]
): number | null {
  for (const hint of labelHints) {
    const match = pairs.find((p) => p.label.toLowerCase().includes(hint.toLowerCase()));
    if (match) return toNumber(match.value);
  }
  return null;
}

export type ParsedCareerStats = {
  matchesPlayed: number | null;
  wins: number | null;
  top10: number | null;
  eliminations: number | null;
  kd: number | null;
  winRatio: number | null;
  top10Rate: number | null;
  accuracy: number | null;
  headshotRate: number | null;
  headshots: number | null;
  avgDamage: number | null;
  totalDamage: number | null;
  mostEliminations: number | null;
  highestDamage: number | null;
  totalAssists: number | null;
  avgAssists: number | null;
  rawWordCount: number;
};

export function parseCareerStats(words: OcrWord[]): ParsedCareerStats {
  const pairs = pairLabelsToNumbers(words);
  return {
    matchesPlayed: findValue(pairs, "Matches"),
    wins: findValue(pairs, "Wins"),
    top10: findValue(pairs, "Top"),
    eliminations: findValue(pairs, "Eliminations"),
    kd: findValue(pairs, "Ratio", "K/D"),
    winRatio: findValue(pairs, "Win Ratio", "Ratio"),
    top10Rate: findValue(pairs, "Rate"),
    accuracy: findValue(pairs, "Accuracy"),
    headshotRate: findValue(pairs, "Headshot"),
    headshots: findValue(pairs, "Headshots"),
    avgDamage: findValue(pairs, "AVG Damage", "Damage"),
    totalDamage: findValue(pairs, "Total Damage", "Damage"),
    mostEliminations: findValue(pairs, "Most Eliminations"),
    highestDamage: findValue(pairs, "Highest Damage"),
    totalAssists: findValue(pairs, "Total Assists", "Assists"),
    avgAssists: findValue(pairs, "Avg. Assists", "Assists"),
    rawWordCount: words.length,
  };
}

export type ParsedWeaponStat = {
  weaponName: string | null;
  combatPower: number | null;
  damage: number | null;
  eliminations: number | null;
  accuracy: number | null;
  headshotRate: number | null;
};

// The weapon name appears in the screen's title bar ("AKM Combat Power"),
// not in the stats grid itself - handled separately from word pairing.
export function parseWeaponCapture(words: OcrWord[], titleText: string): ParsedWeaponStat {
  const pairs = pairLabelsToNumbers(words);
  const nameMatch = titleText.match(/^(.+?)\s+Combat Power/i);

  return {
    weaponName: nameMatch ? nameMatch[1].trim() : null,
    // Combat Power's stylized number font is known to OCR poorly - flagged
    // as null-prone until we build the dedicated crop-and-enhance pass.
    combatPower: findValue(pairs, "Current Combat Power", "Combat Power"),
    damage: findValue(pairs, "Damage"),
    eliminations: findValue(pairs, "Eliminations"),
    accuracy: findValue(pairs, "Accuracy"),
    headshotRate: findValue(pairs, "Headshot"),
  };
}
