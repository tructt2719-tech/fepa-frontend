interface Debt {
  id: number;
  name: string;
  type: string;
  total: number;
  paid: number;
  interest: number;
  overdue: number | boolean;
}

interface Props {
  debts?: Debt[]; // 👈 optional
}

export default function DebtPayoffStrategy({ debts = [] }: Props) {
  const activeDebts = debts.filter((d) => d.paid < d.total);

  if (activeDebts.length === 0) {
    return (
      <div className="debt-strategy-card">
        <div className="strategy-header">
          <span className="strategy-icon">🎉</span>
          <h3>Debt Payoff Strategy</h3>
        </div>
        <p className="strategy-desc">You are currently debt-free. Great job!</p>
      </div>
    );
  }

  const useAvalanche = activeDebts.some((d) => d.interest > 0);

  const sortedDebts = [...activeDebts].sort((a, b) => {
    if (a.overdue && !b.overdue) return -1;
    if (!a.overdue && b.overdue) return 1;

    return useAvalanche
      ? b.interest - a.interest
      : a.total - a.paid - (b.total - b.paid);
  });

  return (
    <div className="debt-strategy-card">
      <div className="strategy-header">
        <span className="strategy-icon">💡</span>
        <h3>Debt Payoff Strategy</h3>
      </div>

      <p className="strategy-desc">
        We recommend the{" "}
        <strong>{useAvalanche ? "Avalanche Method" : "Snowball Method"}</strong>
        .
      </p>

      <div className="priority-box">
        <p className="priority-title">Priority Order:</p>
        <ul className="priority-list">
          {sortedDebts.map((d, idx) => (
            <li key={d.id}>
              <span className="priority-badge">{idx + 1}</span>
              <span className="priority-name">{d.name}</span>
              {Boolean(d.overdue) && (
                <span style={{ color: "#ef4444" }}> ⚠ overdue</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
