export default function BudgetPrediction() {
  return (
    <div className="prediction-card">
      <h3>AI Expense Prediction</h3>
      <p>
        Based on your spending patterns, you're predicted to spend{" "}
        <strong>$4,350</strong> this month. This is{" "}
        <span className="success-text">$150 less</span> than last month!
      </p>

      <div className="prediction-grid">
        <div className="prediction-box">
          <p>Predicted Food Spending</p>
          <strong>$1,380</strong>
        </div>

        <div className="prediction-box">
          <p>Predicted Transport</p>
          <strong>$470</strong>
        </div>
      </div>
    </div>
  );
}
