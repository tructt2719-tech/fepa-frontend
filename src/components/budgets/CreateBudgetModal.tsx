import { useState } from "react";

type Props = {
  onClose: () => void;
  onCreate: (budget: any) => void;
};

export default function CreateBudgetModal({ onClose, onCreate }: Props) {
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");

  const handleSubmit = () => {
    if (!category || !limit) return;

    onCreate({
      id: Date.now().toString(),
      name: category,
      icon: "💰",
      spent: 0,
      limit: Number(limit),
      color: "blue",
    });

    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Create New Budget</h2>

        <label>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select category</option>
          <option>Food & Dining</option>
          <option>Transportation</option>
          <option>Entertainment</option>
          <option>Shopping</option>
          <option>Bills & Utilities</option>
        </select>

        <label>Monthly Limit</label>
        <input
          type="number"
          placeholder="0.00"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
        />

        <button className="btn-primary" onClick={handleSubmit}>
          Create Budget
        </button>

        <button className="btn-text" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
}
