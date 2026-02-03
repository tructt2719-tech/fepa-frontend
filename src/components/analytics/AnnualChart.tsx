import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { year: "2022", income: 48000, expenses: 38000 },
  { year: "2023", income: 52000, expenses: 42000 },
  { year: "2024", income: 56000, expenses: 45000 },
  { year: "2025", income: 60000, expenses: 47000 },
];

export default function AnnualChart() {
  return (
    <div className="rounded-2xl bg-white/5 p-6">
  <h2 className="text-lg font-semibold mb-4">
    Annual Growth
  </h2>

  <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="year" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                background: "#ffffff",
                borderRadius: 12,
                border: "none",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#ec4899"
              strokeWidth={3}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
