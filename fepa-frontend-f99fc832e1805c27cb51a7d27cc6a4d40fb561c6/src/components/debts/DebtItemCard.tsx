import { useState } from "react";

interface Props {
  data: any;
  onDelete: (id: number) => void; // callback reload list
}

export default function DebtItemCard({ data, onDelete }: Props) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const total = Number(data.total) || 0;
  const paid = Number(data.paid) || 0;
  const remaining = Math.max(total - paid, 0);

  const percent =
    total > 0 ? Math.min(Math.round((paid / total) * 100), 100) : 0;

  const isOverdue = Boolean(data.overdue);
  const isPaidOff = Boolean(data.payoff);

  let status: "active" | "overdue" | "paid";
  if (isPaidOff) status = "paid";
  else if (isOverdue) status = "overdue";
  else status = "active";

  /* ================= DELETE ================= */

  const handleDelete = async () => {
    setLoading(true);

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/debts/${data.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        onDelete(data.id); // 👈 xoá khỏi state ngay
        setShowDeleteConfirm(false);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={`debt-card ${isOverdue ? "overdue" : ""}`}>
        {/* HEADER */}
        <div className="debt-header">
          <div>
            <h3>{data.name}</h3>
            <span className="muted">{data.type}</span>
          </div>

          <div className="debt-right">
            <strong>${remaining.toLocaleString()}</strong>
            <span className="muted"> remaining</span>
          </div>
        </div>

        {/* STATUS */}
        <div className="debt-status-row">
          <span
            className={`debt-status ${status}`}
            style={{ "--p": `${percent}%` } as React.CSSProperties}
          >
            <span className="status-dot" />
            <span className="status-text">
              {status === "paid" && "✅ Paid off"}
              {status === "overdue" && "⚠ Overdue"}
              {status === "active" && "🟡 Active"}
            </span>
          </span>

          <span className="debt-percent">{percent}%</span>
        </div>

        <div className="progress-bar">
          <div
            className={`progress ${status}`}
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* STATS */}
        <div className="debt-stats">
          <div>
            <label>Monthly Payment</label>
            <strong>
              {" "}
              ${data.monthly?.toLocaleString?.() ?? data.monthly}
            </strong>
          </div>

          <div>
            <label>Interest Rate</label>
            <strong> {data.interest ?? 0}%</strong>
          </div>

          <div>
            <label>Next Payment</label>
            <strong>
              {isPaidOff ? "—" : data.nextPayment || "Not scheduled"}
            </strong>
          </div>

          <div>
            <label>Payoff Date</label>
            <strong>{data.payoff || "—"}</strong>
          </div>
        </div>

        {/* ALERTS */}
        {isOverdue && !isPaidOff && (
          <div className="debt-alert">
            ⚠ Payment overdue! Please make a payment as soon as possible.
          </div>
        )}

        {isPaidOff && (
          <div className="debt-success">✅ Debt fully paid off</div>
        )}

        {/* ACTIONS */}
        <div className="debt-actions">
          <button
            className="btn-delete"
            onClick={() => setShowDeleteConfirm(true)}
          >
            🗑 Delete
          </button>
        </div>
      </div>

      {/* ================= DELETE MODAL ================= */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Delete debt?</h3>
            <p>
              Are you sure you want to delete <strong>{data.name}</strong>? This
              action cannot be undone.
            </p>

            <div className="modal-actions">
              <button
                className="btn-danger"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
              <button
                className="btn-cancel"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
