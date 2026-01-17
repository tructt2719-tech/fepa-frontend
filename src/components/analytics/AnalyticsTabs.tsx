type AnalyticsTab =
  | "daily"
  | "weekly"
  | "monthly"
  | "quarterly"
  | "annual";

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
    <div className="inline-flex rounded-full bg-white/5 p-1">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;

        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition
              ${
                isActive
                  ? "bg-white/10 text-white shadow"
                  : "text-white/60 hover:text-white"
              }
            `}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
