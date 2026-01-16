import { useState } from "react";
import ExpenseMethodTabs from "./ExpenseMethodTabs";
import ManualExpenseForm from "./ManualExpenseForm";
import ScanReceipt from "./ScanReceipt";
import VoiceExpense from "./VoiceExpense";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AddExpenseModal({ open, onClose }: Props) {
  const [method, setMethod] = useState<
    "manual" | "scan" | "voice"
  >("manual");

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h2>Add New Expense</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <ExpenseMethodTabs
          method={method}
          onChange={setMethod}
        />

        {method === "manual" && <ManualExpenseForm />}
        {method === "scan" && <ScanReceipt />}
        {method === "voice" && <VoiceExpense />}
      </div>
    </div>
  );
}
