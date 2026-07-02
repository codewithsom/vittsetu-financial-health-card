import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { bandHex, scoreBand } from "@/data/msmes";

export function ScoreGauge({ score, size = 220 }: { score: number; size?: number }) {
  const [display, setDisplay] = useState(0);
  const mv = useMotionValue(0);
  const dash = useTransform(mv, (v) => `${(v / 100) * 502} 502`);
  const color = bandHex(score);
  const band = scoreBand(score);

  useEffect(() => {
    const controls = animate(mv, score, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [score, mv]);

  const r = 80;
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 200 200" className="-rotate-90" width={size} height={size}>
        <circle cx="100" cy="100" r={r} strokeWidth="14" fill="none" className="stroke-muted" />
        <motion.circle
          cx="100"
          cy="100"
          r={r}
          strokeWidth="14"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          style={{ strokeDasharray: dash as unknown as string }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-5xl font-bold tabular-nums" style={{ color }}>
          {display}
        </div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
          out of 100
        </div>
        <div
          className="mt-2 text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border"
          style={{ color, borderColor: color, background: `${color}12` }}
        >
          {band === "strong" ? "Healthy" : band === "moderate" ? "Watchlist" : "High Risk"}
        </div>
      </div>
    </div>
  );
}