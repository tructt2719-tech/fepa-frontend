export default function DebtItemCard({ data }: any) {
  const percent = Math.min((data.paid / data.total) * 100, 100);

  return (
    <div className={`debt-card ${data.overdue ? "overdue" : ""}`}>
      <div className="debt-header">
        <div>
          <h3>{data.name}</h3>
          <span className="muted">{data.type}</span>
        </div>
        <div className="debt-right">
          <strong>${data.total - data.paid}</strong>
          <span className="muted">remaining</span>
        </div>
      </div>

      <div className="progress-bar">
        <div className="progress" style={{ width: `${percent}%` }} />
      </div>

      <div className="debt-stats">
        <div>
          <label>Monthly Payment</label>
          <strong>${data.monthly}</strong>
        </div>
        <div>
          <label>Interest Rate</label>
          <strong>{data.interest}%</strong>
        </div>
        <div>
          <label>Next Payment</label>
          <strong>{data.nextPayment}</strong>
        </div>
        <div>
          <label>Est. Payoff</label>
          <strong>{data.payoff}</strong>
        </div>
      </div>

      {data.overdue && (
        <div className="debt-alert">
          ⚠ Payment overdue! Please make a payment as soon as possible.
        </div>
      )}
    </div>
  );
}
