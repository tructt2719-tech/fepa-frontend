import StatCard from "../components/StatCard";
import IncomeExpenseChart from "../components/LineChart";
import DonutChart from "../components/DonutChart";
import { stats, lineChartData } from "../data/mockDashboard";

export default function Dashboard() {
  return (
    <div className="dashboard">
      {/* STAT CARDS */}
      <div className="stat-grid">
        {stats.map((s, i) => (
        <StatCard
            key={i}
            title={s.title}
            value={s.value}
            icon={s.icon}
            highlight={s.highlight}
            iconColor={s.iconColor}
            iconBg={s.iconBg}
        />
        ))}

      </div>

      {/* CHARTS */}
      <div className="chart-row">
        <div className="chart-box">
          <div className="chart-header">
            <div>
              <h3>Income vs Expenses</h3>
              <p>Last 6 months overview</p>
            </div>
            <button className="view-all">View All</button>
          </div>

          <IncomeExpenseChart data={lineChartData} />
        </div>

        <div className="chart-box">
          <h3>Spending by Category</h3>
          <DonutChart />
        </div>
      </div>
    </div>
  );
}
