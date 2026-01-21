type AnalyticsTab = "daily" | "weekly" | "monthly" | "quarterly" | "annual";

interface Props {
  activeTab: AnalyticsTab;
  onChange: (tab: AnalyticsTab) => void;
}

export default function AnalyticsTabs({ activeTab, onChange }: Props) {
  const tabs: { key: AnalyticsTab; label: string }[] = [
    { key: "daily", label: "Daily" },
    { key: "weekly", label: "Weekly" },
    { key: "monthly", label: "Monthly" },
    { key: "quarterly", label: "Quarterly" },
    { key: "annual", label: "Annual" },
  ];

  return (
    <div className="analytics-tabs">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;

        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={isActive ? "active" : ""}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
