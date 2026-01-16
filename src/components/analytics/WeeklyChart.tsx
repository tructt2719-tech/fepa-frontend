import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { week: "Week 1", expenses: 1050 },
  { week: "Week 2", expenses: 724 },
  { week: "Week 3", expenses: 420 },
  { week: "Week 4", expenses: 930 },
];

export default function WeeklyChart() {
  return (
    <div className="rounded-2xl bg-white/5 p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold">
          Weekly Expenses - This Month
        </h2>
        <span className="text-sm text-white/60">January 2026</span>
      </div>

      <div className="h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="week" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.08)" }}
              contentStyle={{
                background: "#ffffff",
                borderRadius: 12,
                border: "none",
              }}
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
