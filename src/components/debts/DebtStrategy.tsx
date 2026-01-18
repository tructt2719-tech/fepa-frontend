export default function DebtPayoffStrategy() {
  return (
    <div className="debt-strategy-card">
      <div className="strategy-header">
        <span className="strategy-icon">💡</span>
        <h3>Debt Payoff Strategy</h3>
      </div>

      <p className="strategy-desc">
        Based on your current debts, we recommend the{" "}
        <strong>Avalanche Method</strong> – pay minimum on all debts, then put
        extra payments toward the highest interest rate debt first.
      </p>

      {/* PRIORITY ORDER */}
      <div className="priority-box">
        <p className="priority-title">Priority Order:</p>

        <ul className="priority-list">
          <li>
            <span className="priority-badge">1</span>
            Credit Card – Chase (18.99% APR)
          </li>
          <li>
            <span className="priority-badge">2</span>
            Personal Loan (7.5% APR)
          </li>
          <li>
            <span className="priority-badge">3</span>
            Medical Bills (0% APR)
          </li>
        </ul>
      </div>
    </div>
  );
}
