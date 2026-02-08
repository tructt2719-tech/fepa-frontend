import { useState } from "react";
import "./add-debt-modal.css";

interface Props {
  onClose: () => void;
  onCreated: () => void; // gọi lại fetch debts
  currentUserId: number;
}

export default function AddDebtModal({
  onClose,
  onCreated,
  currentUserId,
}: Props) {
  const [form, setForm] = useState({
    name: "",
    type: "",
    total: "",
    paid: "",
    monthly: "",
    interest: "",
    nextPayment: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.type || !form.total || !form.monthly) {
      alert("Please enter the full Name, Type, Total, and Monthly.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/debts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userID: currentUserId,
          name: form.name,
          type: form.type,
          total: Number(form.total),
          paid: Number(form.paid) || 0,
          monthly: Number(form.monthly),
          interest: Number(form.interest || 0),
          nextPayment: form.nextPayment || null,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Server error");
      }

      onCreated(); // reload list debt
      onClose(); // đóng modal
    } catch (err: any) {
      console.error("Create debt error:", err);
      alert(err.message || "Unable to create debt");
    } finally {
      setLoading(false);
    }
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
            <input
              name="total"
              type="number"
              min={0}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e") {
                  e.preventDefault();
                }
              }}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Paid Amount</label>
            <input
              name="paid"
              type="number"
              min={0}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e") {
                  e.preventDefault();
                }
              }}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Monthly Payment</label>
            <input
              name="monthly"
              type="number"
              min={0}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e") {
                  e.preventDefault();
                }
              }}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Interest Rate (%)</label>
            <input
              name="interest"
              type="number"
              min={0}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e") {
                  e.preventDefault();
                }
              }}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Next Payment Due</label>
          <input name="nextPayment" type="date" onChange={handleChange} />
        </div>

        <button
          className="btn-primary full"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Saving..." : "Add Debt"}
        </button>
      </div>
    </div>
  );
}
