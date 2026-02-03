import { useState } from "react";
import ExpenseMethodTabs from "./ExpenseMethodTabs";
import ManualExpenseForm from "./ManualExpenseForm";
import ScanReceipt from "./ScanReceipt";
import VoiceExpense from "./VoiceExpense";
import type { Expense } from "../../types/expense";

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (expense: Expense) => void;
}

export default function AddExpenseModal({ open, onClose, onAdd }: Props) {
  const [method, setMethod] = useState<"manual" | "scan" | "voice">("manual");

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h2>Add New Expense</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <ExpenseMethodTabs method={method} onChange={setMethod} />

        {/* BODY */}
        <div className="modal-body">
          {(() => {
            switch (method) {
              case "manual":
                return (
                  <ManualExpenseForm
                    key="manual"
                    onAdd={(expense) => {
                      onAdd(expense);
                      onClose();
                    }}
                  />
                );

              case "scan":
                return (
                  <ScanReceipt
                    key="scan"
                    onBack={() => setMethod("manual")}
                    onAdd={(expense: Expense) => {
                      onAdd(expense);
                      onClose();
                    }}
                  />
                );

              case "voice":
                return (
                  <VoiceExpense
                    key="voice"
                    onAdd={(expense: Expense) => {
                      onAdd(expense);
                      onClose();
                    }}
                    onBack={() => setMethod("manual")}
                  />
                );

              default:
                return null;
            }
          })()}
        </div>
      </div>
    </div>
  );
}
