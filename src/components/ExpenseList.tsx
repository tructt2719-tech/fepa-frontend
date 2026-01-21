import ExpenseItem from "./ExpenseItem";
import type { Expense } from "../types/expense";

interface Props {
  expenses: Expense[];
}

export default function ExpenseList({ expenses }: Props) {
  return (
    <div>
      {expenses.map((e) => (
        <ExpenseItem key={e.id} expense={e} />
      ))}
    </div>
  );
}
