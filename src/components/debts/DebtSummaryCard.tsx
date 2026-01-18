type DebtSummaryCardProps = {
  title: string;
  value: string | number;
  variant?: "default" | "danger";
};

export default function DebtSummaryCard({
  title,
  value,
  variant = "default",
}: DebtSummaryCardProps) {
  return (
    <div className={`summary-card ${variant}`}>
      <p className="summary-title">{title}</p>
      <h2 className="summary-value">{value}</h2>
    </div>
  );
}
