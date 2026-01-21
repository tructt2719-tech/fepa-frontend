import { useState } from "react";
import type { Expense } from "../../types/expense";

interface Props {
  onAdd: (expense: Expense) => void;
}
export default function ManualExpenseForm({ onAdd }: Props) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // console.log({
    //   amount,
    //   category,
    //   date,
    //   note,
    // });
    const numericAmount = Number(amount);

    if (!category || !date) return;

    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert("Amount must be greater than 0");
      return;
    }

    onAdd({
      id: Date.now(),
      name: category, // UI đang không có name riêng
      category,
      amount: numericAmount,
      date,
      note,
      icon: "🍔",
    });

    // reset form (optional)
    setAmount("");
    setCategory("");
    setDate("");
    setNote("");
    // Sau này backend thì POST API tại đây
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      {/* AMOUNT */}
      <div className="form-group">
        <label>Amount</label>
        <input
          type="number"
          min={0}
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      {/* CATEGORY */}
      <div className="form-group">
        <label>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select category</option>
          <option>Food & Dining</option>
          <option>Transportation</option>
          <option>Shopping</option>
          <option>Entertainment</option>
          <option>Bills & Utilities</option>
          <option>Healthcare</option>
          <option>Education</option>
          <option>Others</option>
        </select>
      </div>

      {/* DATE */}
      <div className="form-group">
        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* NOTE */}
      <div className="form-group">
        <label>Note (Optional)</label>
        <textarea
          placeholder="Add a note..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      {/* ACTION */}
      <div className="form-actions">
        <button type="submit" className="primary">
          Add Expense
        </button>
      </div>
    </form>
  );
}
