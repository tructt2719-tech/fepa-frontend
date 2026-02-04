import { useExpenses } from "../../context/ExpenseContext";
import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function WeeklyChart() {
  const { state } = useExpenses();

  const data = useMemo(() => {
    const map: Record<string, number> = {};

    state.expenses.forEach((e) => {
      const week = `Week ${Math.ceil(new Date(e.date).getDate() / 7)}`;
      map[week] = (map[week] || 0) + e.amount;
    });

    return Object.entries(map).map(([week, expenses]) => ({
      week,
      expenses,
    }));
  }, [state.expenses]);

  return (
    <div className="rounded-2xl bg-white/5 p-6">
      <h2 className="text-lg font-semibold mb-4">
        Weekly Expenses - This Month
      </h2>

      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="expenses" fill="#ec4899" radius={[8,8,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}