import { useState } from "react";

const AdminDashboard = () => {
  const [hoveredKpi, setHoveredKpi] = useState<number | null>(null);

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ color: "white" }}>Admin Dashboard</h1>
        <p style={{ color: "#94a3b8" }}>
          System overview & performance summary
        </p>
      </div>

      {/* KPI GRID */}
      <div style={kpiGrid}>
        {[
          { title: "Total Users", value: "1,248" },
          { title: "Active Subscriptions", value: "842" },
          { title: "Monthly Revenue", value: "$12,450" },
          { title: "System Status", value: "Stable", success: true },
        ].map((item, index) => (
          <div
            key={index}
            style={{
              ...baseKpiCard,
              ...(hoveredKpi === index ? hoverKpiCard : {}),
            }}
            onMouseEnter={() => setHoveredKpi(index)}
            onMouseLeave={() => setHoveredKpi(null)}
          >
            <span style={{ color: "#cbd5f5", fontSize: 14 }}>{item.title}</span>
            <strong
              style={{
                fontSize: 22,
                marginTop: 6,
                color: item.success ? "#4ade80" : "white",
              }}
            >
              {item.value}
            </strong>
          </div>
        ))}
      </div>

      {/* ANALYTICS */}
      <div style={{ marginTop: "40px" }}>
        <h2 style={{ color: "white" }}>Analytics Overview</h2>

        <div style={chartGrid}>
          <div style={chartCard}>
            <h4 style={{ color: "white" }}>User Growth</h4>
            <div style={chartMock}>📈 Line chart</div>
          </div>

          <div style={chartCard}>
            <h4 style={{ color: "white" }}>Revenue Trend</h4>
            <div style={chartMock}>📊 Bar chart</div>
          </div>

          <div style={chartCard}>
            <h4 style={{ color: "white" }}>Subscriptions</h4>
            <div style={chartMock}>🥧 Pie chart</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= STYLES ================= */

const kpiGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "16px",
};

const baseKpiCard: React.CSSProperties = {
  background: "#1e293b",
  padding: "16px",
  borderRadius: "12px",
  display: "flex",
  flexDirection: "column",
  transition: "all 0.25s ease",
  cursor: "pointer",
};

const hoverKpiCard: React.CSSProperties = {
  background: "#900c80", // tím nhẹ kiểu Spotify
  transform: "translateY(-6px) scale(1.02)",
  boxShadow: "0 10px 30px rgba(0,0,0,0.4), 0 0 20px rgba(155,92,255,0.35)",
};

const chartGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "20px",
  marginTop: "20px",
};

const chartCard: React.CSSProperties = {
  background: "#170215",
  padding: "16px",
  borderRadius: "12px",
};

const chartMock: React.CSSProperties = {
  marginTop: "12px",
  height: "150px",
  background: "#0f172a",
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#94a3b8",
};

export default AdminDashboard;
