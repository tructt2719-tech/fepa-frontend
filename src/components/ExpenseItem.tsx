import { useState } from "react";
import type { Expense } from "../types/expense";
import ReceiptPreviewModal from "./expense/ReceiptPreviewModal";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

// Khởi tạo SweetAlert cho React
const MySwal = withReactContent(Swal);

const categoryIcon: Record<string, string> = {
  "Food & Dining": "🍔",
  Transportation: "🚗",
  Shopping: "🛍️",
  Entertainment: "🎬",
  "Bills & Utilities": "💡",
  Healthcare: "🩺",
  Education: "🎓",
  Others: "📦",
};

interface Props {
  expense: Expense;
  onRefresh: () => void;
}

export default function ExpenseItem({ expense, onRefresh }: Props) {
  const [showNote, setShowNote] = useState(false);
  const [openReceipt, setOpenReceipt] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const displayIcon = expense.icon || categoryIcon[expense.category] || "💸";

  const amountSign = "-"; // Luôn là dấu trừ
  const amountValue = Math.abs(expense.amount).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  const amountColor = "#ef4444"; 

  // Hàm xử lý xoá với SweetAlert2
const handleDelete = async () => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: `Delete "${expense.name || expense.category}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    setIsDeleting(true);
    const toastId = toast.loading("Deleting...");

    try {
      const res = await fetch(`http://localhost:8000/api/expenses/${expense.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Kiểm tra status code từ FastAPI
      if (res.ok) {
        toast.success("Deleted successfully!", { id: toastId });
        
        // Quan trọng: Phải chờ onRefresh thực thi xong
        await onRefresh(); 
      } else {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Server rejected deletion");
      }
    } catch (err: any) {
      console.error("Delete error:", err);
      toast.error(`Error: ${err.message}`, { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

return (
    <>
      <div
        className="expense-item"
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "16px",
          padding: "16px",
          borderBottom: "1px solid var(--border-color, #e5e7eb)",
          transition: "all 0.2s",
          background: "var(--bg-item, white)",
          position: "relative",
          borderRadius: "12px",
          marginBottom: "4px"
        }}
      >
        {/* Icon */}
        <div className="expense-icon" style={{ fontSize: "2.2rem", lineHeight: 1, flexShrink: 0 }}>
          {displayIcon}
        </div>

        {/* Main content */}
        <div className="expense-content" style={{ flex: 1 }}>
          <div
            className="expense-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center", // Căn giữa theo chiều dọc để đẹp hơn
              marginBottom: "4px",
              paddingRight: "40px" // Tạo khoảng trống để không đè lên nút delete
            }}
          >
            <h4
              style={{
                margin: 0,
                fontSize: "1.1rem",
                fontWeight: 600,
                color: "var(--text-primary, #111827)",
                flex: 1, // Chiếm hết không gian trống để đẩy tiền sang phải
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis" // Nếu tên quá dài sẽ hiện dấu ...
              }}
            >
              {expense.name || expense.category || "Untitled"}
            </h4>

            <div
              style={{
                fontWeight: "bold",
                fontSize: "1.18rem",
                color: amountColor,
                marginLeft: "10px", // Khoảng cách nhỏ giữa tên và tiền
                whiteSpace: "nowrap" // Giữ tiền trên 1 dòng
              }}
            >
              {amountSign}${amountValue}
            </div>
          </div>

          <div
            style={{
              fontSize: "0.85rem",
              color: "var(--text-secondary, #6b7280)",
              marginBottom: "8px",
            }}
          >
            <strong>Date:</strong> {expense.date}
          </div>

          {/* ... (Phần note và receipt giữ nguyên) ... */}
          {expense.note && (
            <div className="expense-note-wrapper" style={{ marginBottom: "8px" }}>
              <button 
                onClick={() => setShowNote(!showNote)} 
                style={{ fontSize: "0.8rem", color: "#3b82f6", background: "none", border: "none", cursor: "pointer", fontWeight: 500, padding: 0 }}
              >
                {showNote ? "✕ Hide note" : "👁 View note"}
              </button>
              {showNote && (
                <p style={{ marginTop: "8px", fontSize: "0.9rem", color: "#4b5563", background: "#f9fafb", padding: "12px", borderRadius: "8px", whiteSpace: "pre-wrap", border: "1px solid #f3f4f6" }}>
                  {expense.note}
                </p>
              )}
            </div>
          )}

          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "4px" }}>
            {expense.receiptImage && (
              <button onClick={() => setOpenReceipt(true)} style={{ fontSize: "0.75rem", color: "#4f46e5", background: "#eef2ff", border: "1px solid #e0e7ff", padding: "4px 10px", borderRadius: "6px", cursor: "pointer", fontWeight: 500 }}>
                📄 Receipt
              </button>
            )}
            {expense.voiceText && (
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#6b7280", fontStyle: "italic" }}>
                🎤 {expense.voiceText}
              </p>
            )}
          </div>
        </div>

        {/* NÚT XÓA - Đã bỏ background và làm gọn */}
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          style={{
            position: "absolute",
            top: "14px",
            right: "14px",
            background: "transparent", // XÓA BACKGROUND Ở ĐÂY
            border: "none",
            color: "#ef4444",
            cursor: "pointer",
            fontSize: "1.1rem",
            padding: "4px",
            borderRadius: "8px",
            opacity: isDeleting ? 0.5 : 0.7, // Mờ nhẹ mặc định để tinh tế hơn
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          title="Delete expense"
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "1"; // Hiện rõ khi hover
            e.currentTarget.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "0.7";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          {isDeleting ? "..." : "🗑️"}
        </button>
      </div>

      {openReceipt && expense.receiptImage && (
        <ReceiptPreviewModal image={expense.receiptImage} onClose={() => setOpenReceipt(false)} />
      )}
    </>
);
}