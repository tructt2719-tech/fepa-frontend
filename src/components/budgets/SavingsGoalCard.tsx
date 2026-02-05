import React, { useState } from "react";
import toast from "react-hot-toast"; // Giả sử bạn đã cài react-hot-toast

interface Goal {
  id: number;
  goal_name: string;
  currentAmount: number;
  targetAmount: number;
  totalSpent: number;
  deadline: string;
}

interface Props {
  data: Goal;
  onUpdate: () => void; // Hàm này sẽ gọi fetchData() ở trang cha
}

export default function SavingsGoalCard({ data, onUpdate }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);

  // 1. Tính toán
  const actualSaved = (data.currentAmount || 0) - (data.totalSpent || 0);
  const percent =
    data.targetAmount > 0
      ? Math.max(0, Math.round((actualSaved / data.targetAmount) * 100))
      : 0;

  const today = new Date();
  const targetDate = new Date(data.deadline);
  const isOverdue = today > targetDate;
  const isSuccess = actualSaved >= data.targetAmount;
  const statusColor = isOverdue && !isSuccess ? "#ef4444" : "#10b981";

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // 2. Xử lý xóa với modal đẹp
  const handleDelete = () => {
    toast(
      (t) => (
        <div style={{ textAlign: "center", padding: "12px 20px" }}>
          <p
            style={{ margin: "0 0 16px", fontSize: "1.1rem", fontWeight: 600 }}
          >
            Xóa mục tiêu "{data.goal_name}"?
          </p>
          <p
            style={{
              margin: "0 0 20px",
              color: "#94a3b8",
              fontSize: "0.95rem",
            }}
          >
            Hành động này không thể hoàn tác.
          </p>
          <div
            style={{ display: "flex", gap: "12px", justifyContent: "center" }}
          >
            <button
              onClick={() => toast.dismiss(t.id)}
              style={{
                padding: "10px 20px",
                background: "#334155",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                minWidth: "80px",
              }}
            >
              Hủy
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                await confirmDelete();
              }}
              style={{
                padding: "10px 20px",
                background: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                minWidth: "80px",
                fontWeight: 600,
              }}
            >
              Xóa
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity, // Không tự đóng
        position: "top-center",
        style: {
          background: "#1e293b",
          color: "white",
          borderRadius: "12px",
          border: "1px solid #334155",
          padding: "0",
          maxWidth: "360px",
        },
      },
    );
  };

  const confirmDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);

    const toastId = toast.loading("Đang xóa mục tiêu...");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/goals/${data.id}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        toast.success("Đã xóa mục tiêu thành công!", { id: toastId });
        onUpdate(); // Gọi lại fetchData() ở trang Budgets để update danh sách ngay
      } else {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || "Lỗi server");
      }
    } catch (err: any) {
      console.error("Lỗi xóa:", err);
      toast.error(err.message || "Không thể xóa mục tiêu. Vui lòng thử lại.", {
        id: toastId,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="goal-card"
      style={{
        borderLeft: `6px solid ${statusColor}`,
        transition: "all 0.3s ease",
        padding: "20px",
        opacity: isDeleting ? 0.6 : 1,
        pointerEvents: isDeleting ? "none" : "auto",
      }}
    >
      <div className="goal-header">
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h4 style={{ margin: 0, fontSize: "1.1rem" }}>{data.goal_name}</h4>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              style={{
                background: "none",
                border: "none",
                cursor: isDeleting ? "not-allowed" : "pointer",
                opacity: isDeleting ? 0.4 : 0.7,
                color: "white",
                fontSize: "1.2rem",
                padding: "4px",
              }}
            >
              ✕
            </button>
          </div>
          <p
            style={{
              color: isOverdue ? "#ef4444" : "#94a3b8",
              fontSize: "0.8rem",
              margin: "4px 0",
            }}
          >
            {isOverdue
              ? "⚠️ Quá hạn mục tiêu"
              : `⏰ Còn ${diffDays > 0 ? diffDays : 0} ngày (Hạn: ${data.deadline})`}
          </p>
        </div>
      </div>

      <div className="goal-values" style={{ marginTop: "15px" }}>
        <div style={{ fontSize: "0.9rem" }}>
          Saved:{" "}
          <b style={{ color: statusColor }}>${actualSaved.toLocaleString()}</b>
          <span
            style={{ fontSize: "0.75rem", color: "#94a3b8", marginLeft: "5px" }}
          >
            (Gốc: ${data.currentAmount} - Chi: ${data.totalSpent})
          </span>
        </div>
        <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
          Target: ${data.targetAmount.toLocaleString()}
        </div>
      </div>

      <div
        className="progress-bar"
        style={{
          height: "8px",
          backgroundColor: "#334155",
          borderRadius: "4px",
          margin: "12px 0",
        }}
      >
        <div
          className="progress"
          style={{
            width: `${Math.min(percent, 100)}%`,
            height: "100%",
            backgroundColor: statusColor,
            borderRadius: "4px",
            boxShadow: `0 0 8px ${statusColor}66`,
            transition: "width 1s ease",
          }}
        />
      </div>

      <div
        className="goal-footer"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            color: statusColor,
            fontWeight: "bold",
            fontSize: "0.85rem",
            backgroundColor: `${statusColor}15`,
            padding: "2px 8px",
            borderRadius: "4px",
          }}
        >
          {percent}% {isSuccess ? "Hoàn thành" : ""}
        </span>
        <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
          {isSuccess
            ? "✨ Xuất sắc!"
            : `Còn thiếu: $${Math.max(0, data.targetAmount - actualSaved).toLocaleString()}`}
        </span>
      </div>
    </div>
  );
}
