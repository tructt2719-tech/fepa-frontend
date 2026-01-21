import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Food", value: 1200, color: "#8b5cf6" },
  { name: "Transport", value: 450, color: "#06b6d4" },
  { name: "Entertainment", value: 380, color: "#f59e0b" },
  { name: "Bills", value: 1280, color: "#22c55e" },
];

export default function DonutChart() {
  return (
    <div className="donut-wrapper">
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={4}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{
              background: "var(--tooltip-bg)",
              color: "var(--tooltip-text)",
              border: "none",
              borderRadius: "12px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
            }}
            labelStyle={{
              color: "var(--tooltip-text)",
              fontWeight: 600,
            }}
            itemStyle={{
              color: "var(--tooltip-text)",
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* LEGEND */}
      <div className="donut-legend">
        {data.map((item) => (
          <div key={item.name} className="legend-item">
            <span className="dot" style={{ background: item.color }} />
            <span>{item.name}</span>
            <span className="amount">${item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
