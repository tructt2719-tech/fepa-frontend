import ExpenseItem from "./ExpenseItem";
import type { Expense } from "../types/expense";

interface Props {
  expenses: Expense[];
  onRefresh: () => void; // Thêm prop này để nhận từ Expenses.tsx
}

export default function ExpenseList({ expenses, onRefresh }: Props) {
  return (
    <div className="expense-list" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {expenses.map((e) => (
        <ExpenseItem 
          key={e.id} 
          expense={e} 
          onRefresh={onRefresh} // Truyền tiếp xuống ExpenseItem
        />
      ))}
    </div>
  );
}