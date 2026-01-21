import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
} from "recharts";

/* ===== TYPES ===== */
interface ChartData {
  month: string;
  income: number;
  expense: number;
}

interface Props {
  data: ChartData[];
}
interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  // Lọc trùng dataKey (income / expense)
  const uniqueItems = Object.values(
    payload.reduce((acc: any, item: any) => {
      acc[item.dataKey] = item;
      return acc;
    }, {}),
  );

  return (
    <div
      style={{
        background: "var(--tooltip-bg)",
        padding: "12px 14px",
        borderRadius: "12px",
        color: "var(--tooltip-text)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
        fontSize: 14,
      }}
    >
      <strong style={{ display: "block", marginBottom: 6 }}>{label}</strong>

      {uniqueItems.map((item: any) => (
        <div key={item.dataKey}>
          {item.dataKey}: {item.value}
        </div>
      ))}
    </div>
  );
}

export default function IncomeExpenseChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={360}>
      <LineChart data={data}>
        {/* ===== GRADIENT FILL (FIGMA STYLE) ===== */}
        <defs>
          <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
          </linearGradient>

          <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ec4899" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#ec4899" stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* ===== GRID ===== */}
        <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />

        {/* ===== AXIS ===== */}
        <XAxis
          dataKey="month"
          stroke="var(--chart-text)"
          tick={{ fill: "var(--chart-text)" }}
        />

        <YAxis
          stroke="var(--chart-text)"
          tick={{ fill: "var(--chart-text)" }}
        />

        {/* ===== TOOLTIP ===== */}
        <Tooltip content={<CustomTooltip />} />

        {/* ===== AREA (ĐỘ PHỦ MÀU) ===== */}
        <Area
          type="monotone"
          dataKey="income"
          fill="url(#incomeFill)"
          stroke="none"
        />

        <Area
          type="monotone"
          dataKey="expense"
          fill="url(#expenseFill)"
          stroke="none"
        />

        {/* ===== LINE ===== */}
        <Line
          type="monotone"
          dataKey="income"
          stroke="#8b5cf6"
          strokeWidth={3}
          dot={{ r: 4, fill: "#8b5cf6" }}
        />

        <Line
          type="monotone"
          dataKey="expense"
          stroke="#ec4899"
          strokeWidth={3}
          dot={{ r: 4, fill: "#ec4899" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
