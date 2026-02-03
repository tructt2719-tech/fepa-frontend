type DebtSummaryCardProps = {
  title: string;
  value: number;
  variant?: "default" | "danger";
  isCurrency?: boolean;
};

export default function DebtSummaryCard({
  title,
  value,
  variant = "default",
  isCurrency = false,
}: DebtSummaryCardProps) {
  const displayValue = isCurrency
    ? `$${value.toLocaleString()}`
    : value.toLocaleString();

  return (
    <div className={`summary-card ${variant}`}>
      <p className="summary-title">{title}</p>
      <h2 className="summary-value">{displayValue}</h2>
    </div>
  );
}
