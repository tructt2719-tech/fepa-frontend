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
const overviewData = [
  { month: "Jul", income: 4500, expenses: 3200, savings: 1300 },
  { month: "Aug", income: 4800, expenses: 3500, savings: 1300 },
  { month: "Sep", income: 4600, expenses: 3800, savings: 800 },
  { month: "Oct", income: 5200, expenses: 4100, savings: 1100 },
  { month: "Nov", income: 5000, expenses: 3900, savings: 1100 },
  { month: "Dec", income: 5500, expenses: 4300, savings: 1200 },
];

const categoryData = [
  { month: "Jul", food: 1200, transport: 1600, shopping: 2600, bills: 3800 },
  { month: "Aug", food: 1300, transport: 1700, shopping: 2800, bills: 4000 },
  { month: "Sep", food: 1400, transport: 1800, shopping: 2800, bills: 4000 },
  { month: "Oct", food: 1200, transport: 1600, shopping: 2900, bills: 4200 },
  { month: "Nov", food: 1300, transport: 1700, shopping: 2800, bills: 4000 },
  { month: "Dec", food: 1400, transport: 1900, shopping: 3100, bills: 4500 },
];

export default function MonthlyChart() {
  return (
    <>
      {/* MONTHLY OVERVIEW */}
      <div className="analytics-card">
  <div className="analytics-card-header">
    <h3>Monthly Overview</h3>
    <span className="positive">↗ Savings rate: 24%</span>
  </div>

  {/* LEGEND */}
  <div className="chart-legend">
    <span className="income">● Income</span>
    <span className="expenses">● Expenses</span>
    <span className="savings">● Savings</span>
  </div>

  <ResponsiveContainer width="100%" height={320}>
    <LineChart data={overviewData}>
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Line dataKey="income" stroke="#10b981" strokeWidth={2} />
      <Line dataKey="expenses" stroke="#ec4899" strokeWidth={2} />
      <Line dataKey="savings" stroke="#8b5cf6" strokeWidth={2} />
    </LineChart>
  </ResponsiveContainer>
</div>


      {/* CATEGORY TRENDS */}
      <div className="analytics-card">
        <h3>Category Trends</h3>

        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area dataKey="food" stroke="#8b5cf6" fill="#8b5cf633" />
            <Area dataKey="transport" stroke="#ec4899" fill="#ec489933" />
            <Area dataKey="shopping" stroke="#06b6d4" fill="#06b6d433" />
            <Area dataKey="bills" stroke="#f59e0b" fill="#f59e0b33" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
