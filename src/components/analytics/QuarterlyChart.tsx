import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { quarter: "Q1 2025", income: 13800, expenses: 10200 },
  { quarter: "Q2 2025", income: 14400, expenses: 11200 },
  { quarter: "Q3 2025", income: 15200, expenses: 11800 },
  { quarter: "Q4 2025", income: 15800, expenses: 12100 },
];

export default function QuarterlyChart() {
  return (
    <div className="rounded-2xl bg-white/5 p-6">
      <h2 className="text-lg font-semibold mb-4">
        Quarterly Performance
      </h2>

      <div className="h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="quarter" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                background: "#ffffff",
                borderRadius: 12,
                border: "none",
              }}
            />
            <Legend />
            <Bar
              dataKey="income"
              fill="#10b981"
              radius={[8, 8, 0, 0]}
            />
            <Bar
              dataKey="expenses"
              fill="#ec4899"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
