import { useState } from "react";
import ReceiptPreviewModal from "./expense/ReceiptPreviewModal";
import type { Expense } from "../types/expense";

export default function ExpenseItem({ expense }: { expense: Expense }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="expense-item">
      <div className="expense-left">
        <div className="expense-icon">{expense.icon || "💸"}</div>

        <div>
          <h4>{expense.name}</h4>
          <span>
            {expense.category} • {expense.date}
          </span>

          {/* 📄 VIEW RECEIPT */}
          {expense.receiptImage && (
            <button className="view-receipt-btn" onClick={() => setOpen(true)}>
              📄 View receipt
            </button>
          )}

          {expense.voiceText && (
            <p className="expense-voice-text">🎤 {expense.voiceText}</p>
          )}
        </div>
      </div>

      <div className="expense-amount">
        {expense.amount < 0 ? "-" : "+"}${Math.abs(expense.amount).toFixed(2)}
      </div>

      {/* MODAL */}
      {open && expense.receiptImage && (
        <ReceiptPreviewModal
          image={expense.receiptImage}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
