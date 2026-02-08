import { useExpenses } from "../../context/ExpenseContext";
import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function AnnualChart() {
  const { state } = useExpenses();

  const data = useMemo(() => {
    const map: Record<string, number> = {};

    state.expenses.forEach(e => {
      const y = new Date(e.date).getFullYear().toString();
      map[y] = (map[y] || 0) + e.amount;
    });

    return Object.entries(map).map(([year, expenses]) => ({
      year, expenses
    }));
  }, [state.expenses]);

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data}>
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Line dataKey="expenses" stroke="#ec4899" strokeWidth={3} />
      </LineChart>
    </ResponsiveContainer>
  );
}