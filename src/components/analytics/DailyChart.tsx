import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { day: "Mon", value: 80 },
  { day: "Tue", value: 50 },
  { day: "Wed", value: 70 },
  { day: "Thu", value: 190 },
  { day: "Fri", value: 110 },
  { day: "Sat", value: 200 },
  { day: "Sun", value: 250 },
];

export default function DailyChart() {
  return (
    <div className="analytics-card">
      <h3>Daily Expenses - This Week</h3>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
