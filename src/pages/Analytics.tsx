import { useState } from "react";

/* IMPORT CHART COMPONENTS */
import DailyChart from "../components/analytics/DailyChart";
import WeeklyChart from "../components/analytics/WeeklyChart";
import MonthlyChart from "../components/analytics/MonthlyChart";
import QuarterlyChart from "../components/analytics/QuarterlyChart";
import AnnualChart from "../components/analytics/AnnualChart";

const TABS = ["Daily", "Weekly", "Monthly", "Quarterly", "Annual"] as const;
type TabType = typeof TABS[number];

export default function Analytics() {
  const [range, setRange] = useState<TabType>("Monthly");

  const renderChart = () => {
    switch (range) {
      case "Daily":
        return <DailyChart />;
      case "Weekly":
        return <WeeklyChart />;
      case "Monthly":
        return <MonthlyChart />;
      case "Quarterly":
        return <QuarterlyChart />;
      case "Annual":
        return <AnnualChart />;
      default:
        return null;
    }
  };

  return (
    <div className="page analytics-page">
      {/* HEADER */}
      <div className="analytics-header">
        <h1>Financial Analytics</h1>
        <p>Detailed insights into your spending patterns</p>
      </div>

      {/* TABS */}
      <div className="analytics-tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={range === tab ? "active" : ""}
            onClick={() => setRange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="analytics-content">{renderChart()}</div>
    </div>
  );
}
