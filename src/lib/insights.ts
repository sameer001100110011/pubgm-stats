// Rule-based insights - NOT a machine learning model. Every insight here
// is a direct comparison or arithmetic result computed from the player's
// own captured data. This is deliberate: a real predictive model needs a
// training dataset across many users, which doesn't exist yet (one
// player's captures is one data point, not something to learn a pattern
// from). These insights are honest about what they are - comparisons,
// not predictions - and say so in their own copy.

import type { CareerSnapshot, WeaponSnapshot } from "./captureHistory";

export type Insight = { title: string; detail: string };

export function buildWeaponInsights(weapons: WeaponSnapshot[]): Insight[] {
  const insights: Insight[] = [];
  const withAccuracy = weapons.filter((w) => w.accuracy !== null);
  const withDamage = weapons.filter((w) => w.damage !== null);

  if (withAccuracy.length >= 2) {
    const best = withAccuracy.reduce((a, b) => (b.accuracy! > a.accuracy! ? b : a));
    const worst = withAccuracy.reduce((a, b) => (b.accuracy! < a.accuracy! ? b : a));
    if (best.weaponName !== worst.weaponName) {
      insights.push({
        title: `${best.weaponName} is your most accurate weapon`,
        detail: `${best.accuracy}% accuracy, vs ${worst.accuracy}% on your ${worst.weaponName} — a real gap worth noticing, not a guess.`,
      });
    }
  }

  if (withDamage.length >= 2) {
    const topDamage = withDamage.reduce((a, b) => (b.damage! > a.damage! ? b : a));
    insights.push({
      title: `${topDamage.weaponName} has done the most total damage`,
      detail: `${topDamage.damage!.toLocaleString()} damage across your captures — your primary carry weapon so far.`,
    });
  }

  const withHeadshot = weapons.filter((w) => w.headshotRate !== null);
  if (withHeadshot.length >= 2) {
    const best = withHeadshot.reduce((a, b) => (b.headshotRate! > a.headshotRate! ? b : a));
    insights.push({
      title: `${best.weaponName} lands the most headshots`,
      detail: `${best.headshotRate}% headshot rate — your most precise weapon by this measure.`,
    });
  }

  return insights;
}

export function buildCareerInsights(history: CareerSnapshot[]): Insight[] {
  const insights: Insight[] = [];
  if (history.length < 2) return insights;

  const latest = history[history.length - 1];
  const previous = history[history.length - 2];

  if (latest.kd !== null && previous.kd !== null) {
    const delta = latest.kd - previous.kd;
    if (Math.abs(delta) > 0.05) {
      insights.push({
        title: `K/D ${delta > 0 ? "up" : "down"} ${Math.abs(delta).toFixed(2)} since your last capture`,
        detail: `${previous.kd} → ${latest.kd}, comparing your two most recent captures directly.`,
      });
    }
  }

  if (latest.winRatio !== null && previous.winRatio !== null) {
    const delta = latest.winRatio - previous.winRatio;
    if (Math.abs(delta) > 0.5) {
      insights.push({
        title: `Win ratio ${delta > 0 ? "improved" : "dropped"} ${Math.abs(delta).toFixed(1)}%`,
        detail: `${previous.winRatio}% → ${latest.winRatio}% between your last two captures.`,
      });
    }
  }

  return insights;
}
