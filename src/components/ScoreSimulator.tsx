import { useMemo, useState } from "react";
import { Sparkles, RotateCcw } from "lucide-react";
import { bandHex, type MSMEProfile } from "@/data/msmes";
import { motion } from "framer-motion";

const DIMS = [
  { key: "compliance", label: "GST filing consistency", weight: 0.2 },
  { key: "digitalFootprint", label: "UPI transaction volume", weight: 0.15 },
  { key: "cashFlowHealth", label: "Cash flow buffer", weight: 0.25 },
  { key: "debtBehavior", label: "On-time EMI repayment", weight: 0.15 },
  { key: "revenueStability", label: "Revenue growth", weight: 0.25 },
] as const;

export function ScoreSimulator({ msme }: { msme: MSMEProfile }) {
  const base = msme.scores;
  const [deltas, setDeltas] = useState<Record<string, number>>({});

  const projected = useMemo(() => {
    let overall = 0;
    const perDim: Record<string, number> = {};
    for (const d of DIMS) {
      const v = Math.max(0, Math.min(100, (base as any)[d.key] + (deltas[d.key] ?? 0)));
      perDim[d.key] = v;
      overall += v * d.weight;
    }
    return { overall: Math.round(overall), perDim };
  }, [deltas, base]);

  const diff = projected.overall - base.overall;
  const color = bandHex(projected.overall);

  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" style={{ color: "#0d9488" }} />
          <div className="text-sm font-semibold" style={{ color: "#1a3a6c" }}>Scenario Simulator</div>
        </div>
        <button
          onClick={() => setDeltas({})}
          className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
        >
          <RotateCcw className="h-3 w-3" /> Reset
        </button>
      </div>
      <p className="text-xs text-muted-foreground mb-4">Drag the sliders to see how each signal moves the overall score in real time.</p>

      <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
        <div className="space-y-4">
          {DIMS.map((d) => {
            const delta = deltas[d.key] ?? 0;
            return (
              <div key={d.key}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-foreground">{d.label}</span>
                  <span className={`font-semibold tabular-nums ${delta > 0 ? "text-emerald-600" : delta < 0 ? "text-red-600" : "text-muted-foreground"}`}>
                    {delta > 0 ? "+" : ""}{delta}%
                  </span>
                </div>
                <input
                  type="range" min={-20} max={20} step={1} value={delta}
                  onChange={(e) => setDeltas((s) => ({ ...s, [d.key]: Number(e.target.value) }))}
                  className="w-full accent-teal-600"
                />
              </div>
            );
          })}
        </div>
        <div className="rounded-xl p-5 flex flex-col items-center justify-center" style={{ background: `${color}0f`, border: `1px solid ${color}33` }}>
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Projected score</div>
          <motion.div key={projected.overall} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-5xl font-bold tabular-nums mt-1" style={{ color }}>
            {projected.overall}
          </motion.div>
          <div className="text-xs mt-2">
            <span className="text-muted-foreground">was {base.overall} · </span>
            <span className={`font-semibold ${diff > 0 ? "text-emerald-600" : diff < 0 ? "text-red-600" : "text-muted-foreground"}`}>
              {diff > 0 ? "+" : ""}{diff} pts
            </span>
          </div>
          <div className="mt-4 w-full text-[11px] text-muted-foreground text-center italic">
            "What-if" projections are directional and don't affect the recorded score.
          </div>
        </div>
      </div>
    </div>
  );
}