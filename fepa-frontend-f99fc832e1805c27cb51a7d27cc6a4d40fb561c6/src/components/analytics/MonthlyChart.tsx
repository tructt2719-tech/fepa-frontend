import { useExpenses } from "../../context/ExpenseContext";
import { useMemo } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";


/* DATA */
const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function MonthlyChart() {
  const { state } = useExpenses();

  const data = useMemo(() => {
    const map = Object.fromEntries(months.map(m => [m, 0]));

    state.expenses.forEach(e => {
      const m = months[new Date(e.date).getMonth()];
      map[m] += e.amount;
    });

    return months.map(m => ({ month: m, expenses: map[m] }));
  }, [state.expenses]);

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line dataKey="expenses" stroke="#ec4899" strokeWidth={3} />
      </LineChart>
    </ResponsiveContainer>
  );
}