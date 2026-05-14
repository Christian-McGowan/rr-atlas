import { useState } from "react";
import { Link } from "react-router-dom";

type CompareCity = "Fullerton" | "Irvine";

type CityComparison = {
  path: string;
  summary: string;
  rows: [string, string, string][];
};

const cityData: Record<CompareCity, CityComparison> = {
  Fullerton: {
    path: "/us/fullerton-ca",
    summary: "Fullerton is shown as a moderate-risk comparison city with lower fire risk but higher flood concern.",
    rows: [
      ["Risk Score", "High", "Medium"],
      ["Fire Risk", "High", "Low"],
      ["Flood Risk", "Low", "High"],
      ["Air Quality", "Moderate", "Moderate"],
      ["Community Resilience", "Medium", "Medium-High"]
    ]
  },
  Irvine: {
    path: "/us/irvine-ca",
    summary: "Irvine is shown as a lower-risk comparison city with stronger resilience and moderate edge wildfire risk.",
    rows: [
      ["Risk Score", "High", "Low-Medium"],
      ["Fire Risk", "High", "Medium"],
      ["Flood Risk", "Low", "Medium"],
      ["Air Quality", "Moderate", "Moderate"],
      ["Community Resilience", "Medium", "High"]
    ]
  }
};

const pageStyle = {
  minHeight: "100vh",
  padding: "96px 24px 40px",
  background: "linear-gradient(180deg, #f8fbff 0%, #eef6ff 100%)",
  color: "#0f172a"
};

const shellStyle = {
  maxWidth: 900,
  margin: "0 auto",
  display: "grid",
  gap: 20
};

const cardStyle = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: 18,
  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)"
};

const selectorCardStyle = {
  ...cardStyle,
  padding: 20
};

const selectorRowStyle = {
  display: "flex",
  flexWrap: "wrap" as const,
  gap: 10
};

const tableStyle = {
  width: "100%",
  minWidth: 560,
  borderCollapse: "collapse" as const
};

const cellHeaderStyle = {
  padding: "14px 16px",
  textAlign: "left" as const,
  borderBottom: "1px solid #e2e8f0",
  color: "#334155",
  fontSize: 14
};

const cellStyle = {
  padding: "14px 16px",
  borderBottom: "1px solid #e2e8f0",
  color: "#0f172a"
};

export default function ComparePage() {
  const [selectedCity, setSelectedCity] = useState<CompareCity>("Fullerton");
  const selected = cityData[selectedCity];

  return (
    <main className="compare-page" style={pageStyle}>
      <section className="compare-shell" style={shellStyle}>
        <div className="compare-intro">
          <p className="compare-eyebrow">Prototype comparison</p>
          <h1 style={{ margin: 0, fontSize: 36, letterSpacing: "-0.03em" }}>Compare Cities</h1>
          <p style={{ maxWidth: 660, margin: "12px 0 0", color: "#475569", lineHeight: 1.5 }}>
            Compare Los Angeles with one nearby city at a time using demo risk and resilience indicators.
          </p>
        </div>

        <div className="compare-selector-card" style={selectorCardStyle}>
          <h2 style={{ margin: "0 0 12px", fontSize: 20 }}>Select comparison city</h2>

          <div className="compare-selector-row" style={selectorRowStyle}>
            {(["Fullerton", "Irvine"] as CompareCity[]).map((city) => {
              const active = selectedCity === city;

              return (
                <button
                  key={city}
                  type="button"
                  onClick={() => setSelectedCity(city)}
                  className={active ? "compare-city-button is-active" : "compare-city-button"}
                  style={{
                    border: active ? "1px solid #2563eb" : "1px solid #cbd5e1",
                    background: active ? "#2563eb" : "#ffffff",
                    color: active ? "#ffffff" : "#334155",
                    borderRadius: 999,
                    padding: "10px 16px",
                    fontWeight: 800,
                    cursor: "pointer"
                  }}
                >
                  {city}
                </button>
              );
            })}

            <button
              type="button"
              disabled
              className="compare-city-button is-disabled"
              style={{
                border: "1px solid #cbd5e1",
                background: "#f8fafc",
                color: "#64748b",
                borderRadius: 999,
                padding: "10px 16px",
                fontWeight: 800,
                cursor: "not-allowed"
              }}
            >
              Pasadena soon
            </button>

            <button
              type="button"
              disabled
              className="compare-city-button is-disabled"
              style={{
                border: "1px solid #cbd5e1",
                background: "#f8fafc",
                color: "#64748b",
                borderRadius: 999,
                padding: "10px 16px",
                fontWeight: 800,
                cursor: "not-allowed"
              }}
            >
              Riverside soon
            </button>
          </div>
        </div>

        <div className="compare-table-card" style={{ ...cardStyle, overflow: "hidden" }}>
          <div
            className="compare-table-header"
            style={{
              padding: "18px 20px",
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap"
            }}
          >
            <div>
              <h2 style={{ margin: 0, fontSize: 22 }}>Los Angeles vs {selectedCity}</h2>
              <p style={{ margin: "6px 0 0", color: "#64748b" }}>{selected.summary}</p>
            </div>

            <Link
              to={selected.path}
              className="compare-profile-link"
              style={{ color: "#2563eb", fontWeight: 800, textDecoration: "none" }}
            >
              View {selectedCity} →
            </Link>
          </div>

          <div className="compare-table-scroll" style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  <th style={cellHeaderStyle}>Category</th>
                  <th style={cellHeaderStyle}>Los Angeles</th>
                  <th style={cellHeaderStyle}>{selectedCity}</th>
                </tr>
              </thead>

              <tbody>
                {selected.rows.map(([category, losAngeles, comparison]) => (
                  <tr key={category}>
                    <td style={cellStyle}>
                      <strong>{category}</strong>
                    </td>
                    <td style={cellStyle}>{losAngeles}</td>
                    <td style={cellStyle}>{comparison}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
