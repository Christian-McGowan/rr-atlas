import React from "react";

export default function BarBreakdown({
  items
}: {
  items: { label: string; value: number }[];
}) {
  const max = Math.max(...items.map((i) => i.value), 1);

  return (
    <div style={{ display: "grid", gap: 10 }}>
      {items.map((i) => (
        <div key={i.label} style={{ display: "grid", gridTemplateColumns: "120px 1fr 44px", gap: 10, alignItems: "center" }}>
          <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.85 }}>{i.label}</div>
          <div style={{ height: 10, borderRadius: 999, background: "rgba(15,23,42,0.08)", overflow: "hidden" }}>
            <div
              style={{
                width: `${Math.round((i.value / max) * 100)}%`,
                height: "100%",
                borderRadius: 999,
                background: "rgba(37,99,235,0.85)"
              }}
            />
          </div>
          <div style={{ fontSize: 13, fontWeight: 800, textAlign: "right" }}>{i.value}</div>
        </div>
      ))}
    </div>
  );
}
