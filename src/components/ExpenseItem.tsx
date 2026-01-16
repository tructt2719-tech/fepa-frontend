import type { Expense } from "../data/mockExpenses";

const categoryIcon: Record<string, string> = {
  "Food & Dining": "🍔",
  Transportation: "🚗",
  Shopping: "🛍️",
  Entertainment: "🎬",
  "Bills & Utilities": "💡",
  Healthcare: "🩺",
  Education: "🎓",
  Others: "📦",
};

export default function ExpenseItem({ expense }: { expense: Expense }) {
  return (
    <div className="expense-item">
      <div className="expense-left">
        <div className="expense-icon">
          {categoryIcon[expense.category] || "💸"}
        </div>

        <div>
          <h4>{expense.title}</h4>
          <span>
            {expense.category} • {expense.date} • {expense.time}
          </span>
        </div>
      </div>

      <div className="expense-amount">
        -${Math.abs(expense.amount).toFixed(2)}
      </div>
    </div>
  );
}
