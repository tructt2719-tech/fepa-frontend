type Budget = {
  id: number;
  name: string;
  icon: string;
  spent: number;
  limit: number;
};

export default function BudgetCard({ data }: { data: Budget }) {
  const percent = Math.round((data.spent / data.limit) * 100);
  const over = percent > 100;

  return (
    <div className="budget-card">
      <div className="budget-header">
        <div className="budget-icon">{data.icon}</div>
        <div>
          <h4>{data.name}</h4>
          <p>
            ${data.spent} / ${data.limit}
          </p>
        </div>
      </div>

      <div className="progress-bar">
        <div
          className={`progress ${over ? "danger" : ""}`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>

      <div className="budget-footer">
        <span className={over ? "danger-text" : ""}>{percent}% used</span>
        <span>${data.limit - data.spent} remaining</span>
      </div>

      {over && (
        <div className="budget-warning">
          ⚠ Over budget by ${data.spent - data.limit}
        </div>
      )}
    </div>
  );
}
