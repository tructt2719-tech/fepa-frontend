import { useExpenses } from "../../context/ExpenseContext";
import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function QuarterlyChart() {
  const { state } = useExpenses();

  const data = useMemo(() => {
  const map: Record<"Q1" | "Q2" | "Q3" | "Q4", number> = {
    Q1: 0,
    Q2: 0,
    Q3: 0,
    Q4: 0,
  };

  state.expenses.forEach((e) => {
    const q = Math.floor(new Date(e.date).getMonth() / 3) + 1;
    const key = `Q${q}` as "Q1" | "Q2" | "Q3" | "Q4";
    map[key] += e.amount;
  });

  return Object.entries(map).map(([quarter, expenses]) => ({
    quarter,
    expenses,
  }));
}, [state.expenses]);

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data}>
        <XAxis dataKey="quarter" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="expenses" fill="#ec4899" radius={[8,8,0,0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}