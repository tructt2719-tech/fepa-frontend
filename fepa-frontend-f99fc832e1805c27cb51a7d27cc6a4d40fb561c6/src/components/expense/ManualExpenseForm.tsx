import { useState } from "react";
import toast from "react-hot-toast";
import type { Expense } from "../../types/expense";
import { useExpenses } from "../../context/ExpenseContext";

interface Props {
  onAdd: (expense: Expense) => void;
  currentUserId: number;
  initialData?: any;
}

const COMMON_CATEGORIES = [
  { value: "Food & Dining", label: "Food & Dining", icon: "🍔" },
  { value: "Transportation", label: "Transportation", icon: "🚗" },
  { value: "Shopping", label: "Shopping", icon: "🛍️" },
  { value: "Entertainment", label: "Entertainment", icon: "🎬" },
  { value: "Bills & Utilities", label: "Bills & Utilities", icon: "💡" },
  { value: "Healthcare", label: "Healthcare", icon: "🩺" },
  { value: "Education", label: "Education", icon: "🎓" },
  { value: "Others", label: "Others", icon: "📦" },
];

function getIconForCategory(category: string): string {
  const found = COMMON_CATEGORIES.find((c) => c.value === category);
  return found?.icon || "📦";
}

export default function ManualExpenseForm({
  onAdd,
  currentUserId,
  initialData,
}: Props) {
  const { dispatch } = useExpenses();
  const [amount, setAmount] = useState(initialData?.amount?.toString() || "");
  const [category, setCategory] = useState(initialData?.category || "Shopping");
  const [date, setDate] = useState(
    initialData?.date || new Date().toISOString().split("T")[0],
  );
  const [note, setNote] = useState(initialData?.note || "");
  const [saveForGoal, setSaveForGoal] = useState(false);
  const [savedAmount, setSavedAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNumericChange = (val: string, setter: (v: string) => void) => {
    const cleanVal = val.replace(/[^0-9.]/g, "");
    setter(cleanVal);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error("Please enter a valid amount (> 0)");
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      toast.error("User session not found. Please log in again.");
      return;
    }

    const user = JSON.parse(storedUser);
    const userIdNumber = Number(user?.id);
    const finalIcon = getIconForCategory(category);

    setIsSubmitting(true);
    const toastId = toast.loading("Saving expense...");

    try {
      const res = await fetch("http://localhost:8000/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userID: userIdNumber,
          amount: numericAmount,
          category,
          date,
          note: note.trim() || null,
          icon: finalIcon,
        }),
      });

      if (!res.ok) throw new Error("Server error occurred");
      const data = await res.json();

      const numericSaved = Number(savedAmount || amount);
      if (saveForGoal && numericSaved > 0) {
        await fetch(
          `http://localhost:8000/api/goals/${userIdNumber}/deposit-all`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: numericSaved, expense_date: date }),
          },
        );
        toast.success(`Contribution of $${numericSaved} added!`);
      }

      onAdd({
        ...data,
        userID: userIdNumber,
        amount: numericAmount,
        category,
        date,
        note: note.trim() || undefined,
        icon: finalIcon,
        createdAt: new Date().toISOString(),
      });

      dispatch({
        type: "ADD_EXPENSE",
        payload: {
        id: data.id,
        userID: userIdNumber,
        amount: numericAmount,
        category,
        date,
        note: note.trim() || undefined,
        icon: finalIcon,
        createdAt: new Date().toISOString(),
        },
      });

      setAmount("");
      setSavedAmount("");
      setSaveForGoal(false);
      setNote("");
      toast.success("Expense saved successfully!", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Failed to save", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="expense-form-wrapper" style={{ padding: "1rem" }}>
      <style>{`
        :root {
          --expense-input-bg: #ffffff;
          --expense-input-border: #e2e8f0;
          --expense-text: #1e293b;
          --expense-subtext: #64748b;
          --expense-card-bg: #f8fafc;
        }
        @media (prefers-color-scheme: dark) {
          :root {
            --expense-input-bg: #0f172a;
            --expense-input-border: #334155;
            --expense-text: #f8fafc;
            --expense-subtext: #94a3b8;
            --expense-card-bg: #1e293b;
          }
        }
        .switch { position: relative; display: inline-block; width: 40px; height: 20px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { 
          position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; 
          background-color: #cbd5e1; transition: .4s; border-radius: 20px; 
        }
        .slider:before { 
          position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px; 
          background-color: white; transition: .4s; border-radius: 50%; 
        }
        input:checked + .slider { background-color: #3b82f6; }
        input:checked + .slider:before { transform: translateX(20px); }
      `}</style>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "1.2rem",
            color: "var(--expense-text)",
          }}
        >
          Add New Expense
        </h3>

        <div>
          <label style={labelStyle}>Amount ($)</label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={(e) => handleNumericChange(e.target.value, setAmount)}
            disabled={isSubmitting}
            required
            style={inputBaseStyle}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
          }}
        >
          <div>
            <label style={labelStyle}>Category</label>
            <div style={{ position: "relative" }}>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isSubmitting}
                style={{ ...inputBaseStyle, paddingLeft: "2.2rem" }}
              >
                {COMMON_CATEGORIES.map((cat) => (
                  <option
                    key={cat.value}
                    value={cat.value}
                    style={{ background: "var(--expense-input-bg)" }}
                  >
                    {cat.label}
                  </option>
                ))}
              </select>
              <span
                style={{
                  position: "absolute",
                  left: "0.7rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                {getIconForCategory(category)}
              </span>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={isSubmitting}
              style={inputBaseStyle}
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Notes</label>
          <textarea
            placeholder="Description..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={isSubmitting}
            style={{ ...inputBaseStyle, minHeight: "40px", resize: "none" }}
          />
        </div>

        <div
          style={{
            background: "var(--expense-card-bg)",
            padding: "0.8rem",
            borderRadius: "10px",
            border: "1px solid var(--expense-input-border)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontSize: "0.9rem",
                fontWeight: 500,
                color: "var(--expense-text)",
              }}
            >
              Save for Goal
            </span>
            <label className="switch">
              <input
                type="checkbox"
                checked={saveForGoal}
                onChange={(e) => setSaveForGoal(e.target.checked)}
                disabled={isSubmitting}
              />
              <span className="slider"></span>
            </label>
          </div>

          {saveForGoal && (
            <div
              style={{
                marginTop: "0.8rem",
                borderTop: "1px solid var(--expense-input-border)",
                paddingTop: "0.8rem",
              }}
            >
              <input
                type="text"
                placeholder={`Default: $${amount || "0.00"}`}
                value={savedAmount}
                onChange={(e) =>
                  handleNumericChange(e.target.value, setSavedAmount)
                }
                disabled={isSubmitting}
                style={{ ...inputBaseStyle, fontSize: "0.9rem" }}
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            background: "#3b82f6",
            color: "white",
            padding: "0.8rem",
            borderRadius: "8px",
            border: "none",
            fontWeight: 600,
            cursor: isSubmitting ? "not-allowed" : "pointer",
            opacity: isSubmitting ? 0.7 : 1,
          }}
        >
          {isSubmitting ? "Processing..." : "Confirm Expense"}
        </button>
      </form>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.8rem",
  fontWeight: 500,
  color: "var(--expense-subtext)",
  marginBottom: "4px",
};

const inputBaseStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.6rem",
  borderRadius: "6px",
  border: "1px solid var(--expense-input-border)",
  background: "var(--expense-input-bg)",
  color: "var(--expense-text)",
  fontSize: "0.95rem",
  outline: "none",
};
