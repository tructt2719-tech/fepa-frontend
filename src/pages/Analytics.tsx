import { useState } from "react";

/* TAB COMPONENT */
import AnalyticsTabs from "../components/analytics/AnalyticsTabs";

/* CHART COMPONENTS */
import DailyChart from "../components/analytics/DailyChart";
import WeeklyChart from "../components/analytics/WeeklyChart";
import MonthlyChart from "../components/analytics/MonthlyChart";
import QuarterlyChart from "../components/analytics/QuarterlyChart";
import AnnualChart from "../components/analytics/AnnualChart";

type AnalyticsTab = "daily" | "weekly" | "monthly" | "quarterly" | "annual";

export default function Analytics() {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>("weekly");

  const renderChart = () => {
    switch (activeTab) {
      case "daily":
        return <DailyChart />;
      case "weekly":
        return <WeeklyChart />;
      case "monthly":
        return <MonthlyChart />;
      case "quarterly":
        return <QuarterlyChart />;
      case "annual":
        return <AnnualChart />;
      default:
        return null;
    }
  };

  return (
    <div className="p-8 space-y-8 text-white">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Financial Analytics</h1>
        <p className="text-white/60">
          Detailed insights into your spending patterns
        </p>
      </div>

      {/* TABS */}
      <AnalyticsTabs activeTab={activeTab} onChange={setActiveTab} />

      {/* CHART */}
      {renderChart()}
    </div>
  );
}
