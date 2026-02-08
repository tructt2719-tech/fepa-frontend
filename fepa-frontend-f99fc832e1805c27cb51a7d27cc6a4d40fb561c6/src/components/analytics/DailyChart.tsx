import { useExpenses } from "../../context/ExpenseContext";
import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function DailyChart() {
  const { state } = useExpenses();

  const data = useMemo(() => {
    const map = Object.fromEntries(days.map(d => [d, 0]));

    state.expenses.forEach(e => {
      const d = days[new Date(e.date).getDay()];
      map[d] += e.amount;
    });

    return days.map(d => ({ day: d, value: map[d] }));
  }, [state.expenses]);

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data}>
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#8b5cf6" radius={[6,6,0,0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}