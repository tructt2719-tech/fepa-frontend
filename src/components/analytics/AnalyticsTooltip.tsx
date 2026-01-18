export const COLORS: Record<string, string> = {
  income: "#10b981",
  expenses: "#ec4899",
  savings: "#8b5cf6",

  food: "#8b5cf6",
  transport: "#ec4899",
  shopping: "#06b6d4",
  bills: "#f59e0b",
};

export const AnalyticsTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        background: "#020617",
        borderRadius: 8,
        padding: "10px 12px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
        fontSize: 13,
      }}
    >
      <p style={{ color: "#e5e7eb", marginBottom: 6 }}>{label}</p>

      {payload.map((item: any) => (
        <div
          key={item.dataKey}
          style={{
            color: COLORS[item.dataKey] ?? "#e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <span style={{ textTransform: "capitalize" }}>
            {item.name}
          </span>
          <span>{item.value}</span>
        </div>
      ))}
    </div>
  );
};
