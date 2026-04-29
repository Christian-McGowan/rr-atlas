import React from "react";

export default function MiniLineChart({
  points,
  height = 90
}: {
  points: number[];
  height?: number;
}) {
  const w = 320;
  const h = height;
  const pad = 10;

  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = Math.max(1, max - min);

  const d = points
    .map((v, i) => {
      const x = pad + (i * (w - pad * 2)) / (points.length - 1);
      const y = pad + (h - pad * 2) * (1 - (v - min) / span);
      return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} role="img" aria-label="trend">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="3" opacity="0.9" />
    </svg>
  );
}
