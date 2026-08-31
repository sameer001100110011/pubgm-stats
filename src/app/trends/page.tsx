"use client";

import { useEffect, useState } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  getCareerHistory, getLatestPerWeapon, getCaptureStreak,
  type CareerSnapshot, type WeaponSnapshot,
} from "@/lib/captureHistory";
import { buildWeaponInsights, buildCareerInsights, type Insight } from "@/lib/insights";

// Real trends and insights page, built entirely from what's actually been
// captured on this device so far. Empty and honest until there's real
// data - no placeholder numbers, unlike an earlier draft of this project
// that had to be corrected for exactly that.
export default function TrendsPage() {
  const [career, setCareer] = useState<CareerSnapshot[]>([]);
  const [weapons, setWeapons] = useState<WeaponSnapshot[]>([]);
  const [streak, setStreak] = useState(0);
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    const careerHistory = getCareerHistory();
    const weaponHistory = getLatestPerWeapon();
    setCareer(careerHistory);
    setWeapons(weaponHistory);
    setStreak(getCaptureStreak());
    setInsights([...buildCareerInsights(careerHistory), ...buildWeaponInsights(weaponHistory)]);
  }, []);

  const hasData = career.length > 0 || weapons.length > 0;

  return (
    <main className="min-h-screen bg-[--color-bg] text-[--color-text] px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <p className="stencil-label text-[--color-brass] mb-2">Dropcard</p>
        <h1 className="font-display text-3xl mb-2">Your trends</h1>
        <p className="text-[--color-text-dim] text-sm mb-8">
          Built from captures saved on this device — nothing here is estimated or
          placeholder data.
        </p>

        {!hasData && (
          <div className="rounded-2xl border border-dashed border-[--color-border] p-10 text-center">
            <p className="text-[--color-text-dim]">
              No captures yet.{" "}
              <a href="/capture" className="text-[--color-brass] underline">
                Capture your first report
              </a>{" "}
              to start building trends.
            </p>
          </div>
        )}

        {hasData && (
          <>
            <div className="rounded-2xl border border-[--color-brass]/40 p-6 mb-8 flex items-center justify-between">
              <div>
                <p className="stencil-label text-[--color-olive]">Capture streak</p>
                <p className="font-display text-3xl text-[--color-brass] mt-1">
                  {streak} {streak === 1 ? "day" : "days"}
                </p>
              </div>
              <p className="text-xs text-[--color-text-dim] max-w-[160px] text-right">
                Capture on consecutive days to build this — real, counted from your
                actual capture timestamps.
              </p>
            </div>

            {insights.length > 0 && (
              <div className="mb-8">
                <h2 className="font-display text-lg mb-4">Insights</h2>
                <div className="space-y-3">
                  {insights.map((ins, i) => (
                    <div key={i} className="rounded-xl border border-[--color-border] p-4">
                      <p className="font-display text-sm text-[--color-brass]">{ins.title}</p>
                      <p className="text-xs text-[--color-text-dim] mt-1">{ins.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {insights.length === 0 && (
              <p className="text-xs text-[--color-text-dim] mb-8">
                Capture at least 2 reports (career or weapon) to start seeing insights —
                these are direct comparisons between your captures, not predictions.
              </p>
            )}

            {career.length >= 2 && (
              <div className="mb-8">
                <h2 className="font-display text-lg mb-4">K/D over time</h2>
                <div className="rounded-2xl border border-[--color-border] p-4 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={career}>
                      <CartesianGrid stroke="#33382a" />
                      <XAxis
                        dataKey="capturedAt"
                        tickFormatter={(v) => new Date(v).toLocaleDateString()}
                        stroke="#9a9c8c"
                        fontSize={11}
                      />
                      <YAxis stroke="#9a9c8c" fontSize={11} />
                      <Tooltip
                        contentStyle={{ background: "#1b1e17", border: "1px solid #33382a" }}
                      />
                      <Line type="monotone" dataKey="kd" stroke="#c9a227" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {weapons.length > 0 && (
              <div>
                <h2 className="font-display text-lg mb-4">Weapon accuracy comparison</h2>
                <div className="rounded-2xl border border-[--color-border] p-4 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weapons}>
                      <CartesianGrid stroke="#33382a" />
                      <XAxis dataKey="weaponName" stroke="#9a9c8c" fontSize={11} />
                      <YAxis stroke="#9a9c8c" fontSize={11} />
                      <Tooltip
                        contentStyle={{ background: "#1b1e17", border: "1px solid #33382a" }}
                      />
                      <Bar dataKey="accuracy" fill="#7a8b5c" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
