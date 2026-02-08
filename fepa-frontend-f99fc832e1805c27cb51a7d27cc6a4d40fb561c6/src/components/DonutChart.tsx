import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// Bảng màu dự phòng để gán cho các category từ database
const COLORS = ["#8b5cf6", "#06b6d4", "#f59e0b", "#22c55e", "#ec4899", "#6366f1"];

interface ChartData {
  category: string;
  value: number;
  color?: string;
}

export default function DonutChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  // Lấy userId từ localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user.id || 1;

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/dashboard/charts/${userId}`)
      .then((res) => res.json())
      .then((apiData) => {
        // Gán màu sắc cho từng category nhận được từ backend
        const formattedData = apiData.map((item: any, index: number) => ({
          name: item.category, // Recharts cần 'name' hoặc dùng nameKey
          value: item.value,
          color: COLORS[index % COLORS.length],
        }));
        setData(formattedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi tải Donut Chart:", err);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <div className="loading-text">Loading chart...</div>;
  if (data.length === 0) return <div className="empty-state">No expense data found</div>;

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
              <Cell key={`cell-${index}`} fill={entry.color} />
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
          />
        </PieChart>
      </ResponsiveContainer>

      {/* LEGEND - Tự động render theo category trong database */}
      <div className="donut-legend">
        {data.map((item) => (
          <div key={item.name} className="legend-item">
            <span className="dot" style={{ background: item.color }} />
            <span>{item.name}</span>
            <span className="amount"> ${item.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}