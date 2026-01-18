type Goal = {
  name: string;
  icon: string;
  current: number;
  target: number;
  daysLeft: number;
};

export default function SavingsGoalCard({ data }: { data: Goal }) {
  const percent = Math.round((data.current / data.target) * 100);

  return (
    <div className="goal-card">
      <div className="goal-header">
        <div className="goal-icon">{data.icon}</div>
        <div>
          <h4>{data.name}</h4>
          <p>{data.daysLeft} days remaining</p>
        </div>
      </div>

      <div className="goal-values">
        <span>${data.current}</span>
        <span>${data.target}</span>
      </div>

      <div className="progress-bar">
        <div
          className="progress"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="goal-footer">
        <span className="success-text">{percent}% complete</span>
        <span>${data.target - data.current} to go</span>
      </div>
    </div>
  );
}
