import { useState } from "react";
import "./add-debt-modal.css";

interface Props {
  onClose: () => void;
  onAdd: (data: any) => void;
}

export default function AddDebtModal({ onClose, onAdd }: Props) {
  const [form, setForm] = useState({
    name: "",
    type: "",
    total: "",
    paid: "",
    monthly: "",
    interest: "",
    nextPayment: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onAdd({
      ...form,
      total: Number(form.total),
      paid: Number(form.paid),
      monthly: Number(form.monthly),
      interest: Number(form.interest),
    });
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal debt-modal">
        <div className="modal-header">
          <h2>Add New Debt</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="form-group">
          <label>Debt Name</label>
          <input
            name="name"
            placeholder="e.g., Credit Card - Bank Name"
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Debt Type</label>
          <select name="type" onChange={handleChange}>
            <option value="">Select type</option>
            <option>Credit Card</option>
            <option>Personal Loan</option>
            <option>Medical</option>
            <option>Mortgage</option>
          </select>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label>Total Amount</label>
            <input name="total" type="number" min={0} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Paid Amount</label>
            <input name="paid" type="number" min={0} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Monthly Payment</label>
            <input
              name="monthly"
              type="number"
              min={0}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Interest Rate (%)</label>
            <input
              name="interest"
              type="number"
              min={0}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Next Payment Due</label>
          <input name="nextPayment" type="date" onChange={handleChange} />
        </div>

        <button className="btn-primary full" onClick={handleSubmit}>
          Add Debt
        </button>
      </div>
    </div>
  );
}
