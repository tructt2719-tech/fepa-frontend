import { useState } from "react";
import "../styles/analytic.css";
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
    <section className="analytics-page">
      <div className="analytics-container">
        {/* HEADER */}
        <header className="analytics-header">
          <h1 className="analytics-title">Financial Analytics</h1>
          <p className="analytics-subtitle">
            Detailed insights into your spending patterns
          </p>
        </header>

        {/* TABS */}
        <div className="analytics-tabs">
          <AnalyticsTabs activeTab={activeTab} onChange={setActiveTab} />
        </div>

        {/* CONTENT */}
        <div className="analytics-content">{renderChart()}</div>
      </div>
    </section>
  );
}
