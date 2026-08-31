// Local capture history — works today without Supabase configured, and is
// structured so swapping the storage backend later (to real Supabase
// persistence) doesn't change anything that reads from it. This is
// intentionally honest: until Supabase is wired, "saving" a report means
// "stays on this device," not "stays forever" - surfaced in the UI, not
// hidden.

import type { ParsedCareerStats } from "./statParser";
import type { ParsedWeaponStat } from "./statParser";

export type CareerSnapshot = ParsedCareerStats & { ign: string; capturedAt: string };
export type WeaponSnapshot = ParsedWeaponStat & { capturedAt: string };

const CAREER_KEY = "dropcard:career_history";
const WEAPON_KEY = "dropcard:weapon_history";

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, items: T[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(items));
}

export function saveCareerSnapshot(stats: ParsedCareerStats, ign: string) {
  const items = read<CareerSnapshot>(CAREER_KEY);
  items.push({ ...stats, ign, capturedAt: new Date().toISOString() });
  write(CAREER_KEY, items);
}

export function getCareerHistory(): CareerSnapshot[] {
  return read<CareerSnapshot>(CAREER_KEY).sort((a, b) => a.capturedAt.localeCompare(b.capturedAt));
}

export function saveWeaponSnapshot(stats: ParsedWeaponStat) {
  const items = read<WeaponSnapshot>(WEAPON_KEY);
  items.push({ ...stats, capturedAt: new Date().toISOString() });
  write(WEAPON_KEY, items);
}

export function getWeaponHistory(): WeaponSnapshot[] {
  return read<WeaponSnapshot>(WEAPON_KEY).sort((a, b) => a.capturedAt.localeCompare(b.capturedAt));
}

// Latest snapshot per weapon name - used for weapon comparison insights,
// where we want each weapon's most recent numbers, not every historical
// capture of it.
export function getLatestPerWeapon(): WeaponSnapshot[] {
  const all = getWeaponHistory();
  const latest = new Map<string, WeaponSnapshot>();
  for (const w of all) {
    if (w.weaponName) latest.set(w.weaponName, w);
  }
  return Array.from(latest.values());
}

export function getCaptureStreak(): number {
  const all = [...getCareerHistory(), ...getWeaponHistory()]
    .map((s) => s.capturedAt.slice(0, 10))
    .sort()
    .reverse();
  const uniqueDays = Array.from(new Set(all));
  if (uniqueDays.length === 0) return 0;

  let streak = 1;
  for (let i = 1; i < uniqueDays.length; i++) {
    const prev = new Date(uniqueDays[i - 1]);
    const curr = new Date(uniqueDays[i]);
    const diffDays = Math.round((prev.getTime() - curr.getTime()) / 86400000);
    if (diffDays === 1) streak++;
    else break;
  }
  return streak;
}
